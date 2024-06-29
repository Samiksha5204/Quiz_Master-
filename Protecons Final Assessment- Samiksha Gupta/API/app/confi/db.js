const {Pool}=require ("pg");
const pool=new Pool({
    user:"postgres",
    host:"localhost",
    port:5432,
    database:"postgres",
    password:"samiksha",
})
pool
.connect()
.then(()=>console.log("conection success"))
.catch((err)=>console.log(err));

module.exports=pool;