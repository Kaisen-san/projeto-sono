const db = require('../config/database')
const { ERROR_MESSAGES } = require('../utils/enums')

const renderMain = (req, res, next) => {
  const { cookie, payload } = req.token

  res.status(200).render('form-main', { cookie: cookie })
}

const renderLogin = (req, res, next) => {
  res.status(200).render('form-login')
}

const updateForm = async (req, res, next) => {
  const { cookie, payload } = req.token

  res.sendStatus(204)
}

const createNewForm = async (req, res, next) => {
  const { cookie, payload } = req.token

  res.sendStatus(204)
}

module.exports = {
  renderMain,
  renderLogin,
  updateForm,
  createNewForm
}
