# Assignment 1: Custom Promise Implementation & Microtask Runner

## Objective
Build a lightweight, Promises/A+ compliant promise class named `MyPromise` from scratch in pure JavaScript.

---

## Requirements

1. **State Machine**:
   - States: `PENDING`, `FULFILLED`, `REJECTED`.
   - Transitions: `PENDING -> FULFILLED` (with value) or `PENDING -> REJECTED` (with reason). Once settled, state cannot change.

2. **Executor Execution**:
   - Accept an executor function `(resolve, reject) => { ... }`.
   - Safely execute the executor synchronously and catch thrown errors.

3. **Chaining (`.then`, `.catch`, `.finally`)**:
   - Must return a new `MyPromise` instance to support chaining.
   - Callbacks must be scheduled as microtasks using `queueMicrotask()`.
   - If the callback returns a promise, resolve the outer promise with that returned promise.

4. **Static Methods**:
   - Implement `MyPromise.resolve(value)`
   - Implement `MyPromise.reject(reason)`
   - Implement `MyPromise.all(promises)`

---

## Submission Instructions
1. Save your implementation in a single JavaScript file named `my-promise.js`.
2. Upload your file using the submission form below.
3. Our automated test harness will execute 25 test cases verifying async ordering, edge cases, and chaining.
