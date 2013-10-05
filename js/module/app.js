/*
 * Application entry point
 */

define(['newsspec_4950/module/controller/controller'],
	function (Controller) {

		function init(isMobile) {
			Controller.init(isMobile);
		}
		return {init: init};	
    }
);