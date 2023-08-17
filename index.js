const dotenv=require('dotenv').config();
const express=require('express');
const app=express();
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const {ObjectId } = require('mongodb');
const DB =process.env.DB;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY=process.env.SECRET_KEY;

const cors = require("cors");

app.use(express.json()); // middleware for all post requests to convert json data from body into JS Object
app.use((req, res, next) => {
   
  res.setHeader('Access-Control-Allow-Origin', 'https://manger.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


let authorize = function (request, response, next) {
  if (request.headers.authorization) {
    let verify = jwt.verify(request.headers.authorization, SECRET_KEY);
    console.log(verify);
    if (verify) {
      request.userid = verify.id;

      next();
    } else {
      response.status(401).json({
        message: "Unauthorized",
      });
    }
  } else {
    response.status(401).json({
      message: "Unauthorized",
    });
  }
};



app.post('/register', async (req, res) => {  // register
    console.log(req.body)
    try {
      const connection = await mongoclient.connect(DB);
      const db = connection.db('UsersList');
      const user = await db.collection('myusers').findOne({ username: req.body.email });
      if (user) {
        res.json({ message: 'User already exists' });
      } else {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        const newUser = {
          email: req.body.email,
          password: hashedPassword
        };
        await db.collection('users').insertOne(newUser);
        res.json({ message: 'User created and registered successfully' });
      }
      connection.close();
    } catch (error) {
      console.log(error);
      res.json({ message: 'Error creating user' });
    }
  });




  app.post('/login', async (req, res) => {
    try {
      console.log('req.body:', req.body); // check the request body
      const connection = await mongoclient.connect(DB);
      const db = connection.db('UsersList');
      const user = await db.collection('users').findOne({ email: req.body.email }); // Updated collection name to 'users'
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('user:', user); // check if the user object is retrieved correctly
      const isPasswordMatch = await bcryptjs.compare(req.body.password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
   



app.get("/users",authorize,async (req,res)=>{
    try {
        const connection=await mongoclient.connect(DB);
        const db=connection.db("UsersList");
        const collection=db.collection("myusers");
        const users=await collection.find({}).toArray();
        // console.log(users);
        await connection.close();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something Went Wrong"});
    }

});

app.get("/user-edit/:id",authorize, async (req, res) => {
  try {
    console.log(req.params.id)
    const connection = await mongoclient.connect(DB);
    const db = connection.db("UsersList");
    const collection = db.collection("myusers");
    const user = await collection.findOne({ id:req.params.id
      
    });
    res.status(200).json(user)
    console.log(user);
    await connection.close();
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/user-view/:id",authorize, async (req, res) => {
  try {
    console.log(req.params.id)
    const connection = await mongoclient.connect(DB);
    const db = connection.db("UsersList");
    const collection = db.collection("myusers");
    const user = await collection.findOne({ id:req.params.id
      
    });
    res.status(200).json(user)
    console.log(user);
    await connection.close();
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

  
  app.post("/user-create",authorize, async (req, res) => {
    try {
      console.log(req.body);
      const connection = await mongoclient.connect(DB);
      const db = connection.db("UsersList");
      const collection = db.collection("myusers");
      const operation = await collection.insertOne(req.body);
      // console.log(operation);
      await connection.close();
      res.json({ message: "Users added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });


;


  app.put("/user-edit/:id",authorize, async (req, res) => {
    try {
      const connection = await mongoclient.connect(DB);
      const db = connection.db("UsersList");
      const collection = db.collection("myusers");
      const edit=await collection.findOneAndUpdate(
        {id: (req.params.id)},
        {
          $set:req.body,
        }
      );
      await connection.close();
     res.status(200).json(edit)
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  

  
  app.delete("/user-delete/:id",authorize, async (req, res) => {
    try {
      const connection = await mongoclient.connect(DB);
      const db = connection.db("UsersList");
      const collection = db.collection("myusers");
      const deleteResult = await collection.deleteOne({ id: req.params.id });
      console.log(deleteResult);
      await connection.close();
      res.json({ message: "User deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  







const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on port ${port}...`));