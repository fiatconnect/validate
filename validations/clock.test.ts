import axios from 'axios'
import { config } from '../src/config'
import { expect, use } from 'chai'
import { FIFTEEN_MINUTES_IN_MS } from '../src/constants'
import path from 'path'
import { chaiPlugin } from 'api-contract-validator'
import { checkResponseSchema } from '../src/check-response-schema'
import { clockResponseSchema } from '@fiatconnect/fiatconnect-types'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

describe('/clock', () => {
  it("returns the server's current time", async () => {
    const client = axios.create({
      baseURL: config.baseUrl,
      validateStatus: () => true,
    })
    const response = await client.get(`/clock`)
    expect(response).to.have.status(200)
    checkResponseSchema(response, clockResponseSchema)
    const serverTimeStr = response.data?.time
    expect(!!serverTimeStr).to.be.true
    const serverTime = new Date(serverTimeStr)
    expect(Math.abs(serverTime.getTime() - Date.now())).to.be.lt(
      FIFTEEN_MINUTES_IN_MS,
    )
  })
})
