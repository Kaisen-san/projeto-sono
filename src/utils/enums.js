const REALMS = {
  APIV1: 'APIV1',
  FORM: 'FORM',
  REPORT: 'REPORT'
}

const ERROR_MESSAGES = {
  INVALID_PASSWORD: 'Invalid password. Please try again with a valid password.',
  INVALID_CREDENTIALS: 'Invalid username and/or password. Please try again with valid credentials.',
  NO_FORM_AVAILABLE: 'There is no form available at this moment. Please try again later.',
  INVALID_FORM_ID: 'There is no form available with the given id. Please try again with a valid id.',
  INVALID_FORM_YEAR: 'There is no form available with the given year. Please try again with a valid year.',
  INVALID_REQUEST_DATA: 'Invalid request data. Make sure you are sending all the required fields.',
  INVALID_TOKEN: 'Invalid token. Please try again with a valid token.',
  INVALID_TOKEN_REALM: 'Invalid token realm. Please try again with a valid token realm.',
  INTERNAL_SERVER_ERROR: 'An internal server error has occured while processing the request. Please try again later.'
}

const QUESTION_TYPES = {
  TYPE0: 0,
  TYPE1: 1,
  TYPE2: 2,
  TYPE3: 3,
  TYPE5: 5,
  TYPE6: 6,
  TYPE7: 7,
  TYPE8: 8,
  TYPE9: 9
}

module.exports = {
  REALMS,
  ERROR_MESSAGES,
  QUESTION_TYPES
}
