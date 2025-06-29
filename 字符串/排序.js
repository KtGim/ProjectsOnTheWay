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


