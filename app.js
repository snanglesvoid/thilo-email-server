const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());

app.get("/post-message", (req, res) => {
  const send = require("gmail-send")({
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    to: "snangles.void@gmail.com, info@thilobaum.design, info@heikobaum.design",
    subject: "Website: Test Message"
  });

  send(
    {
      html: "<h1>Hello World!</h1>"
    },
    (error, result, fullResult) => {
      if (error) {
        console.error(error);
      }
      console.log(result);
    }
  );
  res.json({ message: "ok" });
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

  const send = require("gmail-send")({
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    to: "snangles.void@gmail.com, info@thilobaum.design, info@heikobaum.design",
    subject: "Website: New message from " + data.email
  });

  send(
    {
      html: html
    },
    (error, result, fullResult) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }
      console.log(result);
      res.json(result);
    }
  );
});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening on port " + process.env.PORT);
});
