// https://www.youtube.com/watch?v=Ud5xKCYQTjM
const { createClient } = require ('@supabase/supabase-js')
const express = require ("express")
const https = require("https")
const fs = require('fs')
const path = require('path')
const config = require('./config.js')
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


const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)



async function verifyUser(userID, token){
    const {data: { user }, error }= await supabase.auth.getUser(token)
    if (error || userID!= user.id){
        return -1
    }
    else{
        const {data: responses} = await supabase.from('users').select('id').eq('UUID', userID).limit(1)
        return responses[0].id
    }
}


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
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user
        const {data: { user }, error }= await supabase.auth.getUser(token)
        if (error || reqUUID != user.id){
            res1.status(204).send("user credentials do not match")
        }

        var usersetup;
        if (!req.body.isTutor){
            const authcode = genJoinCode()
            usersetup = await supabase.from('users').insert({...req.body.userData, UUID: reqUUID, authcode: genJoinCode()})
        }
        else{
            usersetup = await supabase.from('users').insert({...req.body.userData, UUID: reqUUID})
            }
        if(!usersetup.error) res1.status(200).send({status: "success"})
        else res1.status(204).send({status: "error in adding details"})
    }
    catch{
        res1.status(500).send("error")
    }
})

const allowed_updateuser = new Set(["first_name", "last_name"]) 
app.post('/users/updateuser', async (req,res1) =>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        for (const key in req.body.changes){
            if (!(allowed_updateuser.has(key))){
                res1.status(500).send("error in keys provided")
            }
        }
        const { error } = await supabase.from('users').update(req.body.changes).eq('id', checkUser)
        if (!error){
            res1.status(200).send("success")
        }
        else{
            res1.status(400).send("error on update")
        }
    }
    catch{
        res1.status(500).send("error")
    }
})


app.post('/users/addclient', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user
        
        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        const addclient = await supabase.from('client_links').insert({...req.body.newStudent, tutor_id : checkUser}).select('clientlink')
        const newID = addclient.data[0].clientlink
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

const allowed_updateclient = new Set(["description", "default_price", "private_note", "public_note"])
app.post('/updateclient', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        for (const key in req.body.changes){
            if (!(allowed_updateclient.has(key))){
                console.log(key)
                res1.status(500).send("error in keys provided")
            }
        }
        const { error } = await supabase.from('client_links').update(req.body.changes).eq('clientlink', req.body.clientlink).eq('tutor_id', checkUser)
        if (!error){
            res1.status(200).send("success")
        }
        else{
            res1.status(400).send("error on update")
        }
    }
    catch{
        console.log("failedhere")
    }
})

app.post('/home/getstudents', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }
        
        const students = await supabase.from('client_links').select('clientlink, description, default_price, start').eq('tutor_id', checkUser).order('start', { ascending: true})
        console.log(students)
        const tutor = await supabase.from('users').select('first_name, last_name').eq('id', checkUser).eq('is_tutor', true).limit(1)
        console.log(tutor)
        const unpaid = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links(description)').eq('paid', false).eq('tutor_id', checkUser).order('lessontime', { ascending: true})
        console.log(unpaid.data)
        res1.status(200).send({students: students.data, tutor: tutor.data[0], unpaid: unpaid.data})
    }
    catch{
        res1.status(400).send("error in retrieving data on server side")
        console.log("failed while finding user")
    }
})

app.post('/home/gettutors', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }
        

        const tutors = await supabase.from('client_links').select('clientlink, description, default_price, start').eq('parent_id', checkUser).order('start', { ascending: true})
        console.log(tutors)
        const parent = await supabase.from('users').select('first_name, last_name').eq('id', checkUser).eq('is_tutor', false).limit(1)
        console.log(parent)
        const unpaid = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links!inner(description)').eq('paid', false).eq('client_links.parent_id', checkUser).order('lessontime', { ascending: true})
        console.log(unpaid)
        res1.status(200).send({tutors: tutors.data, parent: parent.data, unpaid: unpaid.data})
    }
    catch{
        console.log("fail")
    }
})

app.post('/studentdetail', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }


        const details = await supabase.from('client_links').select('clientlink, description, parent_id, start, default_price, public_note, private_note').eq('tutor_id', checkUser).eq('clientlink', req.body.clientlink)
        const lessons = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid').eq('clientlink', req.body.clientlink).eq('tutor_id', checkUser).order('lessontime', { ascending: false })
        var parent = {data:[{}]}
        const parentid = details.data[0].parent_id
        console.log(parentid)
        if (parentid!=null){
            parent = await supabase.from('users').select('first_name, last_name').eq('id', parentid)
        }

        console.log(details)
        console.log(lessons)

        res1.status(200).send({details: {...details.data[0]}, parent: {...parent.data[0]}, lessons: lessons.data})
    }
    catch{
        console.log("fail")
    }
})

