# Тестовое задание

Тестовое задание для AMD GROUP.

Ссылка на тестовое: https://docs.google.com/document/d/18VNG1Op0NlpWV-LFQZShppwnCxNtUmNkq8oGxUEsHPo/edit

## Установка

```
docker-compose up
```

После чего весь сервис будет доступен по http://127.0.0.1:3000

P.S: env файл закомитил, так как в нем нет ничего супер тайного

## Endpoints

Получение валютной пары по их соотношению друг к другу

```
curl --location 'http://127.0.0.1:3000/currency?from=RUB&to=JPY'
```

Получение всех валютных пар за определенный день 

```
curl --location 'http://127.0.0.1:3000/currency/by-timestamp?timestamp=2024-03-13T04%3A05%3A49.912Z'
```

## Дополнительно

Курсы обновляются по крону 

```
0 0 * * *
```

CORS включен
