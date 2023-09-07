const db = require('./db-config')


// db.pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
//     if (error) {
//         throw error
//     }   

// })

const getAllUsers = async (request, response) => {
    console.log(request.body.rank)
    const ranks = ['junior', 'middle', 'senior']
    const index = ranks.findIndex(value => value === request.body.rank)

    try {
        const responseData = []
        db.pool.query(`SELECT * FROM users  ORDER BY user_id ASC `, (error, results) => {
            if (error) {
                throw error
            }
            const allData = results.rows
            allData.map((value) => {
                return delete value.user_password
            })
            for (let i = 0; i <= index; i++) {
                allData.forEach(value => {
                    if (value.user_rank === ranks[i]) {
                        responseData.push(value)
                    }
                })
            }

            response.status(200).json(responseData)
        })





    }
    catch (error) {
        response.status(200).json(error)
    }
}

const createUser1 = async (req, res) => {
    try {
        const userName = await req.body.data.userName
        const password = await req.body.data.password
        await db.pool.query(`INSERT INTO a19_users (user_name, user_password) VALUES ($1,$2) RETURNING *`, [userName, password],)
            .then(resp => {
                resp.rows.forEach(value => {
                    console.log(JSON.stringify(value))
                })

                res.status(200).json(resp.rows)

            })
    }
    catch (error) {

    }
    finally {

    }
}

const updateUser = async (request, response) => {
    // const userId = parseInt(request.params.id);
    // const { userName, password } = request.body.data
    // db.pool.query('UPDATE a19_users SET user_name = $1, user_password = $2 WHERE userId = $3', [userName, password, userId], (error, results) => {
    //     if (error) {
    //         throw error
    //     }
        
    // })

    console.log(request.body.ownerId)
    let owner = []
   db.pool.query('SELECT * FROM users  WHERE user_name LIKE $1', [request.body.ownerName], (error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
        owner.concat(results.rows)

    })
    

    
}

const getUserByID =  (userId) =>{
   return new Promise((res,rej)=>{
    db.pool.query('SELECT * FROM users  WHERE user_id =  $1', [userId], (error,results)=>{
        if(error){
            rej(error)
        }
        res(results.rows[0])
    })
   })
}

const changeUserPassword = (userId,newPassword) =>{
    return new Promise((res,rej)=>{
        db.pool.query('UPDATE users SET user_password = $1 WHERE user_id = $2',
        [newPassword,userId], (error,results)=>{
            if(error){
                rej(error)
            }
            res('deyisdirildi')
        })
    })
}

const createUser = (userName,userPassword,userRank) =>{
    return new Promise((res,rej)=>{
        db.pool.query('INSERT INTO users (user_name, user_password, user_rank) VALUES ($1, $2, $3) RETURNING *', [userName, userPassword, userRank], (error,results)=>{
            if(error){
                rej(error)
            }
            res(results.rows)
        })
    })
}



module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserByID,
    changeUserPassword
};