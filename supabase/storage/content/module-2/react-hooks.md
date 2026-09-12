# Deep Dive into Hooks, Concurrent Mode & Fiber Architecture

React's reconciliation engine transitioned from the recursive Stack reconciler to the fiber-based **Fiber Architecture**, enabling interruptible rendering, priority scheduling, and concurrent transitions.

---

## 1. What is a Fiber?

A Fiber is a lightweight JavaScript object that represents a unit of work. Unlike the browser's call stack which cannot be paused midway, Fibers can be scheduled, paused, resumed, or discarded based on browser idle deadlines (`requestIdleCallback` / lane priorities).

Key Fiber properties:
- `tag`: Type of component (FunctionComponent, ClassComponent, HostComponent).
- `memoizedState`: Linked list of hook nodes for functional components.
- `child`, `sibling`, `return`: Pointers defining the work tree hierarchy.
- `lanes`: Bitmask describing work priority.

---

## 2. Hook Rules Demystified

Why must Hooks only be called at the top level?

Hooks in React are stored as a **singly linked list** attached to the Fiber's `memoizedState`:

```javascript
type Hook = {
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any> | null,
  queue: UpdateQueue<any> | null,
  next: Hook | null
};
```

When a component re-renders, React walks the linked list in the exact order the hooks were initially invoked. Calling a hook inside an `if` block breaks pointer alignment, corrupting subsequent hook states!

---

## 3. Concurrent Hooks in Modern React
- `useTransition`: Mark non-urgent state updates that can be deferred or interrupted without freezing user input.
- `useDeferredValue`: Defer re-rendering a heavy subtree based on an updated prop or state.
- `useId`: Generate stable hydration-safe unique IDs for accessibility attributes.
