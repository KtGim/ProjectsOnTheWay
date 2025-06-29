// 二叉树节点类
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// 二叉树类
class BinaryTree {
    constructor() {
        this.root = null;
    }

    // 插入节点（简单的二叉搜索树插入方式）
    insert(value) {
        const newNode = new TreeNode(value);
        
        if (!this.root) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
    }

    // ========== 递归遍历方法 ==========

    // 前序遍历（根-左-右）
    preorderRecursive(node = this.root, result = []) {
        if (node) {
            result.push(node.value);           // 访问根节点
            this.preorderRecursive(node.left, result);   // 遍历左子树
            this.preorderRecursive(node.right, result);  // 遍历右子树
        }
        return result;
    }

    // 中序遍历（左-根-右）
    inorderRecursive(node = this.root, result = []) {
        if (node) {
            this.inorderRecursive(node.left, result);    // 遍历左子树
            result.push(node.value);          // 访问根节点
            this.inorderRecursive(node.right, result);   // 遍历右子树
        }
        return result;
    }

    // 后序遍历（左-右-根）
    postorderRecursive(node = this.root, result = []) {
        if (node) {
            this.postorderRecursive(node.left, result);  // 遍历左子树
            this.postorderRecursive(node.right, result); // 遍历右子树
            result.push(node.value);          // 访问根节点
        }
        return result;
    }

    // ========== 迭代遍历方法 ==========

    // 前序遍历（迭代）
    preorderIterative() {
        if (!this.root) return [];
        
        const result = [];
        const stack = [this.root];
        
        while (stack.length > 0) {
            const node = stack.pop();
            result.push(node.value);
            
            // 先压入右子节点，再压入左子节点（因为栈是LIFO）
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
        }
        
        return result;
    }

    // 中序遍历（迭代）
    inorderIterative() {
        if (!this.root) return [];
        
        const result = [];
        const stack = [];
        let current = this.root;
        
        while (current || stack.length > 0) {
            // 一直向左走到底
            while (current) {
                stack.push(current);
                current = current.left;
            }
            
            // 弹出栈顶元素并访问
            current = stack.pop();
            result.push(current.value);
            
            // 转向右子树
            current = current.right;
        }
        
        return result;
    }

    // 后序遍历（迭代）
    postorderIterative() {
        if (!this.root) return [];
        
        const result = [];
        const stack = [this.root];
        
        while (stack.length > 0) {
            const node = stack.pop();
            result.unshift(node.value); // 在开头插入，实现逆序
            
            // 先压入左子节点，再压入右子节点
            if (node.left) stack.push(node.left);
            if (node.right) stack.push(node.right);
        }
        
        return result;
    }

    // 层序遍历（广度优先遍历）
    levelOrder() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];
            
            // 处理当前层的所有节点
            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                currentLevel.push(node.value);
                
                // 将子节点加入队列
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
            
            result.push(currentLevel);
        }
        
        return result;
    }

    // 层序遍历（返回一维数组）
    levelOrderFlat() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.value);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return result;
    }

    // ========== 特殊遍历方法 ==========

    // 锯齿形层序遍历（Zigzag）
    zigzagLevelOrder() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        let leftToRight = true;
        
        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];
            
            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                
                if (leftToRight) {
                    currentLevel.push(node.value);
                } else {
                    currentLevel.unshift(node.value);
                }
                
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
            
            result.push(currentLevel);
            leftToRight = !leftToRight;
        }
        
        return result;
    }

    // 垂直遍历（按列遍历）
    verticalOrder() {
        if (!this.root) return [];
        
        const columnMap = new Map();
        const queue = [{node: this.root, col: 0}];
        
        while (queue.length > 0) {
            const {node, col} = queue.shift();
            
            if (!columnMap.has(col)) {
                columnMap.set(col, []);
            }
            columnMap.get(col).push(node.value);
            
            if (node.left) queue.push({node: node.left, col: col - 1});
            if (node.right) queue.push({node: node.right, col: col + 1});
        }
        
        // 按列号排序并返回结果
        return Array.from(columnMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([_, values]) => values);
    }

    // 边界遍历
    boundaryTraversal() {
        if (!this.root) return [];
        
        const result = [];
        
        // 1. 添加根节点
        result.push(this.root.value);
        
        // 2. 添加左边界（不包括叶子节点）
        this.addLeftBoundary(this.root.left, result);
        
        // 3. 添加叶子节点
        this.addLeaves(this.root, result);
        
        // 4. 添加右边界（不包括叶子节点，逆序）
        this.addRightBoundary(this.root.right, result);
        
        return result;
    }

    addLeftBoundary(node, result) {
        if (!node || (!node.left && !node.right)) return;
        
        result.push(node.value);
        if (node.left) {
            this.addLeftBoundary(node.left, result);
        } else {
            this.addLeftBoundary(node.right, result);
        }
    }

    addLeaves(node, result) {
        if (!node) return;
        
        if (!node.left && !node.right) {
            result.push(node.value);
            return;
        }
        
        this.addLeaves(node.left, result);
        this.addLeaves(node.right, result);
    }

    addRightBoundary(node, result) {
        if (!node || (!node.left && !node.right)) return;
        
        if (node.right) {
            this.addRightBoundary(node.right, result);
        } else {
            this.addRightBoundary(node.left, result);
        }
        result.push(node.value);
    }

    // 打印树结构
    printTree() {
        if (!this.root) {
            console.log("树为空");
            return;
        }

        console.log("\n二叉树结构:");
        this.printNode(this.root, "", true);
    }

    printNode(node, prefix, isLeft) {
        if (node) {
            console.log(prefix + (isLeft ? "└── " : "┌── ") + node.value);
            
            this.printNode(node.left, prefix + (isLeft ? "    " : "│   "), true);
            this.printNode(node.right, prefix + (isLeft ? "    " : "│   "), false);
        }
    }
}

