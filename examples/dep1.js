console.log("Begining of dep1.js")

//define(['dep0.js', 'dep2'], function(){
//	console.log("all deps of dep1.js loaded")
//})
define(['dep2', 'dep0.js'], function(){
	console.log("all deps of dep1.js loaded")
})
