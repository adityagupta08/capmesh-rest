const express = require('express');
const app = express();

const Dao = require('../data-access/data-access');
const dao = new Dao();

/*
*Description:when the user clicks on 'Like':Based on postuserId and postid
*       the name of the particular user will be added to the like section
*       of that particular post along with time.
*(postuserId,postid,username,timestamp)
*@author (P.Puneeth,Sajida)
*@param {Database collection} collections 
*@param {number} postuserId
*@param {number} postid
*@param {string} username
*@param {date} timestamp
*@returns {object} result
*/

/*
*Description:when the user again clicks on 'Like':Based on postuserId and postid
*       the name of the particular user will be removed from the like section
*       of that particular post along with time.
*(postuserId,postid,username,timestamp)
*@author (P.Puneeth,Sajida)
*@param {Database collection} collections 
*@param {number} postuserId
*@param {number} postid
*@param {string} username
*@param {date} timestamp
*@returns {object} result
*/


class likes {

    async getLike(collections,userName,postId,likedByname) {
       let result = await dao.update(collections, {$and:[{"userName":userName},{"posts.postId":postId}]},{$push:{"posts.$.likes":{"likedBy":likedByname,"timestamp":new Date()}}});
        return (result);
    }

    async removeLike(collections,userName,postid,likedByname) {
        
       let result = await dao.update(collections, {$and:[{"userName":userName},{"posts.postId":postid}]},{$pull:{"posts.$.likes":{"likedBy":likedByname}}});
        return (result);
    }

    /*async getLikesDetails(collections,id) {
        let query = [{ $project: { "posts.postId": 1 ,"posts.likes": 1 } },{$unwind:"$posts"},{ $match:  [{ "posts.postId":id},{ "userName": userName }] }]
        let result=await dao.aggregate(collections,query);
        let count=result[0].posts.likes.length;
        result.push({"count":count})
        //console.log(result[1].count)
        return (result);
    }*/
}

module.exports = likes