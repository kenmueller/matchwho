module.exports = ({ config }) => ({
	...config,
	updates: {
		url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`
	},
	extra: {
		eas: { projectId: process.env.EAS_PROJECT_ID },
		API_ORIGIN: process.env.API_ORIGIN
	}
})
