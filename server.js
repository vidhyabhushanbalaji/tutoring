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
                    //res1.send(res.rows[0].id)
                    client.query("SELECT COUNT (id) from users WHERE id ='"+res.rows[0].id+"';",
                        (err, res2)=>{
                            if (!err){
                                console.log(res2)
                                if(res2.rows[0].count==0){
                                    res1.send("Account setup needed")
                                }
                                else{
                                    res1.send("Allow through")
                                }
                            }
                            else{
                                res1.status(400).send("error")
                            }
                        }
                    )
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

app.post('/users', async (req,res1) =>{
        const hashed = await bcrypt.hashSync(req.body.password, 10)
        // salt for hash is within hashed, don't need to store separately
        await client.query(
            "INSERT INTO auth (email, hashpassword) VALUES ('"+req.body.email+"', '"+hashed+"');",
        (err,res2)=>{
            if(!err){
                    client.query("SELECT * from auth WHERE email ='"+req.body.email+"';",
                        (err, res3)=>{
                            if (!err){
                                res1.send(res3.rows[0].id)
                            }
                            else{
                                res1.status(500).send(err.message)
                            }
                        }
                    )
            }
            else{
                res1.status(500).send(err.message)
            }
        }
    )
    }
)

app.post('/users/usersetup', async (req,res1) =>{
    await client.query(
        "INSERT INTO users (id, first_name, last_name, status) VALUES ('"+req.body.id+"', '"+req.body.first_name+"', '"+req.body.last_name+"', '"+req.body.status+"');", (err, res2)=>{
            if (!err){
                res1.status(200).send("Added all successfully")
            }
            else{
                res1.status(500)
            }
        })
    }
)


app.listen(3000)