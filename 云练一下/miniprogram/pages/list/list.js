// pages/list/list.js
import {
  getwhere
} from "../../utils/db.js"

import {
  list
} from "../../utils/tablename.js"

Page({

  /**
   * 页面的初始数据
   */

  data: {
    top: {
      title: "",
    },

    url: "/pages/detail/detail",
    data: [],
    pages: 1,
    isShow: true,
    fister_id:0
  },

  // 通过 传递过来的id 也就是 数据库中需要的 fister_id 进行查找数据
  async list(id) {
    wx.showLoading({
      title: "转圈圈",
      mask: true
    })

    let r = await getwhere(list, {
      fister_id: Number(id)
    }, 10, this.data.pages, {
      sort: "asc"
    })

    // 加载完成之后进行隐藏
    if(r){
      wx.hideLoading()
    }

    if (r.data.length === 0) {
      this.setData({
        isShow: false
      })
      return
    }

    // 进行拼接 
    this.setData({
      data: [...this.data.data, ...r.data],
      top: { title: r.data[0].type }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.list(options.id)
    this.setData({
      fister_id:options.id,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  
  onReachBottom: function() {
    if (this.data.isShow) {
      this.data.pages++
        this.list(this.data.fister_id)
    }
  }
})