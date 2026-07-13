import { Request, Response } from 'express';
import { sendEmail } from './email.service';
import { pool } from '../../config/db.config';

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

/**
 * Controller to handle sending bulk notifications.
 */
export const sendBulkNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { recipients, message, method, subject } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            res.status(400).json({ success: false, message: 'No recipients provided.' });
            return;
        }

        if (method === 'email' || method === 'all') {
            // Send emails concurrently
            const emailPromises = recipients.map(recipient => {
                const to = typeof recipient === 'string' ? recipient : recipient.email;
                if (!to) return Promise.resolve(); // skip if no email

                return sendEmail({
                    to,
                    subject: subject || 'New Notification from Tutors Portal',
                    text: message,
                    html: `<p>${message.replace(/\n/g, '<br>')}</p>`
                }).catch(err => console.error(`Failed to send email to ${to}:`, err));
            });

            await Promise.all(emailPromises);
        }
        
        if (method === 'webapp' || method === 'all') {
            // Save to database
            const dbPromises = recipients.map(recipient => {
                const email = typeof recipient === 'string' ? recipient : recipient.email;
                if (!email) return Promise.resolve();

                return pool.query(
                    'INSERT INTO notifications (recipient_email, message) VALUES ($1, $2)',
                    [email, message]
                ).catch(err => console.error(`Failed to save notification for ${email}:`, err));
            });

            await Promise.all(dbPromises);
        }

        res.status(200).json({
            success: true,
            message: `Notifications dispatched successfully via ${method}`
        });

    } catch (error: any) {
        console.error('[BulkNotificationController] Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error while sending notifications.' 
        });
    }
};

/**
 * Controller to handle fetching notifications for a specific user.
 */
export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.query.email as string;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email query parameter is required' });
            return;
        }
        
        const result = await pool.query(
            'SELECT * FROM notifications WHERE recipient_email = $1 ORDER BY created_at DESC',
            [email]
        );
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (error: any) {
        console.error('[GetNotificationsController] Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

/**
 * Controller to mark a specific notification as read.
 */
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Notification ID is required' });
            return;
        }
        
        await pool.query(
            'UPDATE notifications SET is_read = true WHERE id = $1',
            [id]
        );
        
        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error: any) {
        console.error('[MarkNotificationReadController] Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};