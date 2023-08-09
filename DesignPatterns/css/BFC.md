### fc formatting contexts
    - 类型
        - 块格式化上下文
            - bfc 排布元素的方式与默认排布规则相似
            - bfc 包含其内部的所有内容，float和clear仅适用于同一格式上下文中的项目，而页边距仅在同一格式上下文中的元素之间折叠。
            - 产生bfc的规则
            ```
                1. elements made to float using float
                2. absolutely positioned elements (including position: fixed or position: sticky
                3. elements with display: inline-block
                4. table cells or elements with display: table-cell, including anonymous table cells created when using the 5. display: table-* properties
                6. table captions or elements with display: table-caption
                7. block elements where overflow has a value other than visible
                8. elements with display: flow-root or display: flow-root list-item
                9. elements with contain: layout, content, or strict
                10. flex items
                11. grid items
                12. multicol containers
                13. elements with column-span set to all
            ```
            - 使用包含块上的display:flow-root（或display:flow-root-list-item）将创建一个新的BFC，而不会产生任何其他潜在的问题副作用。
        - 内联格式化上下文
            - Inline formatting contexts exist inside other formatting contexts and can be thought of as the context of a paragraph
            - in the inline formatting context, the line boxes will not be pushed apart by padding and borders.
        - 灵活格式化上下文


