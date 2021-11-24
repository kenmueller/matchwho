import { Router } from 'express'

import sendError from '../error/send.js'
import Game from './index.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const router = Router()

router.post('/games', (_req, res) => {
	try {
		res.send(log('Created game on request', new Game().code))
	} catch (error) {
		sendError(res, logError('Attempted to create game', error))
	}
})

export default router
