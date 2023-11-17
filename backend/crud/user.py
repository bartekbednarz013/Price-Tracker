from sqlalchemy.orm import Session
from database.models import UserModel
from schemas.user import UserCreateSchema
from functions import verify_password, hash_password
from secrets import token_urlsafe


async def create_user(db: Session, user: UserCreateSchema) -> UserModel | None:
    hashed_password = hash_password(user.password)
    activation_token = token_urlsafe(32)
    user_instance = UserModel(
        username=user.username, email=user.email, password=hashed_password, activation_token=activation_token
    )
    db.add(user_instance)
    db.commit()
    db.refresh(user_instance)
    return user_instance if user_instance else None


async def read_user_by_id(db: Session, user_id: int) -> UserModel | None:
    user = db.query(UserModel).get(user_id)
    return user if user else None


async def read_user_by_username(db: Session, username: str) -> UserModel | None:
    user = db.query(UserModel).filter(UserModel.username == username).first()
    return user if user else None


async def read_user_by_email(db: Session, email: str) -> UserModel | None:
    user = db.query(UserModel).filter(UserModel.email == email).first()
    return user if user else None


async def read_all_users(db: Session) -> list[UserModel]:
    return db.query(UserModel).all()


async def delete_user(db: Session, user_id: int) -> UserModel | None:
    user = db.query(UserModel).get(user_id)
    db.delete(user)
    db.commit()
    return user if user else None


async def authenticate_user(db: Session, username: str, password: str) -> tuple[bool | UserModel, str]:
    user = await read_user_by_username(db, username)
    if not user:
        return (False, "User not found")
    if not verify_password(password, user.password):
        return (False, "Wrong password")
    if not user.activated:
        return (False, "Account not activated")
    return (user, "Successfully authenticated")


async def increase_user_tracked_items(db: Session, user_id: int) -> None:
    user = db.query(UserModel).get(user_id)
    user.tracked_items += 1
    db.commit()


async def decrease_user_tracked_items(db: Session, user_id: int) -> None:
    user = db.query(UserModel).get(user_id)
    user.tracked_items -= 1
    db.commit()


async def update_password(db: Session, user_id: int, new_password: str) -> None:
    hashed_password = hash_password(new_password)
    user = db.query(UserModel).get(user_id)
    user.password = hashed_password
    db.commit()


async def activate_account(db: Session, token: str) -> UserModel | None:
    user = db.query(UserModel).filter(UserModel.activation_token == token).first()
    if user:
        user.activation_token = None
        user.activated = True
        db.commit()
        return user


async def create_password_reset_token(db: Session, user_id: int) -> str:
    password_reset_token = token_urlsafe(32)
    user = db.query(UserModel).get(user_id)
    user.password_reset_token = password_reset_token
    db.commit()
    return password_reset_token


async def verify_password_reset_token(db: Session, token: str) -> UserModel | None:
    user = db.query(UserModel).filter(UserModel.password_reset_token == token).first()
    if user:
        user.password_reset_token = None
        db.commit()
        return user


async def check_if_user_already_exist(db: Session, username: str, email: str) -> tuple[bool, str | None]:
    user = await read_user_by_username(db, username)
    if user:
        return (True, "User with this username already exist.")
    user = await read_user_by_email(db, email)
    if user:
        return (True, "User with this email already exist.")
    return (False,)


async def update_email_notifications(db: Session, user_id: int, email_notifications: bool) -> None:
    user = db.query(UserModel).get(user_id)
    user.email_notifications = email_notifications
    db.commit()
