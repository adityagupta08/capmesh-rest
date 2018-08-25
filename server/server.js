const express = require('express')
const app = express()

const Dao = require('./modules/data-access/data-access')

const dao = new Dao()

app.get('/rest/api/users/get/', async (req, res) => {
    let result = await dao.find("users", {name:'kuldeep'})
    res.send(result)
})

app.post('/rest/api/users/add', async (req, res) => {
    obj = {
        userName: 'soumya145',
        name: 'soumya',
        email: 'soumyaN@hotmail.com',
        mobile: '9123876903',
        gender: 'F', dateOfBirth:
            new Date("1996-07-01"),
        isVerified: false,
        isDeleted: false
    }
    let result
    try {
        result = await dao.insert("users")
    }
    catch (err){
        result = {error:"err"}
    }
    res.send(result)
})

app.delete('/rest/api/users/delete/', async (req, res) => {
    let result = await dao.delete("users", { name: 'soumya' })
    res.send(result)
})

app.patch('/rest/api/users/update/', async (req, res) => {
    let result
    try {
        result = await dao.update("users",{ name: 'soumya' },{$set:{name:"Soumya"}})
    } 
    catch (err) {
        result = {err:err}
    }
    res.send(result)
})


app.listen('8080', () => console.log('Listening on port 8080'))