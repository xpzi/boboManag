/*
 添加的商品信息就保存 localstorage中
 
 此对象，就是  对商品管理对象
 包含保存、读取
 * */

function StorageSp(  ){
	this.storageKey = '__allsp';
	
	//sp对象中为方便使用，缓存到内存中
	this.items = [];
	this.Sp = {};
	
	//为避免反复读取文件  为此保存在内存中。关闭窗口时才保存
	//需要删除的 商品
	this.delItems = [];
	//需要修改的商品
	this.updata = [];
	//新添加的商品
	this.addItem = [];
	
	//退出时保存数据
	// var self = this;
	// $(window).unload(function () {
	// 	self.saveItems();
	// });
	
	//加载已有的商品
	this.Sp = this.loadSp();
	this.items = this.Sp.list;
}

//加载商品列表
StorageSp.prototype.loadSp = function(){
	var spStr = localStorage != null ? localStorage[this.storageKey] : null;
	if( spStr != null && JSON != null ){
		var Sp =  JSON.parse( spStr );
	} else{
		var Sp = {
			maxId : '1',
			list:[]
		}
	}
	return Sp;
}



//保存商品列表
StorageSp.prototype.saveItems = function(){
	localStorage[this.storageKey] = JSON.stringify( this.Sp );
	console.log( JSON.parse( localStorage[this.storageKey] ) );
}

//添加一个 修改 商品
StorageSp.prototype.addSp = function( spItem ){
	console.log( spItem );
	var flug = -1;
	if( spItem.id >0 ){
		flug = spItem.id;
		//表示已经存在
		for( var i =0, len = this.items.length ; i < len ; i++){
			if( spItem.id == this.items[i].id ){
				this.items[i] = spItem;
				break;
			}
		}
		if( i == len ){
			
		}
	} else{
		//该商品还没有添加过
		spItem.id =  ++this.Sp.maxId;
		this.items.push( spItem );
	}
	
	this.saveItems();
	// 返回 true  表示添加成功  false 表示添加失败
	return flug;
}

// 删除一个商品
StorageSp.prototype.delItem = function( spItem ){
	var spId =  typeof spItem == "object" ? spItem.id : spItem ;
	for(var i =0 , len = this.items.length; i< len ; i++){
		if(spId == this.items[i].id  ){
			this.items.splice(i, 1);
			break;
		}
	}
	this.saveItems();
	return i != len;
}

//获取一个商品的信息
StorageSp.prototype.getItem = function( key ){
	for(var i =0 , len = this.items.length; i< len ; i++){
		if(spId == this.items[i].id  ){
			return  this.items[i];
		}
	}
	return null;
}

//获取全部商品
StorageSp.prototype.getAll = function(  ){
	if( this.items ){
		
	} else{
		this.Sp = this.loadSp();
		this.items = this.Sp.list; 
	}
	return this.items;
}