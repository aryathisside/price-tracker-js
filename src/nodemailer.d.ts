declare module 'nodemailer' {
    import { Transporter } from 'nodemailer/lib/xoauth2';
    export const createTransport: (options: any) => Transporter;
    export const sendMail: (options: any) => Promise<any>;
    export const getTestMessageUrl: (info: any) => string;
    // Add other exports as needed based on your usage
  }
  