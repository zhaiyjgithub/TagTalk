
const { Navigation } = require('react-native-navigation');
import {
	Platform,
	Dimensions
} from 'react-native';


const ScreenDimensions = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
}


export {
	ScreenDimensions
}
