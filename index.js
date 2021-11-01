const express=require('express');
const {MongoClient}=require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
// const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.byzxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//middleware
// app.use(cors());
app.use(express.json());



async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const database = client.db('TravelAgency');
        const tripcollection=database.collection('Trips');
        const tripBookCollection = database.collection('TripBooking');


        //Get All trips Api

        app.get('/trips',async (req, res) => {
            const cursor=tripcollection.find({});
            const trips=await cursor.toArray();
            res.send(trips);
        })

        //Post adding new trips
        app.post('/addnewtrip',async (req, res) => {
            const newtrip=req.body;
            const resut=await tripcollection.insertOne(newtrip);
            console.log('added new trip',req.body);
            console.log(resut);
            res.send(resut);
        })

        //getting user with dynamic id
    app.get('/trips/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await tripcollection.findOne(query);
        console.log('load user with id: ', id);
        res.send(user)
      })

        // Add Booking API
        app.post('/booktrip', async (req, res) => {
            const trip = req.body;
            const result = await tripBookCollection.insertOne(trip);
            res.json(result);
        })

        //alluser orders
        app.get('/allorder',async (req, res) => {
            const cursor=tripBookCollection.find({});
            const tripbooked=await cursor.toArray();
            res.send(tripbooked);
        })
         //single user order

        app.get('/booktrip/:email',async(req,res)=>{
            const email=req.params.email;
            console.log(email); 
           const query = {email:email};
            const  tripbooked=await tripBookCollection.find(query).toArray();
        res.send(tripbooked);
          })


          //deleting user trips

          app.delete('/booktrip/:id',async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await tripBookCollection.deleteOne(query);
            console.log('deleting user with id ',result);
            res.json(result);
        
        
          })
        
        
    

  
    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);










app.get('/', (req,res) => {

res.send('Server is running');


});


app.listen(port,()=>{
console.log("server is running at port " , port);
});