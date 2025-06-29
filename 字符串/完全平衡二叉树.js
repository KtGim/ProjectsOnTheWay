// 完全平衡二叉树节点类
class PerfectTreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// 完全平衡二叉树类
class PerfectBinaryTree {
    constructor() {
        this.root = null;
    }

    // 计算树的高度
    getHeight(node = this.root) {
        if (!node) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    // 计算节点总数
    getNodeCount(node = this.root) {
        if (!node) return 0;
        return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
    }

    // 检查是否为完全平衡二叉树
    isPerfect(node = this.root) {
        if (!node) return true;
        
        const height = this.getHeight(node);
        const nodeCount = this.getNodeCount(node);
        
        // 完全平衡二叉树的节点数应该是 2^height - 1
        return nodeCount === Math.pow(2, height) - 1;
    }

    // 构建完全平衡二叉树（给定高度）
    buildPerfectTree(height, startValue = 1) {
        console.log(`构建高度为 ${height} 的完全平衡二叉树`);
        
        if (height <= 0) {
            this.root = null;
            return;
        }

        this.root = this.buildPerfectTreeRecursive(height, startValue);
        console.log(`构建完成，节点总数: ${this.getNodeCount()}`);
    }

    // 递归构建完全平衡二叉树
    buildPerfectTreeRecursive(height, startValue) {
        if (height === 0) return null;

        const node = new PerfectTreeNode(startValue);
        
        if (height > 1) {
            // 计算左子树和右子树的起始值
            const leftStartValue = startValue + 1;
            const rightStartValue = startValue + Math.pow(2, height - 1);
            
            node.left = this.buildPerfectTreeRecursive(height - 1, leftStartValue);
            node.right = this.buildPerfectTreeRecursive(height - 1, rightStartValue);
        }

        return node;
    }

    // 层序遍历（广度优先遍历）
    levelOrderTraversal() {
        if (!this.root) {
            console.log("树为空");
            return [];
        }

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                currentLevel.push(node.value);

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }

            result.push(currentLevel);
        }

        return result;
    }

    // 前序遍历
    preorderTraversal(node = this.root, result = []) {
        if (node) {
            result.push(node.value);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
        return result;
    }

    // 中序遍历
    inorderTraversal(node = this.root, result = []) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.value);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }

    // 后序遍历
    postorderTraversal(node = this.root, result = []) {
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.value);
        }
        return result;
    }

    // 打印树结构
    printTree() {
        if (!this.root) {
            console.log("树为空");
            return;
        }

        console.log("\n完全平衡二叉树结构:");
        this.printNode(this.root, "", true);
    }

    printNode(node, prefix, isLeft) {
        if (node) {
            console.log(prefix + (isLeft ? "└── " : "┌── ") + node.value);
            
            this.printNode(node.left, prefix + (isLeft ? "    " : "│   "), true);
            this.printNode(node.right, prefix + (isLeft ? "    " : "│   "), false);
        }
    }

    // 获取指定层的节点
    getNodesAtLevel(level) {
        if (!this.root) return [];
        
        const result = [];
        this.getNodesAtLevelRecursive(this.root, 0, level, result);
        return result;
    }

    getNodesAtLevelRecursive(node, currentLevel, targetLevel, result) {
        if (!node) return;
        
        if (currentLevel === targetLevel) {
            result.push(node.value);
            return;
        }
        
        this.getNodesAtLevelRecursive(node.left, currentLevel + 1, targetLevel, result);
        this.getNodesAtLevelRecursive(node.right, currentLevel + 1, targetLevel, result);
    }

    // 计算树的统计信息
    getTreeStats() {
        const height = this.getHeight();
        const nodeCount = this.getNodeCount();
        const isPerfect = this.isPerfect();
        
        return {
            height,
            nodeCount,
            isPerfect,
            expectedNodeCount: Math.pow(2, height) - 1,
            nodesPerLevel: this.getNodesPerLevel()
        };
    }

    // 获取每层的节点数
    getNodesPerLevel() {
        const stats = {};
        const height = this.getHeight();
        
        for (let level = 0; level < height; level++) {
            const nodes = this.getNodesAtLevel(level);
            stats[level] = {
                nodeCount: nodes.length,
                nodes: nodes
            };
        }
        
        return stats;
    }
}

