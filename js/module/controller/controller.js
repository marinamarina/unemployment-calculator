define(['newspec_4950/bootstrap', 
        'module/model/calculator_model',
        'module/views/inputelements_view',
        'module/views/launch_view',        
        'module/views/results_view',
        'module/views/bubblechart_view',
        'module/views/linechart_view'], 

    function (news, CalculatorModel, InputElementsView, LaunchView, ResultsView, BubbleChartView, LineChartView) {
        
    var $ = news.$;

    //controller initialises model and all the views
    function init(isDesktop) {


        //checking the width of the screen
        var screenWidth = document.body.offsetWidth; //window width

        
        //initialising model and views
        var calculatorModel = new CalculatorModel();
        var inputElements = new InputElementsView('.choices');
        var resultsView = new ResultsView(calculatorModel, inputElements);
        
        calculatorModel.init();

        var bubbleChartLocView = new BubbleChartView('bubble-chart--loc', 'location', calculatorModel, screenWidth);
        //var bubbleChartOccView = new BubbleChartView('bubble-chart--occ', 'occupation', calculatorModel, screenWidth);

        bubbleChartLocView.init();
        //bubbleChartOccView.init();
        
        //console.log(bubbleChartLocView)
        //console.log(bubbleChartOccView)

        var linechartView = new LineChartView();

        linechartView.init(calculatorModel);
        
        /* If mobile, init the launch view */
        if (!isDesktop) {
            var launchView = new LaunchView('#newsspec_4950'); 
            launchView.init();
            
            launchView.launchButton.onclick = function () {
                $('body').addClass('full-width-calculator');
            };
            launchView.closeButton.each(function(){
                this.onclick = function() {
                 $('body').removeClass('full-width-calculator'); 
             }
         });
        }

        /* Setting Default Values */
        resultsView.insertDefaultValues(calculatorModel.defaultPanelData);

        /* Choosing Gender */
        inputElements.genderInput.each(function () {
            this.onchange = function() {
                var gender = $(this).val();

                $(this.parentNode).addClass('selected');
                $('.choices__gender-select-item:not(:hover)').removeClass('selected')

                resultsView.displayGenderPanel();
                calculatorModel.updateModel(gender, "", "");

            }
        });

        /* Choosing Location */
        inputElements.locationDropdown[0].onclick = function() {
            resultsView.handleDropdown(resultsView.locationList);
        };

        inputElements.locationListElements.each(function () {
            this.onclick = function() {
                var location = $(this).text();
                resultsView.displayLocationPanel();
                resultsView.handleDropdown(resultsView.locationList, location);
                
                calculatorModel.location = location;
                calculatorModel.updateModel("", location, "");
            }
        });

        /* Choosing Occupation */
        inputElements.occupationDropdown[0].onclick = function() {
            resultsView.handleDropdown(resultsView.occupationList);
        };

        inputElements.occupationListElements.each(function () {
            this.onclick = function() {
                var occupation = this.getAttribute("id");//,
                    occupationText = $($(this)[0].getElementsByClassName('head')[0]).text();

                resultsView.displayOccupationPanel();
                resultsView.handleDropdown(resultsView.occupationList, occupationText);
                calculatorModel.occupationText = occupationText;
                calculatorModel.updateModel("", "", occupation);
            }
        });

}

return {init: init};
});