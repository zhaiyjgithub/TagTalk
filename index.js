/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import ChatViewController from './src/components/chat/ChatViewController';
import MessageViewController from './src/components/chat/MessageViewController';
import {Colors, FontFamily} from './src/utils/styles';
import RecordVideoViewController from './src/components/chat/RecordVideoViewController';
import ContactsViewController from './src/components/contacts/ContactsViewController';
import ProfileViewController from './src/components/profile/ProfileViewController';
import MatchViewController from './src/components/match/MatchViewController';
import UniversalViewController from './src/components/universal/UniversalViewController';
import VideoPreview from './src/components/chat/VideoPreview';
import TestViewController from './src/components/baseComponents/TestViewController';
import GuideViewController from './src/components/signIn/GuideViewController'
import SignInViewController from './src/components/signIn/SignInViewController'
//

Navigation.registerComponent('MessageViewController', () => MessageViewController);
Navigation.registerComponent('ChatViewController', () => ChatViewController);
Navigation.registerComponent('RecordVideoViewController', () => RecordVideoViewController);
Navigation.registerComponent('ContactsViewController', () => ContactsViewController);
Navigation.registerComponent('ProfileViewController', () => ProfileViewController);
Navigation.registerComponent('MatchViewController', () => MatchViewController);
Navigation.registerComponent('UniversalViewController', () => UniversalViewController);
Navigation.registerComponent('VideoPreview', () => VideoPreview);
Navigation.registerComponent('TestViewController', () => TestViewController);
Navigation.registerComponent('GuideViewController', () => GuideViewController);
Navigation.registerComponent('SignInViewController', () => SignInViewController);
//

Navigation.events().registerAppLaunchedListener(() => {
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

  return

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
                  icon: require('./src/source/image/tab/chats.png'),
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
                  icon: require('./src/source/image/tab/contacts.png'),
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
                  icon: require('./src/source/image/tab/match.png'),
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
                  icon: require('./src/source/image/tab/universal.png'),
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
                  icon: require('./src/source/image/tab/profile.png'),
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
