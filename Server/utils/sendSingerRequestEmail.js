const sendEmail = require("./sendEmail");

const sendSingerRequestEmail = async ({
  name,
  email,
  subject,
  userId,
  verificationToken,
  origin,
  bio,
  audioFiles,
}) => {
  const verifyEmail = `${origin}/api/auth/verify-email?token=${verificationToken}&email=${email}`;
  const addArtist = `${origin}/api/singer/addArtist`;

  let htmlContent = `<h2>Name: ${name}<br>User ID: ${userId}<br>Email: ${email}</h2><br>`;
  if (bio) {
    htmlContent += `<p>Bio: ${bio}</p><br>`;
  }

  if(audioFiles && audioFiles.length > 0) {
    htmlContent += "<p>Audio Files:</p>";
    for (const file of audioFiles) {
      htmlContent += `<p>File Name: ${file.originalname}</p>`;
    }
  }

  htmlContent += `<br><a href="${verifyEmail}">Verify Email</a><br><a href="${addArtist}">Join Family</a>`;

  return sendEmail({
    to: "musicworldapplication@gmail.com",
    subject: subject,
    html: htmlContent,
  });
};

module.exports = sendSingerRequestEmail;
