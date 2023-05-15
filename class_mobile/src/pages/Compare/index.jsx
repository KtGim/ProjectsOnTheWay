import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'
import template from '../template'

@template
export default class Compare extends Component {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='class-audit'>
        <Text>Hello world hhhh!</Text>
      </View>
    )
  }
}