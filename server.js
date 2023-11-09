// Anya Dinger
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5163;

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true}))
  .get("/", async(req, res)=> {
      res.send("Hello From Blank's Veterinary Clinic");
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
//