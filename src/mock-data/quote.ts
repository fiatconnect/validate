import {
  CryptoType,
  FiatType,
  QuoteRequestBody,
} from '@fiatconnect/fiatconnect-types'

const quoteBrazilCREAL: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cREAL,
  fiatType: FiatType.BRL,
  cryptoAmount: '10',
  country: 'BR',
}

const quoteOutNigeriaCUSD: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '10',
  country: 'NG',
}

const quoteOutKenyaCUSD: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.KES,
  cryptoAmount: '10',
  country: 'KE',
}

const quoteInNigeriaCUSD: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.NGN,
  cryptoAmount: '.01',
  country: 'NG',
}

const quoteOutXOFCUSD: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '10',
  country: 'CI',
}

const quoteInXOFCUSD: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cUSD,
  fiatType: FiatType.XOF,
  cryptoAmount: '.01',
  country: 'CI',
}

const quoteOutAustriaEURCEUR: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cEUR,
  fiatType: FiatType.EUR,
  cryptoAmount: '10',
  country: 'AT',
}

export const MOCK_QUOTE: Record<string, Omit<QuoteRequestBody, 'address'>> = {
  quoteInNigeriaCUSD,
  quoteOutKenyaCUSD,
  quoteOutNigeriaCUSD,
  quoteOutXOFCUSD,
  quoteInXOFCUSD,
  quoteBrazilCREAL,
  quoteOutAustriaEURCEUR,
}