app.post('/tutoringdetail', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        const details = await supabase.from('client_links').select('clientlink, tutor_id, description, default_price, public_note, start').eq('clientlink', req.body.clientlink).eq('parent_id', checkUser)
        if (details.data.length>0){
            const lessons = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid from lessons').order('lessontime', {ascending: false})
            let tutorID = details.data[0].tutor_id
            const tutor = await supabase.from('users').select('first_name, last_name').eq('id', tutorID)
            res1.status(200).send({details: {...details.data[0], tutor: {...tutor.data[0]}}, lessons: lessons.data})
        }
       res1.status(400).send("clientlink does not match user")
    }
    catch{
        console.log("fail")
    }
})

app.post('/deleteclient', async(req,res1)=>{
    try{

        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        const { error1 } = await supabase.from('client_links').delete().eq('tutor_id', checkUser).eq('clientlink', req.body.clientlink)
        const { error2 } = await supabase.from('lessons').delete().eq('tutor_id', checkUser).eq('clientlink', req.body.clientlink)

        if (!error1 && !error2){
            res1.status(200).send("deleted")}
        res1.status(204).send("error in deletion")
    }
    catch{
        res1.status(500).send("error on deleting client")
    }
})


app.post('/addlesson', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }
        
        const client_check = await supabase.from('client_links').select('*', {count: 'exact', head:true}).eq('tutor_id', checkUser).eq('clientlink', req.body.newLesson.clientlink)
        if (client_check.count>0){
            const newlesson = await supabase.from('lessons').insert({...req.body.newLesson, tutor_id: checkUser}).select('lessonid')
            let newlessonID = newlesson.data[0].lessonid
            res1.status(200).send({lessonID: newlessonID})
        }
        
        res1.status(204).send("user not authenticated to add lesson to that client")
    }
    catch{
        res1.status(500).send("error on adding lesson")
    }
    
})

app.post('/getlesson', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }
        const lesson = await supabase.from('lessons').select('lessontime, title, publicnotes, privatenotes, price, paid, complete').eq('lessonid', req.body.lessonid).eq('tutor_id', checkUser)
        console.log(lesson)
        res1.status(200).send(lesson.data[0])
    }
    catch{
        res1.status(500).send("error on getting lesson")
    }
})

app.post('/tutoring/getlesson', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }
        const lesson = await supabase.from('lessons').select('lessontime, title, price, paid, complete, tutor_id, clientlink, publicnotes, client_links!inner()').eq(lessonid, req.body.lessonid).eq('client_links.parent_id', checkUser)
        res1.status(200).send(lesson.data[0])
    }
    catch{
        res1.status(500).send("error on lesson fetch")
    }
})

app.post('/deletelesson', async(req,res1)=>{
    try{
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        const { error } = await supabase.from('lessons').delete().eq('lessonid', req.body.lessonid).eq('tutor_id', checkUser).eq('clientlink', req.body.clientlink)
        if (!error){
            res1.status(200).send("deleted")
        }
        else{
            res1.status(400).send("error on delete")
        }
    }
    catch{
        res1.status(500).send("error on delete")
    }
})

const allowed_updatelesson = new Set(["lessonid", "lessontime", "title", "privatenotes", "publicnotes", "price", "paid", "tutor_id", "parent_id", "clientlink","complete"])
app.post('/updatelesson', async(req,res1)=>{
    try{
        
        token = req.body.headers.Authorization.split(" ")[1]
        reqUUID = req.body.user

        checkUser = await verifyUser(reqUUID, token)
        if (checkUser==-1){
            console.log(error)
            res1.status(400).send("user does not match")
        }

        for (const key in req.body.changes){
            if (!(allowed_updatelesson.has(key))){
                res1.status(400).send("error in keys provided")
            }
        }

        const { error } = await supabase.from('lessons').update(req.body.changes).eq('tutor_id', checkUser).eq('lessonid', req.body.lessonid)

        if (!error){
            res1.status(200).send("success")
        }
        else{
            res1.status(400).send("error on update")
        }
    }
    catch{
        res1.status(500).send("error on update")
    }
})

/* Local HTTPS Code
const options = {
    key: config.PRIVATE_KEY,
    cert: config.CERTIFICATE,
    secureOptions: require('constants').SSL_OP_NO_SSLv3,
    minVersion: 'TLSv1.2',

}

https.createServer(options, app).listen(443, ()=>{
    console.log('HTTPS Server runnning on 443')
})

*/

app.listen(443)

