import {IdentificationDocumentType, KycSchema} from '@fiatconnect/fiatconnect-types'
import {AddKycParams} from '@fiatconnect/fiatconnect-sdk'

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

const personalDataWithDocumentsDetailedBrazil: AddKycParams<KycSchema.PersonalDataAndDocumentsDetailed> =
  {
    kycSchemaName: KycSchema.PersonalDataAndDocumentsDetailed,
    data: {
      ...personalDataAndDocumentsNigeria.data,
      address: {
        address1: '12 street ave',
        city: 'Sao Paulo',
        isoRegionCode: 'BR-SP',
        isoCountryCode: 'BR'
      },
      email: 'mock@email.com',
      phoneNumber: '15551234567',
      identificationDocumentBack: 'id_back',
      identificationDocumentType: IdentificationDocumentType.DL,
      identificationDocumentFront: 'id_front'
    }
  }

export const MOCK_KYC: Record<string, AddKycParams<KycSchema>> = {
  personalDataAndDocumentsNigeria,
  personalDataAndDocumentsAustria,
  personalDataAndDocumentsXOF,
  personalDataWithDocumentsDetailedBrazil
}
