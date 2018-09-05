/**
 * @author Nandkumar Gangai and Harshita Shrivastava
 * @version 1.0
 * @since 26-08-2018
 * 
 * Service layer to interact with the frontend
 */

const express = require('express')
const cors = require('cors');
var parser = require("body-parser");
const app = express()

//const Connection = require('./connection');
const Connection = require('./modules/connection-management/connection');
const Dao = require('./modules/data-access/data-access')
var Company = require("./modules/company-management/company");



const connection = new Connection();
const dao = new Dao()

const company = new Company();
const connCollection = "users";
const orgCollection = "organizations"




app.use(parser.json());
app.use(cors());

//-----------------Account Management-------------------//

const UserManagement = require('./modules/user-management/user_management')
const OrganizationManagement = require('./modules/organization-management/organization-management')

//const dao = new Dao()
const users = new UserManagement()
const orgs = new OrganizationManagement()


/*********************user signup***********************/
app.get('/rest-api/users/get', async (req, res) => {
    let result = await users.findAll();
    res.send(result)
})
app.use(parser.json());

//method on clicking signUp 
/**
 * @required @tested
 */
/*
    name,  userName,  password,  email,  mobile,  dateOfBirth,  gender,
 */
app.post('/rest-api/users/signup', async (req, res) => {
    let authData = await users.authInsert(req.body);
    let result = await users.signupInsert(req.body);
    let verifyUser = await users.verifyInsert(req.body);
    let verficationData = await users.findVerificationData(req.body);
    res.send(verficationData);
})

/**
 * @required @tested
 */
//To activate the account
app.delete('/rest-api/users/activate/:userName/:verificationCode', async (req, res) => {
    let result = await users.deleteVerifiedUser(req.params)
    res.send(result)
})

/**
 * @required @tested
 */
//updated Code for verification
app.patch('/rest-api/users/update/verificationCode', async (req, res) => {
    let result = await users.updateVerifyCode(req.body.userName)
    res.send(result)
})

/*********************organization signup***********************/
// app.get('/rest-api/orgs/get', async (req, res) => {
//     let result = await orgs.findAll();
//     res.send(result)
// })
app.use(parser.json());
//method on clicking signUp 
/**
 * @required @tested
 */
app.post('/rest-api/orgs/signup', async (req, res) => {
    let authData = await orgs.authInsert(req.body);
    let result = await orgs.signupInsert(req.body);
    let verifyUser = await orgs.verifyInsert(req.body);
    let verficationData = await orgs.findVerificationData(req.body);
    res.send(verficationData)

})
//after activating the link
/**
 * @required @tested
 */
app.delete('/rest-api/orgs/activate/:companyID/:verificationCode', async (req, res) => {
    let result = await orgs.deleteVerifiedUser(req.params)
    res.send(result)
})

//updated link for verification
/**
 * @required @tested
 */
app.patch('/rest-api/orgs/update/verificationCode', async (req, res) => {
    let result = await orgs.updateVerifyCode(req.body.companyID)
    res.send(result)
})

/*
//method on clicking signUp 
app.post('/rest/api/users/add', async (req, res) => {
    let authData = await users.authInsert(req.body);
    let result = await users.signupInsert(req.body);  
    let verifyUser = await users.verifyInsert(req.body);
    
})
*/

/**
 * @required @tested
 */
app.post('/rest/api/users/uniqueUserName', async (req, res) => {
    let isUniqueUser = await users.uniqueUserName(req.body.userName);
    //let isUniqueOrg = await orgs.uniqueUserName(req.body.userName)
    res.send(isUniqueUser);
})

/**
 * @required @tested
 */
app.post('/rest/api/orgs/uniqueCompanyID', async (req, res) => {
    //let isUniqueUser = await users.uniqueUserName(req.body.companyID);
    let isUniqueOrg = await orgs.uniqueUserName(req.body.companyID)
    res.send((isUniqueOrg));
})

