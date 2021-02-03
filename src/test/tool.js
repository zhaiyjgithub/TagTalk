import {Easing} from 'react-native-reanimated';
import {ScreenDimensions} from '../utils/Dimemsions';

export const COL = 4
export const ItemSize = {
	width: ScreenDimensions.width/COL,
	height: ScreenDimensions.width/COL
}

export const ItemPosition = {} // {id :  order number}

export const animationConfig = {
	easing: Easing.inOut(Easing.ease),
	duration: 350,
};


