const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../config/database')
const { REALMS, ERROR_MESSAGES } = require('../utils/enums')
const {
  parseCookies,
  generateTokenCookie,
  isToRenewTokenCookie,
  generateRemovableTokenCookie
} = require('../utils/cookies')

const authenticateUser = async (req, res, next) => {
  const { password } = req.body

  if (typeof password !== 'string') {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_REQUEST_DATA
    })
  }

  try {
    const form = await db
      .select({ hashedPassword: 'password' })
      .from('forms')
      .orderBy('year', 'desc')
      .first()

    if (form == null) {
      return res.status(404).json({
        error: ERROR_MESSAGES.NO_FORM_AVAILABLE
      })
    }

    if (!await bcrypt.compare(password, form.hashedPassword)) {
      return res.status(401).json({
        error: ERROR_MESSAGES.INVALID_PASSWORD
      })
    }

    const tokenCookie = generateTokenCookie('reportToken', {
      realm: REALMS.REPORT
    })

    res.status(200).json({
      cookie: tokenCookie,
      redirectTo: '/report'
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

const deauthenticateUser = (req, res, next) => {
  res.status(200).json({
    cookie: generateRemovableTokenCookie('reportToken'),
    redirectTo: '/report/login'
  })
}

const authenticateToken = (req, res, next) => {
  const { reportToken: token } = parseCookies(req.headers.cookie)

  if (token == null) {
    return res.status(401).json({
      error: ERROR_MESSAGES.INVALID_TOKEN,
      redirectTo: '/report/login'
    })
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.REPORT) {
      return res.status(403).json({
        error: ERROR_MESSAGES.INVALID_TOKEN_REALM,
        redirectTo: '/report/login'
      })
    }

    req.token = {
      payload: payload
    }

    if (isToRenewTokenCookie(payload.exp)) {
      req.token.cookie = generateTokenCookie('reportToken', {
        realm: payload.realm
      })
    }

    next()
  } catch (e) {
    console.error(e)
    res.status(401).json({
      error: ERROR_MESSAGES.INVALID_TOKEN,
      redirectTo: '/report/login'
    })
  }
}

const checkAuthenticated = (req, res, next) => {
  const { reportToken: token } = parseCookies(req.headers.cookie)

  if (token == null) {
    return res.redirect('/report/login')
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.REPORT) {
      return res.redirect('/report/login')
    }

    req.token = {
      payload: payload
    }

    if (isToRenewTokenCookie(payload.exp)) {
      req.token.cookie = generateTokenCookie('reportToken', {
        realm: payload.realm
      })
    }

    next()
  } catch (e) {
    console.error(e)
    res.redirect('/report/login')
  }
}

const checkDeauthenticated = (req, res, next) => {
  const { reportToken: token } = parseCookies(req.headers.cookie)

  if (token == null) {
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.REPORT) {
      return next()
    }

    res.redirect('/report')
  } catch (e) {
    console.error(e)
    next()
  }
}

module.exports = {
  authenticateUser,
  deauthenticateUser,
  authenticateToken,
  checkAuthenticated,
  checkDeauthenticated
}
