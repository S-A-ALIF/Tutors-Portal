import nodemailer from 'nodemailer';

export interface EmailPayload {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    fromName?: string;
    replyTo?: string;
}

/**
 * Reusable transporter configured for Gmail.
 * Ensure EMAIL_USER and EMAIL_APP_PASSWORD are set in your server/.env file.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

/**
 * Core utility function to send emails across the Tutors Portal application.
 * 
 * @param {EmailPayload} payload - The email details (to, subject, text, html, fromName, replyTo)
 * @returns {Promise<boolean>} Resolves to true if successful
 */
export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
    try {
        // Validate environment variables early to prevent silent failures
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            throw new Error('Email credentials are not configured in the environment variables.');
        }

        // Default to Tutors Portal if no institution name is provided
        const senderName = payload.fromName ? payload.fromName : 'Tutors Portal';
        // Default to the master email if no reply-to is provided
        const replyToAddress = payload.replyTo ? payload.replyTo : process.env.EMAIL_USER;

        const mailOptions = {
            from: `"${senderName}" <${process.env.EMAIL_USER}>`,
            to: payload.to,
            replyTo: replyToAddress,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log(`[EmailService] Email sent successfully to ${payload.to}. Message ID: ${info.messageId}`);
        return true;
        
    } catch (error) {
        console.error('[EmailService] Error sending email:', error);
        // Throwing the error allows the calling controller to handle it (e.g., return a 500 response)
        throw new Error('Failed to send email. Please check the email service configuration.');
    }
};