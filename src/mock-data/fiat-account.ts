import {
  FiatAccountSchema,
  FiatAccountType,
  PIXKeyTypeEnum,
  PostFiatAccountRequestBody,
} from '@fiatconnect/fiatconnect-types'

const accountNumberNigeria: PostFiatAccountRequestBody = {
  fiatAccountSchema: FiatAccountSchema.AccountNumber,
  data: {
    fiatAccountType: FiatAccountType.BankAccount,
    institutionName: 'UNITED BANK FOR AFRICA Lacaras',
    accountName: 'My UBA Account',
    accountNumber: '0123456789',
    country: 'NG',
  },
}

const mobileMoneyKenya: PostFiatAccountRequestBody = {
  fiatAccountSchema: FiatAccountSchema.MobileMoney,
  data: {
    fiatAccountType: FiatAccountType.MobileMoney,
    institutionName: 'MPESA',
    operator: 'MPESA',
    accountName: 'My MPESA Account',
    mobile: '07037205555',
    country: 'KE',
  },
}

const ibanNumberAustria: PostFiatAccountRequestBody = {
  fiatAccountSchema: FiatAccountSchema.IBANNumber,
  data: {
    accountName: 'My Austrian Bank account',
    institutionName: 'Austrian Bank',
    country: 'AT',
    fiatAccountType: FiatAccountType.BankAccount,
    iban: 'AT611904300234573201',
  },
}

const accountNumberXOF: PostFiatAccountRequestBody = {
  fiatAccountSchema: FiatAccountSchema.AccountNumber,
  data: {
    institutionName: 'GUARANTEE TRUST BANK',
    accountName: 'My GTBANK Account',
    country: 'BF',
    fiatAccountType: FiatAccountType.BankAccount,
    accountNumber: '0123456789',
  },
}
const pixAccount: PostFiatAccountRequestBody = {
  fiatAccountSchema: FiatAccountSchema.PIXAccount,
  data: {
    institutionName: 'PIX Bank',
    accountName: 'My PIX Account',
    fiatAccountType: FiatAccountType.BankAccount,
    keyType: PIXKeyTypeEnum.RANDOM,
    key: 'a332fb0d-63d7-4cf6-af37-c607d9618714', // arbitrary uuid
  },
}

export const MOCK_FIAT_ACCOUNTS: Record<string, PostFiatAccountRequestBody> = {
  accountNumberNigeria,
  mobileMoneyKenya,
  accountNumberXOF,
  ibanNumberAustria,
  pixAccount,
}
