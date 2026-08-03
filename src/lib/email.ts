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

// --- Guidance Call & Ritual Support emails ---

const emailWrapper = (content: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
    ${content}
    <p style="margin-top: 24px;">Best regards,<br>The Aakaura Team</p>
  </div>
`;

export const sendBookingReceivedEmail = async (data: {
  userEmail: string;
  userName: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  bookingId: string;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.com';

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Your Guidance Call booking request has been received',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Booking Received</h2>
        <p>Hello ${data.userName},</p>
        <p>Your booking request has been received. Our team will review your preferred slot and confirm your meeting shortly.</p>
        ${data.preferredDate ? `<p><strong>Preferred Date:</strong> ${data.preferredDate}</p>` : ''}
        ${data.preferredTime ? `<p><strong>Preferred Time:</strong> ${data.preferredTime}</p>` : ''}
        <p><a href="${appUrl}/booking/${data.bookingId}" style="color: #BD9958;">View booking status</a></p>
      `),
    });

    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from,
        to: adminEmail,
        subject: 'New Guidance Call Booking',
        html: emailWrapper(`
          <h2 style="color: #27190b;">New Booking</h2>
          <p><strong>Customer:</strong> ${data.userName} (${data.userEmail})</p>
          <p><strong>Preferred:</strong> ${data.preferredDate || 'N/A'} at ${data.preferredTime || 'N/A'}</p>
          <p><a href="${appUrl}/admin/bookings/${data.bookingId}">Review in admin</a></p>
        `),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending booking received email:', error);
    return { success: false, error };
  }
};

export const sendBookingConfirmedEmail = async (data: {
  userEmail: string;
  userName: string;
  meetingDateTime: Date;
  meetingLink: string;
  timezone: string;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const formatted = data.meetingDateTime.toLocaleString('en-IN', {
      timeZone: data.timezone,
      dateStyle: 'full',
      timeStyle: 'short',
    });

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Your Aakaura Guidance Call has been confirmed',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Guidance Call Confirmed</h2>
        <p>Hello ${data.userName},</p>
        <p>Your Guidance Call has been confirmed.</p>
        <p><strong>Date & Time:</strong> ${formatted} (${data.timezone})</p>
        <p><strong>Google Meet Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending booking confirmed email:', error);
    return { success: false, error };
  }
};

export const sendBookingCancelledEmail = async (data: {
  userEmail: string;
  userName: string;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Your Guidance Call booking has been cancelled',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Booking Cancelled</h2>
        <p>Hello ${data.userName},</p>
        <p>Your Guidance Call booking has been cancelled. If you have questions, please contact us.</p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending booking cancelled email:', error);
    return { success: false, error };
  }
};

export const sendBookingRescheduledEmail = async (data: {
  userEmail: string;
  userName: string;
  meetingDateTime: Date;
  meetingLink: string;
  timezone: string;
}) => sendBookingConfirmedEmail(data);

export const sendCallCompletedEmail = async (data: {
  userEmail: string;
  userName: string;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.com';

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Thank you for attending your Guidance Call',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Call Completed</h2>
        <p>Hello ${data.userName},</p>
        <p>Thank you for attending your Guidance Call.</p>
        <p>As a next step, if you purchase Aakaura products from our website with an order total above ₹999, you may become eligible for a Ritual Package I coupon. Once we verify your purchase, our team will issue the coupon to you.</p>
        <p><a href="${appUrl}/products" style="color: #BD9958;">Explore Aakaura products</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending call completed email:', error);
    return { success: false, error };
  }
};

export const sendBookingReminderEmail = async (data: {
  userEmail: string;
  userName: string;
  meetingDateTime: Date;
  meetingLink: string;
  timezone: string;
  hoursBefore: number;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const formatted = data.meetingDateTime.toLocaleString('en-IN', {
      timeZone: data.timezone,
      dateStyle: 'full',
      timeStyle: 'short',
    });

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: `Reminder: Your Guidance Call is in ${data.hoursBefore} hour${data.hoursBefore > 1 ? 's' : ''}`,
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Upcoming Guidance Call</h2>
        <p>Hello ${data.userName},</p>
        <p>This is a reminder that your Guidance Call is scheduled for:</p>
        <p><strong>${formatted}</strong> (${data.timezone})</p>
        <p><strong>Join:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending booking reminder email:', error);
    return { success: false, error };
  }
};

