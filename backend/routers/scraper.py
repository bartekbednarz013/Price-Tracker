from fastapi import APIRouter, HTTPException, status
from scraping.scrapers import get_scraper
from schemas.scraper import ScraperOutputSchema, ScraperInputSchema, ScraperPriceOutputSchema

router = APIRouter(prefix="/scraper", tags=["scraper"])


@router.post("", response_model=ScraperOutputSchema)
async def scrap_online_shop(url: ScraperInputSchema):
    scraper = get_scraper(url.url)
    if not scraper:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This shop is not supported.")
    try:
        item = await scraper(url.url)
        item["url"] = url.url
        return item
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem with scraper occured. Try again.")


@router.post("/check_price", response_model=ScraperPriceOutputSchema)
async def scrap_price(url: ScraperInputSchema):
    scraper = get_scraper(url.url)
    if not scraper:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This shop is not supported.")
    try:
        item = await scraper(url.url, price_only=True)
        return item
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem with scraper occured.")
