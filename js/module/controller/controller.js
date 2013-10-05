define(['newsspec_4950/bootstrap', 
        'newsspec_4950/module/model/calculator_model',
        'newsspec_4950/module/views/inputelements_view',
        'newsspec_4950/module/views/launch_view',        
        'newsspec_4950/module/views/results_view',
        'newsspec_4950/module/views/bubblechart_view',
        'newsspec_4950/module/views/linechart_view'
        ], 

    function (news, CalculatorModel, InputElementsView, LaunchView, ResultsView, BubbleChartView, LineChartView) {
        
    var $ = news.$;

    //controller initialises model and all the views
    function init (isMobile) {
        
        //initialising model and views
        var calculatorModel = new CalculatorModel();
        var inputElements = new InputElementsView('.choices');
        var resultsView = new ResultsView(calculatorModel, inputElements, isMobile);  
     
        inputElements.init();
        calculatorModel.init();
        resultsView.init();
        
        if (!isMobile) {
            var bubbleChartLocView = new BubbleChartView('bubble-chart--loc', 'location', calculatorModel);
            var bubbleChartOccView = new BubbleChartView('bubble-chart--occ', 'occupation', calculatorModel);
            var linechartView = new LineChartView(calculatorModel);
            
            bubbleChartLocView.init();
            bubbleChartOccView.init();
            linechartView.init();
        };
               
        /* If mobile, init the launch view */
        if (isMobile) {
            var launchView = new LaunchView('#newsspec_4950'); 
            launchView.init();
            
            launchView.launchButton.click(function () {
                $('body').addClass('full-width-calculator');
            });

            launchView.closeButton.each(function() {
                $(this).click(function() {
                    $('body').removeClass('full-width-calculator'); 
                });
            });
        }

        /* Setting Default Values */
        resultsView.insertDefaultValues();

        /* Choosing Gender */
        inputElements.genderInput.on( 'change', function() {
            var gender = $(this).val();

            $(this.parentNode).addClass('selected');
            $('.choices__gender-select-item:not(:hover)').removeClass('selected')

            resultsView.displayGenderPanel();
            calculatorModel.updateModel(gender, '', '');
        });

        /* Choosing Location */
        inputElements.locationDropdown[0].onclick = function() {
            resultsView.handleDropdown(inputElements.locationList);
        };

        $('.choices__location-list > li').on( 'click', function() {
            var location = $(this).text();
            resultsView.displayLocationPanel();
            resultsView.handleDropdown(inputElements.locationList, location);
            
            calculatorModel.location = location;
            calculatorModel.updateModel('', location, '');
        });

        /* Choosing Occupation */
        inputElements.occupationDropdown[0].onclick = function() {
            resultsView.handleDropdown(inputElements.occupationList);
        };

        $('.choices__occupation-list > li').on( 'click', function() {
            var occupation = this.getAttribute('id');
            var occupationText = $(this).text();

            resultsView.displayOccupationPanel();
            resultsView.handleDropdown(inputElements.occupationList, occupationText);
            calculatorModel.occupationText = occupationText;
            calculatorModel.updateModel('', '', occupation);
                
        });

}
    return {init: init};
});