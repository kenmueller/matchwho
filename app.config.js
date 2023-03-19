if (!process.env.EAS_PROJECT_ID) throw new Error('Missing EAS_PROJECT_ID')
if (!process.env.API_ORIGIN) throw new Error('Missing API_ORIGIN')

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
