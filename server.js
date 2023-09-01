const express = require('express');
require('dotenv').config()
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path')
const fs = require('fs')
const db = require('./db-config')
const usersQuery = require('./userTableQuery')


const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(express.static(path.join(__dirname,'public')))


  app.post('/db', usersQuery.createUser);
  app.get('/getallusers',usersQuery.getAllUsers)

  app.put('/change-password/:id',(req,res)=>{
    console.log(req.params.id)
    res.status(200).json(req.params.id)
  })

  

app.post('/login',(req,res)=>{

    const userName = process.env.USER;
    const password = process.env.PASSWORD;
    if(userName===req.body.data.user && password=== req.body.data.password){
        res.send('1')
    }
    else{res.send('0')}
})

app.post('/account-request/:id',(req,res)=>{
  console.log(req.body)
  res.status(200).json(req.body)
})

// NEW USER

// app.post('/signup',(req,res)=>{
//     let parsedData = []
//     fs.readFile('data/users.json', "utf8", (error, jsonFile) => {
//         if (error) {
//          console.log(error)
//          return;
//         }
//         else{
//             parsedData = JSON.parse(jsonFile)
//            let check =  parsedData.every((value)=>{
//             return value.userName != req.body.userName
//            })
//            console.log(check)
//            if(!check){
//             console.log('bu adda istifadeci var')
//             res.send(JSON.stringify(0))
//            } 
            
//             else{
//                 parsedData.push(req.body)  
//                 fs.writeFile('data/users.json', JSON.stringify( parsedData), (error) => {
//                     if (error) {
//                         console.log("error: ", error);
//                         return;
//                     }
//                     console.log("Hazirdir");
//                     res.send(JSON.stringify(1))
//                 });
//             }
            
//         }
//       })

   
// })


// LOGIN


// app.post('/login',(req,res)=>{
//     let parsedData = []
//     fs.readFile('data/users.json', "utf8", (error, jsonFile) => {
//         if (error) {
//          console.log(error)
//          return;
//         }
//         else{
//             parsedData = JSON.parse(jsonFile)
//            let userList =  parsedData.map((value)=>{
//             return value.userName
//            })
//            console.log(userList)
//            console.log(req.body)
//            let userIndex = userList.indexOf(req.body.userName)
//            console.log(userIndex)
//            if(userIndex <0){
//             console.log('movcud deyil')
//             res.send(JSON.stringify(0))
//            } 

//            else  if(parsedData[userIndex].password!== req.body.password){
//             console.log('parol yanlisdi')
//             res.send(JSON.stringify(1))
//            }
            
//             else{
            
//                 console.log('dogrudu')
//                 res.send(JSON.stringify(2))
//         }
//       }
    
// })
// })


// Delete User


// app.post('/delete-user',(req,res)=>{
//     let parsedData = []
//     fs.readFile('data/users.json', "utf8", (error, jsonFile) => {
//         if (error) {
//             res.send(JSON.stringify(0))
//             console.log(error)
//          return;
//         }
//         else{
//             parsedData = JSON.parse(jsonFile)
//            let userList =  parsedData.map((value)=>{
           
//             return value.userName
//            })
//            console.log(userList)
//            let userIndex = userList.indexOf(req.body.userName)
//            if(userIndex <0){
//             res.send(JSON.stringify(0))
//            } 

         
            
//             else{
//                 parsedData.splice(userIndex,1)
//                 fs.writeFile('data/users.json', JSON.stringify( parsedData), (error) => {
//                     if (error) {
//                         console.log("error: ", error);
//                         return;
//                     }
                   
//                 });
//                 res.send(JSON.stringify(1))
//         }
//       }
    
// })

// })





app.listen(9000)