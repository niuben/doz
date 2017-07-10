/*
* State: 状态模块	
* set: 设置状态的值;
* get: 获取状态的值;
*/
function State(){
	this.state = null;	
}

State.prototype = {
	/*
	* set参量有两种形式:
	* 1. key: value
	* 2. obj
	*/
	setState: function(key, val){
		if(arguments.length == 2) {
			this.state[arguments[0]] = arguments[1];
		}else {
			this.state = arguments[0];
		}
	},
	getState: function(key){
		return this.state[key];
	}
}

/*
* PubSub: 订阅发布模块;
* force: 强制触发watch;
* watch: 监听具体状态;
*/
function PubSub(obj){
	this.listen = {};
}

PubSub.prototype = {	
	run: function(key, val){
		// console.log("run");
		if(arguments.length != 2) {
			return false;
		}
		
		var funcs = this.listen[arguments[0]];
		if(funcs == undefined) {
			return false;
		}

		for(var i = 0; i < funcs.length; i++) {
			funcs[i](arguments[1]);
		}
	},
	watch: function(key, func){
		if(this.listen[key] == undefined) {
			this.listen[key] = [];
		}
		this.listen[key].push(func);
	},
	unwatch: function(key, index){
		if(arguments.length == 1 && this.listen[key] != undefined) {
			delete this.listen[key];
			return;
		}		
		
		var funcs = this.listen[key];		
		if(Object.prototype.toString.call(funcs) != "[object Array]"){
			return;
		}

		var newFuncs = [];
		for(var i = 0; i < funcs.length; i++) {
			if(i + 1 == index) {
				continue;
			}
			newFuncs.push(funcs[i]);
		}
		this.listen[key] = newFuncs;
	}
}

/*
* 动画类
* 
*/
function Animate(){

}

Animate.prototype = {
	concat: function(direction, arguments){
		var newArr = [direction];
		for(var i = 0; i < arguments.length; i++){
			newArr.push(arguments[i]);
		}
		return newArr;
	},
	sliderLeft: function(el, distance, easing){
		var newArr = this.concat("left", arguments);
		this.slider.apply(this, newArr);
	},
	sliderRight: function(el, distance, easing){
		var newArr = this.concat("right", arguments);
		this.slider.apply(this, newArr);
	},
	slider: function(direction, el, distance, easing){
		var confObj = {},
			easingConf = "swing";

		//获取marginLeft初始值;
		var marginLeftNum = parseInt($(el).css("margin-left"));

		switch(direction) {
			case "right": 
				confObj["marginLeft"] = distance;
			break;
			case "left": 
				confObj["marginLeft"] = -distance;
			break;
		}
		if(easing) {
			easingConf = easing;
		}

		$(el).animate(confObj, easing, function(){
			// alert("finish");
		})	
	}
}


/*
* 程序主体
* init: 程序初始化;
* bind: 事件绑定;
* getInfor: 采取Backbone相关写法 
*/
function Doz(conf){ 	
 	this.init(conf);
}

Doz.prototype = {
	init: function(conf) {
		for(var i  in conf) {
			if(typeof conf[i] == "function")
			this[i] = conf[i];
		}

		//设置状态
		if(typeof conf.state == "object"){
			this.setState(conf.state);			
		}

		//绑定事件
		var events = conf["events"];
		if(typeof events == "object") {
			for(var key in events) {
				this.bind(key, events[key]);
			}
		}		
	},
	bind: function(eventName, func) {		
		var that = this;
		var eventObj = this.getEventInfo(eventName);
		if(typeof eventObj != "object") {
			return;
		}

		var ele = $(eventObj.selector);
		$(ele).each(function(index){		
			$(ele).eq(index).on(eventName, function(e){
				func && func.call(that, e, index);
			});
		});
	},
	getEventInfo: function(key){
		var keyArr = key.split(" ");		
		if(keyArr.length < 2) {
			return false;
		}
		//选择方
		var eventName = keyArr.pop(),
			selector = keyArr.join(" ");

		return {
			"name": eventName,
			"selector": selector 
		}
	},
	set: function() {
		this.curKey = arguments[0];
		this.setState(arguments[0], arguments[1]);		
		this.run(arguments[0], arguments[1]);
	},
	force: function(){
		if(this.curKey == null && arguments.length == 0){
			return false;
		}
		var key = arguments.length != 0 ? arguments[0] : this.curKey,
			val = this.getState(key);
		this.run(key, val);
	}
}



/*
*	加载器：可以加载各种插件
*/
Doz.prototype.use = function(inst){
	for(var i in inst) {
		var obj = inst.hasOwnProperty(i) == true ? this : Doz.prototype;		
		obj[i] = inst[i];	
	}
}
Doz.prototype.use(new State());
Doz.prototype.use(new PubSub());

