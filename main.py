from fastapi import FastAPI
from routers.user import router as user_router
from routers.auth import router as auth_router
from routers.item import router as item_router
from routers.scraper import router as scrapper_router


app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(item_router)
app.include_router(scrapper_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Price Tracker! Check out available endpoints.",
        "endpoints": "Here will be the list of endpoints",
    }
