require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb://localhost:27017/blogs-redux-db`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("blogs-redux-db");
    const blogsCollection = db.collection("blogs");

    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/blog", async (req, res) => {
      const product = req.body;
      const result = await blogsCollection.insertOne(product);
      res.send(result);
    });

    app.put("/blog/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { _id, ...product } = req.body;

        const getProduct = await blogsCollection.findOne({
          id: ObjectId(id),
        });
        const query = { _id: ObjectId(id) };
        const updatedData = { $set: product };

        /* update product */
        const result = await blogsCollection.updateOne(query, updatedData);

        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogsCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send({ status: true, message: "Welcome to the blog app api in Redux" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
