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
    await client.query("SELECT auth.id, auth.hashpassword, users.status from auth JOIN users ON auth.id = users.id WHERE email =$1;", [req.body.email],
        (err,res)=>{
            if (!err){
                if (bcrypt.compareSync(req.body.password, res.rows[0].hashpassword)){
                    res1.send({id: res.rows[0].id, status: res.rows[0].status})
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

function genJoinCode(){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i =0; i<8; i++){
        result=result+ chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
}

app.post('/users/usersetup', async (req,res1) =>{
    try{
        const hashed = await bcrypt.hashSync(req.body.password, 10)
        // salt for hash is within hashed, don't need to store separately
        console.log(req.body.email)
        const newIDreq = await client.query("INSERT INTO auth (email, hashpassword) VALUES ($1, $2) RETURNING id;", [req.body.email, hashed])
        const newID = newIDreq.rows[0].id
        if (req.body.status=='P'){
            const authcode = genJoinCode()
            await client.query("INSERT INTO users (id, first_name, last_name, status, authcode) VALUES ($1, $2, $3, $4, $5);", [newID, req.body.first_name, req.body.last_name, req.body.status, authcode])
        }
        else{
            await client.query("INSERT INTO users (id, first_name, last_name, status) VALUES ($1, $2, $3, $4);", [newID, req.body.first_name, req.body.last_name, req.body.status])
            }
        res1.status(200).send({id: newID})
        }
        
    catch{
        res1.status(500).send("error")
    }
})

const allowed_updateuser = new Set(["first_name", "last_name"]) 
app.post('/users/updateuser', async (req,res1) =>{
    try{
        console.log(req.body.changes)
        var changes = " ";
        var count = 1;
        var params = [];
        for (const key in req.body.changes){
            if (!(allowed_updateuser.has(key))){
                console.log(key)
            }
            else{
                changes = changes + `${key} = $${count++}, `
                params.push(req.body.changes[key])}
        }
        changes = changes.slice(0,-2) + " ";
        console.log(changes.toString());
        params.push(req.body.userID);
        console.log((`UPDATE users SET${changes} WHERE id= $${count};`))
        console.log(params)
        await client.query(`UPDATE users SET${changes} WHEREid= $${count};`, params)
        res1.status(200).send("success")
    }
        
        
    catch{
        res1.status(500).send("error")
    }
})


app.post('/users/addclient', async(req,res1)=>{
    try{
        console.log("INSERT INTO client_links (description, tutor_id, default_price, start) VALUES ($1, $2, $3, $4) RETURNING clientlink;")
        const addclient = await client.query("INSERT INTO client_links (description, tutor_id, default_price, start) VALUES ($1, $2, $3, $4) RETURNING clientlink;", [req.body.description, req.body.tutor_id, req.body.price, (new Date()).toISOString()])
        console.log(addclient)
        const newID = addclient.rows[0].clientlink
        res1.status(200).send({clientlink: newID})
    }
    catch{
        console.log("fail")
    }
})


app.post('/users/joinparent', async(req,res1)=>{
    try{
        console.log()
        const findparent = await client.query("SELECT users.id, users.first_name, users.last_name from auth JOIN users ON auth.id = users.id WHERE auth.email=$1 AND users.authcode=$2 AND users.status='P' ", [req.body.parent_email, req.body.authcode]);
        let newParent = findparent.rows[0];
        await client.query("UPDATE users SET authcode=$1 WHERE id=$2", [genJoinCode(), newParent.id]);
        const addparent = await client.query("UPDATE client_links SET parent_id = $1 WHERE clientlink=$2 and tutor_id=$3;", [newParent.id, req.body.clientlink, req.body.tutor_id]);
        res1.status(200).send({...newParent, email: req.body.parent_email});

    }
    catch{
        console.log("fail")
    }
})

app.post('/users/removeparent', async(req,res1)=>{
    try{
        console.log("this ran")
        console.log(req.body)
        if("tutor_id" in req.body){
            await client.query("UPDATE client_links SET parent_id = $1 WHERE clientlink=$2 AND tutor_id= $3", [null, req.body.clientlink, req.body.tutor_id])}
        else{
            await client.query("UPDATE client_links SET parent_id = $1 WHERE clientlink=$2 AND parent_id=$3", [null, req.body.clientlink, req.body.parent_id])}

        res1.status(200).send("success")
        }
    catch{
        console.log("fail")
    }
})

const allowed_updateclient = new Set(["description", "default_price", "privateNote", "publicNote"])
app.post('/updateclient', async(req,res1)=>{
    try{
        console.log(req.body.changes)
        var changes = " ";
        var count = 1;
        var params = [];
        for (const key in req.body.changes){
            if (!(allowed_updateclient.has(key))){
                console.log(key)
            }
            else{
                changes = changes + `${key} = $${count++}, `
                params.push(req.body.changes[key])}
        }
        changes = changes.slice(0,-2) + " ";
        console.log(changes.toString());
        params.push(req.body.clientlink);
        params.push(req.body.tutor_id);
        console.log((`UPDATE client_links SET${changes}WHERE clientlink= $${count} AND tutor_id =$${count+1};`))
        console.log(params)
        const lesson = await client.query(`UPDATE client_links SET${changes}WHERE clientlink= $${count} AND tutor_id =$${count+1};`, params)
        res1.status(200).send("success")
    }
    catch{
        console.log("failedhere")
    }
})

app.post('/home/getstudents', async(req,res1)=>{
    try{
        const students = await client.query("SELECT clientlink, description, default_price, start from client_links WHERE tutor_id=$1 ORDER BY start ASC;", [req.body.tutor_id])
        const tutor = await client.query("SELECT users.first_name, users.last_name, auth.email from auth JOIN users ON auth.id=users.id WHERE users.id =$1;", [req.body.tutor_id])
        console.log(tutor)
        const unpaid = await client.query("SELECT client_links.clientlink, client_links.description, lessons.lessonid, lessons.lessontime, lessons.title, lessons.price from lessons JOIN client_links ON lessons.clientlink = client_links.clientlink WHERE lessons.tutor_id = $1 AND lessons.paid=false  ORDER BY lessons.lessontime DESC;", [req.body.tutor_id])
        res1.status(200).send({students: students.rows, tutor: tutor.rows[0], unpaid: unpaid.rows})
    }
    catch{
        console.log("fail")
    }
})

app.post('/home/gettutors', async(req,res1)=>{
    try{
        const students = await client.query("SELECT clientlink, description, default_price, start from client_links WHERE parent_id=$1 ORDER BY start ASC;", [req.body.parent_id])
        const parent = await client.query("SELECT users.first_name, users.last_name, users.authcode, auth.email from auth JOIN users ON auth.id=users.id WHERE users.id =$1;", [req.body.parent_id])
        const unpaid = await client.query("SELECT client_links.clientlink, client_links.description, lessons.lessonid, lessons.lessontime, lessons.title, lessons.price from lessons JOIN client_links ON lessons.clientlink = client_links.clientlink WHERE client_links.parent_id = $1 AND lessons.paid=false  ORDER BY lessons.lessontime DESC;", [req.body.parent_id])
        res1.status(200).send({tutors: students.rows, parent: parent.rows[0], unpaid: unpaid.rows})
    }
    catch{
        console.log("fail")
    }
})

app.post('/studentdetail', async(req,res1)=>{
    try{
        const details = await client.query("SELECT * from client_links WHERE tutor_id=$1 AND clientlink =$2;", [req.body.tutor_id, req.body.clientlink])
        const lessons = await client.query("SELECT lessonid, lessontime, title, price, paid from lessons WHERE clientlink =$1 ORDER BY lessontime DESC;", [req.body.clientlink])
        console.log(details)
        var parent = {rows:[{}]}
        if (details.rows[0].parent_id!=null){
            parent = await client.query("SELECT users.first_name, users.last_name, auth.email from auth JOIN users ON auth.id=users.id WHERE users.id =$1;", [details.rows[0].parent_id])
        }
        res1.status(200).send({details: {...details.rows[0], parent: {...parent.rows[0]}}, lessons: lessons.rows})
    }
    catch{
        console.log("fail")
    }
})

app.post('/tutoringdetail', async(req,res1)=>{
    try{
        const details = await client.query("SELECT clientlink, tutor_id, description, default_price, public_note, start from client_links WHERE clientlink =$1 AND parent_id = $2;", [req.body.clientlink, req.body.parent_id])
        const lessons = await client.query("SELECT lessonid, lessontime, title, price, paid from lessons WHERE clientlink =$1 ORDER BY lessontime DESC;", [req.body.clientlink])
        const tutor = await client.query("SELECT users.first_name, users.last_name, auth.email from auth JOIN users ON auth.id=users.id WHERE users.id =$1;", [details.rows[0].tutor_id])
        res1.status(200).send({details: {...details.rows[0], tutor: {...tutor.rows[0]}}, lessons: lessons.rows})
    }
    catch{
        console.log("fail")
    }
})

app.post('/deleteclient', async(req,res1)=>{
    try{
        const details = await client.query("DELETE from client_links WHERE tutor_id=$1 AND clientlink =$2;", [req.body.tutor_id, req.body.clientlink])
        const lessons = await client.query("DELETE from lessons WHERE tutor_id=$1 AND clientlink =$2;", [req.body.tutor_id, req.body.clientlink])
        res1.status(200).send("deleted")
    }
    catch{
        console.log("fail")
    }
})


app.post('/addlesson', async(req,res1)=>{
    try{

        console.log("INSERT INTO lessons (lessontime, title, price, paid, complete, tutor_id, clientlink, publicnotes, privatenotes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING lessonid")

        newlesson = await client.query("INSERT INTO lessons (lessontime, title, price, paid, complete, tutor_id, clientlink, publicnotes, privatenotes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING lessonid",[req.body.lessontime, req.body.title, req.body.price, req.body.paid, req.body.complete, req.body.tutor_id, req.body.clientlink, "", ""])
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

app.post('/tutoring/getlesson', async(req,res1)=>{
    try{
        const lesson = await client.query("SELECT lessontime, title, price, paid, complete, tutor_id, clientlink, publicnotes from lessons WHERE lessonid=$1 AND clientlink =$2;", [req.body.lessonid, req.body.clientlink])
        res1.status(200).send(lesson.rows[0])
    }
    catch{
        console.log("failedhere")
    }
})

app.post('/deletelesson', async(req,res1)=>{
    try{
        console.log("delete ran")
        const lessons = await client.query("DELETE from lessons WHERE tutor_id=$1 AND clientlink =$2 AND lessonid=$3;", [req.body.tutor_id, req.body.clientlink, req.body.lessonid])
        res1.status(200).send("deleted")
    }
    catch{
        console.log("fail")
    }
})

const allowed_updatelesson = new Set(["lessonid", "lessontime", "title", "privateNotes", "publicNotes", "price", "paid", "tutor_id", "parent_id", "clientlink","complete"])
app.post('/updatelesson', async(req,res1)=>{
    try{
        console.log(req.body.changes)
        var changes = " ";
        var count = 1;
        var params = [];
        for (const key in req.body.changes){
            if (!(allowed_updatelesson.has(key))){
                console.log(key)
            }
            else{
                changes = changes + `${key} = $${count++}, `
                params.push(req.body.changes[key])}
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