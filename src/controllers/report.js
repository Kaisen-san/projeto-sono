const db = require('../config/database')
const { ERROR_MESSAGES } = require('../utils/enums')

const renderMain = async (req, res, next) => {
  const { cookie } = req.token

  try {
    const years = db
      .distinct('year')
      .from('forms')

    const states = db
      .distinct('state')
      .from('results')

    res.status(200).render('report-main', {
      cookie: cookie,
      years: (await years.map(({ year }) => year)).sort(),
      states: (await states.map(({ state }) => state)).sort()
    })
  } catch (e) {
    console.error(e)
    res.status(200).render('report-main', {
      cookie: cookie,
      years: [],
      states: [],
      acceptTerms: []
    })
  }
}

const renderLogin = (req, res, next) => {
  res.status(200).render('report-login')
}

const generateReport = async (req, res, next) => {
  const { year, state, acceptTerms } = req.body

  if (typeof state !== 'string'
    || !Number.isSafeInteger(year)
    || !Number.isSafeInteger(acceptTerms)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_REQUEST_DATA
    })
  }

  try {
    let form = null

    if (year !== -1) {
      form = await db
      .select({
        id: 'id',
        year: 'year'
      })
      .from('forms')
      .where({ year: year })
      .first()
    } else {
      form = await db
      .select({
        id: 'id',
        year: 'year'
      })
      .from('forms')
      .orderBy('year', 'desc')
      .first()
    }

    if (form == null) {
      return res.status(404).json({
        error: ERROR_MESSAGES.INVALID_FORM_YEAR
      })
    }

    const headers = await db
      .select({ report: 'report' })
      .from('form_questions')
      .leftJoin('questions', 'id', 'id_question')
      .where({ id_form: form.id })

    const answersFilter = {
      id_form: form.id
    }

    let reportNameState = 'TodosEstados'

    if (state !== '-1') {
      answersFilter.state = state
      reportNameState = state
    }

    let reportNameTerms = 'AmbosTermos'

    if (acceptTerms !== -1) {
      answersFilter.accept_terms = acceptTerms
      reportNameTerms = acceptTerms === 1 ? 'AceitouTermos' : 'NaoAceitouTermos'
    }

    const answers = await db
      .select({
        id: 'id',
        acceptTerms: 'accept_terms',
        year: 'year',
        report: 'report'
      })
      .from('results')
      .where(answersFilter)
      .orderBy('id', 'asc')

    const reportHeaders = `ID;AnoQuestionario;AnoResposta;Concorda${headers.reduce((acc, cur) => `${acc};${cur.report}`, '')}`
    const reportAnswers = answers.reduce((acc, cur) => `${acc}${cur.id};${form.year};${cur.year};${Number(cur.acceptTerms)};${cur.report}\n`, '')
    const reportContent = `${reportHeaders}\n${reportAnswers}`
    const reportName = `Report_${form.year}_${reportNameState}_${reportNameTerms}.csv`

    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Length', reportContent.length)
    res.setHeader('Content-Disposition', `attachment; filename=${reportName}`)
    res.status(200).send(reportContent)
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

module.exports = {
  renderMain,
  renderLogin,
  generateReport
}
