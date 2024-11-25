const express = require("express");
const app = express();

const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

app.set("view engine","ejs");
const path = require("path");
app.set("views", path.join(__dirname , "/views"));

const methodOverride = require('method-override');
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended:true }))




const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:'akshat257428.'
});

let getRandomUser = ()=> {
    return [
      faker.string.uuid(),
      faker.internet.username(), // before version 9.1.0, use userName()
      faker.internet.email(),
      
      
    ]
  }

// let data =[];

//   for(i=0; i<10; i++){
    
//     data.push(getRandomUser());
    
//   }

//   let q = "INSERT INTO STU (id , username , email) VALUES ? ";

//   // let users = [
//   //    ["kamu.up", "Kamlesh" , "1"], [ "poni.io", "Ponita", "2" ] , 
//   //    ["aki.lol", "Akhilesh" , "3"]
//   //   ];


//   try{
//     connection.query(q,[data],(err,results)=>{
//       // console.log(results);
//       console.log(results);
      
//     })
  
    
    
//   }catch(err){
//     console.log(err);
    
//   }

//   connection.end();

  
  let port = 3000;
  app.listen(port,()=>{
    console.log("server is listening");
    
  })


  // Home Page
  app.get("/", (req,res)=>{
    let q = "SELECT COUNT(*) FROM STU";
    try {
      connection.query(q,(err,result)=>{
        if(err) throw(err);
        
        let value = result[0]['COUNT(*)']
        
        res.render("home.ejs", { value })
      });
      
    } catch (err) {
      console.log(err);
      
      res.send("some error occured")
      
    }
  });

// To show Total Users

  app.get("/users",(req,res)=>{
    let q = `select * from stu`;

    try{
      
      connection.query(q,(err, result)=>{
        if(err) throw(err);
        let users = result;
        res.render("showusers.ejs" , { users } )
      });


    }catch(err){
    
      res.send("some error ocuured")
  
    }

  });

  // To Edit Route

  app.get("/users/:id/edit", (req,res)=>{

    let { id } = req.params;

    let q = `SELECT * FROM STU WHERE ID = '${id}'`
    try{
      connection.query(q,(err,result)=>{
        if(err) throw(err)
        console.log(result);
        
        let user = result[0];  

        res.render("edit.ejs" , { user });
    })
    }catch(err){
       console.log("Something Happened");
       
    }
    
  })

  // Update (DB) Route

  app.patch("/users/:id",(req,res)=>{
    
    let { id } = req.params;

    let {  username :newUsername  } = req.body;
    let q = `SELECT * FROM STU WHERE ID = '${id}'` ;
    try{
    connection.query(q,(err,result)=>{
      if(err) throw(err)
      let user = result[0];

      let q2 = `UPDATE STU SET USERNAME = '${newUsername}' WHERE ID = '${id}' `;
      connection.query(q2, (err,result)=>{
        if(err)throw(err);
        res.redirect("/users")
      })
    })
    }catch(err){
      res.send("Opps! Something Happened");
      
    }
  })