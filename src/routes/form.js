const router = require('express').Router()

const controller = require('../controllers/form')
const middleware = require('../middlewares/form')

router.options('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

  res.sendStatus(204)
})

router.get('/', middleware.checkAuthenticated, controller.renderMain)
router.put('/', middleware.authenticateToken, controller.updateForm)
router.post('/', middleware.authenticateToken, controller.createNewForm)
router.get('/login', middleware.checkDeauthenticated, controller.renderLogin)
router.post('/login', middleware.authenticateUser)
router.delete('/logout', middleware.authenticateToken, middleware.deauthenticateUser)

module.exports = router
