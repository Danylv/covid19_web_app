const section = document.querySelector('tbody');
//const startDate = document.getElementById('min-date');
//const endDate = document.getElementById('max-date');
//console.log(formatDate(startDate.value));
//console.log(formatDate(endDate.value));

//var minDate, maxDate;

// API URL
const requestURL = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/';
const request = new XMLHttpRequest();
request.open('GET', requestURL);
//request.setRequestHeader('Access-Control-Allow-Origin', 'application/xml'); // ANYWAY CORS ERROR
request.responseType = 'json';
request.send();


request.onload = function() {
  const covid19 = request.response;
  showRecords(covid19);
   
    $.fn.dataTable.ext.search.push(
        
        function( settings, data, dataIndex ) {      
            let filterColumn = parseFloat( data[1] ) || 0;  
            let min = parseInt( $('#input-min').val(), 10 );
            let max = parseInt( $('#input-max').val(), 10 );

            if ( ( isNaN( min ) && isNaN( max ) ) ||
                 ( isNaN( min ) && filterColumn <= max ) ||
                 ( min <= filterColumn   && isNaN( max ) ) ||
                 ( min <= filterColumn   && filterColumn <= max ) )
            {
                return true;
            }
            return false;
        },


        function( settings, data, dataIndex ) {
            let min = formatDate($('#min-date').val());
            let max = formatDate($('#max-date').val());
            let date = data[7];
            console.log(min,max);


            if (
                ( min === null && max === null ) ||
                ( min === null && date <= max ) ||
                ( min <= date   && max === null ) ||
                ( min <= date   && date <= max )
            ) {
                return true;
            }
            return false;
        }

    );    
    
    
// DATATABLES LIBRARY CODE
$(document).ready(function() {
    


    const oTable = $('#myTable').DataTable({
        
        bfilter: true,
        language: {
            "info": "_START_ - _END_ / _TOTAL_ записей",
            "infoFiltered":  "(отфильтр. из _MAX_)",
            "lengthMenu": "Показать _MENU_ записей",
            "paginate": {
                "first": "Первая",
                "previous": '<i class="fas fa-backward"></i>',
                "next": '<i class="fas fa-forward"></i>',
                "last": "Последняя"
            },
        }
    });
    

    
    //$('#search_in').keyup(function(){
    //  oTable.search($(this).val()).draw() ;
    //})
    
    $('#search_in').on('keyup change', function () {
       oTable.column(0).search($(this).val()).draw();
    });
    
    $('#input-min, #input-max').keyup( function() {
        oTable.draw();
    } );   
    
    $('#min-date, #max-date').on('change', function () {
        oTable.draw();
    });
    
    //$('#reset-filters').click(function() {
    //     //$("#myTable").DataTable().search("").draw();
    //    console.log('RESET CLICK', );
    //    oTable.draw();
    //    });      
 });    
}

