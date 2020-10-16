/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import ChatViewController from './src/components/chat/ChatViewController';
import MessageViewController from './src/components/chat/MessageViewController';
import {Colors} from './src/utils/styles';

Navigation.registerComponent('MessageViewController', () => MessageViewController);
Navigation.registerComponent('ChatViewController', () => ChatViewController);

Navigation.events().registerAppLaunchedListener(() => {
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
    },
  }

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'MessageViewController',
            },
          },
        ],
      },
    },
  });
});
