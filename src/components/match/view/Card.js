import React, {useEffect, useState, memo} from 'react';
import {Dimensions, SafeAreaView, View, Text, TouchableOpacity, Image} from 'react-native';
import {Colors} from '../../../utils/styles';

const Card = memo(function Card() {
	const {width, height} = Dimensions.get('window')
	return (
		<View style={{width: width - 60}}>
			<Image source={require('../../../source/image/test/blunt.jpg')} style={{width: '100%', height: height*0.6,
				borderRadius: 8
			}} />
			<View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 15,
				justifyContent: 'space-between', paddingVertical: 10,
			}}>
				<TouchableOpacity style={{height: 50, width: 60, borderWidth: 1, borderColor: Colors.lineGray,
					borderRadius: 8, justifyContent: 'center', alignItems: 'center'
				}}>
					<Text style={{fontSize: 20, color: Colors.red}}>{'No'}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={{height: 50, width: 60, borderWidth: 1, borderColor: Colors.lineGray,
					borderRadius: 8, justifyContent: 'center', alignItems: 'center'
				}}>
					<Text style={{fontSize: 20, color: Colors.green}}>{'Like'}</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
})

export default Card
