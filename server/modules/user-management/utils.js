const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

class Utils {
    constructor() {
        this._secret = '4a66f657d19b6a1d02df9ca6436091e94a3002e6bfd7a991e20c48220f8112c6'
        sgMail.setApiKey('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');

    }
    
    encrypt(data) {
       let hash = crypto.createHmac('sha256', this._secret)
                    .update(data).digest('hex')
        return hash
    }

    encryptPassword(password) {
        return this.encrypt(password)
    }

    generateVerificationLink() {
        let date = new Date()
        return this.encrypt(date.toString())
    }

    sendVerificationEmail(to) {
        const msg = {
            to: to,
            from:'support@capmesh.com',
            subject: 'Sending from capmesh',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        try {
            sgMail.send()
        }
        catch (err) {
            console.log("err")
        }
        
    }
}

utils = new Utils() 
//console.log(utils.encryptPassword("hsagarthegr8"))

console.log(utils.generateVerificationLink())
//utils.sendVerificationEmail('hsagarthegr8@gmail.com')