class MinHeap {
  constructor {
    this.heap = [];
  }

  swap (i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  shiftUp(index) {
    while(index > 0) {
      const parentIndex = (index - 1) >>> 1;
      if(this.heap[parentIndex] <= this.heap[index]) {
        break;
      }
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  shiftDown(index) {
    const half = this.heap.length >>> 1;
    while(index < half) {
      const halfLeftIndex = (index + 1) << 1;
      const halfRightIndex = halfLeftIndex + 1;
      const smallerIndex = this.heap[halfLeftIndex] < this.heap[index] ? halfLeftIndex : index;
      if(halfRightIndex < this.heap.length && this.heap[halfRightIndex] < this.heap[smallerIndex]) {
        smallerIndex = halfRightIndex;
      }
      if(this.heap[index] < this.[smallerIndex]) {
        break;
      }
      this.swap(index, smallerIndex);
      index = smallerIndex;
    }
  }

  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }

  extract() {
    if(this.heap.length == 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if(this.heap.length > 0) {
      this.heap[0] = last;
      this.shiftDown(0);
    }
    return top;
  }

}