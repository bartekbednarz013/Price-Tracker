from pydantic import BaseModel, AnyUrl


class ItemCreateSchema(BaseModel):
    name: str
    shop: str
    url: str
    price: float
    expected_price: float | None = None 
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
