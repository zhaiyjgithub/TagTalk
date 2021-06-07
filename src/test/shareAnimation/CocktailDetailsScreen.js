import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import {
	NavigationComponentProps,
	NavigationButtonPressedEvent,
	Options,
	Navigation
} from 'react-native-navigation';
import { CocktailItem } from './cocktails';
import {Colors} from '../../utils/styles';
import FastImage from 'react-native-fast-image';


export default class CocktailDetailsScreen extends React.Component<Props> {
	static defaultProps = {
		uri: '',
		id: 0

	}

	render() {
		const {uri, id} = this.props
		return (
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<FastImage
					nativeID={`image.to`}
					style={{width:'100%', height: 200}}
					source={{
						uri:  this.props.uri,
						priority: FastImage.priority.normal,
					}}
					resizeMode={FastImage.resizeMode.cover}
				/>
				{/*<Image source={{uri: `https://picsum.photos/id/${12 + 10}/400/400`}} nativeID={`image.to`} style={{width:'100%', height: 200}} />*/}
			</View>
		);
	}
}

const SIZE = 100;
const HEADER = 150;
const styles = StyleSheet.create({
	root: {
		marginTop: 0,
	},
	header: {
		marginTop: -HEADER,
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: HEADER,
	},
	backdrop: {
		height: HEADER,
		width: '100%',
		zIndex: 0,
	},
	title: {
		fontSize: 32,
		color: 'whitesmoke',
		marginLeft: 16,
		marginBottom: 16,
		zIndex: 2,
	},
	description: {
		fontSize: 15,
		letterSpacing: 0.2,
		lineHeight: 25,
		marginTop: 32,
		marginHorizontal: 24,
	},
	image: {
		height: SIZE,
		width: SIZE,
		zIndex: 1,
		// transform: [{ rotate: '45deg' }],
		marginLeft: 24,
		marginBottom: -24,
		// borderRadius: 20,
	},
});
