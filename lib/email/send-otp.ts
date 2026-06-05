import { Resend } from "resend"

type OtpEmailType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email"

const subjects: Record<OtpEmailType, string> = {
  "sign-in": "Your Portray sign-in code",
  "email-verification": "Verify your Portray email",
  "forget-password": "Reset your Portray password",
  "change-email": "Confirm your new Portray email",
}

const headings: Record<OtpEmailType, string> = {
  "sign-in": "Sign in to Portray",
  "email-verification": "Verify your email",
  "forget-password": "Reset your password",
  "change-email": "Confirm your new email",
}

export function sendOtpEmail({
  email,
  otp,
  type,
}: {
  email: string
  otp: string
  type: OtpEmailType
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    console.error("RESEND_API_KEY or RESEND_FROM_EMAIL is missing")
    return
  }

  const resend = new Resend(apiKey)
  const subject = subjects[type]
  const heading = headings[type]

  void resend.emails.send({
    from,
    to: email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="font-size:20px;margin:0 0 8px">${heading}</h1>
        <p style="color:#555;margin:0 0 16px">Use this code. It expires in 5 minutes.</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:0 0 16px">${otp}</p>
        <p style="color:#888;font-size:13px;margin:0">If you did not request this, you can ignore this email.</p>
      </div>
    `,
  })
}
