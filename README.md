# PokemonGokikkare
Lets play Pokemon!


## Server setup:
### ENV_VARS:
- PORT = port
- VAIHTO_DATABASE_URL = postgres://<db_owner_username>:<db_owner_psql_password>@localhost:5432/vaihto

### Installation:

- `cd server`
- `npm install`
- `createdb vaihto` needs psql
- `psql vaihto < init_db.sql`
- `npm start`
