[TOC]

原子 ```atom```

列表 ```(atom)```

S-表达式 所有原子和列表都是S-表达式

## Scheme五法

### 一 car

> 基本元件car仅针对非空列表定义

车头

### 二 cdr

> 基本元件cdr仅针对非空列表定义 任意非空列表的cdr总是另一个列表

车身

### 三 cons

> 基本元件cons需要两个参数 第二个参数必须是一个列表 结果是一个列表

### 四 null?

> 基本元件null?仅针对列表定义

```(null? (quote()))```——True

```(atom? s)```——True

### 五 eq?

> 基本元件eq?需要两个参数 每个参数都必须是一个非数字的原子



## Scheme十诫

### 一

> 在表述任意函数时，总是将询问**```null?```**作为诸问题之首77
>
> 当对一个**原子列表```lat```**进行递归调用时，询问两个有关```lat```的问题：**```(null? lat)```、```else```**
>
> 当对一个**数字n**进行递归调用时，询问两个有关```n```的问题：**```(zero? n)```、```else```**
>
> 当对一个**S-表达式列表l**进行递归调用时，询问三个有关```l```的问题：**```(null? lat)```、```(atom? (car l))```、```else```**

#### lat?

*```lat?```逐一查找列表中每个S-表达式，看看这个S-表达式是不是一个原子，直到查完S-表达式。如果查完了所有原子，也没遇上一个是列表的S-表达式，则返回值为#t——true，如果遇上了，则返回值为#f——false*

```scheme
(define lat?
  (lambda (l)
    (cond
     ((null? l)#t)
     ((atom? (car l))(lat? (cdr l)))
     (else #f)
     )
    )
  )
```

#### member?

```scheme
(define member?
  (lambda (a lat)
    (cond
     ((null? lat) #f)
     (else (or (eq? (car lat) a)
               (member? a (cdr lat))))
     )
    )
  )
```

#### +

```scheme
(define +
  (lambda (n m)
    (cond
     ((zero? m) n)
     (else (addl (+ n (subl m))))
     )
    )
  )
```

#### -

```scheme
(define -
  (lambda (n m)
    (cond
     ((zero? m) n)
     (else (subl (- n (subl m))))
     )
    )
  )
```



### 二

> 使用```cons```来构建列表

#### rember

```scheme
(define rember
  (lambda (a lat)
    (cond
     ((null? lat) (quote()))
     (else (cond
            ((eq? (car l) a)(cdr lat))
            (else (cons (car lat)
                        (rember a (cdr lat))))
            ))
     )
    )
  )
```

#### rember*

```scheme
(define rember*
  (lambda (a l)
    (cond
     ((null? l)(quote()))
     ((atom? (car l))
      (cond
       ((eq? (car l) a)
        (rember* a (cdr l)))
       (else (cons (car l) (rember* a (cdr l))))
       )
      )
     (else (cons (rember* a (car l)) (rember* a (cdr l))))
     )
    )
  )
```



#### addup

```scheme
(define addtup
  (lambda (tup)
    (cond
     ((null? tup) 0)
     (else (+ (car tup) (addtup (cdr tup))))
     )
    )
  )
```



### 三

> 构建一个列表时，描述第一个典型元素，之后```cons```该元素到一般性递归上

#### firsts

```scheme
(define firsts
  (lambda (l)
    (cond
     ((null? l) (quote()))
     (else (cons (car (car l))
                 (firsts (cdr l))))
     )
    )
  )
```

```(else (cons (car (car l))) (firsts (cdr l)))```

```(car (car l))```：典型元素 

```(firsts (cdr l))```：自然递归

#### insertR

```scheme
(define insertR
  (lambda (new old lat)
    (cond 
     ((null? lat) (quote()))
     (else (cond 
            ((eq? (car lat) old) 
                 (cons old (cons new (cdr lat))))
           (else (cons (car lat) (insertR new old (cdr lat))))
            ))
     )
  )
```

#### insertR*

```scheme
(define insertR*
  (lambda (new old l)
    (cond
     ((null? l) (quote()))
     ((atom? (car l))
      (cond 
       ((eq? (car l) old) 
        (cons old (cons new (insertR* new old (cdr l))))
        )
       (else (cons (car l) (insertR* new old (cdr l))))
       )
      )
     (else (cons (insertR* new old (car l)) (insertR* new old (cdr l))))
     )
    )
  )
```

