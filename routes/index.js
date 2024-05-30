const router = require('express').Router();

router.use(require('./trucks.route'));
router.use(require('./bags.route'));
router.use(require('./auth.route'));

module.exports = router;