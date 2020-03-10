const router = require('express').Router()

const controller = require('../controllers/api-v1')
const middleware = require('../middlewares/api-v1')

router.options('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST')

  res.sendStatus(204)
})

router.get('/', (req, res, next) => { res.status(200).json({ msg: 'Bem-vindo à API do Projeto Sono' }) })
router.get('/form', middleware.authenticateToken, controller.retrieveForm)
router.post('/result', middleware.authenticateToken, controller.uploadResult)
router.post('/login', middleware.authenticateUser)

module.exports = router
