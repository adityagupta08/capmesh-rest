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

    async getLike(collections,userName,time) {
       let result = await dao.update(collections, {$and:[{"userName":"vinal"},{"posts.postId":5}]},
       {$push:{"posts.$.likes":{"likedBy":userName,"timestamp":time}}});
        return (result);
    }

    async removeLike(collections,userName,time) {
        
       let result = await dao.update(collections, {$and:[{"userName":"vinal"},{"posts.postId":5}]},
       {$pull:{"posts.$.likes":{"likedBy":userName,"timestamp":time}}});
        return (result);
    }
}

module.exports = likes