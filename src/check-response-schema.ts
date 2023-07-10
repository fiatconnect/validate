import path from 'path'
import { config } from './config'
import { expect, use } from 'chai'
import { chaiPlugin } from 'api-contract-validator'
import { AxiosResponse } from 'axios'
import * as SwaggerValidator from 'swagger-object-validator'
import { AnyZodObject, ZodError } from 'zod'

const apiDefinitionsPath = path.join(config.openapiSpec)
const validator = new SwaggerValidator.Handler(config.openapiSpec)
use(chaiPlugin({ apiDefinitionsPath }))

/**
 * Check that the response matches the API schema.
 *
 * Ignores /vX prefix
 *
 * @param response
 * @param pathPrefix
 * @param schema: If provided, runs additional check using a zod schema. The spec should be the
 *  source of truth, but sometimes zod schemas allow for more granular checks-- for instance, with enum values.
 */
export function checkResponseSchema<T extends AnyZodObject>(
  response: AxiosResponse,
  pathPrefix: string,
  schema?: T,
) {
  // check response against FiatConnect spec
  if (pathPrefix !== '' && response.request.path.indexOf(pathPrefix) === 0) {
    // removes path prefix like /v1, total hack to get api schema matcher to work
    response.request.path = response.request.path.slice(pathPrefix.length)
  }
  expect(response).to.matchApiSchema()

  if (!schema) {
    return
  }

  // check response against zod schema
  try {
    schema.parse(response.data)
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(
        `Error validating object with schema ${
          schema.description
        }: ${JSON.stringify(err.issues)}`,
      )
    }
    throw err
  }
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
