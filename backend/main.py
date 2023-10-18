from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user import router as user_router
from routers.auth import router as auth_router
from routers.item import router as item_router
from routers.scraper import router as scrapper_router
from scheduler import scheduler


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(item_router)
app.include_router(scrapper_router)


@app.on_event("startup")
async def startup():
    scheduler.start()


@app.get("/")
def root():
    return {
        "message": "Welcome to Price Tracker! Check out available endpoints.",
        "endpoints": "Here will be the list of endpoints",
    }
