console.log("Begining of dep2.js");

EzRequire.define(['dep0.js'], function(){
	console.log("module dep2.js ready")
});