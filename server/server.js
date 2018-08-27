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


app.listen('8080', () => console.log('Listening on port 8080'));