const Dao = require('../data-access/data-access')
const dao = new Dao()
const Utils = require('../user-management/utils')
const DefaultObj = require('./schema');
const utils = new Utils()
var email;

class organizationManagement {
    constructor() {
        this.AUTH = "auth-orgs"
        this.ORG = "organizations"
        this.VERIFY = "verification-orgs"
        this.FORGET = "forget-orgs"
    }
    async findAll() {
        let resultFindAll = await dao.find(this.ORG);
        return resultFindAll;
    }
    //inserting details into database from signUp form
    async signupInsert(req) {
        let obj = req;
        console.log(DefaultObj);
        delete obj.password;
        obj = {
            ...obj,
            ...DefaultObj
        }
        console.log(obj);

        let result;
        try {
            result = await dao.insert(this.ORG, obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }
    //inserting email and password into authUsers collection
    async authInsert(req) {
        let hashPassword = utils.encryptPassword(req.password)
        let obj = { email: req.email, password: hashPassword };
        console.log(hashPassword)
        let result
        try {
            result = await dao.insert(this.AUTH, obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    //verification insertion
    async verifyInsert(req) {
        let link = utils.generateVerificationCode();
        console.log(link)
        let obj = { verificationCode: link, companyID: req.companyID };
        let result;
        try {
            result = await dao.insert(this.VERIFY, obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }
    // Deleting verified users in the Verifications 
    async deleteVerifiedUser(req) {
        let orgFind = await dao.find(this.VERIFY, { companyID: req.companyID })
        if (orgFind.length == 1) {
            if (orgFind[0].companyID === req.companyID && orgFind[0].verificationCode === req.verificationCode) {
                let verifyUpdate = await dao.update(this.ORG, { companyID: req.companyID }, { $set: { isVerified: true } })
                let result = await dao.delete(this.VERIFY, { companyID: req.companyID })
                return verifyUpdate;

            }
        }
        else {
            return "Account already verified!!!"
        }
    }

    async findVerificationData(userObj) {
        let userFind = await dao.find(this.VERIFY, { companyID: userObj.companyID })
        console.log(userFind);
        return userFind;
    }


    async verifiyPassword(req) {
        let result = await dao.find(this.ORG, { userName: req.userName });
        if (result[0].verificationCode == req.VerificationCode) {
            let log = await dao.delete(this.ORG, { userName: req.userName });
            return "done"
        }
        else {
            return "not"
        }
    }

    async updateVerifyCode(companyID) {
        let result
        let link = utils.generateVerificationCode();
        try {
            result = await dao.update(this.VERIFY, { companyID: companyID }, { $set: { verificationCode: link } })
        }
        catch (err) {
            result = { err: err }
        }
    }
    /**************************************login*************************************** */
    //verification for login
    async signin(req) {
        let log = await dao.find(this.ORG, { companyID: req.companyID })
        if (log.length == 1) {
            if (log[0].isDeleted === false) {
                let result = await dao.find(this.AUTH, { email: log[0].email })
                let hashPassword = utils.encryptPassword(req.password)
                if (result[0].password == hashPassword) {
                    if (log[0].isVerified == true) {

                        return "logged In";
                    }
                    else {
                        return "not verified";
                    }

                }
                else {
                    return "Incorrect Password";
                }
            }
            else {
                return "Account deleted";
            }
        }

        else {
            return "Username not found";
        }
    }

    async forgotPassword(req) {
        let result = await dao.find(this.ORG, { companyID: req.companyID })
        if (result.length) {
            if (result[0].companyID == req.companyID) {
                //this.email=result[0].email;
                let link = utils.generateVerificationCode();
                let obj = { verificationCode: link, companyID: req.companyID };
                try {
                    result = await dao.insert(this.FORGET, obj);
                }
                catch (err) {
                    result = { error: err };
                }
                return link;
            }
            else {
                return ("username not found");
            }
        }
    }

    async changePassword(req) {
        console.log("hello");
        let hashPassword = utils.encryptPassword(req.password)
        let result = await dao.update(this.AUTH, { email: this.email }, { $set: { password: hashPassword } });
        let log = await dao.delete(this.FORGET, { userName: req.userName })
        return ("done");
    }

    async updatePassword(userName, password) {
        let user = await dao.find(this.ORG, { companyID: userName })
        if (user.length) {
            let result = await this.updatePasswordUtil(user[0].email, password)
            return result
        }
    }
    async updatePasswordUtil(email, password) {
        let hashPassword = utils.encryptPassword(password)
        let result = await dao.update(this.AUTH, { email: email }, { $set: { password: hashPassword } })
        return result
    }

    async uniqueUserName(companyID) {
        let user = await dao.find(this.ORG, { companyID: companyID })
        if (user.length)
            return false
        return true
    }

    //unique user email checking 
    async uniqueEmail(email) {
        let user = await dao.find(this.ORG, { email: email })
        if (user.length)
            return false
        return true
    }

    //fetching verification data of user
    async findVerificationData(userObj) {
        let userFind = await dao.find(this.VERIFY, { companyID: userObj.companyID })
        return userFind;
    }



}

module.exports = organizationManagement;