const Dao = require('../data-access/data-access')
const dao = new Dao()
const Utils = require('../user-management/utils')
const DefaultObj = require('./schema');
const utils = new Utils()
var email;

class organizationManagement{
    async findAll(){
        let resultFindAll = await dao.find("organization");
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
            result = await dao.insert("organization", obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }
    //inserting email and password into authUsers collection
    async authInsert(req) {
        let hashPassword=utils.encryptPassword(req.password)
        let obj = { email: req.email, password: hashPassword };
        console.log(hashPassword)
        let result
        try {
            result = await dao.insert("authOrgs", obj);
        }
        catch (err) {
            result = { error: err };
        }
        return result;
    }

    //verification insertion
    async verifyInsert(req)
    {
        let link=utils.generateVerificationLink();
        console.log(link)
        let obj={verificationCode:link,companyID:req.companyID};
        let result;
        try{
            result=await dao.insert("orgsVerification",obj);
        }
        catch(err){
            result = { error: err };
        }
        return result;
    }
    // Deleting verified users in the Verifications 
    async deleteVerifiedUser(req){
        let orgFind=await dao.find('orgsVerification',{companyID: req.companyID})
        if(orgFind.length==1)
        {
            if(orgFind[0].companyID===req.companyID && orgFind[0].verificationCode===req.link)
        {
        let verifyUpdate = await dao.update('organization',{companyID: req.companyID},{$set:{isVerified: true}})
        let result = await dao.delete("orgsVerification", { companyID: req.companyID })
        return verifyUpdate;

        }}
        else
        {
            return "Account already verified!!!"
        }
    }

    async updateVerifyLink(req){
    let result
    let link=utils.generateVerificationLink();
        link=link+'/'+req.userName;
    try {
        result = await dao.update("orgsVerification",{companyID: req.companyID},{$set:{verificatonLink: link}})
    } 
    catch (err) {
        result = {err:err}
    }
}
/**************************************login*************************************** */
//verification for login
    async signin(req) {
        let log = await dao.find("organization", { name: req.name })
        console.log(log,req.name);
        if (log.length == 1) {
            if (log[0].isDeleted === false) {
                let result = await dao.find("authOrgs", { email: log[0].email })
                let hashPassword=utils.encryptPassword(req.password)
                if (result[0].password == hashPassword) {
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

    async forgotPassword(req) {
        let result = await dao.find("organization", { name: req.name })
    if (result[0].name== req.name)
    {
        this.email=result[0].email;
        let link=utils.generateVerificationLink();
        let obj={verificationCode:link,name:req.name};
        try{
            result=await dao.insert("orgpwdchangever",obj);
        }
        catch(err){
            result = { error: err };
        }
        return result;
    }
    else{
        return("username not found");
    }
}
async changePassword(req) {
    let hashPassword=utils.encryptPassword(req.password)
    let result = await dao.update("authOrgs", { email: this.email },{$set:{password:hashPassword}});
    let log = await dao.delete("orgpwdchangever", { userName: req.userName})
    return ("update done");
}


}

module.exports = organizationManagement;