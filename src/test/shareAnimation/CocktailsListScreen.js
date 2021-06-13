import React from 'react';
import { Platform, View , Image, TouchableOpacity, Text, SafeAreaView, ScrollView} from 'react-native';
import { NavigationComponent, Navigation } from 'react-native-navigation';
import CocktailsView from './CocktailsView';

import { CocktailItem } from './cocktails';
import {BaseNavigatorOptions} from '../../utils/Navigator';
import FastImage from 'react-native-fast-image';

const MULTIPLIER = 1.2;
const POP_MULTIPLIER = 1.0;
const LONG_DURATION = 540 * MULTIPLIER;
const SHORT_DURATION = 210 * MULTIPLIER;

const SPRING_CONFIG = { mass: 2, damping: 500, stiffness: 200 };

export default class CocktailsListScreen extends NavigationComponent {
	static options() {
		return {
			...Platform.select({
				android: {
					statusBar: {
						style: 'dark' ,
						backgroundColor: 'white',
					},
				},
			}),
			topBar: {
				title: {
					text: 'Cocktails',
				},
			},
		};
	}

	render() {
		const item  = {
				id: '5',
				name: 'Gimlet',
				image: `https://picsum.photos/id/${12 + 10}/400/400`,
				color: '#d3d6cf',
				ingredients: [
					{
						name: 'Gin',
						measurement: '75ml',
					},
					{
						name: 'Lime Juice',
						measurement: '30ml',
					},
					{
						name: 'Simple Syrup',
						measurement: '15ml',
					},
				],
				description: `The gimlet (pronounced with a hard 'g') is a cocktail typically made of 2 parts gin and 1 part lime juice. A 1928 description of the drink was: \"gin, a spot of lime, and soda.\" The description in the 1953 Raymond Chandler novel The Long Goodbye stated that \"a real gimlet is half gin and half Rose's lime juice and nothing else.\" This is in line with the proportions suggested by The Savoy Cocktail Book (1930), which specifies one half Plymouth Gin and one half Rose\'s Lime Juice Cordial. However, modern tastes are less sweet, and generally provide for at least two parts gin to one part of the lime and other non-alcoholic elements (see recipes below).`,
			}
		return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
			<FastImage
				style={{width: 120, height: 120, borderRadius: 8,
				}}
				source={{
					uri:  `https://picsum.photos/id/${12 + 10}/400/400`,
					priority: FastImage.priority.normal,
				}}
				resizeMode={FastImage.resizeMode.cover}
				nativeID={`image.from`}
			/>
			<TouchableOpacity onPress={() => {
				this.pushCocktailDetails(item)
			}} >
				<Text>{'push'}</Text>
			</TouchableOpacity>
		</View>
	}

	pushCocktailDetails = (item: CocktailItem) => {
		Navigation.showModal({
			component: {
				name: 'PostDetailViewController',
				passProps: {
					uri: item.image,
					id: item.id
				},
				options: {
					modalPresentationStyle: 'fullScreen',
					animations: {
						showModal: {
							sharedElementTransitions: [
								{
									fromId: `image.from`,
									toId: `image.to`,
									interpolation: {
										type: 'spring',
										...SPRING_CONFIG,
									},
									duration: 500
								},
							],
						},
						dismissModal: {
							sharedElementTransitions: [
								{
									fromId: `image.to`,
									toId: `image.from`,
									interpolation: {
										type: 'spring',
										...SPRING_CONFIG,
									},
									duration: 500
								},
							],
						},
					},
				},
			},
		});
	};
}
