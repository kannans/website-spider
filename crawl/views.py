from django.shortcuts import render
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

import requests
import json
from bs4 import BeautifulSoup
from django.http import JsonResponse, HttpResponse

def index(request):
    return render(request, 'crawl/index.html')

def grabit(request):
    url = request.GET['url']
    depth = request.GET['depth']
    if url_validator(url):
        data = web(1, url, depth)
    else:
        data = { 'page_urls': [], 'images': [] }

    json_data = json.dumps(data)
    return HttpResponse(json_data, content_type='application/json')

def web(page, WebUrl, depth):
    if(page>0):
        url = WebUrl
        code = requests.get(url)
        plain = code.text
        beautiful_soup = BeautifulSoup(plain, "html.parser")

        data = {
            'page_urls': get_links(beautiful_soup, depth),
            'images': get_images(beautiful_soup, depth)
        }
        return data

def get_images(html_code, depth):
    images = []
    image_node = depth + " img"
    for link in html_code.select(image_node):
        image_url = link.get('src')
        if url_validator(image_url):
            images.append(image_url)
    return images

def get_links(html_code, depth):
    urls = []
    link_node = depth + " a"
    for link in html_code.select(link_node):
        hrefs = link.get('href')
        if url_validator(hrefs):
            urls.append(hrefs)
    return urls

def url_validator(urlString):
    if(urlString):
        try:
            validate = URLValidator(schemes=('http', 'https', 'ftp', 'ftps', 'rtsp', 'rtmp'))
            validate(urlString)
            return True
        except ValidationError:
            print('Not a valid URL')
            return False