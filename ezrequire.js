var EzRequire	= {};

EzRequire.urlModifiers	= [];

EzRequire._depStatuses	= {};
EzRequire._defines	= {};

/**
 * Load a script
 * 
 * @param {script} scriptUrl url of the script to load
 * @param {Function} onLoad function called when the script is loaded
 * @param {Function} onError function called when the script failed to load
*/
EzRequire._loadScript	= function(scriptUrl, onLoad, onError){
	console.log("loadScript(", scriptUrl,")")
	var script	= document.createElement('script');
	script.onload	= function(){
		console.log("_loadScript(): loaded ", scriptUrl)
		onLoad();
	};
	script.onerror	= onError	|| function(){
		alert("Loading failed!");
	}
	script.setAttribute('src', scriptUrl);
	document.getElementsByTagName('head')[0].appendChild(script);
	return script;
}

EzRequire._checkAllDefines	= function(){
	console.log("checkAllDefines *********** BEGIN")
	Object.keys(EzRequire._defines).forEach(function(name){
		var define	= EzRequire._defines[name];
		console.log("checkAllDefines check define", name)
		for(var i = 0; i < define.deps.length; i++){
			var depUrl	= define.depUrls[i];
			var depStatus	= EzRequire._depStatuses[depUrl];
			console.log("checkAllDefines dep", depUrl, depStatus)
			if( depStatus !== 'ready' )	return;
		}
		console.log("checkAllDefines depStatus", EzRequire._depStatuses[define.name], define.name)
		console.log("checkAllDefines depStatus", JSON.stringify(EzRequire._depStatuses))

		console.assert( EzRequire._depStatuses[define.name] === "loaded" );

		define.callback();

		EzRequire._depStatuses[define.name] = "ready";
		delete EzRequire._defines[name];

		setTimeout(function(){
			EzRequire._checkAllDefines();
		}, 0)
	});
	console.log("checkAllDefines *********** END")
};


EzRequire.define = function(name, deps, callback){
	// handle polymorphism
	if( typeof(name) !== 'string' ){
		callback	= deps;
		deps		= name;
		
		var scripts	= document.querySelectorAll('head script')
		var script	= scripts[scripts.length-1];
		name	= script.src;
	}
		
	// sanity check - variable types is strict
	console.assert(deps instanceof Array);
	console.assert(typeof(name) === 'string');
	console.assert(typeof(callback) === 'function');
	
	console.log("******** DEFINE Begin", name, deps)

	////////////////////////////////////////////////////////////////////////
	// build scriptUrls and apply urlModifiers
	var newDeps	= [];
	for(var i = 0; i < deps.length; i++){
		var newDep	= deps[i];
		for(var j = 0; j < EzRequire.urlModifiers.length; j++){
			var urlModifier	= EzRequire.urlModifiers[j];
			newDep	= urlModifier(newDep);
		}
		newDeps.push(newDep)
	}
	deps	= newDeps;
	
	
	var depUrls	= [];
	var baseUrl	= location.href.replace(/[^/]*$/, '')
	deps.forEach(function(dep){
		var depUrl	= dep + (dep.match(/\.js$/) ? '' : '.js');
		depUrl		= baseUrl + depUrl;
		depUrls.push(depUrl)
	});

//////////////////////////////////////////////////////////////////////////////////
	console.assert(EzRequire._defines[name] === undefined)
	EzRequire._defines[name]	= {
		name		: name,
		deps		: deps,
		depUrls		: depUrls,
		callback	: callback
	};

	console.assert( EzRequire._depStatuses[name] === undefined || EzRequire._depStatuses[name] === "loading");
	if( name.match(/^require-/) ){
		EzRequire._depStatuses[name]	= "loaded"
	}else{
		EzRequire._depStatuses[name]	= "loading"
	}
//////////////////////////////////////////////////////////////////////////////////

	deps.forEach(function(dep, depIdx){
		if( dep.match(/\.js$/) ){
			var depUrl	= depUrls[depIdx];
			if( EzRequire._depStatuses[depUrl] !== undefined )	return;
			EzRequire._depStatuses[depUrl]	= 'loading';
			EzRequire._loadScript(depUrl, function(){
				EzRequire._depStatuses[depUrl]	= 'ready';
	console.log("blablablabla", JSON.stringify(EzRequire._depStatuses), depUrl)
				EzRequire._checkAllDefines();
			}, function(){
				EzRequire._depStatuses[depUrl]	= 'error';
				console.warn('cant load '+depUrl)
			})
		}else{
			var depUrl	= depUrls[depIdx];
			if( EzRequire._depStatuses[depUrl] !== undefined )	return;
			EzRequire._depStatuses[depUrl]	= 'loading';
			EzRequire._loadScript(depUrl, function(){
				EzRequire._depStatuses[depUrl]	= 'loaded';
	console.log("blablablabla", JSON.stringify(EzRequire._depStatuses), depUrl)
				EzRequire._checkAllDefines();
			}, function(){
				EzRequire._depStatuses[depUrl]	= 'error';
				console.warn('cant load '+depUrl)
			})
		}		
	});

	EzRequire._checkAllDefines();

	console.log("******** DEFINE End ", name)
}

EzRequire._requireModuleId	= 0
/**
 * same as define() - the moduleId is automatically generater
*/
EzRequire.require	= function(deps, callback){
	var moduleId	= "require-"+(EzRequire._requireModuleId++);
	return EzRequire.define(moduleId, deps, callback)
}


