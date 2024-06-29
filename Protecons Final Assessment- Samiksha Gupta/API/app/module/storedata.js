const pool= require("../confi/db");
class newData{
    constructor(){}
    store=async(subjectId)=>{
        const client = await pool.connect();     
        try {
            let query = `
                SELECT 
                    qoa.id,
                    qoa.question,
                    qoa.option1,
                    qoa.option2,
                    qoa.option3,
                    qoa.option4,
                    qoa.correct_answer,
                    s.subject_name,
                    s.id
                FROM
                    questions qoa 
                JOIN
                    subjects s 
                ON 
                    qoa.subject_id = s.id 
                WHERE 
                    s.id = $1`;
            
            const res = await client.query(query, [subjectId]);
            
            return res.rows
        } 
        catch (e) {
            return e;
        } 
        finally {
            client.release();
        }
    };
}
module.exports= new newData();
