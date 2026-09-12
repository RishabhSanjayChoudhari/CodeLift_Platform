// CodeLift Platform - Comprehensive Exhaustive Curriculum & Assessment Data
// Auto-generated pure client-side data store with full Markdown lessons

export const EXTENDED_COURSES = [
  {
    "id": "course-python",
    "title": "Python Full Stack Development",
    "description": "Master Python from memory mechanics to full-stack engineering with Flask, Eel desktop apps, and SQL Server.",
    "batchId": "batch-fswd-morning",
    "modules": [
      {
        "id": "py-mod-1",
        "title": "1. Python Fundamentals (Deep Dive)",
        "testId": "test-python-fundamentals",
        "topics": [
          {
            "id": "py-1-1",
            "title": "1.1 Python Setup & First Program",
            "contentMd": "# 1.1 Python Setup & First Program\n\nWelcome to the foundational architecture of Python engineering.\n\n## 1. Environment Installation\nPython is a cross-platform, interpreted, bytecode-compiled language.\n\n### Windows Installation\n1. Download Python 3.12+ from `https://www.python.org/downloads/`.\n2. Crucial: Check the box **\"Add Python to PATH\"** to register binaries in environment variables.\n3. Verify in PowerShell:\n```powershell\npython --version\npip --version\n```\n\n### Virtual Environments (`venv`)\nA virtual environment isolates third-party packages per project:\n```bash\npython -m venv .venv\n# On Windows PowerShell:\n.venv\\Scripts\\Activate.ps1\n# On macOS / Linux:\nsource .venv/bin/activate\n```\n\n## 2. Execution Flow & `if __name__ == '__main__':`\nWhen Python runs a file directly, it sets the built-in variable `__name__` to `'__main__'`. If the file is imported as a module into another script, `__name__` is set to the module's filename.\n\n```python\n# main.py\ndef run_cli():\n    name = input(\"Enter student name: \")\n    print(f\"Welcome to CodeLift Engineering, {name}!\")\n\nif __name__ == '__main__':\n    # This block executes ONLY when run directly, NOT when imported\n    print(\"Application bootstrapping...\")\n    run_cli()\n```\n\n## 3. Assignment\nWrite a Python script `greeter.py` that prompts for user name, birth year, and computes their exact age in years while validating positive integers.\n\n## 4. Mini-Quiz\n1. What is the value of `__name__` when a script is run directly?\n   - A) `\"module\"` | B) `\"__main__\"` | C) `\"root\"` | D) `None` (Answer: B)\n2. Which flag ensures Python is accessible globally on Windows?\n   - A) `--global` | B) `Add Python to PATH` | C) `--set-env` (Answer: B)\n\n## 5. Interview Questions\n- **Q1: Explain the purpose of `if __name__ == '__main__':`.**\n  *Answer:* It creates an entry guard preventing top-level execution code from running when the script is imported as a library by another module.\n- **Q2: Why should production applications always run inside a virtual environment?**\n  *Answer:* To avoid dependency collisions between disparate packages across projects and ensure reproducible deployment via `requirements.txt`."
          },
          {
            "id": "py-1-2",
            "title": "1.2 Variables & Memory Management (Primitives, Decimals, Mutability)",
            "contentMd": "# 1.2 Variables & Memory Management\n\nA deep dive into how Python manages memory, object identity, data types, and numerical precision.\n\n## 1. Dynamic Typing & Object Allocation\nIn Python, variables are **pointers/references to objects in memory**, not reserved memory slots holding raw data.\n- The `id()` function returns the identity (memory address in CPython) of an object.\n- Garbage collection relies on **Reference Counting** supplemented by a cyclic garbage collector.\n\n```python\na = [1, 2, 3]\nb = a\nprint(id(a) == id(b))  # True: Both reference the exact same memory allocation\nb.append(4)\nprint(a)               # [1, 2, 3, 4] mutated in place\n```\n\n## 2. Primitive vs Non-Primitive Types\n\n| Category | Types | Characteristics |\n|---|---|---|\n| **Primitive (Scalar)** | `int`, `float`, `bool`, `str`, `NoneType` | Represent single atomic values. Immutable. |\n| **Non-Primitive (Composite)** | `list`, `tuple`, `dict`, `set`, `frozenset` | Data structures holding references to other objects. |\n\n## 3. Mutability vs Immutability\n- **Immutable**: Once instantiated, their internal state cannot be modified. Modification produces a brand new object in memory (`int`, `float`, `str`, `tuple`, `frozenset`).\n- **Mutable**: Values can be added, updated, or deleted in place without altering object identity (`list`, `dict`, `set`).\n\n```python\ns = \"CodeLift\"\n# s[0] = \"c\"  --> TypeError: 'str' object does not support item assignment\ns = s + \" Academy\"  # Allocates a new string at a new memory address!\n```\n\n## 4. Decimal Precision & IEEE 754 Floating-Point Issues\nPython `float` follows the IEEE 754 64-bit double-precision standard. Because binary fractions cannot represent numbers like 0.1 exactly:\n\n```python\nprint(0.1 + 0.2)  # Output: 0.30000000000000004\nprint(0.1 + 0.2 == 0.3)  # False!\n```\n\n### Financial Calculations with `decimal.Decimal`\nFor monetary transactions, banking, and fee reconciliation:\n\n```python\nfrom decimal import Decimal\n\nval1 = Decimal('0.1')\nval2 = Decimal('0.2')\ntotal = val1 + val2\nprint(total)             # Decimal('0.3')\nprint(total == Decimal('0.3'))  # True!\n```\n\n## 5. Type Coercion: Implicit vs Explicit\n- **Implicit**: Python automatically converts types when safe (e.g., `5 + 2.5` yields `float` `7.5`).\n- **Explicit Casting**: Manual conversion using constructors: `int(\"42\")`, `str(100)`, `float(\"3.14\")`.\n\n## 6. Mini-Quiz\n1. Why does `0.1 + 0.2 == 0.3` return `False` in standard Python?\n   - A) Bug in Python | B) IEEE 754 binary floating-point representation limits | C) Integer overflow (Answer: B)\n2. Which data type is immutable?\n   - A) `dict` | B) `list` | C) `tuple` | D) `set` (Answer: C)\n\n## 7. Interview Questions\n- **Q1: Explain reference counting and when cyclic garbage collection is triggered.**\n  *Answer:* CPython tracks reference counts. When count reaches 0, memory is immediately reclaimed. Cyclic garbage collector detects isolated reference loops like `a.next = b; b.prev = a`.\n- **Q2: When must you use `decimal.Decimal` over `float`?**\n  *Answer:* In financial and high-precision accounting where cumulative floating-point rounding errors cannot be tolerated."
          },
          {
            "id": "py-1-3",
            "title": "1.3 Strings & String Methods",
            "contentMd": "# 1.3 Strings & String Methods\n\nStrings in Python are immutable sequences of Unicode characters.\n\n## 1. Slicing & Indexing\n```python\ntext = \"CodeLift\"\nprint(text[0])       # 'C'\nprint(text[-1])      # 't'\nprint(text[0:4])     # 'Code'\nprint(text[::-1])    # 'tfiLedoC' (Reversal idiom)\n```\n\n## 2. Core String Transformation Methods\n```python\nraw = \"  rahul.sharma@codelift.in  \"\nclean = raw.strip().lower()\ndomain = clean.split(\"@\")[1]\nprint(domain)  # \"codelift.in\"\n\nwords = [\"Python\", \"Flask\", \"Bootstrap\"]\njoined = \" -> \".join(words)\nprint(joined)  # \"Python -> Flask -> Bootstrap\"\n```\n\n## 3. Formatting & f-Strings\n```python\nstudent = \"Priya\"\nscore = 98.456\nprint(f\"Candidate {student} achieved {score:.2f}%\")\n```\n\n## 4. Assignment\nBuild a password strength evaluator function `validate_password(pwd)` returning `True` if it contains at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.\n\n## 5. Interview Questions\n- **Q1: Are Python strings mutable? Prove it with code.**\n  *Answer:* No. `s = 'hello'; s[0] = 'H'` throws a `TypeError`."
          },
          {
            "id": "py-1-4",
            "title": "1.4 Lists & List Comprehensions",
            "contentMd": "# 1.4 Lists & List Comprehensions\n\nLists are mutable, dynamic ordered arrays of heterogeneous objects.\n\n## 1. List Operations\n```python\nitems = [10, 20, 30]\nitems.append(40)       # O(1) amortized\nitems.insert(0, 5)     # O(n)\nitems.extend([50, 60]) # Extend iterable\nlast = items.pop()     # O(1) returns 60\nitems.remove(20)       # Removes first occurrence\nitems.sort(reverse=True)\n```\n\n## 2. List Comprehensions\nComprehensions provide concise, fast C-level execution for sequence transformation:\n```python\n# Square of evens\nsquares = [x**2 for x in range(20) if x % 2 == 0]\n\n# Flattening nested list\nnested = [[1, 2], [3, 4], [5, 6]]\nflat = [num for sublist in nested for num in sublist]\nprint(flat)  # [1, 2, 3, 4, 5, 6]\n```\n\n## 3. Assignment\nWrite a function `flatten_deep(arr)` that flattens an arbitrarily nested list without using external libraries."
          },
          {
            "id": "py-1-5",
            "title": "1.5 Tuples & Named Tuples",
            "contentMd": "# 1.5 Tuples & Named Tuples\n\nTuples are fixed-length, immutable sequences providing lightweight data encapsulation.\n\n## 1. Packing & Unpacking\n```python\npoint = (10, 20, 30)\nx, y, z = point\n\n# Extended unpacking\nfirst, *middle, last = [1, 2, 3, 4, 5]\nprint(middle)  # [2, 3, 4]\n```\n\n## 2. Named Tuples (`collections.namedtuple`)\n```python\nfrom collections import namedtuple\n\nStudent = namedtuple('Student', ['id', 'name', 'batch'])\ns1 = Student(101, 'Amit Verma', 'Full Stack')\nprint(s1.name)  # Access via attribute!\n```\n\n## 3. Interview Question: Why use a tuple over a list?\n*Answer:* Tuples are memory-efficient, faster to allocate, hashable (can be used as dictionary keys), and guarantee write-protection."
          },
          {
            "id": "py-1-6",
            "title": "1.6 Dictionaries & Advanced Dict Tools",
            "contentMd": "# 1.6 Dictionaries & Advanced Dict Tools\n\nDictionaries are hash tables mapping unique hashable keys to arbitrary values.\n\n## 1. Methods & Safe Access\n```python\nstudent = {\"name\": \"Rahul\", \"score\": 90}\nprint(student.get(\"email\", \"Not Provided\"))  # Safe lookup\n\n# Dict comprehension\ntax_rates = {\"INR\": 18, \"USD\": 7, \"EUR\": 20}\ndiscounted = {k: v * 0.9 for k, v in tax_rates.items() if v > 10}\n```\n\n## 2. `defaultdict` and `Counter`\n```python\nfrom collections import defaultdict, Counter\n\nwords = \"apple banana apple orange banana apple\".split()\ncounts = Counter(words)\nprint(counts.most_common(1))  # [('apple', 3)]\n```"
          },
          {
            "id": "py-1-7",
            "title": "1.7 Sets & Frozensets",
            "contentMd": "# 1.7 Sets & Frozensets\n\nSets are unordered collections of unique, hashable items backed by hash tables.\n\n```python\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\nprint(a | b)  # Union: {1, 2, 3, 4, 5, 6}\nprint(a & b)  # Intersection: {3, 4}\nprint(a - b)  # Difference: {1, 2}\nprint(a ^ b)  # Symmetric difference: {1, 2, 5, 6}\n\n# Frozenset is an immutable set that can be used as a dict key\nfrozen = frozenset([1, 2, 3])\n```"
          },
          {
            "id": "py-1-8",
            "title": "1.8 Operators (Arithmetic, Logical, Identity vs Equality)",
            "contentMd": "# 1.8 Operators\n\n## 1. Identity (`is`) vs Equality (`==`)\n- `==` checks whether the **values** of two objects are equal.\n- `is` checks whether two references point to the **exact same memory address** (`id(a) == id(b)`).\n\n```python\nx = [1, 2, 3]\ny = [1, 2, 3]\nprint(x == y)  # True (same values)\nprint(x is y)  # False (distinct memory objects)\n```"
          },
          {
            "id": "py-1-9",
            "title": "1.9 Conditional Statements & Truthiness",
            "contentMd": "# 1.9 Conditional Statements & Truthiness\n\nFalsy values in Python: `0`, `0.0`, `None`, `False`, `\"\"`, `[]`, `{}`, `set()`, `range(0)`.\n\n```python\ndef process_batch(cohort):\n    if not cohort:\n        return \"No students registered\"\n    return f\"Processing {len(cohort)} candidates\"\n```"
          },
          {
            "id": "py-1-10",
            "title": "1.10 Loops & Loop Controls",
            "contentMd": "# 1.10 Loops & Loop Controls\n\nIterating with `enumerate` and `zip`:\n\n```python\nnames = [\"Amit\", \"Sneha\", \"Karan\"]\nscores = [85, 92, 78]\n\nfor idx, (name, score) in enumerate(zip(names, scores), start=1):\n    print(f\"Rank {idx}: {name} -> {score}\")\n```\n\nThe `for...else` construct: The `else` clause executes only if the loop finishes **without** encountering a `break`."
          },
          {
            "id": "py-1-11",
            "title": "1.11 Functions, Scope (LEGB), and Parameters",
            "contentMd": "# 1.11 Functions, Scope (LEGB), and Parameters\n\n## 1. Parameter Types\n```python\ndef configure_cohort(batch_name, *instructors, max_seats=30, **metadata):\n    print(f\"Batch: {batch_name}, Instructors: {instructors}\")\n    print(f\"Seats: {max_seats}, Meta: {metadata}\")\n\nconfigure_cohort(\"FSWD-Morning\", \"Nair\", \"Verma\", room=104, hybrid=True)\n```\n\n## 2. LEGB Scope Resolution\nPython resolves variable names in this order:\n1. **L**ocal (inside function)\n2. **E**nclosing (outer function in closure)\n3. **G**lobal (module level)\n4. **B**uilt-in (`len`, `range`, `id`, `print`)"
          },
          {
            "id": "py-1-12",
            "title": "1.12 Lambda Functions & Functional Tools",
            "contentMd": "# 1.12 Lambda Functions & Functional Tools\n\nLambdas are anonymous single-expression functions:\n```python\nfrom functools import reduce\n\nnums = [1, 2, 3, 4, 5]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nsquared = list(map(lambda x: x**2, evens))\nsum_total = reduce(lambda acc, x: acc + x, nums, 0)\nprint(sum_total)  # 15\n```"
          },
          {
            "id": "py-1-13",
            "title": "1.13 Modules & Standard Library Packages",
            "contentMd": "# 1.13 Modules & Standard Library Packages\n\nCore standard library modules:\n- `os`, `sys`: System runtime and filesystem inspection\n- `datetime`: Dates, timezones, time arithmetic\n- `math`, `random`: Numerical operations and pseudo-random generators\n- `json`: Serialization and parsing\n\n```python\nimport json\npayload = {\"batch\": \"Data Analytics\", \"seats\": 35}\njson_str = json.dumps(payload, indent=2)\n```"
          },
          {
            "id": "py-1-14",
            "title": "1.14 File Handling & Context Managers",
            "contentMd": "# 1.14 File Handling & Context Managers\n\nUsing the `with` statement ensures file descriptors are automatically closed even if errors arise:\n\n```python\nwith open(\"students.csv\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"id,name,grade\\n\")\n    f.write(\"1,Rahul,A\\n\")\n    f.write(\"2,Priya,A+\\n\")\n\nwith open(\"students.csv\", \"r\", encoding=\"utf-8\") as f:\n    for line in f:\n        print(line.strip().split(\",\"))\n```"
          },
          {
            "id": "py-1-15",
            "title": "1.15 Exception Handling & Custom Exceptions",
            "contentMd": "# 1.15 Exception Handling & Custom Exceptions\n\n```python\nclass InsufficientBalanceError(Exception):\n    \"\"\"Raised when fee deduction exceeds current balance.\"\"\"\n    pass\n\ndef deduct_tuition(balance, installment):\n    if installment > balance:\n        raise InsufficientBalanceError(f\"Installment ₹{installment} exceeds balance ₹{balance}\")\n    return balance - installment\n\ntry:\n    deduct_tuition(10000, 15000)\nexcept InsufficientBalanceError as err:\n    print(f\"Caught business error: {err}\")\nfinally:\n    print(\"Ledger transaction finalized.\")\n```"
          }
        ]
      },
      {
        "id": "py-mod-2",
        "title": "2. Object-Oriented Programming (OOP)",
        "testId": "test-python-oop",
        "topics": [
          {
            "id": "py-2-1",
            "title": "2.1 Classes & Objects",
            "contentMd": "# 2.1 Classes & Objects\n\nClasses encapsulate state (attributes) and behavior (methods).\n\n```python\nclass Student:\n    academy = \"CodeLift\"  # Class attribute shared by all instances\n\n    def __init__(self, name: str, batch: str):\n        self.name = name   # Instance attribute\n        self.batch = batch\n        self.attendance = 0\n\n    def mark_present(self):\n        self.attendance += 1\n```"
          },
          {
            "id": "py-2-2",
            "title": "2.2 Instance, Class, and Static Methods",
            "contentMd": "# 2.2 Instance, Class, and Static Methods\n\n```python\nclass Cohort:\n    base_fee = 35000\n\n    def __init__(self, name):\n        self.name = name\n\n    # Instance method receives instance (self)\n    def get_details(self):\n        return f\"{self.name}: ₹{self.base_fee}\"\n\n    # Class method receives class (cls)\n    @classmethod\n    def set_base_fee(cls, new_fee):\n        cls.base_fee = new_fee\n\n    # Static method receives neither; behaves like utility\n    @staticmethod\n    def is_valid_cohort_name(name):\n        return name.startswith(\"BATCH-\")\n```"
          },
          {
            "id": "py-2-3",
            "title": "2.3 Inheritance & Method Resolution Order (MRO)",
            "contentMd": "# 2.3 Inheritance & Method Resolution Order (MRO)\n\nPython uses the C3 Linearization algorithm to determine method resolution in multiple inheritance hierarchies:\n\n```python\nclass Person:\n    def __init__(self, name, email):\n        self.name = name\n        self.email = email\n\nclass Scholar(Person):\n    def __init__(self, name, email, roll_number):\n        super().__init__(name, email)\n        self.roll_number = roll_number\n\nprint(Scholar.__mro__)\n```"
          },
          {
            "id": "py-2-4",
            "title": "2.4 Polymorphism & Method Overriding",
            "contentMd": "# 2.4 Polymorphism & Method Overriding\n\nPolymorphism allows disparate classes to share a uniform interface:\n\n```python\nclass PaymentGateway:\n    def process_payment(self, amount):\n        raise NotImplementedError\n\nclass UPIPayment(PaymentGateway):\n    def process_payment(self, amount):\n        return f\"Processed ₹{amount} via UPI handle\"\n\nclass CardPayment(PaymentGateway):\n    def process_payment(self, amount):\n        return f\"Charged ₹{amount} to Debit/Credit Card\"\n```"
          },
          {
            "id": "py-2-5",
            "title": "2.5 Encapsulation & Private Name Mangling",
            "contentMd": "# 2.5 Encapsulation & Private Name Mangling\n\nPython indicates privacy conventions using underscores:\n- `_protected`: By convention, internal use only.\n- `__private`: Name mangling transforms `__balance` to `_ClassName__balance` preventing accidental overrides.\n\n```python\nclass BankAccount:\n    def __init__(self, initial_deposit):\n        self.__balance = initial_deposit\n\n    def get_balance(self):\n        return self.__balance\n```"
          },
          {
            "id": "py-2-6",
            "title": "2.6 Magic & Dunder Methods",
            "contentMd": "# 2.6 Magic & Dunder Methods\n\nSpecial double-underscore methods enable operator overloading and custom protocol behaviors:\n\n```python\nclass FeeReceipt:\n    def __init__(self, student, amount):\n        self.student = student\n        self.amount = amount\n\n    def __str__(self):\n        return f\"Receipt({self.student}: ₹{self.amount})\"\n\n    def __repr__(self):\n        return f\"FeeReceipt(student='{self.student}', amount={self.amount})\"\n\n    def __add__(self, other):\n        return self.amount + other.amount\n```"
          },
          {
            "id": "py-2-7",
            "title": "2.7 Property Decorators (@property, @setter)",
            "contentMd": "# 2.7 Property Decorators (@property, @setter)\n\nProperties provide getter and setter interfaces with encapsulated validation:\n\n```python\nclass CourseEnrollment:\n    def __init__(self, student, discount_pct=0):\n        self.student = student\n        self._discount = discount_pct\n\n    @property\n    def discount(self):\n        return self._discount\n\n    @discount.setter\n    def discount(self, val):\n        if not (0 <= val <= 50):\n            raise ValueError(\"Discount cannot exceed 50%\")\n        self._discount = val\n```"
          },
          {
            "id": "py-2-8",
            "title": "2.8 Abstract Base Classes (ABCs)",
            "contentMd": "# 2.8 Abstract Base Classes (ABCs)\n\nUsing `abc.ABC` and `@abstractmethod` enforces architectural interface contracts:\n\n```python\nfrom abc import ABC, abstractmethod\n\nclass BaseRepository(ABC):\n    @abstractmethod\n    def save(self, entity):\n        pass\n\n    @abstractmethod\n    def find_by_id(self, entity_id):\n        pass\n```"
          }
        ]
      },
      {
        "id": "py-mod-3",
        "title": "3. Advanced Python",
        "testId": "test-python-advanced",
        "topics": [
          {
            "id": "py-3-1",
            "title": "3.1 Decorators & functools.wraps",
            "contentMd": "# 3.1 Decorators & functools.wraps\n\nDecorators wrap function execution to inject cross-cutting concerns (logging, timing, auth):\n\n```python\nimport time\nfrom functools import wraps\n\ndef audit_timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        duration = time.perf_counter() - start\n        print(f\"Executed {func.__name__} in {duration:.4f}s\")\n        return result\n    return wrapper\n\n@audit_timer\ndef generate_reports():\n    time.sleep(0.1)\n    return \"Done\"\n```"
          },
          {
            "id": "py-3-2",
            "title": "3.2 Generators & yield",
            "contentMd": "# 3.2 Generators & yield\n\nGenerators yield values lazily, executing with $O(1)$ memory consumption:\n\n```python\ndef student_id_stream(prefix=\"STD\", limit=1000):\n    for i in range(1, limit + 1):\n        yield f\"{prefix}-{i:04d}\"\n\nstream = student_id_stream()\nprint(next(stream))  # STD-0001\nprint(next(stream))  # STD-0002\n```"
          },
          {
            "id": "py-3-3",
            "title": "3.3 Custom Context Managers",
            "contentMd": "# 3.3 Custom Context Managers\n\nImplementing `__enter__` and `__exit__` for resource lifecycle management:\n\n```python\nclass DatabaseConnection:\n    def __enter__(self):\n        print(\"Opening connection pool...\")\n        return {\"connection\": \"active\"}\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print(\"Closing connection pool...\")\n        return False  # Propagate exceptions if any\n```"
          },
          {
            "id": "py-3-4",
            "title": "3.4 Iterators & Iterable Protocols",
            "contentMd": "# 3.4 Iterators & Iterable Protocols\n\nObjects implementing `__iter__()` and `__next__()` are iterators:\n\n```python\nclass BatchRoster:\n    def __init__(self, students):\n        self.students = students\n        self._idx = 0\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self._idx >= len(self.students):\n            raise StopIteration\n        val = self.students[self._idx]\n        self._idx += 1\n        return val\n```"
          },
          {
            "id": "py-3-5",
            "title": "3.5 Closures & Scope Retention",
            "contentMd": "# 3.5 Closures & Scope Retention\n\nA closure is a nested function that retains access to variables from its enclosing lexical scope:\n\n```python\ndef fee_calculator(base_discount):\n    def apply(fee):\n        return fee * (1 - base_discount / 100)\n    return apply\n\nscholarship_calc = fee_calculator(25)  # 25% discount\nprint(scholarship_calc(40000))        # ₹30,000\n```"
          },
          {
            "id": "py-3-6",
            "title": "3.6 Regular Expressions (re module)",
            "contentMd": "# 3.6 Regular Expressions (re module)\n\nPattern matching, group capturing, and input validation:\n\n```python\nimport re\n\nemail_pattern = r\"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$\"\n\ndef is_valid_email(email):\n    return bool(re.match(email_pattern, email))\n\nprint(is_valid_email(\"student@codelift.in\"))  # True\n```"
          },
          {
            "id": "py-3-7",
            "title": "3.7 Datetime Arithmetic & Formatting",
            "contentMd": "# 3.7 Datetime Arithmetic & Formatting\n\n```python\nfrom datetime import datetime, timedelta\n\nnow = datetime.now()\ndue_date = now + timedelta(days=14)\nprint(due_date.strftime(\"%d-%b-%Y %I:%M %p\"))\n```"
          },
          {
            "id": "py-3-8",
            "title": "3.8 Logging Framework",
            "contentMd": "# 3.8 Logging Framework\n\nStandard library `logging` for structured diagnostic records:\n\n```python\nimport logging\n\nlogging.basicConfig(level=logging.INFO, format=\"%(asctime)s [%(levelname)s] %(message)s\")\nlogging.info(\"Payment ledger synchronized.\")\n```"
          },
          {
            "id": "py-3-9",
            "title": "3.9 Unit Testing (unittest)",
            "contentMd": "# 3.9 Unit Testing (unittest)\n\n```python\nimport unittest\n\ndef calculate_net_fee(tuition, scholarship):\n    return max(0, tuition - scholarship)\n\nclass TestFeeCalculation(unittest.TestCase):\n    def test_standard_discount(self):\n        self.assertEqual(calculate_net_fee(30000, 5000), 25000)\n\n    def test_full_scholarship(self):\n        self.assertEqual(calculate_net_fee(30000, 35000), 0)\n\nif __name__ == '__main__':\n    unittest.main()\n```"
          }
        ]
      },
      {
        "id": "py-mod-4",
        "title": "4. Flask Web Framework",
        "testId": "test-flask",
        "topics": [
          {
            "id": "py-4-1",
            "title": "4.1 Flask Setup & Application Factory",
            "contentMd": "# 4.1 Flask Setup & Application Factory\n\nFlask is a lightweight WSGI microframework for Python web services.\n\n```python\nfrom flask import Flask\n\ndef create_app():\n    app = Flask(__name__)\n    app.config[\"SECRET_KEY\"] = \"codelift-secret-key\"\n\n    @app.route(\"/api/health\")\n    def health():\n        return {\"status\": \"ok\", \"app\": \"CodeLift LMS\"}\n\n    return app\n```"
          },
          {
            "id": "py-4-2",
            "title": "4.2 Routing, HTTP Methods, and Variable Rules",
            "contentMd": "# 4.2 Routing, HTTP Methods, and Variable Rules\n\n```python\nfrom flask import request, jsonify\n\n@app.route(\"/api/students/<int:student_id>\", methods=[\"GET\", \"PUT\"])\ndef manage_student(student_id):\n    if request.method == \"GET\":\n        return jsonify({\"id\": student_id, \"name\": \"Rahul\"})\n    elif request.method == \"PUT\":\n        data = request.get_json()\n        return jsonify({\"updated\": data, \"id\": student_id})\n```"
          },
          {
            "id": "py-4-3",
            "title": "4.3 Request & Response Handling",
            "contentMd": "# 4.3 Request & Response Handling\n\nHandling query strings, request bodies, and headers:\n\n```python\n@app.route(\"/api/fees\")\ndef get_fees():\n    status = request.args.get(\"status\", \"PAID\")\n    return jsonify({\"filter\": status, \"results\": []})\n```"
          },
          {
            "id": "py-4-4",
            "title": "4.4 Jinja2 Templating & Inheritance",
            "contentMd": "# 4.4 Jinja2 Templating & Inheritance\n\n```html\n<!-- templates/base.html -->\n<!DOCTYPE html>\n<html>\n<head><title>{% block title %}CodeLift{% endblock %}</title></head>\n<body>\n  <nav>CodeLift Header</nav>\n  <main>{% block content %}{% endblock %}</main>\n</body>\n</html>\n```"
          },
          {
            "id": "py-4-5",
            "title": "4.5 Static Files & Assets",
            "contentMd": "# 4.5 Static Files & Assets\n\nServing assets using Flask `url_for`:\n```html\n<link rel=\"stylesheet\" href=\"{{ url_for('static', filename='css/style.css') }}\">\n```"
          },
          {
            "id": "py-4-6",
            "title": "4.6 Forms & WTForms Validation",
            "contentMd": "# 4.6 Forms & WTForms Validation\n\n```python\nfrom flask_wtf import FlaskForm\nfrom wtforms import StringField, IntegerField, SubmitField\nfrom wtforms.validators import DataRequired, Email\n\nclass StudentForm(FlaskForm):\n    name = StringField(\"Full Name\", validators=[DataRequired()])\n    email = StringField(\"Email\", validators=[DataRequired(), Email()])\n    submit = SubmitField(\"Register\")\n```"
          },
          {
            "id": "py-4-7",
            "title": "4.7 Flask-SQLAlchemy ORM Integration",
            "contentMd": "# 4.7 Flask-SQLAlchemy ORM Integration\n\n```python\nfrom flask_sqlalchemy import SQLAlchemy\n\ndb = SQLAlchemy()\n\nclass Batch(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    students = db.relationship(\"Student\", backref=\"batch\", lazy=True)\n\nclass Student(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    batch_id = db.Column(db.Integer, db.ForeignKey(\"batch.id\"))\n```"
          },
          {
            "id": "py-4-8",
            "title": "4.8 Database Migrations (Flask-Migrate)",
            "contentMd": "# 4.8 Database Migrations (Flask-Migrate)\n\nCommands using Alembic:\n```bash\nflask db init\nflask db migrate -m \"Add student table\"\nflask db upgrade\n```"
          },
          {
            "id": "py-4-9",
            "title": "4.9 Authentication & Password Hashing",
            "contentMd": "# 4.9 Authentication & Password Hashing\n\n```python\nfrom werkzeug.security import generate_password_hash, check_password_hash\n\nhashed = generate_password_hash(\"securepass123\")\nprint(check_password_hash(hashed, \"securepass123\"))  # True\n```"
          },
          {
            "id": "py-4-10",
            "title": "4.10 Flash Messages",
            "contentMd": "# 4.10 Flash Messages\n\n```python\nfrom flask import flash, redirect, url_for\n\n@app.route(\"/enroll\")\ndef enroll():\n    flash(\"Enrolled successfully!\", \"success\")\n    return redirect(url_for(\"dashboard\"))\n```"
          },
          {
            "id": "py-4-11",
            "title": "4.11 REST API Development",
            "contentMd": "# 4.11 REST API Development\n\nBuilding RESTful JSON endpoints returning status codes:\n```python\n@app.route(\"/api/batches\", methods=[\"POST\"])\ndef create_batch():\n    data = request.get_json()\n    return jsonify({\"created\": data}), 201\n```"
          },
          {
            "id": "py-4-12",
            "title": "4.12 Blueprints for Modular Architecture",
            "contentMd": "# 4.12 Blueprints for Modular Architecture\n\n```python\nfrom flask import Blueprint\n\nadmin_bp = Blueprint(\"admin\", __name__, url_prefix=\"/admin\")\n\n@admin_bp.route(\"/dashboard\")\ndef dashboard():\n    return \"Admin Dashboard\"\n```"
          },
          {
            "id": "py-4-13",
            "title": "4.13 Error Handling & HTTP Status Codes",
            "contentMd": "# 4.13 Error Handling & HTTP Status Codes\n\n```python\n@app.errorhandler(404)\ndef not_found(error):\n    return jsonify({\"error\": \"Resource not found\"}), 404\n```"
          },
          {
            "id": "py-4-14",
            "title": "4.14 Production Deployment (Gunicorn & Nginx)",
            "contentMd": "# 4.14 Production Deployment (Gunicorn & Nginx)\n\nRunning Flask behind Gunicorn WSGI:\n```bash\ngunicorn --workers 4 --bind 0.0.0.0:5000 \"app:create_app()\"\n```"
          }
        ]
      },
      {
        "id": "py-mod-5",
        "title": "5. Eel Desktop Application Framework",
        "testId": "test-eel",
        "topics": [
          {
            "id": "py-5-1",
            "title": "5.1 Introduction to Eel Architecture",
            "contentMd": "# 5.1 Introduction to Eel Architecture\n\nEel lets developers build desktop applications with Python backends and HTML/JS frontends via WebSockets and Chrome/Edge Chromium engines."
          },
          {
            "id": "py-5-2",
            "title": "5.2 Project Structure for Eel Applications",
            "contentMd": "# 5.2 Project Structure for Eel Applications\n\n```text\nmy_desktop_app/\n├── web/\n│   ├── index.html\n│   ├── app.js\n│   └── style.css\n└── main.py\n```"
          },
          {
            "id": "py-5-3",
            "title": "5.3 Exposing Python Functions to JavaScript",
            "contentMd": "# 5.3 Exposing Python Functions to JavaScript\n\n```python\nimport eel\n\neel.init('web')\n\n@eel.expose\ndef fetch_student_count():\n    return 145\n\neel.start('index.html', size=(1000, 700))\n```"
          },
          {
            "id": "py-5-4",
            "title": "5.4 Calling JavaScript from Python",
            "contentMd": "# 5.4 Calling JavaScript from Python\n\n```python\n# In Python:\neel.show_notification(\"Payment confirmed!\")\n```"
          },
          {
            "id": "py-5-5",
            "title": "5.5 Building a CRUD Desktop App with SQLite",
            "contentMd": "# 5.5 Building a CRUD Desktop App with SQLite\n\nIntegrating Python's standard `sqlite3` module with an Eel interface for offline desktop operation."
          },
          {
            "id": "py-5-6",
            "title": "5.6 Packaging with PyInstaller",
            "contentMd": "# 5.6 Packaging with PyInstaller\n\nCompiling into standalone executable:\n```bash\npyinstaller --noconfirm --onedir --windowed --add-data \"web;web\" main.py\n```"
          }
        ]
      },
      {
        "id": "py-mod-6",
        "title": "6. SQL Server & Databases",
        "testId": "test-sqlserver",
        "topics": [
          {
            "id": "py-6-1",
            "title": "6.1 RDBMS Concepts & Constraints",
            "contentMd": "# 6.1 RDBMS Concepts & Constraints\n\nRelational databases enforce data integrity via Primary Keys, Foreign Keys, `NOT NULL`, `UNIQUE`, `CHECK`, and `DEFAULT` constraints."
          },
          {
            "id": "py-6-2",
            "title": "6.2 Database Normalization (1NF to BCNF)",
            "contentMd": "# 6.2 Database Normalization (1NF to BCNF)\n\n- **1NF**: Atomic values, no repeating groups.\n- **2NF**: In 1NF and no partial dependencies on composite keys.\n- **3NF**: In 2NF and no transitive dependencies."
          },
          {
            "id": "py-6-3",
            "title": "6.3 DDL Commands (CREATE, ALTER, DROP, TRUNCATE)",
            "contentMd": "# 6.3 DDL Commands\n\n```sql\nCREATE TABLE Batches (\n    BatchId INT IDENTITY(1,1) PRIMARY KEY,\n    BatchName NVARCHAR(100) NOT NULL,\n    FeeAmount DECIMAL(10,2) CHECK (FeeAmount >= 0)\n);\n```"
          },
          {
            "id": "py-6-4",
            "title": "6.4 DML Commands (INSERT, UPDATE, DELETE, SELECT)",
            "contentMd": "# 6.4 DML Commands\n\n```sql\nINSERT INTO Batches (BatchName, FeeAmount) VALUES ('FSWD-Morning', 35000.00);\nSELECT * FROM Batches WHERE FeeAmount > 20000;\n```"
          },
          {
            "id": "py-6-5",
            "title": "6.5 SQL Joins (INNER, LEFT, RIGHT, FULL, CROSS)",
            "contentMd": "# 6.5 SQL Joins\n\n```sql\nSELECT s.Name, b.BatchName\nFROM Students s\nINNER JOIN Batches b ON s.BatchId = b.BatchId;\n```"
          },
          {
            "id": "py-6-6",
            "title": "6.6 Subqueries & Correlated Queries",
            "contentMd": "# 6.6 Subqueries & Correlated Queries\n\n```sql\nSELECT Name, FeePaid FROM Students\nWHERE FeePaid > (SELECT AVG(FeePaid) FROM Students);\n```"
          },
          {
            "id": "py-6-7",
            "title": "6.7 SQL Views",
            "contentMd": "# 6.7 SQL Views\n\n```sql\nCREATE VIEW ActiveBatchesView AS\nSELECT BatchId, BatchName FROM Batches WHERE IsActive = 1;\n```"
          },
          {
            "id": "py-6-8",
            "title": "6.8 Stored Procedures",
            "contentMd": "# 6.8 Stored Procedures\n\n```sql\nCREATE PROCEDURE RecordFeePayment\n    @StudentId INT,\n    @Amount DECIMAL(10,2)\nAS\nBEGIN\n    INSERT INTO Fees (StudentId, Amount, PaidAt)\n    VALUES (@StudentId, @Amount, GETDATE());\nEND;\n```"
          },
          {
            "id": "py-6-9",
            "title": "6.9 Scalar & Table-Valued Functions",
            "contentMd": "# 6.9 Scalar & Table-Valued Functions\n\nUser-defined functions returning either single values or queryable tables."
          },
          {
            "id": "py-6-10",
            "title": "6.10 Triggers (AFTER vs INSTEAD OF)",
            "contentMd": "# 6.10 Triggers (AFTER vs INSTEAD OF)\n\nAutomating audit log creation on table mutations."
          },
          {
            "id": "py-6-11",
            "title": "6.11 Indexes & Query Performance Tuning",
            "contentMd": "# 6.11 Indexes & Query Performance Tuning\n\nClustered indexes define physical sorting order; non-clustered indexes provide B-tree pointers for fast lookups."
          },
          {
            "id": "py-6-12",
            "title": "6.12 Transactions & ACID Properties",
            "contentMd": "# 6.12 Transactions & ACID Properties\n\n- **Atomicity**: All or nothing.\n- **Consistency**: State invariants held.\n- **Isolation**: Concurrent transactions do not collide.\n- **Durability**: Committed data persists across power loss."
          },
          {
            "id": "py-6-13",
            "title": "6.13 Python Database Integration (pyodbc)",
            "contentMd": "# 6.13 Python Database Integration (pyodbc)\n\n```python\nimport pyodbc\n\nconn = pyodbc.connect(\"DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=codelift;Trusted_Connection=yes;\")\ncursor = conn.cursor()\ncursor.execute(\"SELECT * FROM Batches\")\n```"
          }
        ]
      },
      {
        "id": "py-mod-7",
        "title": "7. Full-Stack Integration Project (Inventory System)",
        "testId": "test-fullstack-integration",
        "topics": [
          {
            "id": "py-7-1",
            "title": "7.1 Full-Stack Architectural Design",
            "contentMd": "# 7.1 Full-Stack Architectural Design\n\nDesigning decoupled systems with REST API backends and component-driven SPA frontends."
          },
          {
            "id": "py-7-2",
            "title": "7.2 Building the Flask Inventory REST API",
            "contentMd": "# 7.2 Building the Flask Inventory REST API\n\nCRUD endpoints for stock tracking, categories, supplier records, and sales ledgers."
          },
          {
            "id": "py-7-3",
            "title": "7.3 Frontend Client Integration & State Management",
            "contentMd": "# 7.3 Frontend Client Integration & State Management\n\nConsuming endpoints using modern JavaScript, handling optimistic updates and loading spinners."
          },
          {
            "id": "py-7-4",
            "title": "7.4 Production Deployment & Docker Containerization",
            "contentMd": "# 7.4 Production Deployment & Docker Containerization\n\nPackaging the complete solution with multi-stage Dockerfiles and Nginx reverse proxy configurations."
          }
        ]
      }
    ]
  },
  {
    "id": "course-frontend",
    "title": "Frontend Web Development",
    "description": "Modern frontend engineering with HTML5, advanced responsive CSS3, JavaScript ES6+, and Bootstrap 5.",
    "batchId": "batch-fswd-evening",
    "modules": [
      {
        "id": "fe-mod-1",
        "title": "1. HTML5 Modern Standards",
        "testId": "test-html-css",
        "topics": [
          {
            "id": "fe-1-1",
            "title": "1.1 Structure, DOCTYPE, and Head Metadata",
            "contentMd": "# 1.1 Structure, DOCTYPE, and Head Metadata\n\nModern HTML5 document scaffolding, UTF-8 charset declarations, and responsive viewport meta tags."
          },
          {
            "id": "fe-1-2",
            "title": "1.2 Semantic Layout Elements",
            "contentMd": "# 1.2 Semantic Layout Elements\n\nUsing `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` for accessible, machine-readable documents."
          },
          {
            "id": "fe-1-3",
            "title": "1.3 Typography & Text Formatting",
            "contentMd": "# 1.3 Typography & Text Formatting\n\nHeaders `<h1>`-`<h6>`, paragraphs `<p>`, `<strong>`, `<em>`, `<blockquote>`, and inline `<code>` tags."
          },
          {
            "id": "fe-1-4",
            "title": "1.4 Ordered, Unordered, and Definition Lists",
            "contentMd": "# 1.4 Lists\n\n`<ol>`, `<ul>`, and description lists `<dl>`, `<dt>`, `<dd>`."
          },
          {
            "id": "fe-1-5",
            "title": "1.5 Hyperlinks & Navigation Protocols",
            "contentMd": "# 1.5 Hyperlinks & Navigation Protocols\n\nAnchor tags `<a href>`, relative paths, target `_blank`, `rel=\"noopener noreferrer\"`, `mailto:`, and `tel:` protocols."
          },
          {
            "id": "fe-1-6",
            "title": "1.6 Images & Media Embeds",
            "contentMd": "# 1.6 Images & Media Embeds\n\nResponsive `<img>` with `src`, `srcset`, `sizes`, `alt`, plus native `<video>` and `<audio>` controls."
          },
          {
            "id": "fe-1-7",
            "title": "1.7 Tables & Tabular Data Structures",
            "contentMd": "# 1.7 Tables & Tabular Data Structures\n\n`<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, `colspan`, and `rowspan`."
          },
          {
            "id": "fe-1-8",
            "title": "1.8 Interactive Forms & Control Elements",
            "contentMd": "# 1.8 Interactive Forms & Control Elements\n\n`<form>`, text, email, number, date, password, radio, checkbox, and select dropdowns."
          },
          {
            "id": "fe-1-9",
            "title": "1.9 Native HTML5 Form Validation",
            "contentMd": "# 1.9 Native HTML5 Form Validation\n\nAttributes: `required`, `pattern`, `min`, `max`, `minlength`, `maxlength`."
          },
          {
            "id": "fe-1-10",
            "title": "1.10 Web Accessibility (WCAG & WAI-ARIA)",
            "contentMd": "# 1.10 Web Accessibility (WCAG & WAI-ARIA)\n\nARIA roles, labels, contrast ratios, and screen-reader optimizations."
          },
          {
            "id": "fe-1-11",
            "title": "1.11 SEO & Open Graph Social Metadata",
            "contentMd": "# 1.11 SEO & Open Graph Social Metadata\n\nSearch engine meta descriptions, canonical URLs, and Open Graph `og:title`, `og:image` tags."
          }
        ]
      },
      {
        "id": "fe-mod-2",
        "title": "2. Modern CSS3 & Responsive Architecture",
        "testId": "test-css",
        "topics": [
          {
            "id": "fe-2-1",
            "title": "2.1 CSS Syntax, Selectors, and Specificity",
            "contentMd": "# 2.1 CSS Syntax, Selectors, and Specificity\n\nClass, ID, attribute selectors, pseudo-classes (`:hover`, `:nth-child`), pseudo-elements (`::before`), and specificity hierarchy."
          },
          {
            "id": "fe-2-2",
            "title": "2.2 The Box Model & box-sizing",
            "contentMd": "# 2.2 The Box Model & box-sizing\n\nContent, padding, border, margin, and `box-sizing: border-box` calculations."
          },
          {
            "id": "fe-2-3",
            "title": "2.3 Display Types & Positioning Rules",
            "contentMd": "# 2.3 Display Types & Positioning Rules\n\n`block`, `inline`, `inline-block`, `none`. `static`, `relative`, `absolute`, `fixed`, `sticky`."
          },
          {
            "id": "fe-2-4",
            "title": "2.4 Color Systems, Opacity, and Gradients",
            "contentMd": "# 2.4 Color Systems, Opacity, and Gradients\n\nRGB, RGBA, HSL, Hex, linear/radial gradients, and glassmorphism backdrops."
          },
          {
            "id": "fe-2-5",
            "title": "2.5 Web Typography & Font Pairing",
            "contentMd": "# 2.5 Web Typography & Font Pairing\n\nFont families, `@font-face`, Google Fonts, line-height, letter-spacing, and responsive text sizing with `clamp()`."
          },
          {
            "id": "fe-2-6",
            "title": "2.6 Comprehensive Flexbox Layouts",
            "contentMd": "# 2.6 Comprehensive Flexbox Layouts\n\n`display: flex`, flex directions, `justify-content`, `align-items`, `gap`, `flex-grow`, and responsive ordering."
          },
          {
            "id": "fe-2-7",
            "title": "2.7 CSS Grid 2D Systems",
            "contentMd": "# 2.7 CSS Grid 2D Systems\n\n`display: grid`, `grid-template-columns`, `repeat(auto-fit, minmax())`, `grid-template-areas`."
          },
          {
            "id": "fe-2-8",
            "title": "2.8 Transitions & Keyframe Animations",
            "contentMd": "# 2.8 Transitions & Keyframe Animations\n\nTiming functions, hardware-accelerated transforms, and `@keyframes` animations."
          },
          {
            "id": "fe-2-9",
            "title": "2.9 Responsive Design & Media Queries",
            "contentMd": "# 2.9 Responsive Design & Media Queries\n\nMobile-first breakpoints, fluid typography, and viewport sizing units (`vw`, `vh`, `dvh`)."
          },
          {
            "id": "fe-2-10",
            "title": "2.10 CSS Custom Properties (Variables)",
            "contentMd": "# 2.10 CSS Custom Properties (Variables)\n\nDynamic theming via `:root`, variable fallbacks, and runtime JavaScript modification."
          },
          {
            "id": "fe-2-11",
            "title": "2.11 Preprocessing with Sass / SCSS",
            "contentMd": "# 2.11 Preprocessing with Sass / SCSS\n\nVariables, nested selectors, `@mixin`, `@include`, and modular partial imports."
          }
        ]
      },
      {
        "id": "fe-mod-3",
        "title": "3. JavaScript Core & Modern ES6+ Standards",
        "testId": "test-javascript",
        "topics": [
          {
            "id": "fe-3-1",
            "title": "3.1 Variables, Primitives vs Objects, and Type Coercion",
            "contentMd": "# 3.1 Variables, Primitives vs Objects, and Type Coercion\n\n## 1. Variable Declarations\n- `var`: Function-scoped, hoisted with `undefined`.\n- `let`: Block-scoped, mutable, Temporal Dead Zone (TDZ).\n- `const`: Block-scoped, immutable binding.\n\n## 2. The 7 Primitive Types\nPrimitives are stored directly on the stack by value:\n1. `string`\n2. `number` (64-bit float; includes `NaN`, `Infinity`)\n3. `boolean`\n4. `bigint` (arbitrary-precision integers)\n5. `symbol` (unique immutable token)\n6. `undefined` (unassigned variable)\n7. `null` (intentional absence of object value; `typeof null === 'object'` is a historical legacy)\n\n## 3. Non-Primitive Types (Objects)\nStored on the heap by reference:\n- `Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`.\n\n## 4. Type Coercion & Equality\n- Loose Equality (`==`): Performs type coercion before comparing values (e.g. `'5' == 5` is `True`).\n- Strict Equality (`===`): Compares both value and type without conversion (e.g. `'5' === 5` is `False`)."
          },
          {
            "id": "fe-3-2",
            "title": "3.2 Functions, Arrow Functions, and 'this' Context",
            "contentMd": "# 3.2 Functions & this Context\n\nDeclarations vs expressions, lexical `this` in arrow functions, and `call()`, `apply()`, `bind()`."
          },
          {
            "id": "fe-3-3",
            "title": "3.3 Array Transformations & Higher-Order Methods",
            "contentMd": "# 3.3 Array Methods\n\n`map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`, `splice`, `slice`."
          },
          {
            "id": "fe-3-4",
            "title": "3.4 Objects, Prototypes, and Prototypal Inheritance",
            "contentMd": "# 3.4 Objects & Prototypes\n\nObject literals, property descriptors, `prototype`, `__proto__`, and `Object.create()`."
          },
          {
            "id": "fe-3-5",
            "title": "3.5 DOM Manipulation & Querying",
            "contentMd": "# 3.5 DOM Manipulation\n\n`querySelector`, `querySelectorAll`, creating elements, `classList` toggling, and style updates."
          },
          {
            "id": "fe-3-6",
            "title": "3.6 Events, Listeners, and Event Delegation",
            "contentMd": "# 3.6 Events & Delegation\n\nCapturing vs bubbling phases, `e.target`, `e.preventDefault()`, and memory-efficient list delegation."
          },
          {
            "id": "fe-3-7",
            "title": "3.7 Form Handling & Dynamic Validation",
            "contentMd": "# 3.7 Form Handling\n\nExtracting FormData, preventing reloads, and real-time regex client validation."
          },
          {
            "id": "fe-3-8",
            "title": "3.8 ES6+ Modern Syntax Essentials",
            "contentMd": "# 3.8 ES6+ Modern Syntax\n\nDestructuring, spread/rest operators, template literals, optional chaining (`?.`), and nullish coalescing (`??`)."
          },
          {
            "id": "fe-3-9",
            "title": "3.9 Asynchronous JavaScript (Promises & Async/Await)",
            "contentMd": "# 3.9 Asynchronous JavaScript\n\nEvent loop, microtask queue, Promise lifecycle (`resolve`, `reject`, `.then`), and `async/await` syntax."
          },
          {
            "id": "fe-3-10",
            "title": "3.10 Fetch API & REST Client Operations",
            "contentMd": "# 3.10 Fetch API\n\nHTTP GET, POST, PUT, DELETE requests, request headers, error status checking, and JSON parsing."
          },
          {
            "id": "fe-3-11",
            "title": "3.11 JSON Serialization & Deserialization",
            "contentMd": "# 3.11 JSON Serialization\n\n`JSON.stringify()` with replacer functions, and safe parsing with `JSON.parse()`."
          },
          {
            "id": "fe-3-12",
            "title": "3.12 Error Handling with try/catch/finally",
            "contentMd": "# 3.12 Error Handling\n\nCatching runtime errors, throwing custom Error instances, and `finally` execution guarantees."
          },
          {
            "id": "fe-3-13",
            "title": "3.13 LocalStorage & Client Storage APIs",
            "contentMd": "# 3.13 LocalStorage\n\nKey-value persistence, storage quotas, serializing complex objects, and storage events."
          },
          {
            "id": "fe-3-14",
            "title": "3.14 ES Modules (import & export)",
            "contentMd": "# 3.14 ES Modules\n\nNamed vs default exports, dynamic `import()`, and tree-shaking principles."
          }
        ]
      },
      {
        "id": "fe-mod-4",
        "title": "4. jQuery & Bootstrap 5 Frameworks",
        "testId": "test-jquery-bootstrap",
        "topics": [
          {
            "id": "fe-4-1",
            "title": "4.1 jQuery Fundamentals & DOM Ready",
            "contentMd": "# 4.1 jQuery Fundamentals\n\nThe `$()` wrapper, CDN setup, and `$(document).ready()` lifecycle."
          },
          {
            "id": "fe-4-2",
            "title": "4.2 Selectors & DOM Traversal",
            "contentMd": "# 4.2 Selectors & Traversal\n\nFinding siblings, parents, children, and nearest ancestors (`closest()`)."
          },
          {
            "id": "fe-4-3",
            "title": "4.3 jQuery Event Handling",
            "contentMd": "# 4.3 jQuery Event Handling\n\n`.on('click')`, hover handlers, form submission interception, and custom triggers."
          },
          {
            "id": "fe-4-4",
            "title": "4.4 Animation & UI Effects",
            "contentMd": "# 4.4 Animation & UI Effects\n\n`.fadeIn()`, `.fadeOut()`, `.slideToggle()`, and custom numeric `.animate()`."
          },
          {
            "id": "fe-4-5",
            "title": "4.5 AJAX with jQuery",
            "contentMd": "# 4.5 AJAX with jQuery\n\n`$.ajax()`, `$.getJSON()`, headers, and promise chaining."
          },
          {
            "id": "fe-4-6",
            "title": "4.6 DOM Manipulation with jQuery",
            "contentMd": "# 4.6 DOM Manipulation with jQuery\n\n`.html()`, `.val()`, `.addClass()`, `.append()`, `.empty()`, `.remove()`."
          },
          {
            "id": "fe-4-7",
            "title": "4.7 Bootstrap 5 Responsive Grid System",
            "contentMd": "# 4.7 Bootstrap 5 Grid\n\nContainers, rows, column spanning, breakpoints (`xs` to `xxl`), and auto-layout columns."
          },
          {
            "id": "fe-4-8",
            "title": "4.8 Core Bootstrap Components",
            "contentMd": "# 4.8 Core Bootstrap Components\n\nCards, navbars, modals, alerts, tables, badges, dropdowns, and button groups."
          },
          {
            "id": "fe-4-9",
            "title": "4.9 Bootstrap Utility Classes",
            "contentMd": "# 4.9 Bootstrap Utilities\n\nMargin and padding classes (`m-`, `p-`), flex utilities (`d-flex`), text alignments, and border radiuses."
          },
          {
            "id": "fe-4-10",
            "title": "4.10 Theming & SCSS Customization",
            "contentMd": "# 4.10 Theming & SCSS Customization\n\nOverriding Bootstrap default color maps, border radiuses, and font variables."
          }
        ]
      }
    ]
  },
  {
    "id": "course-analytics",
    "title": "Data Analytics & Business Intelligence",
    "description": "End-to-end data analytics with statistics, Python NumPy/Pandas, analytical SQL, and modern BI dashboarding.",
    "batchId": "batch-da-weekend",
    "modules": [
      {
        "id": "da-mod-1",
        "title": "1. Data Analytics Fundamentals & Statistics",
        "testId": "test-analytics-basics",
        "topics": [
          {
            "id": "da-1-1",
            "title": "1.1 The Data Analytics Lifecycle",
            "contentMd": "# 1.1 The Data Analytics Lifecycle\n\nProblem formulation, data acquisition, cleaning, exploratory analysis, hypothesis validation, and operational reporting."
          },
          {
            "id": "da-1-2",
            "title": "1.2 Categorical vs Numerical Data Classifications",
            "contentMd": "# 1.2 Data Classifications\n\nNominal, ordinal, discrete, continuous, ratio, and interval data structures."
          },
          {
            "id": "da-1-3",
            "title": "1.3 Descriptive Statistics Measures",
            "contentMd": "# 1.3 Descriptive Statistics\n\nMean, median, mode, variance, standard deviation, IQR, skewness, and kurtosis."
          },
          {
            "id": "da-1-4",
            "title": "1.4 Inferential Statistics & Hypothesis Testing",
            "contentMd": "# 1.4 Inferential Statistics\n\nCentral Limit Theorem, sampling distributions, p-values, null hypothesis, and confidence intervals."
          },
          {
            "id": "da-1-5",
            "title": "1.5 Common Probability Distributions",
            "contentMd": "# 1.5 Probability Distributions\n\nNormal, binomial, Poisson, and uniform probability density functions."
          },
          {
            "id": "da-1-6",
            "title": "1.6 Correlation vs Causation Analysis",
            "contentMd": "# 1.6 Correlation vs Causation\n\nPearson correlation coefficient, confounding variables, and scatter matrix evaluation."
          },
          {
            "id": "da-1-7",
            "title": "1.7 Exploratory Data Analysis (EDA) Techniques",
            "contentMd": "# 1.7 EDA Techniques\n\nBox plots, outlier detection, distribution checks, and feature interaction heatmaps."
          }
        ]
      },
      {
        "id": "da-mod-2",
        "title": "2. Python for Data Analysis (NumPy & Pandas)",
        "testId": "test-python-data",
        "topics": [
          {
            "id": "da-2-1",
            "title": "2.1 NumPy N-Dimensional Arrays & Vectorization",
            "contentMd": "# 2.1 NumPy Arrays\n\nVectorized mathematical operations, array slicing, broadcasting rules, and memory layout."
          },
          {
            "id": "da-2-2",
            "title": "2.2 Pandas Series & DataFrames",
            "contentMd": "# 2.2 Pandas Series & DataFrames\n\nData ingestion, index labels, `loc` label indexing, and `iloc` integer indexing."
          },
          {
            "id": "da-2-3",
            "title": "2.3 Data Cleaning & Handling Missing Values",
            "contentMd": "# 2.3 Data Cleaning\n\nDetecting `NaN`, imputation with mean/median, dropping records, and outlier removal."
          },
          {
            "id": "da-2-4",
            "title": "2.4 Data Transformation & Type Casting",
            "contentMd": "# 2.4 Data Transformation\n\n`.apply()`, `.map()`, string vectorization, regex replacements, and date conversions."
          },
          {
            "id": "da-2-5",
            "title": "2.5 Grouping & Aggregations",
            "contentMd": "# 2.5 Grouping & Aggregations\n\n`.groupby()` with multiple aggregations, pivot tables, and cross-tabulations."
          },
          {
            "id": "da-2-6",
            "title": "2.6 Merging, Joining, and Concatenation",
            "contentMd": "# 2.6 Merging & Joining\n\nInner, left, right, and full outer joins between DataFrames on shared keys."
          },
          {
            "id": "da-2-7",
            "title": "2.7 Data Visualization with Matplotlib",
            "contentMd": "# 2.7 Matplotlib\n\nFigure and axis anatomy, line charts, bar plots, histograms, and figure exports."
          },
          {
            "id": "da-2-8",
            "title": "2.8 Statistical Visualizations with Seaborn",
            "contentMd": "# 2.8 Seaborn\n\nPairplots, correlation heatmaps, violin plots, and categorical count plots."
          },
          {
            "id": "da-2-9",
            "title": "2.9 Interactive Visualizations with Plotly",
            "contentMd": "# 2.9 Plotly\n\nInteractive zoomable line charts, 3D scatter plots, and responsive web dashboards."
          },
          {
            "id": "da-2-10",
            "title": "2.10 Time Series Analysis in Pandas",
            "contentMd": "# 2.10 Time Series\n\nDatetimeIndex, date offsets, rolling window moving averages, and resampling."
          },
          {
            "id": "da-2-11",
            "title": "2.11 Ingestion & Export (CSV & Excel)",
            "contentMd": "# 2.11 CSV & Excel\n\nHigh-performance read/write workflows with `read_csv`, `to_csv`, and Excel sheets."
          }
        ]
      },
      {
        "id": "da-mod-3",
        "title": "3. SQL for Business & Product Analytics",
        "testId": "test-sql-analytics",
        "topics": [
          {
            "id": "da-3-1",
            "title": "3.1 SQL Review & Query Logic",
            "contentMd": "# 3.1 SQL Review\n\nLogical query processing order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY."
          },
          {
            "id": "da-3-2",
            "title": "3.2 Advanced Aggregate Functions",
            "contentMd": "# 3.2 Advanced Aggregates\n\nConditional aggregation using `CASE WHEN` inside `SUM()` and `COUNT()`."
          },
          {
            "id": "da-3-3",
            "title": "3.3 Analytical Joins & Churn Cohorts",
            "contentMd": "# 3.3 Analytical Joins\n\nJoining transactional logs with user registries for retention calculations."
          },
          {
            "id": "da-3-4",
            "title": "3.4 Common Table Expressions (CTEs)",
            "contentMd": "# 3.4 Common Table Expressions (CTEs)\n\nReadable, modular subquery refactoring with `WITH` clauses."
          },
          {
            "id": "da-3-5",
            "title": "3.5 SQL Window Functions",
            "contentMd": "# 3.5 SQL Window Functions\n\n`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, `LAG()`, and cumulative sums over partitions."
          },
          {
            "id": "da-3-6",
            "title": "3.6 Value Analytical Functions",
            "contentMd": "# 3.6 Value Analytical Functions\n\n`FIRST_VALUE()`, `LAST_VALUE()`, and `NTILE(4)` quartile distribution bucketing."
          },
          {
            "id": "da-3-7",
            "title": "3.7 Query Optimization & Execution Plans",
            "contentMd": "# 3.7 Query Optimization\n\nAnalyzing index scans, hash matches, and reducing query latency."
          }
        ]
      },
      {
        "id": "da-mod-4",
        "title": "4. Business Intelligence, Dashboards, and Storytelling",
        "testId": "test-bi-reporting",
        "topics": [
          {
            "id": "da-4-1",
            "title": "4.1 Executive Dashboard Design Principles",
            "contentMd": "# 4.1 Dashboard Design\n\nVisual hierarchy, KPI positioning, color theory for charts, and cognitive load reduction."
          },
          {
            "id": "da-4-2",
            "title": "4.2 Rapid Python Dashboards with Streamlit",
            "contentMd": "# 4.2 Streamlit Dashboards\n\nReactive widgets, `st.metric()`, `st.plotly_chart()`, and deploying data apps."
          },
          {
            "id": "da-4-3",
            "title": "4.3 Report Automation in Production",
            "contentMd": "# 4.3 Report Automation\n\nAutomating scheduled weekly Excel and PDF reports with Python."
          },
          {
            "id": "da-4-4",
            "title": "4.4 Modern BI Tools (Power BI & Tableau)",
            "contentMd": "# 4.4 Modern BI Tools\n\nData modeling concepts, star schemas, measures, and DAX formulations."
          },
          {
            "id": "da-4-5",
            "title": "4.5 Data Storytelling & Executive Presentations",
            "contentMd": "# 4.5 Data Storytelling\n\nFraming analytical findings into strategic business action items."
          }
        ]
      }
    ]
  }
];

