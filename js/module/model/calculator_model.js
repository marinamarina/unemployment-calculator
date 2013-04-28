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
								 "ukRate" : data[this.currentYear].rate,
								 "monthlyData" : data[this.currentYear].monthlyData};
	    this.genderPanelData = {};
        this.locationPanelData = {};
	    this.occupationPanelData = {};
	    this.locationBubbleChartData = [];
	    this.occupationBubbleChartData = [];
     
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
		
		this.updateGenderPanelData(yearMatch, genderMatch);
		this.updateLocationPanelData(yearMatch, genderMatch, locationMatch);
	    this.updateOccupationPanelData(yearMatch, genderMatch, locationMatch, occupationMatch);

		if (gender!="") {
			this.updateLocationBubbleChartData();
			this.updateOccupationBubbleChartData();
			pubsub.emit("gender-object-updated");

			//this.updateOccupationBubbleChartData(gender, "");
		} else if (location!="") {
			this.updateOccupationBubbleChartData();
			pubsub.emit("location-object-updated", [this.location]);
		} else if (occupation!= "") {
            pubsub.emit("occupation-object-updated", [this.occupation]);
        }
		
	}

	CalculatorModel.prototype.updateGenderPanelData = function(yearMatch, genderMatch) {
		var obj = this.data[yearMatch + genderMatch];

		
		this.genderPanelData =
			{"choice" : this.getGender(),
			"rateCurrentYear" : this.getFormattedRate(obj.rate),
			"rateLastYear" : this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch].rate),
			"rateFiveYearsAgo" : this.getFormattedRate(this.data[""+(yearMatch-5) + genderMatch].rate),
			"rateRelative" : this.getRelativeRate(this.getFormattedRate(obj.rate),this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch].rate)),
			"claimsCurrentYear" : this.getClaims(obj.claims),
			"monthlyData" : obj.monthlyData
			}
			//console.log(this.getRelativeRate(this.genderPanelData.rateCurrentYear,this.genderPanelData.rateLastYear))
			
	}
	CalculatorModel.prototype.updateLocationPanelData = function(yearMatch, genderMatch, locationMatch) {
		 
        this.locationPanelData.choice = this.location;
        this.locationPanelData.rateCurrentYear = this.getFormattedRate(this.data[yearMatch + genderMatch + locationMatch].rate);
        this.locationPanelData.rateLastYear = this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch + locationMatch].rate);
        this.locationPanelData.rateRelative = this.getRelativeRate(this.locationPanelData.rateCurrentYear, this.locationPanelData.rateLastYear);
        this.locationPanelData.rateFiveYearsAgo = this.getFormattedRate(this.data[""+(yearMatch-5) + genderMatch + locationMatch].rate);
        this.locationPanelData.claimsCurrentYear = this.getClaims(this.data[yearMatch + genderMatch + locationMatch].claims);
	}
	CalculatorModel.prototype.updateOccupationPanelData = function(yearMatch, genderMatch, locationMatch, occupationMatch) {
	
		this.occupationPanelData.choice = this.occupationText;
		this.occupationPanelData.rateCurrentYear = this.getFormattedRate(this.data[yearMatch + genderMatch + occupationMatch + locationMatch].rate);
		this.occupationPanelData.rateLastYear = this.getFormattedRate(this.data[""+(yearMatch-1) + genderMatch + occupationMatch + locationMatch].rate);
		this.occupationPanelData.rateRelative = this.getRelativeRate(this.occupationPanelData.rateCurrentYear,this.occupationPanelData.rateLastYear);
		this.occupationPanelData.rateFiveYearsAgo = this.getFormattedRate(this.data[""+(yearMatch-5) + genderMatch + occupationMatch + locationMatch].rate);
		this.occupationPanelData.claimsCurrentYear = this.getClaims(this.data[yearMatch + genderMatch + occupationMatch + locationMatch].claims);
	}
	CalculatorModel.prototype.updateLocationBubbleChartData = function() {
		var locations = ['North East', 'North West', 'West Midlands', 'London', 'East', 'South East', 'South West', 'Wales', 'Scotland', 'Northern Ireland', 'East Midlands', 'Yorkshire and The Humber'];
		var b = [];

		for (var i = 0; i < locations.length; i ++) {
			var a = {};
				a.key = locations [i]
				a.rate =  this.getRate (data[this.currentYear + this.gender + locations[i]].rate);
   				b.push(a);
   			}
   			
		
		
		this.locationBubbleChartData = this.sortData(b);
	}
	CalculatorModel.prototype.updateOccupationBubbleChartData = function() {

		//TODO HANDLE NO DATA!!!
		var occupations = [['12', 'Managers, agriculture & services'],['11','Managers'],['23','Teachers & lecturers'],['34','Media & sport'], ['24','Business\/public service profs'],['21','Science & tech profs'],['31','Science\/technology assoc profs'],['71','Sales'],['35','Business\/public service assoc profs'],['41','Admin occupations'],['42','Secretarial'],['33','Emergency services'],['51','Skilled agricultural trades'],['82','Transport'],['92','Elementary admin/services'],['52','Skilled trades'],['54','Textile, printing, other skilled trades'],['53','Skilled building trades'],['61','Caring service occupations'],['62','Leisure'],['32','Healthcare associate profs'],['91','Elementary trades'],['72','Customer service, call centres'],['81','Plant work']];  //, '34', '24', '21'];
		var b = [];

		for (var i = 0; i < occupations.length; i++) {
			var a = {};
			a.descr = occupations[i][1];
			a.key = occupations[i][0];
			a.rate = this.getRate (data[this.currentYear + this.gender + occupations[i][0] + this.location].rate);
			
   			b.push(a)
		}

		this.occupationBubbleChartData = this.sortData(b);
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
            a.descr = data[i].descr;
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

		this.updateLocationBubbleChartData();
		this.updateOccupationBubbleChartData();
	}


	return CalculatorModel;    
})