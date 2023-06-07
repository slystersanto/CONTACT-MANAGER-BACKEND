const dotenv=require('dotenv').config();
const express=require('express');
const app=express();
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const {ObjectId } = require('mongodb');
const DB =process.env.DB;
const cors = require("cors");

app.use(express.json()); // middleware for all post requests to convert json data from body into JS Object
app.use(cors());

app.get("/users",async (req,res)=>{
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

app.get("/user-edit/:id", async (req, res) => {
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

app.get("/user-view/:id", async (req, res) => {
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

  
  app.post("/user-create", async (req, res) => {
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


  app.put("/user-edit/:id", async (req, res) => {
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
  

  
  app.delete("/user-delete/:id", async (req, res) => {
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