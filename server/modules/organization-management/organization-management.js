const Dao = require('../data-access/data-access')
const dao = new Dao()
const Utils = require('../user-management/utils')
const DefaultObj = require('./schema');
const utils = new Utils()
var email;

class organizationManagement {
    async findAll() {
        let resultFindAll = await dao.find("organizations");
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
            result = await dao.insert("organizations", obj);
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
            result = await dao.insert("auth-users", obj);
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
            result = await dao.insert("verifications", obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }
    // Deleting verified users in the Verifications 
    async deleteVerifiedUser(req) {
        let orgFind = await dao.find('verifications', { companyID: req.companyID })
        if (orgFind.length == 1) {
            if (orgFind[0].companyID === req.companyId && orgFind[0].verificationCode === req.verificationCode) {
                let verifyUpdate = await dao.update('organizations', { companyID: req.companyId }, { $set: { isVerified: true } })
                let result = await dao.delete("verifications", { companyID: req.companyId })
                return verifyUpdate;

            }
        }
        else {
            return "Account already verified!!!"
        }
    }

    async updateVerifyLink(req) {
        let result
        let link = utils.generateVerificationLink();
        link = link + '/' + req.userName;
        try {
            result = await dao.update("verifications", { companyID: req.companyID }, { $set: { verificatonLink: link } })
        }
        catch (err) {
            result = { err: err }
        }
    }
    /**************************************login*************************************** */
    //verification for login
    async signin(req) {
        let log = await dao.find("organizations", { name: req.name })
        console.log(log, req.name);
        if (log.length == 1) {
            if (log[0].isDeleted === false) {
                let result = await dao.find("auth-users", { email: log[0].email })
                if (result) {
                    let hashPassword = utils.encryptPassword(req.password)
                    if (result[0].password == hashPassword) {
                        return "Logged In"
                    }
                }
            }
            else {
                return "Account deleted";
            }
        }
        else {
            return "Incorrect Username or Password";
        }
    }

    async forgotPassword(req) {
        let result = await dao.find("organizations", { name: req.name })
        if (result[0].name == req.name) {
            //this.email=result[0].email;
            let link = utils.generateVerificationLink();
            let obj = { verificationCode: link, name: req.name };
            try {
                result = await dao.insert("forget-password", obj);
            }
            catch (err) {
                result = { error: err };
            }
            return result;
        }
        else {
            return ("username not found");
        }
    }
    async changePassword(req) {
        let hashPassword = utils.encryptPassword(req.password)
        let result = await dao.update("auth-users", { email: req.email }, { $set: { password: hashPassword } });
        let log = await dao.delete("forget-password", { userName: req.userName })
        return ("update done");
    }


}

module.exports = organizationManagement;