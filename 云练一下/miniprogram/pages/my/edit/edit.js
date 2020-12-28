// pages/my/edit/edit.js
const marked = require('../../../utils/marked.min.js');

import {
  getwhere,
  add,
  sum
} from "../../../utils/db.js"
import {
  Classification,
  list,
  day
} from "../../../utils/tablename.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: [],
    detail: "",
    isDay: false,
    html:""
  },
  
  isDay(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        isDay: true
      })
    } else {
      this.setData({
        isDay: false
      })
    }
  },

  async formSubmit(e) {
    this.editor.getContents({
      success: (res) => {
        var html = res.text;
        html = marked(html);
        this.setData({
          detail:html
        })
      }
    })

    let selecttab = list
    // if (this.data.isDay) {
    //   selecttab = day
    // } else {
    //   selecttab = list
    // }

    // this.data.isDay
    // 设置 second_id
    let time = Number(new Date())

    // 吧获取过来的表单进行赋值
    let ev = e.detail.value
    if (ev.company == "") {
      ev.company = "未知"
    }

    ev.type = this.data.list.filter(item => {
      return item.fister_id == e.detail.value.fister_id
    })[0].title

    let rrr = await sum(selecttab, {
      fister_id: Number(e.detail.value.fister_id)
    })

    // 设置题号
    ev.id = rrr.total + 1;

    // 设置时间
    ev.second_id = time;

    // 转换成数字格式
    ev.fister_id = Number(e.detail.value.fister_id)

    ev.detail = this.data.detail
    // 吧列表信息存入 re-list列表中
    let aa = await add(selecttab, ev)
    
    if (this.data.isDay){
      await add(day, ev)
    }


    if (selecttab == day) {
      console.log(ev)
      await add(list, ev)
    }

    if (aa._id) {
      wx.showToast({
        title: "成功添加了",
        mask: true
      })

      wx.switchTab({
        url: '/pages/my/my',
      })

    } else {
      wx.showToast({
        title: "添加失败啦",
        icon: none,
        mask: true
      })
    }
  },

  // 进行渲染数据
  async list() {
    // 进行 循环 分类
    let r = await getwhere(Classification,{},0)
    this.setData({
      list: r.data
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.createSelectorQuery().select('#editor').context((res) => {
      this.editor = res.context;
    }).exec();

    this.list()
  }
})