/**
 * @required @tested
 */
//unique email check
app.post('/rest/api/users-orgs/uniqueEmail', async (req, res) => {
    let isUniqueUser = await users.uniqueEmail(req.body.email);
    let isUniqueOrg = await orgs.uniqueEmail(req.body.email)
    res.send((isUniqueUser && isUniqueOrg));
})



/*
//method on clicking signUp 
app.post('/rest/api/orgs/add', async (req, res) => {
    let authData = await orgs.authInsert(req.body);
    let result = await orgs.signupInsert(req.body);  
    let verifyUser = await orgs.verifyInsert(req.body);
    
})
*/

/*********************login***********************/
/*********************users**********************/
//method on clicking login
/**
 * @required @tested
 */
app.post('/rest-api/user/login', async (req, res) => {
    let result = await users.signin(req.body);
    res.send(result);
})

/**
 * @required @tested
 */
app.post('/rest-api/user/logout', async (req, res) => {
    res.send('Logged Out')
})

//method on clicking forgot password
/**
 * @required @tested
 */
app.post('/rest-api/user/forget-password', async (req, res) => {
    let result = await users.forgotPassword(req.body);
    res.send(result)
})


//method to update new Password
/**
 * @required @tested
 */
app.post('/rest/api/users/change-password', async (req, res) => {
    //console.log("hello");
    console.log(req.body);
    let result = await users.changePassword(req.body);
    res.send(result);
})

//method to change password for logged In user
/**
 * @required @tested
 */
app.patch('/rest-api/user/update-password', async (req, res) => {
    let result = await users.updatePassword(req.body.userName, req.body.password)
    res.send(result)
})

//varification of password from link
app.post('/rest/api/users/verification', async (req, res) => {
    console.log("hui")
    let result = await users.verifyPassword(req.body);
    res.send(result);
})


//verification link for log in verification 
app.post('/rest-api/user/verify', async (req, res) => {
    let verficationData = await users.findVerificationData(req.body);
    res.send(verficationData);
})
/****************************org**************************/
//method on clicking loginIn
/**
 * @required @tested
 */
app.post('/rest-api/orgs/login', async (req, res) => {
    let result = await orgs.signin(req.body);
    res.send(result);
})

/**
 * @required @tested
 */
app.post('/rest-api/orgs/logout', async (req, res) => {
    res.send('Logged Out')
})

//method on clicking forgot password
/**
 * @required @tested
 */
app.post('/rest-api/orgs/forget-password', async (req, res) => {
    let result = await orgs.forgotPassword(req.body);
    res.send(result)
})

//method to update new Password
/**
 * @required @tested
 */
app.post('/rest-api/orgs/change-password', async (req, res) => {
    let result = await orgs.changePassword(req.body);
    res.send(result)
})


//method to change password for logged In org
/**
 * @required @tested
 */
app.patch('/rest-api/orgs/update-password', async (req, res) => {
    let result = await orgs.updatePassword(req.body.userName, req.body.password)
    res.send(result)
})

app.post('/rest-api/orgs/verify', async (req, res) => {
    let verficationData = await orgs.findVerificationData(req.body);
    res.send(verficationData);
})

app.post('/rest/api/orgs/verification', async (req, res) => {
    let result = await orgs.verifiyPassword(req.body);
    res.send(result);
})

/**
 * @author Nandkumar
 */
