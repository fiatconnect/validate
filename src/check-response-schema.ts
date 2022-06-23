import path from 'path'
import { config } from './config'
import { expect, use } from 'chai'
import { chaiPlugin } from 'api-contract-validator'
import { AxiosResponse } from 'axios'

const apiDefinitionsPath = path.join(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

/**
 * Check that the response matches the API schema.
 *
 * Ignores /v1 prefix
 */
export function checkResponseSchema(response: AxiosResponse) {
  if (response.request.path.slice(0, 3) === '/v1') {
    // removes /v1 prefix, total hack to get api schema matcher to work
    response.request.path = response.request.path.slice(3)
  }
  expect(response).to.have.status(200).and.to.matchApiSchema()
}
