import React, {Component} from 'react';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../utils/styles';
import Video from 'react-native-video';
import {Navigation} from 'react-native-navigation'

export default class VideoPreview extends Component{
	constructor(props) {
		super(props);
		this.state = {
			filePath: '',
			isPlaying: true
		}

		this.progress = 0
	}

	componentDidMount() {

	}

	renderVideo() {
		// let filePath = 'file:///var/mobile/Containers/Data/Application/629FA5CB-9199-4D27-9BC3-39115B9B2A1E/Documents/1603355844637.mp4'
		const {filePath, isPlaying} = this.state
		// console.log('play uri: ' + filePath )
		return (
			<Video source={{uri: filePath}}
				   ref={(ref) => {
					   this.player = ref
				   }}
				   resizeMode={'cover'}
				   repeat={false}
				   paused={!isPlaying}
				   onBuffer={() => {

				   }}
				   onLoad={() => {
					   this.setState({isPlaying: true})
				   }}
				   onEnd={() => {
					   this.setState({isPlaying: false})
				   }}
				   onError={(error) => {
					   console.log(error)
					   this.setState({isPlaying: false})
				   }}
				   style={{flex: 1,}} />
		)
	}

	renderVideoPreview() {
		return(
			<View style={{flex: 1, backgroundColor: '#000000'}}>
				{this.renderVideo()}
				<View style={{position: 'absolute', right: 0, left: 0, bottom: 0,
					paddingBottom: 15
				}}>
					<View style={{width: '100%', flexDirection: 'row', alignItems: 'center',
						justifyContent: 'space-between', paddingHorizontal: 20,
						marginTop: 20
					}}>
						{this.renderCancelVideoButton()}
						<TouchableOpacity style={{width: 50, height: 50,
							justifyContent: 'center', alignItems: 'center',
							backgroundColor: 'rgba(0,0,0, 0.35)', borderRadius: 25,
						}}>
							<Image  source={require('../../source/image/chat/play.png')} style={{
								tintColor: Colors.white, width: 30, height: 30,
							}}/>
						</TouchableOpacity>

						<View />
					</View>
				</View>
			</View>
		)
	}

	renderCancelVideoButton() {
		return(
			<TouchableOpacity onPress={() => {
				this.setState({isPreview: false})

				Navigation.dismissOverlay(this.props.componentId);
			}} style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
				backgroundColor: 'rgba(0,0,0, 0.35)', borderRadius: 20,
			}}>
				<Image style={{tintColor: Colors.white,}} source={require('../../source/image/chat/close_circle.png')} />
			</TouchableOpacity>
		)
	}

	render() {
		return(
			<View style={{backgroundColor: '#000000', flex: 1}}>
				<SafeAreaView style={{flex: 1}}>
					{this.renderVideoPreview()}
				</SafeAreaView>
			</View>
		)
	}
}
