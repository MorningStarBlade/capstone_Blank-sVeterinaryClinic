require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5163;
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

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
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.employee = req.session.employee;
  next();
});

app.use("/jquery", express.static(path.join(__dirname, "jquery")));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



// For general navigation
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

app.get("/employeeLogin.ejs", (req, res) => {
  res.render('employeeLogin');
});

app.get("/createAccount.ejs", (req, res) => {
  res.render('createAccount');
});

app.get("/createEmployeeAccount.ejs", (req, res) => {
  res.render('createEmployeeAccount');
});

// For Wellness Wizard
app.get("/app", (req, res) => {
  res.redirect('/WellnessWizard');
});

app.get("/render-index", (req, res) => {
  res.render('index', { message: req.session.user ? req.session.user.firstName : 'Guest' });
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

    await client.query(insertSql, [name, age, animal, breed, reason, date, notes]);

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

// For Bio pages
app.get("/views/blank.ejs", (req, res) => {
  res.render('blank');
});

app.get("/views/dav.ejs", (req, res) => {
  res.render('dav');
});

app.get("/views/grace.ejs", (req, res) => {
  res.render('grace');
});

app.get("/views/izzy.ejs", (req, res) => {
  res.render('izzy');
});

app.get("/views/margret.ejs", (req, res) => {
  res.render('margret');
});

// For create account
app.post("/createAccount", async (req, res) => {
  try {
    const client = await pool.connect();

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertSql = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
    `;

    await client.query(insertSql, [firstName, lastName, email, hashedPassword]);

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
        req.session.user = {
          id: result.rows[0].user_id,
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
          email: result.rows[0].email,
        };

        const welcomeMessage = `Welcome, ${result.rows[0].first_name}!`;

        return res.redirect('/render-index');
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

app.post("/createEmployeeAccount", async (req, res) => {
  try {
    const client = await pool.connect();

    const employeeEmail = req.body.employeeEmail;
    const firstName = req.body.firstName;  
    const lastName = req.body.lastName;    
    const password = req.body.password;

    if (!employeeEmail.endsWith("@blanksvetclinic.com")) {
      const errorMessage = `Please use your company email ending in blanksvetclinic.com`;
      return res.status(400).render('createEmployeeAccount', { errorMessage: errorMessage });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertSql = `
      INSERT INTO employee (employee_email, first_Name, last_Name, password)
      VALUES ($1, $2, $3, $4)
    `;

    await client.query(insertSql, [employeeEmail, firstName, lastName, hashedPassword]);

    req.session.employee = {
      employeeEmail: employeeEmail,
      firstName: firstName,  
      lastName: lastName,   
    };

    const welcomeMessage = `Welcome, Employee ${firstName} ${lastName}!`;

    return res.redirect('/render-index');

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
});



// For employee login
app.post("/employee-login", async (req, res) => {
  try {
    const client = await pool.connect();

    const employeeEmail = req.body.employeeEmail;
    const enteredPassword = req.body.password;

    const querySql = `
      SELECT * FROM employee WHERE employee_email = $1
    `;

    const result = await client.query(querySql, [employeeEmail]);

    if (result.rows.length > 0) {
      const storedPassword = result.rows[0].password;

      const passwordMatch = await bcrypt.compare(enteredPassword, storedPassword);

      if (passwordMatch) {
        req.session.employee = {
          id: result.rows[0].id,
          employeeEmail: result.rows[0].employee_email,
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
        };

        const welcomeMessage = `Welcome, ${result.rows[0].first_name} ${result.rows[0].last_name}!`;

        return res.redirect('/render-index');
      } else {
        res.render('employeeLogin', { errorMessage: "Invalid Employee email or password" });
      }
    } else {
      res.render('employeeLogin', { errorMessage: "Invalid Employee email or password" });
    }

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
});

// For Profile
app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.render('userProfile', { user: req.session.user });
  } else if (req.session.employee) {
    res.render('employeeProfile', { employee: req.session.employee });
  } else {
    res.redirect('/login');
  }
});

// Profile color
app.post("/updateColor", (req, res) => {
  const selectedColor = req.body.color;
  req.session.user.backgroundColor = selectedColor;
  res.redirect("/profile");
});

// Profile Avatar
app.post("/updateAvatar", (req, res) => {
  const selectedAvatar = req.body.avatar;
  req.session.user.avatar = selectedAvatar;
  res.redirect("/profile");
});

// For Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.redirect("/");
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));