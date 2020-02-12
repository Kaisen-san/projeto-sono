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
  const { username, password } = req.body

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_REQUEST_DATA
    })
  }

  try {
    const user = await db
      .select({ hashedPassword: 'password' })
      .from('users')
      .where({ username })
      .first()

    if (user == null || !await bcrypt.compare(password, user.hashedPassword)) {
      return res.status(401).json({
        error: ERROR_MESSAGES.INVALID_CREDENTIALS
      })
    }

    const tokenCookie = generateTokenCookie('formToken', {
      name: username,
      realm: REALMS.FORM
    })

    res.status(200).json({
      cookie: tokenCookie,
      redirectTo: '/form'
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
    cookie: generateRemovableTokenCookie('formToken'),
    redirectTo: '/form/login'
  })
}

const authenticateToken = (req, res, next) => {
  const { formToken: token } = parseCookies(req.headers.cookie)

  if (token == null) {
    return res.status(401).json({
      error: ERROR_MESSAGES.INVALID_TOKEN,
      redirectTo: '/form/login'
    })
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.FORM) {
      return res.status(403).json({
        error: ERROR_MESSAGES.INVALID_TOKEN_REALM,
        redirectTo: '/form/login'
      })
    }

    req.token = {
      payload: payload
    }

    if (isToRenewTokenCookie(payload.exp)) {
      req.token.cookie = generateTokenCookie('formToken', {
        name: payload.name,
        realm: payload.realm
      })
    }

    next()
  } catch (e) {
    console.error(e)
    res.status(401).json({
      error: ERROR_MESSAGES.INVALID_TOKEN,
      redirectTo: '/form/login'
    })
  }
}

const checkAuthenticated = (req, res, next) => {
  const { formToken: token } = parseCookies(req.headers.cookie)

  if (token == null) {
    return res.redirect('/form/login')
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.FORM) {
      return res.redirect('/form/login')
    }

    req.token = {
      payload: payload
    }

    if (isToRenewTokenCookie(payload.exp)) {
      req.token.cookie = generateTokenCookie('formToken', {
        name: payload.name,
        realm: payload.realm
      })
    }

    next()
  } catch (e) {
    console.error(e)
    res.redirect('/form/login')
  }
}

const checkDeauthenticated = (req, res, next) => {
  const { formToken: token } = parseCookies(req.headers.cookie)

  if (token == null) {
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.FORM) {
      return next()
    }

    res.redirect('/form')
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
