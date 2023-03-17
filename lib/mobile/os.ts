const getMobileOS = () => {
	const userAgent =
		navigator.userAgent ||
		navigator.vendor ||
		(window as { opera?: string }).opera

	if (!userAgent) return null

	if (/windows phone/i.test(userAgent)) return 'windows'

	if (/android/i.test(userAgent)) return 'android'

	if (
		/iPad|iPhone|iPod/.test(userAgent) &&
		!(window as { MSStream?: object }).MSStream
	)
		return 'ios'

	return null
}

export default getMobileOS
