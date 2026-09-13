-- ==============================================================================
-- Migration 005: Coding Arena & Student Judging Module
-- ==============================================================================

-- 1. Table for Coding Arena Problems
CREATE TABLE IF NOT EXISTS public.coding_problems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Easy',
  category TEXT DEFAULT 'Lists',
  order_index INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 50,
  hints JSONB DEFAULT '[]'::jsonb,
  starter_code TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  hidden_test_cases JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Student Coding Attempts & Progress
CREATE TABLE IF NOT EXISTS public.coding_attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  problem_id TEXT NOT NULL,
  code TEXT,
  passed BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  visible_results JSONB DEFAULT '[]'::jsonb,
  hidden_results_summary JSONB DEFAULT '{}'::jsonb,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coding_attempts_student ON public.coding_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_coding_attempts_problem ON public.coding_attempts(problem_id);
CREATE INDEX IF NOT EXISTS idx_coding_problems_order ON public.coding_problems(order_index);

-- Permissions & RLS
GRANT ALL ON public.coding_problems TO anon, authenticated, service_role;
GRANT ALL ON public.coding_attempts TO anon, authenticated, service_role;

ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coding_problems_read" ON public.coding_problems;
CREATE POLICY "coding_problems_read" ON public.coding_problems FOR SELECT USING (true);

DROP POLICY IF EXISTS "coding_problems_write" ON public.coding_problems;
CREATE POLICY "coding_problems_write" ON public.coding_problems FOR ALL USING (true);

DROP POLICY IF EXISTS "coding_attempts_read" ON public.coding_attempts;
CREATE POLICY "coding_attempts_read" ON public.coding_attempts FOR SELECT USING (true);

DROP POLICY IF EXISTS "coding_attempts_write" ON public.coding_attempts;
CREATE POLICY "coding_attempts_write" ON public.coding_attempts FOR ALL USING (true);

-- 3. Seed the 20 Teacher-Provided List Challenges

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q1', 'Q1: Sum of All Elements in a List', 'Create a list of 10 numbers (hardcoded). Use a for loop to calculate the sum. Print the sum.

