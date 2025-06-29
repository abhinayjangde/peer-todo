import nodemailer from "nodemailer";

const sendEmail = async (email, token, subject, message) => {
    try {
        // 1. Create email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        // 2. Mail Options
        const mailOptions = {
            from: "peerauth@gmail.com",
            to: email,
            subject: subject,
            text: message,
            // // HTML body
            // html: `
            //     <div style="font-family: Arial, sans-serif; color: #333;">
            //         <h2>Email Verification</h2>
            //         <p>Thank you for registering! Please verify your email to complete your registration.</p>
            //         <p>
            //             <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">
            //                 Verify Email
            //             </a>
            //         </p>
            //         <p>This verification link will expire in 10 minutes.</p>
            //         <p>If you did not create an account, please ignore this email.</p>
            //     </div>
            // `,
        };

        // 3. Send email
        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending verification email: ", error);
        return false;
    }
};

export default sendEmail;
