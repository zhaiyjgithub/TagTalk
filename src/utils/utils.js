import {Dimensions, Platform} from 'react-native';

const PLATFORM = {
    isIOS: Platform.OS === "ios",
    isAndroid: Platform.OS === "android",
    isPad: (Platform.OS && Platform.isPad),
    isIPhoneX: (Platform.OS === "ios" && !Platform.isPad && ((Dimensions.get('window').height) >=812))
};

const TimeFormat = {
    YYYYMMDD: 'YYYY-MM-DD',
    MMDDYYYY: 'MM/DD/YYYY',
    YYYYMMDDHHmmss: 'YYYY-MM-DD HH:mm:ss',
    YYYYMMDDTHHmmss: 'YYYY-MM-DDTHH:mm:ss',
    MMDDYYYYHHmmss: 'MM/DD/YYYY HH:mm:ss',
    HHmmMMDDYYYY: 'HH:mm MM/DD/YYYY',
    MMDDYYYYHHmm: 'MM/DD/YYYY HH:mm',
    HHmmMMDD: 'HH:mm MM/DD',
    HHmm: 'HH:mm'
}

const Gender = {
    unknown: 0,
    male: 1,
    female: 2
}

const Utils = {
    VerifyEmail(email) {
        let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return (pattern.test(email))
    },
    Log(msg) {
        console.log(msg)
    },
    GetDateTimeISO() {
        return (new Date()).toISOString()
    },
    GenerateFileName(chatId, fileName) {
        return chatId+ (new Date).getSeconds() + fileName
    }

}



export {
    Utils,
    PLATFORM,
    TimeFormat,
    Gender
}

