module.exports = ({ config }) => ({
	...config,
	extra: {
		API_ORIGIN: process.env.API_ORIGIN
	}
})
