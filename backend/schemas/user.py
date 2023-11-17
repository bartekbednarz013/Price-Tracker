from pydantic import BaseModel, EmailStr
from .item import ItemSchema


class UserCreateSchema(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr
    email_notifications: bool
    items: list[ItemSchema] = []

    class Config:
        from_attributes = True


class MinUserSchema(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class ChangeEmailNotificationsSchema(BaseModel):
    email_notifications: bool
