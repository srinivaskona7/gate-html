# Engineering Mathematics for GATE 2027 — Part 2
## Linear Algebra & Calculus

*Companion to Part 1 (Discrete Mathematics). Same contract: nothing assumed, every symbol defined, every number machine-verified.*

---

# MODULE 2 — LINEAR ALGEBRA

Linear algebra is the study of **linear transformations** — operations that stretch, rotate, project and shear space without bending straight lines. A matrix is simply a table of numbers that *encodes* such a transformation. Holding that sentence in mind converts most of this module from memorisation into geometry.

## 2.0 Module glossary

| Symbol | Meaning |
|---|---|
| $A_{m\times n}$ | Matrix with $m$ rows, $n$ columns |
| $a_{ij}$ | Entry in row $i$, column $j$ |
| $A^T$ | Transpose: rows and columns swapped, $(A^T)_{ij}=a_{ji}$ |
| $I_n$ | Identity matrix: 1s on the diagonal, 0s elsewhere |
| $\det(A)$ or $|A|$ | Determinant (a single number) |
| $A^{-1}$ | Inverse: the matrix with $AA^{-1}=I$ |
| $\operatorname{tr}(A)$ | Trace: sum of diagonal entries |
| $\rho(A)$ | Rank: number of independent rows (= independent columns) |
| $\lambda$ | Eigenvalue ("lambda") |
| $\mathbf v$ | Eigenvector (bold = column vector) |
| $M_{ij}$ | Minor: determinant after deleting row $i$, column $j$ |
| $C_{ij}$ | Cofactor $=(-1)^{i+j}M_{ij}$ |
| $\operatorname{adj}(A)$ | Adjugate: transpose of the cofactor matrix |

---

## 2.1 Matrices

### 2.1.1 What a matrix *is*

A **matrix** is a rectangular array of numbers with $m$ rows and $n$ columns; its **order** is $m\times n$. Three equally valid readings, all useful:

1. **A table of data** — the bookkeeping view.
2. **A system of linear equations** in compact form — the algebraic view.
3. **A function that transforms vectors** — the geometric view, and the one that explains everything else.

### 2.1.2 Operations

- **Addition / subtraction:** entrywise; requires identical orders.
- **Scalar multiplication:** multiply every entry.
- **Matrix multiplication:** $A_{m\times n}B_{n\times p}=C_{m\times p}$ where
$$c_{ij}=\sum_{k=1}^{n}a_{ik}b_{kj}$$
The *inner dimensions must match* and they vanish; the outer dimensions survive. Row $i$ of $A$ is dotted with column $j$ of $B$.

**Critical properties.** Multiplication is associative and distributive, but **not commutative**: $AB\ne BA$ in general. Also $AB=0$ does **not** imply $A=0$ or $B=0$. And $(AB)^T=B^TA^T$, $(AB)^{-1}=B^{-1}A^{-1}$ — order reverses in both.

### 2.1.3 Special matrices

| Name | Defining condition |
|---|---|
| Diagonal | $a_{ij}=0$ for $i\ne j$ |
| Upper / lower triangular | zeros below / above the diagonal |
| Symmetric | $A^T=A$ |
| Skew-symmetric | $A^T=-A$ (forces a zero diagonal) |
| Orthogonal | $A^TA=I$, so $A^{-1}=A^T$; $\det=\pm1$ |
| Idempotent | $A^2=A$ (a projection) |
| Nilpotent | $A^k=0$ for some $k$ |
| Involutory | $A^2=I$ |
| Singular | $\det(A)=0$ — no inverse exists |

Useful fact: every square matrix splits uniquely as $A=\underbrace{\tfrac12(A+A^T)}_{\text{symmetric}}+\underbrace{\tfrac12(A-A^T)}_{\text{skew-symmetric}}$.

### 2.1.4 Rank and linear independence

Vectors $v_1,\dots,v_k$ are **linearly independent** if the only scalars with $c_1v_1+\cdots+c_kv_k=\mathbf 0$ are all zero. If some non-trivial combination gives $\mathbf0$, they are **dependent** — one is redundant.

The **rank** $\rho(A)$ is the number of linearly independent rows — equivalently columns (row rank = column rank, always), equivalently the order of the largest non-zero minor.

**Computing rank:** row-reduce to echelon form and count non-zero rows. The three **elementary row operations** — swap two rows, scale a row by a non-zero constant, add a multiple of one row to another — never change the rank.

Facts: $\rho(A)\le\min(m,n)$; for square $A$, $\rho(A)=n \iff \det(A)\ne0$; $\rho(AB)\le\min(\rho(A),\rho(B))$.

---

## 2.2 Determinants

### 2.2.1 Definition and meaning

The **determinant** is a single scalar attached to a square matrix. Geometrically, $|\det(A)|$ is the **factor by which $A$ scales area (2D) or volume (3D)**, and its **sign records whether orientation was flipped**. So $\det(A)=0$ means the transformation **squashes space into a lower dimension** — information is destroyed and no inverse can recover it.

That one idea explains the whole equivalence chain:
$$\det(A)=0 \iff A \text{ singular} \iff \text{rows dependent} \iff \rho(A)<n \iff A\mathbf x=\mathbf 0 \text{ has non-trivial solutions}$$

**$2\times2$:** $\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc$.

**$3\times3$ by cofactor expansion along row 1:**
$$\det(A)=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13},\qquad C_{ij}=(-1)^{i+j}M_{ij}$$
Sign checkerboard: $\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}$. You may expand along **any** row or column — always choose the one with the most zeros.

