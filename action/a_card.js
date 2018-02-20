


var KEY = require('../utils/key.js');
var APP = getApp()



// var that  
module.exports = {
    Card: Card,
}

function Card(_GP) {
    this.GP = _GP
    this.level = KEY.STRANGER
    this.Init = function () { 
        var storageCardList = wx.getStorageSync(KEY.CARD_LIST)
        if (storageCardList == "") {
            storageCardList = []
            //TODO 添加默认的导航卡
            var timestamp = new Date().getTime()
            var card_obj = {
                card_id: timestamp,
                is_face: true,
                face_title: '点击翻面',
                back_explain: '背单词么？\n记住的拖往右！\n忘记的拖往左！\n多来几次就记住了^_^',
                level: KEY.STRANGER,
                is_upload: false,
            }
            storageCardList.push(card_obj)
            // this.Add(card_obj, KEY.STRANGER)
            //本地存储
            wx.setStorageSync(KEY.CARD_LIST, storageCardList)
        }

        var cardList = []
        // for (var i = 0; i < storageCardList.length; i++)
        for (var i = storageCardList.length -1 ; i >= 0; i --)
            if (storageCardList[i].level == this.level)
                cardList.push(storageCardList[i])
        
        this.GP.setData({
            cardList: cardList,
            firstCard: cardList.length == 0 ? '' : cardList[0],
            cardIndex:0,
            stepNum:0,
        })
       
        this.UpdateBarTitle()
     
    }
    // 更新窗口
    this.UpdateBarTitle = function(){
        var _key = ""
        if (this.level == KEY.STRANGER) _key = "陌生"
        else if (this.level == KEY.UNSURE) _key = "巩固"
        else _key = "牢记"
        var _storageCardList = wx.getStorageSync(KEY.CARD_LIST)
        var _cardList = this.GP.data.cardList
        wx.setNavigationBarTitle({
            title: '卡片总数：' + _storageCardList.length + ' （' + _key + '：' + _cardList.length + "）"
        })
    }

    // 存在判断
    this.Exist = function (cardID) {
        var _cardList = wx.getStorageSync(KEY.CARD_LIST)
        for(var i=0;i<_cardList.length;i++)
            if( _cardList[i].card_id == cardID)
                return true
        return false
    }
    //1 增加新卡片
    this.Add = function (card_obj, level_int) {
        var card_list = wx.getStorageSync(KEY.CARD_LIST)
        card_list.push(card_obj)
        wx.setStorageSync(KEY.CARD_LIST, card_list)
    }


    // 卡片点击--下一级别
    this.clickYes = function () {
        if (this.level == KEY.STRANGER)
            this.changeLevel(KEY.UNSURE)
        if (this.level == KEY.UNSURE)
            this.changeLevel(KEY.SURE)
        if (this.level == KEY.SURE)
            this.changeNext()
    }

    // 卡片点击--陌生
    this.clickNo = function () { 

        if (this.level == KEY.STRANGER)
            this.changeNext()
        if (this.level == KEY.UNSURE)
            this.changeLevel(KEY.STRANGER)
        if (this.level == KEY.SURE)
            this.changeLevel(KEY.STRANGER)
    }

    // 卡片点击 -- 翻牌
    this.changeFace = function (card_id) {

    }

    // 不改变等级，翻下一张
    this.changeNext = function(){
        console.log("next")
        var _nextIndex = this.GP.data.cardIndex + 1
        var _stepNum = this.GP.data.stepNum  //卡牌编号
        var _firstCard
        if (_nextIndex < this.GP.data.cardList.length ){
            _firstCard = this.GP.data.cardList[_nextIndex]
            _stepNum++
        }
        else {
            _nextIndex = 0
            _firstCard = this.GP.data.cardList[0]
            _stepNum = 0
            wx.showToast({
                icon:"none",
                title: 'Again',
                duration:800
            })
        }
        this.GP.setData({
            cardIndex: _nextIndex,
            firstCard: _firstCard,
            stepNum: _stepNum,
        })
    }

    //3 更换级别
    this.changeLevel = function ( new_level_int) {
        var _cardIndex = this.GP.data.cardIndex
        var _cardList = this.GP.data.cardList
        //移除当前page 的列表
        // var pageIndex = _getIndex(card_id, _cardList)
        console.log(1, _cardList[_cardIndex])
        console.log(2, _cardList[_cardIndex].card_id)
        var _cardID = _cardList[_cardIndex].card_id
        _removeValByIndex(_cardList, _cardIndex)

        this.GP.setData({
            cardList: _cardList,
            firstCard: _cardList.length == 0 ? '' : _cardList[_cardIndex],
            stepNum: this.GP.data.stepNum+1  //更新左上角序号
        }) 
        
        //改变总数据的level
        var _storageCardList = wx.getStorageSync(KEY.CARD_LIST)
        var _storageIndex = _getIndex(_cardID, _storageCardList)
        _storageCardList[_storageIndex].level = new_level_int
        wx.setStorageSync(KEY.CARD_LIST,  _storageCardList )
        this.UpdateBarTitle()
    }

    // 获取card 的位置
    function _getIndex(card_id, list) {
        for (var i = 0; i < list.length; i++)
            if (card_id == list[i].card_id)
                return i
        return false
    }

    // 移除数组
    function _removeValByIndex(arr, index) {
        arr.splice(index, 1);
    }


    // 模式按钮点击--改变级别
    this.setLevel = function (level) { 
        this.level = level
    }

    // 删除按钮点击 -- 删除
    this.deleteCard = function () {

        var _cardIndex = this.GP.data.cardIndex
        var _cardList = this.GP.data.cardList
        //移除当前page 的列表
        // var pageIndex = _getIndex(card_id, _cardList)
        var _cardID = _cardList[_cardIndex].card_id
        _removeValByIndex(_cardList, _cardIndex)
        if (_cardIndex < _cardList.legth){
            this.GP.setData({
                cardList: _cardList,
                firstCard: _cardList.length == 0 ? '' : _cardList[_cardIndex],
                stepNum: this.GP.data.stepNum + 1  //更新左上角序号
            })
        }else{
            _cardIndex = 0
            this.GP.setData({
                cardList: _cardList,
                cardIndex:0,
                firstCard: _cardList.length == 0 ? '' : _cardList[_cardIndex],
                stepNum:  0  //更新左上角序号
            })
        }

        //删除数据库
        var _cardList = wx.getStorageSync(KEY.CARD_LIST)
        var _storageIndex = _getIndex(_cardID, _cardList)
        _removeValByIndex(_cardList, _storageIndex)
        wx.setStorage({
            key: KEY.CARD_LIST,
            data: _cardList
        })
        //成功提示
        wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 500
        })
        this.UpdateBarTitle()
    }

}
























