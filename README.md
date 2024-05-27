# FestivalPOS - Backend

## Development

Steps to start the backend server:

1. Install node
2. `npm install`
3. Start local Postgres for example using Docker:
`docker run --restart-always --name postgres -v pgdata:/var/lib/postgresql/data -p 5432:5432 -d -e POSTGRES_PASSWORD="setYourPw" -e POSTGRES_USER="postgres" postgres:latest`
3. Setup environment variables (.env):

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=setYourPassword
DB_NAME=postgres


APP_HOST=localhost
PORT=8080
JWT_SECRET=someJWTSecretRandomString
```

4. Run `npm run typeorm:migrate`
5. Start dev server with `npm run dev`

Now you can visit [`localhost:3000`](http://localhost:3000) and should get a wellcome JSON.

### Generate migrations
`npm run typeorm:generate -- ./src/migrations/CreateUser`