/**
 * 
 * 二叉树遍历是指从根结点出发，按照某种次序依次访问二叉树中所有的结点，使得每个结点被访问依次且仅被访问一次。
 * 常见的四种遍历方式分别为：先序遍历、中序遍历、后序遍历、层序遍历。
 * 
 * 先序遍历：先遍历根结点，然后遍历左子树，最后遍历右子树。
 * 中序遍历：先遍历左子树，然后遍历根结点，最后遍历右子树。
 * 后序遍历：先遍历左子树，然后遍历右子树，最后遍历根结点。
 * 层序遍历：按层次顺序访问二叉树的每一个节点。
 * 
 * https://blog.csdn.net/crr411422/article/details/129954368
 * 小顶堆，大顶堆
 * 堆是一种完全二叉树。完全二叉树的定义：所有节点从上往下，从左往右的依次排列，不能有空位置，是为完全二叉树
 * 
 * 大顶堆
 *   根节点（堆顶元素）是所有节点中的最大值（父节点都大于左右子节点）。大顶堆常用于实现优先队列，且可用于构建堆排序算法。
 * 小顶堆
 *   小顶堆中的根节点是所有节点中的最小值（父节点都小于左右子节点）。小顶堆常用于问题如：查找流中的前 K 个最小元素。
 * 
 * 完全二叉树在内存中可以使用 数组来表示因此会包含至少5个指针：
 *  leftChild,rightChild,parent, 数组Index
 * 每个节点对应在数组中的位置
 *  Math.Floor((index - 1) / 2)
 * 
 * https://blog.csdn.net/zhongqw_00/article/details/100000259   js 实现二叉树的遍历
 * 
 */

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.parent = null;
}

function buildTree (arr, node, i) {
  let leftIndex = 2*i + 1;
  let rightIndex = 2*i + 2;
  if(leftIndex < arr.length) {
    node.left = new Node(arr[leftIndex]);
    buildTree(arr, node.left, leftIndex);
  }
  if(rightIndex < arr.length) {
    node.right = new Node(arr[rightIndex]);
    buildTree(arr, node.right, rightIndex);
  }
}

// 前序遍历 - 递归
function preOrder(node) {
  if(node) {
    console.log(node.val);
    preOrder(node.left);
    preOrder(node.left);
  }
}

// 前序遍历 - 非递归
function preOrder2(node) {
  const stack = [];
  const res = [];
  if(node) {
    stack.push(node);
  }
  while(stack.length) {
    let cur = stack.pop();
    res.push(cur.val);
    while(cur.left) {
      stack.push(cur.left);
    }
    while(cur.right) {
      stack.push(cur.right);
    }
  }
  return res;
}

// 中序遍历 - 递归
function inOrder(node) {
  if(node) {
    inOrder(node.left);
    console.log(node);
    inOrder(node.right);
  }
}

// 中序遍历 - 非递归
function inOrder2(node) {
  const stack = [];
  const res = [];
  node && stack.push(node);
  while(stack.length) {
    while(node.left) {
      stack.push(node.left);
    }
    const cur = stack.pop();
    res.push(cur.val);
    if(node.right) {
      stack.push(node.right);
    }
  }
  return res;
}

// 后序遍历 - 递归
function afterOrder(node) {
  if(node) {
    afterOrder(node.left);
    afterOrder(node.right);
    console.log(node.val);
  }
}

// 后序遍历 - 非递归
function afterOrder2(node) {
  const stack = [];
  const result = [];
  node && stack.push(node);
  while(stack.length) {
    while(node.left) {
      stack.push(node.left);
    }
    while(node.right) {
      stack.push(node.right);
    }
    const cur = stack.pop(); // 获取数组最后一位，二叉树中表示的是最下面的叶子结点
    result.push(cur.val);
  }
  return [];
}

// BFS 广度优先遍历
// 逐层遍历二叉树
function BFS(node) {
  if(!node) return [];
  const result = [];
  const queue = [node];
  while(queue.length) {
    const levelSize = queue.length;
    const currentLevel = [];
    for(let i = 0; i < levelSize; i++) {
      /**
       * [1,2,3,4,5,6]
       *      1
       *    2   3
       * 4    5   6
       */
      const qNode = queue.shift(); // 前面的元素，在树上的节点越靠上
      currentLevel.push(qNode.val);
      if(qNode.left){
        queue.push(qNode.left);
      }
      if(qNode.right) {
        queue.push(qNode.right);
      }
    }
    result.push(currentLevel)
  }
  return result;
}

// 遍历 N 叉树
function nTree(val) {
  this.val = val;
  this.children = [];
}

function levelOrder = (node) => {
  let result = [];
  let index = 0;
  const level = (node, index) => {
    if(!node) return;
    if(!result[index]) { result[index] = []; }
    result[index].push(node.val);
    node.children.forEach(child => {
      level(child, index + 1)
    });
  }
  level(node, index);
  return result;
}


const arr = [1,2,3,4,5,6];
let root = new Node(arr[0]);
buildTree(arr, root, 0);