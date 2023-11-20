require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5163;
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cookieParser());
app.use(sessions({
  secret: "capstone",
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  resave: false
}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

<<<<<<< HEAD
// Middleware to add user to res.locals for all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

=======
// For general navigation
>>>>>>> 2bf865fb21720464bce134867838f8698c85e011
app.get("/", (req, res) => {
  res.render('index');
});

app.get("/index.ejs", (req, res) => {
  res.render('index');
});

app.get("/about.ejs", (req, res) => {
  res.render('about');
});

app.get("/WellnessWizard.ejs", (req, res) => {
  res.render('WellnessWizard');
});

app.get("/resources.ejs", (req, res) => {
  res.render('resources');
});

app.get("/login.ejs", (req, res) => {
  res.render('login');
});

app.get("/createAccount.ejs", (req, res) => {
  res.render('createAccount');
});

<<<<<<< HEAD
=======
// For Wellness Wizard
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

  } catch (err){
    console.error(err);
    res.json({
      error: err
    });
  }
});

// For create account
app.post("/createAccount", async (req, res) => {
  try {
    const client = await pool.connect();

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertSql = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
    `;

    await client.query(insertSql, [firstName, lastName, email, hashedPassword]);

    // Redirect to the login page with a success message
    const successMessage = `You've successfully created an account now you can log in!`;

    res.render('login', { message: successMessage });

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
});


// For Login
>>>>>>> 2bf865fb21720464bce134867838f8698c85e011
app.post("/login", async (req, res) => {
  try {
    const client = await pool.connect();

    const email = req.body.email;
    const enteredPassword = req.body.password;

    const querySql = `
      SELECT * FROM users WHERE email = $1
    `;

    const result = await client.query(querySql, [email]);

    if (result.rows.length > 0) {
      const storedPassword = result.rows[0].password;

      const passwordMatch = await bcrypt.compare(enteredPassword, storedPassword);

      if (passwordMatch) {
        // Store user information in the session
        req.session.user = {
          id: result.rows[0].user_id,
          firstName: result.rows[0].first_name,
          // Add other user-related information as needed
        };

        const welcomeMessage = `Welcome, ${result.rows[0].first_name}!`;

        res.render('index', { message: welcomeMessage });
      } else {
        res.render('login', { errorMessage: "Invalid email or password" });
      }
    } else {
      res.render('login', { errorMessage: "Invalid email or password" });
    }

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
});

<<<<<<< HEAD
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      res.redirect('/login.ejs');
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      res.redirect('/login.ejs');
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
=======
// For Bio Pages
app.get("/views/blank.ejs",(req, res) => {
  res.render('blank');
});

app.get("/views/dav.ejs",(req, res) => {
  res.render('dav');
});

app.get("/views/grace.ejs",(req, res) => {
  res.render('grace');
});

app.get("/views/izzy.ejs",(req, res) => {
  res.render('izzy');
});

app.get("/views/margret.ejs",(req, res) => {
  res.render('margret');
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
>>>>>>> 2bf865fb21720464bce134867838f8698c85e011