### 2.2.2 Properties (these save enormous time)

1. $\det(A^T)=\det(A)$.
2. Swapping two rows **flips the sign**.
3. Scaling one row by $k$ scales $\det$ by $k$; hence $\det(kA)=k^n\det(A)$ for order $n$.
4. Adding a multiple of one row to another **leaves $\det$ unchanged** — the workhorse for simplification.
5. Two identical or proportional rows ⟹ $\det=0$. A zero row ⟹ $\det=0$.
6. Triangular or diagonal ⟹ $\det$ = product of diagonal entries.
7. $\det(AB)=\det(A)\det(B)$; $\det(A^{-1})=1/\det(A)$.
8. $\det(A)=\prod\lambda_i$ and $\operatorname{tr}(A)=\sum\lambda_i$.

### 2.2.3 Inverse

$$A^{-1}=\frac{1}{\det(A)}\operatorname{adj}(A),\qquad \operatorname{adj}(A)=[C_{ij}]^T$$
$2\times2$ shortcut worth memorising: $\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$ — swap the diagonal, negate the off-diagonal, divide by $\det$.

### 2.2.4 Worked problem

**Problem 2.1 (1 mark).** Compute $\det\begin{bmatrix}2&1&1\\1&3&2\\1&0&0\end{bmatrix}$.

*Solution.* Expand along **row 3** (two zeros — minimal work):
$$\det=1\cdot(-1)^{3+1}\begin{vmatrix}1&1\\3&2\end{vmatrix}+0+0=1\cdot(1\cdot2-1\cdot3)=-1$$
**Answer: $-1$** *(machine-verified by full recursive cofactor expansion)*. Since $\det\ne0$, the matrix is non-singular with rank 3. ∎

---

## 2.3 Systems of Linear Equations

### 2.3.1 Setup

A system of $m$ equations in $n$ unknowns is $A\mathbf x=\mathbf b$, with **coefficient matrix** $A$, unknowns $\mathbf x$, constants $\mathbf b$. The **augmented matrix** is $[A\mid\mathbf b]$.

- **Homogeneous:** $\mathbf b=\mathbf 0$. Always consistent ($\mathbf x=\mathbf 0$ is the *trivial solution*).
- **Non-homogeneous:** $\mathbf b\ne\mathbf 0$.

### 2.3.2 The complete consistency rule

Let $r=\rho(A)$, $r_a=\rho([A\mid\mathbf b])$, $n$ unknowns.

| Condition | Outcome |
|---|---|
| $r\ne r_a$ | **Inconsistent** — no solution |
| $r=r_a=n$ | **Unique** solution |
| $r=r_a<n$ | **Infinitely many**, with $n-r$ free parameters |

For a **homogeneous** system $r_a$ always equals $r$, so it is never inconsistent: $r=n$ ⟹ only the trivial solution; $r<n$ ⟹ infinitely many non-trivial solutions. For a square homogeneous system, non-trivial solutions exist **iff $\det(A)=0$**.

Geometric picture in 3D: each equation is a plane. Unique = three planes meeting at a point. Infinite = they share a line or a plane. Inconsistent = no common point.

### 2.3.3 Solution methods

- **Gaussian elimination:** row-reduce $[A\mid\mathbf b]$ to upper-triangular form, then **back-substitute**.
- **Gauss–Jordan:** continue to reduced row echelon form; read the answer off directly.
- **Cramer's rule:** for square systems with $\det(A)\ne0$, $x_i=\det(A_i)/\det(A)$, where $A_i$ is $A$ with column $i$ replaced by $\mathbf b$. Elegant for $2\times2$/$3\times3$, hopeless beyond.
- **LU decomposition:** Section 2.5 — what is actually used in practice.

### 2.3.4 Worked problem

**Problem 2.2 (2 marks).** For what $k$ does $\begin{cases}x+y+z=3\\x+2y+3z=4\\x+4y+kz=6\end{cases}$ have no solution?

*Solution.* Row-reduce. $R_2\to R_2-R_1$, $R_3\to R_3-R_1$:
$$\left[\begin{array}{ccc|c}1&1&1&3\\0&1&2&1\\0&3&k-1&3\end{array}\right]\xrightarrow{R_3\to R_3-3R_2}\left[\begin{array}{ccc|c}1&1&1&3\\0&1&2&1\\0&0&k-7&0\end{array}\right]$$
The last row says $(k-7)z=0$.
- $k\ne7$: $z=0$, **unique** solution.
- $k=7$: the row becomes $0=0$, so $r=r_a=2<3$ ⟹ **infinitely many** solutions.

The augmented entry is 0 in every case, so $r_a$ can never exceed $r$: **no value of $k$ makes it inconsistent.** Assuming a parameter *must* produce inconsistency is a recurring GATE trap. ∎

---

## 2.4 Eigenvalues and Eigenvectors

### 2.4.1 The core idea

Most vectors get knocked off their line when a matrix acts on them. A few special vectors do not — they are only **stretched or shrunk**, staying on their own span. Those are the **eigenvectors**, and the stretch factor is the **eigenvalue**:
$$A\mathbf v=\lambda\mathbf v,\qquad \mathbf v\ne\mathbf 0$$
("Eigen" is German for *own* / *characteristic*.) These are the axes along which the transformation is pure scaling — the matrix's own natural coordinate system.

### 2.4.2 How to find them

