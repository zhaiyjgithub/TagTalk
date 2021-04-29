import React, {Component} from 'react';
import {Dimensions, FlatList, Image, SafeAreaView, Keyboard, Text, TouchableOpacity, View} from 'react-native';
import CacheTool from '../../../utils/CacheTool';
import {CacheKey, PLATFORM} from '../../../utils/Enums';
import {Router} from '../../../route/router';
import {Colors} from '../../../utils/styles';
import ContainerView from '../../../baseComponents/ContainerView';
import {API_User, BaseUrl} from '../../../utils/API';
import FastImage from 'react-native-fast-image';
import ProfileImageWallService from '../service/ProfileImageWallService';
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import ProfileService from '../service/ProfileService';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../../utils/Navigator';
import BaseTextInput from '../../commonComponents/BaseTextInput';
import SegmentedControlTab from "react-native-segmented-control-tab"
import BaseButton from '../../commonComponents/BaseButton';
import {Gender} from '../../../utils/utils';
import ToastMsg from '../../../utils/ToastMsg';

export default class UpdateBasicProfileViewController extends Component{
	static defaultProps = {
		name: '',
		bio: '',
		gender: Gender.male
	}

	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: props.gender === Gender.female ? 1 : 0,
			name: props.name,
			bio: props.bio,
			gender: props.gender
		};

		this.profileService = new ProfileService()
	}

	handleIndexChange = index => {
		this.setState({
			selectedIndex: index
		});
	};

	onSave = () => {
		const {ChatID} = ACCOUNT
		const {name, bio, gender} = this.state
		this.profileService.updateBasicProfile(ChatID, name, bio, gender, () => {
			const {onSuccess} = this.props
			onSuccess && onSuccess()
			Navigation.pop(this.props.componentId)
		})
	}

	onChangeName = (text) => {
		this.setState({name: text})
	}

	onChangeBio = (text) => {
		this.setState({bio: text})
	}

	hideKeyboard = () => {
		Keyboard.dismiss()
	}

	render() {
		const {name, bio, gender, selectedIndex} = this.state
		return (
			<ContainerView style={{justifyContent: 'space-between'}}>
				<TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={this.hideKeyboard}>
					<BaseTextInput
						containerStyle={{marginTop: 40}}
						title = {'Email#'}
						placeholder={'Enter your name'}
						value={name}
						onChangeText={this.onChangeName}
					/>
					<BaseTextInput
						title = {'Bio#'}
						placeholder={'Enter your bio'}
						multiline={true}
						maxLength={180}
						textInputStyle={{height: 120}}
						value={bio}
						onChangeText={this.onChangeBio}
					/>
					<View style={{marginHorizontal: 24, marginTop: 16}}>
						<Text style={{fontSize: 14, color: Colors.blue,
						}}>{'Gender#'}</Text>
						<SegmentedControlTab
							tabsContainerStyle={{marginTop: 16,}}
							tabStyle={{height: 40}}
							values={["Male", "Female"]}
							selectedIndex={selectedIndex}
							onTabPress={this.handleIndexChange}
						/>
					</View>
				</TouchableOpacity>
				<BaseButton
					title={'Log In'}
					style={{
						backgroundColor: Colors.blue,
					}}
					didClick={this.onSave}
				/>
			</ContainerView>
		)
	}
}
