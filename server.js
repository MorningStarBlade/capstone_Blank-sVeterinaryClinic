require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5163;
const {Pool} = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render('index');
});

app.get("/index.ejs",(req, res) => {
  res.render('index');
});

app.get("/about.ejs",(req, res) => {
  res.render('about');
});

app.get("/WellnessWizard.ejs",(req, res) => {
  res.render('WellnessWizard');
});

app.get("/resources.ejs",(req, res) => {
  res.render('resources');
});

app.get("/app", (req, res) => {
  res.redirect('/WellnessWizard');
});

app.post("/app", async(req, res) => {
  res.set({
    "Content-Type": "application/json"
  });

  try {
    const client = await pool.connect();

    const name = req.body.name;
    const age = req.body.age;
    const animal = req.body.animal;
    const breed = req.body.breed;
    const reason = req.body.reason;
    const date = req.body.date;
    const notes = req.body.notes;

    const insertSql = `INSERT INTO appointments (name, age, animal, breed, reason, date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    const insert = await client.query(insertSql, [name, age, animal, breed, reason, date, notes]);

    const response = true;

    res.json(response);

    client.release();

    //res.render('WellnessWizard');

  } catch (err){
    console.error(err);
    res.json({
      error: err
    });
  }
});


app.listen(PORT, () => console.log(`Listening on ${PORT}`));