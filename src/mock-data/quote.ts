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
  cryptoAmount: '10',
  fiatAmount: '10',
  country: 'BR',
}

const quoteOutNigeriaCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '10',
  fiatAmount: '7560',
  country: 'NG',
}

const quoteOutKenyaCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.KES,
  cryptoAmount: '10',
  fiatAmount: '1450',
  country: 'KE',
}

const quoteInNigeriaCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '20',
  fiatAmount: '15120',
  country: 'NG',
}

const quoteOutXOFCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '10',
  fiatAmount: '6035',
  country: 'CI',
}

const quoteInXOFCUSD: MockQuote = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '.01',
  fiatAmount: '6',
  country: 'CI',
}

const quoteOutAustriaEURCEUR: MockQuote = {
  cryptoType: CryptoType.cEUR,
  fiatType: FiatType.EUR,
  cryptoAmount: '10',
  fiatAmount: '10',
  country: 'AT',
}

export const MOCK_QUOTE: Record<string, MockQuote> = {
  quoteInNigeriaCUSD,
  quoteOutKenyaCUSD,
  quoteOutNigeriaCUSD,
  quoteOutXOFCUSD,
  quoteInXOFCUSD,
  quoteBrazilCREAL,
  quoteOutAustriaEURCEUR,
}
