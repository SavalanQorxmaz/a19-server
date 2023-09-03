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


        console.log(ranks[index])

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

const createUser = async (req, res) => {
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
    const userId = parseInt(request.params.id);
    const { userName, password } = request.body.data
    db.pool.query('UPDATE a19_users SET user_name = $1, user_password = $2 WHERE userId = $3', [userName, password, userId], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })

}



module.exports = {
    createUser,
    getAllUsers,
    updateUser
};