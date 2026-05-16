/**
 * Stage 1: Priority Inbox
 * Campus Notification Platform
 *
 * Finds the top-N most important unread notifications.
 * Priority is determined by:
 *   1. Type weight: placement (3) > result (2) > event (1)
 *   2. Recency: newer notifications are ranked higher within the same weight
 *
 * Approach: Min-Heap of size N
 *   - We maintain a min-heap of size N.
 *   - For each incoming notification, if it scores higher than the heap's
 *     minimum, we pop the minimum and push the new notification.
 *   - This runs in O(M log N) time where M is total notifications.
 *   - This scales efficiently as new notifications stream in.
 */

const { Logger } = require("../logging_middleware/logger");

const logger = new Logger("PriorityInbox");

// ─── Type Weights ────────────────────────────────────────────────────────────
const TYPE_WEIGHT = {
  placement: 3,
  result: 2,
  event: 1,
};

// ─── Score Calculation ────────────────────────────────────────────────────────
/**
 * Computes a composite priority score for a notification.
 * Score = typeWeight * 1e13 + timestamp (ms)
 * Multiplying weight by a large constant ensures type always dominates,
 * while timestamp breaks ties within the same type.
 */
function computeScore(notification) {
  const weight = TYPE_WEIGHT[notification.type] ?? 0;
  const ts = new Date(notification.timestamp).getTime();
  return weight * 1e13 + ts;
}

// ─── Min-Heap Implementation ──────────────────────────────────────────────────
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

// ─── Priority Inbox Class ─────────────────────────────────────────────────────
class PriorityInbox {
  /**
   * @param {number} n - Number of top notifications to maintain
   */
  constructor(n = 10) {
    this.n = n;
    this.heap = new MinHeap();
    logger.info("PriorityInbox initialized", { topN: n });
  }

  /**
   * Add a single notification to the inbox.
   * Uses a min-heap of size N to efficiently maintain the top N.
   * @param {object} notification
   */
  addNotification(notification) {
    if (!notification.read === false) {
      // Only process unread notifications
      logger.debug("Skipping read notification", { id: notification.id });
      return;
    }

    const score = computeScore(notification);
    const entry = { score, notification };

    logger.debug("Processing notification", {
      id: notification.id,
      type: notification.type,
      score,
    });

    if (this.heap.size() < this.n) {
      this.heap.push(entry);
      logger.debug("Added to heap (heap not full)", { heapSize: this.heap.size() });
    } else if (score > this.heap.peek().score) {
      const evicted = this.heap.pop();
      this.heap.push(entry);
      logger.debug("Replaced lower-priority notification", {
        evictedId: evicted.notification.id,
        newId: notification.id,
      });
    } else {
      logger.debug("Notification did not make top N", { id: notification.id });
    }
  }

  /**
   * Bulk-load notifications.
   * @param {object[]} notifications
   */
  loadNotifications(notifications) {
    logger.info("Loading notifications in bulk", { count: notifications.length });
    for (const n of notifications) {
      this.addNotification(n);
    }
    logger.info("Bulk load complete", { topNSize: this.heap.size() });
  }

