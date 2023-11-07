// Could also be a file or secret.
export const ISSUER_DID = {
  "did": {
    "did": "did:ethr:maticmum:0x18C6038c8D15d5d5425294218E3c3172d4Ae5539",
    "keyPair": {
      "algorithm": "ES256K",
      "publicKey": "0207adcf3369f7962750f7ad2d4d1e159ee5b33ce02ccadbeb8d877c05ae83d8d4",
      "privateKey": "0x996287d5e913fcaa0bbd9044e74fb1612b35bc3ec104db261f9641c2304bee3a"
    }
  }
}

const EXAMPLE_DID_VALUES = {
  // the following fields are defined in the schema, but not all are required to be filled in
  firstName: "John",
  lastName: "Dough",
  dateOfBirth: "1990-07-03T10:12:00Z",
  street: "123 Main Street",
  city: "Springfield",
  state: "MD",
  zip: "12345",
  country: "US",
  authorityName: "DMV of Springfield",
  dateOfIssuance: "2019-07-03T10:12:00Z",
  dateOfExpiration: "2032-07-03T10:12:00Z",
  documentType: "DriversLicense",
  documentNumber: "123-456-7890",
  // extra information we'd like to include in the credential (not part of the credential schema)
  additionalData: "Individual was verified in person",
  registeredOnline: true
};