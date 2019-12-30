const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const sg = require("@sendgrid/mail");
require("dotenv").config();

console.log(process.env.SENDGRID_API_KEY);
sg.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());

app.get("/post-message", (req, res) => {
  const html = `
    <h3>Firstname: xyz</h3>
    <h3>Lastname: dflkgjdfg</h3>
    <p>Email: janikhotz@gmail.com</p>
    <p>hello world</p>
  `;

  const msg = {
    to: "janikhotz@gmail.com info@thilobaum.design info@heikobaum.design",
    from: "noreply@thilobaum.design",
    subject: "Neue Nachricht von der Webseite",
    text: "text",
    html: html
  };
  sg.send(msg)
    .catch(reason => console.error(reason.response.body))
    .then(console.log);

  res.send("email server working");
});

app.post("/post-message", (req, res) => {
  console.log(req.body);
  let data = req.body.data;
  const html = `
    <h3>Firstname: ${data.firstname}</h3>
    <h3>Lastname: ${data.lastname}</h3>
    <h3>Email: ${data.email}</h3>
    <h3>Message:</h3>
    <p>${data.message}</p>
  `;

  const msg = {
    to: "janikhotz@gmail.com info@thilobaum.design info@heikobaum.design",
    from: "noreply@thilobaum.design", //data.email,
    subject: "Neue Nachricht von der Webseite",
    text: data.message,
    html: html
  };
  sg.send(msg)
    .catch(reason => {
      console.error(reason.response.body);
      res.status(500).send(reason);
    })
    .then(x => {
      console.log(x);
      res.json(x);
    });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening on port " + process.env.PORT);
});
