import { env } from "@/config";
import nodemailer from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    }
});

const hbsOptions = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.join(__dirname, "../../templates/"),
        layoutsDir: path.join(__dirname, "../../templates/"),
        defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../../templates/"),
    extName: ".hbs",
}

transporter.use("compile", hbs(hbsOptions));

export const sendResetEmail = async (to: string, token: string, userName?: string) => {
    try {
        const resetLink = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;
        const logoUrl = `https://i.imgur.com/L8sL4Kx.png`;

        const mailOptions = {
            from: env.MAIL_USER,
            to,
            subject: "Password Reset - Dialify",
            template: "recoveryPassword",
            context: {
                resetLink,
                logoUrl,
                user: userName || "User"
            } 
        };
        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", result.messageId);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send reset email");
    }
};