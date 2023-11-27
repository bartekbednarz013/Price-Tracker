from apscheduler.schedulers.asyncio import AsyncIOScheduler
from crud.item import update_price, get_urls_of_tracked_items
from scraping.scrapers import get_scraper
from database.config import SessionLocal
from postman import send_mail
from functions import get_expected_price_reached_notification_template, get_price_dropped_notification_template
from settings import U_HOUR, U_MINUTE


async def update_tracked_items():
    db = SessionLocal()
    urls = await get_urls_of_tracked_items(db)
    db.close()
    for url in urls:
        scraper = get_scraper(url)
        try:
            result = await scraper(url, price_only=True)
        except:
            continue
        new_price = result["price"]
        for item in urls[url]["items"]:
            if new_price == item["price"]:
                continue
            db = SessionLocal()
            await update_price(db, item["id"], new_price)
            db.close()
            if not item["email_notifications"]:
                continue
            if not item["expected_price"] and new_price < item["price"]:
                mail_content = get_price_dropped_notification_template(item["name"], url)
                send_mail(item["user_email"], "Price of your item just dropped!", mail_content)
            elif new_price <= item["expected_price"]:
                mail_content = get_expected_price_reached_notification_template(item["name"], url)
                send_mail(item["user_email"], "Your item reached expected price!", mail_content)


scheduler = AsyncIOScheduler()
scheduler.add_job(update_tracked_items, "cron", hour=U_HOUR, minute=U_MINUTE)
