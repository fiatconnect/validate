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

const quoteInEURCEUR: Omit<QuoteRequestBody, 'address'> = {
    cryptoType: CryptoType.cEUR,
    fiatType: FiatType.EUR,
    cryptoAmount: '1',
    country: 'AT'
  }
  
const quoteOutEURCEUR: Omit<QuoteRequestBody, 'address'> = {
  cryptoType: CryptoType.cEUR,
  fiatType: FiatType.EUR,
  cryptoAmount: '1',
  country: 'AT'
}

export const MOCK_QUOTE: Record<string, Omit<QuoteRequestBody, 'address'>> = {
  quoteInNigeriaCUSD,
  quoteOutNigeriaCUSD,
  quoteOutXOFCUSD,
  quoteInXOFCUSD,
  quoteBrazilCREAL,
  quoteInEURCEUR,
  quoteOutEURCEUR
}
