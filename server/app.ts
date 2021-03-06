import compression from 'compression'

import DEV from './dev.js'
import { app } from './root.js'

import security from './security.js'
import createGame from './game/create.js'
import gameExists from './game/exists.js'
import gamePage from './game/page.js'
import gameMeta from './game/meta.js'
import './game/stream.js'

if (!DEV) app.use(compression({ threshold: 0 }))

app.use(security)
app.use(createGame)
app.use(gameExists)
app.use(gamePage)
app.use(gameMeta)

export default app
