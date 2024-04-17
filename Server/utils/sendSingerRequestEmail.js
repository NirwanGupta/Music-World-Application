const sendEmail = require("./sendEmail");
const sendContactUsEmail = async ({
  name,
  email,
  subject,
  bio,
  userId,
}) => {
  return sendEmail({
    to: "musicworldapplication@gmail.com",
    subject: subject,
    html: `<h2>Name: ${name}<br>UserID: ${userId}<br>Email: ${email}</h2><br><br><h2>Bio: ${bio}</h2>`,
  });
};
module.exports = sendContactUsEmail;
