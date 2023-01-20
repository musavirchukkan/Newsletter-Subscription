require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))






app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{

    const name = req.body.name
    const email = req.body.email
    const data = {
        members:[
            {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:name
            }
            }
        ]
    }
    const jsonData = JSON.stringify(data)
    const url = "https://us12.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID

    const options = {
        method:"POST",
        auth:"musavir:"+process.env.API_KEY
    }

    const request = https.request(url,options,(response)=>{
    
        response.on("data",(data)=>{
            console.log(JSON.parse(data))
        })
        const staus = response.statusCode
        if(staus === 200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }

    })
    request.write(jsonData)
    request.end()
});

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))









