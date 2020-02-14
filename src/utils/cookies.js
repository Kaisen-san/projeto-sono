const jwt = require('jsonwebtoken')

const parseCookies = (cookie) => {
  if (cookie == null) {
    return {}
  }

  return cookie.split(';').reduce((acc, cur) => {
    const keyValue = cur.split('=')

    return {
      ...acc,
      [keyValue[0].trim()]: keyValue[1].trim()
    }
  }, {})
}

const generateTokenCookie = (tokenName, signPayload) => {
  const token = jwt.sign(
    signPayload,
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  return `${tokenName}=${token}; max-age=604800; path=/` // 7 days timestamp in seconds
}

const isToRenewTokenCookie = (expirationTimestamp) => {
  const timeToExpire = new Date(expirationTimestamp * 1000) - Date.now()

  if (timeToExpire > 0 && timeToExpire < 172800000) { // 2 days timestamp in ms
    return true
  }

  return false
}

const generateRemovableTokenCookie = (tokenName) => {
  return `${tokenName}= ; max-age=0; path=/`
}

module.exports = {
  parseCookies,
  generateTokenCookie,
  isToRenewTokenCookie,
  generateRemovableTokenCookie
}
