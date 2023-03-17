import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

const HomeApps = () => (
	<View style={styles.root}>
		<TouchableOpacity>
			<Ionicons name="logo-apple" />
		</TouchableOpacity>
	</View>
)

const styles = StyleSheet.create({})

export default HomeApps
