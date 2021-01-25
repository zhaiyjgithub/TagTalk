import React, {memo} from 'react';
import {Dimensions, Image, View} from 'react-native';
const {width, height} = Dimensions.get('window')

const CardSize = {
	width: (width - 60),
	height: height*0.6
}

export {
	CardSize
}

const Card = memo(function Card(props) {
	const {imageSource} = props
	return (
		<View style={[{width: CardSize.width}]}>
			<Image source={imageSource} style={{width: '100%', height: CardSize.height,
				borderRadius: 8
			}} />
		</View>
	)
})


export default Card
