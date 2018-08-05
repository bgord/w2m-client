const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const assert = require("assert");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = "mongodb://localhost:27000";
const db_name = "w2m";

const server_port = 8686;

(async () => {
	try {
		const client = await MongoClient.connect(
			uri,
			{ useNewUrlParser: true }
		);

		const db = client.db(db_name);

		app.use(cors());
		app.get("/words", async (req, res) => {
			const activeWords = await db
				.collection("words")
				.find({
					archived: false,
				})
				.sort({ word: -1 })
				.limit(20)
				.toArray();
			return res.status(200).send(activeWords);
		});

		app.patch("/words/:id", async (req, res) => {
			const { id } = req.params;
			const newBody = req.body;
			try {
				const resource = await db
					.collection("words")
					.update({ _id: ObjectId(id) }, { $set: { ...newBody } });
				return res.status(200).send(newBody);
			} catch (e) {
				console.error(e);
				return res.status(400).send({ error: e.message });
			}
		});

		app.delete("/words/:id", async (req, res) => {
			const { id } = req.params;
			try {
				const resource = await db
					.collection("words")
					.remove({ _id: ObjectId(id) });
				return res.status(200).send("deleted");
			} catch (e) {
				console.error(e);
				return res.status(400).send({ error: e.message });
			}
		});

		app.listen(server_port, () =>
			console.log(`Listening on port ${server_port}`)
		);
	} catch (e) {
		console.error(e);
	}
})();
