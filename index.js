/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
// import {AppRegistry} from 'react-native';
import App from './App';
import ChatViewController from './src/components/chat/ChatViewController';
import MessageViewController from './src/components/chat/MessageViewController';
// import {name as appName} from './app.json';
//
// AppRegistry.registerComponent(appName, () => App);

Navigation.registerComponent('com.myApp.WelcomeScreen', () => MessageViewController);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.myApp.WelcomeScreen',
            },
          },
        ],
      },
    },
  });
});
