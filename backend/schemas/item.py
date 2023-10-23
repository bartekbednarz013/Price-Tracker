from pydantic import BaseModel, Field


class ItemCreateSchema(BaseModel):
    name: str
    shop: str
    url: str
    price: float = Field(ge=0)
    expected_price: float | None = Field(default=None, ge=0)
    currency: str
    tracked: bool


class ItemSchema(BaseModel):
    id: int
    user_id: int
    name: str
    shop: str
    url: str
    price: float
    previous_price: float | None
    expected_price: float | None
    currency: str
    tracked: bool

    class Config:
        from_attributes = True


class AddItemResponseSchema(BaseModel):
    notification: dict
    item: ItemSchema