export const EXTENDED_TESTS = [
  {
    "id": "test-python-fundamentals",
    "title": "Python Fundamentals Comprehensive Exam",
    "description": "Exhaustive assessment on memory management, primitives, decimal precision, mutability, and functions.",
    "moduleId": "py-mod-1",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-01T10:00:00Z",
    "questions": [
      {
        "id": "q1-1",
        "text": "What does 0.1 + 0.2 == 0.3 evaluate to in standard Python?",
        "options": [
          "True",
          "False",
          "TypeError",
          "ZeroDivisionError"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q1-2",
        "text": "Which module provides exact arbitrary-precision arithmetic for financial ledgers?",
        "options": [
          "math",
          "decimal",
          "fractions",
          "statistics"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q1-3",
        "text": "Which of the following types is mutable?",
        "options": [
          "tuple",
          "str",
          "frozenset",
          "list"
        ],
        "correctAnswer": 3
      },
      {
        "id": "q1-4",
        "text": "What function returns the unique CPython memory address of an object?",
        "options": [
          "ref()",
          "id()",
          "memory()",
          "pointer()"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q1-5",
        "text": "What does `if __name__ == '__main__':` guarantee?",
        "options": [
          "Runs only when script is run directly",
          "Runs when imported as module",
          "Compiles into C binary",
          "Clears garbage collector"
        ],
        "correctAnswer": 0
      },
      {
        "id": "q1-6",
        "text": "Which operator checks whether two variables point to the exact same memory location?",
        "options": [
          "==",
          "is",
          "in",
          "equals"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q1-7",
        "text": "What is the scope lookup sequence in Python?",
        "options": [
          "GELB",
          "BLEG",
          "LEGB",
          "ELGB"
        ],
        "correctAnswer": 2
      },
      {
        "id": "q1-8",
        "text": "Which method safely retrieves a dictionary value without throwing a KeyError?",
        "options": [
          ".get()",
          ".find()",
          ".fetch()",
          ".lookup()"
        ],
        "correctAnswer": 0
      },
      {
        "id": "q1-9",
        "text": "What is the return type of `filter()` in Python 3?",
        "options": [
          "list",
          "filter iterator object",
          "tuple",
          "generator"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q1-10",
        "text": "Which statement guarantees execution even if an exception is raised?",
        "options": [
          "except",
          "finally",
          "else",
          "ensure"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-python-oop",
    "title": "Object-Oriented Programming (OOP) Assessment",
    "description": "Test your mastery of inheritance, polymorphism, encapsulation, and dunder methods.",
    "moduleId": "py-mod-2",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-05T10:00:00Z",
    "questions": [
      {
        "id": "q2-1",
        "text": "What is the first parameter received by a method decorated with @classmethod?",
        "options": [
          "self",
          "cls",
          "class",
          "this"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q2-2",
        "text": "Which algorithm computes Python's Method Resolution Order (MRO)?",
        "options": [
          "Dijkstra",
          "C3 Linearization",
          "Breadth-First Search",
          "Kruskal"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q2-3",
        "text": "How does Python name-mangle private attribute `__balance` in class `Account`?",
        "options": [
          "_Account__balance",
          "__Account_balance",
          "_balance",
          "Account.balance"
        ],
        "correctAnswer": 0
      },
      {
        "id": "q2-4",
        "text": "Which dunder method enables `len(obj)`?",
        "options": [
          "__count__",
          "__size__",
          "__len__",
          "__length__"
        ],
        "correctAnswer": 2
      },
      {
        "id": "q2-5",
        "text": "What decorator creates a property getter in Python?",
        "options": [
          "@getter",
          "@property",
          "@prop",
          "@field"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-python-advanced",
    "title": "Advanced Python & Metaprogramming Quiz",
    "description": "Test your understanding of decorators, generators, context managers, and closures.",
    "moduleId": "py-mod-3",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-10T10:00:00Z",
    "questions": [
      {
        "id": "q3-1",
        "text": "Which keyword turns a standard function into a lazy generator?",
        "options": [
          "return",
          "yield",
          "emit",
          "stream"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q3-2",
        "text": "What does `@functools.wraps` preserve when decorating a function?",
        "options": [
          "Execution time",
          "Original name and docstring",
          "Local variables",
          "Bytecode size"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q3-3",
        "text": "Which pair of methods must be implemented for a context manager?",
        "options": [
          "__open__ / __close__",
          "__enter__ / __exit__",
          "__start__ / __stop__",
          "__init__ / __del__"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-flask",
    "title": "Flask Web Framework Exam",
    "description": "Evaluate your proficiency in routing, ORMs, JWT auth, and Jinja2 templating.",
    "moduleId": "py-mod-4",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-15T10:00:00Z",
    "questions": [
      {
        "id": "q4-1",
        "text": "Which object in Flask contains incoming JSON payloads and URL query parameters?",
        "options": [
          "response",
          "request",
          "session",
          "context"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q4-2",
        "text": "What Flask extension manages database migrations via Alembic?",
        "options": [
          "Flask-Migrate",
          "Flask-DB",
          "Flask-Alembic",
          "Flask-Schema"
        ],
        "correctAnswer": 0
      },
      {
        "id": "q4-3",
        "text": "Which architectural pattern segments Flask routes into modular sub-applications?",
        "options": [
          "Blueprints",
          "Namespaces",
          "Middlewares",
          "Routers"
        ],
        "correctAnswer": 0
      }
    ]
  },
  {
    "id": "test-eel",
    "title": "Eel Desktop Applications Quiz",
    "description": "Assess your skills building hybrid desktop GUI applications with Python and Eel.",
    "moduleId": "py-mod-5",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-20T10:00:00Z",
    "questions": [
      {
        "id": "q5-1",
        "text": "Which decorator exposes a Python backend function to JavaScript in Eel?",
        "options": [
          "@eel.expose",
          "@eel.bridge",
          "@expose.js",
          "@eel.call"
        ],
        "correctAnswer": 0
      },
      {
        "id": "q5-2",
        "text": "Which tool compiles Eel desktop applications into standalone Windows .exe binaries?",
        "options": [
          "PyInstaller",
          "pip",
          "CMake",
          "Vite"
        ],
        "correctAnswer": 0
      }
    ]
  },
  {
    "id": "test-sqlserver",
    "title": "SQL Server & Relational Architecture Test",
    "description": "Test your mastery of RDBMS constraints, joins, transactions, and indexing.",
    "moduleId": "py-mod-6",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-25T10:00:00Z",
    "questions": [
      {
        "id": "q6-1",
        "text": "What does the 'I' in ACID transaction properties stand for?",
        "options": [
          "Integrity",
          "Isolation",
          "Immutability",
          "Indexing"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q6-2",
        "text": "Which Python library connects natively to Microsoft SQL Server via ODBC?",
        "options": [
          "pyodbc",
          "sqlite3",
          "requests",
          "psycopg2"
        ],
        "correctAnswer": 0
      }
    ]
  },
  {
    "id": "test-fullstack-integration",
    "title": "Full-Stack System Architecture Assessment",
    "description": "Comprehensive review of building end-to-end applications with Python and React.",
    "moduleId": "py-mod-7",
    "assignedBatchIds": [
      "batch-fswd-morning"
    ],
    "createdAt": "2026-03-28T10:00:00Z",
    "questions": [
      {
        "id": "q7-1",
        "text": "What HTTP status code represents resource creation in a REST API?",
        "options": [
          "200 OK",
          "201 Created",
          "204 No Content",
          "400 Bad Request"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-html-css",
    "title": "HTML5 & CSS3 Standards Quiz",
    "description": "Test your layout, semantic HTML, and responsive CSS architecture knowledge.",
    "moduleId": "fe-mod-1",
    "assignedBatchIds": [
      "batch-fswd-evening"
    ],
    "createdAt": "2026-03-01T10:00:00Z",
    "questions": [
      {
        "id": "qh-1",
        "text": "Which HTML5 element represents the primary navigation landmark?",
        "options": [
          "<header>",
          "<nav>",
          "<main>",
          "<section>"
        ],
        "correctAnswer": 1
      },
      {
        "id": "qh-2",
        "text": "What does `box-sizing: border-box` include inside the element's width?",
        "options": [
          "Only content",
          "Content, padding, and border",
          "Margin and content",
          "Only padding"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-javascript",
    "title": "JavaScript Modern ES6+ & Core Mechanics",
    "description": "Deep assessment on types, strict equality, arrow functions, and async/await.",
    "moduleId": "fe-mod-3",
    "assignedBatchIds": [
      "batch-fswd-evening"
    ],
    "createdAt": "2026-03-10T10:00:00Z",
    "questions": [
      {
        "id": "qj-1",
        "text": "Which of the following is a primitive type in JavaScript?",
        "options": [
          "Array",
          "Symbol",
          "Object",
          "Function"
        ],
        "correctAnswer": 1
      },
      {
        "id": "qj-2",
        "text": "What does `'5' === 5` evaluate to in JavaScript?",
        "options": [
          "true",
          "false",
          "TypeError",
          "NaN"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-jquery-bootstrap",
    "title": "jQuery & Bootstrap 5 Responsive Systems",
    "description": "Evaluate your proficiency in jQuery selectors and Bootstrap grid/components.",
    "moduleId": "fe-mod-4",
    "assignedBatchIds": [
      "batch-fswd-evening"
    ],
    "createdAt": "2026-03-15T10:00:00Z",
    "questions": [
      {
        "id": "qjb-1",
        "text": "How many columns does the Bootstrap responsive grid contain?",
        "options": [
          "10",
          "12",
          "16",
          "8"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-python-data",
    "title": "NumPy & Pandas Data Analysis Exam",
    "description": "Assess your skills in array vectorization, DataFrame aggregations, and cleaning.",
    "moduleId": "da-mod-2",
    "assignedBatchIds": [
      "batch-da-weekend"
    ],
    "createdAt": "2026-03-10T10:00:00Z",
    "questions": [
      {
        "id": "qd-1",
        "text": "Which Pandas indexing method accesses data strictly by integer index positions?",
        "options": [
          ".loc[]",
          ".iloc[]",
          ".index[]",
          ".get()"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "test-sql-analytics",
    "title": "SQL for Advanced Business Analytics",
    "description": "Window functions, Common Table Expressions, and analytical joins.",
    "moduleId": "da-mod-3",
    "assignedBatchIds": [
      "batch-da-weekend"
    ],
    "createdAt": "2026-03-15T10:00:00Z",
    "questions": [
      {
        "id": "qs-1",
        "text": "Which SQL clause defines an analytical partition for Window Functions?",
        "options": [
          "OVER (PARTITION BY ...)",
          "GROUP BY",
          "WHERE",
          "HAVING"
        ],
        "correctAnswer": 0
      }
    ]
  }
];
