function Storage( key, value ){
	// Key = 'k' , value =" "
	if( typeof key != 'undefined' && typeof key != 'undefined'  ){

		if(  typeof value != 'undefined' ){
			Storage.set(key,value );
		} else{
			Storage.get(key );
		}
	} 
}



//  通过 key 获取值
Storage.get = function( key ){
	var value = localStorage.getItem(key);
	if(  value ){
		value = JSON.parse( value );

		if( value.type == 'object' ){
			value = JSON.parse( value.value );
		} else{
			value = value.value;
		}
	}
	return value;
}
//  设置localstorage
Storage.set = function( key, value ){
	
	var type = (typeof value );

	if( type == 'object'){
		value = JSON.stringify( value );
	}

	var obj = { 
		type : type,
		value: value
	 };

	return localStorage.setItem(key, JSON.stringify(obj) );
}
Storage.del = function(key ){
	localStorage.removeItem(key);
}



//  user 扩展 设置
Storage.userset = function( user, init){
	var user_list =  Storage.get('user_list');
	if( user.id == -1 ){
		if( !user_list ){
			user_list = [1];
		}
		user.id = parseInt( user_list[ user_list.length -1 ] )+ 1;
		user_list.push( user.id  );
		Storage.set( 'user_list', user_list );
	} 
	if(init){
		if(!user_list) {
			user_list = [];
		}
		user_list.push( user.id  );
		Storage.set( 'user_list', user_list );
	}
	Storage.set( 'user_'+ user.id, user );
}
// 获取
Storage.userget = function( id ){
	return Storage.get( 'user_'+ id );
}
// 获取全部
Storage.usergetAll = function( id ){
	var alluser = Storage.get('user_list') ;
	alluser = alluser || [];

	var users = [];
	for(var i =0; i< alluser.length ; i++){
		var item = Storage.get( 'user_' + alluser[i] );
		if( item ){
			users.push( item );
		}
		
	}
	return users;
}
Storage.userdel = function( id ){
	var alluser = Storage.get('user_list');
	alluser = alluser || [];
	for( var i=0; i< alluser; i ++){
		if( alluser[i] == id ){
			alluser.splice( i, 1 );
			break;
		}
	}
	Storage.set( 'user_list', alluser );
	Storage.del( 'user_'+ id  );
}



window.store = Storage;

