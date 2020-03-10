const express = require('express');
const router = express.Router();
const authService = require('./auth.service');
module.exports = router;

router.post('/register', createUser);
router.post('/login', loginUser);


function createUser(req, res, next) {
    authService.createUser(req.body)
        .then((data) => res.json(data))
        .catch((err) => next(err));
}

function loginUser(req, res, next) {
    authService.loginUser(req.body)
        .then((data) => res.json(data))
        .catch((err) => next(err));
}