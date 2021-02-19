import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../utils/styles';
import BaseTextInput from '../../commonComponents/BaseTextInput';
import ToastMsg from '../../../utils/ToastMsg';
import SeparateLine from '../../commonComponents/SeparateLine';
import NavigatorDismissButton, {NavigationType} from '../../commonComponents/NavigatorDismissButton';
import {PLATFORM} from '../../../utils/Enums';
import {Navigation} from 'react-native-navigation';

const ProfileSetUpTagsViewController = (props) => {
	const [defaultTags, setDefaultTags] = useState([
		'Adventure', 'Animal', 'Dancing',
		'Foreign culture', 'Hitchiking', 'Local food',
		'Making new friends', 'Outdoor activities', 'Plants-based food',
		'Sightseeing', 'Spirituality', 'Science', 'Sports', 'Yoga'
	])
	const [selectedSet, setSelectedSet] = useState(new Set())
	const [customSet, setCustomSet] = useState(new Set())
	const [customTag, setCustomTag] = useState('')
	const MaxSetSize = 20

	const addToSet = (item) => {
		selectedSet.add(item)
	}

	const removeFromSet = (item) => {
		selectedSet.delete(item)
	}

	const addToCustomSet = (item) => {
		customSet.add(item)
	}

	const removeFromCustomSet = (item) => {
		customSet.delete(item)
	}

	const clickItem = (item, type) => {
		if (selectedSet.has(item)) {
			removeFromSet(item)
			if (type === TagType.custom) {
				removeFromCustomSet(item)
			}
		}else {
			if (selectedSet.size < MaxSetSize) {
				addToSet(item)
				if (type === TagType.custom ) {
					addToCustomSet(item)
				}
			}else {
				ToastMsg.show('Max 20 tags limited.')
				return
			}
		}
		updateDataSource()
	}

	const renderItem = (item, idx, type) => {
		const isSelected = selectedSet.has(item)
		return (
			<TouchableOpacity onPress={() => {
				clickItem(item, type)
			}} key={idx} style={{height: 50, borderRadius: 25, backgroundColor: isSelected ? Colors.blue : Colors.systemGray, justifyContent: 'center',
				marginTop: 10, marginRight: 10, paddingHorizontal: 16,
			}}>
				<Text style={{color: isSelected ? Colors.white : Colors.black, fontSize: 18, }}>{item}</Text>
			</TouchableOpacity>
		)
	}

	const updateDataSource = () => {
		setDefaultTags([].concat(defaultTags))
	}

	const getCustomSetList = () => {
		let list = []
		customSet.forEach((_item,) => {
			list.push(_item)
		})

		return list
	}

	const renderCustomListView = () => {
		const list = getCustomSetList()
		if (!list.length) {
			return null
		}

		return (
			<View style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				marginHorizontal: 20,
				marginTop: 20,
				paddingBottom: 10
			}}>
				{list.map((item, index) => {
					return renderItem(item, index, TagType.custom)
				})}

				<SeparateLine style={{left: 0, right: 0,}}/>
			</View>
		)
	}

	const addCustomTag = () => {
		if (!customTag.length) {
			ToastMsg.show('Enter your custom tag.')
			return
		}
		setCustomTag('')
		clickItem(customTag, TagType.custom)
	}

	const renderDoneButton = () => {
		return (
			<TouchableOpacity onPress={() => {

			}} style={{
				position: 'absolute',
				right: 20, bottom: 50,
				height: 44, width: 44,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: Colors.white,
				borderRadius: 22
			}}>
				<Image style={{width: 40, height: 40}} source={require('../../../source/image/base/check-one.png')} />
			</TouchableOpacity>
		)
	}

	return (
		<SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
			<Text style={{fontSize: 32, marginTop: 20,
				marginBottom: 10,
				marginHorizontal: 20, color: Colors.black,
				fontWeight: 'bold'
			}}>{'My tags.'}</Text>

			<View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
				<View style={{flex: 1}}>
					<BaseTextInput
						textInputStyle={{textAlignVertical: 'top', height: 40, flex: 1}}
						value={customTag}
						blurOnSubmit={true}
						title = {'Add Tags#'}
						placeholder={'Enter your custom tag...'}
						placeholderTextColor={Colors.lightGray}
						multiline={true}
						maxLength={160}
						onChangeText={(text) => {
							setCustomTag((text + '').toString().trim())
						}}
					/>
				</View>

				<TouchableOpacity onPress={addCustomTag} style={{width: 50, height: 50, borderRadius: 25,
					marginRight: 20
				}}>
					<Image style={{width: 50, height: 50,}} source={require('../../../source/image/match/add-one.png')}/>
				</TouchableOpacity>
			</View>

			{renderCustomListView()}

			<ScrollView style={{flex: 1, marginTop: 20}} contentContainerStyle={{
				paddingHorizontal: 20, paddingBottom: 34, flexDirection: 'row',
				flexWrap: 'wrap'
			}}>
				{defaultTags.map((item, index) => {
					return renderItem(item, index, TagType.default)
				})}
			</ScrollView>

			<NavigatorDismissButton componentId={props.componentId}  type={NavigationType.push}/>
			{renderDoneButton()}
		</SafeAreaView>
	)
}

export default ProfileSetUpTagsViewController

const TagType = {
	default: 0,
	custom: 1
}
