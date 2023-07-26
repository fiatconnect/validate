import { expect, use } from 'chai'
import { ethers } from 'ethers'
import path from 'path'
import { randomUUID } from 'crypto'
import { AddKycParams, FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import {
  KycSchema,
  TransferStatus,
  Network,
} from '@fiatconnect/fiatconnect-types'
import { config } from '../src/config'
import { chaiPlugin } from 'api-contract-validator'
import { MOCK_QUOTE } from '../src/mock-data/quote'
import { MOCK_KYC, getMockKyc } from '../src/mock-data/kyc'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'
import { checkObjectAgainstModel } from '../src/check-response-schema'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('/transfer', () => {
  const mockAccountData =
    MOCK_FIAT_ACCOUNTS[
      config.fiatAccountMock as keyof typeof MOCK_FIAT_ACCOUNTS
    ]

  let mockKYCInfo: AddKycParams<KycSchema>

  const { quoteInMock, quoteOutMock, ensureUserInitTransferIn } = config
  if (quoteInMock) {
    describe('/in', () => {
      const wallet = ethers.Wallet.createRandom()

      const fiatConnectClient = new FiatConnectClient(
        {
          baseUrl: config.baseUrl,
          network: Network.Alfajores,
          accountAddress: wallet.address,
          apiKey: config.clientApiKey,
        },
        (message: string) => wallet.signMessage(message),
      )

      const quoteInParams = {
        ...MOCK_QUOTE[quoteInMock],
        address: wallet.address,
      }

      it('able to transfer fiat in for crypto', async () => {
        const loginResult = await fiatConnectClient.login()

        expect(loginResult.isOk).to.be.true

        const quoteInResponse = await fiatConnectClient.createQuoteIn(
          quoteInParams,
        )
        expect(quoteInResponse.isOk).to.be.true

        const quoteId = quoteInResponse.unwrap().quote.quoteId

        if (ensureUserInitTransferIn) {
          // Get the fiat account schema information from the quote that corresponds
          // to the mock account being used
          const fiatAccountSchemaInfo = quoteInResponse
            .unwrap()
            .fiatAccount[
              mockAccountData.data.fiatAccountType
            ]!.fiatAccountSchemas.find(
              (fiatInfo) =>
                fiatInfo.fiatAccountSchema ===
                mockAccountData.fiatAccountSchema,
            )
          await checkObjectAgainstModel(
            fiatAccountSchemaInfo?.userActionType,
            'UserActionTypeEnum',
          )
        }

        mockKYCInfo = getMockKyc(config.kycMock as keyof typeof MOCK_KYC)
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

        const transferInResponseUnwrap = transferInResponse.unwrap()
        if (ensureUserInitTransferIn) {
          await checkObjectAgainstModel(
            transferInResponseUnwrap.userActionDetails,
            'UserActionDetails',
          )
        }

        const transferStatusResponse =
          await fiatConnectClient.getTransferStatus({
            transferId: transferInResponse.unwrap().transferId,
          })

        expect(transferStatusResponse.isOk).to.be.true

        await checkObjectAgainstModel(
	  transferStatusResponse.unwrap(),
          'TransferStatusResponse',
        )

        if (ensureUserInitTransferIn) {
          await checkObjectAgainstModel(
            transferStatusResponse.unwrap().userActionDetails,
            'UserActionDetails',
          )
        }

        const duplicateTransferResponse = await fiatConnectClient.transferIn(
          transferInParams,
        )
        expect(duplicateTransferResponse.isOk).to.be.true
        expect(duplicateTransferResponse.unwrap().transferId).to.equal(
          transferInResponse.unwrap().transferId,
        )

        if (ensureUserInitTransferIn) {
          await checkObjectAgainstModel(
            duplicateTransferResponse.unwrap().userActionDetails,
            'UserActionDetails',
          )
        }
      })
    })
  }

  if (quoteOutMock) {
    describe('/out', () => {
      const wallet = ethers.Wallet.createRandom()

      const fiatConnectClient = new FiatConnectClient(
        {
          baseUrl: config.baseUrl,
          network: Network.Alfajores,
          accountAddress: wallet.address,
          apiKey: config.clientApiKey,
        },
        (message: string) => wallet.signMessage(message),
      )

      const quoteOutParams = {
        ...MOCK_QUOTE[quoteOutMock],
        address: wallet.address,
      }

      it('able to transfer crypto in for fiat out', async () => {
        const loginResult = await fiatConnectClient.login()
        expect(loginResult.isOk).to.be.true

        mockKYCInfo = getMockKyc(config.kycMock as keyof typeof MOCK_KYC)
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
        expect(transferOutResponse.unwrap().transferAddress).to.match(
          /0x[a-fA-F0-9]{40}/,
        )

        const transferStatusResponse =
          await fiatConnectClient.getTransferStatus({
            transferId: transferOutResponse.unwrap().transferId,
          })
        expect(transferStatusResponse.isOk).to.be.true
        await checkObjectAgainstModel(
          transferStatusResponse.unwrap(),
          'TransferStatusResponse',
        )

        const duplicateTransferResponse = await fiatConnectClient.transferOut(
          transferOutParams,
        )
        expect(duplicateTransferResponse.isOk).to.be.true
        expect(duplicateTransferResponse.unwrap().transferId).to.equal(
          transferOutResponse.unwrap().transferId,
        )
      })
    })
  }
})
