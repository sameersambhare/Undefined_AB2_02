export const thankYouEmailTemplate = (name: string) => ({
  subject: 'Thank You for Contacting Us',
  body: `
Dear ${name},

Thank you for reaching out to us! We have received your message and appreciate you taking the time to contact us.

Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.

In the meantime, if you have any urgent questions, please don't hesitate to reach out to us directly at sameersambhare@gmail.com.

Best regards,
The UI Designer Team
  `
}); 