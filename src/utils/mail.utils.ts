import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.NODE_ENV !== 'development', //true
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
} as SMTPTransport.Options)

type SendEmailDto = {
  sender: Mail.Address,
  receipients: Mail.Address[],
  subject: string;
  message: string;
}

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, receipients, subject, message } = dto;

  try {
    const result = await transport.sendMail({
      from: `${sender.name} <${sender.address}>`,
      to: receipients.map(
        (recipient) => `${recipient.name} <${recipient.address}>`
      ),
      subject,
      html: message, // ใช้ HTML
      text: message.replace(/<[^>]*>/g, ""), // เปลี่ยน HTML เป็น plain text
    });

    return result;
  } catch (error) {
    console.error("Error while sending email:", error);
    throw error;
  }
};
