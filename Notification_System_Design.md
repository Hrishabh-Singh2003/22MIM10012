# Notification System Design

---

## Stage 1

### Problem Statement

The campus notification platform sends a high volume of notifications across three categories — **Placements**, **Results**, and **Events**. Users lose track of the most critical ones. The goal is to build a **Priority Inbox** that always surfaces the top‑N most important *unread* notifications, where priority is determined by:

1. **Type weight**: `placement (3) > result (2) > event (1)`
2. **Recency**: Among notifications of the same type, newer ones rank higher.

---

### Composite Score

Each notification is assigned a single numeric score that encodes both dimensions:

```
score = typeWeight × 10¹³ + timestamp_ms
```

- Multiplying the weight by `10¹³` (≈ 316 years in milliseconds) guarantees type always dominates recency — a placement from 2020 always outranks the most recent event.
- `timestamp_ms` (`Date.getTime()`) breaks ties within the same type, with newer timestamps producing higher scores.

| Type      | Weight | Example score (Nov 2024) |
|-----------|--------|--------------------------|
| placement | 3      | `3×10¹³ + 1.73×10¹²` ≈ `3.173×10¹³` |
| result    | 2      | `2×10¹³ + 1.73×10¹²` ≈ `2.173×10¹³` |
| event     | 1      | `1×10¹³ + 1.73×10¹²` ≈ `1.173×10¹³` |

---

### Algorithm: Min-Heap of Size N

#### Data structure choice

A **min-heap of fixed size N** is used instead of sorting the entire list every time.

```
              heap[0]  ← always the weakest of the current top-N
             /        \
          heap[1]    heap[2]
          ...
```

#### How it works

1. For each incoming notification, compute its score.
2. If `heap.size < N` → push directly.
3. Else if `score > heap.peek().score` → pop the weakest, push the new one.
4. Otherwise → discard.

At the end, extract all heap entries and **sort descending** to produce the ranked list.

#### Complexity

| Operation          | Cost         |
|--------------------|--------------|
| Process M notifications | `O(M log N)` |
| Extract top-N sorted    | `O(N log N)` |
| Stream one new notification | `O(log N)` |

This scales efficiently for large notification streams — no full re-sort is needed when a new notification arrives.

---

### Handling Continuous Incoming Notifications

Since new notifications keep arriving in real-time, the heap stays **alive in memory**:

- Each new notification is passed to `inbox.addNotification(notif)`.
- A single `O(log N)` comparison-and-swap keeps the top-N current at all times.
- No batch re-computation is needed — the heap self-maintains as the stream grows.

This makes it suitable for integration with a WebSocket or event-driven backend where notifications are pushed continuously.

---

### File Structure

```
22MIM10012/
├── logging_middleware/
│   └── logger.js              ← Custom structured logging middleware (no console.log)
├── notification_app_be/
│   └── priority_inbox.js      ← Stage 1: Priority Inbox algorithm (Min-Heap)
├── notification_app_fe/
│   └── priority_inbox_demo.html ← Visual demo UI with live simulation
├── Notification_System_Design.md
└── .gitignore
```

---

### Why Not a Simple Sort?

| Approach | Time (initial) | Time (new notification) | Memory |
|----------|----------------|-------------------------|--------|
| Sort all | `O(M log M)` | `O(M log M)` re-sort | `O(M)` |
| Min-Heap of N | `O(M log N)` | `O(log N)` | `O(N)` |

The min-heap is strictly superior — it processes each new notification in `O(log N)` and uses only `O(N)` memory regardless of total notification count.

---

### Logging

All operations use the custom `Logger` class from `logging_middleware/logger.js`. This produces structured, timestamped, leveled log entries (DEBUG / INFO / WARN / ERROR) with metadata — no `console.log` is used anywhere.

```
[2024-11-05T10:00:00Z] [INFO] [PriorityInbox] Top N retrieved | meta: {"count":10}
[2024-11-05T10:00:01Z] [DEBUG] [PriorityInbox] Replaced lower-priority notification | meta: {"evictedId":"n3","newId":"n21"}
```