function Card1(_GP,level) {
    // that = this
    this.GP = _GP
    this.level = level
    this.Init = function () {
        // wx.setStorageSync(KEY.CARD_LIST, this.GP.data.coverList)
        var card_list = wx.getStorageSync(KEY.CARD_LIST)
        if (card_list == ""){
            card_list = []
            wx.setStorageSync(KEY.CARD_LIST,[])
        }

        var cover_list = []
        for (var i = 0 ; i<card_list.length ; i++)
            if (card_list[i].level == this.level)
                cover_list.push(card_list[i] )
        
        this.GP.setData({
            coverList: cover_list
        })
    }
    this.Init()

    //1 增加新卡片
    this.Add = function (card_obj, level_int) {
        var card_list = wx.getStorageSync(KEY.CARD_LIST)
        card_list.push(card_obj)
        wx.setStorageSync(KEY.CARD_LIST,card_list)

        _setAppChange(level_int)
    }
    //2 翻转
    this.ChangeFace = function (card_id, new_level_int) {
        var coverList = this.GP.data.coverList
        var index = _getIndex(card_id, coverList)
        coverList[index].is_face = !coverList[index].is_face
        this.GP.setData({
            coverList: coverList
        })
    }

    // 3 打开栏目菜单
    this.OnMenu = function(e ,itemList ){
        var card_id = e.currentTarget.dataset.card_id
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                if (res.tapIndex == 0)
                    _SetLevel(card_id, KEY.STRANGER, _GP)  //设置卡片级别
                else if (res.tapIndex == 1)
                    _SetLevel(card_id, KEY.UNSURE, _GP)
                else if (res.tapIndex == 2)
                    _SetLevel(card_id, KEY.SURE, _GP)
                else {
                    var face_title = e.currentTarget.dataset.face_title
                    var back_explain = e.currentTarget.dataset.back_explain
                    wx.showModal({
                        title: '即将删除',
                        content: '确定删除卡片：' + face_title + " < " + back_explain + " > ",
                        success: function (res) {
                            if (res.confirm) {
                                _Delete(card_id, _GP)
                            }
                        }
                    })
                }
            }
        })
    }



    //3 更换级别
    function _SetLevel(card_id,new_level_int , _GP) {
        //移除当前page 的列表
        _removeCover(card_id, _GP)
        //改变总数据的level
        var card_list = wx.getStorageSync(KEY.CARD_LIST)
        var storageIndex = _getIndex(card_id, card_list)
        card_list[storageIndex].level = new_level_int
        wx.setStorage({
            key:KEY.CARD_LIST,
            data:card_list
        })
        //用于类别onshow刷新检测
        _setAppChange(new_level_int)

        //成功提示
        wx.showToast({
            title: '移动成功',
            icon: 'success',
            duration: 1500
        })
    }
    
    // 设置APP改变的级别
    function _setAppChange(current_level){
        if (current_level== KEY.STRANGER)
            APP.globalData.isStrangerChange = true
        if (current_level == KEY.UNSURE)
            APP.globalData.isUnsuerChange = true
        if (current_level== KEY.SURE)
            APP.globalData.isSureChange = true
    }

    //3 删除
    function _Delete (card_id, _GP) {
        _removeCover(card_id, _GP)
        var card_list = wx.getStorageSync(KEY.CARD_LIST)
        var storageIndex = _getIndex(card_id, card_list)
        _removeValByIndex(card_list, storageIndex)
        wx.setStorage({
            key: KEY.CARD_LIST,
            data: card_list
        })
        //成功提示
        wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
        })
    }

    //11 移除展示的元素
    function _removeCover(card_id,_GP){
        var coverList = _GP.data.coverList
        //移除当前page 的列表
        var pageIndex = _getIndex(card_id, coverList)
        _removeValByIndex(coverList, pageIndex)
        _GP.setData({
            coverList: coverList
        })
    }

    //4 根据level，获取coverList
    this.GetCoverListByLevel = function (level_int) {

    }


    // 获取card 的位置
    function _getIndex( card_id , list ){
        for (var i = 0; i < list.length; i++)
            if (card_id == list[i].card_id)
                    return i
            return false
    }
    
    // 移除数组
    function _removeValByIndex(arr, index) {
        arr.splice(index, 1);
    }
}

