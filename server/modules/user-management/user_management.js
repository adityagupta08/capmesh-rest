const Dao = require('../data-access/data-access')
const Utils = require('./utils')

const dao = new Dao()
const utils = new Utils()

//creating userManagement to export in server.js
class userManagement {

    /**
     * Query the database and gets all the users by using Dao.find()
     * @author Soumya Nelanti, Sayali
     * @returns {Array} The array of all the documents in the collection   
     */
    async findAll() {
        let resultFindAll = await dao.find("users");
        return resultFindAll;
    }

    /**
     * Insert the userObj in the User collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj An object which is to be inserted in the database
     * @returns {Object} Database Result or Error
     */
    async signupInsert(userObj) {
        let date = new Date(userObj.dateOfBirth);
        userObj.dateOfBirth = date;
        console.log(userObj);
        delete userObj.password;
        console.log(userObj);
        let result;
        try {
            result = await dao.insert("users", userObj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    /**
     * Insert the email and password in the Auth Collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async authInsert(userObj) {
        let userObj = { email: userObj.email, password: userObj.password };
        let result
        try {
            result = await dao.insert("authUsers", userObj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    /**
     * Insert the verificationCode and userName into the verification collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async verifyInsert(userObj) {
        let code = utils.generateVerificationCode();
        console.log(link)
        let obj = { verificationCode: code, userName: userObj.userName };
        let result;
        try {
            result = await dao.insert("verifications", obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    /**
     * Verify the user and delete the corresponding document from the 
     * verification collection
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async deleteVerifiedUser(userObj) {
        let userFind = await dao.find('verifications', { userName: userObj.userName })
        if (userFind.length == 1) {
            if (userFind[0].userName === userObj.userName && userFind[0].verificationCode === userObj.link) {
                let verifyUpdate = await dao.update('users', { userName: userObj.userName }, { $set: { isVerified: true } })
                let result = await dao.delete("verifications", { userName: userObj.userName })
                return verifyUpdate;

            }
        }
        else {
            return {
                error: "Account already verified!!!"
            }
        }
    }
    /**
     * Update the verification code in the verification collection
     * for the User
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async updateVerifyLink(userObj) {
        let result
        let code = utils.generateVerificationCode();
        try {
            result = await dao.update("verifications", { userName: userObj.userName }, { $set: { verificatonCode: code } })
        }
        catch (err) {
            result = { err: err }
        }
        return result
    }

    /**
     * Update the verification code in the verification collection
     * for the User
     * @author Soumya Nelanti, Sayali
     * @param {Object} userObj having userDetails
     * @returns {Object} Database Result or Error
     */
    async signin(userObj) {
        let log = await dao.find("users", { userName: req.userName })
        if (log.length == 1) {
            if (log[0].isDeleted == false) {
                let result = await dao.find("authUsers", { email: log[0].email })
                if (result[0].password == req.password) {
                    if (log[0].isVerified == true) {
                        return "logged In";
                    }
                    else {
                        return "account logged In with not verified";
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

}

module.exports = userManagement;
