// API URL
const requestURL = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/';

const fetchData = async function () {
    const response = await fetch(requestURL);
    const data = await response.json();

    showRecords(data);

    // DATATABLES LIBRARY CODE
    $.fn.dataTable.ext.search.push(
      
        function (settings, data, dataIndex) {
            let select = document.getElementById("search-filter-select");
            let selectedOption = select.value;
            
            let filterColumn = parseFloat(data[selectedOption]) || 0;
            let min = parseInt($('#input-min').val(), 10);
            let max = parseInt($('#input-max').val(), 10);

            if ((isNaN(min) && isNaN(max)) ||
                (isNaN(min) && filterColumn <= max) ||
                (min <= filterColumn && isNaN(max)) ||
                (min <= filterColumn && filterColumn <= max)) {
                return true;
            }
            return false;
        },


        function (settings, data, dataIndex) {
            let min = formatDate($('#min-date').val());
            let max = formatDate($('#max-date').val());
            let date = data[7];

            if (
                (min === null && max === null) ||
                (min === null && date <= max) ||
                (min <= date && max === null) ||
                (min <= date && date <= max)
            ) {
                return true;
            }
            return false;
        }

    );
    
    
    $(document).ready(function () {

        const oTable = $('#myTable').DataTable({

            language: {
                "info": "_START_ - _END_ / _TOTAL_ записей",
                "infoFiltered": "(отфильтр. из _MAX_)",
                "lengthMenu": "Показать _MENU_ записей",
                "paginate": {
                    "first": "Первая",
                    "previous": '<i class="fas fa-backward"></i>',
                    "next": '<i class="fas fa-forward"></i>',
                    "last": "Последняя"
                },
            }
        });

        $('#reset-filters').click(function () {
            let form = document.getElementById("app");
            form.reset();
            oTable.column(0).search("").draw();
        });

        $('#search-country').on('keyup change', function () {
            oTable.column(0).search($(this).val()).draw();
        });

        $('#input-min, #input-max').keyup(function () {
            oTable.draw();
        });

        $('#min-date, #max-date').on('change', function () {
            oTable.draw();
        });
        
    });

}


// MAIN DATA PROCESSOR AND TABLE GENERATION
function showRecords(jsonObj) {
    const section = document.querySelector('tbody');
    const covidRecords = jsonObj['records'];

    for (let i = 0; i < 10000; i++) {
        //for (var i = 0; i < covidRecords.length; i++) {
        const tableLine = document.createElement('tr');
        const date = document.createElement('td');
        date.className = "d-none";

        const cases = document.createElement('td');
        const deaths = document.createElement('td');
        const country = document.createElement('td');
        const averageCases = document.createElement('td');
        const averageDeaths = document.createElement('td');
        const allCases = document.createElement('td');
        const allDeaths = document.createElement('td');
        
        date.textContent = covidRecords[i].year + '/' + covidRecords[i].month + '/' + covidRecords[i].day;
        cases.textContent = covidRecords[i].cases;
        deaths.textContent = covidRecords[i].deaths;
        country.textContent = covidRecords[i].countriesAndTerritories;
        allCases.textContent = getAllCases(i, covidRecords);
        allDeaths.textContent = getAllDeaths(i, covidRecords);
        averageCases.textContent = ((covidRecords[i].cases / covidRecords[i].popData2019) * 1000).toFixed(5);
        averageDeaths.textContent = ((covidRecords[i].deaths / covidRecords[i].popData2019) * 1000).toFixed(5);

        tableLine.appendChild(country);
        tableLine.appendChild(cases);
        tableLine.appendChild(deaths);
        tableLine.appendChild(allCases);
        tableLine.appendChild(allDeaths);
        tableLine.appendChild(averageCases);
        tableLine.appendChild(averageDeaths);
        tableLine.appendChild(date);
 
        section.appendChild(tableLine);
    }

}


// TOOL FOR OPERATING WITH DATA
function sum() {
    let sum = 0;
    for (i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return sum;
}


// GET ALL CASES FOR EACH COUNTRY
function getAllCases(index, data) {
    const getCountry = data.filter(r => r.countriesAndTerritories === data[index].countriesAndTerritories);
    let arrayOfCases = [];
    for (let z = 0; z < getCountry.length; z++) {
        arrayOfCases.push(getCountry[z].cases);
    }
    const allCases = sum.apply(null, arrayOfCases);
    return allCases;
}


// GET ALL DEATHS FOR EACH COUNTRY
function getAllDeaths(index, data) {
    const getCountry = data.filter(r => r.countriesAndTerritories === data[index].countriesAndTerritories);
    let arrayOfDeaths = [];
    for (let z = 0; z < getCountry.length; z++) {
        arrayOfDeaths.push(getCountry[z].deaths);
    }
    const allDeaths = sum.apply(null, arrayOfDeaths);
    return allDeaths;
}


// DATE DATA FORMAT CONVERTER  
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}


fetchData();