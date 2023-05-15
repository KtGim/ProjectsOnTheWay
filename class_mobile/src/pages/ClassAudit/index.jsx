import React, { Component } from 'react';

import { JumboTabs, Cascader, Checkbox, Toast } from 'antd-mobile';
import { SearchOutline } from 'antd-mobile-icons';
import { View } from '@tarojs/components';
import './index.less';
import template from '../template';
import { getCompareList, getContentList, getIndexList } from '../../service';

const Group = Checkbox.Group;

@template
export default class ClassAudit extends Component {
  state = {
    indexList: [],
    quickSearch: false,
    options: [],
    quickSearchInfo: [],

    evaluateObjectType: undefined,
    customEvaluateTypeId: undefined,

    classInfoList: [],
    compareList: [],
    contentList: [],
    activeContent: {},
    contentSelectorInfo: {},

    selectedIndexIds: [],
    activeClassInfo: {},
    activeEvaInfo: {},

    batch: false
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.selectorInfo !== this.props.selectorInfo) {
      const { selectorInfo } = nextProps;
      getIndexList({
        taskId: selectorInfo.id
      }).then(indexList => {
        this.setState({
          indexList
        }, () => {
          this.changeTab((indexList[0] || {}).id);
        });
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () {
    
  }

  componentDidHide () { }

  initOptions = (data) => {
    return (data || []).map(({gradeId, evaluateObjectId, gradeName, evaluateObjectName, children}) => {
      if(children) {
        return this.initOptions(children);
      }
      return {
        value: gradeId || evaluateObjectId,
        label: gradeName || evaluateObjectName
      }
    }) 
  }

  changeTab = (tabKey) => {
    this.setState({
      tabKey
    }, () => {
      getCompareList({
        indexId: tabKey,
        taskId: this.props.selectorInfo.id
      }).then(({
        evaluateObjectType,
        customEvaluateTypeId,
        evaluateObjectList
      }) => {
        const compareList = evaluateObjectList;
        const classInfo = {};
        compareList.forEach(({gradeId, gradeName}) => {
          if(!classInfo[gradeId]) {
            classInfo[gradeId] = gradeName;
          }
        });
        const classInfoList = Object.entries(classInfo).map(([gradeId, gradeName]) => {
          const children = compareList.filter(({gradeId: gId}) => gradeId == gId);
          return {
            gradeId,
            gradeName,
            children
          }
        });
        this.setState({
          classInfoList,
          evaluateObjectType,
          customEvaluateTypeId,
          activeClassInfo: classInfoList[0],
          compareList,
          options: this.initOptions(classInfoList),
          activeEvaInfo: ((classInfoList[0] || {}).children || [])[0]
        }, () => {
          this.getContent({
            evaluateObjectType,
            customEvaluateTypeId,
            taskId: this.props.selectorInfo.id,
            indexId: tabKey,
            evaluateObjectId: ((classInfoList[0] || {}).children[0] || {}).evaluateObjectId,
          });
        });
      })
    })
  }

  getContent = (data = {}) => {
    const {
      evaluateObjectId
    } = data;
    if(!evaluateObjectId) return;
    const {
      evaluateObjectType,
      customEvaluateTypeId,
      tabKey,
    } = this.state;
    getContentList({
      evaluateObjectType,
      customEvaluateTypeId,
      taskId: this.props.selectorInfo.id,
      indexId: tabKey,
      ...data
    }).then(res => {
      const contentList = res || [{
        indexContentId: 1,
        indexContentName: '1',
        selectType: 1,
        defaultScore: 0,
        defaultMaxScore: 10,
        defaultScoreType: 1,
        totalScore: 5
      },{
        indexContentId: 2,
        indexContentName: '2',
        selectType: 1,
        defaultScore: 0,
        defaultMaxScore: 10,
        defaultScoreType: 1,
        totalScore: 5
      },{
        indexContentId: 3,
        indexContentName: '3',
        selectType: 2,
        defaultScore: 0,
        defaultMaxScore: 10,
        defaultScoreType: 2,
        totalScore: 5
      }];
      this.setState({
        contentList
      })
    })
  }

  quickSearch = (quickSearch) => {
    this.setState({
      quickSearch
    });
  }

  initContent = (gId) => {
    const {
      compareList
    } = this.state;
    const contentList = compareList.filter(({gradeId}) => gradeId == gId);
    this.setState({
      contentList,
      activeEvaInfo: contentList[0]
    });
  }

  confirm = (value) => {
    const {
      activeClassInfo,
      activeEvaInfo,
      compareList
    } = this.state;
    this.setState({
      quickSearchInfo: value
    }, () => {
      const [gradeId, evaluateObjectId] = value;
      if(activeClassInfo.gradeId !== gradeId) {
        this.initContent(gradeId);
      } else {
        if(activeEvaInfo.evaluateObjectId !== evaluateObjectId) {
          const activeEvaTemp = compareList.find(({evaluateObjectId: iCid}) => iCid == evaluateObjectId) || {};
          this.setState({
            activeEvaInfo: activeEvaTemp
          });
        }
      }
    })
  }

  activeEva = (activeEvaInfo) => {
    this.setState({
      activeEvaInfo
    }, () => {
      this.getContent({
        evaluateObjectId: activeEvaInfo.evaluateObjectId
      });
    });
  }

  activeClass = (classInfo) => {
    if(classInfo.gradeId == this.state.activeClassInfo.gradeId) {
      return;
    }
    const activeEvaInfo = (classInfo.children || [])[0] || {};
    this.setState({
      activeClassInfo: classInfo,
      activeEvaInfo
    }, () => {
      this.getContent({
        evaluateObjectId: activeEvaInfo.evaluateObjectId
      })
    });
  }

  renderContent = () => {
    const { classInfoList, activeClassInfo, activeEvaInfo, batch } = this.state;
    const { gradeId: gId } = activeClassInfo;
    const showList = classInfoList && classInfoList.length ? JSON.parse(JSON.stringify(classInfoList)) : [];
    const index = showList.findIndex(({gradeId}) => gradeId == gId);
    if(index > -1) {
      const infoListChildren = showList[index].children || [];
      showList.splice(index + 1, 0, ...(infoListChildren || []));
    }
    return showList.map(com => {
      const { evaluateObjectId,evaluateObjectName, gradeId, gradeName } = com;
      const className = gId == gradeId ? 'compare_list_item active' : 'compare_list_item';
      const batchClassName = batch ? 'compare_list_item batching' : className;
      const inName = activeEvaInfo.evaluateObjectId == evaluateObjectId ? 'compare_list_info in' : 'compare_list_info';
      // 没有 evaluateObjectId 表示是一级菜单
      return !evaluateObjectId ?
        (batch ? (
          <Checkbox key={gradeId} value={gradeId}>
            <p className={batchClassName} key={gradeId}>{gradeName}</p> 
          </Checkbox>
        ) : ( <p className={batchClassName} key={gradeId} onClick={this.activeClass.bind(this, com)}>{gradeName}</p> )) :
          <p className={inName} key={evaluateObjectId} onClick={this.activeEva.bind(this, com)}>{evaluateObjectName}</p>
    })
  }

  renderContentInfo = () => {
    const { contentList } = this.state;
    return (contentList || []).map(info => {
      return <p
        className='content_selector_info_item'
        key={info.indexContentId}
      >
        {info.indexContentName}({info.totalScore || 0}) <span className='eva' onClick={this.eva.bind(this,info)}>评价</span>
      </p>
    });
  }

  batchAction = () => {
    const {
      tabKey,
      batch,
      compareList,
      evaluateObjectType,
      customEvaluateTypeId,
      contentList,
      activeEvaInfo,
      activeContent,
      classInfoList,
      activeClassInfo
    } = this.state;
    let selectedIndexIds = batch ? [] : (compareList || []).map(({evaluateObjectId}) => evaluateObjectId );
    this.setState({
      batch: !batch,
      selectedIndexIds,
    }, () => {
      this.props.handleEvaIfo({
        batch: !batch,
        selectedIndexIds: selectedIndexIds,
        evaluateObjectType,
        customEvaluateTypeId,
        indexId: tabKey,
        contentList,
        activeContent,
        activeEvaInfo,
        activeClassInfo,
        classInfoList
      });
    });
  }

  eva = (curSelectorInfo) => {
    const {
      evaluateObjectType,
      customEvaluateTypeId,
      tabKey,
      contentList,
      activeContent,
      activeEvaInfo,
      activeClassInfo,
      classInfoList
    } = this.state;
    this.props.handleEvaIfo({
      batch: false,
      selectedIndexIds: [],
      evaluateObjectType,
      customEvaluateTypeId,
      indexId: tabKey,
      contentList,
      activeContent,
      activeEvaInfo,
      curSelectorInfo,
      classInfoList,
      activeClassInfo
    });
  }

  batchKeys = (selectedIndexIds) => {
    this.setState({
      selectedIndexIds
    });
  }

  confirmBatch = () => {
    const { selectedIndexIds } = this.state;
    if(!selectedIndexIds || !selectedIndexIds.length) {
      Toast.show({
        icon: 'fail',
        content: '请先选择指标',
      });
      return
    }
  }

  render () {
    const { indexList, tabKey, quickSearch, options, quickSearchInfo, batch, selectedIndexIds, contentSelectorInfo } = this.state;
    console.log(contentSelectorInfo, 'contentSelectorInfo');
    return (
      <View className='class-audit'>
        <JumboTabs onChange={this.changeTab} activeKey={tabKey}>
          {
            indexList.map(index => <JumboTabs.Tab key={index.id} description={index.indexName} />)
          }
        </JumboTabs>
        <span className='batch' onClick={this.batchAction}>{batch ? '退出批量' : '批量评价'}</span>
        {
          batch ? <span className='batch' onClick={this.confirmBatch}>确认</span> : null
        }
        <SearchOutline style={{float: 'right', fontSize: '0.8rem', margin: '0.5rem'}} onClick={this.quickSearch.bind(this, true)} />
        <Cascader
          options={options}
          onConfirm={this.confirm}
          visible={quickSearch}
          title='搜索地点'
          value={quickSearchInfo}
          onClose={this.quickSearch.bind(this, false)}
        />
        <div className='content'>
          <div className='compare_list'>
            <Group
              value={selectedIndexIds}
              onChange={this.batchKeys}
            >
              {this.renderContent()}
            </Group>
          </div>
          <div className='content_list'>
            {this.renderContentInfo()}
          </div>
        </div>
      </View>
    )
  }
}