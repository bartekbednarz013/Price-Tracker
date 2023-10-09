from pydantic import BaseModel
from .user import UserSchema


class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class LoginResponseSchema(BaseModel):
    access_token: str
    user: UserSchema

class ChangePasswordSchema(BaseModel):
    password: str