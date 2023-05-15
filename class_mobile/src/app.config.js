import { pages } from "./pages"

export default {
  pages,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '班级考核',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: 'rgba(153, 153, 153, 1)',
    selectedColor: 'rgba(62, 119, 250, 1)',
    borderStyle: 'red',
    list: [
      {
        pagePath: 'pages/ClassAudit/index',
        text: '新增评价',
        iconPath: './images/pj0.png',
        selectedIconPath: './images/pj1.png'
      },
      {
        pagePath: 'pages/Compare/index',
        text: '评比管理',
        iconPath: './images/jl0.png',
        selectedIconPath: './images/jl1.png'
      },
      {
        pagePath: 'pages/Evaluate/index',
        text: '评比排名',
        iconPath: './images/pm0.png',
        selectedIconPath: './images/pm1.png'
      },
    ],
    position: 'bottom',
  }
}