Rewrite as $(A-\lambda I)\mathbf v=\mathbf 0$. For a non-zero $\mathbf v$ to exist, $(A-\lambda I)$ must be singular:
$$\boxed{\det(A-\lambda I)=0}$$
This is the **characteristic equation**; its left side is the **characteristic polynomial** of degree $n$, yielding $n$ eigenvalues counting multiplicity (possibly complex).

$2\times2$ shortcut: $\lambda^2-\operatorname{tr}(A)\lambda+\det(A)=0$.

Then for each $\lambda$, solve $(A-\lambda I)\mathbf v=\mathbf 0$. You always get a whole line (or subspace) of eigenvectors, since any scalar multiple of an eigenvector is one too.

### 2.4.3 Properties (high frequency in GATE)

1. $\sum\lambda_i=\operatorname{tr}(A)$ and $\prod\lambda_i=\det(A)$ — instant sanity checks.
2. $A$ singular $\iff$ $0$ is an eigenvalue.
3. Triangular/diagonal ⟹ eigenvalues are the **diagonal entries**.
4. $A$ and $A^T$ share eigenvalues.
5. Eigenvalues of $A^k$ are $\lambda^k$; of $A^{-1}$ are $1/\lambda$; of $A+cI$ are $\lambda+c$ — eigenvectors unchanged in all three.
6. **Real symmetric** ⟹ real eigenvalues and mutually orthogonal eigenvectors.
7. Skew-symmetric ⟹ eigenvalues purely imaginary or zero. Orthogonal ⟹ $|\lambda|=1$.
8. **Algebraic multiplicity (AM)** = multiplicity as a root; **geometric multiplicity (GM)** $=n-\rho(A-\lambda I)$ = number of independent eigenvectors. Always $1\le\mathrm{GM}\le\mathrm{AM}$.
9. **Diagonalisable** $\iff$ GM = AM for every eigenvalue $\iff$ $n$ independent eigenvectors exist; then $A=PDP^{-1}$.
10. **Cayley–Hamilton:** every matrix satisfies its own characteristic equation — use it to compute high powers and inverses cheaply.

### 2.4.4 Worked problems

**Problem 2.3 (2 marks).** Find the eigenvalues and eigenvectors of $B=\begin{bmatrix}4&1\\2&3\end{bmatrix}$.

*Solution.*

**Step 1 — characteristic equation.** $\operatorname{tr}(B)=7$, $\det(B)=12-2=10$:
$$\lambda^2-7\lambda+10=0\Rightarrow(\lambda-5)(\lambda-2)=0\Rightarrow\lambda=5,\,2$$
*(Discriminant $49-40=9$, a perfect square. Checks: $5+2=7=\operatorname{tr}$ ✓, $5\times2=10=\det$ ✓ — both machine-verified.)*

**Step 2 — eigenvector for $\lambda=5$.** $B-5I=\begin{bmatrix}-1&1\\2&-2\end{bmatrix}$. Row 1: $-v_1+v_2=0\Rightarrow v_1=v_2$. Take $\mathbf v_1=\begin{bmatrix}1\\1\end{bmatrix}$.
Check: $B\mathbf v_1=\begin{bmatrix}5\\5\end{bmatrix}=5\mathbf v_1$ ✓ *(verified)*.

**Step 3 — eigenvector for $\lambda=2$.** $B-2I=\begin{bmatrix}2&1\\2&1\end{bmatrix}$. Row 1: $2v_1+v_2=0\Rightarrow v_2=-2v_1$. Take $\mathbf v_2=\begin{bmatrix}1\\-2\end{bmatrix}$.
Check: $B\mathbf v_2=\begin{bmatrix}2\\-4\end{bmatrix}=2\mathbf v_2$ ✓ *(verified)*.

Distinct eigenvalues ⟹ independent eigenvectors ⟹ $B$ is diagonalisable as $B=PDP^{-1}$ with $P=\begin{bmatrix}1&1\\1&-2\end{bmatrix}$, $D=\begin{bmatrix}5&0\\0&2\end{bmatrix}$. ∎

**Problem 2.4 (1 mark).** If $A$ has order 3 with eigenvalues $1,2,3$, find $\det(A)$, $\operatorname{tr}(A)$, and the eigenvalues of $A^2+2I$.

*Solution.* $\det=1\cdot2\cdot3=6$; $\operatorname{tr}=1+2+3=6$; eigenvalues of $A^2+2I$ are $\lambda^2+2$, i.e. $3,\,6,\,11$. ∎

---

## 2.5 LU Decomposition

### 2.5.1 Why bother

Gaussian elimination costs about $\frac23 n^3$ operations. When you must solve $A\mathbf x=\mathbf b$ for **many different $\mathbf b$** with the same $A$ — the normal engineering situation — repeating that work is wasteful. **LU factors $A$ once** into $A=LU$, then handles each new $\mathbf b$ in only $O(n^2)$.

- $L$ = **lower** triangular (zeros above the diagonal)
- $U$ = **upper** triangular (zeros below the diagonal)

**Doolittle's method** puts 1s on $L$'s diagonal; **Crout's method** puts 1s on $U$'s. Default to Doolittle unless told otherwise.

**Existence:** $A=LU$ without row swaps exists iff every **leading principal minor** is non-zero. If a zero pivot appears, permute rows and write $PA=LU$.

### 2.5.2 The two-step solve

$$A\mathbf x=\mathbf b \Longrightarrow LU\mathbf x=\mathbf b \Longrightarrow \underbrace{L\mathbf y=\mathbf b}_{\text{forward substitution}},\quad \underbrace{U\mathbf x=\mathbf y}_{\text{back substitution}}$$
Both triangular solves are trivial — start where only one unknown appears and cascade.

