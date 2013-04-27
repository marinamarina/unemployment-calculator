/*This is the view for displaying results*/
//VIEW keeps an eye on a model and is responsible for updating the DOM

//in fact, all DOM manipulation are happening in views. EG., I assign the input to a variable
//and use it later in controller to bind an event handler to it. Controller is (almost) not allowed to query the DOM

define(['newspec_4950/bootstrap'],
		function (news) {
	
	var $ = news.$, 
		pubsub = news.pubsub,
		ResultsView;

	ResultsView = function (model, inputElements) {

	    this.model = model;

	    this.default = $('#newsspec_4950 .results__default'); //panel with default values
	    this.allResults = $('#newsspec_4950 .results__all'); //panel with results
	    
	}

	ResultsView.prototype.insertDefaultValues = function(dataObject) {

		var defaultClaims = (dataObject.ukClaims/1000000).toFixed(2),
			defaultRate = (dataObject.ukRate * 100).toFixed(1);

		this.default.append("<div><h4 class='results__uk-value claims-number'>" 
							+ defaultClaims 
							+ " million<\/h4> people claim jobseekers allowance <h4 class='results__uk-value claims-percentage'>" 
							+ defaultRate 
							+ "%<\/h4> of the UK population.</div>");

	}

	ResultsView.prototype.showResultsPanel = function() {
		this.default.hide();
		//this.allResults.show();
		this.allResults.css('display', 'block');
	}
	ResultsView.prototype.showGenderPanel = function() {
		$('.results__all-gender').addClass('visible');
	}
	ResultsView.prototype.showLocationPanel = function() {
		$('.results__all-location').addClass('visible');
	}
	ResultsView.prototype.showOccupationPanel = function() {
		$('.results__all-occupation').addClass('visible');
	}
	ResultsView.prototype.displayGenderPanel = function() {
		this.showResultsPanel();
		this.showGenderPanel();
	}
	ResultsView.prototype.displayLocationPanel = function() {
		this.showResultsPanel();
		this.showLocationPanel();
	}
	ResultsView.prototype.displayOccupationPanel = function() {
		this.showResultsPanel();
		this.showOccupationPanel();
	}
	ResultsView.prototype.handleDropdown = function(list, string) {
		var list = list,
			lists = document.getElementsByClassName('list');

		(~~list.hasClass('display') === 0) ? list.addClass('display') : list.removeClass('display');
		
		if(typeof string != "undefined") {
			string = (string.length > 25) ? string.split(" ")[0] + " " + string.split(" ")[1] + '...' : string
			$((list[0].previousElementSibling).getElementsByTagName('span')[0]).text(string);
		}
		//TODO hide a select which is not selected
		//for (var i=0; i<lists.length; i++)
			//$(lists[i]).hasClass('visible');
		//console.log($(lists[i]).hasClass('display'))
	}
	ResultsView.prototype.updatePanel = function (rootPanel, dataObject) {

		var relativeRateEl = $(rootPanel + ' .results__all-relative h4'),
			lastYearEl = $(rootPanel + ' .last-year span'),
			fiveYearsAgoEl = $(rootPanel + ' .five-years-ago span'),
			dataObject = dataObject,
			rateRelative = dataObject.rateRelative;


		$(rootPanel + ' .results__all-your-choice').html(dataObject.choice);
		$(rootPanel + ' .percentage').html(dataObject.rateCurrentYear);
		$(rootPanel + ' .number').html(dataObject.claimsCurrentYear);

		(rateRelative !== "") ? relativeRateEl.html(rateRelative + "%") : (relativeRateEl.html(""))
		
		if(rateRelative > 0 ) {
			relativeRateEl.removeClass().addClass('up');
			$(rootPanel + ' .percentage').removeClass('no-data');
		} else if (rateRelative < 0 ) {
			relativeRateEl.removeClass().addClass('down');
			$(rootPanel + ' .percentage').removeClass('no-data');
		} else if (rateRelative === 0) {
			relativeRateEl.removeClass().addClass('zero');
			$(rootPanel + ' .percentage').removeClass('no-data');
		} else if (rateRelative ==="") {
			relativeRateEl.removeClass();
			$(rootPanel + ' .percentage').addClass('no-data');
		}

		lastYearEl.html(dataObject.rateLastYear);
		fiveYearsAgoEl.html(dataObject.rateFiveYearsAgo);

	}
	ResultsView.prototype.updateGenderPanel = function() {
		this.updatePanel('.results__all-gender', this.model.genderPanelData);
		
	}
	ResultsView.prototype.updateLocationPanel = function() {
		this.updatePanel('.results__all-location', this.model.locationPanelData);
		
	}
	ResultsView.prototype.updateOccupationPanel = function() {
		this.updatePanel('.results__all-occupation', this.model.occupationPanelData);	
	}
	ResultsView.prototype.addListeners = function() {

		var that = this;
		
		pubsub.addListener('gender-object-updated', function() {
	    	that.updateGenderPanel();
	    	that.updateLocationPanel();
	    	that.updateOccupationPanel();
	    });
	    pubsub.addListener('location-object-updated', function (chosenLocation) {
			that.updateLocationPanel();
			that.updateOccupationPanel();
		});
		pubsub.addListener('occupation-object-updated', function () {
			that.updateOccupationPanel();
		});
	}
	ResultsView.prototype.init = function () {
		this.addListeners();
	}


	return ResultsView;
})