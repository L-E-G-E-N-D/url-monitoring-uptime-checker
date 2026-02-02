const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendAlertEmail(email, url, status, time) {
    if (!email) return;

    try {
        const subject = `[Alert] Monitor ${status}: ${url}`;
        const text = `Monitor Alert\n\nURL: ${url}\nStatus: ${status}\nTime: ${new Date(time).toLocaleString()}\n\nPlease check your dashboard.`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log(`Email sent to ${email} for ${url}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendAlertEmail,
};
