from django.shortcuts import render
import requests
import json
from bs4 import BeautifulSoup
from django.http import JsonResponse, HttpResponse

def index(request):
    return render(request, 'crawl/index.html')

def grabit(request):
    url = request.GET['url']
    depth = request.GET['depth']
    data = web(1, url, depth)
    json_data = json.dumps(data)
    return HttpResponse(json_data, content_type='application/json')

def web(page, WebUrl, depth):
    if(page>0):
        url = WebUrl
        code = requests.get(url)
        plain = code.text
        beautiful_soup = BeautifulSoup(plain, "html.parser")

        data = {
            'page_urls': get_links(beautiful_soup),
            'images': get_images(beautiful_soup)
        }
        return data
def get_images(html_code):
    images = []
    for link in html_code.findAll('img'):
        image_url = link.get('src')
        images.append(image_url)
    return images

def get_links(html_code):
    urls = []
    for link in html_code.findAll('a'):
        hrefs = link.get('href')
        urls.append(hrefs)
    return urls