import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const { recipientEmail, taskTitle, commentText, commenterName } = body

  if (!recipientEmail || !taskTitle || !commentText) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const data = await resend.emails.send({
      from: 'Task Notifier <ke.lu.th@dartmouth.edu>',
      to: recipientEmail,
      subject: `New Comment on Task: "${taskTitle}"`,
      html: `
        <p><strong>${commenterName || 'Someone'}</strong> commented on <em>${taskTitle}</em>:</p>
        <blockquote>${commentText}</blockquote>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
