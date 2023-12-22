#!/usr/bin/env python
# -*- coding:utf-8 -*-
import json
import random
import time

import requests


def http_post_ai():
    headers = {
        'Content-Type': 'application/json',
        'authorization': 'Bearer sk-SKmGc3eQ9a1jC9uLxGHqtidBZV2og8VITdhyrBjeLk9221oE'
    }

    params = {}

    data = {
        'model': 'gpt-3.5-turbo',
        'messages': [
            {
                'role': 'user',
                'content': '写一篇软文，其中第一句为标题，介绍恋厅是一款支持微信、支付宝和小程序的 SAAS 点餐软件，中小客户可以免费使用。'
                           '请对核心功能中扫码点餐、排队叫号、在线预订、微信外卖、后厨打印、餐饮收银任选一个方向为题材重点介绍。'
            }
        ],
        'temperature': 0.7
    }

    response = requests.post('https://api.chatanywhere.com.cn/v1/chat/completions', headers=headers, params=params,
                             data=json.dumps(data))

    j = json.loads(response.text)

    if j['object'] == 'chat.completion':
        content = j['choices'][0]['message']['content']

        cut = content.find('\n')
        title = content[0:cut]
        content = content[cut + 2:]

        http_post_news(title, content)


def http_post_news(title, content):
    print('title=' + title)
    print('content=' + content)

    headers = {
        # 2023-12-21 15120009590 一个月后过期
        'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0b2tlbiIsImlhdCI6MTcwMzE2MDI2OCwiZXhwIjoxNzM0Njk2MjY4LCJqdGkiOiIxZTg5ZTNjYjVhOGE0NWY5OWI3YTczMGEzMjc3ZDRkOCIsImxvZ2luVHlwZSI6IlBob25lIiwiY2xpZW50SXAiOiI2MC4xOTAuMTcyLjU4Iiwic2hvcElkIjoidW5kZWZpbmVkIiwicGhvbmUiOiIxNTEyMDAwOTU5MCIsIndlY2hhdE9wZW5JZCI6Im9adndRMXVKZTRhVkFXclRuNGtrREZLcTZkMmciLCJzaG9wV2VjaGF0T3BlbklkIjoib1p2d1ExdUplNGFWQVdyVG40a2tERktxNmQyZyIsImFsaXBheU9wZW5JZCI6bnVsbH0.6lJTW81NqNToSbwoL7h-DSA2etRc7aTbXmHUtOYQCLU',
        'Content-Type': 'application/json'
    }

    params = {}

    hash_key = time.strftime('%Y%m%d%H%M%S', time.localtime())

    data = {
        'magicId': 'honeysense',
        'type': 'IndustryNews',
        'hashKey': hash_key,
        'shortcut': '',
        'title': title,
        'content': content,
        'referName': '恋厅资讯',
        'referUrl': 'https://www.lianting.store/news/' + hash_key,
        'referDate': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()),
        'keywords': '恋厅,点餐系统,扫码点餐,小程序点餐,收银系统'
    }

    response = requests.post('https://www.lianting.store/api/news', headers=headers, params=params,
                             data=json.dumps(data))
    print(response.text)


if __name__ == '__main__':
    while True:
        http_post_ai()
        # 第一篇文章 1.5 到 3 小时
        r = random.uniform(1.5 * 60 * 60, 3 * 60 * 60)
        time.sleep(r)
