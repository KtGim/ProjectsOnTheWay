### bem 规范
    - BEM的意思就是块（block）、元素（element）、修饰符（modifier）
     ```
        .block{}  // 代表了更高级别的抽象或组件
        .block__element{}  // 代表.block的后代，用于形成一个完整的.block的整体
        .block--modifier{}  // 代表.block的不同状态或不同版本
     ```