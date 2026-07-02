// https://www.youtube.com/watch?v=Ud5xKCYQTjM

const express = require ("express")
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')
const cors = require('cors')
app.use(cors())
const {Client} = require("pg")
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password : "",
    database: "tutoring"
})

client.connect();

app.post('/users/login', async (req,res1) =>{
    await client.query("SELECT * from auth WHERE email ='"+req.body.email+"';",
        (err,res)=>{
            if (!err){
                if (bcrypt.compareSync(req.body.password, res.rows[0].hashpassword)){
                    res1.send({id: res.rows[0].id})
                }
                else{
                    res1.status(400).send("Incorrect password or email")
                }
            }
            else{
                res1.status(400).send("Unexpected error")
            }
        }
    )
})

app.post('/users/usersetup', async (req,res1) =>{
    try{
        const hashed = await bcrypt.hashSync(req.body.password, 10)
        // salt for hash is within hashed, don't need to store separately
        console.log(req.body.email)
        const newIDreq = await client.query("INSERT INTO auth (email, hashpassword) VALUES ('"+req.body.email+"', '"+hashed+"') RETURNING id;")
        const newID = newIDreq.rows[0].id
        await client.query("INSERT INTO users (id, first_name, last_name, status) VALUES ('"+newID+"', '"+req.body.first_name+"', '"+req.body.last_name+"', '"+req.body.status+"');")
        res1.status(200).send({id: newID})}
    catch{
        res1.status(500).send("error")
    }
})


app.post('/users/addclient', async(req,res1)=>{
    try{
        const addclient = await client.query("INSERT INTO client_links (description, tutor_id, default_price) VALUES ('"+req.body.description+"', '"+req.body.tutor_id+"', '"+req.body.price+"') RETURNING id;")
        const newID = addclient.rows[0].id
        res1.status(200).send({id: newID})
    }
    catch{
        console.log("fail")
    }
})

app.post('/home/getstudents', async(req,res1)=>{
    try{
        const students = await client.query("SELECT id, description, default_price from client_links WHERE tutor_id='"+req.body.tutor_id+"';")
        console.log("req")
        res1.status(200).send({students: students.rows})
    }
    catch{
        console.log("fail")
    }
})


app.listen(3000)