# CodeX USA Backend

Backend for CodeX(Lesson Management System for Teachers)

## Setup

#### 1. install n (node version manager)

https://github.com/tj/n

#### specify node version from package.json

```
n engine
```

#### 2. install npm modules

```
npm i
```

#### 3. install VSCode Extensions

Please install all of "RECOMMENDED" extensions

- Prettier - Code formatter

## Policies for development

Please refer the following articles

- [Recommended development steps to follow the Clean Architecture](https://lifeistech-usa.atlassian.net/wiki/spaces/DKB/pages/4063233/Backend+Recommended+development+steps+to+follow+the+Clean+Architecture)
- [Error handling style guide](https://lifeistech-usa.atlassian.net/wiki/spaces/DKB/pages/3866678/Backend+Error+handling+style+guide)

---

## Set up related services in one place with docker-compose

Checkout and see [codex_usa_infrastructure](https://github.com/lifeistech/codex_usa_infrastructure) reporitory

---

## Setup local environment database

- **Note:** if you not setup the project with codex_usa_infrastructure and you will only run the codex_usa_backend project then you need to follow this step.
- For more detail review: `env/local-db/README.md`

  ##### run db container by docker-compose

  ```
  $ npm run start:db
  ```

## Start Local Server on Docker Container

#### 1. make sure that docker is installed

```
$ docker --version
Docker version 20.10.11, build dea9396e18
```

If not, see: https://docs.docker.com/get-docker/

#### 2. run docker container for setup the only codex_usa_backend project

##### create .env from sample.env

- Create .env file if not exist as per sample.env
- Need to set below variable in .env file as per below

##### run app container

```
// another shell process open and execute
$ npm run start:db
$ npm start
$ curl http://0.0.0.0:3000/
{"message":"Hello World!"}
```

- The root directory of this repository is mounted in the container's /app directory.
- **Hot reloading is enabled** so that changes made to the host source code are automatically reflected.

#### 3. stop docker container

```
npm stop
```

## Generate CodeX API definitions from Swagger YAMLs

```
npm run gen:api # for codex APIs
```

#### Swagger UI & Mock Server

See [README for swagger tools](./swagger/README.md)

#### Tools for code gen

- Type Definition
  - dtsgenerator
- express adapters
  - Used `openapi-generator-cli generate -g nodejs-express-server`

## Generate Clever API definitions from Swagger YAMLs

```
npm run gen:cleverapi
```

## Run Github Actions on your local

#### install `act`

Follow this: https://github.com/nektos/act#installation

```
act -l # list the workflows
act -n # dry run
act # run actual workflows
```

## Run unit tests

This will run **only the unit tests**

```
npm test
```

## Run API e2e tests

This will run **all the e2e tests**

```
npm run test:e2e
```

You can run specific test like below (**with underscore**)

```
npm run _test:serially test/api-e2e/scenarios/GetPlayerSettingsFromLessonPlayer.test.ts
```

### Setup API E2E test environment manually

```
npm run start:e2e
npm run stop:e2e
```
