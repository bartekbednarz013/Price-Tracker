from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.models import UserModel
from database.config import SessionLocal
from crud.user import read_user_by_username
from functions import decode_username_from_token


oauth2 = OAuth2PasswordBearer(tokenUrl="login-swagger")


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(db: Annotated[Session, Depends(get_db)], token: Annotated[str, Depends(oauth2)]) -> UserModel:
    username = decode_username_from_token(token)
    user = read_user_by_username(db, username=username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
