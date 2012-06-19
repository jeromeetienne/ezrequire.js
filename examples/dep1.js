console.log("Begining of dep1.js")

define(['dep0.js', 'dep2.js'], function(){
	console.log("all deps of dep1.js loaded")
})
//define([], function(){
//	console.log("all deps of dep1.js loaded")
//})
