// This is an application entry point 
define(['module/controller/controller'],
	function(Controller) {

		function init(isDesktop) {
			Controller.init(isDesktop);
		}
	return {init: init};	

})