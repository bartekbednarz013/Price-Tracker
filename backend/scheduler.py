from apscheduler.schedulers.asyncio import AsyncIOScheduler
from crud.item import read_all_tracked_items, update_price
from crud.user import read_user_by_id
from scraping.scrapers import get_scraper
from database.config import SessionLocal
from postman import send_mail
from functions import get_expected_price_reached_notification_template
from settings import U_HOUR, U_MINUTE


async def update_tracked_items():
    db = SessionLocal()
    items = await read_all_tracked_items(db)
    db.close()
    for item in items:
        scraper = get_scraper(item.url)
        try:
            result = await scraper(item.url, price_only=True)
        except:
            continue
        current_price = result["price"]
        if current_price != item.price:
            db = SessionLocal()
            await update_price(db, item.id, current_price)
            if current_price <= item.expected_price:
                user = read_user_by_id(db, item.user_id)
                mail_content = get_expected_price_reached_notification_template(item.name, item.url)
                send_mail(user.email, "Your item reached expected price!", mail_content)
            db.close()


scheduler = AsyncIOScheduler()
scheduler.add_job(update_tracked_items, "cron", hour=U_HOUR, minute=U_MINUTE)
