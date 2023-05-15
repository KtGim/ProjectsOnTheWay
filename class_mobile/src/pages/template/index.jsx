import React, {Component} from 'react';
import { connect } from 'react-redux';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Dropdown } from 'antd-mobile';
import { getTaskList } from '../../service';
import { setSelectorInfo, setEvaInfo } from '../../actions';
import { navigatorPages } from '../../pages';

const template = (Com) => {
  class Template extends Component {
    state = {
      selectorInfo: {
        taskName: null,
        id: ''
      },
      selectors: []
    }

    componentDidMount () { 
      getTaskList({}).then(selectors => {
        this.setState({
          selectors,
          selectorInfo: selectors[0] || {}
        });
        this.props.setSelectorInfo(selectors[0]);
      });
    }

    $instance = getCurrentInstance();
  
    select (info) {
      this.setState({
        selectorInfo: info
      }, () => {
        this.ref.close();
      });
      this.props.setSelectorInfo(info);
    }

    handleEvaIfo = (evaInfo) => {
      this.props.setEvaInfo(evaInfo);
      setTimeout(() => {
        Taro.switchTab({
          url: 'pages/ClassEva/index'
        });
      }, 500);
    }
  
    render() {
      const { selectorInfo, selectors } = this.state;
      const { evaInfo } = this.props.global;
      const showCommon = navigatorPages.some(nP => (this.$instance.router.path).includes(nP));
      // console.log(evaInfo, this.props, selectorInfo);
      return <View>
        {
          showCommon ? (
            <Dropdown ref={(ins) => { this.ref = ins; }} className='selector'>
              <Dropdown.Item key='sorter' title={selectorInfo.taskName}>
                {
                  selectors.map((item) => (
                    <div
                      onClick={this.select.bind(this, item)}
                      key={item.id}
                      style={{ padding: '0.6rem', borderBottom: '1px solid rgba(204, 204, 204, 1)' }}
                    >
                      {item.taskName}
                    </div>
                  ))
                }
              </Dropdown.Item>
            </Dropdown>
          ) : null
        }
        <div
          className='template_container'
          style={
            showCommon ?
              {
                top: '2.5rem',
                borderRadius: '1rem 1rem 0 0'
              }
             : {
                top: 0,
                borderRadius: 0
              }
            }
        >
          <Com
            selectorInfo={selectorInfo}
            evaInfo={evaInfo}
            handleEvaIfo={this.handleEvaIfo}
            {...this.props}
          />
        </div>
      </View>
    }
  }
  return connect((state) => state, {
    setSelectorInfo,
    setEvaInfo
  })(Template);
}

export default template;