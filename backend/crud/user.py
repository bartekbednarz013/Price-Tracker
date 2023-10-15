from sqlalchemy.orm import Session
from database.models import UserModel
from schemas.user import UserCreateSchema
from functions import verify_password, hash_password
from secrets import token_urlsafe


def create_user(db: Session, user: UserCreateSchema) -> UserModel:
    hashed_password = hash_password(user.password)
    activation_token = token_urlsafe(32)
    user_instance = UserModel(
        username=user.username, email=user.email, password=hashed_password, activation_token=activation_token
    )
    db.add(user_instance)
    db.commit()
    db.refresh(user_instance)
    return user_instance if user_instance else None


def read_user_by_id(db: Session, user_id: int) -> UserModel:
    user = db.query(UserModel).get(user_id)
    return user if user else None


def read_user_by_username(db: Session, username: str) -> UserModel:
    user = db.query(UserModel).filter(UserModel.username == username).first()
    return user if user else None


def read_user_by_email(db: Session, email: str) -> UserModel:
    user = db.query(UserModel).filter(UserModel.email == email).first()
    return user if user else None


def read_all_users(db: Session) -> list[UserModel]:
    return db.query(UserModel).all()


def delete_user(db: Session, user_id: int) -> UserModel:
    user = db.query(UserModel).get(user_id)
    db.delete(user)
    db.commit()
    return user


def authenticate_user(db: Session, username: str, password: str):
    user = read_user_by_username(db, username)
    if not user:
        return (False, "User not found")
    if not verify_password(password, user.password):
        return (False, "Wrong password")
    if not user.activated:
        return (False, "Account not activated")
    return (user, "Successfully authenticated")


async def increase_user_tracked_items(db: Session, user_id: int):
    user = db.query(UserModel).get(user_id)
    user.tracked_items += 1
    db.commit()


async def decrease_user_tracked_items(db: Session, user_id: int):
    user = db.query(UserModel).get(user_id)
    user.tracked_items -= 1
    db.commit()


def update_password(db: Session, user_id: int, new_password: str):
    hashed_password = hash_password(new_password)
    user = db.query(UserModel).get(user_id)
    user.password = hashed_password
    db.commit()
    return user


def activate_account(db: Session, token: str):
    user = db.query(UserModel).filter(UserModel.activation_token == token).first()
    if user:
        user.activation_token = None
        user.activated = True
        db.commit()
        return user


def create_password_reset_token(db: Session, user_id: int):
    password_reset_token = token_urlsafe(32)
    user = db.query(UserModel).get(user_id)
    user.password_reset_token = password_reset_token
    db.commit()
    return password_reset_token


def verify_password_reset_token(db: Session, token: str):
    user = db.query(UserModel).filter(UserModel.password_reset_token == token).first()
    if user:
        user.password_reset_token = None
        db.commit()
        return user
