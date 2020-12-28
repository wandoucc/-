// 封装数据库

import { collection } from "./tablename"


// 实例化数据库对象
const db = wx.cloud.database()
const _ = db.command

// 查找数据 ---------------------
// 根据_id 进行查找数据
const getdoc = (collection = "", doc = "") => db.collection(collection).doc(doc).get()


// 根据 条件进行查找
const getwhere = (
  collection = "",
  where = {},
  limit = 10,
  pages = 1,
  {
    table = "second_id",
    sort = "desc"
  } = {}) => {
  let skip = (pages - 1) * limit
  return db.collection(collection).where(where).limit(limit).skip(skip).orderBy(table, sort).get()
}

// 添加数据-----------------------
const add = (collection = "", data = {}) => db.collection(collection).add({
  data: data
})

const random = (collection = "") => db.collection(collection).aggregate().sample({
  size: 1
}).end()

const regex = (collection = "", searchname = "") => db.collection(collection).where(_.or([{
    title: new db.RegExp({
      regexp: ".*" + searchname + ".*",
      options: 'i'
    })
  },

  {
    company: new db.RegExp({
      regexp: ".*" + searchname + ".*",
      options: 'i'
    })
  },

  {
    detail: new db.RegExp({
      regexp: ".*" + searchname + ".*",
      options: 'i'
    })
  },
])).get()

const del = (collection="",data={})=>db.collection(collection).where(data).remove()


const sum = (collection = "", data = {})=>db.collection(collection).where(data).count()


export {
  getdoc,
  getwhere,
  add,
  regex,
  random,
  del,
  sum
}