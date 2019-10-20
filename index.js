const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

// parse application/json
app.use(bodyParser.json());
app.use(cors());

//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ready_teacher'
});

//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

//show all users
//app.get('/api/users',(req, res) => {
//  let sql = "SELECT * FROM cxp_persons";
//  let query = conn.query(sql, (err, results) => {
//    if(err) throw err;
//    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//  });
//});

//show single user
//app.get('/api/users/:id',(req, res) => {
//  let sql = "SELECT * FROM cxp_persons WHERE PersonID="+req.params.id;
//  let query = conn.query(sql, (err, results) => {
//    if(err) throw err;
//    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//  });
//});

//add new user
// app.post('/api/users',(req, res) => {
//   let data = {product_name: req.body.product_name, product_price: req.body.product_price};
//   let sql = "INSERT INTO product SET ?";
//   let query = conn.query(sql, data,(err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });

//update user
// app.put('/api/users/:id',(req, res) => {
//   let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });

//Delete user
//app.delete('/api/users/:id',(req, res) => {
//  let sql = "DELETE FROM cxp_persons WHERE PersonID="+req.params.id+"";
//  let query = conn.query(sql, (err, results) => {
//    if(err) throw err;
//      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//  });
//});

app.get('/', (req, res) => {
  res.send("Welcome to api");
});

//show all teacher details
//app.get('/api/getTeacherDetails', (req, res) => {
//  let sql = "SELECT * FROM teacher_details";
//  conn.query(sql, (err, result) => {
//    if (err)
//      return res.send(err);
//    else {
//      return res.json({
//        data: result
//      })
//    }
//  });
//});

app.get('/api/getTeacherDetails', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM teacher_details";
      conn.query(sql, (err, result) => {
        if (err)
          return res.send(err);
        else {
          return res.json({
            data: result
          })
        }
      });
    }
  });
});



//show single teacher details by user ID
app.get('/api/getTeacherDetailsByUserID/:userId', (req, res) => {
  let sql = "SELECT * FROM teacher_details WHERE user_id=" + req.params.userId;
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    else {
      return res.json({
        data: result
      })
    }
  });
});

//add new Teacher Details
app.post('/api/postTeacherDetails', (req, res) => {
  let teacherDetails = {
    user_id: req.body.user_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
    email: req.body.email,
    mobile: req.body.mobile,
    city: req.body.city
  };

  let sqlTeacherDetails = "INSERT INTO teacher_details SET ?";
  let query = conn.query(sqlTeacherDetails, teacherDetails, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
    //console.log(result.insertId);
  });
});


//add new Teacher Qualification
app.post('/api/postTeacherQualification', (req, res) => {
  let teacherQualification = {
    teacher_details_id: req.body.teacher_details_id,
    experience_year: req.body.experience_year,
    experience_month: req.body.experience_month
  };

  let sqlTeacherQualification = "INSERT INTO teacher_qualification SET ?";
  let query = conn.query(sqlTeacherQualification, teacherQualification, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
    //console.log(result.insertId);
    //Start
    let qualifications = req.body.qualifications;

    for (let qualification of qualifications) {
      let teacherQualiSpecialization = {
        teacher_qualification_id: result.insertId,
        qulification_id: qualification.qulification_id,
        specialization_id: qualification.specialization_id,
        major: qualification.major,
        minor: qualification.minor,
        course_completion_date: qualification.course_completion_date
      }

      let sqlTeacherQualiSpecialization = "INSERT INTO teacher_qualification_specialization SET ?";
      let query2 = conn.query(sqlTeacherQualiSpecialization, teacherQualiSpecialization, (err, result) => {
        if (err) throw err;
        //res.send(JSON.stringify({"status": 200, "error": null, "response": result}));

        //let teacherAvailabilityDays = req.body.availibility.availibility_days;
        let teacherQualiUnits = qualification.units.map(
          unit => [
            result.insertId,
            unit.unit
          ]);

        let sqlTeacherQualiUnits = "INSERT INTO teacher_qualification_unit (teacher_qualification_specialization_id, unit) VALUES ?";
        let query3 = conn.query(sqlTeacherQualiUnits, [teacherQualiUnits], (err, result) => {
          if (err) throw err;
          //res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
        });
      });
    }
    //End
  });
});


//get all Qualifications
app.get('/api/getQualifications', (req, res) => {
  let sql = "SELECT * FROM qualification";
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    else {
      return res.json({
        data: result
      })
    }
  });
});

//add new Qualification
app.post('/api/postQualification',(req, res) => {
  let data = {
    name: req.body.name, 
  };

  let sql = "INSERT INTO qualification SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//get Qualification By QualificationID
app.get('/api/getQualificationByID/:qualificationId', (req, res) => {
  let sql = "SELECT * FROM qualification WHERE id=" + req.params.qualificationId;
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    else {
      return res.json({
        data: result
      })
    }
  });
});

//get Specializations By QualificationID
app.get('/api/getSpecializationsByQualificationID/:qualificationId', (req, res) => {
  let sql = "SELECT * FROM specialization WHERE qualification_id=" + req.params.qualificationId;
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    else {
      return res.json({
        data: result
      })
    }
  });
});

//add new Specialization
app.post('/api/postSpecialization',(req, res) => {
  let data = {
    qualification_id: req.body.qualification_id,
    name: req.body.name, 
  };

  let sql = "INSERT INTO  specialization SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//get Units By TeacherQualificationId
app.get('/api/getUnitsBySpecializationID/:teacherQualificationId', (req, res) => {
  let sqlTeacherQualificationSpecialization = "SELECT id FROM teacher_qualification_specialization WHERE 	teacher_qualification_id=" + req.params.teacherQualificationId;
  let query = conn.query(sqlTeacherQualificationSpecialization, (err, result) => {
    if (err) throw err;
    else {
      let teacherQualificationSpecializationIds = result.map( function(el) { return el.id; });

      let sqlTeacherQualificationUnit = "SELECT * FROM teacher_qualification_unit WHERE teacher_qualification_specialization_id IN (?)";
      let query2 = conn.query(sqlTeacherQualificationUnit, [teacherQualificationSpecializationIds], (err, result) => {
        if (err) throw err; 
        else {
          return res.json({
            data: result
          })
        }
      });
    }
  });
});






app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 1, 
    username: 'Asif',
    email: 'asif@gmail.com'
  }

  jwt.sign({user}, 'secretkey', { expiresIn: '1h' }, (err, token) => {
    res.json({
      token
    });
  });
});


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}




//Server listening
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port: ${port}...`);
});