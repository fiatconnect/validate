import {
  CryptoType,
  FiatType,
  QuoteRequestBody,
} from '@fiatconnect/fiatconnect-types'

const quoteOutNigeriaCUSD: QuoteRequestBody = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '10',
  country: 'NG',
}

const quoteInNigeriaCUSD: QuoteRequestBody = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '.01',
  country: 'NG',
}

const quoteOutXOFCUSD: QuoteRequestBody = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '10',
  country: 'CI',
}

const quoteInXOFCUSD: QuoteRequestBody = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '.01',
  country: 'CI',
}

const quoteOutColombiaCUSD: QuoteRequestBody = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.COP,
  cryptoAmount: '100',
  country: 'CO',
}

export const MOCK_QUOTE: Record<string, QuoteRequestBody> = {
  quoteInNigeriaCUSD,
  quoteOutNigeriaCUSD,
  quoteOutXOFCUSD,
  quoteInXOFCUSD,
  quoteOutColombiaCUSD
}
