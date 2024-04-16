const nodemailer=require('nodemailer');
const nodemailerConfig=require('./nodemailerConfig');

const sendEmail = async({to,html,subject})=>{
    const transporter=nodemailer.createTransport(nodemailerConfig);
    
    return transporter.sendMail({
        from:'"Music World Application" <aryawart.kathpal2909@gmail.com>',
        to,subject,html
    });
}

module.exports=sendEmail;