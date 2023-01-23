const express = require("express");
const http = require("http");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const app = express();
require("dotenv").config();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const httpServer = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + httpServer.address().port);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cecilia980127@gmail.com',
    pass: 'vautcthkcpgjlojr'
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.get("/wakeup", function(request, response) {
  console.log("i'm awake");
  response.send("i'm awake")
});

app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    const mail = {
      from: 'cecilia980127@gmail.com',
      to: 'cecilia980127@gmail.com',
      subject: '[Portfolio] New Form submission',
      text: `You have received a new message from ${data.fname} \n` +
      `Email: <${data.femail}> \n` + 
      `Here is the message: ${data.fmessage}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log('Email sent:' + data.response);
        res.sendStatus(200);
      }
    });
  });
});