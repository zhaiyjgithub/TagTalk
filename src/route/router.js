import {Navigation} from 'react-native-navigation';
import MessageViewController from '../components/chat/MessageViewController';
import ContactsViewController from '../components/contacts/ContactsViewController';
import ProfileViewController from '../components/profile/ProfileViewController';
import MatchViewController from '../components/match/MatchViewController';
import UniversalViewController from '../components/universal/UniversalViewController';
import GuideViewController from '../components/signIn/GuideViewController';
import {Colors, FontFamily} from '../utils/styles';

const Router = {
	showGuide() {
		Navigation.setDefaultOptions({
			topBar: {
				visible: false,
			},
		});
		Navigation.setRoot({
			root: {
				stack: {
					children: [
						{
							component: {
								name: 'GuideViewController'
							}
						}
					]
				}
			}
		});
	},
	showHomePage() {
		Navigation.setDefaultOptions({
			topBar: {
				drawBehind: false,
				leftButtonColor: Colors.black,
				rightButtonColor: Colors.black,
				title: {
					color: Colors.black,
					fontSize: 24,
					fontFamily: 'Helvetica'
				},
				backButton: {
					color: Colors.black,
					showTitle: false
				}
			},
		});

		MessageViewController.options = {
			topBar: {
				title: {
					text: 'Chats'
				}
			}
		}

		ContactsViewController.options = {
			topBar: {
				title: {
					text: 'Contacts'
				}
			}
		}

		MatchViewController.options = {
			topBar: {
				title: {
					text: 'Match'
				}
			}
		}

		UniversalViewController.options = {
			topBar: {
				title: {
					text: 'Universal'
				}
			}
		}

		ProfileViewController.options = {
			topBar: {
				title: {
					text: 'Profile'
				}
			}
		}

		Navigation.setRoot({
			root: {
				bottomTabs: {
					children: [
						{
							stack: {
								children: [{
									component: {
										name: 'MessageViewController',
										passProps: {
											text: 'This is tab 1'
										}
									}
								}],
								options: {
									bottomTab: {
										text: 'Chats',
										icon: require('../source/image/tab/chats.png'),
										testID: 'finder',
										fontFamily: FontFamily.helvetica,
										selectedTextColor: Colors.black,
										selectedIconColor: Colors.black,
									}
								}
							}
						},
						{
							stack: {
								children: [{
									component: {
										name: 'ContactsViewController',
										passProps: {
											text: 'This is tab 1'
										}
									}
								}],
								options: {
									bottomTab: {
										text: 'Contacts',
										icon: require('../source/image/tab/contacts.png'),
										testID: 'Universal',
										fontFamily: FontFamily.helvetica,
										selectedTextColor: Colors.black,
										selectedIconColor: Colors.black,
									},
								}
							}
						},
						{
							stack: {
								children: [{
									component: {
										name: 'MatchViewController',
										passProps: {
											text: 'This is tab 1'
										}
									}
								}],
								options: {
									bottomTab: {
										text: 'Match',
										icon: require('../source/image/tab/match.png'),
										testID: 'Universal',
										fontFamily: FontFamily.helvetica,
										selectedTextColor: Colors.black,
										selectedIconColor: Colors.black,
									},
								}
							}
						},
						{
							stack: {
								children: [{
									component: {
										name: 'UniversalViewController',
										passProps: {
											text: 'This is tab 1'
										}
									}
								}],
								options: {
									bottomTab: {
										text: 'Universal',
										icon: require('../source/image/tab/universal.png'),
										testID: 'Universal',
										fontFamily: FontFamily.helvetica,
										selectedTextColor: Colors.black,
										selectedIconColor: Colors.black,
									},
								}
							}
						},
						{
							stack: {
								children: [{
									component: {
										name: 'ProfileViewController',
										passProps: {
											text: 'This is tab 1'
										}
									}
								}],
								options: {
									bottomTab: {
										text: 'Profile',
										icon: require('../source/image/tab/profile.png'),
										testID: 'Universal',
										fontFamily: FontFamily.helvetica,
										selectedTextColor: Colors.black,
										selectedIconColor: Colors.black,
									},
								}
							}
						}
					]
				},
			}
		})
	}
}

export {Router}
