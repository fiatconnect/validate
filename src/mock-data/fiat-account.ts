import {
  FiatAccountSchema,
  FiatAccountType,
  PostFiatAccountRequestBody,
} from '@fiatconnect/fiatconnect-types'

const accountNumberNigeria: PostFiatAccountRequestBody<FiatAccountSchema.AccountNumber> =
  {
    fiatAccountSchema: FiatAccountSchema.AccountNumber,
    data: {
      fiatAccountType: FiatAccountType.BankAccount,
      institutionName: 'UNITED BANK FOR AFRICA Lacaras',
      accountName: 'My UBA Account',
      accountNumber: '0123456789',
      country: 'NG',
    },
  }

const ibanNumberAustria: PostFiatAccountRequestBody<FiatAccountSchema.IBANNumber> =
  {
    fiatAccountSchema: FiatAccountSchema.IBANNumber,
    data: {
      accountName: 'My Austrian Bank account',
      institutionName: 'Austrian Bank',
      country: 'AT',
      fiatAccountType: FiatAccountType.BankAccount,
      iban: 'mock-iban-number',
    },
  }

const accountNumberXOF: PostFiatAccountRequestBody<FiatAccountSchema.AccountNumber> =
  {
    fiatAccountSchema: FiatAccountSchema.AccountNumber,
    data: {
      institutionName: 'GUARANTEE TRUST BANK',
      accountName: 'My GTBANK Account',
      country: 'BF',
      fiatAccountType: FiatAccountType.BankAccount,
      accountNumber: '0123456789',
    },
  }

export const MOCK_FIAT_ACCOUNTS: Record<
  string,
  PostFiatAccountRequestBody<FiatAccountSchema>
> = { accountNumberNigeria, accountNumberXOF, ibanNumberAustria }
