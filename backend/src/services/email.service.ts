import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import fs from 'fs';
import path from 'path';

export class EmailService {
    private transporter: nodemailer.Transporter;
    private templates: { [key: string]: HandlebarsTemplateDelegate } = {};

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Load email templates
        this.loadTemplates();
    }

    private loadTemplates() {
        const templatesDir = path.join(__dirname, '../templates/emails');
        const templateFiles = fs.readdirSync(templatesDir);

        templateFiles.forEach(file => {
            const templateName = path.basename(file, '.hbs');
            const templateContent = fs.readFileSync(
                path.join(templatesDir, file),
                'utf-8'
            );
            this.templates[templateName] = compile(templateContent);
        });
    }

    private async sendMail(to: string, subject: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: `"Jobify" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html
            });
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    async sendPasswordResetOTP(to: string, otp: string) {
        const template = this.templates['password-reset'];
        if (!template) {
            throw new Error('Password reset template not found');
        }

        const html = template({
            otp,
            expiryMinutes: 10,
            supportEmail: process.env.SUPPORT_EMAIL,
            currentYear: new Date().getFullYear()
        });

        return this.sendMail(
            to,
            'Password Reset OTP - Jobify',
            html
        );
    }

    async sendFreelancerOnboardingEmail(to: string, name: string) {
        const template = this.templates['freelancer-onboard'];
        if (!template) {
            throw new Error('Freelancer onboarding template not found');
        }

        const html = template({
            name,
            profileUrl: `${process.env.FRONTEND_URL}/profile`,
            supportEmail: process.env.SUPPORT_EMAIL,
            currentYear: new Date().getFullYear()
        });

        return this.sendMail(
            to,
            'Welcome to Jobify - Start Your Freelance Journey!',
            html
        );
    }

    async sendClientOnboardingEmail(to: string, companyName: string) {
        const template = this.templates['client-onboard'];
        if (!template) {
            throw new Error('Client onboarding template not found');
        }

        const html = template({
            companyName,
            profileUrl: `${process.env.FRONTEND_URL}/company/profile`,
            supportEmail: process.env.SUPPORT_EMAIL,
            currentYear: new Date().getFullYear()
        });

        return this.sendMail(
            to,
            'Welcome to Jobify - Find Your Perfect Talent!',
            html
        );
    }
} 