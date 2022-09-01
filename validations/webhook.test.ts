import { AddKycParams, FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import {
  CryptoType,
  FiatType,
  KycSchema,
  KycStatus,
  Network,
  TransferStatus,
  TransferType,
} from '@fiatconnect/fiatconnect-types'
import { ethers } from 'ethers'
import { config } from '../src/config'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'
import { MOCK_KYC } from '../src/mock-data/kyc'
import { MOCK_QUOTE } from '../src/mock-data/quote'
import { expect, use } from 'chai'
import { chaiPlugin } from 'api-contract-validator'
import chaiAsPromised from 'chai-as-promised'
import { randomUUID } from 'crypto'
import path from 'path'
import axios from 'axios'
import {
  WEBHOOK_RECIPIENT_BASE_URL,
  WEBHOOK_RECIPIENT_HISTORY_ENDPOINT,
} from '../src/constants'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))
use(chaiAsPromised)

interface WebhookTransferEventRecord {
  provider: string // the field in the body sent by the provider
  event_id: string
  address: string
  status: TransferStatus
  transfer_type: TransferType
  fiat_type: FiatType
  crypto_type: CryptoType
  amount_provided: string
  amount_received: string
  fee: string
  fiat_account_id: string
  transfer_id: string
  transfer_address: string
  event_timestamp: string
  timestamp: string
  provider_id: string // the URL path param, valora defined
}

interface WebhookKycStatusEventRecord {
  event_id: string
  provider: string // the field in the body sent by the provider
  address: string
  kyc_schema: string
  kyc_status: string
  event_timestamp: string
  timestamp: string
  provider_id: string // the URL path param, valora defined
}

async function validateTransferWebhook(
  params: { transferId: string; address: string; status: TransferStatus },
  retries: number,
): Promise<void> {
  const { transferId, address, status } = params
  if (retries < 0) {
    throw new Error('Webhook event could not be found')
  }
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const client = axios.create({
    baseURL: WEBHOOK_RECIPIENT_BASE_URL,
    validateStatus: () => true,
  })
  const response = await client.get(
    `${WEBHOOK_RECIPIENT_HISTORY_ENDPOINT}/${config.providerId}`,
  )
  if (response.status !== 200) {
    console.debug(
      `Error fetching webhook history. ${retries} retries left: ${JSON.stringify(
        response.data,
      )}`,
    )
    return validateTransferWebhook(params, retries - 1)
  }
  const coorespondingWebhook = response.data.transferHistory.find(
    (transfer: WebhookTransferEventRecord) =>
      transfer.address === address &&
      transfer.status === status &&
      transfer.transfer_id === transferId,
  )
  if (!coorespondingWebhook) {
    console.debug(`Could not find matching webhook. ${retries} retries left`)
    return validateTransferWebhook(params, retries - 1)
  }
}

async function validateKycWebhook(
  params: { address: string; kycStatus: KycStatus; kycSchema: KycSchema },
  retries: number,
): Promise<void> {
  const { kycSchema, address, kycStatus } = params
  if (retries < 0) {
    throw new Error('Webhook event could not be found')
  }
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const client = axios.create({
    baseURL: WEBHOOK_RECIPIENT_BASE_URL,
    validateStatus: () => true,
  })
  const response = await client.get(
    `${WEBHOOK_RECIPIENT_HISTORY_ENDPOINT}/${config.providerId}`,
  )
  if (response.status !== 200) {
    console.debug(
      `Error fetching webhook history. ${retries} retries left: ${JSON.stringify(
        response.data,
      )}`,
    )
    return validateKycWebhook(params, retries - 1)
  }
  const coorespondingWebhook = response.data.kycHistory.find(
    (transfer: WebhookKycStatusEventRecord) =>
      transfer.address === address &&
      transfer.kyc_status === kycStatus &&
      transfer.kyc_schema === kycSchema,
  )
  if (!coorespondingWebhook) {
    console.debug(`Could not find matching webhook. ${retries} retries left`)
    return validateKycWebhook(params, retries - 1)
  }
}