// 演示二叉树遍历
console.log("=== 二叉树遍历详解 ===\n");

// 创建二叉树
const tree = new BinaryTree();

// 插入节点构建示例树
console.log("构建示例二叉树...");
const values = [8, 3, 10, 1, 6, 14, 4, 7, 13];
values.forEach(value => tree.insert(value));

// 打印树结构
tree.printTree();

// ========== 基本遍历演示 ==========
console.log("\n=== 基本遍历方法 ===");

console.log("\n1. 前序遍历（根-左-右）:");
console.log(`   递归: [${tree.preorderRecursive().join(', ')}]`);
console.log(`   迭代: [${tree.preorderIterative().join(', ')}]`);

console.log("\n2. 中序遍历（左-根-右）:");
console.log(`   递归: [${tree.inorderRecursive().join(', ')}]`);
console.log(`   迭代: [${tree.inorderIterative().join(', ')}]`);

console.log("\n3. 后序遍历（左-右-根）:");
console.log(`   递归: [${tree.postorderRecursive().join(', ')}]`);
console.log(`   迭代: [${tree.postorderIterative().join(', ')}]`);

console.log("\n4. 层序遍历（广度优先）:");
console.log(`   分层: ${JSON.stringify(tree.levelOrder())}`);
console.log(`   一维: [${tree.levelOrderFlat().join(', ')}]`);

// ========== 特殊遍历演示 ==========
console.log("\n=== 特殊遍历方法 ===");

console.log("\n5. 锯齿形层序遍历:");
console.log(`   结果: ${JSON.stringify(tree.zigzagLevelOrder())}`);

console.log("\n6. 垂直遍历:");
console.log(`   结果: ${JSON.stringify(tree.verticalOrder())}`);

console.log("\n7. 边界遍历:");
console.log(`   结果: [${tree.boundaryTraversal().join(', ')}]`);

// ========== 遍历应用示例 ==========
console.log("\n=== 遍历应用示例 ===");

// 计算树的高度
function getTreeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
}

// 计算节点总数
function getNodeCount(node) {
    if (!node) return 0;
    return 1 + getNodeCount(node.left) + getNodeCount(node.right);
}

// 查找最大值
function findMax(node) {
    if (!node) return -Infinity;
    return Math.max(node.value, findMax(node.left), findMax(node.right));
}

// 查找最小值
function findMin(node) {
    if (!node) return Infinity;
    return Math.min(node.value, findMin(node.left), findMin(node.right));
}

console.log(`\n树的高度: ${getTreeHeight(tree.root)}`);
console.log(`节点总数: ${getNodeCount(tree.root)}`);
console.log(`最大值: ${findMax(tree.root)}`);
console.log(`最小值: ${findMin(tree.root)}`);

// ========== 遍历的时间复杂度分析 ==========
console.log("\n=== 时间复杂度分析 ===");
console.log("• 递归遍历: O(n) 时间, O(h) 空间 (h为树的高度)");
console.log("• 迭代遍历: O(n) 时间, O(w) 空间 (w为树的最大宽度)");
console.log("• 层序遍历: O(n) 时间, O(w) 空间");
console.log("• 特殊遍历: O(n) 时间, O(n) 空间");

// ========== 遍历的应用场景 ==========
console.log("\n=== 遍历的应用场景 ===");
console.log("• 前序遍历: 复制树、前缀表达式");
console.log("• 中序遍历: 二叉搜索树的有序输出、中缀表达式");
console.log("• 后序遍历: 删除树、后缀表达式、计算目录大小");
console.log("• 层序遍历: 广度优先搜索、按层打印、找最短路径");
console.log("• 锯齿形遍历: 蛇形打印、特殊布局");
console.log("• 垂直遍历: 列视图、特殊布局");
console.log("• 边界遍历: 树的轮廓、特殊路径");