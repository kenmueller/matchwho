import alertError from './alert'
import HttpError from './http'

const errorFromResponse = async (response: Response) => {
	try {
		return new HttpError(response.status, await response.text())
	} catch (error) {
		alertError(error)
	}
}

export default errorFromResponse
