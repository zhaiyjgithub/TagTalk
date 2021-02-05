import React, {useEffect, useState} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	RefreshControl,
	TouchableOpacity,
	Image,
	DeviceEventEmitter,
	TextInput,
	ScrollView
} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput, {KeyboardType} from '../commonComponents/BaseTextInput';
import BaseButton from '../commonComponents/BaseButton';
import LoadingSpinner from '../commonComponents/LoadingSpinner';
import NavigatorDismissButton from '../commonComponents/NavigatorDismissButton';
import SeparateLine from '../commonComponents/SeparateLine';
import {
	runOnJS,
	useAnimatedReaction,
	useSharedValue,
	withTiming,
	useDerivedValue,
	runOnUI,
} from 'react-native-reanimated';
import SortableItem from '../../test/SortableItem';
import {ScreenDimensions} from '../../utils/Dimemsions';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {MessageMediaType, PLATFORM} from '../../utils/Enums';
import moment from 'moment'
import {Gender, TimeFormat} from '../../utils/utils';
import ImagePicker from "react-native-image-crop-picker";


const ImageType = {
	default: 0,
	normal: 1
}


const ProfileSetUpViewController = (props) => {
	const [isShowSpinner, setIsShowSpinner] = useState(false)
	const [avatar, setAvatar] = useState('')
	const [dob, setDob] = useState('MM/DD/YYYY')
	const [bio, setBio] = useState('')
	const [isShowDatePicker, setIsShowDatePicker] = useState(false)
	const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1))
	const [gender, setGender] = useState(Gender.unknown)

	let defaultImage = {
		id: '0',
		type: ImageType.default,
		uri: require('../../source/image/match/add-four.png')
	}

	const convertDataSourceToShardedValue = () => {
		let len = 8
		let value = []
		for (let i = 0; i < len; i ++) {
			value[i.toString()] = i
		}

		return value
	}
	const positions = useSharedValue(convertDataSourceToShardedValue());
	const [dataSource, setDataSource] = useState([defaultImage])

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

	const openMultiPhotoLibrary = () => {
		ImagePicker.openPicker({
			multiple: true
		}).then(images => {
			if (images && images.length) {
				let list = images.map((item, index) => {
					return {
						id: index.toString(),
						uri: item.path,
						type: ImageType.normal
					}
				})

				if (list.length < (8 - 1)) {
					defaultImage.id = list.length
					list.push(defaultImage)
				}

				setDataSource(list)
			}
		}).catch((error) => {
			console.error(error)
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

	const handleRemoveImage = (id) => {
		const lastDataSourceLength = dataSource.length
		let list = dataSource.filter((item) => {
			return item.id !== id
		})

		if (lastDataSourceLength === 8) {
			list.push(defaultImage)
		}

		list.forEach((item, idx) => {
			item.id = idx.toString()
		})

		setDataSource(list)
	}

	const renderRemoveImageButton = (item) => {
		return(
			<TouchableOpacity onPress={() => {
				handleRemoveImage(item.id)
			}} style={{width: 30, height: 30, justifyContent: 'center',
				alignItems: 'center',
				position: 'absolute', right: 0, top: 0
			}}>
				<View style={{width: 20, height: 20, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 10, }}>
					<Image style={{tintColor: Colors.white,
						width: 20, height: 20,
					}} source={require('../../source/image/match/reduce-one.png')}/>
				</View>
			</TouchableOpacity>
		)
	}

	const renderItem = (item) => {
		const {id, uri, type} = item
		const size = (ScreenDimensions.width/4)
		return (
			<TouchableOpacity onPress={() => {
				openMultiPhotoLibrary()
			}} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.systemGray,
				width: size, height: size
			}}>
				{type === ImageType.default ? <Image source={uri} style={{width: 50, height: 50, tintColor: Colors.black}}/> :
					<Image source={{uri: uri}} style={{width: size, height: size}}/>}

				{type === ImageType.default ? null : renderRemoveImageButton(item)}
			</TouchableOpacity>
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

					}}
				/>

				<View style={{flexDirection: 'row', flexWrap: 'wrap', height: (ScreenDimensions.width/4)*2, marginTop: 5,

				}}>
					{dataSource.map((_item, idx) => {
						const {id, uri} = _item
						return (
							<SortableItem key={idx}
										  orderId={id}
										  uri={uri}
										  maxLen={dataSource.length - 1}
										  positions={positions}
										  numberOfColumn={4}
										  renderItem={() => {
											  return renderItem(_item)
										  }}
							/>
						)
					})}
				</View>

				<BaseButton
					title={'Save'}
					style={{
						backgroundColor: Colors.blue,
					}}
					containerStyle={{
						marginTop: 20,
					}}
					didClick={() => {

					}
					}
				/>
			</ScrollView>

			<NavigatorDismissButton componentId={props.componentId}/>
			<LoadingSpinner visible={isShowSpinner}/>
		</SafeAreaView>
	)
}

export default ProfileSetUpViewController
