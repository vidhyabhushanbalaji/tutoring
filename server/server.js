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
const cookieParser= require('cookie-parser')
app.use(cookieParser())
app.use(cors())

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
const sbAuth = createClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY)

const cookieOpts = {httpOnly: true, secure: true, sameSite: 'lax'}

async function verifyUser(req, res){
    const token = req.cookies['sb-access-token']
    if (!token) return res.status(401).end()
    const { data: { user }, error } = await sbAuth.auth.getUser(token)
    if (!error && user){
        let reqUUID = user.id
        const {data: responses} = await supabase.from('users').select('id, is_tutor').eq('UUID', reqUUID).limit(1)
        return responses[0]
    }

    const refresh_token = req.cookies['sb-refresh-token']
    if (!refresh_token) {return res.status(401).send({error: "authentication"})}
    const {data, error: refreshError} = await sbAuth.auth.refreshSession({ refresh_token : refresh_token})
    if (refreshError || !data.session){
        res.clearCookie("sb-access-token", cookieOpts)
        res.clearCookie("sb-refresh-token", cookieOpts)
        return res.status(401).send({error: "authentication"})
    }
    const {access_token, refresh_token: newRefresh, expires_in, user: refreshedUser} = data.session
    res.cookie('sb-access-token', access_token, {...cookieOpts, maxAge: expires_in*1000})
    res.cookie('sb-refresh-token', newRefresh, {...cookieOpts, maxAge: 60*60*24*30*1000})

    let reqUUID = refreshedUser.id
    const {data: responses} = await supabase.from('users').select('id, is_tutor').eq('UUID', reqUUID).limit(1)
    return responses[0]
    
}


function genJoinCode(){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i =0; i<8; i++){
        result=result+ chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
}

app.post('/users/usersetup', async (req,res) =>{
    try{
        const { data, error } = await sbAuth.auth.signUp({
            email: req.body.email,
            password: req.body.password,
        })
        if (error) return res.status(401).json({ error: error.message })
        console.log(data)
        const { access_token, refresh_token, expires_in } = data.session
        res.cookie('sb-access-token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: expires_in * 1000,
        })
        res.cookie('sb-refresh-token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 * 1000
        })
        console.log("hereA")
        var usersetup=null
        console.log(req.body.userData)
        console.log(data.user.id)
         
        if (!req.body.userData.is_tutor){
            usersetup = await supabase.from('users').insert({...req.body.userData, email: req.body.email,  UUID: data.user.id, authcode: genJoinCode()})
        }
        else{
            console.log("here1")
            usersetup = await supabase.from('users').insert({...req.body.userData, email: req.body.email, UUID: data.user.id})
            console.log(usersetup)
            }
        if (usersetup)
            {res.json({ user: data.user })}
        else{
            res.status(400).send("error in adding user")
        }
    }
    catch{
        res.status(500).send("error")
    }
})

app.post('/users/login', async (req,res) =>{
    try{
        const { email, password } = req.body
        const { data, error } = await sbAuth.auth.signInWithPassword({ email, password })
        if (error) return res.status(401).json({ error: error.message })

        const { access_token, refresh_token, expires_in } = data.session

        res.cookie('sb-access-token', access_token, {
            ...cookieOpts,
            maxAge: expires_in * 1000,
        })
        res.cookie('sb-refresh-token', refresh_token, {
            ...cookieOpts,
            maxAge: 60 * 60 * 24 * 30 * 1000
        })

        res.json({ user: data.user })
    }
    catch{
        res.status(500).send("error")
    }
})

app.post('/users/logout', async (req,res) =>{
    try{
        const token = req.cookies['sb-access-token']
        if (token) {
            await supabase.auth.admin.signOut(token, "global")
        }
        res.clearCookie('sb-access-token', cookieOpts)
        res.clearCookie('sb-refresh-token', cookieOpts)
        res.status(200).json({success: true})
    }
    catch{
        res.status(400).send("couldn't log out")
    }
})

