# Local Database

This component is the main application database (PostgreSQL). Currently PostgreSQL v13.4

**Note:**

- If you only need to setup the `codex_usa_backend` project without using `codex_usa_infrastructure` then you require to setup the database as per following.
- If you setup the project with `codex_usa_infrastructure` document then you don't need to setup the database.

## Setup

Run

```
npm run start:db
```

## Stop

Run

```
npm run stop:db
```

# After Start Database Details

## Access database

To access the database:

1. In a new terminal run the command `docker ps` to get a list of containers.
2. Note the ID for the `codex_usa_backend_db` container.
3. Enter the following command to access the PostgreSQL container: `docker exec -it CONTAINER_ID /bin/bash`.
4. Run `psql -U codex codex` to access the database. This command needs to be run from within the PostgreSQL container - it won't work when run from the host machine.

Basic PostgreSQL commands:

- `$ codex=# \d` retrieve the list of tables
- `$ codex=# \d <table name>` retrieve the table schema

## Import a database dump

You may need to import a database dump:

1. Place the SQL dump into the `pgdata` directory.
2. Login to the container (follow steps 1-3 above, but not 4).
3. Delete the current database by running `dropdb 'codex' -U codex`
4. Create an empty database of the same name with `createdb 'codex' -U codex`
5. Import the sql dump with `psql -U codex codex < /var/lib/postgresql/data/NAME_OF_DATABASE_DUMP.sql`

The `applicationModel/pgdata` directory on the host is mapped to the `/var/lib/postgresql/data` directory in the container.

## Backup the database

1. Login to the container.
2. Execute: `pg_dump -x -O --if-exists -c -U codex codex > /var/lib/postgresql/data/dump.sql`
3. Find the dump at `applicationModel/pgdata/dump.sql`.
