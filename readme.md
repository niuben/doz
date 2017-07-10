## Doz
一个UI组件开发库。使用它可以更快开发出UI组件。它具有以下几个功能：

* 状态管理
* 订阅/发布
* 动画模块
* 加载器（可以加载第三方类）

### 状态管理
通过`setState`和`getState`两个方法进行设置和获取状态。当进行设置状态时会触发订阅该状态的方法。

代码实例:
```
//设置index状态;
this.setState("index", 1);

//获取index状态;
var index = this.getState("index");

```

### 订阅/发布
可以对实例组件进行订阅，当组件状态发生改变后回通知各个组件。具有方法如下

* watch: 对状态值进行订阅;
* unWatch: 对状态值取消订阅;
* run: 发布状态；
* force: 强制运行;

代码事例:
```
// Tab组件订阅了状态index。当状态index发生变化时会通知
Tab.watch("index", function(index){
    console.log(1, val);
});

// Tab组件取消订阅index
Tab.unWatch("index");

//Tab组件只取消订阅index的第一个方法
Tab.unWatch("index", 1);
```

### 动画模块
基于`jquery animate`封装了一些动画方法。目的大家提高开发动画效率。 

* sliderLeft: 向左滑动；
* sliderRight: 向右滑动；

### 加载器
用于加载加载第三方类库。当你想扩展`Doz`功能的话，使用`use`方法加载一个第三方类的实例，就可以在`Doz`中使用

```
// 加载一个动画库
var Animate = require("Animate");
Doz.prototype.use(new Animate);

```
