const { Pool } = require('pg');

const pool = new Pool({
 
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
 
  
  
});



// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// })

module.exports = {
 pool
};