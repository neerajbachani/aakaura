import nodemailer from 'nodemailer';

interface SendWishlistEmailParams {
    userEmail: string;
    productName: string;
}

export const sendWishlistEmail = async ({ userEmail, productName }: SendWishlistEmailParams) => {
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

        // Send email to admin
        const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
        const adminMailOptions = {
            from: process.env.SMTP_USER,
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
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

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

        // Send email to customer
        const customerMailOptions = {
            from: process.env.SMTP_USER,
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

        // Send email to admin
        const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
        const adminMailOptions = {
            from: process.env.SMTP_USER,
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