// MAIN DATA PROCESSOR AND TABLE GENERATION
function showRecords(jsonObj) {
    const dateInput_1 = document.getElementById('date-input-1')
    const dateInput_2 = document.getElementById('date-input-1')
    const covidRecords = jsonObj['records'];
    
  for (let i = 0; i < 1000; i++) {  
  //for (var i = 0; i < covidRecords.length; i++) {
    const tableLine = document.createElement('tr');
    const date = document.createElement('td');
    //date.className = "d-none";
    const day = document.createElement('td');   
    const month = document.createElement('td');
    const year = document.createElement('td');
    const cases = document.createElement('td');
    const deaths = document.createElement('td');
    const country = document.createElement('td');
    //var geoId_08 = document.createElement('td');
    //var countryCode_09 = document.createElement('td');
    const popData = document.createElement('td');
    //var continentExp_11 = document.createElement('td');
    //var numberFor14days_12 = document.createElement('td');
    const averageCases = document.createElement('td');
    const averageDeaths = document.createElement('td');
    const allCases = document.createElement('td');
    const allDeaths = document.createElement('td');
      
      //var covidCountry = covidRecords.filter(r => r.countriesAndTerritories === covidRecords[i].countriesAndTerritories);
    //var covidCountry = getAllCases(i, covidRecords);
      
    //date.textContent = covidRecords[i].dateRep;
    date.textContent = covidRecords[i].year + '/' + covidRecords[i].month + '/' + covidRecords[i].day;
    day.textContent = covidRecords[i].day;
    month.textContent = covidRecords[i].month;
    year.textContent = covidRecords[i].year;
    cases.textContent = covidRecords[i].cases;
    deaths.textContent = covidRecords[i].deaths;
    country.textContent = covidRecords[i].countriesAndTerritories;
    //geoId_08.textContent = covidRecords[i].geoId;
    //countryCode_09.textContent = covidRecords[i].countryterritoryCode;
    popData.textContent = covidRecords[i].popData2019;
    //continentExp_11.textContent = covidRecords[i].continentExp;
    //var someKey = covidRecords[i];
    //numberFor14days_12.textContent = someKey['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'];
    averageCases.textContent = ((covidRecords[i].cases / covidRecords[i].popData2019) * 1000).toFixed(5);
    averageDeaths.textContent = ((covidRecords[i].deaths / covidRecords[i].popData2019) * 1000).toFixed(5);
    allCases.textContent = getAllCases(i, covidRecords);
    allDeaths.textContent = getAllDeaths(i, covidRecords);

    
    tableLine.appendChild(country);
    tableLine.appendChild(cases);
    tableLine.appendChild(deaths);
    tableLine.appendChild(allCases);
    tableLine.appendChild(allDeaths);
    tableLine.appendChild(averageCases);
    tableLine.appendChild(averageDeaths);
    tableLine.appendChild(date);
    //tableLine.appendChild(date);
    //tableLine.appendChild(day);
    //tableLine.appendChild(month);
    //tableLine.appendChild(year);
    
    
    //myArticle.appendChild(geoId_08);
    //myArticle.appendChild(countryCode_09);
    //tableLine.appendChild(popData);
    //myArticle.appendChild(continentExp_11);
    //myArticle.appendChild(numberFor14days_12);
    section.appendChild(tableLine);
  }
    
}
    
// TRYING MAKE WORKING SEARCH FOR EACH SELECT OPTION
function getColumn(data) {
    console.log($( "#filter-select option:selected" ).val())
    let filterColumn = parseFloat( data[1] ) || 0;
    return filterColumn;
}

// TOOL FOR OPERATING WITH DATA
function sum() {
    let sum = 0;
    for(i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return sum
}

//var list = [3, 4, 10, 15];
//console.log(sum.apply(null, list));


// GET ALL CASES FOR EACH COUNTRY
function getAllCases(index, data) {   
    const getCountry = data.filter(r => r.countriesAndTerritories === data[index].countriesAndTerritories);
    let arrayOfCases = [];
    //console.log(countries);
    for(let z = 0; z < getCountry.length; z++){
        arrayOfCases.push(getCountry[z].cases);
    }
    const allCases = sum.apply(null, arrayOfCases);
    //console.log(allCases)
    return allCases;
}


// GET ALL DEATHS FOR EACH COUNTRY
function getAllDeaths(index, data) {
    const getCountry = data.filter(r => r.countriesAndTerritories === data[index].countriesAndTerritories);
    let arrayOfDeaths = [];
    //console.log(countries);
    for(let z = 0; z < getCountry.length; z++){
        arrayOfDeaths.push(getCountry[z].deaths);
    }
    const allDeaths = sum.apply(null, arrayOfDeaths);
    //console.log(allDeaths)
    return allDeaths;
}


// DATE DATA FORMAT CONVERTER  
function formatDate(date) {
     var d = new Date(date),
         month = '' + (d.getMonth() + 1),
         day = '' + d.getDate(),
         year = d.getFullYear();
     if (month.length < 2) month = '0' + month;
     if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('/');
 }