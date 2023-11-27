# MakeMasterDataFromJSON

These jsons were provided from blue_shared_api's `GET /api/oz/players/chapters/{chapter_name}/magic_circles`
See: https://api.codeillusion.io/swagger-ui.html#/OZ%20Player%20Magic%20Circle/getMagicCirclesUsingGET

## Run

Please redirect stdout to any file you want

```
npx ts-node scripts/retrieve-lesson-data-from-json/retrieve-lesson-data-from-json.ts > scripts/retrieve-lesson-data-from-json/result.tsv
```

## Tools

- To convert json to JavaScript Literal, I used this:
  - https://dataformat.net/json/converter/to-javascript
