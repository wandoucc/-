// pages/home/home.js
import {
  getwhere,
  random
} from "../../utils/db.js"

import {
  day,
  Classification,
  list
} from "../../utils/tablename.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: "/pages/detail/detail",
    randomquestions: {},
    brushtodaydata: {},
    basic_knowledge: [],
    isshow:false
  },

  _search() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 这个地方 进行请求首页的数据库 通过相同的id 进行 分组 分别进行 渲染
  async _getlist() {
    wx.showLoading({title: "转圈圈",mask: true})
    let data = await getwhere(Classification,{},0)
    if (data) {wx.hideLoading()}
    this.setData({basic_knowledge: data.data})
  },

  async _getday() {
    let a = await getwhere(day, {}, 1)
    let time = new Date(a.data[0].second_id)
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    let date = y + "-" + m + "-" + d 
    a.data[0].date = date
    this.setData({
      brushtodaydata: a.data[0]
    })
  },

  async _getrandom() {
    let r = await random(list)
    this.setData({
      randomquestions: r.list[0]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getlist()
    this._getday()
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    setTimeout(()=>{
        this.setData({
          isshow:true
        })
    },200)
    this._getrandom()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
})