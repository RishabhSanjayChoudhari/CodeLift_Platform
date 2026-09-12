# Mastering Event Loop, Promises, and Async/Await

In modern JavaScript engineering, understanding how asynchronous execution works under the hood is critical for building responsive, high-performance web applications.

---

## 1. The JavaScript Concurrency Model

JavaScript is a **single-threaded non-blocking event-driven** runtime. Its execution engine consists of:

- **Call Stack**: Synchronous execution frames pushed and popped in LIFO order.
- **Web APIs / Node APIs**: Platform threads handling timers (`setTimeout`), network requests (`fetch`), and file I/O.
- **Microtask Queue**: High-priority FIFO queue for `Promise.then`, `queueMicrotask`, and `MutationObserver`.
- **Macrotask Queue (Task Queue)**: Lower-priority FIFO queue for `setTimeout`, `setInterval`, `setImmediate`, and UI rendering.

```
       ┌─────────────────────────────┐
       │         Call Stack          │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │     Microtask Queue         │  <-- Processed completely before any macrotask
       │  (Promises, queueMicrotask) │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │      Task / Macrotask       │  <-- One task run per loop tick
       │   (Timers, I/O events)      │
       └─────────────────────────────┘
```

---

## 2. Microtasks vs Macrotasks in Code

Consider this classic question:

```javascript
console.log('1: Sync start');

setTimeout(() => {
  console.log('2: Timeout callback (macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise resolution (microtask)');
});

queueMicrotask(() => {
  console.log('4: Explicit microtask');
});

console.log('5: Sync end');
```

**Execution Order:**
1. `1: Sync start`
2. `5: Sync end`
3. `3: Promise resolution (microtask)`
4. `4: Explicit microtask`
5. `2: Timeout callback (macrotask)`

---

## 3. Best Practices for Async Code
- **Always handle rejections**: Never leave unhandled promise rejections dangling.
- **Run independent tasks concurrently**: Use `Promise.all()` or `Promise.allSettled()` rather than sequential `await` where operations do not depend on each other.
- **Avoid blocking the Call Stack**: Heavy computations should be delegated to Web Workers or broken into chunks using `scheduler.yield()` or microtask slicing.
