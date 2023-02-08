import {
  IdentificationDocumentType,
  KycSchema,
} from '@fiatconnect/fiatconnect-types'
import { AddKycParams } from '@fiatconnect/fiatconnect-sdk'

const personalDataAndDocumentsNigeria: AddKycParams<KycSchema.PersonalDataAndDocuments> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocuments,
    data: {
      lastName: 'Bob',
      firstName: 'Alice',
      middleName: 'Foo',
      dateOfBirth: {
        day: '12',
        year: '1994',
        month: '4',
      },
      address: {
        city: 'Lagos',
        address1: 'No 15',
        address2: 'string',
        postalCode: '100001',
        isoRegionCode: 'KD',
        isoCountryCode: 'NG',
      },
      phoneNumber: '07037205555',
      selfieDocument: 'abc',
      identificationDocument: 'def',
    },
  }

const {
  identificationDocument: identificationDocumentNigeria,
  ...remainingInformationNigeria
} = personalDataAndDocumentsNigeria.data
const personalDataAndDocumentsDetailedNigeria: AddKycParams<KycSchema.PersonalDataAndDocumentsDetailed> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocumentsDetailed,
    data: {
      ...remainingInformationNigeria,
      email: 'some-email',
      identificationDocumentType: IdentificationDocumentType.PAS,
      identificationDocumentFront: 'Place base64 string of document here',
    },
  }

const personalDataAndDocumentsAustria: AddKycParams<KycSchema.PersonalDataAndDocuments> =
  {
    ...personalDataAndDocumentsNigeria,
    data: {
      ...personalDataAndDocumentsNigeria.data,
      address: {
        ...personalDataAndDocumentsNigeria.data.address,
        isoCountryCode: 'AT',
        isoRegionCode: 'AT-5', // Salzburg
      },
    },
  }

const {
  identificationDocument: identificationDocumentAustria,
  ...remainingInformationAustria
} = personalDataAndDocumentsAustria.data
const personalDataAndDocumentsDetailedAustria: AddKycParams<KycSchema.PersonalDataAndDocumentsDetailed> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocumentsDetailed,
    data: {
      ...remainingInformationAustria,
      email: 'some-email',
      identificationDocumentType: IdentificationDocumentType.PAS,
      identificationDocumentFront: 'Place base64 string of document here',
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

const {
  identificationDocument: identificationDocumentXOF,
  ...remainingInformationXOF
} = personalDataAndDocumentsAustria.data
const personalDataAndDocumentsDetailedXOF: AddKycParams<KycSchema.PersonalDataAndDocumentsDetailed> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocumentsDetailed,
    data: {
      ...remainingInformationXOF,
      email: 'some-email',
      identificationDocumentType: IdentificationDocumentType.PAS,
      identificationDocumentFront: 'Place base64 string of document here',
    },
  }

export const MOCK_KYC: Record<string, AddKycParams<KycSchema>> = {
  personalDataAndDocumentsNigeria,
  personalDataAndDocumentsAustria,
  personalDataAndDocumentsXOF,
  personalDataAndDocumentsDetailedNigeria,
  personalDataAndDocumentsDetailedAustria,
  personalDataAndDocumentsDetailedXOF,
}
