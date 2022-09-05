import { KycSchema } from '@fiatconnect/fiatconnect-types'
import { AddKycParams } from '@fiatconnect/fiatconnect-sdk'

const validBase64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='

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
    selfieDocument: validBase64Image,
    identificationDocument: validBase64Image,
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

const personalDataAndDocumentsColombia: AddKycParams<KycSchema.PersonalDataAndDocuments> =
{
  ...personalDataAndDocumentsNigeria,
  data: {
    ...personalDataAndDocumentsNigeria.data,
    address: {
      ...personalDataAndDocumentsNigeria.data.address,
      isoCountryCode: 'CO',
      isoRegionCode: 'CO-DC', // Bogotá
    },
  },
}

export const MOCK_KYC: Record<string, AddKycParams<KycSchema>> = {
  personalDataAndDocumentsNigeria,
  personalDataAndDocumentsAustria,
  personalDataAndDocumentsXOF,
  personalDataAndDocumentsColombia
}
