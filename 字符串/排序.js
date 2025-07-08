// 1. 冒泡
  const maoPao = (arr) => {
    const length = arr.length;
    let isSorted = false;
    for(let i = 0; i < length - 1; i++) {
      for(let j = i + 1; j < length; j++) {
        if(arr[i] > arr[j]) { // 前面的大于后面的
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          isSorted = true
        }
      }
      if(!isSorted) break; // 有一次遍历时不需要换位置表示已经拍好了
    }
    return arr;
  }
//2. 快速排序
function quickSort(arr, left = 0, right = arr.length - 1) {
  if(left >= right) return;
  let pivot = arr[left];
  let i = left, j = right;
  while(i<j) {
    // 左边的下标要小于右边的切左边的值应该比标准值小
    while(i< j && arr[j] >= pivot) j--;
    arr[i] = arr[j];
    while(i < j && arr[i] <= pivot) i++;
    arr[j] = arr[i];
  }
  arr[i] = pivot;// 标准值

  quickSort(arr, left, i-1); // 排序左边
  quickSort(arr, i+1, right); // 排序右边
  return arr;
}

//3. 最长递增子序列
// LIS（最长递增子序列）算法实现步骤分析：
// 1. 初始化一个空数组 tails，用于存储当前所有长度的递增子序列的最小结尾元素。
// 2. 遍历输入数组 nums 中的每个元素 num：
//    a. 对 tails 数组进行二分查找，查找 num 应该插入的位置（left）。
//       - left 初始为 0，right 初始为 tails.length。
//       - 当 left < right 时，取中间位置 mid：
//         - 如果 num > tails[mid]，说明 num 可以接在 tails[mid] 后面，left = mid + 1。
//         - 否则，num 更小或相等，right = mid。
//    b. 将 num 放到 tails[left] 位置，表示长度为 left+1 的递增子序列的最小结尾被 num 更新。
// 3. 遍历结束后，tails 的长度即为最长递增子序列的长度，tails 数组内容为每种长度下的最小结尾元素（不一定是实际子序列）。
// 4. 返回 tails 数组。

function LIS(nums) {
  const tails = [];
  for(const num of nums) {
    let left = 0;
    let right = tails.length;
    // 二分查找 num 应插入的位置
    while(left < right) {
      const mid = (left + right) >>> 1;
      if(num > tails[mid]) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    // 更新 tails[left] 为 num
    tails[left] = num;
  }
  return tails;
}

