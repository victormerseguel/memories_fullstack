const mongoose = require("mongoose");

require("dotenv").config();

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.dheu2qs.mongodb.net/?retryWrites=true&w=majority`
  );
  console.log("Conectado com sucesso!");
}

main().catch((err) => console.log(err));

module.export = main;
