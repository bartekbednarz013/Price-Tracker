from selenium.webdriver.common.by import By
from pydantic import HttpUrl
from .drivers import get_driver, get_headless_driver, get_soup
from schemas.scraper import ScraperOutputSchema, ScraperPriceOutputSchema


class MyList(list):
    def __eq__(self, value: object) -> bool:
        return self.__contains__(value)


def get_scraper(url: HttpUrl):
    match MyList(str(url).split(".")):
        case "zara":
            # return await zara(url)
            return zara
        case "mango":
            return mango
        case "hm":
            return hm
        case "reserved":
            return reserved
        case "noszesztuke":
            return noszesztuke
        case _:
            return None


async def mango_base(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price = float(driver.find_element(By.XPATH, '//meta[@itemprop="price"]').get_attribute("content"))
    result = {"price": price}
    if not price_only:
        item_name = str(driver.find_element(By.XPATH, '//h1[@itemprop="name"]').get_attribute("innerHTML"))
        currency = driver.find_element(By.XPATH, '//meta[@itemprop="priceCurrency"]').get_attribute("content")
        result.update({"name": item_name, "shop": "Mango", "currency": currency})
    driver.close()
    return result


async def mango(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    try:
        result = await mango_base(url, price_only)
    except:
        result = await mango_base(url, price_only)
    if result:
        return result


async def zara(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price_string = driver.find_element(By.CLASS_NAME, "money-amount__main").get_attribute("innerHTML")
    price = float(price_string[:-4].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = str(
            driver.find_element(By.CLASS_NAME, "product-detail-info__header-name").get_attribute("innerHTML")
        )
        currency = price_string[-3:]
        result.update({"name": item_name, "shop": "Zara", "currency": currency})
    driver.close()
    return result


async def hm(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_driver(url)
    product_price = driver.find_element(By.ID, "product-price")
    price_string = product_price.find_element(By.XPATH, "*/*").get_attribute("innerHTML")
    price = float(price_string[:-4].replace(",", "."))
    result = {"price": price}
    if not price_only:
        product_name = driver.find_element(By.TAG_NAME, "hm-product-name")
        item_name = product_name.find_element(By.XPATH, "*/*").get_attribute("innerHTML")
        currency = price_string[-3:]
        result.update({"name": item_name, "shop": "H&M", "currency": currency})
    driver.close()
    return result


async def reserved(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price = float(driver.find_element(By.CLASS_NAME, "basic-price").get_attribute("innerHTML")[:5].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = str(driver.find_element(By.CLASS_NAME, "product-name").get_attribute("innerHTML"))
        currency = driver.find_element(By.CLASS_NAME, "currency").get_attribute("innerHTML")
        result.update({"name": item_name, "shop": "Reserved", "currency": currency})
    driver.close()
    return result


async def noszesztuke(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    soup = get_soup(url)
    price_string = soup.find("em", {"class": "main-price"}).next
    price = float(price_string[:-3].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = url.removeprefix("https://noszesztuke.com/pl/p/")
        item_name = item_name[: (item_name.find("/"))]
        currency = "PLN"
        result.update({"name": item_name, "shop": "noszesztuke", "currency": currency})
    return result


# skims
