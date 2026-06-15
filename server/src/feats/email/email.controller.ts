import { Request, Response } from 'express';
import { sendEmail } from './email.service';

/**
 * Controller to handle sending a test email from the frontend testing page.
 */
export const testSendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { to, subject, text, html, institutionName, institutionEmail } = req.body;

        // Basic validation
        if (!to || !subject) {
            res.status(400).json({ 
                success: false, 
                message: 'Recipient (to) and subject are required fields.' 
            });
            return;
        }

        // Construct dynamic text to include institution details if provided
        const baseText = text || 'This is a test email.';
        const dynamicText = institutionName && institutionEmail 
            ? `${baseText}\n\nYou were invited by ${institutionName}. Contact them directly at ${institutionEmail}.` 
            : baseText;

        // Construct dynamic HTML to include institution details if provided
        const baseHtml = html || `<p>${baseText}</p>`;
        const dynamicHtml = institutionName && institutionEmail
            ? `${baseHtml}<br><br><p style="color: #555; font-size: 14px;"><em>You were invited by <strong>${institutionName}</strong>. Contact them directly at <a href="mailto:${institutionEmail}">${institutionEmail}</a>.</em></p>`
            : baseHtml;

        // Trigger the shared email service
        await sendEmail({
            to,
            subject,
            text: dynamicText,
            html: dynamicHtml,
            fromName: institutionName,
            replyTo: institutionEmail
        });

        res.status(200).json({ 
            success: true, 
            message: 'Email dispatched successfully.' 
        });

    } catch (error: any) {
        console.error('[TestEmailController] Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error while sending email.' 
        });
    }
};