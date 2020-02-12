const { QUESTION_TYPES } = require('../utils/enums')
const Type0 = require('./Type0')
const Type1 = require('./Type1')
const Type2 = require('./Type2')
const Type3 = require('./Type3')
const Type5 = require('./Type5')
const Type6 = require('./Type6')
const Type7 = require('./Type7')
const Type8 = require('./Type8')
const Type9 = require('./Type9')

const get = (type) => {
  switch (type) {
    case QUESTION_TYPES.TYPE0:
      return Type0
    case QUESTION_TYPES.TYPE1:
      return Type1
    case QUESTION_TYPES.TYPE2:
      return Type2
    case QUESTION_TYPES.TYPE3:
      return Type3
    case QUESTION_TYPES.TYPE5:
      return Type5
    case QUESTION_TYPES.TYPE6:
      return Type6
    case QUESTION_TYPES.TYPE7:
      return Type7
    case QUESTION_TYPES.TYPE8:
      return Type8
    case QUESTION_TYPES.TYPE9:
      return Type9
    default:
      return null
  }
}

const checkResultFields = ({ info, data }) => {
  if (!Array.isArray(data)
    || info == null
    || typeof info !== 'object'
    || !Number.isSafeInteger(info.idForm)
    || !Number.isSafeInteger(info.resultYear)
    || typeof info.resultState !== 'string'
    || !Number.isSafeInteger(info.acceptTerms)) {
    return false
  }

  return true
}

const checkResultQuestionFields = ({ type, answers }) => {
  const model = get(type)

  if (!Array.isArray(answers)
    || !Number.isSafeInteger(type)
    || model == null
    || answers.length < model.results.min
    || answers.length > model.results.max) {
    return false
  }

  return true
}

const parseQuestionsQuery = (questions) => {
  return questions.map(({ type, headers, answers, triggers }) => {
    const model = get(type)
    const parsedHeaders = _parseQueryField(headers)[0]
    const parsedAnswers = _parseQueryField(answers)
    let parsedTriggers = []
  
    if (triggers != null) {
      parsedTriggers = _parseQueryField(triggers)
    }
  
    const formatedAnswers = parsedAnswers.map((answer, index) => {
      const result = {}
      let triggersCounter = 0
  
      if (model.answers[index].type === 'options') {
        result.options = answer
  
        if (model.answers[index].hasTriggers) {
          result.unlockNext = parsedTriggers[triggersCounter].map(e => e == 1)
          triggersCounter++
        }
      } else if (model.answers[index].type === 'inputType') {
        result.inputType = answer[0]
      }
  
      return result
    })
  
    return {
      type: type,
      headers: parsedHeaders,
      answers: formatedAnswers
    }
  })
}

const _parseQueryField = (field) => {
  if (field == null) {
    return []
  }

  return field.split(';').reduce((acc, cur) => ([...acc, cur.split('|')]), [])
}

module.exports = {
  get,
  checkResultFields,
  checkResultQuestionFields,
  parseQuestionsQuery
}
