import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRenewalConfirmation({
  to,
  name,
  months,
  newEndDate,
}: {
  to: string
  name: string
  months: number
  newEndDate: Date
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `🎉 Membership Renewed for ${months} Month(s)`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for renewing your gym membership!</p>
      <p><strong>Duration:</strong> ${months} month(s)<br/>
      <strong>New Expiration Date:</strong> ${newEndDate.toDateString()}</p>
      <p>Stay strong 💪<br/>— Your Gym Team</p>
    `,
  })
}
