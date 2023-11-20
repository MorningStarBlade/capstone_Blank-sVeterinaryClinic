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

// Middleware to add user to res.locals for all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

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
