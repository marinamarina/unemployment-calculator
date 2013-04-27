define(['newspec_4950/bootstrap', 'highcharts'],
    function (news, Highcharts) {
    var $ = news.$,
        pubsub = news.pubsub,
        LineChartView;
    
    LineChartView = function (model) {
        this.model = model;
        
    }

    LineChartView.prototype.colors = {
        location: '#DFA300',
        occupation: '#385C7C'
    }
    LineChartView.prototype.init = function(results, price, title) {
            var data1 = {
                name: 'Men in London',
                data: [3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.3,3.90,4.13,4.3,3.90,4.13,4.3,3.90,4.13,4.3,3.90,4.13,4.3,6.3]
            },
            data2 = {
                name: 'Male corporate',
                data: [3.0, 3.6, 3.5, 3.5, 3.2, 4.5, 3.0, 3.4, 3.5, 4.5, 6.2, 3.4, 3.0, 2.6, 3.5, 4.5, 3.2, 3.5, 3.0, 2.6, 2.5, 4.5, 2.2, 2, 4.5, 1.2, 1, 3.0, 0.6, 0.5, 0.5, 1.2, 5.7]
            },
            data4 = {
                name: 'Male',
                data: [3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,3.50,3.60,3.70,3.80,3.90,4.13,5.1]
            },
            data3 = {
                name: 'UK average',
                data: [3.40,2.30,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,4.63,4.80,4.97,5.14,5.30,5.47,5.64,5.81,3.40,2.30,3.50,3.60,3.70,3.80,3.90,4.13,4.30,4.46,4.63,4.80,4.97,5.14,5.30,5.47,5.64,5.81,6.98,7.16,8.31,7.48,7.35,6.81,6.98,7.15,7.32,7.49, 6.98,7.16,8.31,7.48,7.35,6.81,6.98,7.15,7.32,7.49,6.65,6.64,6.99,6.2]
            }; 

            var myData = [];
            

            if (!Highcharts) { return; }

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'line-chart',
                type: 'line',
                margin: [null, 90, null, null]
            },
            colors: [
                '#f68b23',
                '#164366',
                '#d8b728'
            ],
            title: {
                text: 'Jobseekers claim over the past five years',
                align: 'left',
                margin: 50, 
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#505050'
                }
            },
            xAxis: {
                categories: [],
                lineColor: '#999999',
                lineWidth: 2,
                gridLineColor: '#CCCCCC',
                tickColor: '#CCCCCC',
                tickInterval: 12,
                gridLineWidth: 1,
                showLastLabel: true,
                labels: {
                    enabled: true,
                    //step: 12,
                    formatter : function() {
                        return 2007 + Math.floor(this.value/12);
                    }
                }
                
            },
            yAxis: {
                lineColor: '#CCCCCC',
                lineWidth: 1,
                title: {
                    text: '%',
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    x: -5,
                    y: -10,
                    style: {
                        fontSize: '14px',
                        color: '#505050',
                        fontWeight: 'regular'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '%'
            },
            legend: {
                enabled: true,
                floating: true,
                align: 'left',
                verticalAlign: 'top',
                x: 15,
                y: 35,
                borderWidth: 0
            },
            plotOptions: {
                line: {
                    marker: {
                    enabled: false,
                    lineColor: null,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                    },
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        align: 'left',
                        x: 0,
                        y: 0,
                        crop: false,
                        padding: 30,
                        formatter: function() {

                            if (this.point.x == this.series.data.length - 1) {
                                //console.log(this.point.plotY)
                                return '<div class="label"><p style="margin: 0; padding: 0;">' + this.series.name + '</p><p style="font: bold 18px/16px Arial; color:' + this.series.color + ';">'+ this.y+'%</p></div>';
                            } else {
                                return null;
                            }
                        }
                    }
                }
            },

            credits: {
                enabled: false   
            },
            series: [data3]
                
            });

        }
           /* $(function () {
            
            var chart = $('#jobseekers-chart').highcharts({
            chart: {
                type: 'line',
                margin: [null, 90, null, null]
            },
            colors: [
                '#f68b23',
                '#164366',
                '#d8b728'
            ],
            title: {
                text: 'Jobseekers claim over the past five years',
                align: 'left',
                margin: 50, 
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#505050'
                }
            },
            xAxis: {
                categories: [],
                lineColor: '#999999',
                lineWidth: 2,
                gridLineColor: '#CCCCCC',
                tickColor: '#CCCCCC',
                tickInterval: 12,
                gridLineWidth: 1,
                showLastLabel: true,
                labels: {
                    enabled: true,
                    //step: 12,
                    formatter : function() {
                        return 2007 + Math.floor(this.value/12);
                    }
                }
                
            },
            yAxis: {
                lineColor: '#CCCCCC',
                lineWidth: 1,
                title: {
                    text: '%',
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    x: -5,
                    y: -10,
                    style: {
                        fontSize: '14px',
                        color: '#505050',
                        fontWeight: 'regular'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '%'
            },
            legend: {
                enabled: true,
                floating: true,
                align: 'left',
                verticalAlign: 'top',
                x: 15,
                y: 35,
                borderWidth: 0
            },
            plotOptions: {
                line: {
                    marker: {
                    enabled: false,
                    lineColor: null,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                    },
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        align: 'left',
                        x: 0,
                        y: 0,
                        crop: false,
                        padding: 30,
                        formatter: function() {

                            if (this.point.x == this.series.data.length - 1) {
                                //console.log(this.point.plotY)
                                return '<div class="label"><p style="margin: 0; padding: 0;">' + this.series.name + '</p><p style="font: bold 18px/16px Arial; color:' + this.series.color + ';">'+ this.y+'%</p></div>';
                            } else {
                                return null;
                            }
                        }
                    }
                }
            },

            credits: {
                enabled: false   
            },
            series: [data3]
        });
        $('button.b1').click(function() {
            var chart = $('#jobseekers-chart').highcharts();
            chart.addSeries(data1);
        });
        $('button.b2').click(function() {
            var chart = $('#jobseekers-chart').highcharts();
            chart.addSeries(data2);
        });
        $('button.b3').click(function() {
            var chart = $('#jobseekers-chart').highcharts();
            chart.addSeries(data4);
            /*var x = $(".highcharts-data-labels>div");
            var height1 = parseInt($(x[x.length-2]).css("top").substr(0, $(x[x.length-2]).css("top").length-2));
            var height2 = parseInt($(x[x.length-1]).css("top").substr(0, $(x[x.length-2]).css("top").length-1));
            if(height2-height1 < 60) {

                //$(x[x.length-1]).css("top", "height2 + 60 + 'px'");
            //}
        });

    });*/


    return LineChartView;

})