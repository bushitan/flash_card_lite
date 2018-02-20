

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
var intervarID ;
const options = {
    duration: 60000,//指定录音的时长，单位 ms
    sampleRate: 16000,//采样率
    numberOfChannels: 1,//录音通道数
    encodeBitRate: 96000,//编码码率
    format: 'mp3',//音频格式，有效值 aac/mp3
    frameSize: 50,//指定帧大小，单位 KB
}
function Init(GP) {
    recorderManager.onStart(() => {
        console.log('recorder start')
        SetCountDown(GP)
    });
    recorderManager.onStop((res) => {
        this.tempFilePath = res.tempFilePath;
        console.log('停止录音', res.tempFilePath)
        const { tempFilePath } = res
        // GP.setData({
        //     isAbleUpload: true,  //录音停止可以上传
        // })
        clearInterval(intervarID); //清楚倒计时
    })
    //错误回调
    recorderManager.onError((res) => {
        console.log(res);
    })
}

function Start() {
    recorderManager.start(options);
}


function Stop() {
    recorderManager.stop();
}


function Play() {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
    innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
    })
}

function SetCountDown(GP){
    var leftTime = 60
    intervarID = setInterval(function () {
        GP.setData({
            clock: '录音倒计时：' + leftTime + "秒"
        })
        leftTime = leftTime - 1
        if (leftTime == 0) {
            clearInterval(intervarID);
        }
    }, 1000
    )
}

function GetAudioFile(){
    return this.tempFilePath
}

module.exports = {
    Init: Init,
    Start: Start,
    Stop:Stop,
    Play:Play,
    GetAudioFile: GetAudioFile
}   


