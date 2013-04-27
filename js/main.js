(function () {	
	var baseUrl = "http://localhost:8888",
    basePath = '/news/special/2013/newsspec_4950/',
    config = {},
    isDesktop = (window.bbc);

    if (isDesktop) {
        console.log('desktop');
        document.getElementById('newsspec_4950').className = 'desktop';
        config = {
           paths: {
               'newsspec_4950': baseUrl + basePath,
               'module' : baseUrl + basePath + "js/module",
               'newspec_4950/bootstrap': 'http://localhost:8888/news/special/2013/newsspec_4950/js/bootstrap-desktop',
               'raphael' : 'http://news.bbcimg.co.uk/news/special/shared/js/raphaeljs/amd/v1/raphael-min-amd',
               'highcharts' : 'http://news.bbcimg.co.uk/news/special/shared/js/highcharts/2.3.3/highcharts'
           
           }
       };
   } else {
    console.log("mobile environment");
    document.getElementById('newsspec_4950').className = 'mobile';
    config = {
       paths: {
           'newsspec_4950': baseUrl + basePath,
           'module' : baseUrl + basePath + "js/module",
           'newspec_4950/bootstrap': 'http://localhost:8888/news/special/2013/newsspec_4950/js/bootstrap',
           'raphael' : 'http://news.bbcimg.co.uk/news/special/shared/js/raphaeljs/amd/v1/raphael-min-amd',
           'highcharts' : ''
       }
   };
}

dependencies = ['module/app', (isDesktop) ? 'domReady!': ''];

require(config, dependencies, function (app, doc) { 
    app.init(isDesktop);
}); //end of require

}());//end of the sia function