const allowed_updateuser = new Set(["first_name", "last_name"]) 
app.post('/users/updateuser', async (req,res1) =>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

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
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        const addclient = await supabase.from('client_links').insert({...req.body.newStudent, tutor_id : checkUser}).select('clientlink')
        const newID = addclient.data[0].clientlink
        res1.status(200).send({clientlink: newID})
    }
    catch{
        res1.status(500).send("error on adding the client, try again")
    }
})


app.post('/users/joinparent', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        const findparent = await supabase.from('users').select('id, first_name, last_name').eq('email', req.body.parent_email).eq('authcode', req.body.authcode).eq('is_tutor', false)

        if (findparent.data.length==0){
            res1.status(400).send("no parent with these details exists")
        }

        
        const joinparent = await supabase.from('client_links').update({parent_id: findparent.data[0].id}).eq("clientlink", req.body.clientlink).eq("tutor_id", checkUser)

        const updateparent = await supabase.from('users').update({authcode: genJoinCode()}).eq("id", findparent.data[0].id)

        if(!joinparent.error && !updateparent.error){
            res1.status(200).send({first_name: findparent.data[0].first_name, last_name: findparent.data[0].last_name});
        }

        res1.status(500).send("error on updating")

    }
    catch{
        res1.status(500).send("failed to complete request")
    }
})

app.post('/users/removeparent', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        var query;
        if(req.body.is_tutor){
            query = await supabase.from('client_links').update({parent_id: null}).eq('clientlink', req.body.clientlink).eq('tutor_id', checkUser)}
        else{
            query = await supabase.from('client_links').update({parent_id: null}).eq('clientlink', req.body.clientlink).eq('parent_id', checkUser)}
        

        if(!query.error){
            res1.status(200).send("success")}
        res1.status(500).send("error on removing parent from the record")
        }
    catch{
        res1.status(500).send("error on removing parent from the record")
    }
})

const allowed_updateclient = new Set(["description", "default_price", "private_note", "public_note"])
app.post('/updateclient', async(req,res)=>{
    try{
        verified = await verifyUser(req, res)
        checkUser= verified.id

        for (const key in req.body.changes){
            if (!(allowed_updateclient.has(key))){
                res.status(500).send("error in keys provided")
            }
        }
        const { error } = await supabase.from('client_links').update(req.body.changes).eq('clientlink', req.body.clientlink).eq('tutor_id', checkUser)
        if (!error){
            res.status(200).send("success")
        }
        else{
            res.status(400).send("error on update")
        }
    }
    catch{
        res.status(500).send("error on update")
        console.log("failedhere")
    }
})

app.post('/homepage', async(req,res)=>{
    try{
        verified = await verifyUser(req, res)
        checkUser= verified.id
        isTutor = verified.is_tutor

        if(isTutor){
            const students = await supabase.from('client_links').select('clientlink, description, default_price, start').eq('tutor_id', checkUser).order('start', { ascending: true})
            const tutor = await supabase.from('users').select('first_name, last_name, email').eq('id', checkUser).eq('is_tutor', true).limit(1)
            const unpaid = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links(description)').eq('paid', false).eq('tutor_id', checkUser)
            const timefrom = new Date(new Date() - 60*60*1000).toISOString()

            // find the start of this week, and the start of next week
            const now = new Date()
            const weekStartDate = new Date()
            weekStartDate.setDate(now.getDate()-((now.getDay()+6)%7))
            weekStartString = weekStartDate.toISOString().slice(0,11)+"00:00:00.000Z"
            const nextWeekDate = new Date()
            nextWeekDate.setDate(weekStartDate.getDate()+7)
            nextWeekString = nextWeekDate.toISOString().slice(0,11)+"00:00:00.000Z"

            const thisWeek = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links(description)').eq('tutor_id', checkUser).gte('lessontime', weekStartString).lt('lessontime', nextWeekString).order('lessontime', { ascending: true})

            const next3 = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links(description)').eq('tutor_id', checkUser).gte('lessontime', timefrom).limit(3).order('lessontime', { ascending: true})

            res.status(200).send({is_tutor: true, students: students.data, tutor: tutor.data[0], unpaid: unpaid.data, next3: next3.data, thisWeek: thisWeek.data})}
        else{
            const tutors = await supabase.from('client_links').select('clientlink, description, default_price, start').eq('parent_id', checkUser).order('start', { ascending: true})
            const parent = await supabase.from('users').select('first_name, last_name, email, authcode').eq('id', checkUser).eq('is_tutor', false).limit(1)
            const unpaid = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links!inner(description)').eq('paid', false).eq('client_links.parent_id', checkUser).order('lessontime', { ascending: true})
            const timefrom = new Date(new Date() - 60*60*1000).toISOString()
            const next3 = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links!inner(description)').eq('client_links.parent_id', checkUser).gte('lessontime', timefrom).limit(3).order('lessontime', { ascending: true})

            res1.status(200).send({is_tutor: false, tutors: tutors.data, parent: parent.data[0], unpaid: unpaid.data, next3: next3.data})
        }
    }
        
    catch{
        res.status(400).send("error in retrieving data on server side")
        console.log("failed while finding user")
    }
})

