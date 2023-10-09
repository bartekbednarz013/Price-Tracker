from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas.auth import TokenSchema, LoginResponseSchema, ChangePasswordSchema
from schemas.user import UserSchema, UserCreateSchema
from database.models import UserModel
from dependencies import get_current_user, get_db
from crud.user import read_user_by_username, create_user, delete_user, authenticate_user, set_new_password
from functions import create_access_token


router = APIRouter(tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(new_user: UserCreateSchema, db: Annotated[Session, Depends(get_db)]):
    user = read_user_by_username(db, new_user.username)
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this username already exist.")
    user = create_user(db, new_user)
    return {'status_code': status.HTTP_201_CREATED, 'detail': 'Account created!'}


@router.post("/login", response_model=LoginResponseSchema)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]
):
    (user, message) = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message,
        )
    access_token = "Bearer " + create_access_token(user.username)
    return {"access_token": access_token, "user": user}

@router.post("/login-swagger", response_model=TokenSchema)
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


@router.post("/delete-account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    delete_user(db, current_user.id)


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    password: ChangePasswordSchema,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    set_new_password(db, current_user.id, password.password)