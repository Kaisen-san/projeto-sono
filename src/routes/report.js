const router = require('express').Router()

const controller = require('../controllers/report')
const middleware = require('../middlewares/report')

router.options('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE')

  res.sendStatus(204)
})

router.get('/', middleware.checkAuthenticated, controller.renderMain)
router.post('/', middleware.authenticateToken, controller.generateReport)
router.get('/login', middleware.checkDeauthenticated, controller.renderLogin)
router.post('/login', middleware.authenticateUser)
router.delete('/logout', middleware.authenticateToken, middleware.deauthenticateUser)

module.exports = router
