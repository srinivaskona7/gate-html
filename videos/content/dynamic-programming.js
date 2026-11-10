module.exports = {
 "id": "dynamic-programming",
 "title": "Dynamic Programming",
 "sub": "LCS, 0/1 knapsack, matrix chain multiplication and Floyd-Warshall",
 "cat": "Algorithms",
 "accent": "#3fb950",
 "icon": "layers",
 "target": 30,
 "keyword": "DYNAMIC",
 "tags": "#gate2027 #gatecse #algorithms #dynamicprogramming",
 "scenes": [
  {
   "type": "hook",
   "title": "Dynamic Programming",
   "kicker": "Algorithms · 30 minutes",
   "q": "Fibonacci of 40 needs 331 million calls. How can we do it in 40 steps?",
   "n": "Here is a strange fact. A plain recursive function for Fibonacci of forty makes three hundred thirty one million one hundred sixty thousand two hundred eighty one calls. Yet the answer needs only forty additions. The difference is one idea: never solve the same subproblem twice. That idea is dynamic programming, and in GATE it is worth marks regularly, through four classic problems. The longest common subsequence. The zero one knapsack. Matrix chain multiplication. And Floyd Warshall, all pairs shortest paths. In the next thirty minutes we build each one from scratch, fill the tables by hand, and learn the traps that GATE sets. Every number here was checked by a program."
  },
  {
   "type": "roadmap",
   "n": "Here is the plan. Thirty nine short steps in six sections: foundations, longest common subsequence, the zero one knapsack, matrix chain multiplication, Floyd Warshall, and finally GATE practice with shortcuts."
  },
  {
   "type": "step",
   "x": 1,
   "chip": "Analogy",
   "title": "Think of a notebook of solved puzzles",
   "icon": "book",
   "items": [
    [
     "book",
     "Notebook = the table",
     "Each solved subproblem is written down once"
    ],
    [
     "search",
     "Before solving, look it up",
     "If the answer is there, reuse it"
    ],
    [
     "layers",
     "Big answers from small ones",
     "Combine entries already in the notebook"
    ],
    [
     "check",
     "Last entry = the answer",
     "The final cell holds the result"
    ]
   ],
   "n": "Here is a picture to keep in mind. You are solving a huge puzzle made of smaller puzzles, and many of the small ones repeat. A clever student keeps a notebook. Before solving anything, look in the notebook. If the answer is there, reuse it. Otherwise solve it from smaller entries, and write it down. Dynamic programming is exactly that notebook, and the table we fill is the notebook. The last entry written is the final answer."
  },
  {
   "sec": "Foundations",
   "title": "What makes a problem dynamic?",
   "items": [
    [
     "refresh",
     "Overlapping subproblems",
     "The same call repeats many times"
    ],
    [
     "layers",
     "Optimal substructure",
     "Best answer uses best sub-answers"
    ],
    [
     "book",
     "Store each answer once",
     "A table indexed by the subproblem"
    ],
    [
     "x",
     "No overlap: divide and conquer",
     "Merge sort has nothing to cache"
    ]
   ],
   "tip": "Overlap makes the table worthwhile. Optimal substructure makes the table correct.",
   "n": "Step one: Two properties are needed. First, overlapping subproblems: the same smaller problem appears again and again inside the recursion. Second, optimal substructure: an optimal answer is built from optimal answers of its parts. When both hold, we can store each subproblem once. Without overlap, as in merge sort, there is nothing to reuse."
  },
  {
   "sec": "Foundations",
   "title": "Fibonacci: the blow up",
   "cmd": [
    "# calls(n) = 1 + calls(n-1) + calls(n-2)",
    "fib(5)  ->  15 calls",
    "fib(10) ->  177 calls",
    "fib(20) ->  21891 calls",
    "fib(40) ->  331160281 calls",
    "# with a table: 41 subproblems, 40 adds"
   ],
   "term": "naive recursion",
   "tip": "Exponential recursion becomes linear once each subproblem is solved once.",
   "n": "Step two: Let us see the waste. Counting calls, the naive recursion makes one plus calls of n minus one plus calls of n minus two. Fibonacci of five already takes fifteen calls. Fibonacci of ten takes one hundred seventy seven. Fibonacci of twenty takes twenty one thousand eight hundred ninety one. And Fibonacci of forty takes three hundred thirty one million one hundred sixty thousand two hundred eighty one calls. With a table there are only forty one distinct subproblems, and forty additions."
  },
  {
   "sec": "Foundations",
   "title": "Bottom up: filling the Fibonacci table",
   "viz": {
    "kind": "array",
    "cells": [
     "0",
     "1",
     "",
     "",
     "",
     "",
     "",
     ""
    ],
    "label": "fib(0..7)",
    "cw": 170,
    "idx": true,
    "fs": 50,
    "steps": [
     {
      "k": "base",
      "ok": [
       0,
       1
      ],
      "col": "blue",
      "note": "fib(0) = 0 and fib(1) = 1 are given"
     },
     {
      "k": "two",
      "set": {
       "2": "1"
      },
      "ptr": {
       "i": 2
      },
      "col": "pink",
      "note": "fib(2) = 1 + 0 = 1"
     },
     {
      "k": "three",
      "set": {
       "3": "2"
      },
      "ptr": {
       "i": 3
      },
      "col": "pink",
      "note": "fib(3) = 1 + 1 = 2"
     },
     {
      "k": "four",
      "set": {
       "4": "3"
      },
      "ptr": {
       "i": 4
      },
      "col": "pink",
      "note": "fib(4) = 2 + 1 = 3"
     },
     {
      "k": "five",
      "set": {
       "5": "5"
      },
      "ptr": {
       "i": 5
      },
      "col": "pink",
      "note": "fib(5) = 3 + 2 = 5"
     },
     {
      "k": "six",
      "set": {
       "6": "8"
      },
      "ptr": {
       "i": 6
      },
      "col": "pink",
      "note": "fib(6) = 5 + 3 = 8"
     },
     {
      "k": "seven",
      "set": {
       "7": "13"
      },
      "ptr": {
       "i": 7
      },
      "ok": [
       2,
       3,
       4,
       5,
       6,
       7
      ],
      "col": "ok",
      "note": "fib(7) = 8 + 5 = 13: linear time"
     }
    ]
   },
   "tip": "Fill order must respect dependencies: every entry needs earlier entries ready.",
   "n": "Step three: Bottom up means we fill the table from the smallest subproblem upward. Start with the base cases: fib of zero is zero and fib of one is one. Then fib of two is one plus zero, one. Fib of three is two. Fib of four is three. Fib of five is five, fib of six is eight, and fib of seven is thirteen. Each entry takes constant time from two earlier entries, so the whole table costs linear time."
  },
  {
   "sec": "Foundations",
   "title": "Top down versus bottom up",
   "cols": [
    "Aspect",
    "Top down",
    "Bottom up"
   ],
   "firstW": 250,
   "rows": [
    [
     "Style",
     "Recursion + cache",
     "Loops over a table"
    ],
    [
     "Computes",
     "Only needed states",
     "Every state"
    ],
    [
     "Stack",
     "Recursion depth",
     "None"
    ],
    [
     "Space trick",
     "Hard",
     "Keep last rows"
    ]
   ],
   "tip": "GATE only asks which is correct and what the time is. Both give the same answer.",
   "n": "Step four: There are two ways to use the notebook. Top down, also called memoization, keeps the natural recursion and caches each result. Bottom up, also called tabulation, fills the table in a loop from small to large. Memoization computes only the subproblems that are needed, but pays for recursion. Tabulation has no recursion overhead and allows space saving, but computes every entry."
  },
  {
   "sec": "Foundations",
   "title": "Time equals states times work per state",
   "cols": [
    "Problem",
    "States",
    "Per state",
    "Time"
   ],
   "firstW": 300,
   "rows": [
    [
     "LCS",
     "(m+1)(n+1)",
     "O(1)",
     "O(mn)"
    ],
    [
     "Knapsack",
     "(n+1)(W+1)",
     "O(1)",
     "O(nW)"
    ],
    [
     "Matrix chain",
     "n(n+1)/2",
     "O(n)",
     "O(n³)"
    ],
    [
     "Floyd-Warshall",
     "V × V × V",
     "O(1)",
     "O(V³)"
    ]
   ],
   "tip": "Time = number of states × work per state. It works for every DP.",
   "n": "Step five: A very useful rule: the running time is the number of states times the work per state. The longest common subsequence has m plus one times n plus one states, each in constant time, so order m n. The knapsack has n plus one times W plus one states, so order n W. Matrix chain has about n squared over two states, but each tries up to n splits, so order n cubed. Floyd Warshall has V cubed updates, each constant."
  },
  {
   "sec": "Foundations",
   "title": "Greedy, divide and conquer, or DP?",
   "cols": [
    "Method",
    "Subproblems",
    "Choices"
   ],
   "firstW": 260,
   "rows": [
    [
     "Divide, conquer",
     "Independent",
     "Split once"
    ],
    [
     "Greedy",
     "One remains",
     "One local pick"
    ],
    [
     "Dynamic prog.",
     "Overlapping",
     "Try all, reuse"
    ]
   ],
   "tip": "Greedy needs a proof. DP needs only optimal substructure and overlap.",
   "n": "Step six: How do we choose the technique? Divide and conquer splits into independent subproblems that never repeat, like merge sort. Greedy makes one locally best choice and never looks back, which is correct only when a special greedy property is proven. Dynamic programming tries all choices but remembers sub-answers, so it is safe whenever optimal substructure holds. As we will see, the zero one knapsack breaks greedy but yields to dynamic programming."
  },
  {
   "sec": "Foundations",
   "title": "The five step recipe",
   "items": [
    [
     "hash",
     "1. State",
     "What does one cell mean?"
    ],
    [
     "code",
     "2. Recurrence",
     "Cell from smaller cells"
    ],
    [
     "box",
     "3. Base cases",
     "First row and column"
    ],
    [
     "list",
     "4. Fill order",
     "Dependencies first"
    ],
    [
     "check",
     "5. Answer cell",
     "Often the last cell"
    ]
   ],
   "tip": "If a question looks new, write these five lines and the table fills itself.",
   "n": "Step seven: Every dynamic programming solution follows one recipe. One: define the state, exactly what each table cell means. Two: write the recurrence that builds a cell from smaller cells. Three: fix the base cases. Four: choose a fill order so dependencies are ready. Five: say where the answer sits. State these five and you can fill any table."
  },
  {
   "sec": "LCS",
   "title": "Subsequence is not substring",
   "cmd": [
    "X = ABCBD",
    "ABD   subsequence, not a substring",
    "BCB   substring (positions 2 to 4)",
    "CBA   not a subsequence (order wrong)",
    "# n letters: 2^n subsets of positions",
    "# n = 5  ->  32"
   ],
   "term": "definitions",
   "tip": "Subsequence keeps order and may skip. Substring must be contiguous.",
   "n": "Step eight: Now the first classic: the longest common subsequence, called LCS. A subsequence keeps the order of letters but may skip some. Take X equal to A B C B D. A B D is a subsequence, because we skip the two middle letters. It is not a substring, because substrings must be contiguous. B C B is a substring, from positions two to four. C B A is not a subsequence at all, since the order is wrong. A string of length n has two to the n subsets of positions, so thirty two for n equal five."
  },
  {
   "sec": "LCS",
   "title": "The LCS recurrence",
   "cmd": [
    "L[i][j] = LCS of X[1..i] and Y[1..j]",
    "L[i][0] = L[0][j] = 0",
    "x_i = y_j :  L[i-1][j-1] + 1",
    "else      :  max(L[i-1][j], L[i][j-1])",
    "# answer is the bottom right cell"
   ],
   "term": "recurrence",
   "tip": "Match: diagonal plus one. Mismatch: best of up and left.",
   "n": "Step nine: Let L i j be the LCS length of the first i letters of X and the first j letters of Y. If either string is empty, the answer is zero. If the last letters x i and y j are equal, that letter belongs to an optimal answer, so L i j is the diagonal cell plus one. If they differ, one of the two letters is not used, so take the maximum of the cell above and the cell to the left."
  },
  {
   "sec": "LCS",
   "title": "Filling the LCS table by hand",
   "viz": {
    "kind": "grid",
    "corner": "X \\ Y",
    "rows": [
     "∅",
     "A",
     "B",
     "C",
     "B",
     "D"
    ],
    "hw": 170,
    "cols": [
     "∅",
     "B",
     "D",
     "C",
     "A",
     "B"
    ],
    "cw": 170,
    "fs": 44,
    "rh": 66,
    "box": [
     260,
     330,
     1400,
     470
    ],
    "cells": [
     [
      "0",
      "0",
      "0",
      "0",
      "0",
      "0"
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      ""
     ]
    ],
    "steps": [
     {
      "k": "row one",
      "set": {
       "1,1": "0",
       "1,2": "0",
       "1,3": "0",
       "1,4": "1",
       "1,5": "1"
      },
      "hl": [
       "r1"
      ],
      "col": "blue",
      "clear": true,
      "note": "row 1: letter A"
     },
     {
      "k": "row two",
      "set": {
       "2,1": "1",
       "2,2": "1",
       "2,3": "1",
       "2,4": "1",
       "2,5": "2"
      },
      "hl": [
       "r2"
      ],
      "col": "pink",
      "clear": true,
      "note": "row 2: letter B"
     },
     {
      "k": "row three",
      "set": {
       "3,1": "1",
       "3,2": "1",
       "3,3": "2",
       "3,4": "2",
       "3,5": "2"
      },
      "hl": [
       "r3"
      ],
      "col": "blue",
      "clear": true,
      "note": "row 3: letter C"
     },
     {
      "k": "row four",
      "set": {
       "4,1": "1",
       "4,2": "1",
       "4,3": "2",
       "4,4": "2",
       "4,5": "3"
      },
      "hl": [
       "r4"
      ],
      "col": "pink",
      "clear": true,
      "note": "row 4: letter B"
     },
     {
      "k": "row five",
      "set": {
       "5,1": "1",
       "5,2": "2",
       "5,3": "2",
       "5,4": "2",
       "5,5": "3"
      },
      "hl": [
       "r5"
      ],
      "col": "blue",
      "clear": true,
      "note": "row 5: letter D"
     },
     {
      "k": "answer",
      "clear": true,
      "hl": [
       "5,5"
      ],
      "col": "ok",
      "note": "L[5][5] = 3"
     }
    ],
    "tint": {
     "0": "muted"
    }
   },
   "tip": "Match: diagonal plus one. Otherwise copy the larger of up and left.",
   "n": "Step ten: Let us fill the table for X equal A B C B D and Y equal B D C A B. Row one, letter A. A matches only in column four, giving one, and the last cell copies it. Row two, letter B. B matches the first and last letters of Y, so the row reads one, one, one, one, two. Row three, letter C. C matches in column three, giving two, and the row stays at two. Row four, letter B. It gives one at the first B, and three at the last B. Row five, letter D. D matches in column two, so the row reads one, two, two, two, three. The answer, the bottom right cell, is three."
  },
  {
   "sec": "LCS",
   "title": "Tracing back the actual subsequence",
   "viz": {
    "kind": "grid",
    "corner": "X \\ Y",
    "rows": [
     "∅",
     "A",
     "B",
     "C",
     "B",
     "D"
    ],
    "hw": 170,
    "cols": [
     "∅",
     "B",
     "D",
     "C",
     "A",
     "B"
    ],
    "cw": 170,
    "fs": 44,
    "rh": 66,
    "box": [
     260,
     330,
     1400,
     470
    ],
    "cells": [
     [
      "0",
      "0",
      "0",
      "0",
      "0",
      "0"
     ],
     [
      "0",
      "0",
      "0",
      "0",
      "1",
      "1"
     ],
     [
      "0",
      "1",
      "1",
      "1",
      "1",
      "2"
     ],
     [
      "0",
      "1",
      "1",
      "2",
      "2",
      "2"
     ],
     [
      "0",
      "1",
      "1",
      "2",
      "2",
      "3"
     ],
     [
      "0",
      "1",
      "2",
      "2",
      "2",
      "3"
     ]
    ],
    "steps": [
     {
      "k": "corner",
      "hl": [
       "5,5"
      ],
      "col": "blue",
      "note": "start at the bottom right: 3"
     },
     {
      "k": "up",
      "hl": [
       "4,5"
      ],
      "col": "warn",
      "note": "D differs from B: move up"
     },
     {
      "k": "diagonal",
      "hl": [
       "3,4"
      ],
      "col": "ok",
      "note": "B = B: take B, move diagonally"
     },
     {
      "k": "left",
      "hl": [
       "3,3"
      ],
      "col": "warn",
      "note": "C differs from A: left is larger"
     },
     {
      "k": "diagonal",
      "hl": [
       "2,2"
      ],
      "col": "ok",
      "note": "C = C: take C, move diagonally"
     },
     {
      "k": "left",
      "hl": [
       "2,1"
      ],
      "col": "warn",
      "note": "B differs from D: left is larger"
     },
     {
      "k": "diagonal",
      "hl": [
       "1,0"
      ],
      "col": "ok",
      "note": "B = B: take B. LCS = B C B"
     }
    ]
   },
   "tip": "Diagonal moves are the matches. Reverse the recorded letters to read the LCS.",
   "n": "Step eleven: The table gives the length, but the traceback gives the string. Start at the bottom right corner, value three. The letters D and B differ, and up is not smaller than left, so move up. Now B equals B, a match: record B, and move diagonally. At the next cell, C and A differ, and left is larger, so move left. C equals C: record C, move diagonally. B and D differ, so move left. Finally B equals B: record B and move diagonally. Reading the recorded letters backwards, the answer is B C B."
  },
  {
   "sec": "LCS",
   "title": "Cost of LCS",
   "cols": [
    "Quantity",
    "Value"
   ],
   "firstW": 420,
   "rows": [
    [
     "Table size",
     "(m+1)(n+1)"
    ],
    [
     "Time",
     "O(mn)"
    ],
    [
     "Space, full table",
     "O(mn)"
    ],
    [
     "Space, length only",
     "O(min(m, n))"
    ],
    [
     "Naive recursion",
     "Exponential"
    ]
   ],
   "tip": "Keeping two rows gives the length, but you cannot trace back the string.",
   "n": "Step twelve: Now the cost. The table has m plus one times n plus one cells, each filled in constant time, so time is order m n and space is order m n. If only the length is needed, row i depends only on row i minus one, so two rows suffice, and space drops to order of the smaller length. But then the traceback is lost. The naive recursion, in contrast, is exponential."
  },
  {
   "sec": "LCS",
   "title": "How bad is the naive recursion?",
   "cmd": [
    "# no common letter, worst case",
    "T(m,n) = 1 + T(m-1,n) + T(m,n-1)",
    "m = n = 2  ->  11 calls",
    "m = n = 3  ->  39 calls",
    "m = n = 4  ->  139 calls",
    "# = 2 * C(m+n, m) - 1",
    "# table for 4, 4: 25 states"
   ],
   "term": "recursion count",
   "tip": "Calls grow like a binomial coefficient: exponential in m + n.",
   "n": "Step thirteen: Here is a GATE favourite. Suppose the two strings have no common letter, the worst case for the recursion. Then every call makes two more calls: T of m n is one plus T of m minus one n plus T of m n minus one. For m equal n equal two that is eleven calls. For three and three, thirty nine. For four and four, one hundred thirty nine calls, which equals two times the binomial coefficient of eight choose four, minus one. With the table, the same input has only twenty five states."
  },
  {
   "sec": "LCS",
   "title": "Practice: LCS answers",
   "cmd": [
    "AGGTAB, GXTXAYB  ->  4  (GTAB)",
    "ABCDGH, AEDFHR  ->  3  (ADH)",
    "ABCDEF, FBDAMN  ->  2  (BD)",
    "# LCS <= min(m, n)",
    "# X = Y: LCS = n.  No match: 0",
    "# LCS(X, reverse X) = longest palindrome"
   ],
   "term": "practice 1",
   "tip": "Always check bounds first: they can eliminate options in a multiple choice question.",
   "n": "Step fourteen: Practice time. A G G T A B against G X T X A Y B: the LCS is G T A B, length four. A B C D G H against A E D F H R: A D H, length three. A B C D E F against F B D A M N: only B D, length two. Remember the bounds: the LCS is at most the smaller length. If X equals Y it is n, and with no common letter it is zero. And the LCS of a string with its reverse is its longest palindromic subsequence."
  },
  {
   "sec": "Knapsack",
   "title": "The zero one knapsack problem",
   "items": [
    [
     "box",
     "n items",
     "weight w_i and value v_i each"
    ],
    [
     "lock",
     "Capacity W",
     "total weight must not exceed W"
    ],
    [
     "scale",
     "Take whole or leave",
     "no splitting, no repeats"
    ],
    [
     "dollar",
     "Maximise value",
     "the best total that fits"
    ]
   ],
   "tip": "Zero one: each item at most once, and never in pieces.",
   "n": "Step fifteen: Second classic: the zero one knapsack. We have n items, each with a weight and a value, and a bag of capacity W. Each item is taken whole, or not at all. We want the maximum total value that fits. The state is K i c: the best value using the first i items and capacity c. Zero one means no splitting and no repeats. That single restriction is what breaks the greedy method."
  },
  {
   "sec": "Knapsack",
   "title": "Greedy fails on zero one",
   "cols": [
    "Method",
    "Items taken",
    "Value"
   ],
   "firstW": 260,
   "rows": [
    [
     "Greedy by ratio",
     "10 and 20",
     "160"
    ],
    [
     "Best zero one",
     "20 and 30",
     "220"
    ],
    [
     "Fractional",
     "10, 20, 2/3 of 30",
     "240"
    ]
   ],
   "tip": "Fractional knapsack: greedy works. Zero one knapsack: greedy fails, use DP.",
   "n": "Step sixteen: Take three items with weights ten, twenty and thirty, and values sixty, one hundred and one hundred twenty, capacity fifty. The ratios are six, five and four. Greedy by ratio takes the first two items, total one hundred sixty, and the third no longer fits. The true best is items two and three, weight fifty, value two hundred twenty. If splitting were allowed, the fractional knapsack would take two thirds of the third item and reach two hundred forty."
  },
  {
   "sec": "Knapsack",
   "title": "The knapsack recurrence",
   "cmd": [
    "K[i][c] = best value, items 1..i, cap c",
    "K[0][c] = K[i][0] = 0",
    "w_i > c :  K[i-1][c]",
    "else    :  max( K[i-1][c],",
    "                K[i-1][c-w_i] + v_i )",
    "# answer is K[n][W]"
   ],
   "term": "recurrence",
   "tip": "Taking item i jumps back w_i columns in the previous row.",
   "n": "Step seventeen: The recurrence considers the last item i only. If its weight exceeds the capacity c, we cannot take it, so K i c equals K i minus one c. Otherwise we choose the better of two options: skip the item, giving K i minus one c, or take it, giving the value v i plus K i minus one at capacity c minus w i. The first row and column are zero. The answer is K n W."
  },
  {
   "sec": "Knapsack",
   "title": "Filling the knapsack table",
   "viz": {
    "kind": "grid",
    "corner": "item",
    "rows": [
     "none",
     "w1 v1",
     "w3 v4",
     "w4 v5",
     "w5 v7"
    ],
    "hw": 230,
    "cols": [
     "0",
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7"
    ],
    "cw": 160,
    "fs": 44,
    "rh": 72,
    "box": [
     200,
     330,
     1520,
     450
    ],
    "cells": [
     [
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0"
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ],
     [
      "0",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
     ]
    ],
    "steps": [
     {
      "k": "item one",
      "set": {
       "1,1": "1",
       "1,2": "1",
       "1,3": "1",
       "1,4": "1",
       "1,5": "1",
       "1,6": "1",
       "1,7": "1"
      },
      "hl": [
       "r1"
      ],
      "clear": true,
      "col": "blue",
      "note": "item 1: weight 1, value 1"
     },
     {
      "k": "item two",
      "set": {
       "2,1": "1",
       "2,2": "1",
       "2,3": "4",
       "2,4": "5",
       "2,5": "5",
       "2,6": "5",
       "2,7": "5"
      },
      "hl": [
       "r2"
      ],
      "clear": true,
      "col": "pink",
      "note": "item 2: weight 3, value 4"
     },
     {
      "k": "item three",
      "set": {
       "3,1": "1",
       "3,2": "1",
       "3,3": "4",
       "3,4": "5",
       "3,5": "6",
       "3,6": "6",
       "3,7": "9"
      },
      "hl": [
       "r3"
      ],
      "clear": true,
      "col": "blue",
      "note": "item 3: weight 4, value 5"
     },
     {
      "k": "item four",
      "set": {
       "4,1": "1",
       "4,2": "1",
       "4,3": "4",
       "4,4": "5",
       "4,5": "7",
       "4,6": "8",
       "4,7": "9"
      },
      "hl": [
       "r4"
      ],
      "clear": true,
      "col": "pink",
      "note": "item 4: weight 5, value 7"
     },
     {
      "k": "answer",
      "clear": true,
      "hl": [
       "4,7"
      ],
      "col": "ok",
      "note": "K[4][7] = 9"
     }
    ]
   },
   "tip": "Row i uses only row i minus one. Capacity is the column index.",
   "n": "Step eighteen: Items: weight one value one, weight three value four, weight four value five, weight five value seven. Capacity seven. Item one fits everywhere, so its row is all ones. Item two has weight three. From capacity three, it gives four, then at capacity four, four plus the one above makes five. The row reads one, one, four, five, five, five, five. Item three has weight four. It lifts capacity five to six, using one plus five, and capacity seven to nine, using four plus five. Item four has weight five. It lifts capacity five to seven, and capacity six to eight. The answer, at capacity seven, is nine."
  },
  {
   "sec": "Knapsack",
   "title": "Which items were taken?",
   "viz": {
    "kind": "grid",
    "corner": "item",
    "rows": [
     "none",
     "w1 v1",
     "w3 v4",
     "w4 v5",
     "w5 v7"
    ],
    "hw": 230,
    "cols": [
     "0",
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7"
    ],
    "cw": 160,
    "fs": 44,
    "rh": 72,
    "box": [
     200,
     330,
     1520,
     450
    ],
    "cells": [
     [
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0"
     ],
     [
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1"
     ],
     [
      "0",
      "1",
      "1",
      "4",
      "5",
      "5",
      "5",
      "5"
     ],
     [
      "0",
      "1",
      "1",
      "4",
      "5",
      "6",
      "6",
      "9"
     ],
     [
      "0",
      "1",
      "1",
      "4",
      "5",
      "7",
      "8",
      "9"
     ]
    ],
    "steps": [
     {
      "k": "item four",
      "hl": [
       "4,7"
      ],
      "col": "blue",
      "note": "K[4][7] = 9 = K[3][7]: skip item 4"
     },
     {
      "k": "take",
      "hl": [
       "3,7"
      ],
      "col": "ok",
      "note": "K[3][7] = 9 differs from K[2][7] = 5: take item 3"
     },
     {
      "k": "capacity three",
      "hl": [
       "2,3"
      ],
      "col": "ok",
      "note": "capacity 7 - 4 = 3: K[2][3] = 4 differs from K[1][3] = 1"
     },
     {
      "k": "total",
      "hl": [
       "0,0"
      ],
      "col": "pink",
      "note": "items 2 and 3: weight 7, value 9"
     }
    ]
   },
   "tip": "If K[i][c] equals K[i-1][c], skip item i. Otherwise take it and subtract its weight.",
   "n": "Step nineteen: To recover the items, walk back from the bottom right. At item four, the value nine equals the value above, so item four was skipped. At item three, nine differs from the five above, so item three was taken, and the capacity drops from seven to three. At capacity three on row two, the value four differs from the one above, so item two was taken, and capacity drops to zero. The total is items two and three, weight seven, value nine."
  },
  {
   "sec": "Knapsack",
   "title": "Pseudo polynomial time",
   "cmd": [
    "time O(nW)   -- W is a number",
    "size of W = log2(W) bits",
    "W = 2^k  ->  2^k + 1 columns",
    "k = 10  ->  1025 columns",
    "k = 20  ->  1048577 columns",
    "# pseudo-polynomial; NP-complete"
   ],
   "term": "the catch",
   "tip": "Polynomial in the value of W, exponential in its bit length.",
   "n": "Step twenty: The cost of the knapsack is order n times W. That looks polynomial, but it is not. The input stores W in binary, using only log W bits. A capacity of two to the ten needs only eleven bits, yet the table has one thousand twenty five columns. Two to the twenty gives one million forty eight thousand five hundred seventy seven columns. So the running time is exponential in the input size. We call it pseudo polynomial, and the decision version of knapsack is NP complete."
  },
  {
   "sec": "Knapsack",
   "title": "Space saving and the loop direction",
   "viz": {
    "kind": "array",
    "cells": [
     "0",
     "0",
     "0",
     "0",
     "0",
     "0"
    ],
    "label": "d[0..5]",
    "cw": 200,
    "idx": true,
    "fs": 56,
    "steps": [
     {
      "k": "downward",
      "set": {
       "2": "3",
       "3": "3",
       "4": "3",
       "5": "3"
      },
      "ok": [
       2,
       3,
       4,
       5
      ],
      "col": "ok",
      "note": "high to low: each capacity holds 3, item used once"
     },
     {
      "k": "upward",
      "set": {
       "4": "6",
       "5": "6"
      },
      "hl": [
       4,
       5
      ],
      "col": "bad",
      "note": "low to high: capacity 4 and 5 become 6, item used twice"
     }
    ]
   },
   "tip": "One-dimensional zero one knapsack: capacity loop runs downward.",
   "n": "Step twenty one: We can shrink the table to one row, d of c, if we update capacities from high to low. Take one item of weight two and value three, capacity five. Looping downward, d of five uses the old d of three, so each capacity gets three. Looping upward is the trap: by the time we reach capacity four, d of two has already been updated, so the item is used twice, giving six. Downward is zero one. Upward is the unbounded knapsack, where items repeat."
  },
  {
   "sec": "Knapsack",
   "title": "Practice: knapsack answers",
   "cmd": [
    "n = 100, W = 1000: 101 x 1001 table",
    "  = 101101 entries, 100000 steps",
    "w 10 20 30, v 60 100 120, W 50 -> 220",
    "subset sum: v_i = w_i, is best = W ?",
    "fractional: greedy by ratio, O(n log n)",
    "unbounded: capacity loop upward"
   ],
   "term": "practice 2",
   "tip": "The table has n+1 rows and W+1 columns, not n and W.",
   "n": "Step twenty two: Practice. With a hundred items and capacity one thousand, the table has one hundred one times one thousand one, that is one hundred one thousand one hundred one entries, and the loops take one hundred thousand steps. The ten twenty thirty example gives two hundred twenty. Subset sum is knapsack where value equals weight: ask whether the best equals the target. Fractional knapsack is solved by greedy sorting in n log n. And the unbounded version loops capacities upward."
  },
  {
   "sec": "Matrix chain",
   "title": "Order changes the cost",
   "cmd": [
    "A 10x100   B 100x5   C 5x50",
    "p x q times q x r costs p*q*r",
    "(AB)C: 5000 + 2500   =  7500",
    "A(BC): 25000 + 50000 = 75000",
    "# same product, ten times the work"
   ],
   "term": "the cost",
   "tip": "The problem asks only for the cheapest bracketing, not the product itself.",
   "n": "Step twenty three: Third classic: matrix chain multiplication. Multiplying a p by q matrix with a q by r matrix costs p times q times r scalar multiplications. Matrix multiplication is associative, so any bracketing gives the same result, but not the same cost. Take A ten by one hundred, B one hundred by five, C five by fifty. A B first, then C, costs five thousand plus twenty five hundred, seventy five hundred. B C first costs twenty five thousand plus fifty thousand, seventy five thousand. Ten times more."
  },
  {
   "sec": "Matrix chain",
   "title": "How many bracketings exist?",
   "cols": [
    "Matrices",
    "Bracketings"
   ],
   "firstW": 330,
   "rows": [
    [
     "3",
     "2"
    ],
    [
     "4",
     "5"
    ],
    [
     "5",
     "14"
    ],
    [
     "10",
     "4862"
    ]
   ],
   "tip": "n matrices give the Catalan number C(n-1). Four matrices: five ways.",
   "n": "Step twenty four: How many ways are there to bracket a chain of n matrices? The count is the Catalan number C of n minus one, which is one over n times the binomial of two n minus two choose n minus one. Three matrices have two bracketings. Four have five. Five have fourteen. Ten matrices already have four thousand, eight hundred sixty two. Trying them all is exponential, which is why we need dynamic programming."
  },
  {
   "sec": "Matrix chain",
   "title": "The matrix chain recurrence",
   "cmd": [
    "A_i is  p[i-1] x p[i]",
    "m[i][i] = 0",
    "m[i][j] = min over i <= k < j of",
    "   m[i][k] + m[k+1][j]",
    "        + p[i-1] * p[k] * p[j]",
    "# answer m[1][n]; fill by chain length"
   ],
   "term": "recurrence",
   "tip": "The last multiplication joins a p(i-1) by p(k) matrix with a p(k) by p(j) matrix.",
   "n": "Step twenty five: Let the dimensions be p zero to p n, so matrix A i is p i minus one by p i. Let m i j be the cheapest cost of multiplying A i through A j. A single matrix costs zero. For a longer chain, try every split point k from i to j minus one. The cost is m i k plus m k plus one j, plus the final multiplication cost p i minus one times p k times p j. Take the minimum. The answer is m one n."
  },
  {
   "sec": "Matrix chain",
   "title": "Filling the matrix chain table",
   "viz": {
    "kind": "grid",
    "corner": "i \\ j",
    "rows": [
     "A1 40x20",
     "A2 20x30",
     "A3 30x10",
     "A4 10x30"
    ],
    "hw": 300,
    "cols": [
     "j = 1",
     "j = 2",
     "j = 3",
     "j = 4"
    ],
    "cw": 330,
    "fs": 46,
    "rh": 80,
    "box": [
     160,
     330,
     1500,
     440
    ],
    "cells": [
     [
      "0",
      "",
      "",
      ""
     ],
     [
      "",
      "0",
      "",
      ""
     ],
     [
      "",
      "",
      "0",
      ""
     ],
     [
      "",
      "",
      "",
      "0"
     ]
    ],
    "steps": [
     {
      "k": "diagonal",
      "hl": [
       "0,0",
       "1,1",
       "2,2",
       "3,3"
      ],
      "col": "blue",
      "note": "chains of one matrix cost 0"
     },
     {
      "k": "length two",
      "clear": true,
      "set": {
       "0,1": "24000",
       "1,2": "6000",
       "2,3": "9000"
      },
      "hl": [
       "0,1",
       "1,2",
       "2,3"
      ],
      "col": "pink",
      "note": "40·20·30, 20·30·10, 30·10·30"
     },
     {
      "k": "length three",
      "clear": true,
      "set": {
       "0,2": "14000",
       "1,3": "12000"
      },
      "hl": [
       "0,2",
       "1,3"
      ],
      "col": "warn",
      "note": "m[1][3] = 14000, m[2][4] = 12000"
     },
     {
      "k": "length four",
      "clear": true,
      "set": {
       "0,3": "26000"
      },
      "hl": [
       "0,3"
      ],
      "col": "ok",
      "note": "m[1][4] = 26000 with split k = 3"
     }
    ]
   },
   "tip": "Only the upper triangle is used: i is at most j. Fill diagonal by diagonal.",
   "n": "Step twenty six: Dimensions: forty, twenty, thirty, ten, thirty. Four matrices. The diagonal is zero. Now chains of length two have one split each: A one A two costs forty times twenty times thirty, twenty four thousand. A two A three costs twenty times thirty times ten, six thousand. A three A four costs thirty times ten times thirty, nine thousand. Chains of length three: m one three tries two splits and the best is fourteen thousand. m two four has best twelve thousand. Finally, length four: three splits give thirty six thousand, sixty nine thousand, and twenty six thousand. The minimum is twenty six thousand."
  },
  {
   "sec": "Matrix chain",
   "title": "Reading off the bracketing",
   "cmd": [
    "best split k:  s[1][4]=3,  s[1][3]=1",
    "((A1 (A2 A3)) A4)",
    "A2*A3 : 20*30*10 =  6000",
    "A1*(A2A3) : 40*20*10 =  8000",
    "(...)*A4 : 40*10*30 = 12000",
    "total = 26000"
   ],
   "term": "bracketing",
   "tip": "Store the split point k in a second table to rebuild the bracketing.",
   "n": "Step twenty seven: The second table remembers the best split. For m one four, the best k is three, so we split into A one to A three, and A four. For A one to A three the best k is one, so A one stands alone, times A two A three. The bracketing is A one times A two A three, all times A four, which is open bracket, open bracket A one, open bracket A two A three, close, close, A four, close. Costs: six thousand, plus eight thousand, plus twelve thousand, total twenty six thousand."
  },
  {
   "sec": "Matrix chain",
   "title": "Cost of matrix chain",
   "cols": [
    "Quantity",
    "Value"
   ],
   "firstW": 420,
   "rows": [
    [
     "Cells with i ≤ j",
     "n(n+1)/2"
    ],
    [
     "Cells with work",
     "n(n−1)/2"
    ],
    [
     "Splits per cell",
     "at most n − 1"
    ],
    [
     "Exact inner loop runs",
     "(n³ − n)/6"
    ],
    [
     "Time, space",
     "O(n³), O(n²)"
    ]
   ],
   "tip": "For n = 4: 10 cells, 6 with work, 10 inner iterations.",
   "n": "Step twenty eight: The cost analysis is a classic. There are n times n plus one over two cells with i at most j, and n times n minus one over two with real work. Each does up to n minus one splits, each in constant time. So time is order n cubed and space is order n squared. Exactly, the inner loop runs n cubed minus n over six times: ten for four matrices, and one hundred sixty five."
  },
  {
   "sec": "Matrix chain",
   "title": "Practice: matrix chain answers",
   "cmd": [
    "p = 10 100 5 50           ->  7500",
    "p = 30 35 15 5 10 20 25  ->  15125",
    "# n matrices need n+1 dimensions",
    "# 4 matrices: 5 bracketings",
    "# n = 10: 55 cells, 45 need work",
    "# time O(n^3), space O(n^2)"
   ],
   "term": "practice 3",
   "tip": "A mistake to avoid: p has one more entry than the number of matrices.",
   "n": "Step twenty nine: Practice. Dimensions ten, one hundred, five, fifty give seventy five hundred. The famous six matrix chain, thirty, thirty five, fifteen, five, ten, twenty, twenty five, costs fifteen thousand, one hundred twenty five. Watch the indexing: n matrices need n plus one dimensions. Four matrices have five bracketings. A table for ten matrices has fifty five cells with i at most j, forty five of them needing work."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "All pairs shortest paths",
   "viz": {
    "kind": "graph",
    "dir": true,
    "r": 48,
    "fs": 40,
    "box": [
     260,
     330,
     1300,
     420
    ],
    "nodes": [
     [
      "1",
      12,
      14
     ],
     [
      "2",
      88,
      14
     ],
     [
      "3",
      88,
      86
     ],
     [
      "4",
      12,
      86
     ]
    ],
    "edges": [
     [
      "1",
      "2",
      3,
      40
     ],
     [
      "2",
      "1",
      8,
      40
     ],
     [
      "2",
      "3",
      2
     ],
     [
      "3",
      "1",
      5
     ],
     [
      "3",
      "4",
      1
     ],
     [
      "1",
      "4",
      7,
      40
     ],
     [
      "4",
      "1",
      2,
      40
     ]
    ],
    "steps": [
     {
      "k": "edge",
      "hl": [
       "1-2",
       "2-1",
       "2-3",
       "3-1",
       "3-4",
       "1-4",
       "4-1"
      ],
      "col": "blue",
      "note": "7 weighted directed edges"
     },
     {
      "k": "path",
      "clear": true,
      "hl": [
       "4",
       "1",
       "2",
       "3",
       "4-1",
       "1-2",
       "2-3"
      ],
      "col": "ok",
      "note": "4 → 1 → 2 → 3 costs 2 + 3 + 2 = 7"
     }
    ]
   },
   "tip": "Floyd-Warshall handles negative edges but no negative cycles.",
   "n": "Step thirty: Fourth classic: Floyd Warshall, which finds the shortest distance between every pair of vertices of a weighted directed graph. Here is our example with four vertices. Edge one to two has weight three, one to four seven, two to one eight, two to three two, three to one five, three to four one, and four to one two. Consider the shortest path from four to three. It goes four, one, two, three, with cost two plus three plus two, seven."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "The Floyd Warshall recurrence",
   "cmd": [
    "D_k[i][j] = shortest i to j, using",
    "only vertices 1..k as intermediates",
    "D_k[i][j] = min( D_k-1[i][j],",
    "     D_k-1[i][k] + D_k-1[k][j] )",
    "D_0 = weight matrix, 0 on diagonal"
   ],
   "term": "recurrence",
   "tip": "Either skip vertex k, or go i to k and then k to j.",
   "n": "Step thirty one: The idea is to allow intermediate vertices one at a time. Let D k i j be the shortest distance from i to j using only vertices one to k as intermediates. For k equal zero, it is just the edge weight matrix, with zero on the diagonal and infinity for missing edges. To go from k minus one to k, either the best path avoids vertex k, or it passes through k exactly once, as the best path from i to k followed by the best path from k to j. Take the minimum."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "Three loops: k must be outermost",
   "cmd": [
    "for k in 1..V:",
    "  for i in 1..V:",
    "    for j in 1..V:",
    "      D[i][j] = min(D[i][j],",
    "                    D[i][k] + D[k][j])",
    "# k is the OUTERMOST loop"
   ],
   "term": "the algorithm",
   "tip": "Whole matrix updated per k. Total V³ updates.",
   "n": "Step thirty two: The code is three nested loops. The outermost loop must be k, the intermediate vertex. The two inner loops over i and j can be in either order. Each round updates the whole matrix. Time is order V cubed, always, whatever the number of edges. Space is order V squared, because the update can be done in place."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "Running Floyd Warshall",
   "viz": {
    "kind": "grid",
    "corner": "from \\ to",
    "rows": [
     "1",
     "2",
     "3",
     "4"
    ],
    "hw": 170,
    "cols": [
     "1",
     "2",
     "3",
     "4"
    ],
    "cw": 300,
    "fs": 54,
    "rh": 76,
    "box": [
     360,
     330,
     1100,
     440
    ],
    "cells": [
     [
      "0",
      "3",
      "∞",
      "7"
     ],
     [
      "8",
      "0",
      "2",
      "∞"
     ],
     [
      "5",
      "∞",
      "0",
      "1"
     ],
     [
      "2",
      "∞",
      "∞",
      "0"
     ]
    ],
    "steps": [
     {
      "k": "start",
      "hl": [
       "r0",
       "r1",
       "r2",
       "r3"
      ],
      "col": "blue",
      "note": "D0: edge weights, infinity where no edge"
     },
     {
      "k": "vertex one",
      "clear": true,
      "set": {
       "1,3": "15",
       "2,1": "8",
       "3,1": "5"
      },
      "hl": [
       "1,3",
       "2,1",
       "3,1",
       "c0"
      ],
      "col": "pink",
      "note": "k = 1: 3 entries improve"
     },
     {
      "k": "vertex two",
      "clear": true,
      "set": {
       "0,2": "5",
       "3,2": "7"
      },
      "hl": [
       "0,2",
       "3,2",
       "c1"
      ],
      "col": "warn",
      "note": "k = 2: 2 entries improve"
     },
     {
      "k": "vertex three",
      "clear": true,
      "set": {
       "0,3": "6",
       "1,0": "7",
       "1,3": "3"
      },
      "hl": [
       "0,3",
       "1,0",
       "1,3",
       "c2"
      ],
      "col": "blue",
      "note": "k = 3: 3 entries improve"
     },
     {
      "k": "vertex four",
      "clear": true,
      "set": {
       "1,0": "5",
       "2,0": "3",
       "2,1": "6"
      },
      "hl": [
       "1,0",
       "2,0",
       "2,1",
       "c3"
      ],
      "col": "ok",
      "note": "k = 4: 3 entries improve"
     }
    ],
    "tint": {
     "∞": "muted"
    }
   },
   "tip": "Row k and column k never change in round k, so in-place updating is safe.",
   "n": "Step thirty three: Now we run it. The start matrix is the edge weights. With vertex one as intermediate, three entries improve: two to four becomes eight plus seven, fifteen. Three to two becomes eight, and four to two becomes five. With vertex two, one to three becomes five, and four to three becomes seven. With vertex three, one to four becomes six, two to one becomes seven, and two to four drops from fifteen to three. With vertex four, two to one improves to five, three to one becomes three, and three to two becomes six."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "The loop order trap",
   "cmd": [
    "# graph above, entry D[2][1]",
    "k outermost (right):    D[2][1] = 5",
    "k innermost (wrong):    D[2][1] = 7",
    "# right path: 2 -> 3 -> 4 -> 1",
    "#   2 + 1 + 2 = 5",
    "# wrong order finds only 2 -> 3 -> 1 = 7"
   ],
   "term": "loop order",
   "tip": "If an answer option shows k innermost, the algorithm is incorrect.",
   "n": "Step thirty four: A classic trap: moving k to the innermost loop. On our graph, the correct order gives D of two to one equal to five, by the path two, three, four, one. With k innermost, the answer is seven, which is wrong, because paths needing several intermediates are never combined. The outermost k guarantees that when vertex k is added, all paths through earlier vertices are already final."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "Negative edges and negative cycles",
   "cmd": [
    "negative edge, no negative cycle: fine",
    "negative cycle: some D[i][i] < 0",
    "1->2 (1), 2->1 (-3): D[1][1] = -2",
    "Dijkstra x V:     O(V E log V)",
    "Bellman-Ford x V: O(V^2 E)",
    "Floyd-Warshall:   O(V^3)"
   ],
   "term": "comparison",
   "tip": "Dense graph, E near V squared: Floyd-Warshall at V cubed is the simplest.",
   "n": "Step thirty five: Floyd Warshall allows negative edge weights, as long as there is no negative cycle. If a negative cycle exists, some diagonal entry D of i i becomes negative, and that is the detection test. For example, an edge from one to two of weight one and from two to one of weight minus three gives D of one one equal to minus two. Dijkstra fails with negative edges. Dijkstra run V times costs order V E log V, and Bellman Ford run V times, order V squared E."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "Transitive closure: Warshall",
   "cmd": [
    "replace  min -> OR,  + -> AND",
    "R[i][j] = R[i][j] OR",
    "          (R[i][k] AND R[k][j])",
    "chain 1->2->3->4: closure pairs i<j",
    "C(4,2) = 6 pairs, none backwards",
    "time still O(V^3)"
   ],
   "term": "closure",
   "tip": "Warshall is Floyd-Warshall on Boolean values.",
   "n": "Step thirty six: The same loops compute transitive closure, which asks only whether a path exists. Replace minimum by or, and plus by and. R i j becomes R i j or the and of R i k with R k j. Take the chain one to two to three to four. Its closure has one entries for every pair i less than j, which is six, choose of four two. Time is still order V cubed."
  },
  {
   "sec": "Floyd-Warshall",
   "title": "Practice: Floyd Warshall answers",
   "cmd": [
    "V = 100  ->  100^3 = 1000000 updates",
    "after round k: intermediates in 1..k",
    "D[i][i] < 0  <=>  negative cycle",
    "space O(V^2); path needs a next matrix",
    "# result: all 4 x 4 distances above",
    "# D[4][3] = 7,  D[2][1] = 5"
   ],
   "term": "practice 4",
   "tip": "Time is independent of the edge count.",
   "n": "Step thirty seven: Practice. A graph with a hundred vertices needs one hundred cubed, that is one million inner updates, whether it has few edges or many. After round k, D holds shortest paths using only vertices one to k as intermediates. The diagonal starts at zero and a negative entry there signals a negative cycle. The distance matrix needs only one V by V array, plus a next matrix if you want the paths themselves."
  },
  {
   "sec": "GATE practice",
   "title": "Typical GATE traps",
   "items": [
    [
     "warn",
     "LCS",
     "Not contiguous. Table is (m+1) × (n+1)"
    ],
    [
     "warn",
     "Knapsack",
     "Greedy fails. Time is pseudo-polynomial"
    ],
    [
     "warn",
     "Matrix chain",
     "n matrices, n+1 dimensions"
    ],
    [
     "warn",
     "Floyd-Warshall",
     "k must be the outermost loop"
    ],
    [
     "warn",
     "All DP",
     "State what a cell means before filling"
    ]
   ],
   "tip": "Most wrong answers come from indexing, not from the idea.",
   "n": "Step thirty eight: Let us collect the traps. In LCS, forgetting that subsequences are not contiguous. In the table, forgetting the extra zero row and column, so the table is m plus one by n plus one. In knapsack, using greedy by ratio on the zero one problem, and forgetting that the time is pseudo polynomial. In matrix chain, mixing up n matrices with n plus one dimensions. In Floyd Warshall, placing k in the wrong loop."
  },
  {
   "sec": "GATE practice",
   "title": "Five second shortcuts",
   "items": [
    [
     "zap",
     "Time",
     "states × work per state"
    ],
    [
     "zap",
     "LCS",
     "O(mn), at most min(m, n)"
    ],
    [
     "zap",
     "Knapsack",
     "O(nW), capacity loop downward"
    ],
    [
     "zap",
     "Matrix chain",
     "O(n³), Catalan(n−1) bracketings"
    ],
    [
     "zap",
     "Floyd-Warshall",
     "O(V³), k outermost"
    ]
   ],
   "tip": "Memorise this card: it answers most DP questions in seconds.",
   "n": "Step thirty nine: Here are shortcuts. The time of any dynamic program is states times work per state. LCS needs order m n, knapsack order n W, matrix chain order n cubed, Floyd Warshall order V cubed. LCS never exceeds the smaller length. Four matrices have five bracketings. And in the zero one knapsack, loop capacity downward when using one array."
  },
  {
   "type": "mistakes",
   "rows": [
    [
     "Treating subsequence as substring",
     "Letters keep order but may be skipped"
    ],
    [
     "Using greedy for zero one knapsack",
     "Greedy fails; use the table"
    ],
    [
     "Counting n matrices as n dimensions",
     "You need n + 1 dimensions p0 to pn"
    ],
    [
     "Putting k innermost in Floyd-Warshall",
     "k outermost, or answers are wrong"
    ]
   ],
   "n": "Four common mistakes. Treating a subsequence as a substring: letters keep their order but may be skipped. Using greedy for the zero one knapsack: it fails, so use the table. Counting n matrices as n dimensions: you need n plus one. And putting k in the innermost loop of Floyd Warshall: k must be outermost, or the answers are wrong."
  },
  {
   "type": "repos",
   "chip": "Practice",
   "title": "Practise with these",
   "repos": [
    [
     "GATE CSE previous papers",
     "Dynamic programming questions, 1990 to 2026",
     "",
     "book"
    ],
    [
     "gateoverflow.in",
     "Solved and discussed DP questions",
     "",
     "comment"
    ],
    [
     "NPTEL: Design and Analysis of Algorithms",
     "IIT lecture series on dynamic programming",
     "",
     "play"
    ],
    [
     "CLRS, Introduction to Algorithms",
     "Dynamic programming and all pairs chapters",
     "",
     "bookmark"
    ],
    [
     "Python lru_cache",
     "Memoise any recursion in one line",
     "",
     "code"
    ],
    [
     "../interactive/m1-discrete.html",
     "Your interactive discrete maths module",
     "",
     "lightbulb"
    ]
   ],
   "n": "Here is where to practise. GATE previous papers, especially the dynamic programming questions. GATE Overflow, for discussed solutions. The NPTEL algorithms course. The dynamic programming and all pairs chapters of Cormen. Python lru cache, to memoise any recursion and check your answers. And your interactive module in this repository. Screenshot this frame."
  },
  {
   "type": "recap",
   "points": [
    "Time = states × work per state; each subproblem is solved once",
    "LCS: match gives diagonal plus 1, else max(up, left); O(mn)",
    "0/1 knapsack: skip or take; O(nW) is pseudo-polynomial",
    "Matrix chain: minimum over splits k; O(n³); Catalan(n−1) bracketings",
    "Floyd-Warshall: k outermost, O(V³), negative diagonal means negative cycle"
   ],
   "n": "Let us recap. Dynamic programming solves each subproblem once, and time is states times work per state. LCS: a match takes the diagonal plus one, otherwise the larger of up and left, in order m n. The zero one knapsack: skip or take, order n W, which is pseudo polynomial. Matrix chain: minimum over split points, order n cubed, with a Catalan number of bracketings. Floyd Warshall: k outermost, order V cubed, and a negative diagonal entry means a negative cycle. Follow for more, and comment DYNAMIC if this helped."
  }
 ]
};
