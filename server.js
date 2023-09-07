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
  app.post('/getallusers',usersQuery.getAllUsers)
  app.get('/getuserbyid',usersQuery.getUserByID)

  // app.put('/change-password/:id',(req,res)=>{
  //   console.log(req.params.id)
  //   res.status(200).json(req.params.id)
  // })

  

app.post('/login',async (request,response)=>{
    const localUserName = process.env.USER;
    const localUserPassword = process.env.PASSWORD;
    if(localUserName===request.body.user ){
      localUserPassword === request.body.password ? 
      response.status(200).json({id: 0, rank: 'senior'})
      :
      response.status(200).json('0')
    }
    else{
     db.pool.query('SELECT * FROM users  WHERE user_name LIKE $1', [request.body.user], (error, results) => {
     if (error) {
       throw error;
     }

    if(results.rows.length===0){
      response.status(200).json('-1');
    }
    else {
      const person = results.rows[0]
      if(person.user_password === request.body.password){
        response.status(200).json({id:person.user_id,rank: person.user_rank});
       }
       
       else {
        response.status(200).json('0');
       }
    }


   })
    }
})

app.post('/account-request/:id', async (request,response)=>{
  
  if(Number(request.params.id)!==request.body.ownerId){
    response.status(200).json('paramsId!==ownerId')
  }
    const owner = await usersQuery.getUserByID(request.body.ownerId)
    console.log(request.body)
    console.log(owner)

    let responseData = ''

    switch(request.body.userStatus){
        case 'current': 

          if(owner.user_id === request.body.ownerId &&
            owner.user_password === request.body.currentPassword &&
            owner.user_name === request.body.ownerName &&
            request.body.userNewPassword === request.body.userCNewPassword){
              const modifieduser = await usersQuery.changeUserPassword(request.body.ownerId,request.body.userNewPassword)
              responseData = modifieduser
            }
          else{
            responseData = 'current-error'

          }
        break;
        case 'other': {
          const other = await usersQuery.getUserByID(request.body.userId)
          switch(request.body.ownerRank){
            case 'senior':
             if( other.user_rank === request.body.userOldRank &&
              other.user_id === request.body.userId &&
              other.user_name === request.body.userName  &&
              request.body.userNewPassword === request.body.userCNewPassword){
                const modifieduser = await usersQuery.changeUserPassword(request.body.userId,request.body.userNewPassword)
                responseData = modifieduser
              }
              else{
                responseData = 'other-senior-error'

              }
break;
            
            case 'middle' :
              if((other.user_rank === 'middle' ||
              other.user_rank === 'junior') &&
              other.user_rank === request.body.userOldRank &&
              other.user_id === request.body.userId &&
              other.user_name === request.body.userName &&
              request.body.userNewPassword === request.body.userCNewPassword ){
                const modifieduser = await usersQuery.changeUserPassword(request.body.userId,request.body.userNewPassword)
                responseData = modifieduser
              }
              else{

                responseData = 'other-middle-error'
              }

break;
            
            case 'junior' : 
             if( other.user_rank === 'junior' &&
             other.user_rank === request.body.userOldRank &&
             other.user_id === request.body.userId &&
             other.user_name === request.body.userName &&
             request.body.userNewPassword === request.body.userCNewPassword){
              const modifieduser = await usersQuery.changeUserPassword(request.body.userId,request.body.userNewPassword)
              responseData = modifieduser
             }
             else{

              responseData = 'other-junior-error'
             }
            
          }
          break;
        }
        break;
        case 'new': {
          if(owner.user_id === request.body.ownerId &&
            owner.user_name === request.body.ownerName){
              const modifieduser = await usersQuery.createUser(request.body.userName,request.body.userNewPassword,request.body.userNewRank)
              responseData = modifieduser
            } else{
              
            responseData = 'new-error'
            }

        }
        break;

    }
  
  response.status(200).json(responseData)
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