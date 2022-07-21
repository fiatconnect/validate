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
import { MOCK_KYC } from '../src/mock-data/kyc'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('/transfer', () => {
  const mockAccountData =
    MOCK_FIAT_ACCOUNTS[
    config.fiatAccountMock as keyof typeof MOCK_FIAT_ACCOUNTS
  ]

  const mockKYCInfo: AddKycParams<KycSchema> =
    MOCK_KYC[config.kycMock as keyof typeof MOCK_KYC]

  if (config.quoteInMock) {
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
        ...MOCK_QUOTE[config.quoteInMock],
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

        const duplicateTransferResponse = await fiatConnectClient.transferIn(
          transferInParams,
        )
        expect(duplicateTransferResponse.isOk).to.be.true
        expect(duplicateTransferResponse.unwrap().transferId).to.equal(transferInResponse.unwrap().transferId)
      })
    })
  }

  if (config.quoteOutMock) {
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
        ...MOCK_QUOTE[config.quoteOutMock],
        address: wallet.address,
      }

      it('able to transfer crypto in for fiat out', async () => {
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
        expect(transferOutResponse.unwrap().transferStatus).to.be.oneOf(
          [TransferStatus.TransferStarted, TransferStatus.TransferReadyForUserToSendCryptoFunds]
        )

        const duplicateTransferResponse = await fiatConnectClient.transferOut(
          transferOutParams,
        )
        expect(duplicateTransferResponse.isOk).to.be.true
        expect(duplicateTransferResponse.unwrap().transferId).to.equal(transferOutResponse.unwrap().transferId)
      })
    })
  }
})
