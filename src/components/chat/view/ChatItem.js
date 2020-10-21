import React, {Component, Fragment, PureComponent} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	TouchableOpacity,
	Image
} from 'react-native';
import {Colors, FontFamily} from '../../../utils/styles';
import FastImage from 'react-native-fast-image'
import {ScreenDimensions} from '../../../utils/Dimemsions';
import {MessageType} from '../../../utils/Enums';

export default class ChatItem extends Component{
	constructor(props){
		super(props)
		this.state = {
			isPeer: props.isPeer,
			message: props.message
		}
	}

	shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
		return this.state.message.text !== nextProps.message.text ||
			this.state.message.imageURL !== nextProps.message.imageURL ||
			this.state.message.audioURL !== nextProps.message.audioURL ||
			this.state.message.videoURL !== nextProps.message.videoURL ||
			this.state.message.isPeer !== nextProps.message.isPeer
	}

	renderUserIcon(isPeer) {
		return(
			<View style={{width: 34, height: 34, borderRadius: 17, marginRight: isPeer ? 4 : 0, marginLeft: isPeer ? 0 : 4}}>
				<Image source={require('../../../source/image/test/Group7.png')} style={{width: 34, height: 34, overflow: 'hidden'}}/>
				{isPeer ? <View style={{position: 'absolute', right: 2, bottom: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green}}/> : null}
			</View>
		)
	}

	renderTextMessage(isPeer, message) {
		return (
			<View style={[{maxWidth: '65%',
				backgroundColor: isPeer ? Colors.lightBlue : Colors.blue,
				minHeight: 40,
				paddingVertical: 8, paddingHorizontal: 15
			}, isPeer ? styles.peerTextContainer : styles.myTextContainer]}>
				<Text style={{
					fontSize: 16,
					color: isPeer ? Colors.black : Colors.white,
					fontFamily: FontFamily.helvetica
				}}>{message.text}</Text>
			</View>

		)
	}

	renderImageMessage(isPeer, message) {
		let size = (ScreenDimensions.width - 100) *0.65
		const {imageURL} = message
		const {previewImageAction} = this.props
		return (
			<TouchableOpacity onPress={() => {
				previewImageAction && previewImageAction(imageURL)
			}} style={[{
				backgroundColor: isPeer ? Colors.lightBlue : Colors.blue,
				minHeight: 40, minWidth: 40,
				marginHorizontal: 8,
			}, isPeer ? styles.peerTextContainer : styles.myTextContainer, {backgroundColor: Colors.white}]}>
				{imageURL && imageURL.startsWith('http') ? (
					<FastImage
						style={{ width: size, height: size, }}
						source={{
							uri:  imageURL,
							priority: FastImage.priority.normal,
						}}
						resizeMode={FastImage.resizeMode.contain}
					/>
				) : (
					<Image
						style={{ width: size, height: size, }}
						source={{
							uri:  imageURL,
						}}
						resizeMode={'contain'}
					/>
				)}
			</TouchableOpacity>

		)
	}

	renderMediaContent(isPeer, message) {
		switch (message.type) {
			case MessageType.Text:
				return this.renderTextMessage(isPeer, message)
			case MessageType.Image:
				return this.renderImageMessage(isPeer, message)
			case MessageType.Video:
				return this.renderTextMessage(isPeer, message)
			default:
				return this.renderTextMessage(isPeer, message)
		}
	}

	render() {
		const {isPeer, message} = this.state
		return(
			<View style={isPeer ? styles.peerContainer : styles.myContainer}>
					{this.renderUserIcon(isPeer)}
					{this.renderMediaContent(isPeer, message)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	peerContainer: {
		marginHorizontal: 22,
		flexDirection: 'row',
		marginBottom: 20
	},
	myContainer: {
		marginHorizontal: 22,
		flexDirection: 'row-reverse',
		marginBottom: 20
	},
	peerTextContainer: {
		borderTopLeftRadius: 4,
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	myTextContainer: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
})
