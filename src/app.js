var homestr = require( './tpl/home.string' );
var common = require('./utils/common.util.js');
require( './utils/localstorage.js' );
console.log( common );
common.rander( homestr);


// var storage = require( './storageSp.js' );
var storage = new StorageSp();
var houtai = angular.module('AngularStore', ['ui.router']);




//数据共享
houtai.factory('DataSpList', function() {
  var splist = storage.getAll();
  return {
    splist: splist
  }
});




// 路由配置
houtai.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/src/tpl/home.html',
			controller: 'homeController'
		})
		.state('splist', {
			url: '/splist',
			templateUrl: '/src/tpl/splist.html',
			controller: 'splistController'
		}).
		state('addsp', {
			url:'/addsp/:spid',
			templateUrl:'/src/tpl/addsp.html',
			controller: 'addspController'
		})
		.state('user',{
			url: '/user',
			templateUrl: '/src/tpl/user.html',
			controller: 'userController'
		})
		.state('adduser',{
			url: '/adduser/:id',
			templateUrl: '/src/tpl/adduser.html',
			controller: 'adduserController'
		})
}]);








//设置路由默认页面
houtai.config(function($urlRouterProvider){
	$urlRouterProvider.otherwise('/home');
});









// 控制器
houtai.controller('mainController', ['$scope' ,'DataSpList', function($scope, DataSpList){
	$scope.leftnavlist = function( index){
		$scope.curPosition = index;
	};
	$scope.curPosition = 0;
	$scope.test = 'test';
	$scope.navlist = [{
		href: '#home',
		title: 'home'
	},{
		href: '#addsp/-1',
		title: '添加商品'
	},{
		href: '#splist',
		title: '商品列表'
	},{
		href: '#user',
		title: '用户中心'
	},{
		href: '#adduser/-1',
		title: '添加用户'
	},{
		href: '#',
		title: '待处理订单'
	},{
		href: '#',
		title: '订单列表'
	}];

}])



//商品列表控制器
houtai.controller('splistController', ['$scope','DataSpList', '$http','$stateParams',function($scope,DataSpList,$http,$stateParams){
	$scope.splist = DataSpList.splist;
	$scope.sptitle = '';
	$scope.id = '';
	$scope.keyword="";


	if( $scope.splist.length == 0){

		$http({
		    url: '/mock/sp.string',
		    method: 'get'
	  	})
	  	.then(function(res){
	  		storage.items = res.data;
	  		storage.Sp.list = storage.items;
	  		$scope.splist = storage.items;
		})
	}

	$scope.delSp = function( spid, index ){
		$scope.sptitle = $scope.splist[index].name;

		$scope.id = spid;
		$('#myModal').modal('show');
	}
	$scope.delSpOk = function(){
		$('#myModal').modal('hide');
		storage.delItem( $scope.id );
	}
	$scope.serach = function( index ){
		if(  index.name.indexOf( $scope.keyword) < 0 && index.introduce.indexOf( $scope.keyword) < 0){
			return false;
		} else{
			return true;
		}
	}
}]);






// 首页 控制器
houtai.controller('homeController', ['$scope',function($scope){
	
}]);






// 添加商品 控制器
houtai.controller('addspController' ,['$scope','$stateParams','DataSpList',function($scope,$stateParams,DataSpList){
	$scope.item = {};
	$scope.caozuo ="添加商品";
	if( parseInt( $stateParams.spid) > 0 ){
		$scope.caozuo ="修改商品";
		for(var i =0 ,len = DataSpList.splist.length; i< len ; i++ ){
			if( DataSpList.splist[i].id == $stateParams.spid ){
				$scope.item = DataSpList.splist[i];
				break;
			}
		}
	}else{
		$scope.item = initSpObj();
		$scope.item.id =  $stateParams.spid;
	}

	$scope.savesp = function(){
		var item = $scope.item;
		if(item.introduce == '' || item.imgpath == '' || item.pirse == '' || item.name == '' ){
			alert('请填写必填');
			return;
		}
		if( storage.addSp(item) > 0 ){
			$scope.caozuo ="修改商品";
		}else{
			$scope.caozuo ="添加商品";
			$scope.item = initSpObj();
			$scope.item.id =  $stateParams.spid;
		}
		alert( '添加成功' );

	}

}]);












// 用户 控制器
houtai.controller('userController' , ['$scope',  '$http',function($scope, $http){
	$scope.keyword = '';
	$scope.users = store.usergetAll();
	$scope.sptitle='';
	$scope.id='';
	$scope.index='';
	$scope.isStorage=true;

	// console.log( JSON.stringify( $scope.users ) );
	if( $scope.users.length == 0){

		$http({
		    url: '/mock/user.string',
		    method: 'get'
	  	})
	  	.then(function(res){
	  		$scope.isStorage=false;
			$scope.users = res.data;
		})

	}

	$scope.querendel = function( userid , index){
		//store.userdel(userid);
		$scope.sptitle = $scope.users[index].name;
		$scope.id = userid;
		$scope.index = index;
		$('#myModal').modal('show');
	}
	$scope.delSpOk = function(){
		$('#myModal').modal('hide');
		$scope.users.splice($scope.index, 1);
		if( $scope.isStorage){
			store.userdel($scope.id);
		} else{
			for( var i =0; i < $scope.users.length; i++){
				store.userset( $scope.users[i] , true);
			}
			$scope.isStorage = true;
		}

	}

}]);




// 添加用户 控制器
houtai.controller('adduserController' , ['$scope', '$stateParams', function($scope,$stateParams){
	
	if( $stateParams.id ==  -1 &&   !$scope.user){
		$scope.user = newuserObj();
	} else if( !$scope.user ){
		$scope.user = store.userget(  $stateParams.id );
	}

	console.log( $scope.user);

	$scope.tishi = '';
	$scope.huodefocus = function(){
		$scope.tishi = '';
		console.log( 0);
	}

	$scope.addUser= function( ){
		var user = $scope.user;
		var fulg = user.id;
		console.log( user  );
		if( !user.name ){
			$scope.tishi="请输入姓名";
			return;
		}
		if( !user.xingbie ){
			$scope.tishi="请输入性别";
			return;
		}
		if( !user.both ){
			$scope.tishi="请输入出生年月";
			return;
		}
		if( !user.emil ){
			$scope.tishi="请输入邮箱";
			return;
		}
		if( !user.phone ){
			$scope.tishi="请输入电话号码";
			return;
		}

		store.userset( $scope.user );
		if(fulg  == -1){
			$scope.user = newuserObj();
		}

	}

}]);














function initSpObj(){
	return {
		id :null,
		name : '',
		pirse : '',
		imgpath : '',
		introduce : ''
	}
}

function newuserObj( ){
	return {
		name: '',
		xingbie:'',
		age:'',
		both:'',
		jiguan:'',
		mingzu:'',
		school:'',
		xueli:'',
		zhengzhi:'',
		zhuanye:'',
		qq:'',
		emil:'',
		phone:'',
		other:'',
		id: -1
	}
}
