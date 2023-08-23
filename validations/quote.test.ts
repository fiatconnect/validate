import { chaiPlugin } from 'api-contract-validator'
import { expect, use } from 'chai'
import path from 'path'

import axios, { AxiosRequestHeaders } from 'axios'
import { config } from '../src/config'
import { checkResponseSchema } from '../src/check-response-schema'
import { MOCK_QUOTE } from '../src/mock-data/quote'
import { ethers } from 'ethers'
import {
  FiatConnectError,
  QuoteRequestBody,
  quoteResponseSchema,
} from '@fiatconnect/fiatconnect-types'
import omit from 'lodash.omit'

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

  describe.each(cases)('/$quoteType', ({ quoteParams, quoteType }) => {
    it('gives quote with quoteId for transfer', async () => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
        headers,
      })
      const response = await client.post(`/quote/${quoteType}`, quoteParams)
      expect(response).to.have.status(200)
      expect(response.data.quote.quoteId).not.to.be.equal('')
      checkResponseSchema(response, config.pathPrefix, quoteResponseSchema)
    })

    it('Doesnt support quotes for unreasonably large transfer', async () => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
        headers,
      })
      quoteParams.cryptoAmount = Number.MAX_VALUE.toString()
      const response = await client.post(`/quote/${quoteType}`, quoteParams)
      expect(response).to.have.status(400)
      expect(response.data.error).to.be.equal('CryptoAmountTooHigh')
    })

    it.each(['address', 'country', 'cryptoType', 'fiatType'] as const)(
      'returns 400 if %s is missing',
      async (field) => {
        const client = axios.create({
          baseURL: config.baseUrl,
          validateStatus: () => true,
          headers,
        })
        const response = await client.post(
          `/quote/${quoteType}`,
          omit(quoteParams, field),
        )
        expect(response).to.have.status(400)
        expect(response.data.error).to.be.equal(
          FiatConnectError.InvalidParameters,
        )
      },
    )

    it('returns 400 if both amounts are missing', async () => {
      const client = axios.create({
        baseURL: config.baseUrl,
        validateStatus: () => true,
        headers,
      })
      const response = await client.post(
        `/quote/${quoteType}`,
        omit(quoteParams, ['cryptoAmount', 'fiatAmount']),
      )
      expect(response).to.have.status(400)
      expect(response.data.error).to.be.equal(
        FiatConnectError.InvalidParameters,
      )
    })
  })
})