// 演示完全平衡二叉树
console.log("=== 完全平衡二叉树演示 ===\n");

// 创建完全平衡二叉树实例
const perfectTree = new PerfectBinaryTree();

// 构建高度为3的完全平衡二叉树
perfectTree.buildPerfectTree(3);

// 打印树结构
perfectTree.printTree();

// 获取树的基本信息
const stats = perfectTree.getTreeStats();
console.log("\n=== 树的基本信息 ===");
console.log(`树的高度: ${stats.height}`);
console.log(`节点总数: ${stats.nodeCount}`);
console.log(`是否为完全平衡二叉树: ${stats.isPerfect}`);
console.log(`理论节点数 (2^${stats.height} - 1): ${stats.expectedNodeCount}`);

// 显示每层的节点信息
console.log("\n=== 每层节点信息 ===");
Object.entries(stats.nodesPerLevel).forEach(([level, info]) => {
    console.log(`第 ${level} 层: ${info.nodeCount} 个节点 - [${info.nodes.join(', ')}]`);
});

// 遍历演示
console.log("\n=== 遍历结果 ===");
console.log(`层序遍历: ${JSON.stringify(perfectTree.levelOrderTraversal())}`);
console.log(`前序遍历: [${perfectTree.preorderTraversal().join(', ')}]`);
console.log(`中序遍历: [${perfectTree.inorderTraversal().join(', ')}]`);
console.log(`后序遍历: [${perfectTree.postorderTraversal().join(', ')}]`);

// 验证完全平衡二叉树的性质
console.log("\n=== 完全平衡二叉树性质验证 ===");
console.log(`1. 所有内部节点都有两个子节点: ${perfectTree.verifyInternalNodes()}`);
console.log(`2. 所有叶子节点都在同一层: ${perfectTree.verifyLeafLevels()}`);
console.log(`3. 节点总数符合公式 2^h - 1: ${stats.nodeCount === stats.expectedNodeCount}`);

// 添加验证方法
PerfectBinaryTree.prototype.verifyInternalNodes = function(node = this.root) {
    if (!node) return true;
    
    // 如果是叶子节点，返回true
    if (!node.left && !node.right) return true;
    
    // 如果是内部节点，必须有两个子节点
    if (!node.left || !node.right) return false;
    
    return this.verifyInternalNodes(node.left) && this.verifyInternalNodes(node.right);
};

PerfectBinaryTree.prototype.verifyLeafLevels = function() {
    const leafLevels = new Set();
    this.collectLeafLevels(this.root, 0, leafLevels);
    return leafLevels.size === 1;
};

PerfectBinaryTree.prototype.collectLeafLevels = function(node, level, leafLevels) {
    if (!node) return;
    
    if (!node.left && !node.right) {
        leafLevels.add(level);
        return;
    }
    
    this.collectLeafLevels(node.left, level + 1, leafLevels);
    this.collectLeafLevels(node.right, level + 1, leafLevels);
};

// 演示不同高度的完全平衡二叉树
console.log("\n=== 不同高度的完全平衡二叉树演示 ===");

for (let height = 1; height <= 4; height++) {
    console.log(`\n--- 高度为 ${height} 的完全平衡二叉树 ---`);
    const tree = new PerfectBinaryTree();
    tree.buildPerfectTree(height);
    
    const treeStats = tree.getTreeStats();
    console.log(`节点数: ${treeStats.nodeCount}, 理论值: ${treeStats.expectedNodeCount}`);
    console.log(`层序遍历: ${JSON.stringify(tree.levelOrderTraversal())}`);
}