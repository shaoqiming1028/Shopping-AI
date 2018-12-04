import re
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
# WebDriverWait 库，负责循环等待
from selenium.webdriver.support.ui import WebDriverWait
# expected_conditions 类，负责条件出发
from selenium.webdriver.support import expected_conditions as EC
from pyquery import PyQuery as pq
from lxml import  etree
from selenium.webdriver.chrome.options import Options
import time
import requests
#不让浏览器展示出来
# chrome_options = Options()
# chrome_options.add_argument("--headless")  # define headless
browser = webdriver.Chrome()
wait = WebDriverWait(browser, 20)

# pattern = re.compile('pageNumber=(\d)')
browser.set_window_size(1400, 700)
browser.get('https://www.woolworths.com.au/Shop/Browse/meat-seafood-deli/meat/beef-veal')

#  # 参数里要写browser
# # 简化wait 调用
back = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.browseLeftPanel-headingLink')))
back.click()
show_all = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.categoriesNavigation-linkShowall')))
show_all.click()

wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.shelfProductTile-descriptionLink')))
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.shelfProductTile-image')))
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.price-dollars')))
js = "var q=document.documentElement.scrollTop=100000"
browser.execute_script(js)
time.sleep(2)
selector = pq(browser.page_source)
next_page = selector('.paging-next._pagingNext').attr('href')
next_url = 'https://www.woolworths.com.au/' + next_page
print(next_url)

# page = selector('.pagination .page-number a').items()
# if page:
#     for p in page:
#         count = p('.number').text()
#         print(count)
#         url = pattern.sub('pageNumber='+count,browser.current_url)
#         print(url)
# products = selector('.colrs-animate.tile-animate').items()
# for product in products:
#     name = product('.product-image img').attr('alt')
#     if not name:
#         continue
#     image = product('.product-image img').attr('src')
#     qty = product('.product-qty').text().strip()
#     text = product('.product-text').text().strip()
#     price = product('.product-price').text().strip()
#     if qty != '1':
#         price = qty + text + price
#     print(price)

