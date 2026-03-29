# JavaScript 基础

## 数据类型

### 原始类型

JavaScript 有 7 种原始类型：`string`、`number`、`bigint`、`boolean`、`undefined`、`symbol`、`null`。

```javascript
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object" (历史遗留 bug)
```

**面试要点：**
- `typeof null` 返回 `"object"`，这是 JS 的历史遗留 bug
- `Symbol` 是 ES6 新增的，用于创建唯一标识符
- `BigInt` 用于表示大于 $2^{53} - 1$ 的整数

### 引用类型

引用类型包括 `Object`、`Array`、`Function`、`Date`、`RegExp` 等。

```javascript
const obj = { name: "Alice" }
const arr = [1, 2, 3]
const fn = function() { return 42 }
```

引用类型存储的是内存地址，赋值时是引用传递而非值传递。

## 闭包

闭包是指函数能够访问其词法作用域中的变量，即使函数在其词法作用域之外执行。

```javascript
function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    getCount: () => count,
  }
}

const counter = createCounter()
counter.increment()  // 1
counter.increment()  // 2
counter.getCount()   // 2
```

**常见面试题：**
- 循环中的闭包问题（`var` vs `let`）
- 闭包与内存泄漏的关系
- 闭包实现模块模式

## 原型链

每个 JavaScript 对象都有一个内部属性 `[[Prototype]]`，指向它的原型对象。

```javascript
function Person(name) {
  this.name = name
}
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`
}

const alice = new Person("Alice")
alice.greet()           // "Hi, I'm Alice"
alice.hasOwnProperty("name")  // true
alice.hasOwnProperty("greet") // false
```

原型链查找顺序：实例自身 → 构造函数的 `prototype` → `Object.prototype` → `null`

---

# CSS 布局

## Flexbox

Flexbox 是一维布局模型，适合处理行或列方向的排列。

```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
```

**核心属性：**
- `flex-direction`：主轴方向（row | column）
- `justify-content`：主轴对齐
- `align-items`：交叉轴对齐
- `flex-wrap`：是否换行
- `flex: 1` 等价于 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`

## Grid

Grid 是二维布局模型，可以同时控制行和列。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
```

**Flexbox vs Grid 选择：**
- 一维排列用 Flexbox
- 二维网格用 Grid
- 两者可以嵌套使用

## BFC（块级格式化上下文）

BFC 是一个独立的渲染区域，内部元素的布局不会影响外部。

**触发 BFC 的条件：**
- `overflow` 不为 `visible`
- `display: flow-root`（推荐）
- `float` 不为 `none`
- `position` 为 `absolute` 或 `fixed`

---

# 计算机网络

## HTTP 与 HTTPS

HTTP 是无状态的应用层协议，HTTPS 在 HTTP 基础上增加了 TLS 加密层。

**HTTPS 握手流程：**
1. 客户端发送 Client Hello（支持的加密套件、随机数）
2. 服务端返回 Server Hello（选定加密套件、随机数、数字证书）
3. 客户端验证证书，生成预主密钥，用公钥加密发送
4. 双方基于预主密钥生成会话密钥，后续对称加密通信

## TCP 三次握手

$$
\text{Client} \xrightarrow{\text{SYN}} \text{Server} \xrightarrow{\text{SYN+ACK}} \text{Client} \xrightarrow{\text{ACK}} \text{Server}
$$

1. 客户端发送 SYN（seq=x）
2. 服务端回复 SYN+ACK（seq=y, ack=x+1）
3. 客户端发送 ACK（ack=y+1）

**为什么不是两次？** 防止已失效的连接请求报文突然到达服务端，造成资源浪费。

## 常见状态码

| 状态码 | 含义 |
|--------|------|
| 200 | OK |
| 301 | 永久重定向 |
| 302 | 临时重定向 |
| 304 | 未修改（缓存） |
| 400 | Bad Request |
| 401 | 未认证 |
| 403 | 禁止访问 |
| 404 | Not Found |
| 500 | 服务器内部错误 |
| 502 | Bad Gateway |
| 503 | 服务不可用 |

---

# 算法与数据结构

## 数组与链表

**数组：** 连续内存空间，$O(1)$ 随机访问，插入/删除 $O(n)$。

**链表：** 非连续存储，$O(n)$ 随机访问，已知节点时插入/删除 $O(1)$。

```javascript
class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

function reverseList(head) {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}
```

## 二叉树遍历

- **前序遍历：** 根 → 左 → 右
- **中序遍历：** 左 → 根 → 右
- **后序遍历：** 左 → 右 → 根
- **层序遍历：** BFS 逐层访问

```javascript
function inorderTraversal(root) {
  const result = []
  const stack = []
  let curr = root
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr)
      curr = curr.left
    }
    curr = stack.pop()
    result.push(curr.val)
    curr = curr.right
  }
  return result
}
```

## 动态规划

动态规划的核心是将问题拆解为重叠子问题，通过记忆化避免重复计算。

**经典题目：爬楼梯**

到达第 $n$ 阶的方法数：$f(n) = f(n-1) + f(n-2)$

```javascript
function climbStairs(n) {
  if (n <= 2) return n
  let prev2 = 1, prev1 = 2
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2
    prev2 = prev1
    prev1 = curr
  }
  return prev1
}
```

**DP 解题步骤：**
1. 定义状态（dp 数组的含义）
2. 推导状态转移方程
3. 确定初始条件
4. 确定遍历顺序
5. 举例验证
