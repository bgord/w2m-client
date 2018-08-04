const { MongoClient } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const assert = require("assert");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = "mongodb://localhost:27000";
const db_name = "w2m";

const server_port = 8787;

(async () => {
  try {
    const client = await MongoClient.connect(
      uri,
      { useNewUrlParser: true }
    );

    const db = client.db(db_name);

    app.use(cors());
    app.get("/words", async (req, res) => {
      return res.status(200).send({ response: "words" });
    });

    app.listen(server_port, () =>
      console.log(`Listening on port ${server_port}`)
    );
  } catch (e) {
    console.error(e);
  }
})();
