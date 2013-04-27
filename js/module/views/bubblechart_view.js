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
define(['newspec_4950/bootstrap', 'raphael'],
	function (news) {
	var $ = news.$,
		pubsub = news.pubsub,
		BubbleChartView;


	BubbleChartView = function (rootEl, chartType, model, screenWidth) {

		
        this.screenWidth = screenWidth;
		this.rootEl = rootEl; 
		this.$rootEl = $("#" + rootEl);
		this.model = model; //getting access to the model

        this.canvas = Raphael(rootEl, 624, 80);
        this.chartType = chartType;
        this.yourChoice = "";
        
        this.chosenBubble = this.canvas.set();  //3 sets of bubbles: chosen, min & max, others
        this.topBottomBubbles = this.canvas.set(); 
        this.otherBubbles = this.canvas.set();
        this.axisXset = this.canvas.set(); //set of the axis elements
  
    }

    BubbleChartView.prototype.colors = {
        location: '#DFA300',
        occupation: '#385C7C'
    }

    /* Axis constructor, draw axis */
    BubbleChartView.prototype.renderAxis = function (data) {
       
        //console.log(data)
       var  sortedData = data,
            axisX,
       		axisMin = parseInt(sortedData[0].rate),
       		axisMax = parseInt(sortedData[sortedData.length-1].rate) + 2,
       		minLabel,
       		maxLabel,
       		axisUpTo = 585;

       		if (this.screenWidth < 624) {
       			axisUpTo = this.screenWidth - 34;
       		}
       		   		   	
       	this.axisXset.splice(0, this.axisXset.length).remove();

        axisX = this.canvas.path("M34,45L" + axisUpTo +",45").attr({"stroke-width": 3, "stroke" : "#505050", "stroke-opacity" : 0.8}),
        minLabel = this.canvas.text(18, 41, axisMin + "%").attr({'font-size': 14, 'font-family': 'Arial', "fill": "#505050"});
        maxLabel = this.canvas.text(axisUpTo + 21, 41, axisMax + "%").attr({'font-size': 14, 'font-family': 'Arial', "fill": "#505050"});
    	this.axisXset.push(axisX, minLabel, maxLabel);	
    }

    /* Bubbles constructor */
    BubbleChartView.prototype.renderSingleBubble = function (position, opacity, key, value) {
    	var color, outerBubble, innerBubble;

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
  		},
  		function () {
    		outerBubble.animate({r: 13}, 2700, 'elastic');
  			}
		)

	    //Bubbles to front
        this.topBottomBubbles.toFront();
        this.chosenBubble.toFront();

        //Add tip on hover
        this.addTip(innerBubble.node, key || "", value || "");

    }

    /* Add tip */
    BubbleChartView.prototype.addTip = function (bubble, key, value) {

	    var bubbleEl = $(bubble),
	        tip_content = $("#" + this.rootEl + " .tip-content"),
	        tip_key = $("#" + this.rootEl + " .tip-key"),
	        tip_value = $("#" + this.rootEl + " .tip-value"),
            choice_value = $("#" + this.rootEl + " .choice-value");     

	    bubble.onclick = function () {
	       tip_content.text(key);
	       tip_key.css("left", bubbleEl.attr("cx") - 13 + "px").css("top", 0);
	       tip_value.css("left", bubbleEl.attr("cx") - 16).text(value+ "%");
	       tip_key.show();
	       tip_value.show();
           choice_value.hide();
	   }
       bubble.onmouseover = function () {
            tip_content.text(key);
           tip_key.css("left", bubbleEl.attr("cx") - 13 + "px").css("top", 0);
           tip_value.css("left", bubbleEl.attr("cx") - 16).text(value+ "%");
           tip_key.show();
           tip_value.show();
           choice_value.hide();
       }
       $(this.rootEl).onmouseout = function () {

       }
	}

    /* Render bubbles using data provided */
    BubbleChartView.prototype.renderBubbles = function (yourChoice, data) {
        
    	var sortedData = data,          
    		max = Math.floor(parseFloat(sortedData[sortedData.length-1].rate), 0),
    		axisMin = parseInt(sortedData[0].rate),
    		axisMax = max + 2,
    		axisLength = 551;
            this.yourChoice = yourChoice || this.yourChoice;

    	if (this.screenWidth < 624) {
       		axisLength = this.screenWidth * 551 / 624;
       	}	

    	//clear the previous bubbles, reset
    	this.topBottomBubbles.splice(0, this.topBottomBubbles.length).remove();
    	this.otherBubbles.splice(0, this.otherBubbles.length).remove();
    	this.chosenBubble.splice(0, this.chosenBubble.length).remove();


        for (i = 0; i < sortedData.length; i++) {


            var x = sortedData[i].rate * axisLength / axisMax-axisMin,
                key = sortedData[i].key,
                value = sortedData[i].rate;

            if (i === 0 || i === sortedData.length-1) { //top and bottoms
                this.renderSingleBubble(x, 0.75, key, value);
                (i === 0) ? this.addExtremeLabels(x - 50, "Bottom") : this.addExtremeLabels(x + 10, "Top");

            } else {
            	this.renderSingleBubble(x, 0.35, key, value); //the rest of the bubble crowd
            }

           if (key === this.yourChoice) { //your choice, %username%
                
                this.renderSingleBubble(x, 1, key, value);
                this.addChoiceLabel (x - 13, key, value); 

            }
        }
    }

    BubbleChartView.prototype.addChoiceLabel = function (pos, key, value) {
    	var choice_key = $("#" + this.rootEl + " .choice-key"),
        	choice_content = $("#" + this.rootEl + " .choice-content"),
        	choice_value = $("#" + this.rootEl + " .choice-value");

       choice_key.css({"display" : "block", "left": pos + "px"});
       choice_content.text(key);
       choice_value.css({"display" : "block", "left": pos - 3 + "px"}).html(value+ "%");
    }
    
    /* Add top and bottom labels */
    BubbleChartView.prototype.addExtremeLabels = function (pos, extremeType) {
        //var label = $(".extreme-label");
        //TODO remove extreme labels before reloading

    //    this.$rootEl.append("<div class='extreme-label' style='left: " + pos +"px'>"+ extremeType +"<\/div>");

    }
    BubbleChartView.prototype.update = function (yourChoice) {
        
        console.log(this.model.bubbleChartLocData);
        //console.log()
        if (this.chartType === "location") {
            this.renderAxis(this.model.bubbleChartLocData);
            this.renderBubbles(yourChoice, this.model.bubbleChartLocData);
        } else {
            this.renderAxis(this.model.bubbleChartOccData);
            this.renderBubbles(yourChoice, this.model.bubbleChartOccData); 
        }

    }

	BubbleChartView.prototype.addPubsub = function() {
		var that = this;


		pubsub.on('gender-object-updated', function() {
        	
        	//Draw bubbles using the data
            if (that.yourChoice !== "") {
            	that.update();
            }
        });
		pubsub.on('location-object-updated', function(yourChoice) {
        	
            
            //if (that.chartType === "location") {
                that.update(yourChoice);
            //}
           // console.log(that.chosenLocation)
        });
        pubsub.on('occupation-object-updated', function(yourChoice) {
            
            if (that.chartType === "occupation") {
                that.update(yourChoice);
            }
            //that.update(yourChoice);
           // console.log(that.chosenLocation)
        });
	}
	BubbleChartView.prototype.init = function() {  

        (this.chartType === "location") ? this.renderAxis(this.model.bubbleChartLocData) : this.renderAxis(this.model.bubbleChartOccData)
        //console.log(this.model.bubbleChartLocData, this.model.bubbleChartOccData)
        this.addPubsub();

    }


	return BubbleChartView;

})