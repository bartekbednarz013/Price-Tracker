from sqlalchemy import Column, ForeignKey, Integer, Float, String, DateTime, Boolean
from sqlalchemy_utils import EmailType, URLType
from sqlalchemy.orm import relationship
from .config import Base, engine
from datetime import datetime


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(EmailType, unique=True)
    username = Column(String, unique=True)
    password = Column(String)
    activated = Column(Boolean, default=False)
    activation_token = Column(String, nullable=True)
    password_reset_token = Column(String, nullable=True, default=None)
    tracked_items = Column(Integer, default=0)
    items = relationship("ItemModel", back_populates="user", cascade="all,delete")


class ItemModel(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    shop = Column(String)
    url = Column(URLType)
    price = Column(Float)
    previous_price = Column(Float, nullable=True)
    expected_price = Column(Float, nullable=True)
    currency = Column(String)
    tracked = Column(Boolean)
    added_at = Column(DateTime(timezone=True), default=datetime.now)
    last_update = Column(DateTime(timezone=True), nullable=True, default=None, onupdate=datetime.now)
    user = relationship("UserModel", back_populates="items")


Base.metadata.create_all(engine)
