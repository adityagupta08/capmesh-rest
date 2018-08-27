/*
    Module for DataAcessLayer
    Exports - Dao Class

    @author: Himanshu Sagar
 */

const mongoClient = require('mongodb')
const URL = 'mongodb://10.102.55.82:27017/'

class Dao {
    
    async insert(collection, obj) {
        if (obj == undefined || obj == {})
            throw "Object is Empty"
        let mongo = await mongoClient.connect(URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db('linkedindemo')
            result = (await db.collection(collection).insertOne(obj))
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }

    async find(collection, query) {
        if (query == undefined)
            query = {}
        let mongo = await mongoClient.connect(URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db('linkedindemo')
            result = (await db.collection(collection).find(query).toArray())
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }

    async aggregate(collection, query) {
        if (query == undefined)
            query = []
        let mongo = await mongoClient.connect(URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db('linkedindemo')
            result = (await db.collection(collection).aggregate(query).toArray())
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }

    async update(collection, query, newValues, upsert, bool) {
        if(bool == undefined)
            bool = {};
        if(upsert == undefined)
            upsert = {};
        if (newValues == undefined || newValues == {})
            throw "Object is Empty"
        let mongo = await mongoClient.connect(URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db('linkedindemo')
            result = (await db.collection(collection).updateOne(query, newValues,upsert))
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }


    async delete(collection, query) {
        if (query == undefined)
            query = {}
        let mongo = await mongoClient.connect(URL, { useNewUrlParser: true })
        let result
        try {
            let db = mongo.db('linkedindemo')
            result = (await db.collection(collection).deleteOne(query))
            return result
        }
        catch (err) {
            throw err
        }
        finally {
            mongo.close()
        }
    }
}

module.exports = Dao