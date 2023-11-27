## Utlization for ClasslinkAPI Request Method

> For AppId, AccessToken we will retrive from database stored against district tablex

```
import * as https from 'https'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

let resultClassLinkAPI = await classlinkApiRequest({
  url: '/ims/oneroster/v1p1/orgs',
  method: 'get',
  appId,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  queryParams: {
    filter: "type='district'",
  },
  httpsAgent: agent,
})
```
