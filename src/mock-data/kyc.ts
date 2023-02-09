import {
  IdentificationDocumentType,
  KycSchema,
} from '@fiatconnect/fiatconnect-types'
import { AddKycParams } from '@fiatconnect/fiatconnect-sdk'
import { BASE64_IMAGE } from './data'

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

export const MOCK_KYC: Record<string, AddKycParams<KycSchema>> = {
  personalDataAndDocumentsNigeria,
  personalDataAndDocumentsAustria,
  personalDataAndDocumentsXOF,
  personalDataAndDocumentsDetailedAustria,
}
