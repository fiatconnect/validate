import { config } from '../src/config'
import { Network } from '@fiatconnect/fiatconnect-types'
import { expect, use } from 'chai'
import { ethers } from 'ethers'
import { FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import path from 'path'
import { chaiPlugin } from 'api-contract-validator'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'

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
        apiKey: config.clientApiKey
      },
      (message: string) => wallet.signMessage(message),
    )
    const loginResult = await fiatConnectClient.login()
    expect(loginResult.isOk).to.be.true

    const getAccountsResult = await fiatConnectClient.getFiatAccounts()
    expect(getAccountsResult.isOk).to.be.true
    expect(!!getAccountsResult.unwrap().BankAccount?.length).to.be.false
  })
  it('able to post and get', async () => {
    const wallet = ethers.Wallet.createRandom()
    const fiatConnectClient = new FiatConnectClient(
      {
        baseUrl: config.baseUrl,
        network: Network.Alfajores,
        accountAddress: wallet.address,
        apiKey: config.clientApiKey
      },
      (message: string) => wallet.signMessage(message),
    )
    const loginResult = await fiatConnectClient.login()
    expect(loginResult.isOk).to.be.ok

    const addAccountResult = await fiatConnectClient.addFiatAccount(
      mockAccountData,
    )
    expect(addAccountResult.isOk).to.be.true

    const getAccountsResult = await fiatConnectClient.getFiatAccounts()
    expect(getAccountsResult.isOk).to.be.true
    expect(getAccountsResult.unwrap().BankAccount?.length).to.be.gt(0)
  })
  // TODO test DELETE /accounts/:fiatAccountId (once a working POST endpoint exists...)
})
