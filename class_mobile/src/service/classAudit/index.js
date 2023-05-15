import { request } from "../../utils"

export const getTaskList = (data) => {
  return request({
    path: '/mobile/evaluate/task/list',
    data
  });
}

export const getIndexList = (data) => {
  return request({
    path: '/mobile/evaluate/task/index/list',
    data
  });
}

export const getCompareList = (data) => {
  return request({
    path: '/mobile/evaluate/object/list',
    data
  });
}

export const getContentList = (data) => {
  return request({
    path: '/mobile/evaluate/task/index/content/list',
    data
  });
}

export const getSelectors = (data) => {
  return request({
    path: '/mobile/evaluate/select/list',
    data
  });
}

// 查询评价对象详情
export const getDetail = (data) => {
  return request({
    path: '/manager/evaluate/record/list',
    data
  });
}

// 新增评价对象
export const updateEvaInfo = (data) => {
  return request({
    path: '/mobile/evaluate/save',
    data
  })
}

// 关联教师
export const relationTeacher = (data) => {
  return request({
    path: '/mobile/evaluate/relation/teacher',
    data
  })
}

// 关联学生
export const relationStudent = (data) => {
  return request({
    path: '/mobile/evaluate/relation/student',
    data
  })
}

// 关联班级
export const relationClass = (data) => {
  return request({
    path: '/mobile/evaluate/relation/class',
    data
  })
}