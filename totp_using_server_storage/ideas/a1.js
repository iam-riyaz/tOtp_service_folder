

const {createPool} = require('mysql');

const pool= createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database:"riyadb"
})




pool.query(`SELECT * FROM first_table`, (err,result, field)=>{
    if(err){
       return console.log(err)
    }
    return console.log(result);
})