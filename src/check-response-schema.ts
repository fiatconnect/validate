import path from 'path'
import { config } from './config'
import { expect, use } from 'chai'
import { chaiPlugin } from 'api-contract-validator'
import { AxiosResponse } from 'axios'
import * as SwaggerValidator from 'swagger-object-validator'

const apiDefinitionsPath = path.join(config.openapiSpec)
const validator = new SwaggerValidator.Handler(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

/**
 * Check that the response matches the API schema.
 *
 * Ignores /vX prefix
 */
export function checkResponseSchema(response: AxiosResponse) {
  const versionPrefixMatch = response.request.path.match(/^\/v([0-9]+)/)
  if (versionPrefixMatch) {
    // removes /vX prefix, total hack to get api schema matcher to work
    response.request.path = response.request.path.slice(versionPrefixMatch[0].length)
  }
  expect(response).to.matchApiSchema()
}

/**
 * Directly checks that an object matches an OpenAPI Model. We need to use this when checking results
 * from the SDK, since intercepting the network calls directly yields response objects that are incompitable
 * with those required by the Chai plugin matcher.
 */
export async function checkObjectAgainstModel(data: any, model: string) {
  const result = await validator.validateModel(data, model)
  expect(result.errors.length).to.equal(0, result!.humanReadable() as string)
}
