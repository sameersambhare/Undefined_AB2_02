export const thankYouEmailTemplate = (name: string) => ({
  subject: 'Thank You for Contacting Us',
  body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p>Dear ${name},</p>

  <p>👋 Thank you for reaching out to us! We have received your message and appreciate you taking the time to contact us.</p>

  <p>⏳ Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.</p>

  <p>❓ In the meantime, if you have any urgent questions, please don't hesitate to reach out to us directly at snapui.tech@gmail.com.</p>

  <p>Best regards,<br>
  ✨ The UI Designer Team</p>
</body>
</html>`
});

export const welcomeEmailTemplate = (name: string) => ({
  subject: 'Welcome to UI Designer - Your Account is Ready',
  body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p>Dear ${name},</p>

  <p>🌟 Welcome to UI Designer! We're thrilled to have you join our community.</p>

  <p>✅ Your account has been successfully created, and you now have access to all our features:</p>
  <ul style="list-style-type: none; padding-left: 20px;">
    <li>🎨 Create beautiful user interfaces</li>
    <li>📚 Access our design templates</li>
    <li>👥 Collaborate with other designers</li>
    <li>💾 Save and manage your projects</li>
  </ul>

  <p>🚀 Get started by exploring our platform and creating your first design. If you need any help or have questions, our support team is always here to assist you.</p>

  <p>Best regards,<br>
  ✨ The UI Designer Team</p>
</body>
</html>`
}); 