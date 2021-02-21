import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../utils/styles';
import BaseButton from '../../commonComponents/BaseButton';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import NavigatorDismissButton, {NavigationType} from '../../commonComponents/NavigatorDismissButton';
import ImagePicker from 'react-native-image-crop-picker';
import {Navigation} from 'react-native-navigation';
import {GetImageWalls, UpdateImageWalls} from '../service/ProfileImageWallService';
import SortItemContainerView from '../view/SortItemContainerView';

export const ImageActionType = {
	default: 0,
	normal: 1
}

const ProfileSetUpImageWallViewController = (props) => {
	const [isShowSpinner, setIsShowSpinner] = useState(false)
	const [deletedImageUriSet, setDeletedImageUriSet] = useState(new Set())

	let defaultImage = {
		id: '0',
		type: ImageActionType.default,
		uri: require('../../../source/image/match/add-four.png')
	}

	const [dataSource, setDataSource] = useState([defaultImage])

	useEffect(() => {
		requestImageWalls()
	}, [])

	const requestImageWalls = () => {
		const {ChatID} = global.UserInfo
		GetImageWalls(ChatID, (data: Array) => {
			setDataSource(data)
		}, () => {})
	}
	const openMultiPhotoLibrary = () => {
		ImagePicker.openPicker({
			multiple: true,
			maxFiles: 8,
		}).then(images => {
			if (images && images.length) {
				let list = images.map((item, index) => {
					return {
						id: index.toString(),
						name: item.filename,
						uri: item.path,
						type: ImageActionType.normal
					}
				})

				let ds = []
				ds = ds.concat(dataSource)
				ds = ds.filter((_item) => {
					return _item.type !== ImageActionType.default
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

	const handleRemoveImage = ({id, uri, type, name}) => {
		console.log('handleRemoveImage: ', name, uri)
		if (type === ImageActionType.normal && uri.startsWith('http')) {
			deletedImageUriSet.add(name)
		}
		let list = dataSource.filter((item) => {
			return item.id !== id
		})

		let isHasDefaultItem = (dataSource[dataSource.length - 1].type === ImageActionType.default)
		if (!isHasDefaultItem) {
			list.push(defaultImage)
		}

		list.forEach((item, idx) => {
			item.id = idx.toString()
		})

		setDataSource(list)
	}

	const handleUploadImageWall = () => {
		const {ChatID} = global.UserInfo

		let deleteImages = []
		deletedImageUriSet.forEach((name) => {
			deleteImages.push(name)
		})

		UpdateImageWalls(ChatID, dataSource, deleteImages, () => {
			requestImageWalls()
		}, () => {})
	}

	const renderRemoveImageButton = (item) => {
		return(
			<TouchableOpacity onPress={() => {
				handleRemoveImage(item)
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

			<SortItemContainerView
				dataSource={dataSource}
				openMultiPhotoLibrary={openMultiPhotoLibrary}
				handleRemoveImage={handleRemoveImage}
			/>

			<BaseButton
				title={'Save'}
				style={{
					backgroundColor: Colors.blue,
				}}
				containerStyle={{
					marginTop: 20,
				}}
				didClick={handleUploadImageWall}
			/>

			<NavigatorDismissButton componentId={props.componentId} type={NavigationType.push}/>
			<LoadingSpinner visible={isShowSpinner}/>
		</SafeAreaView>
	)
}

export default ProfileSetUpImageWallViewController
