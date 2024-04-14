const nodemailer=require('nodemailer');
const nodemailerConfig=require('./nodemailerConfig');

const sendEmail = async({to,html,subject})=>{
    const transporter=nodemailer.createTransport(nodemailerConfig);
    
    return transporter.sendMail({
      from: '"Music World" <musicworldapplication@gmail.com>',
      to,
      subject,
      html,
    });
}

module.exports=sendEmail;