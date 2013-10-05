/* 
 * This is the view for displaying results
 * Views keep an eye on a model (get data through model) and are only responsible for updating the DOM
 * All DOM manipulation are happening in views. EG., I assign the input to a variable
 * and use it later in controller to bind an event handler to it. 
 * Controller is (almost) not allowed to query the DOM
 */

define(['newsspec_4950/bootstrap'],
		function (news) {
	
	var $ = news.$, 
		pubsub = news.pubsub,
		ResultsView;

	ResultsView = function (model, inputElements, isMobile) {

	    this.model = model;
	    this.isMobile = isMobile;

	    this.intro = $('.introduction__text'); //intro
	    this.default = $('.results__default'); //panel with default values
	    this.defaultPanelData = this.model.defaultPanelData; //data for the default panel

	    this.allResults = $('.results__all'); //panel with all results
	    this.allResultsHeader = $('.results__all-header');
	    this.panels = {'gender' : $('.results__all-gender'),
						'location': $('.results__all-location'),
						'occupation' : $('.results__all-occupation')
			  };
	};

	ResultsView.prototype.checkIfAllSelected = function() {
		
	var count = 0;	
		for(panel in this.panels) {
			var singlePanel = this.panels[panel];
			if(singlePanel.hasClass('visible')) count++;
		}

		if (count === 3) {
			pubsub.emitEvent("all-three-panels-visible");
		}
	};

	ResultsView.prototype.addIntro = function() {

		this.intro.append("In " 
							+ this.defaultPanelData.currentMonth 
							+ " "
							+ this.defaultPanelData.currentYear
							+ " <span class='default-claims'>" + 
							this.defaultPanelData.ukClaims
							+ "m"
							+ "<\/span>, or <span class='default-percentage'>"
							+ this.defaultPanelData.ukRate 
							+ "%<\/span> of people are claiming Jobseeker's Allowance (JSA). To find out how people like you fit into this story enter your details into the form below."
                			);
	};

	ResultsView.prototype.insertDefaultValues = function() {

		this.default.append("<div>In " 
							+ this.defaultPanelData.currentMonth  
							+ " " 
							+ this.defaultPanelData.currentYear
							+ "<h4 class='results__uk-value claims-number'>" 
							+ this.defaultPanelData.ukClaims 
							+ "m<\/h4>, or <h4 class='results__uk-value claims-percentage'>" 
							+ this.defaultPanelData.ukRate
							+ "%<\/h4> of the workforce claimed Jobseeker's Allowance</div>");

		this.addIntro();
	};

	ResultsView.prototype.showResultsPanel = function() {
		this.default.hide();
		//this.allResults.show();
		this.allResults.css('display', 'block');
		this.addResultsHeader();
	};

	ResultsView.prototype.showPanel = function(type) {
		this.panels[type].addClass('visible');
		if (!this.isMobile) {
			this.handlePercentageColours(type);
		} else {
			for (var key in this.panels) {
                if (key !== type) {
                	this.panels[key].removeClass('visible');
            	}
            }
			
		}
		this.checkIfAllSelected();
		
	};

	ResultsView.prototype.displayGenderPanel = function() {
		this.showResultsPanel();
		this.showPanel('gender');
	};

	ResultsView.prototype.displayLocationPanel = function() {
		this.showResultsPanel();
		this.showPanel('location');
	};

	ResultsView.prototype.displayOccupationPanel = function() {
		this.showResultsPanel();
		this.showPanel('occupation');
	};

	ResultsView.prototype.addGenderPanelDescr = function(dataObject) {		
		this
		.panels['gender']
		.find('.results__all-your-choice').html(
			'In the UK ' 
			+ dataObject.claimsCurrentYear.substr(0, dataObject.claimsCurrentYear.length-6)
			+ ' '
			+ dataObject.choice.toLowerCase()
			+ ' '
			+ 'claimed JSA, a rate of'
			);

	};

	ResultsView.prototype.addLocationPanelDescr = function(dataObject) {

		//'East of England had [insert number] male JSA claimants, a rate of 

		var gender = (this.model.gender === '') ? '' : this.model.getGenderForCharts();

		this
		.panels['location']
		.find('.results__all-your-choice').html(
			dataObject.choice
			+ ' had '
			+ dataObject.claimsCurrentYear.substr(0, dataObject.claimsCurrentYear.length-6)
			+ gender 
			+' JSA claimants, a rate of'
			);

	};

	ResultsView.prototype.addOccupationPanelDescr = function(dataObject) {

		var gender = (this.model.gender === '') ? ' people ' : this.model.getGender().toLowerCase(),
			location = (this.model.location === '') ?  'UK had ' : this.model.location + ' had ' , 
			occupation = (this.model.occupation === '') ? '' : this.model.getOccupationForCharts(this.model.occupation);

		this
		.panels['occupation']
		.find('.results__all-your-choice').html(
			location
			+ dataObject.claimsCurrentYear.substr(0, dataObject.claimsCurrentYear.length-6) 
			+ gender 
			+ ' seeking work as '
			+ occupation
			+ ' a rate of'
			);

	};

	ResultsView.prototype.handlePercentageColours = function(type) {
		var panelsNodeList = $('.results__all-item');

		panelsNodeList.each(function() {
			$('.results__all-' + type).find('.percentage').removeClass('desaturated');
			panelsNodeList.not('.results__all-' + type).find('.percentage').addClass('desaturated');
        });
	};

	ResultsView.prototype.addResultsHeader = function(type) {
		this.allResultsHeader.html(
			this.defaultPanelData.currentMonth  
			+ " " 
			+ this.defaultPanelData.currentYear 
			);
	};

	ResultsView.prototype.handleDropdown = function(list, string) {
		var list = list,
			lists = document.getElementsByClassName('list');

		(~~list.hasClass('display') === 0) ? list.addClass('display') : list.removeClass('display');
		
		if(typeof string != "undefined") {
			string = (string.length > 25) ? string.split(" ")[0] + " " + string.split(" ")[1] + " " + string.split(" ")[2] + '...' : string
			$((list[0].previousElementSibling).getElementsByTagName('span')[0]).text(string);
		}
	};


	ResultsView.prototype.updatePanel = function(rootPanel, dataObject) {

		var relativeRateEl = $(rootPanel + ' .results__all-relative h4'),
			lastYearEl = $(rootPanel + ' .last-year span'),
			fiveYearsAgoEl = $(rootPanel + ' .five-years-ago span'),
			dataObject = dataObject,
			rateRelative = dataObject.rateRelative;


		//$(rootPanel + ' .results__all-your-choice').html(dataObject.choice);
		$(rootPanel + ' .percentage').html(dataObject.rateCurrentYear);
		$(rootPanel + ' .number').html(dataObject.claimsCurrentYear);

		(rateRelative !== '') ? relativeRateEl.html(rateRelative + '%') : (relativeRateEl.html(''));
		
		if(rateRelative > 0 ) {
			relativeRateEl.removeClass().addClass('up');
			$(rootPanel + ' .percentage').removeClass('no-data');
		} else if (rateRelative < 0 ) {
			relativeRateEl.removeClass().addClass('down');
			$(rootPanel + ' .percentage').removeClass('no-data');
		} else if (rateRelative === 0) {
			relativeRateEl.removeClass().addClass('zero');
			$(rootPanel + ' .percentage').removeClass('no-data');
		} else if (rateRelative === "") {
			relativeRateEl.removeClass();
			$(rootPanel).addClass('no-data');
			$(rootPanel + ' .results__all-your-choice').html('There is not enough data to calculate a rate for this selection');
		}

		lastYearEl.html(dataObject.rateLastYear);
		fiveYearsAgoEl.html(dataObject.rateFiveYearsAgo);
	};

	ResultsView.prototype.updateGenderPanel = function() {
		this.addGenderPanelDescr(this.model.genderPanelData);
		this.updatePanel('.results__all-gender', this.model.genderPanelData);	
	};

	ResultsView.prototype.updateLocationPanel = function() {
		this.addLocationPanelDescr(this.model.locationPanelData);
		this.updatePanel('.results__all-location', this.model.locationPanelData);	
	};

	ResultsView.prototype.updateOccupationPanel = function() {
		this.addOccupationPanelDescr(this.model.occupationPanelData);
		this.updatePanel('.results__all-occupation', this.model.occupationPanelData);
	};

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
	};

	ResultsView.prototype.init = function () {
		this.addListeners();
	};

	return ResultsView;
});