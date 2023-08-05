# Trivago Authentication - API

Live: https://trivago.gangoo.eu

API: https://api-trivago.gangoo.eu


# Tech Stack:
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### .env file setup

1. Start by making a copy of .env.example in the same directory and rename it to just .env
2. For instance, you might have variables like API_KEY, SECRET_KEY, or DATABASE_URL. Ensure that you provide the correct values for these variables to avoid any issues later.

## Project setup

Install dependencies

```bash
  npm install
```

Start server

```bash
  npm start
```


## DB setup

Generate Prisma Client

```bash
  npx prisma generate
```

Create and apply a new migration

```bash
  npx prisma migrate dev
```

Open visual editor for the data in your database

```bash
  npx prisma studio
```
