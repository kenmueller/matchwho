import { Router } from 'express'
import CODE_LENGTH from './code.js'

import HttpsError from '../error/https.js'
import sendError from '../error/send.js'
import Game from './index.js'

const router = Router()

router.get('/games/:code', (req, res) => {
	try {
		const { code } = req.params

		if (code.length !== CODE_LENGTH)
			throw new HttpsError(400, `Game codes must be ${CODE_LENGTH} characters`)

		if (!Object.prototype.hasOwnProperty.call(Game.games, code))
			throw new HttpsError(404, 'This game does not exist')

		res.send()
	} catch (error) {
		sendError(res, error)
	}
})

export default router
