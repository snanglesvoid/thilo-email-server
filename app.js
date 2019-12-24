const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const sg = require("@sendgrid/mail");

sg.setApiKey(process.env.SENDGRID_API_KEY);

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());

app.get("/post-message", (req, res) => {
  res.send("email server working");
});

app.post("/post-message", (req, res) => {
  console.log(req.body);

  const html = `
    <h3>Firstname: ${req.body.firstname}</h3>
    <h3>Lastname: ${req.body.lastname}</h3>
    <p>Email: ${req.body.email}</p>
    <p>${req.body.message}</p>
  `;

  const msg = {
    to: "janikhotz@gmail.com",
    from: req.body.email,
    subject: "Neue Nachricht von der Webseite",
    text: req.body.message,
    html: html
  };
  sg.send(msg);
});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening on port " + process.env.PORT);
});
