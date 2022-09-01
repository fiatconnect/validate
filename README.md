# validate

FiatConnect Validate is a test suite for validating a FiatConnect-compliant API.

While this may be useful in developing a FiatConnect-compliant API, it is still strongly recommended that
Cash-In/Cash-Out providers follow best practices and write their own unit and integration tests specific to their
implementations.

## Developing

```
yarn
```

## Running

Make sure you have a copy of the [FiatConnect OpenAPI spec](https://github.com/fiatconnect/specification/blob/main/swagger.yaml)
on your device, since it is used for schema validation.

Setup a config file (remember to customize):

```
echo BASE_URL=https://some.api.fiatconnect.org > .env
echo OPENAPI_SPEC=/path/to/swagger.yaml >> .env
echo QUOTE_OUT_MOCK=quoteOutNigeriaCUSD
echo FIAT_ACCOUNT_MOCK=accountNumberNigeria
echo KYC_MOCK=personalDataAndDocumentsNigeria
```

Alternatively, you may use a pre-defined environment. Note that you still may need to customize, for example by filling in
client api keys. For example:

```
cp .env.paychant .env
```

Run all validation:

```
yarn validate
```

Run specific tests (see Jest documentation for
[`--testNamePattern`](https://jestjs.io/docs/cli#--testnamepatternregex)).

```
yarn validate --testNamePattern='quote'
```

### Validating Webhooks

Validating webhooks takes a few additional steps that need to be done prior to running the script:

1. Register a [client api key](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#332-client-api-key) for the validate script with your API. Send webhooks for this client api key to `https://liquidity-dot-celo-mobile-alfajores.appspot.com/fiatconnect/webhook/history/<provider-id>`. (Remember to replace `<provider-id>` with your actual provider ID.)
1. Add `provider-id` and `client api key` as environment variables to this script. ex: `CLIENT_API_KEY=<insert-key>`, `PROVIDER_ID=<provider-id>`
1. On discord, reach out to a Valora Engineer and request that they add your API to the allow list. Privately supply them with your [Webhook Signing Private Key](https://github.com/fiatconnect/specification/blob/main/fiatconnect-api.md#52-webhook-request-signing) and the `<provider-id>`.
1. After a Valora Engineer has added your API to the allow list you may run the validation script with the `CLIENT_API_KEY` and `PROVIDER_ID` variables to validate webhooks.

## Contributing

If you see an opportunity to improve this repo, perhaps by increasing test coverage or making existing
tests easier to debug, please open a pull request and tag `@fiatconnect-devs` in the
[FiatConnect Discord channel](https://fiatconnect.org/contact).

## Resources

- [api-contract-validator](https://www.chaijs.com/plugins/api-contract-validator/)
