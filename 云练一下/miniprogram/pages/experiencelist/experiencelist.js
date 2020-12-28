// pages/experiencelist/experiencelist.js
import {
  getwhere,
} from "../../utils/db.js"
import {
  explist
} from "../../utils/tablename.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"/pages/experiencedetail/experiencedetail",
    data:{},
    pages: 1,
    isShow:true,
    id:0
  },

  async _getlist(){

    wx.showLoading({
      title: '加载~加载~',
    })

    let r = await getwhere(explist, {},10, this.data.pages, {
      sort: "asc"
    })
    this.setData({
      data: [...this.data.data, ...r.data],
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.setData({
      id:options.id
    })
    this._getlist(this.data.id)
  },

  onReachBottom: function () {
    if (this.data.isShow) {
      this.data.pages++
      this._getlist(this.data.id)
    }
  }
})