Bonus: $\det(A)=\det(L)\det(U)=1\times\prod u_{ii}$, the product of $U$'s pivots.

### 2.5.3 Worked problem

**Problem 2.5 (2 marks).** Find the LU decomposition of $A=\begin{bmatrix}2&-1&-2\\-4&6&3\\-4&-2&8\end{bmatrix}$ and use it to solve $A\mathbf x=\begin{bmatrix}-6\\17\\16\end{bmatrix}$.

*Solution.*

**Step 1 — eliminate column 1.** Multipliers $m_{21}=-4/2=-2$, $m_{31}=-4/2=-2$.
$R_2\to R_2-(-2)R_1$ gives $[0,\ 4,\ -1]$. $R_3\to R_3-(-2)R_1$ gives $[0,\ -4,\ 4]$.

**Step 2 — eliminate column 2.** $m_{32}=-4/4=-1$. $R_3\to R_3-(-1)R_2$ gives $[0,\ 0,\ 3]$.

**Step 3 — assemble.** $U$ is the reduced matrix; $L$ stores the multipliers under a unit diagonal:
$$L=\begin{bmatrix}1&0&0\\-2&1&0\\-2&-1&1\end{bmatrix},\qquad U=\begin{bmatrix}2&-1&-2\\0&4&-1\\0&0&3\end{bmatrix}$$
*(Machine-verified: $LU=A$ exactly, using exact rational arithmetic.)*

**Step 4 — forward substitution $L\mathbf y=\mathbf b$.**
- $y_1=-6$
- $-2y_1+y_2=17 \Rightarrow 12+y_2=17 \Rightarrow y_2=5$
- $-2y_1-y_2+y_3=16 \Rightarrow 12-5+y_3=16 \Rightarrow y_3=9$

**Step 5 — back substitution $U\mathbf x=\mathbf y$.**
- $3x_3=9 \Rightarrow x_3=3$
- $4x_2-x_3=5 \Rightarrow 4x_2=8 \Rightarrow x_2=2$
- $2x_1-x_2-2x_3=-6 \Rightarrow 2x_1-2-6=-6 \Rightarrow x_1=1$

$$\mathbf x=(1,\ 2,\ 3)^T$$
*(Machine-verified against the original equations.)* Also $\det(A)=2\times4\times3=24$. ∎

---

## 2.6 Module 2 visuals

> **Diagram D2.1 — Matrix multiplication choreography.** $A_{2\times3}$ at the left, $B_{3\times2}$ positioned *above and right* of the product grid. To fill cell $c_{ij}$, a highlighted row of $A$ slides right and a highlighted column of $B$ slides down, meeting at that cell, with the three products written and summed in a side panel. Dimension bars beneath read $(2\times\underline{3})(\underline{3}\times2)\to 2\times2$ with the matching inner dimensions bolded.

> **Diagram D2.2 — Determinant as area.** Panel 1: the unit square in grey. Panel 2: the parallelogram spanned by the columns of $\begin{bmatrix}3&1\\1&2\end{bmatrix}$, shaded blue, area labelled $\det=5$. Panel 3: a singular matrix collapsing the square to a flat segment, area 0, captioned "$\det=0$: a dimension is lost, so no inverse exists." Panel 4: a negative determinant with the orientation arrow visibly reversed.

> **Diagram D2.3 — The three fates of a 3×3 system.** Three 3D renderings of plane triples: (a) meeting at a single point — unique; (b) sharing a common line — infinite, one free parameter; (c) forming a triangular prism with no common point — inconsistent. Each panel annotated with its $(r,\ r_a,\ n)$ values so the algebraic rule and the geometry are learned as one fact.

> **Diagram D2.4 — Eigen-decomposition pipeline.** Left-to-right flow: $A \to \det(A-\lambda I)=0 \to$ characteristic polynomial $\to$ roots $\lambda_i \to$ solve $(A-\lambda_i I)\mathbf v=\mathbf 0 \to$ eigenvectors $\to$ assemble $P,D \to A=PDP^{-1}$. Print the concrete numbers from Problem 2.3 beneath each arrow so the abstract pipeline and a worked instance are read together.

> **Diagram D2.5 — LU as a factory.** $A$ split into the $L$ triangle (blue, holding multipliers $-2,-2,-1$) and the $U$ triangle (orange, holding pivots $2,4,3$), with a reassembly arrow showing $LU=A$. Below, a cost bar chart: "Gaussian elimination: $O(n^3)$ *per* right-hand side" vs "LU: $O(n^3)$ once, then $O(n^2)$ each".

> **Animation A2.1 — The eigenvector hunt.** Unit vectors arranged around a circle; each is multiplied by $B=\begin{bmatrix}4&1\\2&3\end{bmatrix}$ and its image drawn. Most images swing off their original lines. As the input sweeps, the directions $(1,1)$ and $(1,-2)$ *snap* and glow gold, labelled "stays on its own line — stretched by 5" and "— stretched by 2". The learner sees the definition instead of reading it.

> **Animation A2.2 — Gaussian elimination, row by row.** The augmented matrix with the active pivot ringed. Each operation is announced in text ($R_3\to R_3-3R_2$) and the affected row's numbers tween to new values. Once upper-triangular, back-substitution lights up from the bottom row upward, each solved variable flowing into the rows above. A live rank counter updates, and the consistency-rule table highlights the row that applies.

