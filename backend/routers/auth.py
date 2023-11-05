from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from schemas.auth import (
    TokenSchema,
    LoginResponseSchema,
    ChangePasswordSchema,
    ResetPasswordSchema,
    SetNewPasswordSchema,
)
from schemas.user import UserSchema, UserCreateSchema
from database.models import UserModel
from dependencies import get_current_user, get_db
from crud.user import (
    read_user_by_username,
    read_user_by_email,
    create_user,
    delete_user,
    authenticate_user,
    update_password,
    activate_account,
    create_password_reset_token,
    verify_password_reset_token,
)
from functions import create_access_token, get_password_reset_email_template, get_activation_email_template
from postman import send_mail
from settings import FRONTEND_HOSTNAME


router = APIRouter(tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(new_user: UserCreateSchema, db: Annotated[Session, Depends(get_db)]):
    user = read_user_by_username(db, new_user.username)
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this username already exist.")
    user = create_user(db, new_user)
    if not user:
        raise HTTPException(status_code=500, detail="Server error occured. Please try again later.")
    try:
        mail_content = get_activation_email_template(user.activation_token)
        send_mail(user.email, "Activate your account", mail_content)
        return {
            "status_code": status.HTTP_201_CREATED,
            "detail": "Account created!\nNow you have to activate your account. Check your email.",
        }
    except:
        raise HTTPException(status_code=500, detail="Mail server error occured. Please try again later.")


@router.post("/login", response_model=LoginResponseSchema)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
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
async def change_password(
    password: ChangePasswordSchema,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    update_password(db, current_user.id, password.password)


@router.get("/activate-account")
async def account_activation(token: str, db: Annotated[Session, Depends(get_db)]):
    user = activate_account(db, token)
    if not user:
        return RedirectResponse(
            f"{FRONTEND_HOSTNAME}/auth/activate-account/failed",
            status_code=status.HTTP_303_SEE_OTHER,
        )
    return RedirectResponse(
        f"{FRONTEND_HOSTNAME}/auth/activate-account/success", status_code=status.HTTP_303_SEE_OTHER
    )


@router.post("/reset-password")
async def reset_password(email: ResetPasswordSchema, db: Annotated[Session, Depends(get_db)]):
    user = read_user_by_email(db, email.email)
    if user:
        try:
            password_reset_token = create_password_reset_token(db, user.id)
            mail_content = get_password_reset_email_template(password_reset_token)
            send_mail(email.email, "Set new password", mail_content)
        except:
            raise HTTPException(status_code=500, detail="Mail server error occured. Please try again later.")
    return {
        "status_code": status.HTTP_204_NO_CONTENT,
        "detail": "Check your email. Message with link to setting new password has been sent.",
    }


@router.post("/set-new-password")
async def set_new_password(data: SetNewPasswordSchema, db: Annotated[Session, Depends(get_db)]):
    user = verify_password_reset_token(db, data.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid password reset token.",
        )
    try:
        update_password(db, user.id, data.password)
        return {"status_code": status.HTTP_204_NO_CONTENT, "detail": "Your password has been changed."}
    except:
        raise HTTPException(status_code=500, detail="Server error occured. Please try again later.")
