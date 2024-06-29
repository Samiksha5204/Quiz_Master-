const express = require("express");
const app = express();
const port = 5001;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const pool = require("../API/app/confi/db");

// require("../API/app/routes/customer.route")(app);

//send mail and check if mail exist or not - SignUp Page
app.post("/sendmail", async (request, response) => {
  const client = await pool.connect();
  const name = request.bodyname;
  const mail_id = request.body.mail_id;
  const otp = request.body.otp;

  try {
    // Check if email already exists in the database - SignUp Page
    const checkEmailQuery = `SELECT * FROM signupdetails WHERE mail_id = $1`;
    const checkEmailResult = await client.query(checkEmailQuery, [mail_id]);

    if (checkEmailResult.rows.length > 0) {
      // If email exists, show an alert
      return response.status(200).json({
        errorCode: -1,
        message: "Email already exists. Please use a different email.",
        data: {},
      });
    } else {
      // Insert OTP into the signupdetails table
      const insertOTPQuery = `INSERT INTO signupdetails (mail_id, otp) VALUES ($1, $2)`;
      await client.query(insertOTPQuery, [mail_id, otp]);

      // Send email
      // const params = {
      //   name: name,
      //   otp: otp,
      // };
      // const serviceID = "service_805rieg";
      // const templateID = "template_4aaxllt";
      // emailjs
      //   .send(serviceID, templateID, params)
      //   .then((res) => {
      //     console.log(res);
      //     alert("Your message sent successfully");
      //   })
      //   .catch((err) => console.log(err));

      return response.status(200).json({
        errorCode: 0,
        message: "OTP sent successfully",
        data: { mail_id, otp },
      });
    }
  } 
  catch (error) {
    return response.status(200).json({
      errorCode: -999,
      message: error.message,
      data: {},
    });
  } finally {
    client.release();
  }
});

