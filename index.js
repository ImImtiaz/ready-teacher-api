const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().getTime() + file.originalname);
  }
});

const fileFilter = (req, file, cb)=> {
  if(file.mimetype == 'application/pdf'){
    cb(null, true);
  }else{
  cb(null, false);
}
}

const upload = multer({
  storage: storage, 
  limits:{
    fileSize: 1024 * 1024 * 8
  },
    fileFilter: fileFilter
});

// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

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


app.get('/', (req, res) => {
  res.send("Welcome to api");
});



app.get('/api/getTeacherDetails', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
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
app.get('/api/getTeacherDetailsByUserID/:userId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM teacher_details WHERE user_id=" + req.params.userId;
      let query = conn.query(sql, (err, result) => {
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


//add new Teacher Details
app.post('/api/postTeacherDetails', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let teacherDetails = {
        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        dob: req.body.dob || null,
        email: req.body.email,
        mobile: req.body.mobile,
        city: req.body.city
      };

      let sqlTeacherDetails = "INSERT INTO teacher_details SET ?";
      let query = conn.query(sqlTeacherDetails, teacherDetails, (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
        //console.log(result.insertId);
      });
    }
  });
});


//add new Teacher Qualification
app.post('/api/postTeacherQualification', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let teacherQualification = {
        teacher_details_id: req.body.teacher_details_id,
        teacher_qualification_cv_id	: req.body.teacher_qualification_cv_id,
        experience_year: req.body.experience_year,
        experience_month: req.body.experience_month
      };

      let sqlTeacherQualification = "INSERT INTO teacher_qualification SET ?";
      let query = conn.query(sqlTeacherQualification, teacherQualification, (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
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
                unit.code,
                unit.unit
              ]);

            let sqlTeacherQualiUnits = "INSERT INTO teacher_qualification_unit (teacher_qualification_specialization_id, code, unit) VALUES ?";
            let query3 = conn.query(sqlTeacherQualiUnits, [teacherQualiUnits], (err, result) => {
              if (err) throw err;
              //res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
            });
          });
        }
        //End
      });
    }
  });
});

//add new Teacher Qualification
app.post('/api/postTeacherCV', verifyToken, upload.single('teacherCV'), (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    console.log(req.file);
    let teacherCVDetails = {
      file_name: req.file.originalname, 
      file_path: req.file.path
    };

   let sqlTeacherQualificationCV = "INSERT INTO teacher_qualification_cv SET ?";
  let query = conn.query(sqlTeacherQualificationCV, teacherCVDetails,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
  });
});

//show single teacher details by user ID
app.get('/api/getTeacherQualificationCVByID/:cvId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM  teacher_qualification_cv WHERE id=" + req.params.cvId;
      let query = conn.query(sql, (err, result) => {
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


//get Teacher Qualifications By UserID
app.get('/api/getTeacherQualificationsByUserID/:userId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT tq.id, tq.teacher_details_id, tq.teacher_qualification_cv_id, tq.experience_year, tq.experience_month, tqCV.file_name, tqCV.file_path  FROM teacher_qualification tq INNER JOIN teacher_qualification_cv tqCV on tqCV.id = tq.teacher_qualification_cv_id WHERE teacher_details_id=" + req.params.userId;
      let query = conn.query(sql, (err, result) => {
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


//get Teacher Specializations by QualificationID
app.get('/api/getTeacherSpecializationsByQualificationID/:qualificationID', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT tqSp.id, tqSp.major, tqSp.minor, tqSp.course_completion_date, q.name as qualification_name, s.name as specialization_name FROM teacher_qualification_specialization tqSp INNER JOIN qualification q on q.id = tqSp.qulification_id INNER JOIN specialization s on s.id = tqSp.specialization_id WHERE teacher_qualification_id=" + req.params.qualificationID;
      let query = conn.query(sql, (err, result) => {
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

//get Teacher Units By SpecializationID
app.get('/api/getTeacherUnitsBySpecializationID/:specializationID', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM teacher_qualification_unit WHERE teacher_qualification_specialization_id=" + req.params.specializationID;
      let query = conn.query(sql, (err, result) => {
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

//get all Qualifications
app.get('/api/getQualifications', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM qualification";
      let query = conn.query(sql, (err, result) => {
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

//add new Qualification
app.post('/api/postQualification', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let data = {
        name: req.body.name,
      };

      let sql = "INSERT INTO qualification SET ?";
      let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      });
    }
  });
});

//get Qualification By QualificationID
app.get('/api/getQualificationByID/:qualificationId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM qualification WHERE id=" + req.params.qualificationId;
      let query = conn.query(sql, (err, result) => {
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

//get Specializations By QualificationID
app.get('/api/getSpecializationsByQualificationID/:qualificationId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT * FROM specialization WHERE qualification_id=" + req.params.qualificationId;
      let query = conn.query(sql, (err, result) => {
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

//add new Specialization
app.post('/api/postSpecialization', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let data = {
        qualification_id: req.body.qualification_id,
        name: req.body.name,
      };

      let sql = "INSERT INTO  specialization SET ?";
      let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      });
    }
  });
});

//get Units By TeacherQualificationId
app.get('/api/getUnitsBySpecializationID/:teacherQualificationId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sqlTeacherQualificationSpecialization = "SELECT id FROM teacher_qualification_specialization WHERE 	teacher_qualification_id=" + req.params.teacherQualificationId;
      let query = conn.query(sqlTeacherQualificationSpecialization, (err, result) => {
        if (err) throw err;
        else {
          let teacherQualificationSpecializationIds = result.map(function (el) { return el.id; });

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
    }
  });
});


//get Qualification By QualificationID
app.get('/api/getSuggesteqUnits/:qualificationId', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let sql = "SELECT tqUn.unit, tqUn.code FROM teacher_qualification tq INNER JOIN teacher_qualification_specialization tqSp ON tqSp.teacher_qualification_id = tq.id INNER JOIN teacher_qualification_unit tqUn ON tqUn.teacher_qualification_specialization_id = tqSp.id WHERE tq.id =" + req.params.qualificationId +" AND tqUn.unit IN (SELECT tp.name as name FROM tranning_package tp)";
      let query = conn.query(sql, (err, result) => {
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


//Registrater new user
app.post('/api/registration', (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  };

  let sqlFindUser = "SELECT * FROM user WHERE email='" + user.email + "' AND password='" + user.password + "'";
  let query = conn.query(sqlFindUser, (err, results) => {
    if (err) throw err;
    else {
      if (results.length != 1) {
        let sqlInserUser = "INSERT INTO user SET ?";
        let query = conn.query(sqlInserUser, user, (err, results) => {
          if (err) throw err;
          res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        });
      }
      else {
        res.send(JSON.stringify({ "status": 200, "error": "user already exist", "response": results }));
      }
    }
  });
});



app.post('/api/login', (req, res) => {
  //Mock user
  let user = {
    email: req.body.email,
    password: req.body.password
  };

  let sqlFindUser = "SELECT * FROM user WHERE email='" + user.email + "' AND password='" + user.password + "'";
  let query = conn.query(sqlFindUser, (err, results) => {
    if (err) throw err;
    else {
      if (results.length == 1) {
        jwt.sign({ user,results }, 'secretkey', { expiresIn: '100h' }, (err, token) => {
          res.json({
            token,
            userId: results[0].id,
            role: results[0].role
          });
        });
      }
      else {
        res.send(JSON.stringify({ "status": 200, "error": "user doesn't exist", "response": results }));
      }
    }
  });
});


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
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