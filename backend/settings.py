from decouple import config

FRONTEND_HOSTNAME = "http://localhost:3000"
BACKEND_HOSTNAME = "http://127.0.0.1:8000"

ACCESS_TOKEN_EXPIRE = 1  # hour
JWT_ALGORITHM = "HS256"
SECRET_KEY = config("SECRET_KEY")

MAX_TRACKED_ITEMS = 5

GMAIL_ADDRESS = "mypricetracker2023@gmail.com"
GMAIL_APP_PASSWORD = config("GMAIL_APP_PASSWORD")
