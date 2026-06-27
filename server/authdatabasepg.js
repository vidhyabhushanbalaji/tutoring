const {Client} = require("pg")
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password : "",
    database: "tutoring"
})
client.connect();

function allowLogin(email, hashpassword){
    client.query("SELECT hashpassword from auth WHERE email ='"+email+"');",
        (err,res)=>{
            if (res){
                return (res.hashpassword == hashpassword)
            }
            else{
                return False
            }
        }
    )
}

function addUser (email, password){
    client.query("INSERT INTO auth (email, hashpassword) VALUES('"+email+"',"+password+"');",
        (err,res)=>{
        return (!err)
        }
    )
}

console.log(addUser("Chris", "hello123"))

client.query(`SELECT * from auth`,
    (err, res)=>{
    if(!err){
        console.log(res.rows);}
    else{
        console.log(err.message)
    }}
)