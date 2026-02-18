import nodemailer from 'nodemailer';

/**
 * Sends an email with the signed PDF attached.
 *
 * Uses Mailtrap SMTP credentials from environment variables.
 * Sends to both the student and admin.
 */
export async function sendSignedAgreementEmail({
  studentEmail,
  studentName,
  adminEmail,
  pdfBuffer,
  course,
}: {
  studentEmail: string;
  studentName: string;
  adminEmail: string;
  pdfBuffer: Buffer;
  course: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.MAILTRAP_PORT || '2525', 10),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const filename = `agreement-${studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Student Agreement Signed</h1>
      </div>
      <div style="background: #f9f9ff; padding: 24px; border: 1px solid #e5e5f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #333; font-size: 15px;">Hello,</p>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          A student agreement has been digitally signed. The details are below:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 12px; background: #f0edf8; font-weight: bold; color: #5838a3; border-radius: 6px 0 0 0;">Name</td>
            <td style="padding: 8px 12px; background: #f5f3fa; border-radius: 0 6px 0 0;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f0edf8; font-weight: bold; color: #5838a3;">Email</td>
            <td style="padding: 8px 12px; background: #f5f3fa;">${studentEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f0edf8; font-weight: bold; color: #5838a3; border-radius: 0 0 0 6px;">Course</td>
            <td style="padding: 8px 12px; background: #f5f3fa; border-radius: 0 0 6px 0;">${course || 'N/A'}</td>
          </tr>
        </table>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          The signed agreement PDF is attached to this email for your records.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5f0; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated email from the Student Agreement Form system.
        </p>
      </div>
    </div>
  `;

  // Send to student
  await transporter.sendMail({
    from: '"Student Agreement Form" <no-reply@agreement-form.com>',
    to: studentEmail,
    subject: `Your Signed Agreement — ${studentName}`,
    html: htmlBody,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  // Send to admin
  await transporter.sendMail({
    from: '"Student Agreement Form" <no-reply@agreement-form.com>',
    to: adminEmail,
    subject: `[New Submission] Agreement Signed by ${studentName}`,
    html: htmlBody,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
