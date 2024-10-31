const nodemailer = require("nodemailer");

async function SendEmailFunction(email, title, text) {
  const emailLogin = process.env.EMAIL;
  const emailPassword = process.env.PASSWORD_EMAIL;

  const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: emailLogin,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: emailLogin,
    to: email,
    subject: title,
    text: text,
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  SendEmailFunction,
};
