//model does not know about controller and views, it has only access to data
//model holds default data, every time there is a change, model notify its subscribers (views)  
define(['newspec_4950/bootstrap',
		'newsspec_4950/data/unemployment_data'
	], 
	function (news, data) {

		var pubsub = news.pubsub,
			CalculatorModel = function () {

		this.currentYear = '2012'; //query_string_1
		this.data = data; //passing the data in

		this.gender = ''; //query_string_2
		this.location = ''; //query_string_3
		this.occupation = ''; //query_string_4

	    this.occupationText = '';
	    this.ukClaims = data[this.currentYear].claims;
	    this.ukRate = data[this.currentYear].rate;
	    
	    this.queryPattern = /([\d]{4})([M,F]{1})?([\d-]+)?([A-Za-z\s]+)?$/;

	    this.defaultPanelData = {"ukClaims" : data[this.currentYear].claims,
								 "ukRate" : data[this.currentYear].rate};
	    this.genderPanelData = {};
        this.locationPanelData = {};
	    this.occupationPanelData = {};
	    this.bubbleChartLocData = [];
	    this.bubbleChartOccData = [];
     
	}

	/* Getters */
	CalculatorModel.prototype.getGender = function () {
		return (this.gender === 'M') ? 'Men' : 'Women';
	}
	CalculatorModel.prototype.getRate = function (rate) {
        if (parseFloat(rate) === -1) return "No data";
		return (rate * 100).toFixed(1);
	}
	CalculatorModel.prototype.getFormattedRate = function (rate) {
		if (parseFloat(rate) === -1) return "No data";
		return (rate * 100).toFixed(1) + "%";
	}
	CalculatorModel.prototype.getRelativeRate = function(rateNew, rateOld) {
		if(rateNew === -1 || rateOld === -1) return false;
		
		var relativeRate = parseFloat(rateNew.substr(0, rateNew.length-1)) - parseFloat(rateOld.substr(0, rateOld.length-1));

        relativeRate = (rateNew === rateOld) ? relativeRate.toFixed(0) : relativeRate.toFixed(1);
        if (isNaN(relativeRate)) return "";

		return parseFloat(relativeRate);
	}
	CalculatorModel.prototype.getClaims = function (claims) {
		return this.numberWithCommas(claims.toFixed(0))+ " claims";
	}

	/* Updating the model */
	CalculatorModel.prototype.updateModel = function(gender, location, occupation) {
		
		(gender === "") ? this.gender : this.gender = gender;
		(location === "") ? this.location : this.location = location;
		(occupation === "") ? this.occupation : this.occupation = occupation;

		var query = this.toString(),
			match = query.match(this.queryPattern),
			yearMatch = parseInt(match[1]),
			genderMatch = match[2] || "",
			occupationMatch = match[3] || "",
			locationMatch = match[4] || "";
		
		this.updateGenderPanelDataObject(yearMatch, genderMatch);
		this.updateLocationPanelDataObject(yearMatch, genderMatch, locationMatch);
	    this.updateOccupationPanelDataObject(yearMatch, genderMatch, locationMatch, occupationMatch);

		if (gender!="") {
			this.updateLocationBubbleChartDataObject(gender);
			pubsub.emit("gender-object-updated");

			//this.updateOccupationBubbleChartDataObject(gender, "");
		} else if (location!="") {
			pubsub.emit("location-object-updated", [this.location]);
		} else if (occupation!= "") {
            pubsub.emit("occupation-object-updated", [this.occupation]);
        }
		
	}

	CalculatorModel.prototype.updateGenderPanelDataObject = function(yearMatch, genderMatch) {

		this.genderPanelData.choice = this.getGender();
		this.genderPanelData.rateCurrentYear = this.getFormattedRate(this.data[yearMatch + genderMatch].rate);
		this.genderPanelData.rateLastYear = this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch].rate);
		this.genderPanelData.rateRelative = this.getRelativeRate(this.genderPanelData.rateCurrentYear,this.genderPanelData.rateLastYear);
		this.genderPanelData.rateFiveYearsAgo = this.getFormattedRate(this.data[""+(yearMatch-5) + genderMatch].rate);
		this.genderPanelData.claimsCurrentYear = this.getClaims(this.data[yearMatch + genderMatch].claims);
	}
	CalculatorModel.prototype.updateLocationPanelDataObject = function(yearMatch, genderMatch, locationMatch) {
		 
        this.locationPanelData.choice = this.location;
        this.locationPanelData.rateCurrentYear = this.getFormattedRate(this.data[yearMatch + genderMatch + locationMatch].rate);
        this.locationPanelData.rateLastYear = this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch + locationMatch].rate);
        this.locationPanelData.rateRelative = this.getRelativeRate(this.locationPanelData.rateCurrentYear, this.locationPanelData.rateLastYear);
        this.locationPanelData.rateFiveYearsAgo = this.getFormattedRate(this.data[""+(yearMatch-5) + genderMatch + locationMatch].rate);
        this.locationPanelData.claimsCurrentYear = this.getClaims(this.data[yearMatch + genderMatch + locationMatch].claims);
	}
	CalculatorModel.prototype.updateOccupationPanelDataObject = function(yearMatch, genderMatch, locationMatch, occupationMatch) {
	
		this.occupationPanelData.choice = this.occupationText;
		this.occupationPanelData.rateCurrentYear = this.getFormattedRate(this.data[yearMatch + genderMatch + occupationMatch + locationMatch].rate);
		this.occupationPanelData.rateLastYear = this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch + occupationMatch + locationMatch].rate);
		this.occupationPanelData.rateRelative = this.getRelativeRate(this.occupationPanelData.rateCurrentYear,this.occupationPanelData.rateLastYear);
		this.occupationPanelData.rateFiveYearsAgo = this.getFormattedRate(this.data[""+(yearMatch-5) + genderMatch + occupationMatch + locationMatch].rate);
		this.occupationPanelData.claimsCurrentYear = this.getClaims(this.data[yearMatch + genderMatch + occupationMatch + locationMatch].claims);
	}
	CalculatorModel.prototype.updateLocationBubbleChartDataObject = function(gender) {
		var locations = ['North East', 'North West', 'West Midlands', 'London', 'East', 'South East', 'South West', 'Wales', 'Scotland', 'Northern Ireland', 'East Midlands', 'Yorkshire and The Humber'];
		var b = [];
		var gender = gender || "";

		for (var i = 0; i < locations.length; i ++) {

			for (var key in data) {
   				var obj = data[this.currentYear + gender + locations[i]];	
   				var a = {};
   				a.key = locations[i];
   				for (var prop in obj) {
      				a.rate = this.getRate (obj['rate'] );	
      				break;
   				}
   			}
   			b.push(a);
		}
		
		this.bubbleChartLocData = this.sortData(b);
	}
	CalculatorModel.prototype.updateOccupationBubbleChartDataObject = function(gender, location) {
		var occupations = {'12': 'dvornik', '11' : 'koshka' , '23': 'developa'};  //, '34', '24', '21'];
		var b = [];
		var gender = gender || "";
		var location = location || "";

		for (var m in occupations) {

			for (var key in data) {

   				var obj = data[this.currentYear + gender + location + m];	
   				var a = {};
   				a.key = m;
   				for (var prop in obj) {
      				a.rate = this.getRate (obj['rate'] );	

      				break;
   				}
   			}
   			b.push(a);
		}

		this.bubbleChartOccData = this.sortData(b);
	}

	/* Sort array by rate */
    CalculatorModel.prototype.sort = function(a, b) {
        var c = 'rate';
        return (a[c] < b[c]) ? 1 : (a[c] > b[c]) ? -1 : 0;
    }

    /* Return sorted data */
    CalculatorModel.prototype.sortData = function(data) {
        var i, 
        	sortedData = [];

        data.sort(function(a, b) {
            return a.rate - b.rate
        });

        for (i = 0; i < data.length; i++) {
            var a = {};
            a.key = data[i].key;
            a.rate = data[i].rate;

            sortedData.push(a);
        }
        return sortedData;
	}
	/* Other utility functions */
	CalculatorModel.prototype.numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	CalculatorModel.prototype.toString = function() {
		return this.currentYear + this.gender + this.occupation + this.location; 
	}

	/* Init */
	CalculatorModel.prototype.init = function() {

		this.updateLocationBubbleChartDataObject();
		this.updateOccupationBubbleChartDataObject();
	}


	return CalculatorModel;    
})