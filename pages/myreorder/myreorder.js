// pages/myreorder/myreorder.js
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({
  data: {
  myreorder:'',
  foodlist:'',
  fesh: false,
  currentTab: 0,
  containerHeight:'',
  containerHeight1: '',
  avatar:''
  },
  onReady: function () {
    var that = this;
    //加载中..
    wx.showToast({
      title: '加载中...',
      duration: 2000,
      icon: 'loading'
    })
    wx.getStorage({
      key: 'user',
      success: function (res) {
        var avatar = res.data.avatarUrl;
        //根据唯一头像查询
        that.getdata(avatar)
      }
    })
  },
  //顶部导航改变
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    //获取接的外卖订单的数据
    if (e.detail.current == "1") {
      //只加载状态为未被接单的数据给用户接单
      var query = new AV.Query('foodorder');
      query.equalTo('reavatar', that.data.avatar);
      query.find().then(function (res) {
        //将最新数据放在最上面
        var data = res.reverse()
        //设置数据
        that.setData({
          foodlist: data,
          containerHeight:res.length * 460
        })
      }).then(function (res) {
        // 更新成功
        console.log('获取所有外卖订单成功')
      }, function (error) {
        // 异常处理
        console.log('获取所有外卖订单失败')
      });
    }
    else if(e.detail.current == "0"){
       that.setData({
         containerHeight:that.data.containerHeight1
       })
    }
  },
  //点击顶部导航改变
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }, 
   //获取数据
   getdata:function(avatar){
     var that = this;
     var query = new AV.Query('allorder');
     query.equalTo('reavatar', avatar);
     query.find().then(function (results) {
       //将最新数据放在最上面
        var data = results.reverse()
       that.setData({
         myreorder: data,
         avatar:avatar,
         containerHeight:results.length * 460,//430
         containerHeight1:results.length * 460,//430
       })
       console.log(that.data.myreorder)
     }, function (error) {
     });
   },
   //拨打电话-快递
   callphone:function(e){
      var phonenum = this.data.myreorder[e.target.id].attributes.phone;
      wx.makePhoneCall({
        phoneNumber: phonenum,
           success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
   },
   //拨打电话-外卖
   callphone1: function (e) {
     var phonenum = this.data.foodlist[e.target.id].attributes.phone;
     wx.makePhoneCall({
       phoneNumber: phonenum,
       success: function () {
         console.log("拨打电话成功！")
       },
       fail: function () {
         console.log("拨打电话失败！")
       }
     })
   },
   tomap:function(e){
     
     var currentTab = this.data.currentTab;
     if(currentTab == 0){
       var id = this.data.myreorder[e.target.id].id;
       wx.navigateTo({
         url: '../map/map?id=' + id + '&currentTab=' + currentTab,
       })
     }
     else if(currentTab == 1){
       var id1 = this.data.foodlist[e.target.id].id;
       wx.navigateTo({
         url: '../map/map?id=' + id1 + '&currentTab=' + currentTab,
       })
     }
   },
})