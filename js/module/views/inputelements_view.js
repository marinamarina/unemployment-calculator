//This is a mini view, which only holds 
//DOM elements for the inout elements
define(['newspec_4950/bootstrap'],
		function (news) {
	var $ = news.$;

	var InputElementsView = function (rootObject) {
	    this.genderInput = $(rootObject + ' .choices__gender-select input'); //choice1 - gender
	    this.locationDropdown = $(rootObject + ' .choices__location-dropdown'); //choice2 - location
	    this.locationList = $(rootObject + ' .choices__location-list');
	    this.locationListElements = $(rootObject + ' .choices__location-list > li');
	    this.occupationDropdown = $(rootObject + ' .choices__occupation-dropdown'); //choice3 - occupation 
	    this.occupationList = $(rootObject + ' .choices__occupation-list');
	    this.occupationListElements = $(rootObject + ' .choices__occupation-list > li');
	}
	return InputElementsView;
})