> **Animation A2.3 — Linear transformation of a grid.** An image on a coordinate grid is continuously deformed by $t\mapsto(1-t)I+tA$ as $t:0\to1$, showing rotation, shear and stretch, with live readouts of $\det$ (area scale) and $\operatorname{tr}$. Switch $A$ to a singular matrix and the whole picture flattens onto a line — the most memorable possible demonstration of why $\det=0$ means non-invertible.

---
---

# MODULE 3 — CALCULUS

Calculus is the mathematics of **change** (differential) and **accumulation** (integral). The Fundamental Theorem reveals these to be inverse operations — arguably the single most important fact in the subject.

## 3.0 Module glossary

| Symbol | Meaning |
|---|---|
| $\lim_{x\to a}f(x)=L$ | As $x$ approaches $a$, $f(x)$ approaches $L$ |
| $x\to a^-$ / $x\to a^+$ | Approach from the left / right |
| $f'(x)$, $\frac{dy}{dx}$ | First derivative — instantaneous rate of change |
| $f''(x)$ | Second derivative — the rate of change of the rate |
| $\int f(x)\,dx$ | Indefinite integral (antiderivative), $+\,C$ |
| $\int_a^b f(x)\,dx$ | Definite integral — signed area from $a$ to $b$ |
| $\infty$ | Unbounded; a direction, never a number |
| $\varepsilon,\delta$ | Small positive quantities in the formal limit definition |

---

## 3.1 Limits, Continuity, Differentiability

### 3.1.1 The idea of a limit

$\lim_{x\to a}f(x)=L$ means we can force $f(x)$ as close to $L$ as we like by taking $x$ close enough to $a$ — **without ever setting $x=a$**. The value $f(a)$ is irrelevant to the limit; it may differ, or not exist at all.

**Formal ($\varepsilon$–$\delta$) definition.** For every $\varepsilon>0$ there exists $\delta>0$ such that $0<|x-a|<\delta \implies |f(x)-L|<\varepsilon$. Read it as a challenge–response game: you name a tolerance $\varepsilon$ around $L$; I must supply a window $\delta$ around $a$ keeping $f$ inside your tolerance.

**Existence.** The limit exists **iff** both one-sided limits exist and are equal:
$$\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)$$

### 3.1.2 Techniques, in the order you should try them

1. **Direct substitution.** If $f$ is continuous at $a$, done.
2. **Factor and cancel.** For $\tfrac00$: $\lim_{x\to2}\frac{x^2-4}{x-2}=\lim_{x\to2}(x+2)=4$.
3. **Rationalise.** Multiply by the conjugate when roots appear.
4. **Standard limits** (memorise):
$$\lim_{x\to0}\frac{\sin x}{x}=1,\quad \lim_{x\to0}\frac{\tan x}{x}=1,\quad \lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12$$
$$\lim_{x\to0}\frac{e^x-1}{x}=1,\quad \lim_{x\to0}\frac{\ln(1+x)}{x}=1,\quad \lim_{x\to0}(1+x)^{1/x}=e$$
5. **L'Hôpital's rule.** For the indeterminate forms $\tfrac00$ or $\tfrac\infty\infty$ only: $\lim\frac fg=\lim\frac{f'}{g'}$ provided the right side exists. Applying it to a non-indeterminate form such as $\tfrac10$ produces nonsense. Other indeterminates ($0\cdot\infty$, $\infty-\infty$, $1^\infty$, $0^0$, $\infty^0$) must first be rearranged algebraically (or logarithmically) into $\tfrac00$ or $\tfrac\infty\infty$.
6. **Squeeze theorem.** If $g\le f\le h$ near $a$ and $\lim g=\lim h=L$, then $\lim f=L$. The standard tool for $x^2\sin(1/x)$-type limits.
7. **Taylor/Maclaurin expansion** — often faster than repeated L'Hôpital:
$$e^x=1+x+\tfrac{x^2}{2!}+\cdots,\quad \sin x=x-\tfrac{x^3}{3!}+\cdots,\quad \cos x=1-\tfrac{x^2}{2!}+\cdots$$

### 3.1.3 Continuity

$f$ is **continuous at $a$** iff all three hold: (1) $f(a)$ is defined; (2) $\lim_{x\to a}f(x)$ exists; (3) they are equal. Informally: you can draw the graph through $a$ without lifting your pen.

**Discontinuity types:** *removable* (a hole), *jump* (one-sided limits exist but differ), *infinite* (vertical asymptote), *oscillatory* (e.g. $\sin(1/x)$ at 0).

**Two theorems on a closed interval $[a,b]$:**
- **Intermediate Value Theorem.** A continuous $f$ attains every value between $f(a)$ and $f(b)$. Corollary: opposite signs at the endpoints force a root in $(a,b)$ — the basis of the bisection method.
- **Extreme Value Theorem.** A continuous $f$ attains an absolute maximum and minimum somewhere on $[a,b]$.

### 3.1.4 Differentiability

$$f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$$
The quotient is the slope of a **secant** through two nearby points; the limit is the slope of the **tangent** at $a$.

**The one-way implication:** differentiable $\implies$ continuous. The converse is **false**. $f(x)=|x|$ is continuous everywhere but not differentiable at 0, since the left derivative is $-1$ and the right is $+1$. **Corners, cusps, vertical tangents and jumps all destroy differentiability.** This asymmetry is asked nearly every year.

### 3.1.5 Worked problems