#### subst

```scheme
(define subst
  (lambda (new old lat)
    (cond
     ((null? lat) (quote()))
     (else (cond 
            ((eq? (car lat) old) (cons new (cdr lat)))
            (else (cons (car lat) (subst new old (cdr lat))))
            ))
     )
    )
  )
```



### 四

> 在递归时总是改变至少一个参数。
>
> 当对一个**原子列表```lat```**进行递归时，使用**```(cdr lat)```**
>
> 当对**数字n**进行递归时，使用**```(subl n)```**
>
> 当对一个**S-表达式l**进行递归时，只要是```(null? l)```和```(atom? (car l))```都不为```true```，就同时使用**```(car l)```**和**```(cdr l)```**
>
> 
>
> 在递归时改变的参数，必须向着不断接近**结束条件**而改变，改变的参数必须在结束条件中得以测试：
>
> ​	当使用```cdr```时，用```null?```测试是否结束
>
> ​	当使用```subl```时，用```zero?```测试是否结束

#### multisubt

```scheme
(define multisubst
  (lambda (new old lat)
    (cond
     ((null? lat) (quote()))
     (else
      (cond 
       ((eq? (car lat) old)
        (cons new (multisubst new old (cdr lat))))
       (else (cons (car lat) (multisubst new old (cdr lat))))
       )
      )
     )
    )
  )
```

#### *

```scheme
(define *
  (lambda (n m)
    (cond
     ((zero? m) 0)
     (else (+ n (* n (subl m))))
     )
    )
  )
```

#### >

```scheme
(define >
  (lambda (n m)
    (cond
     ((zero? n) #f)
     ((zero? m) #t)
     (else (> (subl n)(subl m)))
     )
    )
  )
```

#### <

```scheme
(define <
  (lambda (n m)
    (cond
     ((zero? m) #f)
     ((zero? n) #t)
     (else (< (subl n) (subl m)))
     )
    )
  )
```

#### pick

```(pick n lat) = d```
```n = 4```
```lat = (a b c d e f)```


```scheme
(define pick
  (lambda (n lat)
    (cond
     ((zero? (subl n)) (car lat))
     (else (pick (subl n) (cdr lat)))
     )
    )
  )
```

#### rempick
```(rempick n lat) = (hotdogs with mustard)```
```n = 3```
```lat = (hotdogs with hot mustard)```

```scheme
(define rempick
  (lambda (n lat)
    (cond
     ((zero? (subl n)) (cdr lat))
     (else (cons (car lat) (rempick (subl n) (cdr lat))))
     )
    )
  )
```

#### no-nums

```(no-nums) = (pears prunes dates)```
```lat = (5 pears 6 prunes 9 dates)```

```scheme
(define no-nums
  (lambda (lat)
    (cond
     ((null? lat) quote())
     (cond
      ((number? (car lat)) (no-nums (cdr lat)))
      (else (cons (car lat) (no-nums (cdr lat))))
      )
     )
    )
  )
```




### 五

> 当用**```+```**构建一个值时，总是用 **0** 作为结束代码行的值，因为加上 0 不会改变加法的值
>
> 当用**```*```**构建一个值时，总是用 **1** 作为结束代码行的值，因为乘以 1 不会改变乘法的值
>
> 当用**```cons```**构建一个值时，总是考虑把 **()** 作为结束代码行的值

#### addtup

```scheme
(define addtup
  (lambda (tup)
    (cond
     ((null? tup) 0)
     (else (+ (car tup) (addtup (cdr tup))))
     )
    )
  )
```

#### tup+

```scheme
(define tup+
  (lambda (tup1 tup2)
    (cond
     ((null? tup1) tup2)
     ((null? tup2) tup1)
     (else
      (cond (+ (car tup1) (car tup2))
            (tup+ (cdr tup1) (cdr tup2))
       )
      )
     )
    )
  )
```

#### /

```scheme
(define /
  (lambda (n m)
    (cond
     ((< n m) 0)
     (else (addl (/ (- n m) m)))
     )
    )
  )
```

#### length

```scheme
(define length
  (lambda (lat)
    (cond
     ((null? lat) 0)
     (else (addl (length (cdr lat))))
     )
    )
  )		
```

#### occur

```scheme

```



