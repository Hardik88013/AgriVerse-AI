# Purpose: FastMail configuration and email sending logic.
# How it works: Uses fastapi-mail to send SMTP emails asynchronously.
# Why it exists: To send email verification and password reset links.

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from config import settings
import logging

logger = logging.getLogger(__name__)

# SMTP Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.smtp_user,
    MAIL_PASSWORD=settings.smtp_pass,
    MAIL_FROM=settings.smtp_user,
    MAIL_PORT=settings.smtp_port,
    MAIL_SERVER=settings.smtp_host,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_verification_email(email: str, token: str):
    """
    Input: User's email and their verification token.
    Output: None (sends email).
    Logic: Constructs an HTML email with a link to the frontend verification page.
    """
    verify_link = f"{settings.frontend_url}/verify-email?token={token}"
    
    html = f"""
    <h2>Welcome to AgriSense AI!</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="{verify_link}">Verify Email</a>
    <p>If you did not register, please ignore this email.</p>
    """
    
    message = MessageSchema(
        subject="Verify your AgriSense AI account",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        logger.info(f"Verification email sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {str(e)}")

async def send_password_reset_email(email: str, token: str):
    """Sends a password reset link to the user."""
    reset_link = f"{settings.frontend_url}/reset-password?token={token}"
    
    html = f"""
    <h2>AgriSense AI - Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="{reset_link}">Reset Password</a>
    """
    
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
    except Exception as e:
        logger.error(f"Failed to send reset email: {str(e)}")
