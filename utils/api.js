'use strict';

/* api.js  公共类
    小程序的api接口集合 
 */ 

// var host_url = 'http://192.168.200.103:8000/flash/';
// var host_url = 'http://127.0.0.1:8000/flash/'; 
var host_url = 'https://www.12xiong.top/flash/';

function Request(options) {
    // url, data, success, fail, complete

    var data =  options.data
    if (data == undefined)
        data = {}
    data['session'] = wx.getStorageSync("session")  //每个请求都加session
    wx.request
        ({
            url: options.url,
            method: "GET",
            data: data,
            success: function (res) {
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
            },
        })
}


module.exports = {
    Request: Request,
    CARD_ALL: host_url + 'lite/card/all/',
    CARD_EXAMPLE: host_url + 'lite/my/example/',

    USER_LOGIN: host_url + 'lite/user/login/',
    CARD_ADD_CHAR: host_url + 'lite/card/add/char/',
    CARD_GET_LIST: host_url + 'lite/card/get_list/',
    CARD_SET_BY_LEVEL: host_url + 'lite/card/set/level_id/',
    CARD_SET_BY_TAG: host_url + 'lite/card/set/tag_id/',

    TAG_ADD: host_url + 'lite/tag/add/',

    DAY_INDEX: host_url + 'lite/day/index/',

    MY_INDEX: host_url + 'lite/my/index/',
    MY_SET_CLOCK: host_url + 'lite/my/set/clock/',
    MY_SET_LOGO: host_url + 'lite/my/set/logo/',

    UPLOAD_GET_TOKEN: host_url + 'lite/upload/get/token/',
    UPLOAD_CALLBACK: host_url + 'lite/upload/callback/',

    // DAY_INDEX: host_url + 'day365/my/set/clock/',

};

