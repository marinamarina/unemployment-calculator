/* 
 * This is a mini view, which only holds 
 * DOM elements for the input elements 
 * and handles generating the lists using templates
 */

define(['newsspec_4950/bootstrap',
		'vendor/template_engine',
		'newsspec_4950/data/occupations',
		'newsspec_4950/data/locations'
		],
	function (news, template, occupations, locations) {
	var $ = news.$,
		InputElementsView;

	InputElementsView = function (rootObject) {
	    this.genderInput = $(rootObject + ' .choices__gender-select input'); //choice1 - gender
	    this.locationDropdown = $(rootObject + ' .choices__location-dropdown'); //choice2 - location
	    this.locationList = $(rootObject + ' .choices__location-list');
	    this.locationListElements = $(rootObject + ' .choices__location-list > li');
	    this.occupationDropdown = $(rootObject + ' .choices__occupation-dropdown'); //choice3 - occupation 
	    this.occupationList = $(rootObject + ' .choices__occupation-list');
	    this.occupationListElements = $(rootObject + ' .choices__occupation-list > li');
	};

	InputElementsView.prototype.feedTheTemplate = function(inputEl, templateName, dataList) {
		inputEl
        .html('')
        .append(news.$.tmpl(templateName, 
        {
            dataList : dataList
       	}
        ));
	};

	InputElementsView.prototype.init = function() {	
		this.feedTheTemplate(this.locationList, 'locationList', locations.list);
		this.feedTheTemplate(this.occupationList, 'occupationList', occupations);
	};

	return InputElementsView;
})