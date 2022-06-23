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

## Contributing

If you see an opportunity to improve this repo, perhaps by increasing test coverage or making existing
tests easier to debug, please open a pull request and tag `@fiatconnect-devs` in the
[FiatConnect Discord channel](https://fiatconnect.org/contact).

## Resources

- [api-contract-validator](https://www.chaijs.com/plugins/api-contract-validator/)