**Problem 3.1 (1 mark).** Evaluate $\lim_{x\to0}\dfrac{\sqrt{1+x}-1}{x}$.

*Solution — method A, rationalise.* Multiply by $\frac{\sqrt{1+x}+1}{\sqrt{1+x}+1}$:
$$\frac{(1+x)-1}{x(\sqrt{1+x}+1)}=\frac{x}{x(\sqrt{1+x}+1)}=\frac{1}{\sqrt{1+x}+1}\xrightarrow{x\to0}\frac{1}{2}$$

*Solution — method B, L'Hôpital.* Form is $\tfrac00$; differentiate top and bottom: $\dfrac{1/(2\sqrt{1+x})}{1}\to\tfrac12$.

**Answer: $\tfrac12$.** *(Numerically confirmed: the quotient is $0.49988$ at $x=10^{-3}$ and $0.4999999$ at $x=10^{-6}$.)* ∎

**Problem 3.2 (2 marks).** Find $a,b$ making $f(x)=\begin{cases}x^2 & x\le1\\ ax+b & x>1\end{cases}$ differentiable at $x=1$.

*Solution.*
**Continuity at 1:** left value $1^2=1$; right limit $a+b$. So $a+b=1$.
**Differentiability at 1:** left derivative $\frac{d}{dx}x^2\big|_1=2$; right derivative $a$. So $a=2$.
Hence $a=2$, $b=-1$. Continuity is a *prerequisite* — solving only the derivative condition is the classic error here. ∎

---

## 3.2 Differentiation, Extrema, Mean Value Theorems

### 3.2.1 Standard derivatives

| $f(x)$ | $f'(x)$ | | $f(x)$ | $f'(x)$ |
|---|---|---|---|---|
| $x^n$ | $nx^{n-1}$ | | $\sin x$ | $\cos x$ |
| $e^x$ | $e^x$ | | $\cos x$ | $-\sin x$ |
| $a^x$ | $a^x\ln a$ | | $\tan x$ | $\sec^2x$ |
| $\ln x$ | $1/x$ | | $\arctan x$ | $1/(1+x^2)$ |

### 3.2.2 Rules

- **Sum:** $(f\pm g)'=f'\pm g'$
- **Product:** $(fg)'=f'g+fg'$
- **Quotient:** $\left(\frac fg\right)'=\dfrac{f'g-fg'}{g^2}$
- **Chain:** $\dfrac{d}{dx}f(g(x))=f'(g(x))\cdot g'(x)$ — differentiate the outside, keep the inside, multiply by the inside's derivative.

### 3.2.3 Maxima and minima

**Critical point:** $x=c$ where $f'(c)=0$ or $f'(c)$ fails to exist. Extrema occur **only** at critical points or at interval endpoints.

**First derivative test** — sign of $f'$ as $x$ crosses $c$: $+\to-$ gives a local **maximum**; $-\to+$ gives a local **minimum**; no change gives neither.

**Second derivative test** — if $f'(c)=0$:
- $f''(c)>0$ ⟹ local **minimum** (concave up, "holds water")
- $f''(c)<0$ ⟹ local **maximum** (concave down)
- $f''(c)=0$ ⟹ **inconclusive**; fall back to the first derivative test. ($x^4$ has a minimum at 0; $x^3$ has no extremum at 0; both have $f''(0)=0$.)

**Point of inflection:** concavity changes — requires $f''=0$ **and** an actual sign change.

**Absolute extrema on $[a,b]$:** evaluate $f$ at every critical point **and both endpoints**, then compare. Forgetting the endpoints is the most commonly lost mark in this topic.

### 3.2.4 Mean value theorems

**Rolle's theorem.** If $f$ is (i) continuous on $[a,b]$, (ii) differentiable on $(a,b)$, (iii) $f(a)=f(b)$, then some $c\in(a,b)$ has $f'(c)=0$. *Intuition: return to the same height and you must have levelled off somewhere.*

**Lagrange's MVT.** Drop condition (iii); then some $c\in(a,b)$ satisfies
$$f'(c)=\frac{f(b)-f(a)}{b-a}$$
*Intuition: at some instant your speedometer read exactly your average speed.* Rolle is the case where the average is zero.