app.post('/rest-api/user/getData', async (req, res) => {
    try {
        let result = await connection.getData(connCollection, req.body.user);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
* Getting count of connections
*/
app.post('/rest-api/user/get-count/connections', async (req, res) => {
    try {
        let result = await connection.getConnectionCount(connCollection, req.body.user);
        res.end(result);
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * Sending Connect request
 * (receiver)
 */
/**
 * @required
 */
app.post('/rest-api/user/send-invitation', async (req, res) => {
    try {
        let result = await connection.connect(connCollection, req.body.user, req.body.receiver);
        // res.end("Request Sent");
        res.end(JSON.stringify(result.result)); /*Modified above line*/
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * Accepting follow request
 * (user - requester)
 */
/**
 * @required
 */
app.post('/rest-api/user/accept-invitation', async (req, res) => {
    try {
        let result = await connection.acceptInvitation(connCollection, req.body.user, req.body.requester);
        //console.log(result.result);
        // res.end("Request Accepted");
        res.end(JSON.stringify(result.result)); /*Modified above 2 lines*/
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * removing connection
 * (user - connection)
 */
/**
 * @required
 */
app.post('/rest-api/user/remove-connection', async (req, res) => {
    try {
        let result = await connection.removeConnection(connCollection, req.body.user, req.body.connection);
        // res.end("Removed");
        res.end(JSON.stringify(result.result)); /*Modified above line*/
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * Blocking connection
 * (user - blockee)
 */
/**
 * @required
 */
app.post('/rest-api/user/block', async (req, res) => {
    try {
        let result = await connection.blockConnection(connCollection, req.body.user, req.body.blockee);
        // res.end("Blocked");
        res.end(JSON.stringify(result.result)); /*Modified above line*/
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})
/*


*/
app.post('/rest-api/user/get-block-list', async (req, res) => {
    try {
        let result = await connection.getBlockList(connCollection, req.body.user);
        var blockData = [];
        for (let s of result[0].blocked) {

            blockData.push(await connection.getNameAndImage(connCollection, s))
        }
        res.end(JSON.stringify(blockData));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})

app.post('/rest-api/user/block-list-count', async (req, res) => {
    try {
        let result = await connection.blockListCount(connCollection, req.body.user);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
* Unblocking connection
*(user-blockee)
*/
/**
 * @required
 */
app.post('/rest-api/user/unblock', async (req, res) => {
    try {
        let result = await connection.unblock(connCollection, req.body.user, req.body.blockee);
        // res.end("Unblocked");
        res.end(JSON.stringify(result.result)); /*Modified above line*/
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * Ignoring Invitation Received
 * (user - sender)
 */
/**
 * @required
 */
app.post('/rest-api/user/ignore-invitation', async (req, res) => {
    try {
        let result = await connection.ignoreRequest(connCollection, req.body.user, req.body.sender);
        // res.end("Request Ignored");
        res.end(JSON.stringify(result.result)); /*Modified above line*/
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * View Invitations Sent Count
 * (user)
 */
app.post('/rest-api/user/get-invitation-count/sent', async (req, res) => {
    try {
        let result = await connection.invitationsSentCount(connCollection, req.body.user);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
 * View Invitations Received Count
 */
app.post('/rest-api/user/get-invitation-count/received', async (req, res) => {
    try {
        let result = await connection.invitationsReceivedCount(connCollection, req.body.user);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})


/**
* View Invitations Sent
*/
app.post('/rest-api/user/get-invitations/sent', async (req, res) => {
    try {
        let result = await connection.invitationsSent(connCollection, req.body.user);
        var sentData = [];
        for (let s of result[0].sent) {

            sentData.push(await connection.getNameAndImage(connCollection, s))
        }
        res.end(JSON.stringify(sentData));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})

/**
* View Invitations Received
*/
app.post('/rest-api/user/get-invitations/received', async (req, res) => {
    try {
        let result = await connection.invitationsReceived(connCollection, req.body.user);
        var receivedData = [];
        for (let r of result[0].receive) {

            receivedData.push(await connection.getNameAndImage(connCollection, r))
        }
        res.end(JSON.stringify(receivedData));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }

})


/**
 * View All Connections
 */
app.post('/rest-api/user/get-all-connections', async (req, res) => {
    try {
        let result = await connection.getConnectionsList(connCollection, req.body.user);
        var receivedData = [];
        for (let c of result[0].connections) {
            receivedData.push(await connection.getNameAndImage(connCollection, c))
        }
        res.end(JSON.stringify(receivedData));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})

/**
 * Follow a company
 */
/**
 * @required
 */
app.post('/rest-api/user/follow-company', async (req, res) => {
    try {
        let result = await connection.followCompany(connCollection, orgCollection, req.body.user, req.body.companyId);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})

/**
 * View Block-list Count
 */
app.post('/rest-api/user/block-list-count', async (req, res) => {
    try {
        let result = await connection.blockListCount(connCollection, req.body);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end(JSON.stringify({ "error": err }));/*Modified*/
    }
})

//--------------------------

/**
 * Getting data of a company based on ID
 * (companyId)
 * CO
 */
app.post('/rest-api/orgs/get/', async (req, res) => {
    let result = await company.getData(orgCollection, req.body);
    console.log(result);
    res.send(result)
    res.end();
})
/**
 * List of Jobs
 * (companyId)
 * CO
 */
app.post('/rest-api/user/orgs/getJobList', async (req, res) => {
    let result = await company.jobList(orgCollection, req.body);
    res.send(result);
});

/**
 * Getting specific job post
 * (companyId,jobId)
 * CO
 */

app.post('/rest-api/user/orgs/getJob', async (req, res) => {
    let result = await company.getJobDetails(orgCollection, req.body);
    res.send(result);
});

/**
 * Adding job post details
 * (companyId, jobId, jobPosition, postDate, lastDate, applicants*)
 * CO
 */
/**
 * @required @tested
 */
app.post('/rest-api/orgs/postJob', async (req, res) => {
    let result;
    try {
        result = await company.addJobPost(orgCollection, req.body);
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})
/**
 * Removing job post details
 * (companyId, jobId)
 * CO
 */
/**
 * @required @tested
 */
app.post('/rest-api/orgs/removeJob', async (req, res) => {
    let result;
    try {
        result = await company.removeJobPost(orgCollection, req.body);
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})

/**
 * Adding new post
 * (companyId, postId, content)
 * CO
 */
/**
 * @required @tested
 */
app.post('/rest-api/orgs/add-post', async (req, res) => {
    let result;
    try {
        result = await company.addPost(orgCollection, req.body);
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})

/**
 * Add like to post
 * (companyId, postId, user)
 * CO
 */
/**
     * @required @tested
     */
app.post('/rest-api/user/orgs/like-post', async (req, res) => {
    let result;
    try {
        result = await company.likePost(orgCollection, req.body, req.body.userName);
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})

/**
 * List of applicants
 *  (companyId, jobId)
 */
app.post('/rest-api/orgs/applicant-list', async (req, res) => {
    let result = await company.applicantList(orgCollection, req.body);
    res.send(result);
})


/**
 * Getting applicant count
 *  (companyId, jobId)
 */
app.post('/rest-api/orgs/applicant-count', async (req, res) => {
    let result;
    try {
        result = await company.getApplicantCount(orgCollection, req.body)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result);
});


/**
*@description Add applicant to the applicant list
* (companyId, jobId, applicant)
*/
/**
 * @required @tested
 */
app.post('/rest-api/user/orgs/add-applicant', async (req, res) => {
    let result;
    try {
        result = await company.addApplicantToList(orgCollection, req.body, req.body.userName)
        console.log(result)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result);
});

//_---------------------------------------------------------//




//-----------------Chat module-------------------//
const Chats = require('./modules/chat-management/chats');
const chats = new Chats();


// insert new conversation if not exist else add message in older conversation

/*The format of req body for addChatsBetweenUsers
{
  "receiver":102,
  "content":"Hello"
}*/
/**
 * @required
 */
app.post('/rest-api/chats/addChatsBetweenUsers', async (req, res) => {
    let previousConversationStatus = await chats.conversationExist(req.body.userName, req.body.receiver);
    console.log(previousConversationStatus)
    if (previousConversationStatus) {
        let result = {
            "val": await chats.addMessageInConversation(req.body.userName, req.body.receiver, req.body.content)
        }

        res.send(result);
    }
    else {
        let result = {
            "val": await chats.newConversation(req.body.userName, req.body.receiver, req.body.content)
        }
        res.send(result);
    }
})
//get chats between two user1 and user2

/*The format of req body for addChatsBetweenUsers
{
  "user2":102
}*/
/**
 * @required
 */
app.post('/rest-api/chats/getchatsBetweenUsers', async (req, res) => {

    let result = {}
    result.val = await chats.getChatsBetweenUsers(req.body.userName, req.body.receiver)
    res.send(result)
})

//deletes a single message of given timestamp between user1 and user2
/*The format of req body for deleteSingleMessage
{
  "user2":102,
  "timestamp":
}*/
app.delete('/rest-api/chats/deleteSingleMessage', async (req, res) => {
    var result = await chats.deleteSingleMessage(req.body.userName, req.body.user2, req.body.timestamp);
    console.log(result)
    res.send(result)
})

//gets the users and the last message the given user has conversed with
/*The format of req body for hasConversationsWith */
/**
 * @required
 */
app.post('/rest-api/chats/hasConversationsWith', async (req, res) => {
    let result = {}
    result.val = await chats.hasConversationsWith(req.body.userName)
    res.send(result)
})


//------------------------Profile-Management---------------//

const Controller = require('./modules/profile-management/user-details');

var control = new Controller();

/*
    @desc : "This link will get the user's name and will call getUserByUserName()"
    @author :  Shrishti 
*/
/**
 * @required
 */
app.get('/rest-api/users/get/:un', async (req, res) => {
    let result = await control.getUserByUserName(req.params.un);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addAwards()"
    @author :  Supriya Patil
*/
/**
 * @required
 */
app.put('/rest-api/users/addAward', async (req, res) => {
    let result = await control.addAwards(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateAward()"
    @author :  Supriya Patil
*/
/**
 * @required
 */
app.put('/rest-api/users/changeAward/:awardId', async (req, res) => {
    let result = await control.updateAwards(req.body.userName, req.params.awardId, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeAwards()"
    @author :  Supriya Patil
*/
/**
 * @required
 */
app.put('/rest-api/users/removeAward/:awardId', async (req, res) => {
    let result = await control.removeAwards(req.body.userName, req.params.awardId);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addCertifications()"
    @author :  Soumyodipta Majumdar
*/
/**
 * @required
 */
app.put('/rest-api/users/addCertificate', async (req, res) => {
    let result = await control.addCertifications(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateCertifications()"
    @author :  Soumyodipta Majumdar
*/
/**
 * @required
 */
app.put('/rest-api/users/changeCertificate/:certificateId', async (req, res) => {
    let result = await control.updateCertifications(req.body.userName, req.params.certificateId, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeCertifications()"
    @author :  Soumyodipta Majumdar
*/
/**
 * @required
 */
app.put('/rest-api/users/removeCertificate/:certificateId', async (req, res) => {
    let result = await control.removeCertifications(req.body.userName, req.params.certificateId);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addpublications()"
    @author :  Anubha Joshi
    
*/
/**
 * @required
 */
app.put('/rest-api/users/addPublication', async (req, res) => {
    let result = await control.addPublications(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updatePublications()"
    @author :  Anubha Joshi
*/
/**
 * @required
 */
app.put('/rest-api/users/changePublication/:publicationId', async (req, res) => {
    let result = await control.updatePublications(req.body.userName, req.params.publicationId, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removePublications()"
    @author :  Anubha Joshi
*/
/**
 * @required
 */
app.put('/rest-api/users/removePublication/:publicationId', async (req, res) => {
    let result = await control.removePublications(req.body.userName, req.params.publicationId);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addEndorsement()"
    @author :  Somya Burman
*/
/**
 * @required
 */
app.put('/rest-api/users/addEndorsement', async (req, res) => {
    let result = await control.addEndorsement(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.user);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and skill and will call addSkill()"
    @author :  Veshnavee Gupta
*/
/**
 * @required
 */
app.put('/rest-api/users/addSkill/:skill', async (req, res) => {

    let result = await control.addSkill(req.body.userName, req.params.skill);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and skill and will call deleteSkill()"
    @author :  Veshnavee Gupta
*/
/**
 * @required
 */
app.put('/rest-api/users/deleteSkill/:skill', async (req, res) => {
    let result = await control.deleteSkill(req.body.userName, req.params.skill);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call updateBio()"
    @author :  parag Badala
*/
/**
 * @required
 */
app.put('/rest-api/users/updateBio', async (req, res) => {
    let result = await control.updateBio(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call addExperience()"
    @author :  Himani Jain
*/
/**
 * @required
 */
app.put('/rest-api/users/addExperience', async (req, res) => {
    let result = await control.addExperience(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateExperience()"
    @author :  Himani Jain
*/
/**
 * @required
 */
app.put('/rest-api/users/updateExperience/:experienceId', async (req, res) => {
    let result = await control.updateExperience(req.body.userName, req.params.experienceId, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeExperience()"
    @author :  Himani Jain 
*/
/**
 * @required
 */
app.put('/rest-api/users/removeExperience/:experienceId', async (req, res) => {
    let result = await control.removeExperience(req.body.userName, req.params.experienceId);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addEducation()"
    @author :  Lalithya Satya 
*/
/**
 * @required
 */
app.put('/rest-api/users/addEducation', async (req, res) => {
    let result = await control.addEducation(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result)
});

/*
    @desc : "This link will get the user's name and user Id and will call updateEducation()"
    @author :  Lalithya Satya
*/
/**
 * @required
 */
app.put('/rest-api/users/updateEducation/:educationId', async (req, res) => {
    let result = await control.updateEducation(req.body.userName, req.params.educationId, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeEducation()"
    @author :  Lalithya Satya
*/
/**
 * @required
 */
app.put('/rest-api/users/removeEducation/:educationId', async (req, res) => {
    let result = await control.removeEducation(req.body.userName, req.params.educationId);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call countConnection()"
    @author :  Supriya Patil
*/

app.get('/rest-api/users/countConnection', async (req, res) => {
    let result = await control.countConnection(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call updateName()"
    @author :  Shrishti
*/
/**
 * @required
 */
app.put('/rest-api/users/updateName', async (req, res) => {
    let result = await control.updateName(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result)
});

/*
    @desc : "This link will get the user's name and will call updateDOB()"
    @author :  Shrishti
*/

/**
 * @required
 */
app.put('/rest-api/users/updateDob', async (req, res) => {
    let result = await control.updateDOB(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call upateEmail()"
    @author :  Anubha Joshi
*/

app.put('/rest-api/users/updateEmail', async (req, res) => {
    let result = await control.updateEmail(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result)
});

/*
    @desc : "This link will get the user's name and will call updateMobile()"
    @author :  Anubha Joshi
*/
/**
 * @required
 */
app.put('/rest-api/users/updateMobile', async (req, res) => {
    let result = await control.updateMobile(req.body.userName, req.body);
    result = await control.getUserByUserName(req.body.userName);
    res.send(result)
});



//-------------------------NewsFeed-------------------------//


//fetching the updated posts of a particular person who has logged in based on username 

const NewsFeed = require('./modules/newsfeed/newsfeed')
const newsFeed = new NewsFeed();


//searching person based on username
const Search = require('./modules/newsfeed/search');
const search = new Search();


//add, update and delete the posts of a particular user
const Posts = require('./modules/newsfeed/posts');
const post = new Posts();

const newsFeedCollection = "users";              //name of my collection


//Likes and Unlikes done by user
const Likes = require('./modules/newsfeed/likes');//puneeth
const likes = new Likes();


//add and delete comments
const Comment = require('./modules/newsfeed/comment')
const comments = new Comment();


//fetching the updated posts of a particular person who has logged in based on username
/**
 * @required
 */
app.post("/rest-api/users/post/load", async (req, res) => {
    //console.log('Load Invoked');
    let result = await newsFeed.getNewsFeed(newsFeedCollection, req.body.userName);//take username from session
    res.send(result)
})



//add, delete and update the posts


/**
 * content
 * @description to insert post in database by a user
*/
/**
 * @required
 */
app.patch('/rest-api/users/create/post', async (req, res) => {
    let result;
    try {
        result = await post.createPosts(newsFeedCollection, req.body, req.body.userName);
        result = await newsFeed.getNewsFeed(newsFeedCollection, req.body.userName)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
});

/**
 * @description to edit post inserted in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/edit/post/:postId', async (req, res) => {
    let result;
    let postId = req.params.postId;
    try {
        result = await post.editPosts(newsFeedCollection, req.body, req.body.userName, postId);
        result = await newsFeed.getNewsFeed(newsFeedCollection, req.body.userName);
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})

/**
 * @description to delete post inserted in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/delete/posts/:postId', async (req, res) => {
    let result
    let postId = req.params.postId;
    try {
        result = await post.deletePosts(newsFeedCollection, req.body.userName, postId);
        result = await newsFeed.getNewsFeed(newsFeedCollection, req.body.userName)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})

/**
 * @description to search people in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/search/people', async (req, res) => {
    console.log(req.body)
    let result = []
    let result2 = []
    try {
        result = await search.searchPeople(newsFeedCollection, req.body.query);
        result2 = await search.searchCompanies(orgCollection, req.body.query);
       result = result.concat(result2)
    }
    catch (err) {
        result = { err: err }
    }

    res.send(result)
})

/**
 * @description to search companies in the database by the user
 */
/**
 * @required
 */
app.patch('/rest-api/users/search/companies', async (req, res) => {
    let result;
    try {
        result = await search.searchCompanies(newsFeedCollection, req.body.query);
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})


//Likes and dislikes
/**
 * @required
 */
app.post('/rest-api/users/post/like', async (req, res) => {
    let result

    try {
        var store = req.body;
        result = await likes.getLike(connCollection, store.userName, store.postId, req.body.userName)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})

/**
 * @required
 */
app.post('/rest-api/users/post/unlike', async (req, res) => {
    let result
    try {
        var store = req.body;
        result = await likes.removeLike(connCollection, store.userName, store.postId, req.body.userName)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result)
})



app.get('/rest-api/users/post/getLikesdetails/:userName/:postId', async (req, res) => {
    var id = req.params.postId
    var userName = req.params.userName
    let result = await likes.getLikeDetails(newsFeedCollection, userName, id)
    res.send(result)
})

/***
 * @Description calling getComments() method of Comments class in comments.js file 
 */
app.get('/rest-api/users/post/getComments/:uname/:pid', async (req, res) => {
    let pId = req.params.pid;
    let username = req.params.uname;
    //uname is userName like ="dip95",  whose post is displayed
    //pid is Post Id 
    let result = await comments.getComments(newsFeedCollection, username, pId);
    res.send(result);
})





/***
 * @Description calling postComments() method of Comments class in comments.js file 
 */
app.use(parser.json());

app.put('/rest-api/users/post/updateComments/:uname/:pid', async (req, res) => {
    let result
    let uId = req.params['uname'];
    let pId = req.params['pid']

    //uname is userName like ="dip95",  whose post is displayed
    //pid is Post Id 
    try {
        let result = await comments.postComments(newsFeedCollection, uId, pId, req.body, req.body.userName)
        // take "saurabhgupta"" from session that is fullname of a session user
        let updatedResult = await comments.getComments(newsFeedCollection, uId, pId);
        res.send(updatedResult)
    }
    catch (err) {
        result = { err: err }
    }
})


//-------------------------END-----------------------------//

app.listen('8080', () => console.log('Listening on port 8080'));
