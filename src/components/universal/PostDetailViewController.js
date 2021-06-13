import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, TouchableOpacity, View, Image} from 'react-native';
import {Colors} from '../../utils/styles';
import FastImage from 'react-native-fast-image';
import {Navigation} from 'react-native-navigation';
import ContainerView from '../../baseComponents/ContainerView';

const IMAGE_SCALE =  (278/375)

export default class PostDetailViewController extends Component{
	static defaultProps = {
		uri: '',
		fromId: 'image.from',
		toId: 'image.to',
	}

	renderBottomLeftButtons = () => {
		return (
			<TouchableOpacity>
				<Image />
			</TouchableOpacity>
		)
	}

	render () {
		const {uri, toId} = this.props
		const {width} = Dimensions.get('window')
		return (
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<ScrollView contentInsetAdjustmentBehavior="never" style={{flex: 1}}>
					<FastImage
						nativeID={toId}
						style={{width:'100%', height: width * IMAGE_SCALE}}
						source={{
							uri:  uri,
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>

					<TouchableOpacity onPress={() => {
						Navigation.dismissModal(this.props.componentId);
					}}>
						<Text>{'pop3'}</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		)
	}
}
