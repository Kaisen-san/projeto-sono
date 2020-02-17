const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../config/database')
const { REALMS, ERROR_MESSAGES } = require('../utils/enums')

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

    const token = jwt.sign(
      { realm: REALMS.APIV1 },
      process.env.TOKEN_SECRET,
      { expiresIn: '90d' }
    )

    res.status(200).json({ token: token })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).json({
      error: ERROR_MESSAGES.INVALID_TOKEN
    })
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    if (payload.realm == null || payload.realm !== REALMS.APIV1) {
      return res.status(403).json({
        error: ERROR_MESSAGES.INVALID_TOKEN_REALM
      })
    }

    req.token = {
      payload: payload
    }

    next()
  } catch (e) {
    console.error(e)
    res.status(401).json({
      error: ERROR_MESSAGES.INVALID_TOKEN
    })
  }
}

module.exports = {
  authenticateUser,
  authenticateToken
}
