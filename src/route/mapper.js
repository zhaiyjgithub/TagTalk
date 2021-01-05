import {Navigation} from 'react-native-navigation';
import MessageViewController from '../components/chat/MessageViewController';
import ChatViewController from '../components/chat/ChatViewController';
import ContactsViewController from '../components/contacts/ContactsViewController';
import ProfileViewController from '../components/profile/ProfileViewController';
import MatchViewController from '../components/match/MatchViewController';
import UniversalViewController from '../components/universal/UniversalViewController';
import VideoPreview from '../components/chat/VideoPreview';
import GuideViewController from '../components/signIn/GuideViewController';
import SignInViewController from '../components/signIn/SignInViewController';
import SignUpViewController from '../components/signIn/SignUpViewController';
import {Colors, FontFamily} from '../utils/styles';
import DBTestController from '../test/DBTestController';
const RouterMapper = {
	run() {
		Navigation.registerComponent('MessageViewController', () => MessageViewController);
		Navigation.registerComponent('ChatViewController', () => ChatViewController);
		Navigation.registerComponent('RecordVideoViewController', () => RecordVideoViewController);
		Navigation.registerComponent('ContactsViewController', () => ContactsViewController);
		Navigation.registerComponent('ProfileViewController', () => ProfileViewController);
		Navigation.registerComponent('MatchViewController', () => MatchViewController);
		Navigation.registerComponent('UniversalViewController', () => UniversalViewController);
		Navigation.registerComponent('VideoPreview', () => VideoPreview);
		Navigation.registerComponent('GuideViewController', () => GuideViewController);
		Navigation.registerComponent('SignInViewController', () => SignInViewController);
		Navigation.registerComponent('SignUpViewController', () => SignUpViewController);
		Navigation.registerComponent('DBTestController', () => DBTestController);
	},
}

export {RouterMapper}

