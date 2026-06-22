// https://www.youtube.com/watch?v=Ud5xKCYQTjM

const express = require ("express")
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')
 

const users = []

// remove before prod
app.get('/users', (req,res) =>{
    res.json(users)
})

app.post('/users/login', async (req,res) =>{
    const user = users.find(user => user.name = req.body.name)
    if (user==null){
        return res.status(400).send('Cannot find user')
    }
    try{
        if(bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
        }
        else{
            res.send('Not allowed')
        }
    }
    catch{
        res.status(500).send()
    }
})

app.post('/users', async (req,res) =>{
    try{
        const hashed = await bcrypt.hash(req.body.password, 10)
        // salt for hash is within hashed, don't need to store separately
        const user = {name : req.body.name, password: hashed}
        users.push(user)
        res.status(201).send()
    }
    catch{
        res.status(500).send()
    }
})

app.listen(3000)