  /**
   * Get the top N notifications sorted highest-priority first.
   * @returns {object[]}
   */
  getTopN() {
    logger.info("Retrieving top N notifications", { n: this.n });

    // Extract all from heap, then sort descending
    const entries = [...this.heap.heap];
    entries.sort((a, b) => b.score - a.score);

    const results = entries.map((e) => e.notification);
    logger.info("Top N retrieved", { count: results.length });
    return results;
  }
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const sampleNotifications = [
  { id: "n1",  type: "event",     title: "Cultural Fest Registration Open",         timestamp: "2024-11-01T08:00:00Z", read: false },
  { id: "n2",  type: "placement", title: "Google On-Campus Drive – Register Now",    timestamp: "2024-11-01T09:00:00Z", read: false },
  { id: "n3",  type: "result",    title: "Mid-Semester Exam Results Published",      timestamp: "2024-11-01T10:00:00Z", read: false },
  { id: "n4",  type: "placement", title: "Microsoft Internship Applications Open",   timestamp: "2024-11-02T08:30:00Z", read: false },
  { id: "n5",  type: "event",     title: "Alumni Networking Night – RSVP by Friday", timestamp: "2024-11-02T09:00:00Z", read: false },
  { id: "n6",  type: "result",    title: "Hackathon Results Announced",              timestamp: "2024-11-02T11:00:00Z", read: false },
  { id: "n7",  type: "placement", title: "Amazon SDE Internship – Shortlist Out",   timestamp: "2024-11-03T07:00:00Z", read: false },
  { id: "n8",  type: "event",     title: "Tech Talk: AI in Healthcare",              timestamp: "2024-11-03T08:00:00Z", read: false },
  { id: "n9",  type: "result",    title: "Project Viva Grades Released",             timestamp: "2024-11-03T09:00:00Z", read: false },
  { id: "n10", type: "placement", title: "Infosys Walk-in Interview – Tomorrow",     timestamp: "2024-11-03T10:00:00Z", read: false },
  { id: "n11", type: "event",     title: "Sports Day Registrations Close Tonight",   timestamp: "2024-11-03T11:00:00Z", read: false },
  { id: "n12", type: "result",    title: "CGPA Updated on Student Portal",           timestamp: "2024-11-04T07:00:00Z", read: false },
  { id: "n13", type: "placement", title: "Wipro Elite Recruitment Drive",            timestamp: "2024-11-04T08:00:00Z", read: false },
  { id: "n14", type: "event",     title: "Annual Coding Competition – Register Now", timestamp: "2024-11-04T09:00:00Z", read: false },
  { id: "n15", type: "placement", title: "TCS NQT Exam Scheduled for Next Week",     timestamp: "2024-11-04T10:00:00Z", read: false },
  { id: "n16", type: "result",    title: "Supplementary Exam Results Declared",      timestamp: "2024-11-04T11:00:00Z", read: false },
  { id: "n17", type: "event",     title: "Freshers' Orientation – Join the Session", timestamp: "2024-11-05T08:00:00Z", read: false },
  { id: "n18", type: "placement", title: "Deloitte Campus Hiring – Apply Now",       timestamp: "2024-11-05T09:00:00Z", read: false },
  { id: "n19", type: "result",    title: "Internal Assessment Marks Published",      timestamp: "2024-11-05T10:00:00Z", read: false },
  { id: "n20", type: "placement", title: "Accenture Off-Campus Drive Open",          timestamp: "2024-11-05T11:00:00Z", read: false },
];

// ─── Run ──────────────────────────────────────────────────────────────────────
logger.info("=== Campus Priority Inbox – Stage 1 ===");

const inbox = new PriorityInbox(10);
inbox.loadNotifications(sampleNotifications);

const topNotifications = inbox.getTopN();

logger.info("=== TOP 10 PRIORITY NOTIFICATIONS ===");
topNotifications.forEach((n, i) => {
  logger.info(`#${i + 1}`, {
    id: n.id,
    type: n.type,
    title: n.title,
    timestamp: n.timestamp,
  });
});

// ─── Simulate streaming new notifications ────────────────────────────────────
logger.info("=== Simulating new incoming notifications ===");

const newNotifications = [
  { id: "n21", type: "placement", title: "Meta Internship Drive – Urgent Apply", timestamp: "2024-11-06T06:00:00Z", read: false },
  { id: "n22", type: "event",     title: "Library Book Fair",                    timestamp: "2024-10-01T06:00:00Z", read: false },
];

for (const n of newNotifications) {
  logger.info("New notification arrived", { id: n.id, type: n.type });
  inbox.addNotification(n);
}

const updatedTop = inbox.getTopN();
logger.info("=== UPDATED TOP 10 AFTER NEW NOTIFICATIONS ===");
updatedTop.forEach((n, i) => {
  logger.info(`#${i + 1}`, {
    id: n.id,
    type: n.type,
    title: n.title,
    timestamp: n.timestamp,
  });
});

module.exports = { PriorityInbox, computeScore, TYPE_WEIGHT };
