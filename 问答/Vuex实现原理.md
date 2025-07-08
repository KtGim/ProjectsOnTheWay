# Vuex 实现原理

## 1. Vuex 核心概念

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式，它采用集中式存储管理应用的所有组件的状态。

### 核心概念
- **State**: 状态数据
- **Getter**: 计算属性
- **Mutation**: 同步修改状态
- **Action**: 异步操作
- **Module**: 模块化

## 2. Vuex 基本架构

```javascript
// 简化的 Vuex 实现
class Store {
  constructor(options) {
    this.state = options.state || {}
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}
    this.getters = options.getters || {}
    
    // 响应式处理
    this._vm = new Vue({
      data: {
        $$state: this.state
      }
    })
  }
  
  get state() {
    return this._vm._data.$$state
  }
  
  commit(type, payload) {
    const mutation = this.mutations[type]
    if (mutation) {
      mutation(this.state, payload)
    }
  }
  
  dispatch(type, payload) {
    const action = this.actions[type]
    if (action) {
      return action({
        commit: this.commit.bind(this),
        state: this.state
      }, payload)
    }
  }
}
```

## 3. 响应式原理

### 3.1 Vue 2 中的响应式实现

```javascript
// Vue 2 使用 Object.defineProperty
function defineReactive(obj, key, val) {
  const dep = new Dep()
  
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify()
    }
  })
}

// 递归处理对象
function observe(obj) {
  if (!obj || typeof obj !== 'object') return
  
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}
```

### 3.2 Vue 3 中的响应式实现

```javascript
// Vue 3 使用 Proxy
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    }
  })
}
```

## 4. 依赖收集与派发更新

### 4.1 依赖收集系统

```javascript
class Dep {
  constructor() {
    this.subscribers = []
  }
  
  depend() {
    if (Dep.target && !this.subscribers.includes(Dep.target)) {
      this.subscribers.push(Dep.target)
    }
  }
  
  notify() {
    this.subscribers.forEach(watcher => {
      watcher.update()
    })
  }
}

// 全局的当前 watcher
Dep.target = null
```

### 4.2 Watcher 实现

```javascript
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.cb = cb
    this.getter = typeof expOrFn === 'function' ? expOrFn : parsePath(expOrFn)
    this.value = this.get()
  }
  
  get() {
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }
  
  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
```

## 5. 模块化实现

### 5.1 模块注册

```javascript
class ModuleCollection {
  constructor(rawRootModule) {
    this.register([], rawRootModule)
  }
  
  register(path, rawModule) {
    const newModule = {
      rawModule,
      children: {},
      state: rawModule.state || {}
    }
    
    if (path.length === 0) {
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.children[path[path.length - 1]] = newModule
    }
    
    if (rawModule.modules) {
      Object.keys(rawModule.modules).forEach(key => {
        this.register(path.concat(key), rawModule.modules[key])
      })
    }
  }
  
  get(path) {
    return path.reduce((module, key) => {
      return module.children[key]
    }, this.root)
  }
}
```

### 5.2 命名空间处理

```javascript
function makeLocalContext(store, namespace, path) {
  const noNamespace = namespace === ''
  
  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args
      
      if (!options || !options.root) {
        type = namespace + type
      }
      
      return store.dispatch(type, payload)
    },
    
    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args
      
      if (!options || !options.root) {
        type = namespace + type
      }
      
      store.commit(type, payload, options)
    }
  }
  
  return local
}
```

## 6. 插件系统

### 6.1 插件机制

```javascript
class Store {
  constructor(options) {
    this.plugins = options.plugins || []
    this.strict = options.strict || false
    
    // 初始化插件
    this.plugins.forEach(plugin => plugin(this))
  }
  
  use(plugin) {
    this.plugins.push(plugin)
    return this
  }
}
```

### 6.2 常用插件示例

```javascript
// 持久化插件
function createPersistedState(options = {}) {
  return (store) => {
    const key = options.key || 'vuex'
    
    // 恢复状态
    const savedState = JSON.parse(localStorage.getItem(key) || '{}')
    store.replaceState({
      ...store.state,
      ...savedState
    })
    
    // 监听状态变化
    store.subscribe((mutation, state) => {
      localStorage.setItem(key, JSON.stringify(state))
    })
  }
}

// 日志插件
function createLogger(options = {}) {
  return (store) => {
    store.subscribe((mutation, state) => {
      console.group(mutation.type)
      console.log('payload:', mutation.payload)
      console.log('state:', state)
      console.groupEnd()
    })
  }
}
```

