import { chaiPlugin } from 'api-contract-validator'
import { expect, use } from 'chai'
import path from 'path'

import axios, { AxiosRequestHeaders } from 'axios'
import { config } from '../src/config'
import { checkResponseSchema } from '../src/check-response-schema'
import { MOCK_QUOTE } from '../src/mock-data/quote'
import { ethers } from 'ethers'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

const headers: AxiosRequestHeaders = config.clientApiKey
  ? { Authorization: `Bearer ${config.clientApiKey}` }
  : {}

describe('/quote', () => {
  describe('/out', () => {
    const wallet = new ethers.Wallet(config.testPrivateKey)
    const quoteParams = {
      ...MOCK_QUOTE[config.quoteOutMock],
      address: wallet.address,
    }
    it('gives quote when it should', async () => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
      })
      const params = new URLSearchParams(quoteParams)
      const response = await client.get(`/quote/out?${params.toString()}`, {
        headers,
      })
      expect(response).to.have.status(200)
      checkResponseSchema(response)
    })
    it('Doesnt support quotes for unreasonably large transfer out', async () => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
      })
      const params = new URLSearchParams(quoteParams)
      const response = await client.get(`/quote/out?${params.toString()}`, {
        headers,
      })
      expect(response).to.have.status(400)
      expect(response.data.error).to.be.equal('InvalidParameters')
      expect(!!response.data.maximumCryptoAmount).to.be.true
    })
  })
})
