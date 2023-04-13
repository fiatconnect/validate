import {
  IdentificationDocumentType,
  KycSchema,
} from '@fiatconnect/fiatconnect-types'
import {AddKycParams} from '@fiatconnect/fiatconnect-sdk'
import {BASE64_IMAGE} from './data'

const personalDetails = {
  firstName: 'Alice',
  lastName: 'Bob',
  middleName: 'Foo',
  dateOfBirth: {
    day: '12',
    year: '1994',
    month: '4',
  },
  phoneNumber: '07037205555',
  selfieDocument: BASE64_IMAGE,
}

const personalDataAndDocumentsNigeria: AddKycParams<KycSchema.PersonalDataAndDocuments> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocuments,
    data: {
      ...personalDetails,
      address: {
        city: 'Lagos',
        address1: 'No 15',
        address2: 'string',
        postalCode: '100001',
        isoRegionCode: 'KD',
        isoCountryCode: 'NG',
      },
      identificationDocument: BASE64_IMAGE,
    },
  }

const personalDataAndDocumentsKenya: AddKycParams<KycSchema.PersonalDataAndDocuments> = {
  ...personalDataAndDocumentsNigeria,
  data: {
    ...personalDataAndDocumentsNigeria.data,
    address: {
      city: 'Mombasa',
      address1: '1234 Malindi Road',
      address2: 'Apartment 5B',
      postalCode: '80100',
      isoRegionCode: 'MBA',
      isoCountryCode: 'KE',
    },
  }
}

const personalDataAndDocumentsAustria: AddKycParams<KycSchema.PersonalDataAndDocuments> =
  {
    ...personalDataAndDocumentsNigeria,
    data: {
      ...personalDataAndDocumentsNigeria.data,
      address: {
        city: 'Salzburg',
        address1: 'Aust Square 14',
        postalCode: '40035',
        isoCountryCode: 'AT',
        isoRegionCode: 'AT-5', // Salzburg
      },
    },
  }

const personalDataAndDocumentsDetailedAustria: AddKycParams<KycSchema.PersonalDataAndDocumentsDetailed> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocumentsDetailed,
    data: {
      ...personalDetails,
      address: personalDataAndDocumentsAustria.data.address,
      email: 'someemail@gmail.com',
      identificationDocumentType: IdentificationDocumentType.PAS,
      identificationDocumentFront:
      personalDataAndDocumentsAustria.data.identificationDocument,
    },
  }

const personalDataAndDocumentsXOF: AddKycParams<KycSchema.PersonalDataAndDocuments> =
  {
    ...personalDataAndDocumentsNigeria,
    data: {
      ...personalDataAndDocumentsNigeria.data,
      address: {
        ...personalDataAndDocumentsNigeria.data.address,
        isoCountryCode: 'CI',
      },
    },
  }

const personalDataWithDocumentsDetailedBrazil: AddKycParams<KycSchema.PersonalDataAndDocumentsDetailed> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocumentsDetailed,
    data: {
      ...personalDataAndDocumentsNigeria.data,
      address: {
        address1: '12 street ave',
        city: 'Sao Paulo',
        isoRegionCode: 'BR-SP',
        postalCode: '50000000',
        isoCountryCode: 'BR',
      },
      email: 'mock@email.com',
      phoneNumber: '15551234567',
      selfieDocument: BASE64_IMAGE,
      identificationDocumentBack: BASE64_IMAGE,
      identificationDocumentType: IdentificationDocumentType.DL,
      identificationDocumentFront: BASE64_IMAGE,
    },
  }

export const MOCK_KYC: Record<string, AddKycParams<KycSchema>> = {
  personalDataAndDocumentsNigeria,
  personalDataAndDocumentsKenya,
  personalDataAndDocumentsAustria,
  personalDataAndDocumentsXOF,
  personalDataAndDocumentsDetailedAustria,
  personalDataWithDocumentsDetailedBrazil,
}
