# FestivalPOS - Backend

## Development

Steps to start the backend server:

1. Install node
2. `npm install`
3. Start local Postgres for example using Docker:
   `docker run --restart-always --name postgres -v pgdata:/var/lib/postgresql/data -p 5432:5432 -d -e POSTGRES_PASSWORD="setYourPw" -e POSTGRES_USER="postgres" postgres:latest`
4. Setup environment variables (.env):

```bash
DATABASE_URL=postgres://postgres:setYourPw@localhost:5432/postgres
PORT=3000

ADMIN_APP_HOST=localhost
ADMIN_APP_PORT=5173
JWT_SECRET=SomeRandomJWTString
```

4. Run `npm run typeorm:migrate`
5. Start dev server with `npm run dev`

Now you can visit [`localhost:3000`](http://localhost:3000) and should get a welcome JSON.

### Generate migrations

`npm run typeorm:generate -- ./src/migrations/CreateUser`