app.post('/payments', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        isTutor = verified.is_tutor
        
        const now = new Date()
        const startOfMonth = now.toISOString().slice(0,8)+"01T00:00:00.000Z"
        const dateStartOfMonth = new Date(startOfMonth)
        const nextMonth = new Date(dateStartOfMonth)
        nextMonth.setMonth(dateStartOfMonth.getMonth() +1)

        if(isTutor){
            const thisMonth = await supabase.from('lessons').select('lessonid, paid, lessontime, title, price, clientlink, client_links(description)').eq('tutor_id', checkUser).gte('lessontime', startOfMonth).lt('lessontime', nextMonth.toISOString()).order('lessontime', { ascending: false})
            const clients = await supabase.from('client_links').select('description, clientlink').eq('tutor_id', checkUser)
            res1.status(200).send({is_tutor: true, thisMonth: thisMonth.data, clients: clients.data})
        }
        else{
            const thisMonth = await supabase.from('lessons').select('lessonid, paid, lessontime, title, price, clientlink, client_links!inner(description)').eq('client_links.parent_id', checkUser).gte('lessontime', startOfMonth).lt('lessontime', nextMonth.toISOString()).order('lessontime', { ascending: false})
            const clients = await supabase.from('client_links').select('description, clientlink').eq('parent_id', checkUser)
            res1.status(200).send({is_tutor: false, thisMonth: thisMonth.data, tutors: clients.data})
        }
        
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})

app.post('/tutor/payments/allunpaid', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        
        const unpaid = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid, clientlink, client_links(description)').eq('paid', false).eq('tutor_id', checkUser).order('lessontime', { ascending: false})
        res1.status(200).send({unpaid: unpaid.data})
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})

app.post('/tutor/payments/byclient', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        
        const byclient = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid, clientlink, client_links(description)').eq('clientlink', req.body.clientlink).eq('tutor_id', checkUser).order('lessontime', { ascending: false})
        res1.status(200).send(byclient.data)
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})

app.post('/tutor/payments/byrange', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        const gap = (new Date(req.body.end)) - (new Date(req.body.start))
        if (gap>60*60*24*366*1000 || gap <0){
            res1.status(204).send("Invalid date range")
        }
        
        const rangeStart = `${req.body.start}T00:00:00.000Z`
        const rangeEnd = `${req.body.end}T23:59:59.999Z`

        const inRange = await supabase.from('lessons').select('lessonid, paid, lessontime, title, price, clientlink, client_links(description)').eq('tutor_id', checkUser).gte('lessontime', rangeStart).lte('lessontime',rangeEnd).order('lessontime', { ascending: false})
        res1.status(200).send(inRange.data)
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})

app.post('/parent/payments/allunpaid', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        
        const unpaid = await supabase.from('lessons').select('lessonid, lessontime, title, price, clientlink, client_links!inner(description)').eq('paid', false).eq('client_links.parent_id', checkUser).order('lessontime', { ascending: false})
        res1.status(200).send({unpaid: unpaid.data})
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})

