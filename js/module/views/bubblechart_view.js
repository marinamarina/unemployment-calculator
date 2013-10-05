/* Bubble Chart
 * Initialise the bubble chart on the page with:
 * BubbleChartView.init()
 * Initialise options:
 * {
 * rootEl: String, selector of the element holding the graph
 * chartType: String ("location" || "occupation")
 * data: array of objects ({'location' : 'London', 'rate': 4.3},...])
 * }
 */
define(['newsspec_4950/bootstrap', 'raphael'],
	function (news) {
	var $ = news.$,
		pubsub = news.pubsub,
		BubbleChartView;


	BubbleChartView = function (rootEl, chartType, model) {

    this.bubbleChartsWrapper = $('.bubble-charts');
		this.rootEl = rootEl; 
		this.$rootEl = $("#" + rootEl);
		this.model = model;

    this.canvas = Raphael(rootEl, 624, 80);
    this.chartType = chartType;
    this.yourChoice = "";
    
    this.chosenBubble = this.canvas.set();  //3 sets of bubbles: chosen, min & max, others
    this.topBottomBubbles = this.canvas.set(); 
    this.otherBubbles = this.canvas.set();
    this.axisXLabelsSet = this.canvas.set(); //set of the axis elements
    this.axisFrom = 45;
    this.axisUpTo = 480;
    this.axisLength = this.axisUpTo - this.axisFrom;
  
    };

    BubbleChartView.prototype.colors = {
        location: '#DFA300',
        occupation: '#385C7C'
    };

    /* Axis constructor, draw axis */
    BubbleChartView.prototype.drawAxis = function (data) {
       var axisX;              

        axisX = this.canvas.path("M" + this.axisFrom + ",45L" + this.axisUpTo +",45").attr({"stroke-width": 3, "stroke" : "#505050", "stroke-opacity" : 0.8});    
    };

    BubbleChartView.prototype.drawAxisLabels = function(data) {

      var sortedData = data,
          axisMin = (data) ? Math.floor(sortedData[0].rate) : 0,
          axisMax = (data) ? Math.ceil(sortedData[sortedData.length-1].rate) : 10,
          minLabel,
          maxLabel;

          this.axisXLabelsSet.splice(0, this.axisXLabelsSet.length).remove();

          minLabel = this.canvas.text(10, 47, axisMin + "%").attr({'font-size': 14, 'font-family': 'Arial', "fill": "#505050"});
          maxLabel = this.canvas.text(this.axisUpTo + 44, 45, axisMax + "%").attr({'font-size': 14, 'font-family': 'Arial', "fill": "#505050"});
          this.axisXLabelsSet.push(minLabel, maxLabel); 
    };


    /* Add tip */
    BubbleChartView.prototype.addTip = function(bubble, key, value) {

	    var bubbleEl = $(bubble),
          rootEl = '#' + this.rootEl,
	        tip_content = $(rootEl + " .tip-content"),
	        tip_key = $(rootEl + " .tip-key"),
	        tip_value = $(rootEl + " .tip-value"),
          choice_key = $(rootEl + ' .choice-key'),
          choice_value = $(rootEl + " .choice-value");     

	    bubbleEl.click(function() {
	       tip_content.text(key);
	       tip_key.css("left", bubbleEl.attr("cx") - 13 + "px").css("top", 0);
	       tip_value.css("left", bubbleEl.attr("cx") - 16).text(value+ "%");
	       tip_key.show();
	       tip_value.show();
         choice_key.hide();
         choice_value.hide();
	    });

      bubbleEl.mouseover(function() {
         tip_content.text(key);
         tip_key.css("left", bubbleEl.attr("cx") - 13 + "px").css("top", 0);
         tip_value.css("left", bubbleEl.attr("cx") - 16).text(value+ "%");
         tip_key.show();
         tip_value.show();
         choice_key.hide();
         choice_value.hide();
      }).mouseout(function() {
         var timer = $(this).data('timer');
         if(timer) clearTimeout(timer);

        tip_key.hide();
        tip_value.hide();
        choice_key.show();
        choice_value.show();

        
      }/*, function() {
        var bubble= $(this);
        bubble.data('timer', setTimeout(function(){ 
          choice_value.css("display", "block");
        }, 800));
      }*/);


       //($(this.rootEl + ':not(:hover)'))
       /*.onhover = function (event) {
          event.stopPropagation();
          choice_value.css("display", "block");
          tip_key.hide();
          tip_value.hide();
          console.log("works!")
       }*/
	 }

    /* Bubbles constructor */
    BubbleChartView.prototype.drawSingleBubble = function (position, opacity, key, value) {
      var color, 
          outerBubble,
          innerBubble;

      color = this.colors[this.chartType];
      innerBubble = this.canvas.circle(position, 45, 1)
                    .attr({'stroke': '#FFF', 'fill': color, 'fill-opacity': opacity, 'stroke-opacity': opacity})
                    .animate({r: 9}, 2700, 'elastic');
      outerBubble = this.canvas.circle(position, 45, 3)
                  .attr({'stroke': color, 'fill': 'none', 'fill-opacity': opacity, 'stroke-opacity': opacity, 'stroke-width': 3})
                  .animate({r: 13}, 3000, 'elastic');
            
      switch(opacity) {
          case 0.75: this.topBottomBubbles.push (innerBubble, outerBubble);
              break;
          case 1: this.chosenBubble.push (innerBubble, outerBubble);
              break;
          default: this.otherBubbles.push (innerBubble, outerBubble);
      }
      
      //Animation on hover
      innerBubble.hover(function () {
        innerBubble.attr({"cursor": "pointer"});
        outerBubble.animate({r: 14}, 2700, 'elastic');
      }, function () {
          outerBubble.animate({r: 13}, 2700, 'elastic');
        }
      )

      //Bubbles to front
      this.topBottomBubbles.toFront();
      this.chosenBubble.toFront();

      //Add tip on hover
      this.addTip(innerBubble.node, key || "", value || "");
    };

    /* Draw bubbles using data provided */
    BubbleChartView.prototype.drawBubbles = function (yourChoice, data) {
        
    	var sortedData = data,          
    		max = Math.ceil(sortedData[sortedData.length-1].rate),
    		axisMin = parseInt(sortedData[0].rate),
    		axisMax = max;

        this.resetBubbles();

        for (i = 0; i < sortedData.length; i++) {

            var x = this.axisFrom + ((sortedData[i].rate-axisMin) * ( this.axisLength / (axisMax - axisMin) ) ),
                descr = sortedData[i].descr,
                key = sortedData[i].key,
                value = sortedData[i].rate;

            if (i === 0 || i === sortedData.length-1) { //top and bottoms
                this.drawSingleBubble(x, 0.75, descr || key, value);
               // (i === 0) ? this.addExtremeLabels(x - 50, "Bottom") : this.addExtremeLabels(x + 10, "Top");

            } else {
            	this.drawSingleBubble(x, 0.35, descr || key, value); //the rest of the bubble crowd
            }

           if (key === this.yourChoice) { //your choice, %username%
                
                this.drawSingleBubble(x, 1, descr || key, value);
                this.addChoiceLabel (x - 13, descr || key, value); 

            }
        }
    };

    BubbleChartView.prototype.resetBubbles = function () {
            //clear the previous bubbles, reset
      this.topBottomBubbles.splice(0, this.topBottomBubbles.length).remove();
      this.otherBubbles.splice(0, this.otherBubbles.length).remove();
      this.chosenBubble.splice(0, this.chosenBubble.length).remove();
    };

    BubbleChartView.prototype.addChoiceLabel = function (pos, key, value) {
    	var choice_key = $("#" + this.rootEl + " .choice-key"),
        	choice_content = $("#" + this.rootEl + " .choice-content"),
        	choice_value = $("#" + this.rootEl + " .choice-value");

       choice_key.css({"display" : "block", "left": pos + "px"});
       choice_content.text(key);
       choice_value.css({"display" : "block", "left": pos - 3 + "px"}).html(value+ "%");
    };

    BubbleChartView.prototype.update = function (yourChoice) {
        
        var data;

        data = (this.chartType === "location") ? this.model.locationBubbleChartData : this.model.occupationBubbleChartData; 

        this.bubbleChartsWrapper.show();
        this.drawAxisLabels(data);

        /*for (var i=0; i<data.length; i++) {
          console.log(data[i].key === yourChoice);
        }*/
        
        this.drawBubbles(yourChoice, data);

        //if()
        this.updateTitle(yourChoice);
    };

	BubbleChartView.prototype.addListeners = function() {
		var that = this;

		pubsub.on('location-object-updated', function(yourChoice) {
        	
            if (that.chartType === "location") {
                that.yourChoice = yourChoice;
            }
            
            if (that.yourChoice !== "") {
                that.update(that.yourChoice);     
            }
        });
        pubsub.on('occupation-object-updated', function(yourChoice) {
            
            if (that.chartType === "occupation") {
                that.yourChoice = yourChoice;
                that.update(that.yourChoice);
            }
        });
	};

  BubbleChartView.prototype.updateTitle = function (yourChoice) {
    var yourChoice = (this.chartType ==='occupation') ?  this.model.getOccupationForCharts(yourChoice) : yourChoice,
        titleEl = $('#' + this.rootEl).prev();

    titleEl.css('visibility','visible');
    titleEl.find('span').html(yourChoice);
  };

	BubbleChartView.prototype.init = function() {  
   
    this.drawAxis();
    this.drawAxisLabels();
    this.addListeners();

  };


	return BubbleChartView;

})