export const sendPractitionerAssignmentEmail = async (data: {
  practitionerEmail: string;
  practitionerName: string;
  customerName: string;
  meetingDateTime: Date;
  meetingLink: string;
  timezone: string;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const formatted = data.meetingDateTime.toLocaleString('en-IN', {
      timeZone: data.timezone,
      dateStyle: 'full',
      timeStyle: 'short',
    });

    await transporter.sendMail({
      from,
      to: data.practitionerEmail,
      subject: 'New Guidance Call Assignment',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">New Assignment</h2>
        <p>Hello ${data.practitionerName},</p>
        <p>You have been assigned a Guidance Call with <strong>${data.customerName}</strong>.</p>
        <p><strong>Date & Time:</strong> ${formatted}</p>
        <p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending practitioner assignment email:', error);
    return { success: false, error };
  }
};

export const sendPractitionerScheduleEmail = async (data: {
  practitionerEmail: string;
  practitionerName: string;
  bookings: Array<{ customerName: string; meetingDateTime: Date; meetingLink: string }>;
  timezone: string;
  label: string;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();

    const list = data.bookings
      .map(
        (b) =>
          `<li>${b.customerName} · ${b.meetingDateTime.toLocaleString('en-IN', { timeZone: data.timezone, dateStyle: 'medium', timeStyle: 'short' })} · <a href="${b.meetingLink}">Join</a></li>`,
      )
      .join('');

    await transporter.sendMail({
      from,
      to: data.practitionerEmail,
      subject: `${data.label} Schedule | Aakaura`,
      html: emailWrapper(`
        <h2 style="color: #BD9958;">${data.label} Schedule</h2>
        <p>Hello ${data.practitionerName},</p>
        <ul>${list}</ul>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending practitioner schedule email:', error);
    return { success: false, error };
  }
};

export const sendAdminNoShowEmail = async (data: {
  customerName: string;
  customerEmail: string;
  bookingId: string;
}) => {
  try {
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    if (!adminEmail) return { success: true };

    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.com';

    await transporter.sendMail({
      from,
      to: adminEmail,
      subject: 'Customer No-Show | Guidance Call',
      html: emailWrapper(`
        <h2 style="color: #27190b;">No Show</h2>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><a href="${appUrl}/admin/bookings/${data.bookingId}">View booking</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin no-show email:', error);
    return { success: false, error };
  }
};

export const sendPackageExpiryReminderEmail = async (data: {
  userEmail: string;
  userName: string;
  packageLabel: string;
  expiryDate: Date;
  remainingCalls: number;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.com';

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Your Ritual Package is expiring soon',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Package Expiry Reminder</h2>
        <p>Hello ${data.userName},</p>
        <p>Your <strong>${data.packageLabel}</strong> package expires on ${data.expiryDate.toLocaleDateString('en-IN')}.</p>
        <p>You have <strong>${data.remainingCalls}</strong> call(s) remaining.</p>
        <p><a href="${appUrl}/ritual-packages" style="color: #BD9958;">View your packages</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending package expiry email:', error);
    return { success: false, error };
  }
};

export const sendPackagePurchaseEmail = async (data: {
  userEmail: string;
  userName: string;
  packageLabel: string;
  remainingCalls: number;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Your Ritual Package purchase is confirmed',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Package Confirmed</h2>
        <p>Hello ${data.userName},</p>
        <p>Thank you for purchasing <strong>${data.packageLabel}</strong>.</p>
        <p>You have <strong>${data.remainingCalls}</strong> call(s) available. Our team will schedule your sessions shortly.</p>
      `),
    });

    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    if (adminEmail) {
      await transporter.sendMail({
        from,
        to: adminEmail,
        subject: 'New Ritual Package Purchase',
        html: emailWrapper(`
          <p><strong>${data.userName}</strong> (${data.userEmail}) purchased ${data.packageLabel}.</p>
        `),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending package purchase email:', error);
    return { success: false, error };
  }
};

export const sendGuidanceCustomerQualifyingOrderEmail = async (data: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  bookingId: string;
}) => {
  try {
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    if (!adminEmail) return { success: true };

    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.com';

    await transporter.sendMail({
      from,
      to: adminEmail,
      subject: 'Guidance customer eligible for a coupon',
      html: emailWrapper(`
        <h2 style="color: #27190b;">Coupon Eligibility</h2>
        <p>A guidance-call customer has placed a qualifying product order (above ₹999) and is now eligible for a Ritual Package I coupon.</p>
        <ul>
          <li><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</li>
          <li><strong>Order:</strong> ${data.orderNumber}</li>
          <li><strong>Order Total:</strong> ₹${data.orderTotal}</li>
        </ul>
        <p><a href="${appUrl}/admin/bookings/${data.bookingId}" style="color: #BD9958;">Review booking &amp; issue coupon</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending qualifying order email:', error);
    return { success: false, error };
  }
};

export const sendCouponIssuedEmail = async (data: {
  userEmail: string;
  userName: string;
  couponCode: string;
  validTill: Date;
}) => {
  try {
    const transporter = createTransporter();
    const from = getFromAddress();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.com';

    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: 'Your Aakaura Ritual Package I coupon',
      html: emailWrapper(`
        <h2 style="color: #BD9958;">Your Coupon Is Here</h2>
        <p>Hello ${data.userName},</p>
        <p>Thank you for shopping with Aakaura. Here is your coupon code:</p>
        <p style="font-size: 20px;"><strong>${data.couponCode}</strong></p>
        <p>This coupon is valid until <strong>${data.validTill.toLocaleDateString('en-IN')}</strong> and can be redeemed only on <strong>Ritual Package I (₹399)</strong>.</p>
        <p><a href="${appUrl}/ritual-packages" style="color: #BD9958;">Redeem on Ritual Package I</a></p>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending coupon issued email:', error);
    return { success: false, error };
  }
};
