import { createApp } from '../express/app'
import morganBody from 'morgan-body'

const main = async () => {
  try {
    const app = await createApp()

    app.listen(3000)
    morganBody(app, {
      noColors: true,
      prettify: false,
      maxBodyLength: 999999,
      logResponseBody: true,
      skip: (req, res) => {
        return req.path === '/'
      },
    })
    console.log('express server listening port 3000')
  } catch (e) {
    console.error(`failed to launch express server ${e}`)
  }
}

main()
