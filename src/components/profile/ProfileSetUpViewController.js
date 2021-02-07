import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput from '../commonComponents/BaseTextInput';
import BaseButton from '../commonComponents/BaseButton';
import LoadingSpinner from '../commonComponents/LoadingSpinner';
import NavigatorDismissButton from '../commonComponents/NavigatorDismissButton';
import SeparateLine from '../commonComponents/SeparateLine';
import {ScreenDimensions} from '../../utils/Dimemsions';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {PLATFORM} from '../../utils/Enums';
import moment from 'moment';
import {Gender, TimeFormat} from '../../utils/utils';
import ImagePicker from 'react-native-image-crop-picker';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../utils/Navigator';

const ProfileSetUpViewController = (props) => {
	const [isShowSpinner, setIsShowSpinner] = useState(false)
	const [avatar, setAvatar] = useState('')
	const [bio, setBio] = useState('')
	const [isShowDatePicker, setIsShowDatePicker] = useState(false)
	const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1))
	const [gender, setGender] = useState(Gender.unknown)

	const pushToPicWall = () => {
		Navigation.push(props.componentId, {
			component: {
				name: 'ProfileSetUpPicWallViewController',
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

	const renderGenderView = () => {
		return (
			<View style={{width: '100%', paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
				height: 50
			}}>
				{[{type: Gender.male, title: 'Male'}, {type: Gender.female, title: 'Female'}].map((_item, idx,) => {
					const {type, title} = _item
					let imageSource = (type === gender ? require('../../source/image/match/check-one.png') : require('../../source/image/match/round.png'))
					let tintColor = (type === gender ? Colors.blue : Colors.placeholder)
					return (
						<TouchableOpacity onPress={() => {
							setGender(type)
						}} key={idx} style={{flexDirection: 'row', alignItems: 'center'}}>
							<Image source={imageSource} style={{width: 20, height: 20, marginRight: 5, tintColor: tintColor}}/>
							<Text style={{fontSize: 16, color: Colors.black}}>{title}</Text>
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
		const dateStr = formatDate(selectedDate)
		return(
			<TouchableOpacity onPress={() => {
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
						color: Colors.black, paddingVertical: 0}}>{dateStr}</Text>
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

		return (
			<RNDateTimePicker
				style={{width: ScreenDimensions.width, height: 250, backgroundColor: Colors.white, justifyContent: "center"}}
				value={selectedDate}
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
			if (image && image.path) {
				setAvatar(image.path)
			}
		});
	}

	const renderAvatar = () => {
		return (
			<View style={{width: '100%', marginTop: 15, alignItems: 'center'}}>
				<TouchableOpacity onPress={() => {
					openSinglePhotoLibrary()
				}}>
					<Image source={{uri: avatar}} style={{width: 96, height: 96, backgroundColor: Colors.systemGray, borderRadius: 48,
						borderColor: Colors.blue, borderWidth: 2,
					}}/>
				</TouchableOpacity>

				<Text numberOfLines={1} style={{fontSize: 16, color: Colors.black, marginTop: 10,}}>{'Cath'}</Text>
			</View>
		)
	}

	return (
		<SafeAreaView style={{flex: 1,}}>
			<ScrollView>
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
					didClick={pushToPicWall}
				/>
			</ScrollView>

			<NavigatorDismissButton componentId={props.componentId}/>
			<LoadingSpinner visible={isShowSpinner}/>
		</SafeAreaView>
	)
}

export default ProfileSetUpViewController
