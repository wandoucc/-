// pages/experiencedetail/experiencedetail.js
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
    data: {}
  },

  async _getdetail(id) {
    let r = await getwhere(explist, {
      time: Number(id)
    })
    this.setData({
      data: r.data[0]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getdetail(options.id)
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})