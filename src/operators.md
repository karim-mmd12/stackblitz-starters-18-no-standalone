Here’s an example demonstrating **all 4 operators** (`mergeMap`, `concatMap`, `switchMap`, `exhaustMap`) in a **stream processing context**. The example uses user actions (button clicks) and simulated API calls to showcase the differences between these operators.

---

### **Setup**
We'll simulate:
- A **button click** that triggers an observable.
- An **API call** that takes 2 seconds to complete.

We'll use the 4 operators to process the streams and show how they behave differently.

---

### **Code Example**

```javascript
import { fromEvent, of } from 'rxjs';
import { mergeMap, concatMap, switchMap, exhaustMap, delay } from 'rxjs/operators';

// Simulated API call (takes 2 seconds to respond)
const fakeApiCall = (id) => of(`Response from API: ${id}`).pipe(delay(2000));

// Button element
const button = document.querySelector('button');

// Stream of button clicks
const clicks$ = fromEvent(button, 'click');

// Using mergeMap
clicks$.pipe(
  mergeMap((_, index) => fakeApiCall(index + 1)) // Index represents API request ID
).subscribe(response => console.log('mergeMap:', response));

// Using concatMap
clicks$.pipe(
  concatMap((_, index) => fakeApiCall(index + 1)) // Requests are queued
).subscribe(response => console.log('concatMap:', response));

// Using switchMap
clicks$.pipe(
  switchMap((_, index) => fakeApiCall(index + 1)) // Only latest request matters
).subscribe(response => console.log('switchMap:', response));

// Using exhaustMap
clicks$.pipe(
  exhaustMap((_, index) => fakeApiCall(index + 1)) // Ignores new clicks until current request completes
).subscribe(response => console.log('exhaustMap:', response));
```

---

### **Behavior of Each Operator**

#### **1. `mergeMap`**
- Subscribes to **all emitted inner observables**.
- Results arrive **as soon as they are ready**, without canceling or queuing.

**Output Example (Click 3 times quickly):**
```
mergeMap: Response from API: 1
mergeMap: Response from API: 2
mergeMap: Response from API: 3
```

**Use Case:** When you want to process all streams concurrently.

---

#### **2. `concatMap`**
- Queues each inner observable and processes them **one at a time**.
- Waits for the previous observable to complete before starting the next.

**Output Example (Click 3 times quickly):**
```
concatMap: Response from API: 1
concatMap: Response from API: 2
concatMap: Response from API: 3
```

**Use Case:** When order matters, and you need to ensure sequential processing.

---

#### **3. `switchMap`**
- Cancels the **previous observable** as soon as a new value is emitted by the source.
- Only the **latest observable** is processed.

**Output Example (Click 3 times quickly):**
```
switchMap: Response from API: 3
```

**Use Case:** When you only care about the **latest request** or result, such as a type-ahead search.

---

#### **4. `exhaustMap`**
- Ignores new emissions from the source until the **current inner observable** completes.
- Ensures no overlapping or queuing of observables.

**Output Example (Click 3 times quickly):**
```
exhaustMap: Response from API: 1
```

**Use Case:** When you want to **prevent flooding** due to rapid user actions, such as form submissions or file uploads.

---

### **Testing the Behavior**

1. Open the browser console.
2. Click the button multiple times rapidly.
3. Observe how the different operators handle the streams.

---

### **Key Takeaways**
| **Operator**    | **Behavior**                                                                                   | **Use Case**                                                                 |
|------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **mergeMap**     | Processes all emissions concurrently.                                                         | Use when all results are needed, and order doesn't matter.                  |
| **concatMap**    | Processes emissions sequentially, maintaining order.                                          | Use when results need to be processed in order.                             |
| **switchMap**    | Cancels previous emissions and switches to the latest observable.                             | Use when only the latest result is relevant (e.g., autocomplete).           |
| **exhaustMap**   | Ignores new emissions until the current observable completes.                                 | Use to prevent overlapping requests (e.g., form submissions).               |

Let me know if you need a deeper dive into any specific operator!