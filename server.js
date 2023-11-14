const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5163;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('./pages')); // This make it so that the index page is shown

app.listen(PORT, () => console.log(`Listening on ${PORT}`));