describe('webhooks', () => {
  jest.setTimeout(15000)
  const mockAccountData =
    MOCK_FIAT_ACCOUNTS[
      config.fiatAccountMock as keyof typeof MOCK_FIAT_ACCOUNTS
    ]

  const mockKYCInfo: AddKycParams<KycSchema> =
    MOCK_KYC[config.kycMock as keyof typeof MOCK_KYC]

  let wallet: ethers.Wallet
  let fiatConnectClient: FiatConnectClient
  beforeEach(() => {
    wallet = ethers.Wallet.createRandom()

    fiatConnectClient = new FiatConnectClient(
      {
        baseUrl: config.baseUrl,
        network: Network.Alfajores,
        accountAddress: wallet.address,
        apiKey: config.clientApiKey,
      },
      (message: string) => wallet.signMessage(message),
    )
  })

  if (config.quoteInMock) {
    describe('transfer in', () => {
      it('sends webhooks for transfer in requests', async () => {
        expect(
          !!(config.clientApiKey && config.providerId),
          'clientApiKey & providerId are required parameters for webhook validation',
        ).to.be.true
        // Setup
        const quoteInParams = {
          ...MOCK_QUOTE[config.quoteInMock],
          address: wallet.address,
        }
        const loginResult = await fiatConnectClient.login()
        expect(loginResult.isOk).to.be.true

        const quoteInResponse = await fiatConnectClient.createQuoteIn(
          quoteInParams,
        )
        expect(quoteInResponse.isOk).to.be.true
        const quoteId = quoteInResponse.unwrap().quote.quoteId

        const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
        expect(addKycResult.isOk).to.be.true

        const addAccountResult = await fiatConnectClient.addFiatAccount(
          mockAccountData,
        )
        expect(addAccountResult.isOk).to.be.true
        const fiatAccountId = addAccountResult.unwrap().fiatAccountId

        const idempotencyKey = randomUUID()
        const transferInParams = {
          idempotencyKey,
          data: {
            fiatAccountId: fiatAccountId,
            quoteId: quoteId,
          },
        }

        const transferInResponse = await fiatConnectClient.transferIn(
          transferInParams,
        )
        expect(transferInResponse.isOk).to.be.true
        expect(transferInResponse.unwrap().transferStatus).to.be.oneOf(
          Object.values(TransferStatus),
        )
        const transferId = transferInResponse.unwrap().transferId
        const transferStatusResponse =
          await fiatConnectClient.getTransferStatus({
            transferId,
          })
        expect(transferStatusResponse.isOk).to.be.true

        // Webhook Validation
        await expect(
          validateTransferWebhook(
            {
              transferId,
              address: wallet.address,
              status: transferStatusResponse.unwrap().status,
            },
            2,
          ),
        ).to.not.be.rejected
      })
    })
  }
  if (config.quoteOutMock) {
    describe('transfer out', () => {
      it('sends webhooks for transfer out requests', async () => {
        expect(
          !!(config.clientApiKey && config.providerId),
          'clientApiKey & providerId are required parameters for webhook validation',
        ).to.be.true
        // Setup
        const quoteOutParams = {
          ...MOCK_QUOTE[config.quoteOutMock],
          address: wallet.address,
        }
        const loginResult = await fiatConnectClient.login()
        expect(loginResult.isOk).to.be.true

        const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
        expect(addKycResult.isOk).to.be.true

        const addAccountResult = await fiatConnectClient.addFiatAccount(
          mockAccountData,
        )
        expect(addAccountResult.isOk).to.be.true
        const fiatAccountId = addAccountResult.unwrap().fiatAccountId

        const quoteOutResponse = await fiatConnectClient.createQuoteOut(
          quoteOutParams,
        )
        expect(quoteOutResponse.isOk).to.be.true
        const quoteOutId = quoteOutResponse.unwrap().quote.quoteId

        const transferOutParams = {
          idempotencyKey: randomUUID(),
          data: {
            fiatAccountId: fiatAccountId,
            quoteId: quoteOutId,
          },
        }

        const transferOutResponse = await fiatConnectClient.transferOut(
          transferOutParams,
        )
        expect(transferOutResponse.isOk).to.be.true
        expect(transferOutResponse.unwrap().transferStatus).to.be.oneOf([
          TransferStatus.TransferStarted,
          TransferStatus.TransferReadyForUserToSendCryptoFunds,
        ])
        const transferId = transferOutResponse.unwrap().transferId
        const transferStatusResponse =
          await fiatConnectClient.getTransferStatus({
            transferId,
          })
        expect(transferStatusResponse.isOk).to.be.true

        // Webhook Validation
        await expect(
          validateTransferWebhook(
            {
              transferId,
              address: wallet.address,
              status: transferStatusResponse.unwrap().status,
            },
            2,
          ),
        ).to.not.be.rejected
      })
    })
  }
  describe('kyc', () => {
    it('sends webhooks for kyc status updates', async () => {
      expect(
        !!(config.clientApiKey && config.providerId),
        'clientApiKey & providerId are required parameters for webhook validation',
      ).to.be.true
      // Setup
      const loginResult = await fiatConnectClient.login()
      expect(loginResult.isOk).to.be.ok

      const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
      expect(addKycResult.isOk).to.be.true

      const getKycResult = await fiatConnectClient.getKycStatus({
        kycSchema: mockKYCInfo.kycSchemaName,
      })
      expect(getKycResult.isOk).to.be.true

      // Webhook Validation
      await expect(
        validateKycWebhook(
          {
            kycSchema: mockKYCInfo.kycSchemaName,
            address: wallet.address,
            kycStatus: getKycResult.unwrap().kycStatus,
          },
          2,
        ),
      ).to.not.be.rejected
    })
  })
})