//for the validation of the OTP - SignUp Page
app.post("/validateOTP", async (request, response) => {
  const { mail_id, enteredOTP } = request.body;

  try {
    const client = await pool.connect();
    const otpQuery = `SELECT otp FROM signupdetails WHERE mail_id = $1`;
    const otpResult = await client.query(otpQuery, [mail_id]);
    
    if (!enteredOTP) {
      return response
        .status(400)
        .json({
          success: false,
          message: "Please fill the OTP field",
        });
    } 
    else if (otpResult.rows.length > 0) {
      const storedOTP = otpResult.rows[0].otp;
      if (enteredOTP === storedOTP) {
        response
          .status(200)
          .json({
            success: true,
            message:
              "OTP validate successfully",
          });
      } else {
        response.status(400).json({ success: false, message: "Incorrect OTP" });
      }
    } else {
      response.status(404).json({ success: false, message: "Email not found" });
    }

    client.release();
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
});

//Registering the new User details in the database- SignUp Page
app.post("/logindetails", async (request, response) => {
  const client = await pool.connect();
  const mail_id = request.body.mail_id;
  const enteredusertype = request.body.usertype;
  const password = request.body.password;
  const otp = request.body.otp;
  try {
    if (!mail_id || !password || !otp || !enteredusertype) {
      return response
        .status(400)
        .json({
          success: false,
          message: "Please fill the above required details",
        });
    } 
    else {
      // Check if the email already exists in the database
      const checkEmailQuery = `SELECT mail_id, usertype FROM signupdetails WHERE mail_id = $1`;
      const checkEmailResult = await client.query(checkEmailQuery, [mail_id]);

      if (checkEmailResult.rows[0].usertype===null) {
        const updateQuery = `UPDATE signupdetails SET usertype = $1 ,password = $2 WHERE mail_id = $3`;
       
        await client.query(updateQuery, [enteredusertype,password, mail_id]);
        return response.status(200).json({
          errorCode: 0,
          message:  "Registered Successfully",
          data: {},
        });
      } 
      else {
       
            return response.status(200).json({
            errorCode: -1,
            message: "Email already registered",
            data: {},
          });
        
      }
    }
  } catch (error) {
    return response.status(200).json({
      errorCode: -999,
      message: error.message,
      data: {},
    });
  } finally {
    client.release();
  }
});

//login validation- Login page
app.post("/loginvalidation", (req, res) => {
  const { mail_id, password } = req.body;
  console.log(req.body);
  if (!mail_id || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  const query =
    `SELECT * FROM signupdetails WHERE mail_id = $1 AND password = $2 `;
  pool.query(query, [mail_id, password], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res
        .status(200)
        .json({ success: false, message: "Internal server error." });
    }

    console.log(results, "");
    if (results.rows.length > 0) {
      const usertype = results.rows[0].usertype; // Assuming usertype is a column in your table
      return res
        .status(200)
        .json({ success: true, message: "Login successful.", usertype, mail_id });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
  });
});

//send OTP and on the same time update in the database - Forget Password Page
app.post("/sendOTP", async (request, response) => {
  const client = await pool.connect();
  const mail_id = request.body.mail_id;
  const otp = request.body.otp;

  try {
    // Check if the email already exists in the database
    const checkEmailQuery = `SELECT * FROM signupdetails WHERE mail_id = $1`;
    const checkEmailResult = await client.query(checkEmailQuery, [mail_id]);

    if (checkEmailResult.rows.length > 0) {
      
      const updateQuery = `UPDATE signupdetails SET otp = $1 WHERE mail_id = $2`;
      await client.query(updateQuery, [otp, mail_id]);

      return response.status(200).json({
        errorCode: 0,
        message: "send OTP ",
        data: {},
      });
    } else {
      // If email doesn't exist, show an alert
      return response.status(200).json({
        errorCode: -1,
        message: "Email does not exist .",
        data: {},
      });
    }
  } catch (error) {
    return response.status(200).json({
      errorCode: -999,
      message: error.message,
      data: {},
    });
  } finally {
    client.release();
  }
});

//validate OTP - Forget Password page
app.post("/validateOTP", async (request, response) => {
  const { mail_id, enteredOTP } = request.body;

  try {
    const client = await pool.connect();
    const otpQuery = `SELECT otp FROM signupdetails WHERE mail_id = $1`;
    const otpResult = await client.query(otpQuery, [mail_id]);

    if (otpResult.rows.length > 0) {
      const storedOTP = otpResult.rows[0].otp;
      if (enteredOTP === storedOTP) {
        response
          .status(200)
          .json({ success: true, message: "OTP validation successfully" });
      } else {
        response.status(400).json({ success: false, message: "Incorrect OTP" });
      }
    } else {
      response.status(404).json({ success: false, message: "Email not found" });
    }

    client.release();
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
});


//set new password - Forget Password page
app.post("/setnewpassword", async (request, response) => {
  const client = await pool.connect();
  const newpassword = request.body.newpassword;
  const mail_id = request.body.mail_id;

  try {
    const updateQuery = `UPDATE signupdetails SET password = $1 WHERE mail_id = $2`;
    await client.query(updateQuery, [newpassword, mail_id]);

    return response.status(200).json({
      errorCode: 0,
      message: "password updated successfully",
      data: {},
    });
  } catch (error) {
    return response.status(200).json({
      errorCode: -999,
      message: error.message,
      data: {},
    });
  } finally {
    client.release();
  }
});


//to display the data in the table format- Admin page(Show Quiz and Edit Question)
app.post("/show", async (request, response) => {
  const client = await pool.connect();
  const subject_name = request.body.subject_name;

  try {
    const res = await client.query(
      `
            SELECT 
               q.id,
               mt.subject_name,
               q.question,
               q.option1,
               q.option2,
               q.option3,
               q.option4,
               q.correct_answer
            FROM 
               questions q
            INNER JOIN
               subjects mt  
            ON
               q.subject_id = mt.id
            WHERE mt.subject_name = $1 
            ORDER BY q.id ASC`,
      [subject_name]
    );

    response.json({ data: res.rows, message: "Data found" });
  } catch (e) {
    console.error("Error occurred:", e);
    response.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});


//to edit the question through Admin by questiontableform - Admin page(Show Quiz and Edit Question)
app.put("/edit", async (request, response) => {
  const client = await pool.connect();
  const id = request.body.id;
  const question=request.body.question;
  const option1=request.body.option1;
  const option2=request.body.option2;
  const option3=request.body.option3;
  const option4=request.body.option4;
  const correct_answer=request.body.correctanswer;
  try {
    const updateQuery = `UPDATE questions SET 
    question=$1,
    option1=$2,
    option2=$3,
    option3=$4,
    option4=$5,
    correct_answer =$6
    WHERE id = $7`;
    await client.query(updateQuery, [question,option1,option2, option3, option4, correct_answer,id]);

    return response.status(200).json({
      errorCode: 0,
      message: "Edit Successfully",
      data: {},
    });
  } catch (error) {
    return response.status(200).json({
      errorCode: -999,
      message: error.message,
      data: {},
    });
  } finally {
    client.release();
  }
});

//to update the table by adding new Questions by  admin using form- Admin Page(Add new question into database )
app.post("/showdata", async (request, response) => {
  const client = await pool.connect();
  const { subject_id, question, options, correct_answer } = request.body;

  const [option1 ,option2 , option3 , option4] = options

  try {
    const res = await client.query(
      `
      INSERT INTO questions (subject_id, question, option1, option2, option3, option4, correct_answer)
      VALUES ($1, $2, $3, $4, $5, $6, $7) ;
      
      `,
      [subject_id, question, option1, option2, option3, option4, correct_answer]
    );

    response.json({ data: res.rows, message: "Data inserted successfully" });
  } catch (e) {
    console.error("Error occurred:", e);
    response.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});


// to display the data on UI from particular subject IDc-User Page(Quiz Game)
app.post("/getBySubjectId", async (request, response) => {
  const client = await pool.connect();
  const subjectId = request.body.subject_id;
  const id = parseInt(subjectId);
  try {
    let query = `
    SELECT                 
    qoa.id ,
    qoa.question,
    qoa.option1,
    qoa.option2,
    qoa.option3,
    qoa.option4,
    qoa.correct_answer,
    s.subject_name
FROM
    questions qoa 
JOIN
    subjects s 
ON 
    qoa.subject_id = s.id 
WHERE 
    s.id = $1`;

    const res = await client.query(query, [id]);

    response.json({ data: res.rows, message: "Data found" });
  } catch (e) {
    response.json({ error: e });
  } finally {
    client.release();
  }
});

//to store the selected answer in quiz game - User Page(to store selected answer for future reference)
app.post("/saveAnswer", async (request, response) => {
    const client = await pool.connect();
    const selectedAnswers = request.body.selectedAnswers; 
    const subject_id = request.body.questionId;
    console.log(selectedAnswers,subject_id);
    try {
      const updateQuery = `Select correct_answer from questions WHERE subject_id = $1`; 
      const updatedata = await client.query(updateQuery, [subject_id]); 
      console.log("results from db", updatedata.rows);
      let correctCount=0;
      for (let i=0;i<selectedAnswers.length;i++){
        if(selectedAnswers[i]===updatedata.rows[i].correct_answer){
          correctCount++;
        }
      }
      console.log(correctCount);
      return response.status(200).json({
        errorCode: 0,
        message: "Answer saved successfully",
        data: {},
        count:correctCount
       
      });
    } catch (error) {
      return response.status(200).json({
        errorCode: -999,
        message: error.message,
        data: {},
      });
    } finally {
      client.release();
    }
  });
  

app.listen(port, () => {
  console.log(`server i srunning on this port ${port}`);
});
