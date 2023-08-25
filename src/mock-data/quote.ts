import {
  CryptoType,
  FiatType,
  QuoteRequestBody,
} from '@fiatconnect/fiatconnect-types'

// NOTE: quotes here must include both amounts, tests will omit one of the
// fields and test whether the endpoint supports fetching quotes for both
// amounts
type MockQuote = Omit<QuoteRequestBody, 'address'> &
  Required<Pick<QuoteRequestBody, 'fiatAmount' | 'cryptoAmount'>>

const quoteBrazilCREAL: MockQuote = {
  cryptoType: CryptoType.cREAL,
  fiatType: FiatType.BRL,
  cryptoAmount: '20',
  fiatAmount: '20',
  country: 'BR',
}

const quoteKenyaCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.KES,
  cryptoAmount: '20',
  fiatAmount: '2900',
  country: 'KE',
}

const quoteNigeriaCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '20',
  fiatAmount: '15120',
  country: 'NG',
}

const quoteXOFCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '20',
  fiatAmount: '12070',
  country: 'CI',
}

const quoteAustriaEURCEUR: MockQuote = {
  cryptoType: CryptoType.cEUR,
  fiatType: FiatType.EUR,
  cryptoAmount: '20',
  fiatAmount: '20',
  country: 'AT',
}

export const MOCK_QUOTE: Record<string, MockQuote> = {
  quoteNigeriaCUSD,
  quoteKenyaCUSD,
  quoteXOFCUSD,
  quoteBrazilCREAL,
  quoteAustriaEURCEUR,
}
