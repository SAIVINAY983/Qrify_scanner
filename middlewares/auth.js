var jwt = require('jsonwebtoken')

function isAuth(req, res, next) {
    var t = req.cookies.token
    if (!t) {
        res.redirect('/login')
        return
    }

    try {
        var decodedData = jwt.verify(t, process.env.JWT_SECRET)
        req.user = decodedData.user
        next()
    } catch (err) {
        res.clearCookie('token')
        res.redirect('/login')
    }
}

function redirectIfAuth(req, res, next) {
    var t = req.cookies.token
    if (t) {
        try {
            jwt.verify(t, process.env.JWT_SECRET)
            res.redirect('/qr/dashboard')
        } catch (err) {
            next()
        }
    } else {
        next()
    }
}

module.exports = { isAuth, redirectIfAuth }
