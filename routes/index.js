let {Router} = require('express');
let router = Router();

let checkAuth = require('../middleware/checkAuth');

  router.get('/', require('./frontpage').get);

  router.get('/login', require('./login').get);
  router.post('/login', require('./login').post);

  router.post('/logout', require('./logout').post);

  router.get('/battleship', checkAuth, require('./battleship').get);





module.exports = router;
