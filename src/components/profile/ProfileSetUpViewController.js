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
	TouchableWithoutFeedback
} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput, {KeyboardType} from '../commonComponents/BaseTextInput';
import BaseButton from '../commonComponents/BaseButton';
import LoadingSpinner from '../commonComponents/LoadingSpinner';
import NavigatorDismissButton from '../commonComponents/NavigatorDismissButton';
import {exp} from 'react-native-reanimated';
import SeparateLine from '../commonComponents/SeparateLine';

const ProfileSetUpViewController = (props) => {
	const [isShowSpinner, setIsShowSpinner] = useState(false)
	const [dob, setDob] = useState('MM/DD/YYYY')
	const [bio, setBio] = useState('')

	const renderGenderView = () => {
		return (
			<View style={{width: '100%', paddingHorizontal: 20,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
				marginTop: 15, height: 50
			}}>
				{['Male', 'Female'].map((_item, idx,) => {
					return (
						<TouchableOpacity key={idx} style={{flexDirection: 'row', alignItems: 'center'}}>
							<Image style={{width: 15, height: 15, marginRight: 5, backgroundColor: 'red'}}/>
							<Text style={{fontSize: 16, color: Colors.gray}}>{_item}</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}

	const renderDOBView = () => {
		return(
			<View style={[{width: '100%', paddingHorizontal: 20,
				minHeight: 62
			}, {}]}>
				<Text style={{fontSize: 14, color: Colors.blue,
				}}>{'Date of your birthday#'}</Text>

				<View style={{width: '100%', justifyContent: 'center',
					marginVertical: 8, height: 30
				}}>
					<Text style={{fontSize: 18,
						color: Colors.black, paddingVertical: 0}}>{dob}</Text>
				</View>

				<SeparateLine />
			</View>
		)
	}

	return (
		<SafeAreaView style={{flex: 1,}}>
			<Text style={{fontSize: 32, marginVertical: 20,
				marginHorizontal: 20, color: Colors.black,
				fontWeight: 'bold'
			}}>{'Set up your profile.'}</Text>

			<View style={{width: '100%', marginTop: 30, alignItems: 'center'}}>
				<TouchableOpacity>
					<Image style={{width: 96, height: 96, backgroundColor: Colors.systemGray, borderRadius: 48,
						borderColor: Colors.blue, borderWidth: 2,
					}}/>
				</TouchableOpacity>

				<Text numberOfLines={1} style={{fontSize: 16, color: Colors.black, marginTop: 10,}}>{'Cath'}</Text>
			</View>

			{renderGenderView()}
			{renderDOBView()}

			<BaseTextInput
				textInputStyle={{textAlignVertical: 'top', height: 60}}
				blurOnSubmit={true}
				title = {'About me#'}
				placeholder={'Enter your Brief introduction '}
				multiline={true}
				maxLength={180}
				onChangeText={(text) => {

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
				didClick={() => {

				}
				}
			/>

			<NavigatorDismissButton componentId={props.componentId}/>
			<LoadingSpinner visible={isShowSpinner}/>
		</SafeAreaView>
	)
}

export default ProfileSetUpViewController
