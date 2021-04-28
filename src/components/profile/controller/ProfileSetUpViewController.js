import React, {Component} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Keyboard} from 'react-native';
import {Colors} from '../../../utils/styles';
import BaseTextInput from '../../commonComponents/BaseTextInput';
import BaseButton from '../../commonComponents/BaseButton';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import NavigatorDismissButton, {NavigationType} from '../../commonComponents/NavigatorDismissButton';
import SeparateLine from '../../commonComponents/SeparateLine';
import {ScreenDimensions} from '../../../utils/Dimemsions';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {PLATFORM} from '../../../utils/Enums';
import moment from 'moment';
import {Gender, TimeFormat} from '../../../utils/utils';
import ImagePicker from 'react-native-image-crop-picker';
import {Navigation} from 'react-native-navigation';
import ToastMsg from '../../../utils/ToastMsg';
import ProfileImage from '../model/ProfileImage';
import ProfileService from '../service/ProfileService';
import {API_User, BaseUrl} from '../../../utils/API';

const defaultImageSource = require('../../../source/image/match/avatar.png')
const femaleImageSource = require('../../../source/image/match/female.png')
const maleImageSource = require('../../../source/image/match/male.png')

export default class ProfileSetUpViewController extends Component {
	constructor(props) {
		super(props);

		const {Avatar} = global.UserInfo
		this.state = {
			isShowSpinner: false,
			avatar: Avatar,
			avatarImage: new ProfileImage("", ""),
			bio: '',
			isShowDatePicker: false,
			selectedDate: TimeFormat.MMDDYYYY,
			gender: Gender.unknown
		}

		this.setupService = new ProfileService()
	}

	uploadProfile = () => {
		// const {ChatID} = global.UserInfo
		// const {gender, bio, avatarImage} = this.state
		// this.setupService.UploadProfile(ChatID, gender, bio, avatarImage, () => {
		// 	this.pushToPicWall()
		// }, () => {
		// })

		this.pushToPicWall()
	}

	pushToPicWall = () => {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'ProfileSetUpImageWallViewController',
				passProps: {

				},
				options: {
					modalPresentationStyle: 'fullScreen',
					topBar: {
						visible: false,
					},
				}
			}
		});
	}

	renderGenderImage = (type) => {
		const source = type === Gender.female ? femaleImageSource : maleImageSource
		const tintColor = type === Gender.female ? Colors.female : Colors.male
		return <Image source={source} style={{width: 20, height: 20, marginRight: 5, tintColor: tintColor}}/>
	}

	renderGenderView = () => {
		const {gender} = this.state
		return (
			<View style={{width: '100%', paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
				height: 50
			}}>
				{[{type: Gender.male, title: 'Male'}, {type: Gender.female, title: 'Female'}].map((_item, idx,) => {
					const {type, title} = _item
					let imageSource = (type === gender ? require('../../../source/image/match/checked.png') : require('../../../source/image/match/round.png'))
					// let tintColor = (type === gender ? Colors.blue : Colors.placeholder)
					return (
						<TouchableOpacity onPress={() => {
							this.setState({gender: type})
						}} key={idx} style={{flexDirection: 'row', alignItems: 'center'}}>
							<Image source={imageSource} style={{width: 20, height: 20, marginRight: 5,}}/>
							{this.renderGenderImage(type)}
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}

	formatDate = (selectedDate) => {
		return moment(selectedDate).format(TimeFormat.MMDDYYYY)
	}

	renderDOBView = () => {
		const {isShowDatePicker, selectedDate}  = this.state
		const dateStr = (selectedDate !== TimeFormat.MMDDYYYY ? this.formatDate(selectedDate) : TimeFormat.MMDDYYYY)
		const textColor = (selectedDate !== TimeFormat.MMDDYYYY ? Colors.black : Colors.lightGray)
		return(
			<TouchableOpacity onPress={() => {
				Keyboard.dismiss()
				this.setState({isShowDatePicker: !isShowDatePicker})
			}} style={[{width: '100%', paddingHorizontal: 20,
				minHeight: 62,marginTop: 10,
			}, {}]}>
				<Text style={{fontSize: 14, color: Colors.blue,
				}}>{'Date of your birthday#'}</Text>

				<View style={{width: '100%', justifyContent: 'center',
					marginVertical: 8, height: 30
				}}>
					<Text style={{fontSize: 18,
						color: textColor, paddingVertical: 0}}>{dateStr}</Text>
				</View>

				{this.renderRNDatePicker()}
				<SeparateLine />
			</TouchableOpacity>
		)
	}

	renderRNDatePicker = () => {
		const {isShowDatePicker, selectedDate}  = this.state
		if (!isShowDatePicker) {
			return null
		}

		const date = (selectedDate !== TimeFormat.MMDDYYYY ? (selectedDate) : (new Date(2000, 0, 1)))
		return (
			<RNDateTimePicker
				style={{width: ScreenDimensions.width, height: 250, backgroundColor: Colors.white, justifyContent: "center"}}
				value={date}
				mode= {"date"}
				display={"spinner"}
				maximumDate={new Date()}
				onChange={(event, date) => {
					if (PLATFORM.isAndroid) {
						this.setState({isShowDatePicker: false})
						const {type} = event
						if (type === 'set') {
							this.setState({selectedDate: date})
						}
					}else {
						this.setState({selectedDate: date})
					}
				}}
			/>
		)
	}

	openSinglePhotoLibrary = () => {
		ImagePicker.openPicker({
			multiple: false
		}).then(image => {
			console.log('image info: ', JSON.stringify(image))
			if (image && image.path) {
				this.setState({
					avatar: image.path,
					avatarImage: new ProfileImage(image.filename, image.path)
				})
			}
		});
	}

	renderAvatar = () => {
		const {avatar} = this.state
		let image = defaultImageSource
		if (avatar && avatar.length) {
			image = {uri: avatar}
		}

		const {Name} = global.UserInfo
		return (
			<View style={{width: '100%', marginTop: 15, alignItems: 'center'}}>
				<TouchableOpacity onPress={this.openSinglePhotoLibrary}>
					<Image source={image} style={{width: 96, height: 96, borderRadius: 48,
						borderColor: Colors.blue, borderWidth: 2,
					}}/>
				</TouchableOpacity>

				<Text numberOfLines={1} style={{fontSize: 16, color: Colors.black, marginTop: 10, fontWeight: '500'}}>{Name}</Text>
			</View>
		)
	}

	render() {
		const {isShowSpinner} = this.state
		return (
			<SafeAreaView style={{flex: 1,}}>
				<Text style={{fontSize: 32, marginVertical: 20,
					marginHorizontal: 20, color: Colors.black,
					fontWeight: 'bold'
				}}>{'Set up your profile.'}</Text>

				{this.renderAvatar()}
				{this.renderGenderView()}
				{this.renderDOBView()}
				<BaseTextInput
					textInputStyle={{textAlignVertical: 'top', height: 40}}
					blurOnSubmit={true}
					title = {'About me#'}
					placeholder={'Enter your brief introduction '}
					placeholderTextColor={Colors.lightGray}
					multiline={true}
					maxLength={160}
					onChangeText={(text) => {
						this.setState({bio: text + ''})
					}}
				/>

				<BaseButton
					title={'Save'}
					style={{
						backgroundColor: Colors.blue,
					}}
					containerStyle={{
						marginTop: 20,
					}}
					didClick={this.uploadProfile}
				/>
				<NavigatorDismissButton componentId={this.props.componentId} type={NavigationType.modal}/>
				<LoadingSpinner visible={isShowSpinner}/>
			</SafeAreaView>
		)
	}
}

