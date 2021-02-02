import {Dimensions} from 'react-native';
import {Easing, exp} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window')

export const COL = 2
export const ItemSize = {
	width: width/2.0,
	height: width/2.0
}

export const ItemPosition = {} // {id :  order number}

export const animationConfig = {
	easing: Easing.inOut(Easing.ease),
	duration: 350,
};

export const getPosition = (translationX, translationY) => {
	"worklet";
	return {
		x: translationX < ItemSize.width ? 0 : ItemSize.width,
		y: Math.floor(translationY / ItemSize.height)*ItemSize.height,
	}
}


