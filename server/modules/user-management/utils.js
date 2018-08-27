const crypto = require('crypto')

class Utils {
    constructor() {
        this._secret = '4a66f657d19b6a1d02df9ca6436091e94a3002e6bfd7a991e20c48220f8112c6'
    }
    
    encrypt(data) {
       let hash = crypto.createHmac('sha256', this._secret)
                    .update(data).digest('hex')
        return hash
    }

    encryptPassword(password) {
        return this.encrypt(password)
    }

    generateVerificationCode() {
        let date = new Date()
        return this.encrypt(date.toString())
    }

}

module.exports = Utils