Example: [1,2,3,4,5,6,7,8,9,10] -> sum = 55', 'Easy', 'Lists', 1, 50, '["Initialize sum = 0 before the loop","Use for num in numbers: to iterate","Add each num to sum inside the loop","Use print(sum) at the end"]'::jsonb, 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
sum = 0
# Use a for loop to calculate the sum
# Print the sum
', '[{"input":"numbers = [1,2,3,4,5,6,7,8,9,10]","expected":"55"}]'::jsonb, '[{"input":"all zeros","expected":"0","inject":"numbers = [0,0,0,0,0,0,0,0,0,0]\nsum = 0"},{"input":"tens","expected":"550","inject":"numbers = [10,20,30,40,50,60,70,80,90,100]\nsum = 0"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q2', 'Q2: Find the Largest Number in a List', 'Given a list of numbers, use a for loop to find and print the largest number. Do not use max().

Example: [45, 78, 12, 89, 34, 67] -> largest = 89', 'Easy', 'Lists', 2, 50, '["Set largest = numbers[0] before the loop","Compare each number with largest inside the loop","If number > largest, update largest","Print largest after the loop"]'::jsonb, 'numbers = [45, 78, 12, 89, 34, 67]
largest = numbers[0]
# Use a for loop to find the largest
# Do NOT use max()
# Print the largest number
', '[{"input":"[45, 78, 12, 89, 34, 67]","expected":"89"}]'::jsonb, '[{"input":"single","expected":"1","inject":"numbers = [1]\nlargest = numbers[0]"},{"input":"negatives","expected":"-1","inject":"numbers = [-5, -1, -10, -3]\nlargest = numbers[0]"},{"input":"ascending","expected":"300","inject":"numbers = [100, 200, 300]\nlargest = numbers[0]"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q3', 'Q3: Count Even Numbers in a List', 'Given a list of 10 numbers. Use a for loop to count how many are even. Print the count.

Example: [2,5,8,11,14,17,20,23,26,29] -> even count = 5', 'Easy', 'Lists', 3, 60, '["Initialize count = 0","In the for loop, use if num % 2 == 0 to check even","Increment count when even","Print count at the end"]'::jsonb, 'numbers = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29]
count = 0
# Use a for loop to count evens
# Print the even count
', '[{"input":"[2,5,8,11,14,17,20,23,26,29]","expected":"5"}]'::jsonb, '[{"input":"all odd","expected":"0","inject":"numbers = [1,3,5,7,9,11,13,15,17,19]\ncount = 0"},{"input":"all even","expected":"10","inject":"numbers = [2,4,6,8,10,12,14,16,18,20]\ncount = 0"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q4', 'Q4: Reverse a List Without reverse()', 'Given a list, use a while loop to create a new list in reverse order. Print the reversed list.

Example: [10,20,30,40,50] -> [50,40,30,20,10]', 'Easy', 'Lists', 4, 60, '["Start index at len(numbers) - 1","Use a while loop: while index >= 0","Append numbers[index] to reversed_list","Decrement index by 1 each iteration"]'::jsonb, 'numbers = [10, 20, 30, 40, 50]
reversed_list = []
# Use a while loop to reverse without reverse()
# Print the reversed list
', '[{"input":"[10,20,30,40,50]","expected":"[50, 40, 30, 20, 10]"}]'::jsonb, '[{"input":"single","expected":"[1]","inject":"numbers = [1]\nreversed_list = []"},{"input":"already reversed","expected":"[1, 2, 3, 4, 5]","inject":"numbers = [5,4,3,2,1]\nreversed_list = []"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q5', 'Q5: Remove All Negative Numbers', 'Start with a list containing both positive and negative numbers. Use a while loop to remove all negative numbers. Iterate from the end to avoid index shifting.

Example: [5, -2, 8, -6, 3, -1] -> [5, 8, 3]', 'Medium', 'Lists', 5, 70, '["Start index at len(numbers) - 1 and go backwards","Use while index >= 0:","If numbers[index] < 0, use numbers.pop(index)","Iterating from the end avoids index shifting problems"]'::jsonb, 'numbers = [5, -2, 8, -6, 3, -1]
# Use a while loop to remove all negative numbers
# Iterate from the END of the list
# Print the result
', '[{"input":"[5, -2, 8, -6, 3, -1]","expected":"[5, 8, 3]"}]'::jsonb, '[{"input":"all negative","expected":"[]","inject":"numbers = [-1,-2,-3]"},{"input":"all positive","expected":"[1, 2, 3]","inject":"numbers = [1,2,3]"},{"input":"zero included","expected":"[0, 10, 7]","inject":"numbers = [0, -5, 10, -3, 7]"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q6', 'Q6: Find the Index of an Element', 'Given a list and a search value. Use a for loop to find the index. If found, print Found at index X; if not, print Not found. Do not use .index().

Example: list [10,20,30,40], search 30 -> Found at index 2', 'Medium', 'Lists', 6, 70, '["Use for i, num in enumerate(numbers):","If num == search: print(f''Found at index {i}'')","Use a found flag variable","If not found after loop, print Not found"]'::jsonb, 'numbers = [10, 20, 30, 40]
search = 30
found = False
# Use a for loop (no .index()) to find the index
# Print Found at index X or Not found
', '[{"input":"[10,20,30,40], search 30","expected":"Found at index 2"}]'::jsonb, '[{"input":"not found","expected":"Not found","inject":"numbers = [10,20,30,40]\nsearch = 99\nfound = False"},{"input":"first element","expected":"Found at index 0","inject":"numbers = [5,10,15]\nsearch = 5\nfound = False"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q7', 'Q7: Multiply Each Element by a Factor', 'Given a list, use a for loop to multiply each element by 2 and update the list. Print the updated list.

Example: [1,2,3,4] -> [2,4,6,8]', 'Easy', 'Lists', 7, 50, '["Use for i in range(len(numbers)): to get the index","Update: numbers[i] = numbers[i] * 2","Print the list after the loop"]'::jsonb, 'numbers = [1, 2, 3, 4]
# Use a for loop to multiply each element by 2
# Update the list in-place
# Print the updated list
', '[{"input":"[1,2,3,4]","expected":"[2, 4, 6, 8]"}]'::jsonb, '[{"input":"with zero","expected":"[0, 2, 4]","inject":"numbers = [0,1,2]"},{"input":"tens","expected":"[20, 40, 60]","inject":"numbers = [10,20,30]"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q8', 'Q8: Count Occurrences of a Value', 'Given a list of numbers and a value. Use a for loop to count how many times the value appears. Print the count.

Example: [1,2,3,2,4,2,5], value 2 -> count = 3', 'Easy', 'Lists', 8, 50, '["Initialize count = 0 before the loop","In the for loop, use if num == value: count += 1","Print count after the loop"]'::jsonb, 'numbers = [1, 2, 3, 2, 4, 2, 5]
value = 2
count = 0
# Use a for loop to count occurrences of value
# Print the count
', '[{"input":"[1,2,3,2,4,2,5], value=2","expected":"3"}]'::jsonb, '[{"input":"all same","expected":"4","inject":"numbers = [1,1,1,1]\nvalue = 1\ncount = 0"},{"input":"not present","expected":"0","inject":"numbers = [1,2,3]\nvalue = 9\ncount = 0"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q9', 'Q9: Merge Two Lists Without Duplicates', 'List A = [1,3,5,7,9], List B = [3,6,7,9,12]. Create a new list with all elements from both lists without duplicates. Use for loops.

Example output: [1,3,5,7,9,6,12]', 'Medium', 'Lists', 9, 70, '["Start merged with all elements of list_a","Loop through list_b","For each element in B, check if it is already in merged","Only append if not already in merged"]'::jsonb, 'list_a = [1, 3, 5, 7, 9]
list_b = [3, 6, 7, 9, 12]
merged = []
# Use for loops to merge without duplicates
# Print the merged list
', '[{"input":"A=[1,3,5,7,9], B=[3,6,7,9,12]","expected":"[1, 3, 5, 7, 9, 6, 12]"}]'::jsonb, '[{"input":"partial overlap","expected":"[1, 2, 3]","inject":"list_a = [1,2]\nlist_b = [2,3]\nmerged = []"},{"input":"full overlap","expected":"[1, 2, 3]","inject":"list_a = [1,2,3]\nlist_b = [1,2,3]\nmerged = []"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q10', 'Q10: Check if a List is Sorted in Ascending Order', 'Given a list, use a for loop to check if it is sorted from smallest to largest. Print Sorted or Not sorted.

Example: [1,3,5,7,9] -> Sorted. [1,5,2,7,9] -> Not sorted.', 'Medium', 'Lists', 10, 70, '["Loop from index 0 to len-2 using range(len(numbers)-1)","Compare numbers[i] with numbers[i+1]","If numbers[i] > numbers[i+1], it is not sorted","Use a boolean flag is_sorted = True"]'::jsonb, 'numbers = [1, 3, 5, 7, 9]
is_sorted = True
# Use a for loop to check if sorted ascending
# Print Sorted or Not sorted
', '[{"input":"[1,3,5,7,9]","expected":"Sorted"}]'::jsonb, '[{"input":"not sorted","expected":"Not sorted","inject":"numbers = [1,5,2,7,9]\nis_sorted = True"},{"input":"single element","expected":"Sorted","inject":"numbers = [1]\nis_sorted = True"},{"input":"descending","expected":"Not sorted","inject":"numbers = [9,8,7]\nis_sorted = True"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q11', 'Q11: Remove All Duplicates from a List', 'Given a list with duplicates, use a for loop to create a new list with only unique elements. Preserve the order of first occurrence.

Example: [1,2,2,3,4,4,4,5] -> [1,2,3,4,5]', 'Medium', 'Lists', 11, 70, '["Create an empty unique_list = []","For each element, check if it is already in unique_list","Only append if not already present","This preserves order of first occurrence"]'::jsonb, 'numbers = [1, 2, 2, 3, 4, 4, 4, 5]
unique_list = []
# Use a for loop to remove duplicates (preserve order)
# Print the unique list
', '[{"input":"[1,2,2,3,4,4,4,5]","expected":"[1, 2, 3, 4, 5]"}]'::jsonb, '[{"input":"all same","expected":"[1]","inject":"numbers = [1,1,1,1]\nunique_list = []"},{"input":"no duplicates","expected":"[1, 2, 3]","inject":"numbers = [1,2,3]\nunique_list = []"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q12', 'Q12: Sum of Digits of All Numbers in a List', 'Given a list of numbers, use a for loop and a while loop to calculate the sum of digits of each number. Store results in a new list. Print both lists.

Example: [12, 34, 56] -> digit sums = [3, 7, 11]', 'Medium', 'Lists', 12, 80, '["For each number, use a while loop: while num > 0","digit = num % 10 gives the last digit","num = num // 10 removes the last digit","Accumulate digit_sum and append to result list"]'::jsonb, 'numbers = [12, 34, 56]
digit_sums = []
# For each number, calculate sum of its digits
# Use nested loops (for + while)
# Print both lists
', '[{"input":"[12, 34, 56]","expected":"[12, 34, 56]\n[3, 7, 11]"}]'::jsonb, '[{"input":"hundreds","expected":"[100, 999]\n[1, 27]","inject":"numbers = [100, 999]\ndigit_sums = []"},{"input":"small","expected":"[5, 10]\n[5, 1]","inject":"numbers = [5, 10]\ndigit_sums = []"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q13', 'Q13: Find the Second Largest Number', 'Given a list of numbers, use a for loop to find the second largest number (without sorting). Print it.

Example: [10, 45, 78, 23, 56] -> second largest = 56', 'Medium', 'Lists', 13, 80, '["Track both largest and second_largest","Initialize both to float(''-inf'')","If num > largest: second_largest = largest, then largest = num","Else if num > second_largest and num != largest: second_largest = num"]'::jsonb, 'numbers = [10, 45, 78, 23, 56]
largest = float(''-inf'')
second_largest = float(''-inf'')
# Use a for loop to find the second largest
# Do NOT sort the list
# Print second_largest
', '[{"input":"[10, 45, 78, 23, 56]","expected":"56"}]'::jsonb, '[{"input":"two elements","expected":"1","inject":"numbers = [1, 2]\nlargest = float(''-inf'')\nsecond_largest = float(''-inf'')"},{"input":"with duplicates","expected":"4","inject":"numbers = [5,5,5,4]\nlargest = float(''-inf'')\nsecond_largest = float(''-inf'')"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q14', 'Q14: Swap First and Last Elements', 'Use a simple assignment to swap the first and last elements of a list. Print the modified list.

Example: [10,20,30,40,50] -> [50,20,30,40,10]', 'Easy', 'Lists', 14, 40, '["Use Python''s simultaneous assignment: a, b = b, a","numbers[0], numbers[-1] = numbers[-1], numbers[0]","This works in a single line!"]'::jsonb, 'numbers = [10, 20, 30, 40, 50]
# Swap the first and last elements
# Print the modified list
', '[{"input":"[10,20,30,40,50]","expected":"[50, 20, 30, 40, 10]"}]'::jsonb, '[{"input":"two elements","expected":"[2, 1]","inject":"numbers = [1, 2]"},{"input":"all same","expected":"[7, 7, 7]","inject":"numbers = [7, 7, 7]"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q15', 'Q15: Split a List into Odd and Even Lists', 'Given a list, use a for loop to separate odd and even numbers into two new lists. Print both lists.

Example: [1,2,3,4,5,6,7,8,9] -> evens [2,4,6,8], odds [1,3,5,7,9]', 'Easy', 'Lists', 15, 50, '["Create two empty lists: evens = [] and odds = []","For each number, check num % 2 == 0","Append to evens or odds accordingly","Print both lists at the end"]'::jsonb, 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = []
odds = []
# Use a for loop to separate into evens and odds
# Print evens list then odds list
', '[{"input":"[1,2,3,4,5,6,7,8,9]","expected":"[2, 4, 6, 8]\n[1, 3, 5, 7, 9]"}]'::jsonb, '[{"input":"all even","expected":"[2, 4, 6]\n[]","inject":"numbers = [2,4,6]\nevens = []\nodds = []"},{"input":"all odd","expected":"[]\n[1, 3, 5]","inject":"numbers = [1,3,5]\nevens = []\nodds = []"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q16', 'Q16: Rotate the List Left by One Position', 'Take a list and rotate it left by one (first element moves to the end). Print the rotated list.

Example: [1,2,3,4,5] -> [2,3,4,5,1]', 'Easy', 'Lists', 16, 60, '["Save the first element: first = numbers[0]","Use numbers.pop(0) to remove the first element","Use numbers.append(first) to add it to the end","Or: numbers = numbers[1:] + [numbers[0]]"]'::jsonb, 'numbers = [1, 2, 3, 4, 5]
# Rotate the list left by one position
# First element goes to the end
# Print the rotated list
', '[{"input":"[1,2,3,4,5]","expected":"[2, 3, 4, 5, 1]"}]'::jsonb, '[{"input":"single","expected":"[10]","inject":"numbers = [10]"},{"input":"two elements","expected":"[2, 1]","inject":"numbers = [1,2]"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q17', 'Q17: Average of Numbers Greater Than a Threshold', 'Given a list and a threshold value. Use a for loop to find all numbers greater than the threshold, and calculate their average. Print the average.

Example: list [10,20,30,40,50], threshold 25 -> average = 40.0', 'Medium', 'Lists', 17, 70, '["Filter numbers greater than threshold into a new list","Sum the filtered numbers","Divide by the count of filtered numbers","If no numbers exceed threshold, print No numbers above threshold"]'::jsonb, 'numbers = [10, 20, 30, 40, 50]
threshold = 25
filtered = []
# Use a for loop to find numbers > threshold
# Calculate and print the average
# If no numbers above threshold, print No numbers above threshold
', '[{"input":"[10,20,30,40,50], threshold=25","expected":"40.0"}]'::jsonb, '[{"input":"none above threshold","expected":"No numbers above threshold","inject":"numbers = [1,2,3]\nthreshold = 10\nfiltered = []"},{"input":"partial","expected":"15.0","inject":"numbers = [5,10,15,20]\nthreshold = 7\nfiltered = []"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q18', 'Q18: Create a List of Squares Using While', 'Use a while loop to generate a list of squares of numbers from 1 to 10. Print the list.

Output: [1,4,9,16,25,36,49,64,81,100]', 'Easy', 'Lists', 18, 50, '["Initialize i = 1 and squares = []","While i <= 10: append i*i to squares","Increment i by 1 each iteration","Print squares after the loop"]'::jsonb, 'squares = []
i = 1
# Use a while loop to generate squares of 1 to 10
# Print the list
', '[{"input":"squares of 1 to 10","expected":"[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]"}]'::jsonb, '[{"input":"verify output","expected":"[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]","inject":"squares = []\ni = 1"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q19', 'Q19: Remove All Occurrences of a Value Using While', 'Given a list and a value, use a while loop to remove every occurrence of that value from the list. Print the result.

Example: [1,2,3,2,4,2,5], remove 2 -> [1,3,4,5]', 'Medium', 'Lists', 19, 70, '["Use while value in numbers: to keep checking","Inside: numbers.remove(value) removes one occurrence at a time","The loop continues until all occurrences are gone","Print the list after the loop"]'::jsonb, 'numbers = [1, 2, 3, 2, 4, 2, 5]
value = 2
# Use a while loop to remove ALL occurrences of value
# Print the result
', '[{"input":"[1,2,3,2,4,2,5], value=2","expected":"[1, 3, 4, 5]"}]'::jsonb, '[{"input":"all same value","expected":"[]","inject":"numbers = [5,5,5,5]\nvalue = 5"},{"input":"value not present","expected":"[1, 2, 3]","inject":"numbers = [1,2,3]\nvalue = 9"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;

INSERT INTO public.coding_problems (id, title, description, difficulty, category, order_index, xp, hints, starter_code, test_cases, hidden_test_cases)
VALUES ('arena-q20', 'Q20: Find the Longest Word in a Sentence', 'Given a sentence, split it into words using .split() and store in a list. Use a for loop to find the longest word. Print it.

Example: Python is a powerful language -> powerful', 'Medium', 'Lists', 20, 80, '["Use sentence.split() to get a list of words","Initialize longest = empty string before the loop","If len(word) > len(longest): longest = word","Print longest after the loop"]'::jsonb, 'sentence = ''Python is a powerful language''
words = sentence.split()
longest = ''''
# Use a for loop to find the longest word
# Print the longest word
', '[{"input":"''Python is a powerful language''","expected":"powerful"}]'::jsonb, '[{"input":"single word","expected":"Hi","inject":"sentence = ''Hi''\nwords = sentence.split()\nlongest = ''''"},{"input":"equal lengths","expected":"three","inject":"sentence = ''one two three four five''\nwords = sentence.split()\nlongest = ''''"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category = EXCLUDED.category,
  order_index = EXCLUDED.order_index,
  xp = EXCLUDED.xp,
  hints = EXCLUDED.hints,
  starter_code = EXCLUDED.starter_code,
  test_cases = EXCLUDED.test_cases,
  hidden_test_cases = EXCLUDED.hidden_test_cases;