## 7. 严格模式

### 7.1 严格模式实现

```javascript
class Store {
  constructor(options) {
    this.strict = options.strict || false
    this._committing = false
  }
  
  _withCommit(fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
  
  commit(type, payload) {
    if (this.strict && !this._committing) {
      throw new Error('Vuex store state was mutated outside mutation handlers.')
    }
    
    this._withCommit(() => {
      const mutation = this.mutations[type]
      if (mutation) {
        mutation(this.state, payload)
      }
    })
  }
}
```

## 8. 辅助函数实现

### 8.1 mapState

```javascript
function mapState(namespace, states) {
  const res = {}
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState() {
      let state = this.$store.state
      let getters = this.$store.getters
      
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      
      return typeof val === 'function' ? val.call(this, state, getters) : state[val]
    }
  })
  return res
}
```

### 8.2 mapMutations

```javascript
function mapMutations(namespace, mutations) {
  const res = {}
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation(...args) {
      let commit = this.$store.commit
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapMutations', namespace)
        if (!module) {
          return
        }
        commit = module.context.commit
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
}
```

## 9. 性能优化

### 9.1 计算属性缓存

```javascript
class Store {
  constructor(options) {
    this._wrappedGetters = options.getters || {}
    this.getters = {}
    
    // 计算属性缓存
    const computed = {}
    Object.keys(this._wrappedGetters).forEach(key => {
      computed[key] = () => this._wrappedGetters[key](this.state, this.getters)
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
        enumerable: true
      })
    })
    
    this._vm = new Vue({
      data: {
        $$state: this.state
      },
      computed
    })
  }
}
```

### 9.2 批量更新

```javascript
class Store {
  constructor(options) {
    this._subscribers = []
    this._actionSubscribers = []
  }
  
  subscribe(fn) {
    const subs = this._subscribers
    if (subs.indexOf(fn) < 0) {
      subs.push(fn)
    }
    return () => {
      const i = subs.indexOf(fn)
      if (i > -1) {
        subs.splice(i, 1)
      }
    }
  }
  
  _subscribers.forEach(sub => sub(mutation, this.state))
}
```

## 10. 实际应用示例

### 10.1 完整的 Store 实现

```javascript
class Store {
  constructor(options = {}) {
    // 自动安装
    if (Vue && typeof Vue.use === 'function') {
      Vue.use(Vuex)
    }
    
    const {
      plugins = [],
      strict = false
    } = options
    
    // 内部状态
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()
    this._makeLocalGettersCache = Object.create(null)
    
    // 绑定 commit 和 dispatch 到自身
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options)
    }
    
    // 严格模式
    this.strict = strict
    
    const state = this._modules.root.state
    
    // 初始化根模块
    installModule(this, state, [], this._modules.root)
    
    // 初始化 store vm
    resetStoreVM(this, state)
    
    // 应用插件
    plugins.forEach(plugin => plugin(this))
    
    const useDevtools = options.devtools !== false
    if (useDevtools && typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('vuex:init', this)
      
      this._devtoolUnsubscribe = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.subscribe('vuex:travel-to-state', targetState => {
        this._withCommit(() => {
          this._vm._data.$$state = targetState
        })
      })
    }
  }
}
```

## 11. 总结

Vuex 的核心实现原理包括：

1. **响应式系统**: 利用 Vue 的响应式系统实现状态变化自动更新
2. **模块化**: 通过 ModuleCollection 管理模块树结构
3. **命名空间**: 通过命名空间隔离不同模块的状态
4. **插件系统**: 提供扩展机制，支持持久化、日志等功能
5. **严格模式**: 确保状态只能通过 mutation 修改
6. **辅助函数**: 提供 mapState、mapMutations 等便捷方法
7. **性能优化**: 通过计算属性缓存和批量更新提升性能

Vuex 的设计理念是集中式状态管理，通过单向数据流确保状态变化的可预测性和可追踪性。 