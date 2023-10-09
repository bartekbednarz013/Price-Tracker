from sqlalchemy.orm import Session
from database.models import UserModel
from schemas.user import UserCreateSchema
from schemas.auth import ChangePasswordSchema
from functions import verify_password, hash_password


def create_user(db: Session, user: UserCreateSchema) -> UserModel:
    hashed_password = hash_password(user.password)
    user_instance = UserModel(username=user.username, email=user.email, password=hashed_password)
    db.add(user_instance)
    db.commit()
    db.refresh(user_instance)
    return user_instance


def read_user_by_id(db: Session, user_id: int) -> UserModel:
    return db.query(UserModel).get(user_id)


def read_user_by_username(db: Session, username: str) -> UserModel:
    return db.query(UserModel).filter(UserModel.username == username).first()


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
        return {False, "User not found"}
    if not verify_password(password, user.password):
        return (False, "Wrong password")
    return (user, "Successfully authenticated")


async def increase_user_tracked_items(db: Session, user_id: int):
    user = db.query(UserModel).get(user_id)
    user.tracked_items += 1
    db.commit()


async def decrease_user_tracked_items(db: Session, user_id: int):
    user = db.query(UserModel).get(user_id)
    user.tracked_items -= 1
    db.commit()


def set_new_password(db:Session, user_id: int, new_password: str):
    hashed_password = hash_password(new_password)
    user = db.query(UserModel).get(user_id)
    user.password = hashed_password
    db.commit()
    return user
