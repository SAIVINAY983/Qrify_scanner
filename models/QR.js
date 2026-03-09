var m = require('mongoose')
module.exports = m.model('QR', new m.Schema({
    userId: { type: m.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    content: String,
    qrImage: String,
    shortId: { type: String, sparse: true },
    isOneTime: Boolean,
    hasBeenScanned: Boolean,
    expiresAt: Date,
    qrPassword: String
}, { timestamps: true }))
