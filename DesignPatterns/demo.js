const buildHeap = (arr) => {
  let size = arr.length;
  for(let i = Math.floor( size / 2); i >= 0; i--) {
    heapify(arr, size, i);
  }
  while(size > 1) {
    size --
    swap(arr, 0, size);
    heapify(arr, size, 0);
  }

  console.log(arr);
}

const heapify = (arr, size, i) => {
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  let l = i;
  if(left < size && arr[left] > arr[l]) {
    l = left;
  }
  if(right < size && arr[right] > arr[l]) {
    l = right
  }

  if(l !== i) {
    swap(arr, i, l);
    heapify(arr, size, l);
  }
}

const swap = (arr, index1, index2) => {
  const temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}
const arr = [3,5,1,6,4,7,2];

buildHeap(arr);