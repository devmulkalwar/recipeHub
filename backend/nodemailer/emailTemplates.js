
export const VERIFICATION_EMAIL= `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #FFA500, #FF8C00); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Verify Your Email</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Hello,</p>
      <p>Thank you for joining RecipeHub, your ultimate destination for culinary inspiration. To complete your registration and access a world of delicious recipes, please verify your email.</p>
      <p>Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FFA500;">{verificationCode}</span>
      </div>
      <p>Enter this code on the verification page to confirm your email and begin exploring and sharing recipes on RecipeHub.</p>
      <p>This code will expire in 15 minutes for security reasons.</p>
      <p>If you didn't sign up for RecipeHub, please disregard this email.</p>
      <p>Best regards,<br>The RecipeHub Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
  </html>
  `

  export const WELCOME_EMAIL = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to RecipeHub</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #FFA500, #FF8C00); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to RecipeHub!</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <p>Hello {username}, </p>
        <p>Welcome to RecipeHub! We’re thrilled to have you in our community of passionate cooks and food lovers.</p>
        <p>RecipeHub offers an extensive library of recipes for every taste, and a place for you to share your own culinary creations with others. Here’s what you can do next:</p>
        <ul>
          <li>Explore recipes across various categories and cuisines.</li>
          <li>Share your own recipes with the community.</li>
          <li>Save your favorite recipes and get personalized recommendations.</li>
        </ul>
        <p>To get started, log in and begin your culinary journey:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{loginURL}" style="background-color: #FFA500; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Get Started
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team at any time. We’re here to help!</p>
        <p>Best regards,<br>The RecipeHub Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
  </html>
  `

  export const PASSWORD_RESET_REQUEST = `
  <!DOCTYPE html>  
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #FFA500, #FF8C00); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Password Reset</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Hello,</p>
      <p>We received a request to reset your password for your RecipeHub account. If you didn’t request this, please disregard this email, and your account will remain secure.</p>
      <p>To reset your password, click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{resetURL}" style="background-color: #FFA500; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>For security reasons, this link will expire in 1 hour.</p>
      <p>Best regards,<br>The RecipeHub Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </body>
  </html>
  `
  export const PASSWORD_RESET_SUCCESS = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #FFA500, #FF8C00); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Hello,</p>
      <p>Your password has been successfully reset for your RecipeHub account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #FFA500; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
          ✓
        </div>
      </div>
      <p>If you did not initiate this password reset, please contact RecipeHub support immediately.</p>
      <p>For your security, we recommend:</p>
      <ul>
        <li>Choosing a unique and strong password.</li>
        <li>Using two-factor authentication.</li>
        <li>Avoiding the same password across multiple sites.</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{loginURL}" style="background-color: #FFA500; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login with New Password</a>
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
  </html>
  `

