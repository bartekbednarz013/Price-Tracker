from selenium.webdriver.common.by import By
from pydantic import HttpUrl
from .drivers import get_driver, get_headless_driver, get_soup, get_etree
from schemas.scraper import ScraperOutputSchema, ScraperPriceOutputSchema


class MyList(list):
    def __eq__(self, value: object) -> bool:
        return self.__contains__(value)


def get_scraper(url: HttpUrl):
    url = url[str(url).find("//") + 2 :]
    match MyList(url.split(".")):
        case "zara":
            return zara
        case "mango":
            return mango
        case "hm":
            return hm
        case "reserved":
            return reserved
        case "noszesztuke":
            return noszesztuke
        case "factcool":
            return factcool
        case "bossino":
            return bossino
        case "triplesofficial":
            return triples
        case "hibou":
            return hibou
        case "marsala-butik":
            return marsala
        case "camelie":
            return camelie
        case "zalando":
            return zalando
        case "massimodutti":
            return massimo_dutti
        case "skims":
            return skims
        case "alohas":
            return alohas
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
    price_string = driver.find_element(By.CLASS_NAME, "basic-price").get_attribute("innerHTML")
    index = price_string.index("&nbsp")
    price = float(price_string[:index].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = str(driver.find_element(By.XPATH, "//h1[@data-testid='product-name']").get_attribute("innerHTML"))
        currency = driver.find_element(By.CLASS_NAME, "currency").get_attribute("innerHTML")
        result.update({"name": item_name, "shop": "Reserved", "currency": currency})
    driver.close()
    return result


async def noszesztuke(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price_string = driver.find_elements(
        By.XPATH,
        "//div[@class='woocommerce-variation-price']//span[@class='woocommerce-Price-amount amount']//bdi",
    )[-1].get_attribute("innerText")
    price = float(price_string[:-3].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = driver.find_element(By.CLASS_NAME, "product_title").get_attribute("innerHTML")
        currency = "PLN"
        result.update({"name": item_name, "shop": "noszesztuke", "currency": currency})
    driver.close()
    return result


factcool_country_currency_dict = {
    "be": "EUR",
    "ba": "BAM",
    "cs": "CZK",
    "dk": "EUR",
    "de": "EUR",
    "ee": "EUR",
    "es": "EUR",
    "fr": "EUR",
    "en": "GBP",
    "hr": "EUR",
    "it": "EUR",
    "lv": "EUR",
    "lt": "EUR",
    "hu": "HUF",
    "nl": "EUR",
    "at": "EUR",
    "pl": "PLN",
    "pt": "EUR",
    "ro": "RON",
    "si": "EUR",
    "sk": "EUR",
    "dk": "EUR",
    "fi": "EUR",
    "se": "EUR",
    "gr": "EUR",
    "bg": "BGN",
    "rs": "RSD",
    "ua": "UAH",
}


async def factcool(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    soup = get_soup(url)
    price_string = soup.find("h2", {"class": "final-price"}).next
    price = float(price_string[:-2])
    result = {"price": price}
    if not price_only:
        item_name = soup.find("h2", {"data-cy": "productDetailTitle"}).text
        index = str(url).find("//") + 2
        lang_code = url[index : index + 2]
        currency = factcool_country_currency_dict[lang_code]
        result.update({"name": item_name, "shop": "factcool", "currency": currency})
    return result


async def bossino(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    dom = get_etree(url)
    price_string = dom.xpath("//span[@data-product-price]//span[@class='visually-hidden']")[0].text
    price = float(price_string[:-3].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = dom.xpath("//h1[@class='h2 product-single__title']")[0].text
        currency = "PLN"
        result.update({"name": item_name, "shop": "Bossino", "currency": currency})
    return result


async def triples(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price_string = driver.find_elements(
        By.XPATH,
        "//p[@class='price kwt-price-wrap kwt-price-_672e41-a9 kwt-price-single wp-block-kadence-wootemplate-blocks-price']//span[@class='woocommerce-Price-amount amount']//bdi",
    )[-1].get_attribute("innerText")
    price = float(price_string[:-2].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = driver.find_element(By.CLASS_NAME, "product_title").get_attribute("innerHTML")
        currency = "PLN"
        result.update({"name": item_name, "shop": "TRIPLÉS", "currency": currency})
    driver.close()
    return result


async def hibou(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    dom = get_etree(url)
    price_string = dom.xpath("//strong[@id='projector_price_value']//span")[0].text
    price = float(price_string[:-3].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = dom.xpath("//h1[@class='product_name__name m-0']")[0].text
        currency = "PLN"
        result.update({"name": item_name, "shop": "HIBOU", "currency": currency})
    return result


async def marsala(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    dom = get_etree(url)
    price = float(
        dom.xpath("//div[@class='price-container']//div[@class='final-price inline-block']//meta[@itemprop='price']")[
            0
        ].attrib["content"]
    )
    result = {"price": price}
    if not price_only:
        item_name = dom.xpath("//li[@class='item flex product']//a")[0].text
        currency = "PLN"
        result.update({"name": item_name, "shop": "MARSALA", "currency": currency})
    return result


async def camelie(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    soup = get_soup(url)
    price_string = soup.find("span", {"class": "price-item--last"}).text
    price = float(price_string.strip().replace(",", ".")[:-2])
    result = {"price": price}
    if not price_only:
        item_name = soup.find("h1", {"class": "product__title"}).text.strip()
        currency = "PLN"
        result.update({"name": item_name, "shop": "camelie", "currency": currency})
    return result


async def zalando(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    soup = get_soup(url)
    price_string = soup.find("div", {"class": "hD5J5m"}).find("span", {"class": "sDq_FX"}).text
    price = float(price_string.strip().replace(",", ".")[:-3])
    result = {"price": price}
    if not price_only:
        brand_name = soup.find("h3", {"class": "FtrEr_ QdlUSH FxZV-M HlZ_Tf _5Yd-hZ"}).text
        name = soup.find("span", {"class": "EKabf7 R_QwOV"}).text
        item_name = f"{brand_name} {name}"
        currency = "PLN"
        result.update({"name": item_name, "shop": "Zalando", "currency": currency})
    return result


async def massimo_dutti(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price_string = (
        driver.find_element(By.CLASS_NAME, "product-price")
        .find_elements(By.CLASS_NAME, "mb-8")[-1]
        .find_element(By.XPATH, "*")
        .get_attribute("innerText")
    )
    price = float(price_string[:-4].replace(",", "."))
    result = {"price": price}
    if not price_only:
        item_name = driver.find_element(By.ID, "productName").find_element(By.XPATH, "*").get_attribute("innerHTML")
        currency = price_string[-3:]
        result.update({"name": item_name, "shop": "Massimo Dutti", "currency": currency})
    driver.close()
    return result


async def skims(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    driver = get_headless_driver(url)
    price_string = driver.find_element(
        By.XPATH, "//div[@class='hidden lg:block']//span[@class='whitespace-nowrap']"
    ).get_attribute("innerText")
    price = float("".join(filter(str.isdigit, price_string)))
    result = {"price": price}
    if not price_only:
        item_name = driver.find_element(
            By.XPATH, "//div[@class='hidden lg:block']//h1[@class='text-brown-1 text-[20px] mb-0 lg:text-[24px]']"
        ).get_attribute("innerText")
        currency = "USD"
        result.update({"name": item_name, "shop": "SKIMS", "currency": currency})
    driver.close()
    return result


async def alohas(url: HttpUrl, price_only: bool = False) -> ScraperOutputSchema | ScraperPriceOutputSchema:
    dom = get_etree(url)
    price_string = dom.xpath("//div[@class='grid product__page']//span[@data-product-price='']")[0].text
    price = float(price_string.strip().replace(",", ".")[3:])
    result = {"price": price}
    if not price_only:
        item_name = dom.xpath("//div[@class='grid product__page']//h1[@class='product__title']")[0].text.strip()
        currency = "EUR"
        result.update({"name": item_name, "shop": "ALOHAS", "currency": currency})
    return result
