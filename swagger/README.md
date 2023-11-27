# Swagger (Open API 3.0)

This is the definitions of APIs' schema

## Set up editor environments

### Launch swagger-editor, swagger-ui, swagger-mock-server

```
npm run start:swagger
```

This command will generate API files under `src/adapter/entry-points/_gen/` in advance of launching services, because `stoplight/prism` can not read separeted yaml definitions.

- swagger-ui => localhost:10081
- swagger-mock-server => localhost:10082
  - this utilizes stoplight/prism

## Misc.

#### Utilities

- [Swagger Definition Objects Generator](https://roger13.github.io/SwagDefGen/)
  - If you want to make definition schema from "example json", this would be useful.
