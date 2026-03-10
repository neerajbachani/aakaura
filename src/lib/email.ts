import nodemailer from 'nodemailer';

interface SendWaitlistEmailParams {
    userEmail: string;
    productName: string;
}

export const sendWaitlistEmail = async ({ userEmail, productName }: SendWaitlistEmailParams) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Send email to customer
        const customerMailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'You have been added to the Waitlist!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #BD9958;">Waitlist Confirmation</h2>
                    <p>Hello,</p>
                    <p>Thank you for expressing interest in <strong>${productName}</strong>. You have been successfully added to our waitlist.</p>
                    <p>We will notify you as soon as the item becomes available.</p>
                    <p>Best regards,<br>The Aakaura Team</p>
                </div>
            `,
        };

        // Send email to admin
        const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
        const adminMailOptions = {
            from: process.env.SMTP_USER,
            to: adminEmail,
            subject: 'New Waitlist Addition',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #27190b;">New Waitlist Entry</h2>
                    <p>A user has just been added to the waitlist.</p>
                    <ul>
                        <li><strong>User Email:</strong> ${userEmail}</li>
                        <li><strong>Product Name:</strong> ${productName}</li>
                    </ul>
                </div>
            `,
        };

        const results = await Promise.allSettled([
            transporter.sendMail(customerMailOptions),
            ...(adminEmail ? [transporter.sendMail(adminMailOptions)] : []),
        ]);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to send email to ${index === 0 ? 'customer' : 'admin'}:`, result.reason);
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending waitlist emails:', error);
        return { success: false, error };
    }
};
