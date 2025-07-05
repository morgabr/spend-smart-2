import nodemailer from 'nodemailer';
import { emailConfig } from '../config/env';

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface MagicLinkEmailData {
  email: string;
  magicLink: string;
  userName?: string;
}

class EmailService {
  private transporter?: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (emailConfig.provider === 'console') {
      // Development mode - no actual transporter needed
      return;
    }

    if (emailConfig.provider === 'sendgrid') {
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: emailConfig.sendgrid.apiKey,
        },
      });
    } else {
      // Default to console for development
      console.warn(
        '⚠️  Email service provider not configured, using console mode'
      );
    }
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    if (emailConfig.provider === 'console' || !this.transporter) {
      // Development mode - print email to console
      console.log('\n📧 ================= EMAIL (DEV MODE) =================');
      console.log(`To: ${emailData.to}`);
      console.log(`Subject: ${emailData.subject}`);
      console.log('---');
      console.log(emailData.text || emailData.html || 'No content');
      console.log('=====================================================\n');

      return;
    }

    try {
      const mailOptions = {
        from: emailConfig.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${emailData.to}`);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendMagicLinkEmail(data: MagicLinkEmailData): Promise<void> {
    const { email, magicLink, userName } = data;

    const subject = 'Sign in to SpendSmart';
    const greeting = userName ? `Hello ${userName}` : 'Hello';

    const text = `
${greeting},

Click the link below to sign in to your SpendSmart account:

${magicLink}

This link will expire in 15 minutes for security reasons.

If you didn't request this email, you can safely ignore it.

Best regards,
The SpendSmart Team
    `.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #2563eb; border-radius: 8px; line-height: 48px; color: white; font-size: 24px; font-weight: bold;">
            $
          </div>
        </div>
        
        <h1 style="color: #1f2937; margin-bottom: 20px;">Sign in to SpendSmart</h1>
        
        <p style="color: #4b5563; margin-bottom: 20px;">${greeting},</p>
        
        <p style="color: #4b5563; margin-bottom: 30px;">
          Click the button below to sign in to your SpendSmart account:
        </p>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${magicLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Sign In to SpendSmart
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
          This link will expire in 15 minutes for security reasons.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
          If you didn't request this email, you can safely ignore it.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          Best regards,<br>
          The SpendSmart Team
        </p>
      </div>
    `;

    // For dev mode, also print the clickable link
    if (emailConfig.provider === 'console') {
      console.log(
        '\n🔗 ================= MAGIC LINK (DEV MODE) ================='
      );
      console.log(`✨ Click this link to sign in: ${magicLink}`);
      console.log(
        '===========================================================\n'
      );
    }

    await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const subject = 'Welcome to SpendSmart!';

    const text = `
Hello ${userName},

Welcome to SpendSmart! We're excited to help you take control of your financial future.

Here's what you can do with SpendSmart:
• Connect your bank accounts and credit cards
• Track your spending and categorize transactions
• Set budgets and financial goals
• Forecast your financial future
• Get insights into your spending patterns

Get started by connecting your first account in the app.

If you have any questions, feel free to reach out to our support team.

Best regards,
The SpendSmart Team
    `.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #2563eb; border-radius: 8px; line-height: 48px; color: white; font-size: 24px; font-weight: bold;">
            $
          </div>
        </div>
        
        <h1 style="color: #1f2937; margin-bottom: 20px;">Welcome to SpendSmart!</h1>
        
        <p style="color: #4b5563; margin-bottom: 20px;">Hello ${userName},</p>
        
        <p style="color: #4b5563; margin-bottom: 30px;">
          Welcome to SpendSmart! We're excited to help you take control of your financial future.
        </p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">Here's what you can do with SpendSmart:</h3>
          <ul style="color: #4b5563; margin-bottom: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Connect your bank accounts and credit cards</li>
            <li style="margin-bottom: 8px;">Track your spending and categorize transactions</li>
            <li style="margin-bottom: 8px;">Set budgets and financial goals</li>
            <li style="margin-bottom: 8px;">Forecast your financial future</li>
            <li style="margin-bottom: 8px;">Get insights into your spending patterns</li>
          </ul>
        </div>
        
        <p style="color: #4b5563; margin-bottom: 30px;">
          Get started by connecting your first account in the app.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          Best regards,<br>
          The SpendSmart Team
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }
}

export default new EmailService();
