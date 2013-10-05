//model does not know about controller and views, it has only access to data
//model holds default data, every time there is a change, model notify its subscribers (views)  
define(['newsspec_4950/bootstrap',
		'newsspec_4950/data/app-data-june2013',
		'newsspec_4950/data/occupations',
		'newsspec_4950/data/locations'
	], 
	function (news, data, occupations, locations) {

		var pubsub = news.pubsub,
			CalculatorModel;

		CalculatorModel = function () {

			this.data = data.data;
			this.occupations = occupations;
			this.currentYear = '' + data.currentYear; //query_string_1
			this.currentMonth = data.currentMonth;

			this.gender = ''; //query_string_2
			this.location = ''; //query_string_3
			this.occupation = ''; //query_string_4

		    this.occupationText = '';
		    
		    this.queryPattern = /([\d]{4})([M,F]{1})?([\d-]+)?([A-Za-z&\s]+)?$/;
		    this.defaultPanelData = {'currentYear' : this.currentYear,
		    						 'currentMonth' : this.currentMonth,
		    						 'ukClaims' : (this.data[this.currentYear].claims / 1000000).toFixed(1),
									 'ukRate' : (Math.round(this.data[this.currentYear].rate * 100)) / 10,
									 'monthlyData' : this.data[this.currentYear].monthlyData
									};
		    this.genderPanelData = {};
	        this.locationPanelData = {};
		    this.occupationPanelData = {};
		    this.locationBubbleChartData = [];
		    this.occupationBubbleChartData = [];
		    this.lineChartData = [];
		};

		/* 
		 * Basic Getters 
		 */

		CalculatorModel.prototype.getGender = function () {
			return (this.gender === 'M') ? 'Men' : 'Women';
		};

//		CalculatorModel.prototype.getGenderForCharts = function () {
//			return (this.gender === 'M') ? 'male' : 'female';
//		};
		
		CalculatorModel.prototype.getGenderForCharts = function () {
//			alternatively return lowercase in and then for getGender make use of this.capitaliseFirstLetter(str)
			var gender = this.getGender();
			return gender.toLowerCase();
		}

		CalculatorModel.prototype.getRate = function (rate) {
	        if (parseFloat(rate) === -1) return 'No data';
			return parseFloat( (rate * 100).toFixed(1) );

		};

//		CalculatorModel.prototype.getFormattedRate = function (rate) {
//			if (parseFloat(rate) === -1) return 'No data';
//			return (rate * 100).toFixed(1) + '%';
//		};

		CalculatorModel.prototype.getFormattedRate = function (rate) {
			var rate = this.getRage(rate);
			return (rate === 'No data') ? rate: rate + '%';
		};

		CalculatorModel.prototype.getRelativeRate = function (rateNew, rateOld) {
			if(rateNew === -1 || rateOld === -1) return false;
			
			var relativeRate = rateNew - rateOld;

	        relativeRate = isNaN(relativeRate) ? '' : (rateNew === rateOld) ? Math.round(relativeRate) : Math.round(relativeRate * 10) / 10;

			return relativeRate;
		};

		CalculatorModel.prototype.getClaims = function (claims) {
			return this.numberWithCommas(claims.toFixed(0)) + ' claims';
		};

		CalculatorModel.prototype.getOccupationForCharts = function (code) {
			return (this.occupations[code].forCharts);
		};

		CalculatorModel.prototype.getOccupationForDropdown = function (code) {
			return this.occupations[code].forDropdown;
		};

		CalculatorModel.prototype.convertMonthToNumber = function () {
			var monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				count;

			for (var i = 0; i < monthsArr.length; i ++)
				if(monthsArr[i] === this.currentMonth) {
					count = i + 1;
					break;
				}
			 // monthsArr.indexOf(this.currentMonth) + 1;
			return count;
		};

		CalculatorModel.prototype.toString = function () {
			return this.currentYear + this.gender + this.occupation + this.location; 
		};

		/* 
		 * Utility Functions
		 */

		 /* Basic array sorting function */
		CalculatorModel.prototype.simpleSort = function (data) {
            return data.sort(function(a, b) { return a > b ? 1 : -1});
        };

        /* Sorting helper to sort objects by one property */
	   	CalculatorModel.prototype.sortByProperty = function (a, b, property) {
	        return a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
	    };

	    /* Sorts array of objects for the  label position */
	    CalculatorModel.prototype.sortDataForLabelsPosition = function (array) {
	    	var that = this;

	    	array.sort(function (a, b, property) {
                return that.sortByProperty(a, b, 'bubblesPosition');
            });
            return array;
	    };

	    CalculatorModel.prototype.sortDataForBubbleChart = function (data) {
	        var i,
	        	sortedData = []
	        	that = this;

	        data.sort(function(a, b, property) {
	            return that.sortByProperty(a, b, 'rate');
	        });

	        for (i = 0; i < data.length; i++) {
	            var a = {};
	            a.descr = data[i].descr;
	            a.key = data[i].key;
	            a.rate = data[i].rate;
	            sortedData.push(a);
	        }
	        
	        return sortedData;
		};

		CalculatorModel.prototype.capitaliseFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

		CalculatorModel.prototype.numberWithCommas = function(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		};

		/* 
		 * Updating the model 
		 */
		CalculatorModel.prototype.updateModel = function(gender, location, occupation) {
			//when conditional is true there is no assignment happening
			// would this be what you would have wanted this.gender = (gender === '') ? this.gender : gender; OR simply if (gender !== '') this.gender = gender
			this.gender = (gender === '') ? this.gender : gender;
			(location === '') ? this.location : this.location = location;
			(occupation === '') ? this.occupation : this.occupation = occupation;
//			could you not have used the class variables directly here? 
			var query = this.toString(),
				match = query.match(this.queryPattern),
				yearMatch = parseInt(match[1]),
				genderMatch = match[2] || '',
				occupationMatch = match[3] || '',
				locationMatch = match[4] || ''; 
			
			this.updateGenderPanelData(yearMatch, genderMatch);
			this.updateLocationPanelData(yearMatch, genderMatch, locationMatch);
		    this.updateOccupationPanelData(yearMatch, genderMatch, locationMatch, occupationMatch);

			if (gender != '') {
				this.updateLocationBubbleChartData();
				this.updateOccupationBubbleChartData ();
				pubsub.emitEvent('gender-object-updated');

			} else if (location !== '') {
				this.updateOccupationBubbleChartData();
				pubsub.emitEvent('location-object-updated', [this.location]);
			} else if (occupation !== '') {
				this.updateOccupationBubbleChartData();
	             pubsub.emitEvent('occupation-object-updated', [this.occupation]);
	        }
			
		};

		/* 
		 * Updating three results panels data
		 */
		CalculatorModel.prototype.updateGenderPanelData = function(yearMatch, genderMatch) {
			
			var obj = this.data[yearMatch + genderMatch];

			this.genderPanelData =
				{'choice' : this.getGender(),
				'rateCurrentYear' : this.getFormattedRate(obj.rate),
				'rateLastYear' : this.getFormattedRate(this.data[''+(yearMatch-1) + genderMatch].rate),
				'rateRelative' : this.getRelativeRate(this.getRate(obj.rate),this.getRate(this.data['' + (yearMatch-1) + genderMatch].rate)),
				'claimsCurrentYear' : this.getClaims(obj.claims),
				'monthlyData' : obj.monthlyData
				}
		};

		CalculatorModel.prototype.updateLocationPanelData = function (yearMatch, genderMatch, locationMatch) {
	        
	        var obj = this.data[yearMatch + genderMatch + locationMatch];

	        this.locationPanelData = 
			    {'choice' : this.location,
			     'rateCurrentYear' : this.getFormattedRate(obj.rate),
			     'rateLastYear' : this.getFormattedRate(this.data[''+(yearMatch-1) + genderMatch + locationMatch].rate),
			     'rateRelative' : this.getRelativeRate(this.getRate(obj.rate),this.getRate(this.data[''+(yearMatch-1) + genderMatch + locationMatch].rate)),
			     'claimsCurrentYear' : this.getClaims(obj.claims),
				 'monthlyData' : (obj.monthlyData[obj.monthlyData.length-1] ===-1) ? [] : obj.monthlyData
			}
		};

		CalculatorModel.prototype.updateOccupationPanelData = function (yearMatch, genderMatch, locationMatch, occupationMatch) {
		
			var obj = this.data[yearMatch + genderMatch + occupationMatch + locationMatch];
			
			this.occupationPanelData = 
				{'choice' : this.occupationText,
				'rateCurrentYear' : this.getFormattedRate(obj.rate),
				'rateLastYear ' : this.getFormattedRate(this.data[''+(yearMatch-1) + genderMatch + occupationMatch + locationMatch].rate),
				'rateRelative' : this.getRelativeRate(this.getRate(obj.rate),this.getRate(this.data['' + (yearMatch-1) + genderMatch + occupationMatch + locationMatch].rate)),
				'claimsCurrentYear' : this.getClaims(obj.claims),
				'monthlyData' : (obj.monthlyData[obj.monthlyData.length-1]===-1) ? [] : obj.monthlyData
				}

		};

		/* 
		 * Updating bubble chart data objects
		 */

		CalculatorModel.prototype.updateLocationBubbleChartData = function() {
			
			var b = [];

			for (var i = 0; i < locations.list.length; i ++) {
				var a = {}, 
					rate = this.getRate (this.data[this.currentYear + this.gender + locations.list[i]].rate);
				if (rate === 'No data') {
					continue;
				} else {
					a.key = locations.list[i]
					a.rate =  rate;
	   				b.push(a);
	   			}
	   		}	

			this.locationBubbleChartData = this.sortDataForBubbleChart(b);
		};

		CalculatorModel.prototype.updateOccupationBubbleChartData = function () {
//			this may be ok within a method scope but its best practise to name variables meaningfully  (as opposed to b or a) for readability 
			var b = [];
			for ( var occ in occupations ) {
				var a = {},
					rate = this.getRate (this.data[this.currentYear + this.gender + occ + this.location].rate);

				if (rate === 'No data') {
					continue;
				} else {
					a.descr = occupations[occ].forDropdown;
					a.key = occ;
					a.rate = rate;
					b.push(a);
				}
			}
			this.occupationBubbleChartData = this.sortDataForBubbleChart(b);
		};

		/* 
		 * Init
		 */
		CalculatorModel.prototype.init = function() {
			this.updateLocationBubbleChartData();
			this.updateOccupationBubbleChartData();
		};

	return CalculatorModel;    
});