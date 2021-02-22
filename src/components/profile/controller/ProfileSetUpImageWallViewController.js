import React, {useEffect, Component} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../utils/styles';
import BaseButton from '../../commonComponents/BaseButton';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import NavigatorDismissButton, {NavigationType} from '../../commonComponents/NavigatorDismissButton';
import ImagePicker from 'react-native-image-crop-picker';
import {Navigation} from 'react-native-navigation';
import ProfileImageWallService from '../service/ProfileImageWallService';
import SortItemContainerView, {ImageActionType} from '../view/SortItemContainerView';

let defaultImage = {
	id: '0',
	type: ImageActionType.default,
	uri: require('../../../source/image/match/add-four.png')
}

export default class ProfileSetUpImageWallViewController extends Component{
	constructor(props) {
		super(props);
		this.state = {
			isShowSpinner: false,
			dataSource: [defaultImage]
		}

		this.imageService = new ProfileImageWallService()
		this.deletedImageUriSet = new Set()

	}

	componentDidMount(): void {
		this.requestImageWalls()
	}

	requestImageWalls = () => {
		const {ChatID} = global.UserInfo
		this.imageService.GetImageWalls(ChatID, (data: Array) => {
			this.setState({dataSource: data})
		}, () => {})
	}

	openMultiPhotoLibrary = () => {
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

				const {dataSource} = this.state
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

				this.setState({dataSource: ds})
			}
		}).catch((error) => {
			console.log(error)
		});
	}

	handleRemoveImage = ({id, uri, type, name}) => {
		console.log('handleRemoveImage: ', name, uri)

		const {dataSource} = this.state
		if (type === ImageActionType.normal && uri.startsWith('http')) {
			this.deletedImageUriSet.add(name)
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

		this.setState({dataSource: list})
	}

	handleUploadImageWall = () => {
		const {ChatID} = global.UserInfo
		const {dataSource} = this.state

		let deleteImages = []
		this.deletedImageUriSet.forEach((name) => {
			deleteImages.push(name)
		})

		this.imageService.UpdateImageWalls(ChatID, dataSource, deleteImages, () => {
			this.requestImageWalls()
		}, () => {})
	}

	pushToSetUpTags = () => {
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

	render() {
		const {isShowSpinner, dataSource} = this.state
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
					openMultiPhotoLibrary={this.openMultiPhotoLibrary}
					handleRemoveImage={this.handleRemoveImage}
				/>

				<BaseButton
					title={'Save'}
					style={{
						backgroundColor: Colors.blue,
					}}
					containerStyle={{
						marginTop: 20,
					}}
					didClick={this.handleUploadImageWall}
				/>

				<NavigatorDismissButton componentId={props.componentId} type={NavigationType.push}/>
				<LoadingSpinner visible={isShowSpinner}/>
			</SafeAreaView>
		)
	}
}

export default ProfileSetUpImageWallViewController
