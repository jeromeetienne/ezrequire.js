console.log("Begining of dep1.js")

require('dep1.js', ['dep0.js', 'dep2.js'], function(){
	console.log("all deps of dep1.js loaded")
})
