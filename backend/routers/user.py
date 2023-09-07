from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from schemas.user import MinUserSchema, UserSchema
from database.models import UserModel
from crud.user import read_all_users, read_user_by_id

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[MinUserSchema])
async def get_all_users(db: Session = Depends(get_db)):
    users = read_all_users(db)
    if users == []:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="There is no users.")
    return users


@router.get("/me", response_model=UserSchema)
async def get_my_details(current_user: Annotated[UserModel, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]):
    user = read_user_by_id(db, current_user.id)
    return user

# @router.get("/{user_id}", response_model=UserSchema)
# def get_user(user_id: int, db: Session = Depends(get_db)):
#     user = read_user_by_id(db, user_id=user_id)
#     if user is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
#     return user
