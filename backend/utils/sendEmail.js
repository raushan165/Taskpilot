// const nodemailer = require('nodemailer');

// const sendEmail = async (email, otp, type) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // Your App Password
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: type === 'VERIFICATION' ? 'Account Verification OTP' : 'Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>${type === 'VERIFICATION' ? 'Welcome!' : 'Reset Password'}</h2>
//           <p>Your OTP is:</p>
//           <h1 style="color: #4CAF50;">${otp}</h1>
//           <p>This code expires in 5 minutes.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.log('Email send failed', error);
//     throw error;
//   }
// };

// module.exports = sendEmail;












// utils/sendEmail.js
const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');

const sendEmail = async (email, html, subject, type = 'CONTACT') => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    await EmailLog.create({
      to: email,
      from: mailOptions.from,
      subject,
      html,
      type,
      status: 'SENT',
    });

    return info;
  } catch (error) {
    await EmailLog.create({
      to: email,
      from: process.env.EMAIL_USER,
      subject,
      html,
      type,
      status: 'FAILED',
      error: error.message,
    });
    throw error;
  }
};

module.exports = sendEmail;
