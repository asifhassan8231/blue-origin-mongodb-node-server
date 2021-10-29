const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mongouser1:BOac9Oa1JG5xBs0q@cluster0.yb4zx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
/* process.env.DB_USER & process.env.DB_PASS giving bad authentication*/

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("seaFoodDelivery");
        const productCollection = database.collection("products");

        //get all products from db
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //get product details by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Blue origin!')
})

app.listen(port, () => {
    console.log('listening to', port)
})