const Dao = require('../data-access/data-access');
const dao = new Dao();

class Search
{
    /**
 * @description to search people in the database by the name
 * @author Sourav Sharma, Surabhi Kulkarni, Richa Madhupriya
 * @param {string} userName
 * @returns {Object} result 
 */

 async searchPeople(collection, query) {
        var filter = {"name":  new RegExp(query, 'i') }
        let result = await dao.find(collection, filter);
        return (result);
    }

}

module.exports = Search