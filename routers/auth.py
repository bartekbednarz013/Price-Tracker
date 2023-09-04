from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas.token import TokenSchema
from schemas.user import UserSchema, UserCreateSchema
from database.models import UserModel
from dependencies import get_current_user, get_db
from crud.user import read_user_by_username, create_user, delete_user, authenticate_user
from functions import create_access_token


router = APIRouter(tags=["auth"])


@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(new_user: UserCreateSchema, db: Annotated[Session, Depends(get_db)]):
    user = read_user_by_username(db, new_user.username)
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this username already exist.")
    user = create_user(db, new_user)
    return user


@router.post("/login", response_model=TokenSchema)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]
):
    (user, message) = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message,
        )
    access_token = create_access_token(user.username)
    return {"access_token": access_token, "token_type": "bearer"}


@router.delete("/delete-account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    delete_user(db, current_user.id)
