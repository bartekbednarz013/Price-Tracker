from decouple import config

FRONTEND_HOSTNAME = "http://localhost:3000"
BACKEND_HOSTNAME = "http://127.0.0.1:8000"

ACCESS_TOKEN_EXPIRE = 24  # hour
JWT_ALGORITHM = "HS256"
SECRET_KEY = config("SECRET_KEY")

MAX_TRACKED_ITEMS = 5

# time of scheduled price updates
U_HOUR = 3
U_MINUTE = 00

GMAIL_NAME = "Price Tracker"
GMAIL_ADDRESS = config("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = config("GMAIL_APP_PASSWORD")
