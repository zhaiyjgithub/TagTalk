import React, {useState} from 'react';
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
import {UploadProfile} from '../service/ProfileSetUpService';
import {API_User, BaseUrl} from '../../../utils/API';

const ProfileSetUpViewController = (props) => {
	const [isShowSpinner, setIsShowSpinner] = useState(false)
	const [avatar, setAvatar] = useState('')
	const [avatarImage, setAvatarImage] = useState(ProfileImage('', ''))
	const [bio, setBio] = useState('')
	const [isShowDatePicker, setIsShowDatePicker] = useState(false)
	const [selectedDate, setSelectedDate] = useState(TimeFormat.MMDDYYYY)
	const [gender, setGender] = useState(Gender.unknown)

	const defaultImageSource = require('../../../source/image/match/avatar.png')
	const femaleImageSource = require('../../../source/image/match/female.png')
	const maleImageSource = require('../../../source/image/match/male.png')


	const uploadProfile = () => {
		const {ChatID} = global.UserInfo
		UploadProfile(ChatID, gender, bio, avatarImage, () => {}, () => {

		})
	}

	const pushToPicWall = () => {
		Navigation.push(props.componentId, {
			component: {
				name: 'ProfileSetUpImageWallViewController',
				passProps: {
					avatarBase64: avatar,
					dob: selectedDate,
					bio: bio,
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

	const renderGenderImage = (type) => {
		const source = type === Gender.female ? femaleImageSource : maleImageSource
		const tintColor = type === Gender.female ? Colors.female : Colors.male
		return <Image source={source} style={{width: 20, height: 20, marginRight: 5, tintColor: tintColor}}/>
	}

	const renderGenderView = () => {
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
							setGender(type)
						}} key={idx} style={{flexDirection: 'row', alignItems: 'center'}}>
							<Image source={imageSource} style={{width: 20, height: 20, marginRight: 5,}}/>
							{renderGenderImage(type)}
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}

	const formatDate = (selectedDate) => {
		return moment(selectedDate).format(TimeFormat.MMDDYYYY)
	}

	const renderDOBView = () => {
		const dateStr = (selectedDate !== TimeFormat.MMDDYYYY ? formatDate(selectedDate) : TimeFormat.MMDDYYYY)
		const textColor = (selectedDate !== TimeFormat.MMDDYYYY ? Colors.black : Colors.lightGray)
		return(
			<TouchableOpacity onPress={() => {
				Keyboard.dismiss()
				setIsShowDatePicker(!isShowDatePicker)
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

				{renderRNDatePicker()}
				<SeparateLine />
			</TouchableOpacity>
		)
	}

	const renderRNDatePicker = () => {
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
						setIsShowDatePicker(false)
						const {type} = event
						if (type === 'set') {
							setSelectedDate(date)
						}
					}else {
						setSelectedDate(date)
					}
				}}
			/>
		)
	}

	const openSinglePhotoLibrary = () => {
		ImagePicker.openPicker({
			multiple: false
		}).then(image => {
			console.log('image info: ', JSON.stringify(image))
			if (image && image.path) {
				const pImage = ProfileImage(image.filename, image.path)
				setAvatarImage(pImage)
				setAvatar(image.path)
			}
		});
	}

	const renderAvatar = () => {
		const image = avatar.length ? {uri: avatar} : defaultImageSource
		const {Name, Avatar} = global.UserInfo
		const avatarUri = BaseUrl + API_User.Avatar + '?name=' + Avatar //http://localhost:8090/User/Avatar?name=4560ee23e5fb7f2b81d5ed7970dec913.JPG
		console.log('user avatarUri ', avatarUri)
		return (
			<View style={{width: '100%', marginTop: 15, alignItems: 'center'}}>
				<TouchableOpacity onPress={() => {
					openSinglePhotoLibrary()
				}}>
					<Image source={image} style={{width: 96, height: 96, borderRadius: 48,
						borderColor: Colors.blue, borderWidth: 2,
					}}/>
				</TouchableOpacity>

				<Text numberOfLines={1} style={{fontSize: 16, color: Colors.black, marginTop: 10, fontWeight: '500'}}>{Name}</Text>
			</View>
		)
	}

	return (
		<SafeAreaView style={{flex: 1,}}>
			<Text style={{fontSize: 32, marginVertical: 20,
				marginHorizontal: 20, color: Colors.black,
				fontWeight: 'bold'
			}}>{'Set up your profile.'}</Text>

			{renderAvatar()}
			{renderGenderView()}
			{renderDOBView()}
			<BaseTextInput
				textInputStyle={{textAlignVertical: 'top', height: 40}}
				blurOnSubmit={true}
				title = {'About me#'}
				placeholder={'Enter your brief introduction '}
				placeholderTextColor={Colors.lightGray}
				multiline={true}
				maxLength={160}
				onChangeText={(text) => {
					setBio(text + '')
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
				didClick={uploadProfile}
			/>
			<NavigatorDismissButton componentId={props.componentId} type={NavigationType.modal}/>
			<LoadingSpinner visible={isShowSpinner}/>
		</SafeAreaView>
	)
}

export default ProfileSetUpViewController
