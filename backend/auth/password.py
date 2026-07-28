# Purpose: Handles password hashing and verification.
# How it works: Uses bcrypt (via passlib) to hash plaintext passwords securely.
# Why it exists: To ensure passwords are NEVER stored in plaintext in the database.
# Used by: auth_router.py (during registration and login)

from passlib.context import CryptContext

# Create a context that uses bcrypt for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Input: The plain password the user typed, and the hashed password from the DB.
    Output: True if they match, False otherwise.
    Logic: Uses bcrypt to hash the plain_password and compares it to the saved hash safely.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Input: Plaintext password.
    Output: The bcrypt hash string (e.g., $2b$12$...).
    Logic: Hashes the password with a randomly generated salt.
    """
    return pwd_context.hash(password)