app.post('/parent/payments/bytutor', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        const bytutor = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid, clientlink, client_links(description)').eq('clientlink', req.body.clientlink).eq('client_links.parent_id', checkUser).order('lessontime', { ascending: false})
        res1.status(200).send(bytutor.data)
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})

app.post('/parent/payments/byrange', async(req, res1)=>{
    
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        
        const gap = (new Date(req.body.end)) - (new Date(req.body.start))
        if (gap>60*60*24*366*1000 || gap <0){
            res1.status(204).send("Invalid date range")
        }

        const rangeStart = `${req.body.start}T00:00:00.000Z`
        const rangeEnd = `${req.body.end}T23:59:59.999Z`


        const inRange = await supabase.from('lessons').select('lessonid, paid, lessontime, title, price, clientlink, client_links(description)').eq('client_links.parent_id', checkUser).gte('lessontime', rangeStart).lte('lessontime',rangeEnd).order('lessontime', { ascending: false})
        res1.status(200).send(inRange.data)
    }
    catch{
        res1.status(500).send("error fetching data")
    }
})


app.post('/studentdetail', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id


        const details = await supabase.from('client_links').select('clientlink, description, parent_id, start, default_price, public_note, private_note').eq('tutor_id', checkUser).eq('clientlink', req.body.clientlink)
        const lessons = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid').eq('clientlink', req.body.clientlink).eq('tutor_id', checkUser).order('lessontime', { ascending: false })
        var parent = {data:[{}]}
        const parentid = details.data[0].parent_id
        if (parentid!=null){
            parent = await supabase.from('users').select('first_name, last_name, email').eq('id', parentid)
        }



        res1.status(200).send({details: {...details.data[0], parent_id:-1,  parent: {...parent.data[0]}}, lessons: lessons.data})
    }
    catch{
        console.log("fail")
    }
})

app.post('/tutoringdetail', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        const details = await supabase.from('client_links').select('clientlink, tutor_id, description, default_price, public_note, start').eq('clientlink', req.body.clientlink).eq('parent_id', checkUser)
        if (details.data.length>0){
            const lessons = await supabase.from('lessons').select('lessonid, lessontime, title, price, paid').eq('clientlink', req.body.clientlink).order('lessontime', {ascending: false})
            let tutorID = details.data[0].tutor_id
            const tutor = await supabase.from('users').select('first_name, last_name, email').eq('id', tutorID)
            res1.status(200).send({details: {...details.data[0], tutor: {...tutor.data[0]}}, lessons: lessons.data})
        }
        else{
            res1.status(400).send("clientlink does not match user")}
    }
    catch{
        res1.status(500).send("error matching user")
    }
})

app.post('/deleteclient', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

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
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        
        const client_check = await supabase.from('client_links').select('*', {count: 'exact', head:true}).eq('tutor_id', checkUser).eq('clientlink', req.body.newLesson.clientlink)
        if (client_check.count>0){
            const newlesson = await supabase.from('lessons').insert({...req.body.newLesson, tutor_id: checkUser}).select('lessonid')
            let newlessonID = newlesson.data[0].lessonid
            return res1.status(200).send({lessonID: newlessonID})
        }
        
        res1.status(204).send("user not authenticated to add lesson to that client")
    }
    catch{
        res1.status(500).send("error on adding lesson")
    }
    
})

app.post('/getlesson', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id
        
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
        verified = await verifyUser(req, res1)
        checkUser= verified.id

        const lesson = await supabase.from('lessons').select('lessontime, title, price, paid, complete, publicnotes, client_links!inner()').eq('lessonid', req.body.lessonid).eq('client_links.parent_id', checkUser).eq('clientlink', req.body.clientlink)
        if(lesson.error){
            res1.status(204).send("user cannot access this lesson")
        }
        else{
            res1.status(200).send(lesson.data[0])
        }
    }
    catch{
        res1.status(500).send("error on lesson fetch")
    }
})

app.post('/deletelesson', async(req,res1)=>{
    try{
        verified = await verifyUser(req, res1)
        checkUser= verified.id

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
        verified = await verifyUser(req, res1)
        checkUser= verified.id

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


app.listen(443)

