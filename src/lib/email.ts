import nodemailer from 'nodemailer';

const getFromAddress = () => {
    const fromEmail = process.env.SMTP_FROM || 'support@aakaura.com';
    return `Aakaura Support <${fromEmail}>`;
};

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

interface SendWishlistEmailParams {
    userEmail: string;
    productName: string;
}

export const sendWishlistEmail = async ({ userEmail, productName }: SendWishlistEmailParams) => {
    try {
        const transporter = createTransporter();
        const from = getFromAddress();

        const customerMailOptions = {
            from,
            to: userEmail,
            subject: 'You have been added to the Wishlist!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #BD9958;">Wishlist Confirmation</h2>
                    <p>Hello,</p>
                    <p>Thank you for expressing interest in <strong>${productName}</strong>. You have been successfully added to your wishlist.</p>
                    <p>We will notify you as soon as the item becomes available.</p>
                    <p>Best regards,<br>The Aakaura Team</p>
                </div>
            `,
        };

        const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
        const adminMailOptions = {
            from,
            to: adminEmail,
            subject: 'New Wishlist Addition',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #27190b;">New Wishlist Entry</h2>
                    <p>A user has just added an item to their wishlist.</p>
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
        console.error('Error sending wishlist emails:', error);
        return { success: false, error };
    }
};

export const sendOrderConfirmationEmail = async (orderData: any, userEmail: string, userName: string) => {
    try {
        const transporter = createTransporter();
        const from = getFromAddress();

        const firstItem = orderData.items?.[0];
        const productName = firstItem?.productName || 'Product';
        const productType = firstItem?.variationName || 'Item';
        const productPrice = orderData.total;
        
        let journeyName = 'Aakaura';
        if (firstItem?.product?.category?.name) {
            journeyName = firstItem.product.category.name.replace(/ Journey/i, '').trim();
        } else if (productName && productName.toLowerCase().includes('journey')) {
            journeyName = productName.split(' ')[0];
        }

        const customerMailOptions = {
            from,
            to: userEmail,
            subject: `Order Confirmation - ${orderData.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    <p>Dear ${userName || 'Customer'},</p>
                    <p>Thank you for your interest in ‘${productName}’ from Aakaura! 🌍❤️</p>
                    <p>The ${journeyName} Journey at Aakaura is a great choice! (given you did read our premium detailing section nicely :)! )<br>
                    We are glad to inform you that, the ‘${productName}’ ${productType} is now available and ready to energise your home at just ₹${productPrice}/-.</p>
                    <p>To confirm your order, kindly reply to this mail with your WhatsApp contact number and address, or contact us at +91 8619029656.</p>
                    <p>Thank you for your patience and for choosing Aakaura. 😃</p>
                    <p>Best regards,<br>The Aakaura Team (+91 8619029656)</p>
                    <p>Welcome back to consciousness. 🎊</p>
                </div>
            `,
        };

        const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
        const adminMailOptions = {
            from,
            to: adminEmail,
            subject: `New Order Received - ${orderData.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #27190b;">New Order Received</h2>
                    <p>A new order has been placed.</p>
                    <ul>
                        <li><strong>Order Number:</strong> ${orderData.orderNumber}</li>
                        <li><strong>Customer Email:</strong> ${userEmail}</li>
                        <li><strong>Total:</strong> ₹${orderData.total}</li>
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
                console.error(`Failed to send order email to ${index === 0 ? 'customer' : 'admin'}:`, result.reason);
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending order emails:', error);
        return { success: false, error };
    }
};

interface SendPasswordResetEmailParams {
    userEmail: string;
    userName?: string | null;
    resetUrl: string;
}

export const sendPasswordResetEmail = async ({
    userEmail,
    userName,
    resetUrl,
}: SendPasswordResetEmailParams) => {
    try {
        const transporter = createTransporter();
        const from = getFromAddress();

        await transporter.sendMail({
            from,
            to: userEmail,
            subject: 'Reset your Aakaura password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    <h2 style="color: #BD9958;">Password Reset</h2>
                    <p>Hello${userName ? ` ${userName}` : ''},</p>
                    <p>We received a request to reset your Aakaura account password. Click the button below to choose a new password:</p>
                    <p style="margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #BD9958; color: #27190B; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p>This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #27190B;">${resetUrl}</p>
                    <p>Best regards,<br>The Aakaura Team</p>
                </div>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error };
    }
};
