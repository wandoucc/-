// pages/search/search.js
import {
  regex
} from "../../utils/db.js"

import {
  list
} from "../../utils/tablename.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "/pages/detail/detail",
    searchitem:"",
    top: {
      type: "搜索"
    },
    data: [],
    isShow:false
  },

  searchdata(e){
    this.setData({
      searchitem: e.detail.value
    })
  },

  async search(){

    wx.showLoading({
      title: '转圈圈',
      mask:true
    })

    if (!this.data.searchitem){
      wx.showToast({
        title: '不能为空啊',
        icon: "none"
      })
      return
    }
    
    let r = await regex(list,this.data.searchitem)
    this.setData({
      data:r.data,
      isShow:false
    })

    if(r.data.length == 0){
      this.setData({
        isShow:true
      })

      wx.hideLoading()
      wx.showToast({
        title: '没有数据啊',
        icon:none,
        mask:true
      })
    }
    
    if(r){
      wx.hideLoading()
    }
  },
  onShow:function(){
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
})