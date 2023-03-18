import { DeviceType, getDeviceTypeAsync } from 'expo-device'
import { unlockAsync } from 'expo-screen-orientation'

const unlockOrientationIfTablet = async () => {
	const deviceType = await getDeviceTypeAsync()
	if (deviceType !== DeviceType.TABLET) return

	await unlockAsync()
}

export default unlockOrientationIfTablet