**Cauchy's MVT.** $\dfrac{f'(c)}{g'(c)}=\dfrac{f(b)-f(a)}{g(b)-g(a)}$ — the generalisation that proves L'Hôpital's rule.

**Taylor's theorem** extends the idea: $f(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\cdots$; LMVT is the one-term case with remainder.

> Every hypothesis matters. $f(x)=|x|$ on $[-1,1]$ satisfies $f(-1)=f(1)$ yet has no point with $f'=0$, because differentiability fails at $x=0$. GATE loves exactly this counterexample.

### 3.2.5 Worked problems

**Problem 3.3 (2 marks).** Find and classify the local extrema of $f(x)=x^3-3x+2$, then find the absolute extrema on $[-2,2]$.

*Solution.*
**Step 1 — critical points.** $f'(x)=3x^2-3=3(x^2-1)=0 \Rightarrow x=\pm1$.
**Step 2 — classify with $f''(x)=6x$.**
- $f''(-1)=-6<0$ ⟹ local **maximum** at $x=-1$, value $f(-1)=-1+3+2=4$.
- $f''(1)=6>0$ ⟹ local **minimum** at $x=1$, value $f(1)=1-3+2=0$.

**Step 3 — endpoints.** $f(-2)=-8+6+2=0$; $f(2)=8-6+2=4$.

**Step 4 — compare the whole list** $\{f(-2),f(-1),f(1),f(2)\}=\{0,4,0,4\}$ *(all four values machine-verified)*.

**Absolute maximum $=4$**, attained at both $x=-1$ and $x=2$. **Absolute minimum $=0$**, attained at both $x=-2$ and $x=1$. Inflection at $x=0$, where $f''$ changes sign. ∎

**Problem 3.4 (1 mark).** Verify LMVT for $f(x)=x^2$ on $[1,3]$ and find $c$.

*Solution.* A polynomial is continuous on $[1,3]$ and differentiable on $(1,3)$ ✓.
Average rate $=\frac{f(3)-f(1)}{3-1}=\frac{9-1}{2}=4$. Set $f'(c)=2c=4\Rightarrow c=2\in(1,3)$ ✓. *(Verified.)* ∎

---

## 3.3 Integration

### 3.3.1 Two definitions that turn out to be one

**Indefinite integral (antiderivative):** $\int f(x)dx=F(x)+C$ where $F'=f$. The $+C$ exists because differentiation destroys constants.

**Definite integral (Riemann sum):** the signed area under the curve, defined as a limit of rectangle sums:
$$\int_a^bf(x)dx=\lim_{n\to\infty}\sum_{i=1}^{n}f(x_i)\Delta x,\qquad \Delta x=\frac{b-a}{n}$$
Area below the $x$-axis counts as negative.

**Fundamental Theorem of Calculus** — these two ideas are secretly one:
- **Part 1:** $\frac{d}{dx}\int_a^xf(t)dt=f(x)$ — accumulate, then differentiate, and you are back where you started.
- **Part 2:** $\int_a^bf(x)dx=F(b)-F(a)$ — areas are computed via antiderivatives. This is what makes integration tractable at all.

### 3.3.2 Standard integrals

$$\int x^ndx=\frac{x^{n+1}}{n+1}+C\ (n\ne-1),\quad \int\frac{dx}{x}=\ln|x|+C,\quad \int e^xdx=e^x+C$$
$$\int\sin x\,dx=-\cos x+C,\quad \int\cos x\,dx=\sin x+C,\quad \int\sec^2x\,dx=\tan x+C$$
$$\int\frac{dx}{1+x^2}=\arctan x+C,\quad \int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C$$

### 3.3.3 Techniques

**Substitution** (reverses the chain rule): put $u=g(x)$, $du=g'(x)dx$. For definite integrals, **convert the limits** rather than substituting back.

**Integration by parts** (reverses the product rule):
$$\int u\,dv=uv-\int v\,du$$
Choose $u$ by **ILATE** — **I**nverse trig, **L**ogarithmic, **A**lgebraic, **T**rigonometric, **E**xponential — taking whichever appears earliest in that list, because it simplifies on differentiation.

**Partial fractions** for rational functions; **trigonometric substitution** for roots: $\sqrt{a^2-x^2}\to x=a\sin\theta$; $\sqrt{a^2+x^2}\to x=a\tan\theta$; $\sqrt{x^2-a^2}\to x=a\sec\theta$.

### 3.3.4 Properties of definite integrals

$$\int_a^bf=-\int_b^af,\qquad \int_a^bf=\int_a^cf+\int_c^bf,\qquad \int_a^bf(x)dx=\int_a^bf(a+b-x)dx$$

**Symmetry shortcut** over $[-a,a]$:
$$\int_{-a}^{a}f(x)dx=\begin{cases}2\int_0^af(x)dx & f \text{ even},\ f(-x)=f(x)\\[4pt] 0 & f\text{ odd},\ f(-x)=-f(x)\end{cases}$$
Spotting an odd integrand on a symmetric interval reduces a hard integral to "0" in one line.

**Improper integrals** have an infinite limit or unbounded integrand; evaluate as a limit. $\int_1^\infty x^{-p}dx$ converges iff $p>1$.

### 3.3.5 Worked problems

**Problem 3.5 (2 marks).** Evaluate $\displaystyle\int_0^1x^2e^x\,dx$.

*Solution.* Integrate by parts twice; by ILATE, Algebraic outranks Exponential, so $u=x^2$, $dv=e^xdx$.

**Pass 1:** $du=2x\,dx$, $v=e^x$:
$$\int_0^1x^2e^xdx=\Big[x^2e^x\Big]_0^1-\int_0^12xe^xdx=e-2\int_0^1xe^xdx$$

**Pass 2:** $u=x$, $du=dx$, $v=e^x$:
$$\int_0^1xe^xdx=\Big[xe^x\Big]_0^1-\int_0^1e^xdx=e-\Big[e^x\Big]_0^1=e-(e-1)=1$$

**Combine:** $\int_0^1x^2e^xdx=e-2(1)=\mathbf{e-2}\approx0.71828$.
*(Numerically verified by Simpson's rule with 2000 intervals: $0.7182818284590556$ against $e-2=0.7182818284590451$ — agreement to 13 significant digits.)* ∎

**Problem 3.6 (1 mark).** Evaluate $\displaystyle\int_0^\pi\sin^2x\,dx$.

*Solution.* Power-reduction identity $\sin^2x=\frac{1-\cos2x}{2}$:
$$\int_0^\pi\frac{1-\cos2x}{2}dx=\frac12\left[x-\frac{\sin2x}{2}\right]_0^\pi=\frac12\big[(\pi-0)-(0-0)\big]=\frac{\pi}{2}\approx1.5708$$
*(Simpson's rule returns $1.5707963267948966=\pi/2$ ✓.)*
Sanity check: $\sin^2$ averages $\tfrac12$ over a full period, and $\tfrac12\times\pi=\pi/2$ ✓. ∎

**Problem 3.7 (1 mark).** Evaluate $\displaystyle\int_1^e\ln x\,dx$.

*Solution.* By ILATE, Logarithmic outranks Algebraic: $u=\ln x$, $dv=dx$, so $du=dx/x$, $v=x$:
$$\int_1^e\ln x\,dx=\Big[x\ln x\Big]_1^e-\int_1^ex\cdot\frac1x dx=(e\cdot1-0)-\Big[x\Big]_1^e=e-(e-1)=\mathbf 1$$
*(Simpson's rule: $0.9999999999999947\approx1$ ✓.)* ∎

**Problem 3.8 (1 mark).** Evaluate $\displaystyle\int_{-2}^{2}\big(x^3+x\cos x\big)dx$.

*Solution.* Check parity: $(-x)^3=-x^3$ is odd, and $(-x)\cos(-x)=-x\cos x$ is odd since $\cos$ is even. The whole integrand is **odd** on an interval symmetric about 0, so the integral is $\mathbf 0$ — no antiderivative required. ∎

---

## 3.4 Module 3 visuals

> **Diagram D3.1 — The limit as a tolerance game.** A curve approaching $L$ at $x=a$, with a horizontal band of half-width $\varepsilon$ around $L$ and a vertical band of half-width $\delta$ around $a$. Three stacked panels show $\varepsilon$ shrinking while an ever-narrower $\delta$ is found that keeps the curve inside the band. Add one panel where the limit *fails* and no $\delta$ works, which is what makes the definition's purpose land.

> **Diagram D3.2 — Discontinuity zoo.** Four small graphs in a row: removable (open circle with a stray filled dot above), jump (step function with both one-sided limits marked), infinite (vertical asymptote), oscillatory ($\sin(1/x)$ compressing toward 0). Each labelled with precisely which of the three continuity conditions it violates.

> **Diagram D3.3 — Derivative as the limit of secants.** A fixed $P=(a,f(a))$ and a moving $Q=(a+h,f(a+h))$. Overlay five secants for $h=1,0.5,0.25,0.1,0.01$ in fading grey, converging on the bold red tangent. A side table lists the difference quotient for each $h$, visibly approaching $f'(a)$.

> **Diagram D3.4 — The three-graph stack.** Vertically aligned on one shared $x$-axis: $f(x)=x^3-3x+2$ on top, $f'(x)=3x^2-3$ in the middle, $f''(x)=6x$ below. Dashed verticals at $x=-1,0,1$ show the correspondence: $f'$ crosses zero exactly where $f$ peaks or troughs, and $f''$ crosses zero exactly at $f$'s inflection. This single figure makes both derivative tests self-evident and is the best study aid in the module.

> **Diagram D3.5 — Mean Value Theorem.** A curve from $A=(a,f(a))$ to $B=(b,f(b))$ with the chord in blue and the tangent at $x=c$ in red, visibly **parallel**. A second panel shows $|x|$ on $[-1,1]$ with a red ✗ and the caption "fails — not differentiable at 0; the hypotheses are not decoration."

> **Diagram D3.6 — Riemann sums converging.** Four panels under the same curve at $n=4,8,16,64$ rectangles, each with its total printed and converging on the exact value, plus a fifth panel showing the smooth shaded region. Caption: "the integral is the limit the rectangles are reaching for."

> **Animation A3.1 — Secant to tangent.** $Q$ slides along the curve toward $P$; the secant pivots in real time; a readout shows $h$ shrinking and the slope stabilising. As $h\to0$ the line locks gold, labelled $f'(a)$. Then rerun on $|x|$ at $x=0$: the approach from the right gives $+1$, from the left $-1$, the two lines refuse to meet, and the caption reads "left ≠ right derivative ⟹ not differentiable."

> **Animation A3.2 — The rolling ball optimiser.** A ball placed on $f(x)=x^3-3x+2$ rolls downhill and settles in the trough at $x=1$; a tangent attached to the ball flattens as it settles, with the readout $f'=0$. Flip the curve to show the maximum. A concavity icon (cup/cap) tracks the sign of $f''$, so the second derivative test is felt physically rather than recalled.

> **Animation A3.3 — Rectangles becoming area.** A slider drives $n$ from 2 to 500; the rectangles narrow and the jagged staircase melts into the smooth region under the curve while a numeric panel converges digit by digit. A toggle switches between left, right, midpoint and trapezoidal rules so the learner sees which over- and under-estimate, and why midpoint converges fastest.

> **Animation A3.4 — The Fundamental Theorem, live.** Two synchronised panels: the top shows $f(t)$ with the region from $a$ to a moving boundary $x$ shaded; the bottom plots the accumulated area $A(x)=\int_a^xf$. As $x$ sweeps right, the shaded area grows and the lower curve draws itself. Where $f$ is large the lower curve climbs **steeply**; where $f$ dips below zero the lower curve **descends** — making $A'(x)=f(x)$ visible and undeniable.

> **Animation A3.5 — Odd-function cancellation.** $\int_{-2}^2x^3dx$ with the left region shaded red (negative) and the right shaded blue (positive). The two regions rotate about the origin, overlay exactly and annihilate, captioned "odd function on a symmetric interval ⟹ 0." Ten seconds that install a permanent exam reflex.
