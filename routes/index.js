const router = require('express').Router();

router.use(require('./trucks.route'));
router.use(require('./bags.route'));

module.exports = router;