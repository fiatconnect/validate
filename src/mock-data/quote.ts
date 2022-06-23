import {
  CryptoType,
  FiatType,
  QuoteRequestQuery,
} from '@fiatconnect/fiatconnect-types'

const quoteOutNigeriaCUSD: QuoteRequestQuery = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '10',
  country: 'NG',
}

export const MOCK_QUOTE: Record<string, QuoteRequestQuery> = {
  quoteOutNigeriaCUSD,
}
