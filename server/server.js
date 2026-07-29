// https://www.youtube.com/watch?v=Ud5xKCYQTjM

const express = require ("express")
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')
const cors = require('cors')
app.use(cors())
const { Client } = require("pg")
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password : "",
    database: "tutoring"
})

client.connect();

app.post('/users/login', async (req,res1) =>{
    await client.query("SELECT * from auth WHERE email =$1;", [req.body.email],
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
        const newIDreq = await client.query("INSERT INTO auth (email, hashpassword) VALUES ($1, $2) RETURNING id;", [req.body.email, hashed])
        const newID = newIDreq.rows[0].id
        await client.query("INSERT INTO users (id, first_name, last_name, status) VALUES ($1, $2, $3, $4);", [newID, req.body.first_name, req.body.last_name, req.body.status])
        res1.status(200).send({id: newID})}
    catch{
        res1.status(500).send("error")
    }
})


app.post('/users/addclient', async(req,res1)=>{
    try{
        console.log("INSERT INTO client_links (description, tutor_id, default_price) VALUES ($1, $2, $3) RETURNING clientlink;")
        const addclient = await client.query("INSERT INTO client_links (description, tutor_id, default_price) VALUES ($1, $2, $3) RETURNING clientlink;", [req.body.description, req.body.tutor_id, req.body.price])
        console.log(addclient)
        const newID = addclient.rows[0].clientlink
        res1.status(200).send({clientlink: newID})
    }
    catch{
        console.log("fail")
    }
})

app.post('/home/getstudents', async(req,res1)=>{
    try{
        const students = await client.query("SELECT clientlink, description, default_price from client_links WHERE tutor_id=$1;", [req.body.tutor_id])
        res1.status(200).send({students: students.rows})
    }
    catch{
        console.log("fail")
    }
})

app.post('/studentdetail', async(req,res1)=>{
    try{
        const details = await client.query("SELECT * from client_links WHERE tutor_id=$1 AND clientlink =$2;", [req.body.tutor_id, req.body.clientlink])
        const lessons = await client.query("SELECT lessonid, lessontime, title, price, paid from lessons WHERE tutor_id=$1 AND clientlink =$2 ORDER BY lessontime DESC;", [req.body.tutor_id, req.body.clientlink])
        res1.status(200).send({details: details.rows[0], lessons: lessons.rows})
    }
    catch{
        console.log("fail")
    }
})


app.post('/addlesson', async(req,res1)=>{
    try{

        console.log("INSERT INTO lessons (lessontime, title, price, paid, complete, tutor_id, clientlink) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING lessonid")

        newlesson = await client.query("INSERT INTO lessons (lessontime, title, price, paid, complete, tutor_id, clientlink) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING lessonid",[req.body.lessontime, req.body.title, req.body.price, req.body.paid, req.body.complete, req.body.tutor_id, req.body.clientlink])
        console.log(newlesson);
        const newID = newlesson.rows[0].lessonid;
        res1.status(200).send({lessonID: newID});
    }
    catch{
        console.log("failhere2")
    }
    
})

app.post('/getlesson', async(req,res1)=>{
    try{
        const lesson = await client.query("SELECT * from lessons WHERE lessonid=$1 AND tutor_id =$2;", [req.body.lessonid, req.body.tutor_id])
        res1.status(200).send(lesson.rows[0])
    }
    catch{
        console.log("failedhere")
    }
})

const allowed = new Set(["lessonid", "lessontime", "title", "privatenotes", "publicnotes", "price", "paid", "tutor_id", "parent_id", "clientlink","complete"])
app.post('/updatelesson', async(req,res1)=>{
    try{
        console.log(req.body.changes)
        var changes = " ";
        var count = 1;
        var params = [];
        for (const key in req.body.changes){
            if (!(allowed.has(key))){
                console.log(key)
                //res1.status(500).send("field name error")
            }
            changes = changes + `${key} = $${count++}, `
            params.push(req.body.changes[key])
        }
        changes = changes.slice(0,-2) + " ";
        console.log(changes.toString());
        params.push(req.body.lessonid);
        params.push(req.body.tutor_id);
        console.log((`UPDATE lessons SET${changes}WHERE lessonid= $${count} AND tutor_id =$${count+1};`))
        console.log(params)
        const lesson = await client.query(`UPDATE lessons SET${changes}WHERE lessonid= $${count} AND tutor_id =$${count+1};`, params)
        res1.status(200).send("success")
    }
    catch{
        console.log("failedhere")
    }
})





app.listen(3000)