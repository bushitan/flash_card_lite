

var API = require('api.js');

var APP = getApp()
var IMAGE = 0, AUDIO = 1,VIDEO = 2
/**
 * 获取token
 */
function UploadFile(GP, data,file_path){
   
    API.Request({
        "url": API.UPLOAD_GET_TOKEN,
        "data": data,
        // {
            // "type": _type,
            // "category_id": _tempCatId,
        // },
        "success":function(res){
            var data = res.data
            console.log(data)
            UpStream(GP,data.key, data.token,file_path)
        },
        "fail":function(res){
        },
        complete: function (res) {
            // GP.setData({ isUpload: false })
        },
    })


}

/**上传流 */
function UpStream(GP,key, token, file_path){


    if (GP.uploadStartAction != undefined)
        GP.uploadStartAction()
    wx.uploadFile({
        url: 'https://up.qbox.me',
        // filePath: tempFilePaths[0],//图片
        filePath: file_path,//小视频
        name: 'file',
        formData: {
            'key': key,
            'token': token,
        },
        success: function (res) {
            // var data = JSON.parse(res.data);
            if (GP.uploadSuccessAction != undefined)
                GP.uploadSuccessAction(res)
            
        },
        fail(error) {
            if (GP.uploadFailAction != undefined)
                GP.uploadFailAction()
        },
    })
}




/**
 * 上传图片
 */
function UploadImage(GP) {
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: function (res) {
            console.log(res.tempFilePaths[0] )
            var path = res.tempFilePaths[0]

            var data = {
                "style": IMAGE,
                "suffix": path.split(".").pop()
            }
            
            UploadFile(GP, data, path )
        },
        fail: function (res) {
            console.log(res)
        }
    })
}

/**
 * 上传音频
 */
function UploadAudio(GP, path) {
    console.log(path)
    // UploadFile(GP, tempFilePath)
    var data = {
        "style": AUDIO,
        "suffix": path.split(".").pop()
    }

    UploadFile(GP, data, path)
}


/**
 * 上传视频
 */
function UploadVideo(GP) {

    wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: ['front', 'back'],
        success: function (res) {
            var path = res.tempFilePath
            var data = {
                "style": VIDEO,
                "suffix": path.split(".").pop()
            }
            UploadFile(GP, data, path)
        },
        fail: function (res) {
            console.log(res)
        }
    })
}



module.exports = {
    UploadFile: UploadFile,
    UploadImage: UploadImage,
    UploadAudio: UploadAudio,
    UploadVideo: UploadVideo,
}





