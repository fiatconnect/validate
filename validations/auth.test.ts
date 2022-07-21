import { ethers } from 'ethers'
import { AddKycParams, FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import { config } from '../src/config'
import { KycSchema, Network } from '@fiatconnect/fiatconnect-types'
import { expect, use } from 'chai'
import { ALFAJORES_CHAIN_ID } from '../src/constants'
import { generateNonce, SiweMessage } from 'siwe'
import axios, {AxiosRequestHeaders} from 'axios'
import path from 'path'
import { chaiPlugin } from 'api-contract-validator'
import { checkResponseSchema } from '../src/check-response-schema'
import { MOCK_KYC } from '../src/mock-data/kyc'
import { MOCK_FIAT_ACCOUNTS } from '../src/mock-data/fiat-account'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('/auth/login', () => {
  const headers: AxiosRequestHeaders = config.clientApiKey
    ? { Authorization: `Bearer ${config.clientApiKey}` }
    : {}
  const wallet = ethers.Wallet.createRandom()
  it('able to login', async () => {
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
  })
  it('prevents replay attacks with nonce in use checks', async () => {
    const SESSION_DURATION_MS = 14400000 // 4 hours
    const expirationDate = new Date(Date.now() + SESSION_DURATION_MS)
    const siweMessage = new SiweMessage({
      domain: new URL(config.baseUrl).hostname,
      address: wallet.address,
      statement: 'Sign in with Ethereum',
      uri: `${config.baseUrl}/auth/login`,
      version: '1',
      chainId: ALFAJORES_CHAIN_ID,
      nonce: generateNonce(),
      expirationTime: expirationDate.toISOString(),
    })
    const message = siweMessage.prepareMessage()
    const signature = await wallet.signMessage(message)
    const client = axios.create({
      baseURL: config.baseUrl,
      validateStatus: () => true,
      headers
    })
    const response = await client.post(`/auth/login`, {
      message,
      signature,
    })
    expect(response).to.have.status(200)
    checkResponseSchema(response)

    const response2 = await client.post('/auth/login', {
      message,
      signature,
    })
    expect(response2.status).to.equal(401)
    expect(response2.data.error).to.equal('NonceInUse')
  })
  it('rejects login signed by different wallet', async () => {
    const fiatConnectClient = new FiatConnectClient(
      {
        baseUrl: config.baseUrl,
        network: Network.Alfajores,
        accountAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        apiKey: config.clientApiKey
      },
      (message: string) => wallet.signMessage(message),
    )
    const loginResult = await fiatConnectClient.login()
    expect(loginResult.isErr).to.be.true
  })
  const mockKYCInfo: AddKycParams<KycSchema> =
    MOCK_KYC[config.kycMock as keyof typeof MOCK_KYC]
  const mockAccountData =
    MOCK_FIAT_ACCOUNTS[
      config.fiatAccountMock as keyof typeof MOCK_FIAT_ACCOUNTS
    ]
  const requiresAuthCases: {
    method: 'get' | 'post' | 'delete'
    endpoint: string
    data: any
  }[] = [
    {
      method: 'get',
      endpoint: `/kyc/${mockKYCInfo.kycSchemaName}/status`,
      data: undefined,
    },
    {
      method: 'post',
      endpoint: `/kyc/${mockKYCInfo.kycSchemaName}`,
      data: mockKYCInfo.data,
    },
    {
      method: 'delete',
      endpoint: `/kyc/${mockKYCInfo.kycSchemaName}`,
      data: undefined,
    },
    {
      method: 'get',
      endpoint: '/accounts',
      data: undefined,
    },
    {
      method: 'post',
      endpoint: '/accounts',
      data: mockAccountData,
    },
    {
      method: 'delete',
      endpoint: '/accounts/fake-fiat-account-id', // shouldn't matter; should still get a 401
      data: undefined,
    },
  ]
  it.each(requiresAuthCases)(
    '$method $endpoint should reject with 401 if not logged in yet',
    async ({ method, endpoint, data }) => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
        headers
      })
      const response = await client[method](endpoint, data)
      expect(response).to.have.status(401)
    },
  )
})
