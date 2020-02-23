const db = require('../config/database')
const Model = require('../models/Model')
const { ERROR_MESSAGES } = require('../utils/enums')

const retrieveForm = async (req, res, next) => {
  try {
    const form = await db
      .select({ id: 'id' })
      .from('forms')
      .orderBy('year', 'desc')
      .first()

    if (form == null) {
      return res.status(404).json({
        error: ERROR_MESSAGES.NO_FORM_AVAILABLE
      })
    }

    // No SQL Joins are used here because we want to preserve the form questions order,
    // which wouldn't be possible using Joins since its 'on' condition matches columns
    // as they come up, which would be a problem whenever a question was updated
    // because it goes to the bottom of its table (at least on PostgreSQL)
    const formQuestions = await db
      .select({
        idQuestion: 'id_question'
      })
      .from('form_questions')
      .where({ id_form: form.id })

    const questionsIds = formQuestions.map(({ idQuestion }) => idQuestion)

    const questions = await db
      .select({
        id: 'id',
        type: 'type',
        headers: 'headers',
        answers: 'answers',
        triggers: 'triggers'
      })
      .from('questions')
      .whereIn('id', questionsIds)

    // It is necessary to manually reorder the questions because the solution above
    // doesn't work for all PostgreSQL instances. The reason is still unknown, but
    // even after changing some of PostgreSQL flags, like join_collapse_limit and
    // from_collapse_limit, doesn't change this behavior
    const orderedQuestions = []

    questionsIds.forEach(id => orderedQuestions.push(questions.find(q => q.id === id)))

    const data = Model.parseQuestionsQuery(orderedQuestions)

    res.status(200).json({
      info: {
        idForm: form.id
      },
      data: data
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

const uploadResult = async (req, res, next) => {
  const { info, data } = req.body

  if (!Model.checkResultFields({ info, data })) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_REQUEST_DATA
    })
  }

  try {
    const form = await db
      .select({ id: 'id' })
      .from('forms')
      .where({ id: info.idForm })
      .first()

    if (form == null) {
      return res.status(404).json({
        error: ERROR_MESSAGES.INVALID_FORM_ID
      })
    }

    const { numberOfQuestions } = await db
      .count('* AS numberOfQuestions')
      .from('form_questions')
      .where({ id_form: info.idForm })
      .first()

    if (numberOfQuestions != data.length) {
      return res.status(400).json({
        error: ERROR_MESSAGES.INVALID_REQUEST_DATA
      })
    }

    let report = ''

    for (question of data) {
      if (!Model.checkResultQuestionFields(question)) {
        return res.status(400).json({
          error: ERROR_MESSAGES.INVALID_REQUEST_DATA
        })
      }

      report += question.answers.reduce((acc, cur) => acc + ';' + cur.toString().replace(/;/g, ','), '')
    }

    report = report.substr(1) // removes first ';'

    await db
      .insert({
        id_form: info.idForm,
        accept_terms: info.acceptTerms,
        year: info.resultYear,
        state: info.resultState,
        report: report
      })
      .into('results')

    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

module.exports = {
  retrieveForm,
  uploadResult
}
