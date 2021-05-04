# covid19_web_app
Application for getting statistics about covid19 epidemic from official JSON API. Technologies used: HTML, CSS, Bootstrap, JavaScript, JQuery, DataTables.

Making XMLHttpRequest request or using Fetch method for response from API opendata.ecdc.europa.eu/covid19/casedistribution/json/ was get CORS «Access-Control-Allow-Origin» error in console, so need install and activate plugin in your browser add0n.com/access-control.html

Page to test CORS requests in your browser webbrowsertools.com/test-cors/

Not finding a solution of long processing JSON data array, limited it's processing cycle to 10000 in app.js line 95.