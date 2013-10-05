<link href="/news/special/2013/newsspec_4950/css/main.css" rel="stylesheet" type="text/css" /> 

<!--project wrapper-->
<div id="newsspec_4950">

    <!--no-js-->
    <p class="newsspec_4950--no-js">In order to see this content you need to have <a href="http://www.bbc.co.uk/webwise/askbruce/articles/browse/java_1.shtml" title="BBC Webwise article about enabling javascript">Javascript</a> enabled. Visit <a href="http://www.bbc.co.uk/webwise/">BBC Webwise</a> for full instructions.
    </p>
    <!--/no-js-->

    <!--js-->
    <div class="newsspec_4950--js">
            <!--choices-->
            <div class="choices"> 
                <!--gender choices-->              
                <div class="choices__gender">
                    <h3 class="choices__gender-header"></h3>
                    <form class="choices__gender-select" action="">
                        <div class="choices__gender-select-item">
                            <input type="radio" name="gender" value="M"/>
                            <label for="male">Male</label>
                        </div>
                        <div class="choices__gender-select-item choices__gender-select-item--female">
                            <input type="radio" name="gender" value="F"/>
                            <label for="female">Female</label>
                        </div>
                    </form>
                </div>
                <!--/gender choices-->

                <!--location choices-->
                <div class="choices__location">
                    <h3 class="choices__location-header">Where are you?</h3>
                    <div class="choices__location-dropdown">
                        <span>Select...</span>
                    </div>
                    <ul class="choices__location-list list"></ul>
                    <script id="locationList" type="x-text/template">
                        <% for ( var i=0;  i<dataList.length; i++ ) { %>
                            <li><%=dataList[i]%></li>
                        <% } %>
                </script>
                </div>
                <!--/location choices-->

                <!--occupation choices--> 
                <div class="choices__occupation">
                    <h3 class="choices__occupation-header">What do you do?</h3>
                    <div class="choices__occupation-dropdown">
                        <span>Select...</span>
                    </div>
                    <ul class="choices__occupation-list list"></ul>
                    <script id="occupationList" type="x-text/template">
                        <% for ( var occ in dataList ) { %>
                            <li id="<%=occ%>" class="item"><%=dataList[occ].forDropdown%></li>
                        <%}%>
                    </script>
                </div>             
                <br class="clear" />
            </div>
            <!--/choices-->

            <!--results-->
            <div class="results">
                <!--default-->
                <div class="results__default"></div>
                <!--/default-->

                <!--all-->
                <div class="results__all">
                    <h4 class="results__all-header"></h4>
                    <div class="results__all-item results__all-gender">
                        <p class="results__all-your-choice">
                            In the UK 940,417 men claimed JSA, a rate of</p>
                        <div class="results__all-absolute">
                            <h4 class="percentage">6%</h4>
                        </div>
                        <div class="results__all-relative">
                            <h4 class="up">1.2%</h4>
                            <p>Annual change</p>
                        </div>
                    </div>
                    <!--end of gender results-->

                    <div class="results__all-item results__all-location">
                        <p class="results__all-your-choice">In London 940,417 men claimed JSA, a rate of</p>
                        <div class="results__all-absolute">
                            <h4 class="percentage">6%</h4>
                        </div>
                        <div class="results__all-relative">
                            <h4 class="down">1.2%</h4>
                            <p>Annual change</p>
                        </div>
                    </div> 
                    <!--end of locations results-->

                    <div class="results__all-item results__all-occupation">
                        <p class="results__all-your-choice">1,417 female business or finance mid-ranking staff in London claimed JSA, giving them a rate of</p>
                        <div class="results__all-absolute">
                            <h4 class="percentage">56%</h4>
                        </div>
                        <div class="results__all-relative">
                            <h4 class="down">1.2%</h4>
                            <p>Annual change</p>
                        </div>
                    </div>
                    <!--end of occupations results-->

                </div>
                <!--/all-->               
            </div> 
            <!--/results-->

            <!--share-->
                <!--div class="share-results"></div-->
            <!--/share-->

            <!--bubble charts-->
            <div class="bubble-charts">
                <h4 class="bubble-chart__header">Where does <span class="yourLocation">London</span> fit in?</h4>
                <div id="bubble-chart--loc" class="bubble-chart">
                    <div class="tip-key" style="display: none">
                        <div class="tip-content"></div>
                        <div class="tip-beak"></div>
                    </div>
                    <div class="choice-key" style="display: none">
                        <div class="choice-content"></div>
                        <div class="choice-beak"></div>
                    </div>
                    <div class="tip-value" style="display: none"></div>
                    <div class="choice-value" style="display: none"></div>
                </div>
                <h4 class="bubble-chart__header">Where do <span class="yourOccupation">management</span> fit in?</h4>
                <div id="bubble-chart--occ" class="bubble-chart">  
                    <div class="tip-key" style="display: none">
                        <div class="tip-content"></div>
                        <div class="tip-beak"></div>
                    </div>
                    <div class="choice-key" style="display: none">
                        <div class="choice-content"></div>
                        <div class="choice-beak"></div>
                    </div>
                    <div class="tip-value" style="display: none"></div>
                    <div class="choice-value" style="display: none"></div>
                </div>
            </div>
            <!--/bubble charts-->

            <!--chart-->
            <div class="line-chart">
                <h4 class="line-chart__title">Jobseekers' claims over the past five years</h4>          
                <div id="chart"></div>
                <p class="line-chart__legend-default">UK average</p>
                <ul class="line-chart__legend-all">
                    <li class="line-chart__legend-item gender">Gender</li>
                    <li class="line-chart__legend-item location">Location</li>
                    <li class="line-chart__legend-item occupation">Occupation</li>
                </ul>
            </div>
            <!--/chart--> 

        </div>
        <!--/js-->

    </div>
    <!--/project wrapper-->

   <script><!--#include virtual="/news/special/2013/newsspec_4950/inc/compiled/mainjs.min.inc" --></script>