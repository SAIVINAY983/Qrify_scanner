var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var User = require('../models/User')
var authMid = require('../middlewares/auth')

router.post('/signup', authMid.redirectIfAuth, function (req, res) {
    var user_name = req.body.username
    var user_email = req.body.email
    var user_password = req.body.password

    User.findOne({ email: user_email }).then(function (foundUser) {
        if (foundUser) {
            res.render('signup', { error: 'This email is already registered.' })
        } else {
            bcrypt.genSalt(10, function (err, generated_salt) {
                bcrypt.hash(user_password, generated_salt, function (err, secured_password) {
                    var new_user_account = new User({
                        username: user_name,
                        email: user_email,
                        password: secured_password
                    })
                    new_user_account.save().then(function () {
                        res.redirect('/login')
                    }).catch(function () {
                        res.render('signup', { error: 'Database error when saving user.' })
                    })
                })
            })
        }
    })
})

router.post('/login', authMid.redirectIfAuth, function (req, res) {
    var check_email = req.body.email
    var check_password = req.body.password

    User.findOne({ email: check_email }).then(function (user_obj_from_db) {
        if (!user_obj_from_db) {
            res.render('login', { error: 'Invalid login details.' })
        } else {
            bcrypt.compare(check_password, user_obj_from_db.password, function (err, is_password_correct) {
                if (is_password_correct == true) {
                    var my_payload = { user: { id: user_obj_from_db.id } }
                    var generated_token = jwt.sign(my_payload, process.env.JWT_SECRET, { expiresIn: '1h' })
                    res.cookie('token', generated_token, { httpOnly: true })
                    res.redirect('/qr/dashboard')
                } else {
                    res.render('login', { error: 'Invalid login details.' })
                }
            })
        }
    }).catch(function (error) {
        res.render('login', { error: 'Server encountered an issue.' })
    })
})

router.get('/logout', function (req, res) {
    res.clearCookie('token')
    res.redirect('/login')
})

module.exports = router
