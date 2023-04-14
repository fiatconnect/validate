import { chaiPlugin } from 'api-contract-validator'
import { expect, use } from 'chai'
import path from 'path'

import axios, { AxiosRequestHeaders } from 'axios'
import { config } from '../src/config'
import { checkResponseSchema } from '../src/check-response-schema'
import { MOCK_QUOTE } from '../src/mock-data/quote'
import { ethers } from 'ethers'
import {
  QuoteRequestBody,
  quoteResponseSchema,
} from '@fiatconnect/fiatconnect-types'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

const headers: AxiosRequestHeaders = config.clientApiKey
  ? { Authorization: `Bearer ${config.clientApiKey}` }
  : {}

describe('/quote', () => {
  const { quoteOutMock, quoteInMock } = config
  const wallet = ethers.Wallet.createRandom()
  const cases: { quoteParams: QuoteRequestBody; quoteType: 'in' | 'out' }[] = []
  if (quoteInMock) {
    cases.push({
      quoteParams: { ...MOCK_QUOTE[quoteInMock], address: wallet.address },
      quoteType: 'in',
    })
  }
  if (quoteOutMock) {
    cases.push({
      quoteParams: { ...MOCK_QUOTE[quoteOutMock], address: wallet.address },
      quoteType: 'out',
    })
  }
  it.each(cases)(
    'gives quote with quoteId for transfer $quoteType',
    async ({ quoteParams, quoteType }) => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
        headers,
      })
      const response = await client.post(`/quote/${quoteType}`, quoteParams)
      expect(response).to.have.status(200)
      expect(response.data.quote.quoteId).not.to.be.equal('')
      checkResponseSchema(response, quoteResponseSchema)
    },
  )

  it.each(cases)(
    'Doesnt support quotes for unreasonably large transfer $quoteType',
    async ({ quoteParams, quoteType }) => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
        headers,
      })
      quoteParams.cryptoAmount = Number.MAX_VALUE.toString()
      const response = await client.post(`/quote/${quoteType}`, quoteParams)
      expect(response).to.have.status(400)
      expect(response.data.error).to.be.equal('CryptoAmountTooHigh')
    },
  )
})
