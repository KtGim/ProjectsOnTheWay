import { View } from '@tarojs/components';
import React, { Component } from 'react';
import { Checkbox, ImageUploader, NumberKeyboard, TextArea, Toast } from 'antd-mobile';
import Taro from '@tarojs/taro';
import template from '../template';
import './index.less';
import { getSelectors, relationClass, relationStudent, relationTeacher } from '../../service';
import SelectorPicker from './SelectorPicker';

export const RELATION = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  CLASS: 'CLASS',
};

@template
class ClassEva extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentSelectorInfo: {}
    }
  }
  componentDidMount() {
    const {
      evaInfo
    } = this.props;
    const {
      batch,
      curSelectorInfo,
      activeEvaInfo,
      classInfoList,
      activeClassInfo
    } = evaInfo;
    let title = '批量评价';
    let classIdList = [];
    if(!batch) {
      title = `评价:${activeEvaInfo.evaluateObjectName}${curSelectorInfo.indexContentName}`;
      classIdList = [activeClassInfo.gradeId];
    } else {
      classIdList = classInfoList.map(({gradeId}) => gradeId);
    }

    this.getClass();
    this.getStudent(classIdList);
    this.getTeacher(classIdList);

    this.getContentSelectors();



    setTimeout(() => {
      console.log(title);
      Taro.setNavigationBarTitle({
        title
      });
    }, 0);
  }
  getTeacher = (classIdList) => {
    relationTeacher({classIdList}).then(res => {
      this.setState({
        [RELATION.TEACHER]: res || [{
          userId: 1,
          userName: '教师1',
          classId: '1'
        }]
      });
    })
  }
  getStudent = (classIdList) => {
    relationStudent({classIdList}).then(res => {
      this.setState({
        [RELATION.STUDENT]: res || [
          {
            userId: 11,
            userName: '学生11',
            classId: '1'
          }
        ]
      });
    })
  }
  getClass = () => {
    relationClass({}).then(res => {
      this.setState({
        [RELATION.CLASS]: res || []
      });
    })
  }
  getContentSelectors = (data = {}) => {
    const {
      evaInfo,
      global
    } = this.props;
    getSelectors({
      taskId: global.selectorInfo.id,
      indexId: evaInfo.indexId,
      indexContentId: evaInfo.curSelectorInfo.indexContentId,
      ...data
    }).then((res) => {
      this.setState({
        contentSelectorInfo: res || {}
      });
    });
  }

  setContent = (field, value) => {
    // console.log(field, value)
    this.setState({
      [field]: value
    });
  }

  editScore = (scoreContent, index) => {
    this.setState({
      editContent: scoreContent,
      inputInfo: '',
      index
    });
  }

  onConfirm = () => {
    const { editContent, index, inputInfo, contentSelectorInfo } = this.state;
    editContent.score = inputInfo;
    delete editContent.inputInfo;
    contentSelectorInfo.indexSelectList.splice(index, 1, editContent);
    this.setState({
      contentSelectorInfo: JSON.parse(JSON.stringify(contentSelectorInfo))
    }, () => {
      this.onClose();
    });
  }

  onClose = () => {
    this.setState({
      editContent: null,
      inputInfo: '',
      index: null
    });
  }

  onInput = (v) => {
    const { inputInfo, editContent, index, contentSelectorInfo } = this.state;
    const { indexContentSelectScore, indexContentSelectMaxScore } = editContent;
    const value = inputInfo + v;
    if(Number(indexContentSelectScore) <= value && Number(indexContentSelectMaxScore) >= value) {
      editContent.inputInfo = inputInfo !== '' ? ( v== '.' ? value + 0 : value) : value;
      contentSelectorInfo.indexSelectList.splice(index, 1, editContent);
      this.setState({
        inputInfo: value,
        contentSelectorInfo: JSON.parse(JSON.stringify(contentSelectorInfo))
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '数值超过界限',
      })
    }
  }

  onDelete = () => {
    const { inputInfo, editContent, index, contentSelectorInfo } = this.state;
    if(inputInfo == '') return;
    const value = inputInfo ? `${inputInfo}`.slice(0, inputInfo.length - 1) : '';
    contentSelectorInfo.indexSelectList.splice(index, 1, editContent);
    editContent.inputInfo = value[value.length - 1] == '.' ? value + 0 : value;
    this.setState({
      inputInfo: value,
      contentSelectorInfo: JSON.parse(JSON.stringify(contentSelectorInfo))
    });
  }

  setFileList = (fileList) => {
    this.setState({
      fileList
    });
  }

  upload = (file) => {
    return {
      url: URL.createObjectURL(file)
    }
  }

  renderIcon = (uploadPicFlag) => {
    if(uploadPicFlag) {
      const { fileList } = this.state;
      return (
        <div style={{ margin: '.5rem 0'}}>
          <ImageUploader
            value={fileList}
            onChange={this.setFileList}
            upload={this.upload}
          />
        </div>
      );
    }
  }

  selectRelations = (type) => {
    const relationSource = this.state[type];
    this.setState({
      relationSource,
      relationType: type,
      visible: true
    });
  }

  closeRelation = (gradeId, classId) => {
    console.log(gradeId, classId);
    this.setState({
      relationSource: [],
      relationType: null,
      visible: false
    });
  }

  render() {
    const {
      contentSelectorInfo,
      indexContentSelectListIds = [],
      editContent,
      relationSource,
      relationType,
      visible
    } = this.state;
    console.log(visible);
    const {
      evaInfo
    } = this.props;
    const {
      classInfoList
    } = evaInfo;
    console.log(contentSelectorInfo, 'contentSelectorInfo');
    const {
      indexSelectList,
      uploadPicFlag,
    } = contentSelectorInfo;
    return <View className='class_eva'>
        <p className='title1'>评价项</p>
        <Checkbox.Group
          // defaultValue='1'
          onChange={this.setContent.bind(this, 'indexContentSelectListIds')}
        >
            {
              (indexSelectList || []).map(
                (scoreContent, index) => {
                  const {indexContentSelectName, indexContentSelectId, indexContentSelectScore, indexContentSelectMaxScore, score, inputInfo} = scoreContent;
                  const showEdit = indexContentSelectListIds.includes(indexContentSelectId) || score || inputInfo;
                  return <Checkbox
                    key={indexContentSelectId}
                    value={indexContentSelectId}
                  >
                    {indexContentSelectName}
                    <span>
                      ({indexContentSelectScore}~{indexContentSelectMaxScore}分)
                      <span className='score'>{score || inputInfo}</span>
                      {
                        showEdit ?
                          <span className='edit' onClick={this.editScore.bind(this, scoreContent, index)}>编辑</span> :
                          null
                      }
                    </span>
                  </Checkbox>
                }
              )
            }
        </Checkbox.Group>
        <p className='title1'>评语</p>
        <TextArea
          placeholder='请输入评语'
          className='content'
          autoSize={{ minRows: 3, maxRows: 5 }}
          onChange={this.setContent.bind(this, 'comment')}
          maxLength='300'
          style={{
            borderRadius: '0.5rem',
            padding: '0.5rem',
            width: 'auto'
          }}
        />

        {this.renderIcon(uploadPicFlag)}
        <div className='relations'>
          <img src={require('../../images/teacher.png')} onClick={this.selectRelations.bind(this, RELATION.TEACHER)} />
          <img src={require('../../images/student.png')} onClick={this.selectRelations.bind(this, RELATION.STUDENT)} />
          <img src={require('../../images/class.png')} onClick={this.selectRelations.bind(this, RELATION.CLASS)} />
        </div>
        {/* 后续加一个弹框  */}
        <NumberKeyboard
          visible={!!editContent}
          onClose={this.onClose}
          onInput={this.onInput}
          onDelete={this.onDelete}
          onConfirm={this.onConfirm}
          customKey={['.']}
          confirmText='确定'
        />
        {visible && <SelectorPicker
          relationSource={relationSource}
          relationType={relationType}
          classInfoList={classInfoList}
          visible={visible}
          closeRelation={this.closeRelation}
        />}
    </View>
  }
};

export default ClassEva;