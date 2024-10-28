import {
	PASSWORD_RESET_REQUEST,
	PASSWORD_RESET_SUCCESS,
	VERIFICATION_EMAIL,
	WELCOME_EMAIL,
  } from "./emailTemplates.js";
  import transporter from "./nodemailer.config.js"; // Assuming you have a nodemailer config setup
  
  // Send Verification Email
  export const sendVerificationEmail = async (email, verificationToken) => {
	try {
	  const response = await transporter.sendMail({
		from: `"recipeHub Company" <${process.env.GMAIL_USER}>`, // Sender's email address
		to: email, // Recipient's email
		subject: "Verify your email", // Email subject
		html: VERIFICATION_EMAIL.replace("{verificationCode}", verificationToken), // HTML email body
	  });
  
	  console.log("Verification email sent successfully", response);
	} catch (error) {
	  console.error("Error sending verification email:", error);
	  throw new Error("Error sending verification email");
	}
  };
  
  // Send Welcome Email
  export const sendWelcomeEmail = async (email,username) => {
	try {
	  const response = await transporter.sendMail({
		from: `"recipeHub Company" <${process.env.GMAIL_USER}>`, // Sender's email address
		to: email, // Recipient's email
		subject: "Welcome to recipeHub!", // Email subject
		html: WELCOME_EMAIL.replace("{username}", username) // HTML email body
	  });
  
	  console.log("Welcome email sent successfully", response);
	} catch (error) {
	  console.error("Error sending welcome email:", error);
	  throw new Error(`Error sending welcome email: ${error}`);
	}
  };
  
  // Send Password Reset Email
  export const sendPasswordResetEmail = async (email, resetURL) => {
	try {
	  const response = await transporter.sendMail({
		from: `"recipeHub Company" <${process.env.GMAIL_USER}>`, // Sender's email address
		to: email, // Recipient's email
		subject: "Reset your password", // Email subject
		html: PASSWORD_RESET_REQUEST.replace("{resetURL}", resetURL), // HTML email body
	  });
  
	  console.log("Password reset email sent successfully", response);
	} catch (error) {
	  console.error("Error sending password reset email:", error);
	  throw new Error("Error sending password reset email");
	}
  };
  
  // Send Password Reset Success Email
  export const sendResetSuccessEmail = async (email) => {
	try {
	  const response = await transporter.sendMail({
		from: `"recipeHub Company" <${process.env.GMAIL_USER}>`, // Sender's email address
		to: email, // Recipient's email
		subject: "Password Reset Successful", // Email subject
		html: PASSWORD_RESET_SUCCESS, // HTML email body
	  });
  
	  console.log("Password reset success email sent successfully", response);
	} catch (error) {
	  console.error("Error sending password reset success email:", error);
	  throw new Error("Error sending password reset success email");
	}
  };
  