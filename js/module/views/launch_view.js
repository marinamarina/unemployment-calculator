define(['newspec_4950/bootstrap'],
	function (news) {
	
	var $ = news.$,
		LaunchView;

	LaunchView = function (rootObject) {
		this.rootObject = $(rootObject);
		this.launchButton = {};
		this.closeButton = {};
    }

	LaunchView.prototype.init = function() {
		this.rootObject
        .before('<div id="newsspec_4950-launch"><img src="/news/special/2013/newsspec_4950/img/placeholder_launch.gif" alt="placeholder"/>' +
                '<div id="launch-calculator" href="#"><img class="no-replace" src="/news/special/2013/newsspec_4551/img/launch_icon.png" alt=""/><span>Launch calculator</span></a></div>')
        .prepend('<div class="close-calculator back" href="#"><div class="back"></div>back to story</div>')
        .append('<div class="close-calculator back" href="#">back to story</div>')
        .appendTo($('body'));

        this.launchButton = $('#launch-calculator')[0];
        this.closeButton = $('.close-calculator');
	}
	
	return LaunchView;
})