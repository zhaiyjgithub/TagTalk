/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {FontFamily} from './src/utils/styles';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {RouterMapper} from './src/route/mapper';
import {Router} from './src/route/router';
import {CacheKey} from './src/utils/Enums';
import CacheTool from './src/utils/CacheTool';
import {Text, TextInput, TouchableOpacity} from 'react-native';

TouchableOpacity.defaultProps = TouchableOpacity.defaultProps || {};
TouchableOpacity.defaultProps.activeOpacity = 0.6;

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.fontFamily = FontFamily.helvetica

TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.fontFamily = FontFamily.helvetica

RouterMapper.run()

const storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
})
global.storage = storage
global.UserInfo = {}

Navigation.events().registerAppLaunchedListener(() => {
    Router.showTestPage()
    return
    CacheTool.load(CacheKey.userInfo, (response) => {
        let userInfo = JSON.parse(response)
      if (response && userInfo) {
        global.UserInfo = userInfo
        Router.showHomePage()
      }else {
        Router.showGuide()
      }
    }, () => {
      Router.showGuide()
    })
});
