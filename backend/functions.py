from datetime import datetime, timedelta
from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from settings import ACCESS_TOKEN_EXPIRE, JWT_ALGORITHM, SECRET_KEY, FRONTEND_HOSTNAME, BACKEND_HOSTNAME


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password):
    return pwd_context.hash(password)


def decode_username_from_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception


def create_access_token(username: str):
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE)
    to_encode = {"sub": username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def get_activation_email_template(token: str):
    return (
        f'Activate your account by clicking the <a href="{BACKEND_HOSTNAME}/activate-account?token={token}">link</a>.'
    )


def get_password_reset_email_template(token: str):
    return f'Click the <a href="{FRONTEND_HOSTNAME}/auth/set-new-password/{token}">link</a>, to set new password.'


def get_expected_price_reached_notification_template(name: str, url: str):
    return f'Your item: <a href="{url}">{name}</a> reached expected price.'


def get_price_dropped_notification_template(name: str, url: str):
    return f'Price of your item: <a href="{url}">{name}</a> just dropped.'
