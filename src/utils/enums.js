const REALMS = {
  APIV1: 'APIV1',
  FORM: 'FORM',
  REPORT: 'REPORT'
}

const ERROR_MESSAGES = {
  INVALID_PASSWORD: 'Senha inválida. Por favor, tente novamente com uma senha válida.',
  INVALID_CREDENTIALS: 'Senha inválida usuário e/ou senha. Por favor, tente novamente com credenciais válidas.',
  NO_FORM_AVAILABLE: 'Não há questionário disponível no momento. Por favor, tente novamente mais tarde.',
  INVALID_FORM_ID: 'Não há questionário disponível com o id informado. Por favor, tente novamente com um id válido.',
  INVALID_FORM_YEAR: 'Não há questinário disponível com o ano informado. Por favor, tente novamente com um ano válido.',
  INVALID_REQUEST_DATA: 'Dados da requisição inválidos. Certifique-se de enviar todos os campos necessários.',
  INVALID_TOKEN: 'Token inválido. Por favor, tente novamente com um token válido.',
  INVALID_TOKEN_REALM: 'Domínio do token inválido. Por favor, tente novamente com um domínio de token válido.',
  INTERNAL_SERVER_ERROR: 'Ocorreu um erro interno no servidor ao processar a requisição. Por favor, tente novamente mais tarde.'
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
