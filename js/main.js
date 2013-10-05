(function () {

    var currentEnv = "dev",
        baseUrl = window.location.hostname,
        projectNumber = "4950",
        basePath = "/news/special/2013/newsspec_" + projectNumber + "/",
        config,
        isMobile = (!!window.bbcNewsResponsive),
        version = "1.0",
        projectWrapper = document.getElementById("newsspec_" + projectNumber),
        OSName = "";

    /* Check if Mac or Linux */
    if (navigator.platform === "MacIntel") { OSName = "MacOS"; }

    /* Manage localhost vs. bbcimg + OS */
    if (baseUrl.match(/local|localhost|[0-9]|sandbox|newsspec/)) {
        if (baseUrl.match(/localhost/) && OSName === "MacOS") {
            baseUrl = "http://" + baseUrl + ":8888";
        } else {
            baseUrl = "http://" + baseUrl;
        }
        
    } else {
        baseUrl = "http://news.bbcimg.co.uk";
    }

    /* Require configs */
    config = {
        paths: {
            "newsspec_4950": baseUrl + basePath,
            "newsspec_4950/module" : baseUrl + basePath + "js/module",
            "newsspec_4950/data": baseUrl + basePath + "data",
            "newsspec_4950/bootstrap": baseUrl + basePath + "js/bootstrap-desktop",
            "vendor" : baseUrl + basePath + "js/vendor",
            "raphael" : "http://news.bbcimg.co.uk/news/special/shared/js/raphaeljs/amd/v1/raphael-min-amd"
        }
    };

    /* Desktop */
    if (!isMobile) {

        projectWrapper.className = "desktop";
    
        if (currentEnv !== "dev") {
            config.paths["js"] = baseUrl + "/news/special/2013/newsspec_4950/js/compiled/desktop";
        }
    
    } else { 
        projectWrapper.className = "mobile";

        config.paths["newsspec_4950/bootstrap"] = baseUrl + basePath + "js/bootstrap";

        if (currentEnv !== "dev") {
            config.paths["js"] = baseUrl + "/news/special/2013/newsspec_4950/js/compiled/mobile";
        }    
    }

    require(config, [(currentEnv !== "dev") ? "js/project_all" : "newsspec_4950/module/app"], function () {
        require(["newsspec_4950/module/app"], function (app) {
                app.init(isMobile);
            });
    }); //end of require

}()); //end of the sia function