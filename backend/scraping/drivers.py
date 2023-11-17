from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from lxml import etree


def get_headless_driver(url: str) -> webdriver:
    user_agent = (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36"
    )
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--headless")
    options.add_argument(f"user-agent={user_agent}")
    options.add_argument("--start-maximized")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-extensions")
    options.add_argument("--ignore-certificate-errors")

    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(2)
    driver.get(url)
    return driver


def get_driver(url: str) -> webdriver:
    driver = webdriver.Chrome()
    driver.get(url)
    return driver


def get_soup(url: str) -> BeautifulSoup:
    res = requests.get(url)
    soup = BeautifulSoup(res.content, "html.parser")
    return soup


def get_etree(url: str):
    res = requests.get(url)
    return etree.HTML(res.content)
