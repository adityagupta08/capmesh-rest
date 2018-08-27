const express = require('express');
const Dao = require('../data-access/data-access');
const app = express();
const dao = new Dao();

class Company{
    /**
     * @description Getting data of a company based on ID
     * (companyId)
     * @author Jayasree, Sameera
     * @param {object} collection having collection 
     * @param {object} queryData having input data object
     * @returns {object} result
     */    
    async getData(collection, queryData) {
        let result = await dao.find(collection, { "companyID": queryData.companyId });
        return (result);
    }

    /**                                
     * @description -Getting list of jobs
     * (companyId)
     * @author Akhil, Jayasree
     * @param {object} collection having collection
     * @param {object} queryData input data object
     * @returns {object} result
     */
    async jobList(collection, queryData) {
        console.log(queryData);
        let result = await dao.aggregate(collection, [{ $match: { "companyID": queryData.companyId } }, { $project: { "profile.jobs.jobId": 1 } }]);
        return (result);
    }
    /**
     * @description -Adding job post details
     * (companyId, jobId, jobPosition, postDate, lastDate)
     * @author Jayasree, Sameera
     * @param {object} collection having collection
     * @param {object} queryData input data object
     * @returns {object} result
     */   
    async addJobPost(collection, queryData) {
        let result = await dao.update(collection, { "companyID": queryData.companyId },{$push:{"profile.jobs": {"jobId": queryData.jobId, "position": queryData.jobPosition, "timestamp":queryData.postDate, "lastDate":queryData.lastDate}}});
        return (result);
    }

    /**
     * @description -Getting job details
     * @author Jayasree, Sameera
     * @param {object} collection having collection
     * @param {object} queryData input data object
     * @returns {object} result
     * Incomplete
     */
    async getJobDetails(collection, queryData) {
        let result = await dao.aggregate(collection, { "companyID": queryData.companyId },{$push:{"profile.jobs": {"jobId": queryData.jobId, "position": queryData.jobPosition, "timestamp":queryData.postDate, "lastDate":queryData.lastDate}}});
        return (result);
    }


    /**
     * @description -Adding job post details
     * (companyId, postId, content)
     * @author Sameera,Sahithi
     * @param {object} collection having collection
     * @param {object} queryData input data object
     * @returns {object} result
     */
        
    async addPost(collection, queryData) {
        let result = await dao.update(collection, { "companyID": queryData.companyId },{$push:{"profile.post": {"postId": queryData.postId, "content": queryData.content, "timestamp":queryData.postDate, likes:[], comments:[]}}});
        return (result);
    }

    /**
     * @description Removing job post details
     * (companyId, jobId) Error
     * @author Nandkumar
     * @param {object} collection having collection
     * @param {object} queryData having query
     * @returns {object} result
     */
        
    async removeJobPost(collection, queryData) {
        let result = await dao.update(collection, {'companyID': queryData.companyId}, { $pull: { "profile.jobs" : { jobId: queryData.jobId }}},false,true);
        console.log("Deleted");
        console.log(result);
        return (result) ;
    }

    /**
     * @description -Getting list of applicants
     * (companyId, jobId)
     * @author Jayasree,Sameera
     * @param {object} collection having collection
     * @param {object} queryData having query
     * @returns {object} result
     */
  
    async applicantList(collection, queryData) {
        let result = await dao.aggregate(collection, [{ $match: { "companyID": queryData.companyId } }, { $project: { "profile.jobs": 1, "_id": 0 } }]);
        for (let job of result[0].profile.jobs) {
            if (job.jobId === queryData.jobId)
                return job.applicants;
        }
        return ({ err: "No applicants" });
    }

    /**
     * @description -Adding new company  
     * @author Sameera,Jayasree
     * @param {object} collection having collection
     * @param {object} queryData having query
     * @returns {object} result
     */
    async addNewCompany(collection, queryData) {
        let result = await dao.insert(collection, queryData);
        return (result);
    }

    /**
     * @description -Update name of company
     * Pending 
     * @author Sahithi,Akhil
     * @param {object} collection having collection
     * @param {object} queryData having query
     * @returns {object} result
     */
    async updateData(collection, queryData) {
        let result = await dao.update(collection, {"companyID": queryData.companyId},{$set:{"name":"IBM"}});
        return (result);
    }

    /**
     * @description -Getting applicant count for specific job id
     *  @author Nandkumar
     * @param {object} collection having collection
     * @param {object} queryData having query
     * @returns {object} result
     */
    async getApplicantCount(collection, queryData) {
        let result = await dao.aggregate(collection, [{ $match: { "companyID": queryData.companyId } }, { $project: { "profile.jobs": 1, "_id": 0 } }]);
        for (let job of result[0].profile.jobs) {
            if (job.jobId === queryData.jobId)
                return job.applicants.length;
        }
        return ({ err: "No applicants" });
    }
}

module.exports=Company;


/*
db.orgs.aggregate([
    {$match: {'companyID': 'C006'}},
    {$project: {
        post: {$filter: {
            input: '$profile.jobs',
            as: 'job',
            $cond: {$eq: ['$$job.jobId', 'J008']}
        }},
        _id: 0
    }}
])*/