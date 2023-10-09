from pydantic import BaseModel, HttpUrl


class ScraperInputSchema(BaseModel):
    # url: HttpUrl
    url: str


class ScraperOutputSchema(BaseModel):
    url: str
    name: str
    shop: str
    price: float
    currency: str


class ScraperPriceOutputSchema(BaseModel):
    price: float
