
require(['newsspec_4950/bootstrap', 'newsspec_4950/module/model/calculator_model'],  function (news, CalculatorModel) {
	
	var model;

	describe('Unemployment Calculator Model', function () {

		beforeEach(function () {
			model = new CalculatorModel();

			/* Custom matchers */
			this.addMatchers({
				toBeFloat: function () {
					return (/[\d]+(\.[\d]+)?/).exec(this.actual)[1];
				}
			});
		});

		afterEach(function () {
			model = null;
		});

		describe('Testing private fields', function () {

			it('should check if model is getting the data', function () {
				expect(model.data).toBeDefined();
			});

			it('should check if model is getting the occupations json', function () {
				expect(model.occupations).toBeDefined();
			});

			it('should test query RegEx pattern', function () {
				model.gender = 'M';
				model.occupation = '50';
				model.location = 'Yorks & Humber';
				expect(model.toString()).toMatch(model.queryPattern);
			});

			it('should be able to feed the default panel', function () {
				expect(model.defaultPanelData.currentYear).toBeDefined();
				expect(model.defaultPanelData.currentMonth).toBeDefined();
				expect(model.defaultPanelData.ukClaims).toBeDefined();
				expect(model.defaultPanelData.monthlyData.length).toBeGreaterThan(0);
			});
		});

		describe('Testing basic getters', function () {

			it('should return gender', function () {
				model.gender = 'F';
				expect(model.getGender()).toBe('Women');
			});

			it('should return gender for charts', function () {
				model.gender = 'M';
				expect(model.getGenderForCharts()).toBe('male');
			});

			it('should return numeric rate or no-data', function () {
				var testRate = 0.8;
				expect(model.getRate(0.0079)).toEqual(testRate);
				expect(model.getRate(-1)).toBe('No data');
			});

			it('should return formatted rate', function () {
				var rate = '0.0064',
					noDataRate = -1;

				expect(typeof model.getFormattedRate(rate) === 'string').toBeTruthy();
				expect(model.getFormattedRate(noDataRate)).toEqual('No data');
			});

			it('should return relative rate', function () {

				var rateNew = model.getRate('0.0064'),
					rateOld = model.getRate('0.0079');
				expect(model.getRelativeRate(rateNew, rateOld)).toBe(-0.2);
			});

			it('should return claims', function () {
				expect(typeof model.getClaims(10) === 'string').toBeTruthy();
			});

			it('should return occupation for charts', function () {
				expect(model.getOccupationForCharts(72)).toBe('call centre staff');
				expect(model.getOccupationForCharts(62)).toBe('leisure workers');
				expect(model.getOccupationForCharts(12)).toBe('service industry managers');
				expect(model.getOccupationForCharts(92)).toBe('service workers');
				expect(model.getOccupationForCharts(50)).toBe('skilled trades');

			});


			it('should return occupation for dropdown', function () {
				expect(model.getOccupationForDropdown(54)).toBe('Chef, printer or tailor');
				expect(model.getOccupationForDropdown(11)).toBe('Corporate manager');
				expect(model.getOccupationForDropdown(91)).toBe('Labourer/factory');
				expect(model.getOccupationForDropdown(82)).toBe('Transport work');
				expect(model.getOccupationForDropdown(34)).toBe('Media or sport');
			});

			it('should convert month to number', function () {
				model.currentMonth = 'January';
				expect(model.convertMonthToNumber()).toEqual(1);
				model.currentMonth = 'June';
				expect(model.convertMonthToNumber()).toEqual(6);	
			});

			it('should return string', function () {
				model.currentMonth = 'January';
				model.gender = 'M';
				model.occupation = '51';

				expect(typeof model.toString() === 'string').toBeTruthy();
	
			});

		});

		describe('Testing utility functions', function () {
			it('should test the simple array sort', function () {
				var sampleData = [4,3,5,63,2,6,54,100,15],
					randomPosition = Math.floor(Math.random() * (sampleData.length-1)) + 1; //random position from 1 to the last number in array

				//expect number on the 0 position to be lesser than numbers on any other positions
				expect(model.simpleSort(sampleData)[randomPosition]).toBeGreaterThan(model.simpleSort(sampleData)[0]);		
			});
			
			it('should test sorting an array of objects by one property', function () {
				var sampleData = [{'key': 'occ2', 'rate': 4.3},
								{'key': 'occ1', 'rate': 3.3},
								{'key': 'occ3', 'rate': 7.3},
								{'key': 'occ4', 'rate': 1.3}],
					sortedData = [],
					randomPosition = Math.floor(Math.random() * (sampleData.length-1)) + 1; //random position from 1 to the last number in array

				sampleData.sort(function (a, b, property) { return model.sortByProperty(a, b, 'rate'); });
				expect(sampleData[0].rate).toEqual(1.3);	
				
			});

			it('should return a string with capitalised first letter', function () {
				var sample = 'test';
				expect(model.capitaliseFirstLetter(sample).charAt(0)).toBe(sample.charAt(0).toUpperCase());
			});

			it('should add commas for visualisation purposes in a number', function () {
				var sample = 3000000;
				expect(model.numberWithCommas(sample).match(/\B(?=(\d{3})+(?!\d))/g));
			});
		});

		describe('Testing hodlding objects update', function () {
			it('should check whether the location panel data is updated', function () {
				var yearMatch = 2013,
					genderMatch = 'M',
					locationMatch = 'Eastern';

				model.updateModel(genderMatch, locationMatch, '');
				model.updateLocationPanelData(yearMatch, genderMatch, locationMatch);

				expect(model.locationPanelData.choice).toBe(locationMatch);
			});

			it('should check whether the occupation panel data is updated', function () {
				var yearMatch = 2013,
					genderMatch = 'M',
					locationMatch = 'Eastern',
					occupationMatch = '50';

				model.updateModel(genderMatch, locationMatch, occupationMatch);
				expect(model.locationPanelData.rateCurrentYear).toBeDefined();

				model.updateOccupationPanelData(yearMatch, genderMatch, locationMatch, occupationMatch);

				expect(model.occupationPanelData.rateCurrentYear).toBeDefined();
			});

		});

		describe('Testing init', function () {
			it('should update both bubble chart data objects on init', function () {
				spyOn(model, 'updateLocationBubbleChartData');
				spyOn(model, 'updateOccupationBubbleChartData');
				model.init();
				expect(model.updateLocationBubbleChartData).toHaveBeenCalled();
				expect(model.updateOccupationBubbleChartData).toHaveBeenCalled();
			});
		});

		
	});

});