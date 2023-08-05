const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());





// contentmanagement
// Rf6vOWioE2CRmtv6


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gplljg9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const articlesCollection = client.db("contentmanagement").collection("articls");

        app.post('/articls', async (req, res) => {
            const items = req.body;
            console.log(items);
            const newItem = {
                ...items,
                date: new Date() // add the current date and time
            };
            const result = await articlesCollection.insertOne(newItem);
            res.send(result);
        })

        app.get('/articls', async (req, res) => {
            const query = {};
            const result = await articlesCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/articls/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await articlesCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/articls/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await articlesCollection.findOne(query)
            res.send(result);
        })

        app.put('/articls/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(id, update);

            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // plot: `A harvest of random numbers, such as: ${Math.random()}`,
                    date: new Date(),
                    description: update.description,
                    tag: update.tag,
                    image: update.image,
                    title: update.title,

                },
            };
            const result = await articlesCollection.updateOne(query, updateDoc, options);
            res.send(result);

        })

        app.get('/articles/search/:key', async (req, res) => {
            const searchText = req.params.key;
            const query = {
                "$or": [
                    { title: { $regex: searchText, $options: 'i' } },
                    // { description: { $regex: searchText, $options: 'i' } },
                ],
            };
    
            const result = await articlesCollection.find(query).toArray();
            res.send(result);
        });



    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running');
})




app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
})
