/**
 * Stage 1 logic ported for Stage 2 React App
 */

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const computeScore = (notification) => {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  // Handle space in "2026-04-22 17:51:30" by replacing with T for ISO compliance
  const isoTimestamp = notification.Timestamp ? notification.Timestamp.replace(' ', 'T') : '';
  const ts = new Date(isoTimestamp).getTime();
  const score = weight * 1e13 + (isNaN(ts) ? 0 : ts);
  return score;
};

class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].score <= this.heap[i].score) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l].score < this.heap[smallest].score) smallest = l;
      if (r < n && this.heap[r].score < this.heap[smallest].score) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

export const getTopNotifications = (notifications, n = 10) => {
  console.log('Calculating Top Notifications from:', notifications.length, 'items');
  const heap = new MinHeap();

  notifications.forEach((notification) => {
    const score = computeScore(notification);
    const entry = { score, notification };

    if (heap.size() < n) {
      heap.push(entry);
    } else if (score > heap.peek().score) {
      heap.pop();
      heap.push(entry);
    }
  });

  const results = [];
  while (heap.size() > 0) {
    results.push(heap.pop().notification);
  }

  const sorted = results.sort((a, b) => computeScore(b) - computeScore(a));
  console.log('Top Notifications calculated:', sorted.length);
  return sorted;
};
