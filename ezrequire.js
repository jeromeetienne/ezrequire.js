var EzRequire	= {};

EzRequire.urlModifiers	= [];

EzRequire._loadedUrls	= [];
EzRequire._scripts	= {};

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
	script.onload	= onLoad;
	script.onerror	= onError	|| function(){
		alert("Loading failed!");
	}
	script.setAttribute('src', scriptUrl);
	document.getElementsByTagName('head')[0].appendChild(script);
	return script;
}

EzRequire.checkAllDeps	= function(){
	
	for(var j = 0; j < scriptUrls.length; j++){
			var scriptUrl	= scriptUrls[i];
			var isLoaded	= loadedUrls.indexOf(scriptUrl) !== -1;
			if( !isLoaded )	return false;
		}
		return true;
	}
}


EzRequire.require = function(name, deps, callback){
	// handle polymorphism
	
	// sanity check - variable types is strict
	console.assert(deps instanceof Array);
	console.assert(typeof(name) === 'string');
	console.assert(typeof(callback) === 'function');
	
	console.log("REQUIRE ", name, "***********")
	console.log("deps", deps)
	
	var loadedUrls	= EzRequire._loadedUrls;
	
	// build scriptUrls and apply urlModifiers
	var scriptUrls	= [];
	for(var i = 0; i < deps.length; i++){
		var scriptUrl	= deps[i];
		for(var j = 0; j < EzRequire.urlModifiers.length; j++){
			var urlModifier	= EzRequire.urlModifiers[j];
			scriptUrl	= urlModifier(scriptUrl);
			console.log("post modif", scriptUrl, j)
		}
		scriptUrls.push(scriptUrl)
	}
	
	console.assert(EzRequire._scripts[name] === undefined)
	EzRequire._scripts[name]	= {
		scriptUrls	: scriptsUrl,
		callback	: callback
	};
	
	var allDepsLoaded	= function(){
		for(var i = 0; i < scriptUrls.length; i++){
			var scriptUrl	= scriptUrls[i];
			var isLoaded	= loadedUrls.indexOf(scriptUrl) !== -1;
			if( !isLoaded )	return false;
		}
		return true;
	}
	
	for(var i = 0; i < scriptUrls.length; i++){
		var scriptUrl	= scriptUrls[i];
		var isLoaded	= loadedUrls.indexOf(scriptUrl) !== -1;
		if( isLoaded )	continue;
		EzRequire._loadScript(scriptUrl, function(){
			console.log("loaded", scriptUrl)
			loadedUrls.push(scriptUrl)
			if( allDepsLoaded() ) callback();
		})
	}

	if( allDepsLoaded() ) callback();

	console.log("END", name, "***********")
}

/**
 * exactly the same as require()
*/
EzRequire.define = EzRequire.require;


