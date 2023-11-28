const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact.controller');

router.post('/contact', controller.sendMessage);

//router.get('/contact', controller.getMessages);

router.get('/contact', controller.getMessages);

module.exports = router;