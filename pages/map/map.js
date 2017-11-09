// pages/map/map.js
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({

  data: {
  id:'',
  time:'',
  Height: 0,
  scale: 18,
  latitude: "",
  longitude: "",
  markers: [],
  },

  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    var id = options.id;
    //如果是快递-进来的
    if(options.currentTab == 0){
    wx.getLocation({
      success: function (res) {
        var cql = 'update allorder set latitude=' + '"' + res.latitude + '",' + 'longitude=' + '"' + res.longitude + '"' + ' where objectId=' + '"' + id + '"';
        console.log(cql)
        AV.Query.doCloudQuery(cql)
          .then(function (data) {
            console.log('快递-数据更新更改')
          }, function (error) {
            // 异常处理
            console.error(error);
          });
      },
    })   
    this.toposition();
    }
    //如果是外卖-进来的
    else if(options.currentTab == 1){
      wx.getLocation({
        success: function (res) {
          var cql = 'update foodorder set latitude=' + '"' + res.latitude + '",' + 'longitude=' + '"' + res.longitude + '"' + ' where objectId=' + '"' + id + '"';
          console.log(cql)
          AV.Query.doCloudQuery(cql)
            .then(function (data) {
              console.log('外卖-数据更新更改')
            }, function (error) {
              // 异常处理
              console.error(error);
            });
        },
      }) 
      this.toposition1(); 
    }
  },

  toposition:function(){
    console.log('进入快递骑手实时定位')
  var that = this;
  var id = that.data.id;
  var timer = setInterval(int,5000)
 

  function int(){
    if (that.data.time == -1) {
      console.log('定时器已经关闭')
      clearInterval(timer)
    }
    wx.getLocation({
      success: function (res) {
        var cql = 'update allorder set latitude=' + '"' + res.latitude + '",' + 'longitude=' + '"' + res.longitude + '"' + ' where objectId=' + '"' + id + '"';
       // console.log(cql)

        //设置markers 
        that.setData({
          latitude: res.latitude,
          longitude:res.longitude,
            markers: [{
              id: "1",
              latitude: res.latitude,
              longitude: res.longitude,
              width: 22,
              height: 22,
              iconPath: "/images/2.jpg",
              title: "骑手"
            }]
      })

       //return false;
        AV.Query.doCloudQuery(cql)
          .then(function (data) {
            console.log('数据更新更改')
          }, function (error) {
            // 异常处理
            console.error(error);
          });
      },
    })
  }
  },
  onShow:function(){
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
  toposition1: function () {
    console.log('进入外卖骑手实时定位')
    var that = this;
    var id = that.data.id;
    var timer = setInterval(int, 5000)


    function int() {
      if (that.data.time == -1) {
        console.log('定时器已经关闭')
        clearInterval(timer)
      }
      wx.getLocation({
        success: function (res) {
          var cql = 'update foodorder set latitude=' + '"' + res.latitude + '",' + 'longitude=' + '"' + res.longitude + '"' + ' where objectId=' + '"' + id + '"';
          // console.log(cql)

          //设置markers 
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            markers: [{
              id: "1",
              latitude: res.latitude,
              longitude: res.longitude,
              width: 22,
              height: 22,
              iconPath: "/images/2.jpg",
              title: "骑手"
            }]
          })

          //return false;
          AV.Query.doCloudQuery(cql)
            .then(function (data) {
              console.log('数据更新更改')
            }, function (error) {
              // 异常处理
              console.error(error);
            });
        },
      })
    }
  },
  onHide:function(){
   
  },
  onUnload:function(){
    this.setData({
      time:-1
    })
   // console.log(this.data.time)
  },
})