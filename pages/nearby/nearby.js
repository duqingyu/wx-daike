// pages/nearby/nearby.js
const AV = require('../../utils/av-live-query-weapp-min.js')
Page({
  data: {
 result:'',
 id:'',
 lat:'',
 lng:'',
 refresh:true,
 refreshs:false
},
  onLoad:function(options){
    var that = this;
    wx.showToast({
      title:'loading',
      icon:'loading'
    })
    var result = JSON.parse(options.result);
    that.setData({
      result:result
    })
    //通过微信唯一头像地址去查询objectId
    wx.getStorage({
      key:'user',
      success:function(res){
        var query = new AV.Query('near');
        query.equalTo('avatar',res.data.avatarUrl);
        query.find().then(function (res) {
          var id = res[0].id;
          that.setData({
            id : id
          })
        }).then(function (todos) {
          // 更新成功
        }, function (error) {
          // 异常处理
        });
      }
    })
},

  onShow: function () {
    var that = this;
    //获取用户进来的地理位置值
    wx.getStorage({
      key: 'location',
      success: function (res) {
          var lat1 = res.data.latitude;
          var lng1 = res.data.longitude;
          //计算距离
          that.setData({
            lat: lat1,
            lng: lng1
          })
          for(var i=0;i<that.data.result.length;i++){
            var lat2 = that.data.result[i].whereCreated.latitude
            var lng2 = that.data.result[i].whereCreated.longitude
              that.Therange(lat1,lng1,lat2,lng2,i)
          } 
      }
    })
    console.log(that.data.result)
  },
  Therange:function(lat1,lng1,lat2,lng2,i){
    //转化弧度
    function toRad(d) { return d * Math.PI / 180; }
    function getDisance(lat1, lng1, lat2, lng2) {
    //lat为纬度, lng为经度
      var dis = 0;
      var radLat1 = toRad(lat1);
      var radLat2 = toRad(lat2);
      var deltaLat = radLat1 - radLat2;
      var deltaLng = toRad(lng1) - toRad(lng2);
      var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
      return dis * 6378137;
    }
     var distance = getDisance(lat1,lng1,lat2,lng2);
       //取整
      var distances = Math.round(distance)
     //添加距离到result返回给view
     var result2 = this.data.result;
     console.log('result2')
     console.log(result2)
     result2[i].distance = distances;
     this.setData({
       result:result2
     })
  },
  onUnload:function(){
    this.del();

  },
  onHide:function(){
    this.del();
  },
  del:function(){
    AV.Query.doCloudQuery('delete from near where objectId=' + '"' + this.data.id + '"').then(function () {
      console.log('删除成功')
    }, function (error) {
      // 异常处理
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;

    that.setData({
      refresh: false,
      refreshs: true,
    })

    //刷新显示状态是否显示
    setTimeout(function () {
      wx.stopPullDownRefresh()
      that.setData({
        refresh: true,
        refreshs: false
      })
    }, 2000)

    //查询
    var lat = that.data.lat;
    var lng = that.data.lng;
    var point = new AV.GeoPoint(lat, lng);
    var query = new AV.Query('near');
    query.withinKilometers('whereCreated', point, 100.0);
    query.find().then(function (results) {
      console.log(results)
      that.setData({
        result: results
      })
      for (var i = 0; i < results.length; i++) {
        var lat2 = results[i].attributes.whereCreated.latitude
        var lng2 = results[i].attributes.whereCreated.longitude
        that.Therange1(lat, lng, lat2, lng2, i)
      }
    })
  },
  Therange1: function (lat1, lng1, lat2, lng2, i) {
    //转化弧度
    function toRad(d) { return d * Math.PI / 180; }
    function getDisance(lat1, lng1, lat2, lng2) {
      //lat为纬度, lng为经度
      var dis = 0;
      var radLat1 = toRad(lat1);
      var radLat2 = toRad(lat2);
      var deltaLat = radLat1 - radLat2;
      var deltaLng = toRad(lng1) - toRad(lng2);
      var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
      return dis * 6378137;
    }
    var distance = getDisance(lat1, lng1, lat2, lng2);
    //取整
    var distances = Math.round(distance)
    //添加距离到result返回给view
    var result2 = this.data.result;
    result2[i].attributes.distance = distances;
    this.setData({
      result: result2
    })
  },
})
