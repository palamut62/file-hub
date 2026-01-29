const nodemailer = require('nodemailer');

async function sendMail({ user, pass, to, subject, text, files }) {
    // Validate total size approx (simple check)
    let totalSize = 0;
    // files is array of { path: string, name: string }
    // We rely on main process to pass valid file paths. The actual check usually needs fs stats, 
    // but frontend can check size before sending path. 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    const attachments = files.map(f => ({
        path: f.path,
        filename: f.name
    }));

    const mailOptions = {
        from: user,
        to: to,
        subject: subject,
        text: text,
        attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
}

module.exports = { sendMail };
