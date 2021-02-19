import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../utils/styles';
import BaseButton from '../../commonComponents/BaseButton';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import NavigatorDismissButton, {NavigationType} from '../../commonComponents/NavigatorDismissButton';
import {useSharedValue} from 'react-native-reanimated';
import SortableItem from '../../../test/SortableItem';
import {ScreenDimensions} from '../../../utils/Dimemsions';
import ImagePicker from 'react-native-image-crop-picker';
import {Navigation} from 'react-native-navigation';

const ImageType = {
	default: 0,
	normal: 1
}

const ProfileSetUpImageWallViewController = (props) => {
	const [isShowSpinner, setIsShowSpinner] = useState(false)

	let defaultImage = {
		id: '0',
		type: ImageType.default,
		uri: require('../../../source/image/match/add-four.png')
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

	const openMultiPhotoLibrary = () => {
		ImagePicker.openPicker({
			multiple: true,
			maxFiles: 8,
		}).then(images => {
			if (images && images.length) {
				let list = images.map((item, index) => {
					return {
						id: index.toString(),
						uri: item.path,
						type: ImageType.normal
					}
				})

				let ds = []
				ds = ds.concat(dataSource)
				ds = ds.filter((_item) => {
					return _item.type !== ImageType.default
				})

				ds = ds.concat(list)

				if (ds.length < 8) {
					defaultImage.id = ds.length
					ds.push(defaultImage)
				}else {
					ds = ds.slice(0, 8)
				}

				ds.forEach((_item, idx) => {
					_item.id = idx + ''
				})

				setDataSource(ds)
			}
		}).catch((error) => {
			console.log(error)
		});
	}

	const handleRemoveImage = (id) => {
		let list = dataSource.filter((item) => {
			return item.id !== id
		})

		let isHasDefaultItem = (dataSource[dataSource.length - 1].type === ImageType.default)
		if (!isHasDefaultItem) {
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
					}} source={require('../../../source/image/match/reduce-one.png')}/>
				</View>
			</TouchableOpacity>
		)
	}

	const renderItem = (item) => {
		const {id, uri, type} = item
		const size = (ScreenDimensions.width/4)
		return (
			<TouchableOpacity onPress={() => {
				if (type === ImageType.default) {
					openMultiPhotoLibrary()
				}else {
					//
				}
			}} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.systemGray,
				width: size, height: size
			}}>
				{type === ImageType.default ? <Image source={uri} style={{width: 50, height: 50, tintColor: Colors.black}}/> :
					<Image source={{uri: uri}} style={{width: size, height: size}}/>}

				{type === ImageType.default ? null : renderRemoveImageButton(item)}
			</TouchableOpacity>
		)
	}

	const pushToSetUpTags = () => {
		Navigation.push(props.componentId, {
			component: {
				name: 'ProfileSetUpTagsViewController',
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

	return (
		<SafeAreaView style={{flex: 1,}}>
			<Text style={{fontSize: 32, marginTop: 20,
				marginBottom: 10,
				marginHorizontal: 20, color: Colors.black,
				fontWeight: 'bold'
			}}>{'Set up your image wall.'}</Text>

			<Text style={{fontSize: 20, marginBottom: 5, marginTop: 0,
				marginHorizontal: 20, color: Colors.black,
			}}>{'Click add button to add images.'}</Text>
			<Text style={{fontSize: 20, marginBottom: 10, marginTop: 0,
				marginHorizontal: 20, color: Colors.black,
			}}>{'Drag to resort the images.'}</Text>

			<View style={{flexDirection: 'row', flexWrap: 'wrap', height: (ScreenDimensions.width/4)*2, marginTop: 5,

			}}>
				{dataSource.map((_item, idx) => {
					const {id, uri, type} = _item
					return (
						<SortableItem key={idx}
									  orderId={id}
									  isEnablePanGesture={type !== ImageType.default}
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
					pushToSetUpTags()
				}
				}
			/>

			<NavigatorDismissButton componentId={props.componentId} type={NavigationType.push}/>
			<LoadingSpinner visible={isShowSpinner}/>
		</SafeAreaView>
	)
}

export default ProfileSetUpImageWallViewController
