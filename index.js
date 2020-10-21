/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import ChatViewController from './src/components/chat/ChatViewController';
import MessageViewController from './src/components/chat/MessageViewController';
import {Colors, FontFamily} from './src/utils/styles';
import RecordVideoViewController from './src/components/chat/RecordVideoViewController';
import ContactsViewController from './src/components/contacts/ContactsViewController';

Navigation.registerComponent('MessageViewController', () => MessageViewController);
Navigation.registerComponent('ChatViewController', () => ChatViewController);
Navigation.registerComponent('RecordVideoViewController', () => RecordVideoViewController);
Navigation.registerComponent('ContactsViewController', () => ContactsViewController);
//

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
    }
  }

  ContactsViewController.options = {
    topBar: {
      title: {
        text: 'Contacts'
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
                  icon: require('./src/source/image/tab/universal.png'),
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
                  icon: require('./src/source/image/tab/universal.png'),
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
});
