var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var QR = require('../models/QR')
var auth_mid = require('../middlewares/auth')

router.get('/', function (req, res) {
    res.render('home')
})

router.get('/login', auth_mid.redirectIfAuth, function (req, res) {
    res.render('login', { error: null })
})

router.get('/signup', auth_mid.redirectIfAuth, function (req, res) {
    res.render('signup', { error: null })
})

// handling the redirect route
router.get('/r/:id', function (req, res) {
    var incoming_scanned_id = req.params.id

    QR.findOne({ shortId: incoming_scanned_id }).then(function (qr_code_from_db) {
        if (qr_code_from_db) {
            // check expiry
            if (qr_code_from_db.expiresAt != null && new Date() > qr_code_from_db.expiresAt) {
                res.send("Sorry, this QR Link has expired.")
            } else {
                if (qr_code_from_db.qrPassword != null) {
                    res.render('unlock', { codeId: incoming_scanned_id, error: null })
                } else {
                    if (qr_code_from_db.isOneTime == true) {
                        if (qr_code_from_db.hasBeenScanned == true) {
                            res.send("This single-use QR Code has already been scanned.")
                        } else {
                            qr_code_from_db.hasBeenScanned = true
                            qr_code_from_db.save().then(function () {
                                var final_target_url = qr_code_from_db.content
                                if (final_target_url.indexOf('http') == -1) {
                                    final_target_url = 'https://' + final_target_url
                                }
                                res.redirect(final_target_url)
                            })
                        }
                    } else {
                        var regular_target_url = qr_code_from_db.content
                        if (regular_target_url.indexOf('http') == -1) {
                            regular_target_url = 'https://' + regular_target_url
                        }
                        res.redirect(regular_target_url)
                    }
                }
            }
        } else {
            res.send("Invalid or broken QR Link.")
        }
    }).catch(function (err) {
        res.send("Server encountered an issue.")
    })
})

router.post('/r/:id', function (req, res) {
    var expected_qr_id = req.params.id
    var user_entered_password = req.body.password

    QR.findOne({ shortId: expected_qr_id }).then(function (qr_record_in_db) {
        if (qr_record_in_db) {
            if (qr_record_in_db.expiresAt && new Date() > qr_record_in_db.expiresAt) {
                res.send("Sorry, this QR Link has expired.")
                return
            }

            bcrypt.compare(user_entered_password, qr_record_in_db.qrPassword, function (err, is_pass_matched) {
                if (is_pass_matched == true) {
                    if (qr_record_in_db.isOneTime) {
                        if (qr_record_in_db.hasBeenScanned) {
                            res.send("This single-use QR Code has already been scanned.")
                        } else {
                            qr_record_in_db.hasBeenScanned = true
                            qr_record_in_db.save().then(function () {
                                var redirect_url_one_time = qr_record_in_db.content
                                if (redirect_url_one_time.indexOf('http') == -1) {
                                    redirect_url_one_time = 'https://' + redirect_url_one_time
                                }
                                res.redirect(redirect_url_one_time)
                            })
                        }
                    } else {
                        var redirect_url_normal = qr_record_in_db.content
                        if (redirect_url_normal.indexOf('http') == -1) {
                            redirect_url_normal = 'https://' + redirect_url_normal
                        }
                        res.redirect(redirect_url_normal)
                    }
                } else {
                    res.render('unlock', { codeId: expected_qr_id, error: "Incorrect password entered." })
                }
            })
        } else {
            res.send("Invalid or broken QR Link.")
        }
    }).catch(function (err) {
        res.send("Server encountered an issue.")
    })
})

module.exports = router
