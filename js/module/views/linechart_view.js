/*
 * View reposponsible for handling the graph
 * @param model
 */
 
define(['newsspec_4950/bootstrap',
	    'raphael'
	  ],
	function (news) {

		var $ = news.$,
            pubsub = news.pubsub, 
			LineChartView;

		LineChartView = function (model) {
			var self = this;
			this.model = model;
			this.graphEl = 'chart';
			this.r = Raphael(this.graphEl);
            
            this.lineSets = {'default' : this.r.set(),
                            'gender': this.r.set(),
                            'location': this.r.set(),
                            'occupation' : this.r.set(),
                            'yAxisLabels' : this.r.set()
                            };
            this.labelsSets = {'default' : this.r.set(),
                             'gender': this.r.set(),
                             'location': this.r.set(),
                             'occupation' : this.r.set()
                            };
            this.labelsPosition = {};
            this.bubblesPosition = {};
            this.legendEl = $('.line-chart__legend-all');  
		};

        LineChartView.prototype.options = {
            canvasWidth : 560, //graph width
            canvasHeight : 250,
            leftPadding : 20,
            rightPadding : 60,
            topPadding : 35,
            axisxstep: 4,
            chartColumnWidth : 112,
            dataMin : 0,
            dataMax : 10
        };

        LineChartView.prototype.colours = {
            default: '#999999',
            gender: '#522751',
            location: '#DFA300',
            occupation: '#385C7C'
        };

        LineChartView.prototype.drawAxis = function () {
            var cw = this.options.canvasWidth,
                ch = this.options.canvasHeight,
                lp = this.options.leftPadding,
                rp = this.options.rightPadding,
                tp = this.options.topPadding,
                x,
                y;
            
            y = this.r.path("M" + lp + "," + tp + "L" + lp + "," + (ch + tp)).attr({"stroke":"#CCCCCC", "stroke-width": 1});
            x = this.r.path("M"+ lp + "," + (ch + tp) + "L"+ (cw + lp) + "," + (ch + tp)).attr({"stroke":"#999999", "stroke-width": 2});
        };

        //this function decides what is max and min of the full dataset
        LineChartView.prototype.setMaxMinAxisY = function (type) {

            var oldDataMax = this.options.dataMax,
                defaultData = this.model.defaultPanelData.monthlyData || [],
                genderData = this.model.genderPanelData.monthlyData || [],
                locationData = this.model.locationPanelData.monthlyData || [],
                occupationData = this.model.occupationPanelData.monthlyData || [],
                allData = defaultData.concat(genderData, locationData, occupationData),
                sortedData = [],
                finalData = [];

                //Convert data to numbers
                for (var i = 0; i < allData.length; i++) {
                    if(allData[i]===-1) {
                        continue;
                    } else {
                        sortedData.push( (parseFloat(allData[i]) * 100));
                    }
                }
                finalData = this.model.simpleSort(sortedData);

                //Setting up min and max for the whole object
                this.options.dataMax = (finalData[finalData.length-1] <= 10) ? 10 : Math.ceil(finalData[finalData.length-1]);
                this.options.dataMin = (finalData[0] < 0) ? ( Math.floor(finalData[0]) ) : 0;
                 
                //console.log(type + ' from datamax');
                //check if max has changed
                if(oldDataMax !== this.options.dataMax) {
                    pubsub.emitEvent('datamax-changed-' + type);
                }
        };      

        LineChartView.prototype.drawYAxisTopLabel = function () { 
            this.r.text(17, this.options.topPadding - 15, '%')
                 .attr({'font-size': 14, 'font-weight': 'bold', 'text-anchor': 'end',"fill": '#505050'});
        };

        LineChartView.prototype.drawYAxisLabels = function () {           
            var ch = this.options.canvasHeight,
                tp = this.options.topPadding,
                axisYMin, 
                axisYMax;

            //clearing the set before re-drawing the y-axis labels
            this.removeLine('yAxisLabels');

            this.lineSets['yAxisLabels'].push (this.r.text(14, ch + tp - 5, this.options.dataMin)
                        .attr({'font-size': 14, 'font-weight': 'normal', 'text-anchor': 'end',"fill": '#505050'})
                        );
            this.lineSets['yAxisLabels'].push (this.r.text(17, 6 + tp, this.options.dataMax)
                        .attr({'font-size': 14, 'font-weight': 'normal', 'text-anchor': 'end',"fill": '#505050'})
                        );
        };

        LineChartView.prototype.drawXAxisLabels = function () {
            
            var ch = this.options.canvasHeight,
                cw = this.options.canvasWidth,
                lp = this.options.leftPadding,
                rp = this.options.rightPadding,
                tp = this.options.topPadding,
                axisxstep = this.options.axisxstep,
                startingYear = parseInt(this.model.currentYear) - this.options.axisxstep,
                stepX,
                xShift = ( this.options.chartColumnWidth / 12) * this.model.convertMonthToNumber();

            stepX = (cw - lp + 15)/(this.options.axisxstep + 1);
                
            for( var i = 0; i <= this.options.axisxstep; i++ ) { 
                var year = startingYear + i;
                this.r.text(xShift + i * stepX + lp, ch + tp + 10, year)
                    .attr({'font': 'normal 14px/16px Arial', 'letter-spacing' : '-0.6px', 'text-anchor': 'start', 'fill': '#505050'});
            }
        };

        Raphael.fn.drawGrid = function (x, xShift, y, w, h, wv, hv, color) {
            color = color || "#505050";
            var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) /*+ .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5*/],
                rowHeight = h / hv,
                columnWidth = w / wv;

            for (var i = 1; i < hv; i++) {
                 path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
            }
            for (i = 1; i <= wv; i++) {
                path = path.concat(["M", (-columnWidth/12)* xShift + Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
            }
            
            return this.path(path.join(",")).attr({stroke: color});
        };

        LineChartView.prototype.drawLine = function (data, type) {
            this.removeLine(type);
            var ch = this.options.canvasHeight,
                cw = this.options.canvasWidth,
                lp = this.options.leftPadding,
                tp = this.options.topPadding,
                stepY, 
                stepX;

            stepX = (cw / (data.length) ); 
            stepY = (ch + tp - 10) / (Math.round(this.options.dataMax + 1) - this.options.dataMin);

            for (var i = 0; i < data.length; i++ ) {
                
                if(data[i] === -1 || data[i+1] === -1) {
                    continue;
                } else {
                this.lineSets[type].push( this.r.path("M" +  (i * stepX  + lp) + "," + (tp + stepY * (this.options.dataMax - 100 * parseFloat(data[i])) ) 
                          + "L" + ((i + 1) * stepX + lp) + "," + (tp + stepY * (this.options.dataMax - 100 * parseFloat(data[i+1])) ))
                       .attr({"stroke" : this.colours[type], "stroke-width": 1})
                       );
                }
            }

            this.addLastPointLabel(type, data, stepX, stepY, lp, tp);
            this.handleLinesStrokeWidths(type);
            this.drawYAxisLabels();
        };

        LineChartView.prototype.addLegendItem = function (type) {

            var legendItemEl = this.legendEl.find('.' + type);
                legendItemEl.hide();

            switch(type) {
                case 'gender': legendText = this.model.getGender();
                    break;
                case 'location': legendText = this.model.location;
                    break;
                case 'occupation' : legendText = this.model.capitaliseFirstLetter(this.model.getOccupationForCharts(this.model.occupation));
                    break;
                default: '';
                    break;
                }   

            if (this.model[type + 'PanelData'].monthlyData.length!==0) {
                legendItemEl.show().html(legendText);
            }
        };

        /* Style requirement */
        LineChartView.prototype.handleLinesStrokeWidths = function (currentType) {
            for (var key in this.lineSets) {
                this.lineSets[key].attr("stroke-width", (key === currentType) ? 2 : 1);
            }
        };

        LineChartView.prototype.removeLine = function (type) {
            this.lineSets[type].splice(0, this.lineSets[type].length).remove();
        };

        LineChartView.prototype.removeLabel = function (type) {
            this.labelsSets[type].splice(0, this.labelsSets[type].length).remove();
        };

        LineChartView.prototype.addLastPointLabel = function (type, data, stepX, stepY, lp, tp) {
            
            var x = (data.length-1) * stepX + lp,
                y = (tp + stepY * (this.options.dataMax - 100 * parseFloat(data[data.length-1])) ),
                numberToDisplay = (100 * parseFloat(data[data.length-1])).toFixed(1);

            if (this.labelsSets[type].length !== 0) {
                this.removeLabel(type);
            }

            if(data.length !== 0) {
                this.labelsSets[type]
                        .push( this.r.circle(x, y, 4)
                        .attr({"stroke-width" : 0, "fill" : this.colours[type]}) );
                this.labelsSets[type]
                        .push( this.r.circle(x, y, 6)
                        .attr({"stroke-width" : 1, "stroke" : this.colours[type], "fill" : "none", "fill-opacity": 0.75}) );

                this.labelsSets[type]
                    .push( this.r.text(x + 8, y - 2, numberToDisplay + '%')
                    .attr({'font': 'bold 16px/16px Arial', 'letter-spacing' : '-0.1px', 'text-anchor': 'start', 'fill': this.colours[type]}) );
            }

            this.positionLastPointLabels(type);
        };

        LineChartView.prototype.positionLastPointLabels = function (type) {
            
            var model = this.model,
                obj = {},
                sortable = [],
                optimalDiff = 14;

            try {

                obj.key = type;
                obj.position = this.labelsSets[type][2].attr('y');
                obj.bubblesPosition = this.labelsSets[type][1].attr('cy');
                this.labelsPosition[type] = obj;



                //1. Sort object by the distances
                for (type in this.labelsPosition) {
                    var object = this.labelsPosition[type];
                    sortable.push(object);
                }
                sortable = this.model.sortDataForLabelsPosition(sortable);

                //2. Calculate differences
                for (var i=0; i < sortable.length-1; i++) {
                    sortable[i+1].diff = sortable[i+1].position - sortable[i].position;

                    if(sortable[i+1].diff < optimalDiff) {
                        sortable[i+1].position += (optimalDiff - sortable[i+1].diff);
                        sortable[i+1].diff = sortable[i+1].position - sortable[i].position;
                    } 
                }

                //3. Reposition a single label
                for (var i=0; i < sortable.length; i++) {
                    this.labelsSets[sortable[i].key][2].attr({'y': sortable[i].position});
                } 
            } catch(err) {

            }
        };

        LineChartView.prototype.redrawALine = function (types) {
           //console.log(types);
            for(var i=0; i < types.length; i++) {
                if(this.lineSets[types[i]].items.length!==0) {
                    this.drawLine(this.model[types[i]+'PanelData'].monthlyData, types[i]);
                }
            }
        };

        LineChartView.prototype.drawDefaultLine = function () {
            this.drawLine(this.model.defaultPanelData.monthlyData, 'default');
        };
        
        LineChartView.prototype.drawGenderLine = function () {
            var that = this;
            this.setMaxMinAxisY('gender');
            this.drawLine(this.model.genderPanelData.monthlyData, 'gender');
            this.redrawALine(['location', 'occupation']);

            pubsub.on('datamax-changed-gender', function () {
                that.redrawALine(['default']);      
            });
        };
        
        LineChartView.prototype.drawLocationLine = function () {
            var that = this;
            this.setMaxMinAxisY('location');
            this.drawLine(this.model.locationPanelData.monthlyData, 'location');  
            this.redrawALine(['occupation']);
            
            pubsub.on('datamax-changed-location', function () {
                that.redrawALine(['gender', 'default']);                
            });
        };
        
        LineChartView.prototype.drawOccupationLine = function () {
            var that = this;
            this.setMaxMinAxisY('occupation');
            this.drawLine(this.model.occupationPanelData.monthlyData, 'occupation');
            
            pubsub.on('datamax-changed-occupation', function () {
                that.redrawALine(['default', 'gender', 'location']);
            });
        };

        LineChartView.prototype.addListeners = function () {
            var that = this;

            pubsub.addListener('gender-object-updated', function () {
                that.drawGenderLine();
                that.addLegendItem('gender');
            });
            pubsub.addListener('location-object-updated', function () {
                that.drawLocationLine();
                that.addLegendItem('location');
            });
            pubsub.addListener('occupation-object-updated', function () {
                that.drawOccupationLine();
                that.addLegendItem('occupation');
            });
        };

        /* Init function */
        LineChartView.prototype.init = function () {
            
            this.addListeners();
            this.drawAxis();
            this.drawYAxisTopLabel();
            this.drawXAxisLabels();
            this.r.drawGrid(this.options.leftPadding,this.model.convertMonthToNumber(),this.options.topPadding,this.options.canvasWidth,this.options.canvasHeight,this.options.axisxstep+1,this.options.dataMax,'#CCCCCC');
            
            this.drawDefaultLine();
        };
		return LineChartView;
	});