import { config } from '../src/config'
import { expect, use } from 'chai'
import { ethers } from 'ethers'
import { AddKycParams, FiatConnectClient } from '@fiatconnect/fiatconnect-sdk'
import { KycSchema, KycStatus, Network } from '@fiatconnect/fiatconnect-types'
import path from 'path'
import { chaiPlugin } from 'api-contract-validator'
import { MOCK_KYC } from '../src/mock-data/kyc'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('/kyc', () => {
  const mockKYCInfo: AddKycParams<KycSchema> =
    MOCK_KYC[config.kycMock as keyof typeof MOCK_KYC]
  it('able to post kyc data if logged in first', async () => {
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

    const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
    expect(addKycResult.isOk).to.be.true
    expect(addKycResult.unwrap().kycStatus).to.be.oneOf(
      Object.values(KycStatus),
    )
  })
  it('GET /kyc/:kycSchema/status', async () => {
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

    const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
    expect(addKycResult.isOk).to.be.true

    const getKycResult = await fiatConnectClient.getKycStatus({
      kycSchema: mockKYCInfo.kycSchemaName,
    })
    expect(getKycResult.isOk).to.be.true
    expect(getKycResult.unwrap().kycStatus).to.be.oneOf(
      Object.values(KycStatus),
    )
  })

  it('able to delete kyc data if logged in first', async () => {
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

    const addKycResult = await fiatConnectClient.addKyc(mockKYCInfo)
    expect(addKycResult.isOk).to.be.true

    const deleteKycResult = await fiatConnectClient.deleteKyc({
      kycSchema: mockKYCInfo.kycSchemaName,
    })
    expect(deleteKycResult.isOk).to.be.true

    const secondDeleteResult = await fiatConnectClient.deleteKyc({
      kycSchema: mockKYCInfo.kycSchemaName,
    })
    expect(secondDeleteResult.isOk).to.be.false // should be 404 error
  })
})
