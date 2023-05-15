import { List, Picker, Popup, SearchBar } from "antd-mobile";
import React, { Component, Fragment } from "react";
import { RELATION } from ".";

class SelectorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: {},
      infoValueList: []
    }
  }

  componentDidMount() {
    const {
      relationSource,
      classInfoList
    } = this.props;
    console.log(classInfoList);
    console.log(relationSource);
    let source = {};
    relationSource.forEach(re => {
      if(re.deptId) { // class
        if(!source[re.deptId]) {
          source[re.deptId] = [];
        }
        source[re.deptId] = (re.classList || []).map(({ deptId, deptName }) => {
          return {
            value: deptId,
            label: deptName
          }
        });
      } else { // teacher | student

      }
    })

    this.setState({
      source
    });
  }

  filterTxt = (v) => {
    console.log(v);
  }

  render() {
    const {
      showPicker,
      selectedValue,
      source,
      infoValue
    } = this.state;

    const {
      relationType,
      closeRelation,
      relationSource,
      visible
    } = this.props;
    console.log(relationType, 'relationType')
    return (
      <Popup
        visible={visible}
        onMaskClick={() => {
          closeRelation(selectedValue, infoValue);
        }}
      >
        <SearchBar onChange={this.filterTxt} />
        {
          relationType == RELATION.CLASS && (
            <Fragment>
              <List header='选择班级'>
                {
                  (relationSource || []).map(re => <List.Item
                    key={re.deptId}
                    onClick={() => {
                      this.setState({
                        showPicker: true,
                        selectedValue: re.deptId
                      })
                    }}
                  >
                    {re.deptName}
                  </List.Item>)
                }
              </List>
              
              <Picker
                columns={[source[selectedValue] || []]}
                visible={showPicker}
                onClose={() => {
                  this.setState({
                    showPicker: false
                  })
                }}
                onConfirm={v => {
                  if(!infoValue[selectedValue]) {
                    infoValue[selectedValue] = []
                  }
                  infoValue[selectedValue].push(v);
                  this.setState({
                    infoValue
                  });
                }}
              />
            </Fragment>
          )
        }
        {
          relationType !== RELATION.CLASS && (
            <Fragment>

            </Fragment>
          )
        }
      </Popup>
    )
  }
};

export default SelectorPicker;