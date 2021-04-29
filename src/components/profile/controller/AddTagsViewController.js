import React, {Component} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../utils/styles';
import BaseTextInput from '../../commonComponents/BaseTextInput';
import ToastMsg from '../../../utils/ToastMsg';
import SeparateLine from '../../commonComponents/SeparateLine';
import NavigatorDismissButton, {NavigationType} from '../../commonComponents/NavigatorDismissButton';
import {PLATFORM} from '../../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import ProfileService from '../service/ProfileService';

const MaxSetSize = 20

export default class AddTagsViewController extends Component{
	static defaultProps = {
		tags: [],
		isShowLargeTitle: true,
	}
	constructor(props) {
		super(props);
		this.state = {
			defaultTags: [
				'Adventure', 'Animal', 'Dancing',
				'Foreign culture', 'Hitchiking', 'Local food',
				'Making new friends', 'Outdoor activities', 'Plants-based food',
				'Sightseeing', 'Spirituality', 'Science', 'Sports', 'Yoga'
			],
			customTag: '',
		}

		const customList = this.filterPropsTags(props.tags, this.state.defaultTags)
		this.selectedSet = new Set(props.tags)
		this.customSet = new Set(customList)

		this.profileService = new ProfileService()
	}

	filterPropsTags = (tags, defaultTags) => {
		let customList = []
		let dSet = new Set(defaultTags)
		tags.forEach((_tag,) => {
			if (!dSet.has(_tag)) {
				customList.push(_tag)
			}
		})
		return customList
	}

	addToSet = (item) => {
		this.selectedSet.add(item)
	}

	removeFromSet = (item) => {
		this.selectedSet.delete(item)
	}

	addToCustomSet = (item) => {
		this.customSet.add(item)
	}

	removeFromCustomSet = (item) => {
		this.customSet.delete(item)
	}

	clickItem = (item, type) => {
		if (this.selectedSet.has(item)) {
			this.removeFromSet(item)
			if (type === TagType.custom) {
				this.removeFromCustomSet(item)
			}
		}else {
			if (this.selectedSet.size < MaxSetSize) {
				this.addToSet(item)
				if (type === TagType.custom ) {
					this.addToCustomSet(item)
				}
			}else {
				ToastMsg.show('Max 20 tags limited.')
				return
			}
		}
		this.updateDataSource()
	}

	renderItem = (item, idx, type) => {
		const isSelected = this.selectedSet.has(item)
		return (
			<TouchableOpacity onPress={() => {
				this.clickItem(item, type)
			}} key={idx} style={{height: 40, borderRadius: 20, backgroundColor: isSelected ? Colors.blue : Colors.systemGray, justifyContent: 'center',
				marginTop: 8, marginRight: 8, paddingHorizontal: 16,
			}}>
				<Text style={{color: isSelected ? Colors.white : Colors.black, fontSize: 18, fontWeight: '500'}}>{item}</Text>
			</TouchableOpacity>
		)
	}

	updateDataSource = () => {
		const {defaultTags} = this.state
		this.setState({defaultTags: [].concat(defaultTags)})
	}

	getCustomSetList = () => {
		let list = []
		this.customSet.forEach((_item,) => {
			list.push(_item)
		})

		return list
	}

	renderCustomListView = () => {
		const list = this.getCustomSetList()
		if (!list.length) {
			return null
		}

		return (
			<View style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				marginHorizontal: 24,
				marginTop: 8,
				paddingBottom: 16
			}}>
				{list.map((item, index) => {
					return this.renderItem(item, index, TagType.custom)
				})}

				<SeparateLine style={{left: 0, right: 0,}}/>
			</View>
		)
	}

	addCustomTag = () => {
		const { customTag, defaultTags } = this.state
		if (!customTag.length) {
			ToastMsg.show('Enter your custom tag.')
			return
		}

		this.setState({customTag: ''}, () => {
			let index = defaultTags.findIndex((_tag) => {
				return _tag === customTag
			})

			const type = index === -1 ? TagType.custom : TagType.default
			this.clickItem(customTag, type)
		})
	}

	updateTags = () => {
		let list = []
		this.selectedSet.forEach((_item,) => {
			list.push(_item)
		})

		const {ChatID} = ACCOUNT
		this.profileService.updateTags(ChatID, list, () => {
			const {onSuccess} = this.props
			onSuccess && onSuccess()
			Navigation.pop(this.props.componentId)
		}, () => {})
	}

	renderDoneButton = () => {
		return (
			<TouchableOpacity onPress={this.updateTags} style={{
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

	render() {
		const {defaultTags, customTag} = this.state
		const {isShowLargeTitle} = this.props
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
				{isShowLargeTitle ? (<Text style={{fontSize: 32, marginTop: 16,
					marginBottom: 10,
					marginHorizontal: 20, color: Colors.black,
					fontWeight: 'bold'
				}}>{'My tags.'}</Text>) : null}
				<View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
					<View style={{flex: 1}}>
						<BaseTextInput
							textInputStyle={{textAlignVertical: 'top', height: 40, flex: 1}}
							value={customTag}
							blurOnSubmit={true}
							title = {'Add Tags#'}
							placeholder={'Enter your custom tag...'}
							placeholderTextColor={Colors.lightGray}
							numberOfLines={1}
							onChangeText={(text) => {
								this.setState({customTag: (text + '').toString()})
							}}
						/>
					</View>

					<TouchableOpacity onPress={this.addCustomTag} style={{width: 50, height: 50, borderRadius: 25,
						marginRight: 20
					}}>
						<Image style={{width: 40, height: 40,}} source={require('../../../source/image/base/add-one.png')}/>
					</TouchableOpacity>
				</View>

				{this.renderCustomListView()}

				<ScrollView style={{flex: 1, marginTop: 20}} contentContainerStyle={{
					paddingHorizontal: 20, paddingBottom: 34, flexDirection: 'row',
					flexWrap: 'wrap'
				}}>
					{defaultTags.map((item, index) => {
						return this.renderItem(item, index, TagType.default)
					})}
				</ScrollView>

				<NavigatorDismissButton componentId={this.props.componentId}  type={NavigationType.push}/>
				{this.renderDoneButton()}
			</SafeAreaView>
		)
	}
}

const TagType = {
	default: 0,
	custom: 1
}
