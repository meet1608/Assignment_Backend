const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS       
  },
   tls: {
    rejectUnauthorized: false, 
  },
});

const sendAddPasswordEmail = async (toEmail, token) => {

    const mailOptions ={ 
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Set Your Password and varify your email address',
        html:`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Set Password Email</title>
          <style>
            body {
              margin: 0;
              padding: 0;
            background-color: #f3f4f6;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1f2937;
            }
              .container {
                max-width: 500px;
                margin: 40px auto;
                background-color: #ffffff;
                padding: 30px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
              }
              h2 {
                font-size: 24px;
                margin-bottom: 20px;
              }
              p {
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3b82f6;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
              }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Set Your Password</h2>
            <p>Click the button below to set your password:</p>
            <a href="http://localhost:3000/set-password?token=${token}" class="button">Set Password</a>
          </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }


}

module.exports = sendAddPasswordEmail;