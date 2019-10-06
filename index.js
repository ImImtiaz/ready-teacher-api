const express = require('express');
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

app.get('/api/getTeacherDetails', (req, res) => {
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
});

//show single user
app.get('/api/getTeacherDetails/:id', (req, res) => {
  let sql = "SELECT * FROM teacher_details WHERE user_id=" + req.params.id;
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
    office_contact: req.body.office_contact,
    mobile: req.body.mobile,
    street: req.body.street,
    suburb: req.body.suburb,
    state: req.body.state,
    post_code: req.body.post_code,
    work_eligibility: req.body.work_eligibility,
    other_visa_holder_comment: req.body.other_visa_holder_comment,
    experience_year: req.body.experience_year,
    experience_month: req.body.experience_month
  };

  let sqlTeacherDetails = "INSERT INTO teacher_details SET ?";
  let query = conn.query(sqlTeacherDetails, teacherDetails, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
    //console.log(result.insertId);
    let teacherAvailability = {
      teacher_details_id: result.insertId,
      work_immediately: req.body.availibility.work_immediately,
      start_work: req.body.availibility.start_work
    }

    let sqlTeacherAvailability = "INSERT INTO teacher_availability SET ?";
    let query2 = conn.query(sqlTeacherAvailability, teacherAvailability, (err, result) => {
      if (err) throw err;
      //res.send(JSON.stringify({"status": 200, "error": null, "response": result}));

      let teacherAvailabilityDays = req.body.availibility.availibility_days;
      let formatedTeacherAvailabilityDays = teacherAvailabilityDays.map(
        teacherAvailabilityDay => [
          result.insertId,
          teacherAvailabilityDay.day,
          teacherAvailabilityDay.start_time,
          teacherAvailabilityDay.end_time
        ]);

      let sqlTeacherAvailabilityDay = "INSERT INTO teacher_availability_day (teacher_availability_id, day, start_time, end_time) VALUES ?";
      let query3 = conn.query(sqlTeacherAvailabilityDay, [formatedTeacherAvailabilityDays], (err, result) => {
        if (err) throw err;
        //res.send(JSON.stringify({ "status": 200, "error": null, "response": result }));
      });
    });

  });
});


//add new Teacher Qualification
app.post('/api/postTeacherQualification', (req, res) => {
  let teacherQualification = {
    teacher_details_id: req.body.teacher_details_id,
    highest_qualification_id: req.body.highest_qualification_id,
    specialization_id: req.body.specialization_id
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
        course_completion_date: qualification.course_completion_date,
        institute_name: qualification.institute_name,
        institute_address: qualification.institute_address
      }

      let sqlTeacherQualiSpecialization = "INSERT INTO teacher_qualification_specialization SET ?";
      let query2 = conn.query(sqlTeacherQualiSpecialization, teacherQualiSpecialization, (err, result) => {
        if (err) throw err;
        //res.send(JSON.stringify({"status": 200, "error": null, "response": result}));

        //let teacherAvailabilityDays = req.body.availibility.availibility_days;
        let teacherQualiSubjects = qualification.subjects.map(
          subject => [
            result.insertId,
            subject.subject_id
          ]);

        let sqlTeacherQualiSubjects = "INSERT INTO teacher_qualification_subject (teacher_qualification_specialization_id, subject_id) VALUES ?";
        let query3 = conn.query(sqlTeacherQualiSubjects, [teacherQualiSubjects], (err, result) => {
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


//get Subjects By SpecializationID
app.get('/api/getSubjectsBySpecializationID/:specializationID', (req, res) => {
  let sql = "SELECT * FROM subject WHERE 	specialization_id=" + req.params.specializationID;
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    else {
      return res.json({
        data: result
      })
    }
  });
});











//Server listening
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port: ${port}...`);
});