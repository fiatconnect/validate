import { config } from '../src/config'
import { Network } from '@fiatconnect/fiatconnect-types'
import { expect, use } from 'chai'
import { ethers } from 'ethers'
import { FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import { FiatConnectError } from '@fiatconnect/fiatconnect-types'
import path from 'path'
import { chaiPlugin } from 'api-contract-validator'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'
import { checkObjectAgainstModel } from '../src/check-response-schema'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('accounts', () => {
  const mockAccountData =
    MOCK_FIAT_ACCOUNTS[
      config.fiatAccountMock as keyof typeof MOCK_FIAT_ACCOUNTS
    ]

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
    expect(getAccountsResultDuplicate.unwrap()).to.eql({})

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
})
