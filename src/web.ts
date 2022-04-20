// Dummy process for Heroku
// https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error

import * as http from 'http'
import { IncomingMessage } from 'http'

const host = 'localhost'
const port: number = (process.env.PORT as unknown as number) || 5000

const requestListener = function (req: IncomingMessage, res: any) {
  console.log(req.url)
  res.writeHead(200)
  res.end()
}

const server = http.createServer(requestListener)

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
