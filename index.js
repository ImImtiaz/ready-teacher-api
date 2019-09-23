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
conn.connect((err) =>{
  if(err) throw err;
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

app.get('/', (req,res)=>{
    res.send("Welcome to api");
});

app.get('/api/getAllTeacherDetails', (req,res) => {
    let sql = "SELECT * FROM teacher_details";
    conn.query(sql, (err, result) => {
        if(err)
            return res.send(err);
        else{
            return res.json({
                data: result
            })
        }
    });
});

//show single user
app.get('/api/getTeacherDetails/:id',(req, res) => {
  let sql = "SELECT * FROM teacher_details WHERE user_id="+req.params.id;
  let query = conn.query(sql, (err, result) => {
    if(err) throw err;
    else{
        return res.json({
            data: result
        })
    }
  });
});

//add new teacher details
 app.post('/api/postTeacherDetails',(req, res) => {
        let data = {user_id: req.body.user_id, first_name: req.body.first_name, last_name: req.body.last_name, dob: req.body.dob, email: req.body.email, office_contact: req.body.office_contact, mobile: req.body.mobile};
    //  let data = [
    //     {
    //         "user_id": 1,
    //         "first_name": "first1",
    //         "last_name": "last2",
    //         "gender": "male",
    //         "email": "email@gmail.com",
    //         "contact": 67890,
    //         "mobile": 12345
    //     }
    // ];
   let sql = "INSERT INTO teacher_details SET ?";
   let query = conn.query(sql, data,(err, result) => {
     if(err) throw err;
     res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
   });
 });

 
//Server listening
const port = process.env.PORT || 3001;
app.listen(port,() =>{
  console.log(`Server started on port: ${port}...`);
});