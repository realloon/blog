---
title: 指针入门
pubDate: 2026-07-23
---

理解指针，首先要理解内存。

## 内存

内存是什么？这是一个简化的内存模型：

![](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Point/1.webp)

每一个格子代表一个内存单位，为了区分，我们给它们编上序号。

现在，我们可以在内存中保存数据了。例如，我们希望 `1` 号格子保存着 `1`：

![](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Point/2.webp)

为避免混淆，我们统一让序号加上 `&` 前缀。现在，内存**位置**为 `&1` 的格子，保存的**值**为 `1`。

## 变量

为方便指称，我们给存着 `1` 的格子取一个名字，例如叫它 `number`：

![](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Point/3.webp)

这其实就对应着代码：

```go
var number = 1
```

程序获取**变量** `number` 的值，也就是获取**地址** `&1` 的值，其**值**为 `1`。

## 指针

现在，观察这种情况：

![](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Point/4.webp)

我们发现，内存**位置**为 `&2` 的格子，保存的**值**为 `&1`。同样给它取个名字，例如叫 `point`：

![](https://oss-1259210922.cos.ap-nanjing.myqcloud.com/Point/5.webp)

程序获取**变量** `point` 的值，也就是获取**地址** `&2` 的值，其**值**为 `&1`。

像 `point` 这样储存着地址的变量，我们称之为“指针变量”，它储存的值，就是“指针”。

可以简单地认为，指针就是地址。

## 取地址

上面的图示对应着代码：

```go
var number = 1
var point = &number
```

若只是获取 `number`，值为 `1`；当获取 `&number` 时，值为 `number` 的**地址**。

`point` 是一个指针变量，其值 `&number` 是一个地址，也就是一个指针，我们将 `&` 称为“取地址”。

试着打印它们：

```go
var number = 1
fmt.Println(number) // 1

var point = &number
fmt.Println(point) // 0x7e4f7e61e020 (&1)
```

> 形如 `0x7e4f7e61e020` 是地址的实际位置，每次运行不固定。

## 解引用

通常来说，拿到地址不是我们的目的，而是要获取地址上的值：

```go
var number = 1
fmt.Println(number) // 1

var point = &number
fmt.Println(point) // 0x47e35b71e020 (&1)

var value = *point
fmt.Println(value) // 1
```

与 `&` 取地址相对，将 `*` 称为“解引用”。

可以简单地认为，解引用就是从**地址**取**值**。

## 声明指针类型

在前面的代码中，我们省略了类型声明，若将其补全：

```go
var number int = 1
fmt.Println(number) // 1

var point *int = &number
fmt.Println(point) // 0x47e35b71e020

var value int = *point
fmt.Println(value) // 1
```

> 在 C 语言中，语法为 `int *point = &number;`

因此，在指针语境下，符号 `*` 有两种不同的语义：

- 声明指针变量的类型
- 解引用

对于 `var point *int`，表示指针变量 `point` 的类型是 `*int`；对于 `*point`，表示从 `point` 指向的地址取值。

## 练习

```go
var number = 1
fmt.Println(number)  // #1
fmt.Println(&number) // #2

var point = &number
fmt.Println(point)   // #3
fmt.Println(*point)  // #4
```

观察上面的代码，回答哪两两打印相同。

<details>
  <summary>答案</summary>
  <code>#1 #4; #2 #3</code>
</details>
