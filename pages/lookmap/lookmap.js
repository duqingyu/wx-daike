// pages/lookmap/lookmap.js
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    time: '',
    Height: 0,
    scale: 17,
    latitude: "",
    longitude: "",
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
     this.setData({
       id:id
     })
     if(options.currentTab == 0){
       console.log('查看快递骑手实时位置')
       this.getmap();
     }
     else if (options.currentTab == 1){
       console.log('查看外卖骑手实时位置')
       this.getmap1();
     }
  },
  getmap:function(){
    var that = this;
    var id = that.data.id;
    var timer = setInterval(int,5000)
  function int(){
    //退出页面清楚定时器
    if(that.data.time == -1){
      console.log('定时器已经关闭')
      clearInterval(timer);
    }

    var query = new AV.Query('allorder');
    query.equalTo('objectId', id);
    query.find().then(function (results) {
      // console.log(results)
      that.setData({
        latitude: results[0].attributes.latitude,
        longitude: results[0].attributes.longitude,
        markers: [{
          id: "1",
          latitude: results[0].attributes.latitude,
          longitude: results[0].attributes.longitude,
          width: 22,
          height: 22,
          iconPath: "/images/2.jpg",
          title: "骑手"
        }]
      })

    }, function (error) {
    });
  }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }

        })
      }
    })
  },
  getmap1: function () {
    var that = this;
    var id = that.data.id;
    var timer = setInterval(int, 5000)
    function int() {
      //退出页面清楚定时器
      if (that.data.time == -1) {
        console.log('定时器已经关闭')
        clearInterval(timer);
      }
      var query = new AV.Query('foodorder');
      query.equalTo('objectId', id);
      query.find().then(function (results) {
        // console.log(results)
        that.setData({
          latitude: results[0].attributes.latitude,
          longitude: results[0].attributes.longitude,
          markers: [{
            id: "1",
            latitude: results[0].attributes.latitude,
            longitude: results[0].attributes.longitude,
            width: 22,
            height: 22,
            iconPath: "/images/2.jpg",
            title: "骑手"
          }]
        })

      }, function (error) {
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      time:-1
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})