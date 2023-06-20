import { config } from '../src/config'
import { KycSchema, Network } from '@fiatconnect/fiatconnect-types'
import { expect, use } from 'chai'
import { ethers } from 'ethers'
import { AddKycParams, FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import { FiatConnectError } from '@fiatconnect/fiatconnect-types'
import path from 'path'
import { chaiPlugin } from 'api-contract-validator'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'
import { checkObjectAgainstModel } from '../src/check-response-schema'
import { MOCK_KYC } from '../src/mock-data/kyc'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('accounts', () => {
  const mockAccountData =
    MOCK_FIAT_ACCOUNTS[
      config.fiatAccountMock as keyof typeof MOCK_FIAT_ACCOUNTS
    ]
  
  const mockKYCInfo: AddKycParams<KycSchema> =
  MOCK_KYC[config.kycMock as keyof typeof MOCK_KYC]

  it('gives empty list of accounts when none are posted yet', async () => {
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
    const loginResult = await fiatConnectClient.login()
    expect(loginResult.isOk).to.be.true

    const getAccountsResult = await fiatConnectClient.getFiatAccounts()
    expect(getAccountsResult.isOk).to.be.true
    expect(!!getAccountsResult.unwrap().BankAccount?.length).to.be.false
    await checkObjectAgainstModel(
      getAccountsResult.unwrap(),
      'GetFiatAccountsResponse',
    )
  })
  it('able to post, get, and delete', async () => {
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
    const loginResult = await fiatConnectClient.login()
    expect(loginResult.isOk).to.be.ok

    // Add Kyc
    const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
    expect(addKycResult.isOk).to.be.true

    // Add an account and verify response
    const addAccountResult = await fiatConnectClient.addFiatAccount(
      mockAccountData,
    )
    expect(addAccountResult.isOk).to.be.true
    await checkObjectAgainstModel(
      addAccountResult.unwrap(),
      'FiatAccountInfoResponse',
    )

    // Get account and verify that added account is there
    const getAccountsResult = await fiatConnectClient.getFiatAccounts()
    expect(getAccountsResult.isOk).to.be.true
    await checkObjectAgainstModel(
      getAccountsResult.unwrap(),
      'GetFiatAccountsResponse',
    )
    expect(getAccountsResult.unwrap().BankAccount?.length).to.be.gt(0)

    // Delete account
    const fiatAccountId = addAccountResult.unwrap().fiatAccountId
    const deleteAccountResult = await fiatConnectClient.deleteFiatAccount({
      fiatAccountId,
    })
    expect(deleteAccountResult.isOk).to.be.true

    // Getting accounts should now yield empty response
    const getAccountsResultDuplicate = await fiatConnectClient.getFiatAccounts()
    expect(getAccountsResultDuplicate.isOk).to.be.true
    expect(!!getAccountsResultDuplicate.unwrap().BankAccount?.length).to.be
      .false
    await checkObjectAgainstModel(
      getAccountsResultDuplicate.unwrap(),
      'GetFiatAccountsResponse',
    )

    // Should fail when attempting to delete account a second time
    const deleteAccountResultDuplicate =
      await fiatConnectClient.deleteFiatAccount({ fiatAccountId })
    expect(deleteAccountResultDuplicate.isOk).to.be.false

    if (deleteAccountResultDuplicate.isErr) {
      expect(deleteAccountResultDuplicate.error.fiatConnectError).to.be.equal(
        FiatConnectError.ResourceNotFound,
      )
    }
  })
  it('able to add same account to multiple addresses', async () => {
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
    const loginResult = await fiatConnectClient.login()
    expect(loginResult.isOk).to.be.ok

    // Add Kyc
    const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
    expect(addKycResult.isOk).to.be.true

    // Add an account and verify response
    const addAccountResult = await fiatConnectClient.addFiatAccount(
      mockAccountData,
    )
    expect(addAccountResult.isOk).to.be.ok
    await checkObjectAgainstModel(
      addAccountResult.unwrap(),
      'FiatAccountInfoResponse',
    )

    // Another address should be able to add the same exact account
    // without a collision
    const wallet2 = ethers.Wallet.createRandom()
    const fiatConnectClient2 = new FiatConnectClient(
      {
        baseUrl: config.baseUrl,
        network: Network.Alfajores,
        accountAddress: wallet2.address,
        apiKey: config.clientApiKey,
      },
      (message: string) => wallet2.signMessage(message),
    )
    const loginResult2 = await fiatConnectClient2.login()
    expect(loginResult2.isOk).to.be.true

    // Add Kyc
    const addKycResult2 = await fiatConnectClient.addKyc(mockKYCInfo)
    expect(addKycResult2.isOk).to.be.true

    // Add the same account to the new address and verify response
    const addAccountResult2 = await fiatConnectClient2.addFiatAccount(
      mockAccountData,
    )
    expect(addAccountResult2.isOk).to.be.ok
    await checkObjectAgainstModel(
      addAccountResult2.unwrap(),
      'FiatAccountInfoResponse',
    )
  })
})
