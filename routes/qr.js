var express = require('express')
var router = express.Router()
var QRCode = require('qrcode')
var QR = require('../models/QR')
var bcrypt = require('bcrypt')

var auth_middleware = require('../middlewares/auth')
var check_if_user_logged_in = auth_middleware.isAuth

// show dashboard screen
router.get('/dashboard', check_if_user_logged_in, function (req, res) {
    QR.find({ userId: req.user.id }).sort({ createdAt: -1 }).then(function (qr_list) {
        res.render('dashboard', { qrcodes: qr_list })
    }).catch(function (error_message) {
        res.send("Could not load dashboard page")
    })
})

router.get('/generate', check_if_user_logged_in, function (req, res) {
    res.render('generate', { error: null, qrImage: null })
})

router.post('/generate', check_if_user_logged_in, async function (req, res) {

    var qr_type_dropdown = req.body.type
    var generated_qr_text = ""
    var generated_short_link_code = null
    var is_single_use_scanned = false

    if (req.body.isOneTime == 'on') {
        is_single_use_scanned = true
    }

    if (qr_type_dropdown == 'URL' || qr_type_dropdown == 'Text') {
        generated_qr_text = req.body.content
        if (qr_type_dropdown == 'URL') {
            generated_short_link_code = Math.random().toString(36).substr(2, 6)
            generated_qr_text = 'http://localhost:3000/r/' + generated_short_link_code
        }
    } else if (qr_type_dropdown == 'Email') {
        generated_qr_text = "mailto:" + req.body.email + "?subject=" + req.body.subject + "&body=" + req.body.body
    } else if (qr_type_dropdown == 'Phone') {
        generated_qr_text = "tel:" + req.body.phone
    } else if (qr_type_dropdown == 'WiFi') {
        var wifi_encrypt = 'WPA'
        if (req.body.encryption) {
            wifi_encrypt = req.body.encryption
        }
        generated_qr_text = "WIFI:T:" + wifi_encrypt + ";S:" + req.body.ssid + ";P:" + req.body.password + ";;"
    } else if (qr_type_dropdown == 'Contact') {
        generated_qr_text = "BEGIN:VCARD\nVERSION:3.0\nN:" + req.body.lastName + ";" + req.body.firstName + "\nFN:" + req.body.firstName + " " + req.body.lastName + "\nTEL;TYPE=CELL:" + req.body.contactPhone + "\nEMAIL:" + req.body.contactEmail + "\nEND:VCARD"
    }

    if (generated_qr_text == "") {
        res.render('generate', { error: 'Please enter details to generate a QR.', qrImage: null })
        return
    }

    try {
        var new_qr_image_data = await QRCode.toDataURL(generated_qr_text)

        var final_hashed_password = null
        if (req.body.qrPassword && req.body.qrPassword != '') {
            var my_salt = await bcrypt.genSalt(10)
            final_hashed_password = await bcrypt.hash(req.body.qrPassword, my_salt)
        }

        var final_expiration_date = null
        if (req.body.expiry && req.body.expiry != '') {
            final_expiration_date = new Date(req.body.expiry)
        }

        var target_content = generated_qr_text
        if (req.body.content) {
            target_content = req.body.content
        }

        var new_qr_db_record = new QR({
            userId: req.user.id,
            type: qr_type_dropdown,
            content: target_content,
            qrImage: new_qr_image_data,
            isOneTime: is_single_use_scanned,
            qrPassword: final_hashed_password,
            expiresAt: final_expiration_date
        })

        if (generated_short_link_code != null) {
            new_qr_db_record.shortId = generated_short_link_code
        }

        await new_qr_db_record.save()
        res.redirect('/qr/dashboard')

    } catch (err) {
        res.render('generate', { error: 'Server error generating QR code.', qrImage: null })
    }
})

router.post('/delete/:id', check_if_user_logged_in, function (req, res) {
    var document_id_to_delete = req.params.id
    QR.findOneAndDelete({ _id: document_id_to_delete, userId: req.user.id }).then(function () {
        res.redirect('/qr/dashboard')
    }).catch(function () {
        res.redirect('/qr/dashboard')
    })
})

module.exports = router
