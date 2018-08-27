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
const connCollection = "userCollection";



app.use(parser.json());
app.use(cors());

app.post('/get-all-data', async (req, res) => {
    try {
        let result = await connection.getData(connCollection, req.body.user);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
* Getting count of connections
*/
app.post('/get-count/connections', async (req, res) => {
    try {
        let result = await connection.getConnectionCount(connCollection, req.body);
        res.end(result);
    }
    catch (err) {
        res.end("Error 404");
    }
})

// /**
// * Getting count of followers
// */
// app.post('/get-count/followings', async (req, res) => {

//     let result = await connection.getConnectionCount(connCollection, req.body);
//     res.end(result)
// })

/**
 * Sending Connect request
 * (sender - receiver)
 */
app.post('/connect', async (req, res) => {
    try {
        let result1 = await connection.connect(connCollection, req.body);
        res.end("Request Sent");
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * Accepting follow request
 * (user - requester)
 */
app.post('/accept-invitation', async (req, res) => {
    try {
        let result = await connection.acceptInvitation(connCollection, req.body);
        res.end("Request Accepted");
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * removing connection
 * (user - connection)
 */
app.post('/remove-connection', async (req, res) => {
    try {
        let result = await connection.removeConnection(connCollection, req.body);
        res.end("Removed");
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * Blocking connection
 * (user - blockee)
 */
app.post('/block', async (req, res) => {
    try {
        let result = await connection.blockConnection(connCollection, req.body);
        res.end("Blocked");
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
* Unblocking connection
*(user-blockee)
*/
app.post('/unblock', async (req, res) => {
    try {
        let result1 = await connection.unblock(connCollection, req.body);
        res.end("Unblocked");
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * Ignoring Invitation Received
 * (user-sender)
 */
app.post('/ignore-invitation', async (req, res) => {
    try {
        let result1 = await connection.ignoreRequest(connCollection, req.body);
        res.end("Request Ignored");
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * View Invitations Sent Count
 * (user)
 */
app.post('/get-invitation-count/sent', async (req, res) => {
    try {
        let result = await connection.invitationsSentCount(connCollection, req.body);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * View Invitations Received Count
 */
app.post('/get-invitation-count/received', async (req, res) => {
    try {
        let result = await connection.invitationsReceivedCount(connCollection, req.body);
        res.end(JSON.stringify(result));
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
* View Invitations Sent
*/
app.post('/get-invitations/sent', async (req, res) => {
    try {
        let result = await connection.invitationsSent(connCollection, req.body);
        var sentData = [];
        console.log(result[0].sent.length);
        for (let s of result[0].sent) {

            sentData.push(await connection.getNameAndImage(connCollection, s))
        }
        res.end(JSON.stringify(sentData));
    }
    catch (err) {
        res.end("Error 404");
    }
})

/**
* View Invitations Received
*/
app.post('/get-invitations/received', async (req, res) => {
    try {
        let result = await connection.invitationsReceived(connCollection, req.body);
        var receivedData = [];
        console.log(result[0].receive.length);
        for (let r of result[0].receive) {

            receivedData.push(await connection.getNameAndImage(connCollection, r))
        }
        res.end(JSON.stringify(receivedData));
    }
    catch (err) {
        res.end("Error 404");
    }
})


/**
 * View All Connections
 */
app.post('/get-all-connections', async (req, res) => {
    try {
        let result = await connection.getConnectionsList(connCollection, req.body);
        var receivedData = [];
        console.log(result[0].connections.length);
        for (let c of result[0].connections) {
            receivedData.push(await connection.getNameAndImage(connCollection, c))
        }
        res.end(JSON.stringify(receivedData));
    }
    catch (err) {
        res.end("Error 404");
    }
})

//--------------------------

/**
 * Getting data of a company based on ID
 */
app.post('/orgs/get/', async (req, res) => {
    let result = await company.getData("orgs", req.body);
    res.send(result);
})
/**
 * List of Jobs
 */
app.post('/orgs/getJobList/', async (req, res) => {

    let result = await company.jobList("orgs", req.body);
    res.send(result);
});

/**
 * Getting specific job post
 */

app.post('/orgs/getJobLists/', async (req, res) => {

    let result = await company.getJobDetails("orgs", req.body);
    res.send(result);
});

/**
 * Adding job post details
 */
app.post('/orgs/postJob/', async (req, res) => {
    let result;
    try {
        result = await company.addJobPost("orgs", req.body);
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})
/**
 * Removing job post details
 */
app.post('/orgs/removeJob/', async (req, res) => {
    let result;
    console.log(req.body);
    try {
        result = await company.removeJobPost("orgs", req.body);

        console.log("Deleted")
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})

/**
 * Adding job post details
 */
app.post('/orgs/add-post/', async (req, res) => {
    let result;
    try {
        result = await company.addPost("orgs", req.body);
    }
    catch (err) {
        result = { "err": err };
    }
    res.send(result);
})

/**
 * List of applicants
 */
app.post('/orgs/applicant-list/', async (req, res) => {
    let result = await company.applicantList("orgs", req.body);
    res.send(result);
})

/**
 * Adding new company
 */
app.post('/orgs/add-new/', async (req, res) => {

    let result;
    try {
        result = await company.addNewCompany("orgs", req.body);
    }
    catch (err) {
        result = { error: "err" }
    }
    res.send(result)
})

// /**
//  * Removing the company
//  * skipped Pending
//  */
// app.post('/orgs/remove/', async (req, res) => {
//     let result = await dao.post("orgs", { "name":"MS" })
//     res.send(result)
// })


/**
 * Profile Editing
 * Pending
 */
app.post('/orgs/update/', async (req, res) => {
    let result;
    try {
        result = await company.updateData("orgs", req.body)
    }
    catch (err) {
        result = { err: err }
    }
    res.send(result);
});


/**
 * Getting applicant count
 */
app.post('/orgs/applicant-count/', async (req, res) => {
    let result;
    try {
        result = await company.getApplicantCount("orgs", req.body)
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
"user1":103,
  "user2":102,
  "sender":103,
  "content":"Hello"
}*/

app.post('/rest/api/chats/addChatsBetweenUsers', async (req, res) => {
    let previousConversationStatus = await chats.conversationExist(req.body);
    if (previousConversationStatus) {
        var result = await chats.addMessageInConversation(req.body);
        res.send(result);
    }
    else {
        let result = await chats.newConversation(req.body);
        res.send(result);
    }
})
//get chats between two user1 and user2

/*The format of req body for addChatsBetweenUsers
{
"user1":103,
  "user2":102
}*/

app.post('/rest/api/chats/getchatsBetweenUsers', async (req, res) => {
    let result = await chats.getChatsBetweenUsers(req.body)
    res.send(result)
})

//deletes a single message of given timestamp between user1 and user2
/*The format of req body for deleteSingleMessage
{
"user1":103,
  "user2":102,
  "timestamp":
}*/
app.delete('/rest/api/chats/deleteSingleMessage', async (req, res) => {
    var result = await chats.deleteSingleMessage(req.body);
    console.log(result)
    res.send(result)
})

//gets the users and the last message the given user has conversed with
/*The format of req body for hasConversationsWith
{
"user":103
}*/

app.post('/rest/api/chats/hasConversationsWith', async (req, res) => {
    let result = await chats.hasConversationsWith(req.body)
    console.log(result)
    res.send(result)
})


//------------------------Profile-Management---------------//

const Controller = require('./modules/profile-management/user-details');

var control = new Controller();

/*
    @desc : "This link will get the user's name and will call getUserByUserName()"
    @author :  Shrishti 
*/
app.get('/rest/api/users/get/:un', async (req, res) => {
    let result = await control.getUserByUserName(req.params.un);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addAwards()"
    @author :  Shrishti
*/
app.put('/rest/api/users/addAward/:un', async (req, res) => {
    let result = await control.addAwards(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateAward()"
    @author :  Shrishti
*/
app.put('/rest/api/users/changeAward/:un/:id', async (req, res) => {
    let result = await control.updateAwards(req.params.un, req.params.id, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeAwards()"
    @author :  Parag Badala
*/
app.put('/rest/api/users/removeAward/:un/:id', async (req, res) => {
    let result = await control.removeAwards(req.params.un, req.params.id);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addCertifications()"
    @author :  Dipmalya Sen
*/
app.put('/rest/api/users/addCertificate/:un', async (req, res) => {
    let result = await control.addCertifications(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateCertifications()"
    @author :  Dipmalya Sen
*/

app.put('/rest/api/users/changeCertificate/:un/:id', async (req, res) => {
    let result = await control.updateCertifications(req.params.un, req.params.id, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeCertifications()"
    @author :  Himani Jain
*/

app.put('/rest/api/users/removeCertificate/:un/:id', async (req, res) => {
    let result = await control.removeCertifications(req.params.un, req.params.id);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addpublications()"
    @author :  Himani Jain
*/

app.put('/rest/api/users/addPublication/:un', async (req, res) => {
    let result = await control.addPublications(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updatePublications()"
    @author :  Lalithya Satya
*/

app.put('/rest/api/users/changePublication/:un/:id', async (req, res) => {
    let result = await control.updatePublications(req.params.un, req.params.id, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removePublications()"
    @author :  Lalithya Satya
*/

app.put('/rest/api/users/removePublication/:un/:id', async (req, res) => {
    let result = await control.removePublications(req.params.un, req.params.id, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addEndorsement()"
    @author :  Soumyodipta Majumdar
*/

app.put('/rest/api/users/addEndorsement/:un', async (req, res) => {
    let result = await control.addEndorsement(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and skill and will call addSkill()"
    @author :  Soumyodipta Majumdar
*/

app.put('/rest/api/users/addSkill/:un/:skill', async (req, res) => {
    let result = await control.addSkill(req.params.un, req.params.skill);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and skill and will call deleteSkill()"
    @author :  Somya Burman
*/

app.put('/rest/api/users/deleteSkill/:un/:skill', async (req, res) => {
    let result = await control.deleteSkill(req.params.un, req.params.skill);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call updateBio()"
    @author :  Somya Burman
*/

app.put('/rest/api/users/updateBio/:un', async (req, res) => {
    let result = await control.updateBio(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call addExperience()"
    @author :  Anubha Joshi
*/

app.put('/rest/api/users/addExperience/:un', async (req, res) => {
    let result = await control.addExperience(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateExperience()"
    @author :  Anubha Joshi
*/

app.put('/rest/api/users/updateExperience/:un/:id', async (req, res) => {
    let result = await control.updateExperience(req.params.un, req.params.id, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeExperience()"
    @author :  Veshnavee 
*/

app.put('/rest/api/users/removeExperience/:un/:id', async (req, res) => {
    let result = await control.removeExperience(req.params.un, req.params.id);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call addEducation()"
    @author :  Veshnavee 
*/

app.put('/rest/api/users/addEducation/:un', async (req, res) => {
    let result = await control.addEducation(req.params.un, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call updateEducation()"
    @author :  Supriya Patil
*/

app.put('/rest/api/users/updateEducation/:un/:id', async (req, res) => {
    let result = await control.updateEducation(req.params.un, req.params.id, req.body);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and user Id and will call removeEducation()"
    @author :  Supriya Patil
*/

app.put('/rest/api/users/removeEducation/:un/:id', async (req, res) => {
    let result = await control.removeEducation(req.params.un, req.params.id);
    res.send(result);
});

/*
    @desc : "This link will get the user's name and will call countConnection()"
    @author :  Parag Badala
*/

app.get('/rest/api/users/countConnection/:un', async (req, res) => {
    let result = await control.countConnection(req.params.un);
    res.send(result);
});


//-----------------Account Management-------------------//

const UserManagement = require('./modules/user-management/user_management')
const OrganizationManagement = require('./modules/organization-management/organization-management')
const Session = require('./modules/user-management/session')
//const dao = new Dao()
const user = new UserManagement()
const orgs = new OrganizationManagement()
const sessManager = new Session()

/*********************user signup***********************/
app.get('/rest/api/users/get/', async (req, res) => {
    let result = await user.findAll();
    res.send(result)
})
app.use(parser.json());
//method on clicking signUp 
app.post('/rest/api/users/add', async (req, res) => {
    let authData = await user.authInsert(req.body);
    let result = await user.signupInsert(req.body);
    let verifyUser = await user.verifyInsert(req.body);
    res.send(result);
})
//after activating the link
app.delete('/rest/api/users/activate/:userName/:link', async (req, res) => {
    let result = await user.deleteVerifiedUser(req.params)
    res.send(result)
})

//updated link for verification
app.patch('/rest/api/users/updateVerificationLink', async (req, res) => {
    let result = await user.updateVerifyLink(req.body)
    res.send(result)
})

/*********************organization signup***********************/
app.get('/rest/api/orgs/get/', async (req, res) => {
    let result = await orgs.findAll();
    res.send(result)
})
app.use(parser.json());
//method on clicking signUp 
app.post('/rest/api/orgs/add', async (req, res) => {
    let authData = await orgs.authInsert(req.body);
    let result = await orgs.signupInsert(req.body);
    let verifyUser = await orgs.verifyInsert(req.body);
    res.send(verifyUser)
})
//after activating the link
app.delete('/rest/api/orgs/activate/:companyID/:link', async (req, res) => {
    let result = await orgs.deleteVerifiedUser(req.params)
    res.send(result)
})

//updated link for verification
app.patch('/rest/api/orgs/updateVerificationLink', async (req, res) => {
    let result = await orgs.updateVerifyLink(req.body)
    res.send(result)
})



/*********************login***********************/
/*********************users**********************/
//method on clicking loginIn
app.post('/rest/api/users/signin', async (req, res) => {
    let result = await user.signin(req.body);
    res.send(result);
})
//method on clicking forgot password
app.post('/rest/api/users/password', async (req, res) => {
    let result = await user.forgotPassword(req.body);
    res.send(result)
})
//method to update new Password
app.post('/rest/api/users/changepassword', async (req, res) => {
    let result = await user.changePassword(req.body);
    res.send(result)
})
/****************************org**************************/
//method on clicking loginIn
app.post('/rest/api/orgs/signin', async (req, res) => {
    let result = await orgs.signin(req.body);
    res.send(result);
})
//method on clicking forgot password
app.post('/rest/api/orgs/password', async (req, res) => {
    let result = await orgs.forgotPassword(req.body);
    res.send(result)
})
//method to update new Password
app.post('/rest/api/orgs/changepassword', async (req, res) => {
    let result = await orgs.changePassword(req.body);
    res.send(result)
})
//-------------------------END-----------------------------//

app.listen('8080', () => console.log('Listening on port 8080'));