let years = [];
let population = [];
let colors = ["#1CA4FA","#FF6633", "#FFB399", "#FFFF99", "#00B3E6"];

// wyszukiwanie panstwa
$("#search-country").submit(function(e){
    e.preventDefault();

    //$("#boxWykresPopulacja").css({"display":"none"}); ->del

    let country = $("#country").val();
    
    if(country.length > 0) {
        //console.log(country);
        //zapytanie do API
        $.ajax({
            url: "https://countriesnow.space/api/v0.1/countries/population",
            method: "POST",
            timeout: 0,
            data: {
                country: country
            },
            success: function(response){
                $("#country").val('');
                //pokazanie boxa z wykresem
                $("#boxWykresPopulacja").css({"display":"block"});

                let populationWithCountry = [];

                response.data.populationCounts.forEach(rok => {
                    //console.log(`${rok.year} ${rok.value}`);
                    let duplicateYear = false;
                    for (let i = 0; i < years.length; i++){
                        if(years[i] == rok.year) duplicateYear = true;
                    }
                    if(!duplicateYear) years.push(rok.year);
                    populationWithCountry.push(rok.value);

                })
                
                if(population.length < 1){
                population.push({
                    country: country,
                    population: populationWithCountry
                })
                }
                else{
                    let countryHasDuplicate = false;
                    population.forEach(kraj => {
                        if(kraj.country == country) countryHasDuplicate = true;
                    })
                    if(!countryHasDuplicate){
                        population.push({
                            country: country,
                            population: populationWithCountry
                        })
                    }
                    else{
                        alert('Wpisano już ten kraj do bazy danych.');
                    }
                }

                // generowanie wykresu
                generowanieWykresuPopulacji(years, population);
            },
            error: function() {
                alert(`Brak danych dla: ${country}`);
            }
        })
    }
    else{
        alert("Wprowadź nazwę państwa!");
    }
})

function generowanieWykresuPopulacji(lata, populacja) {
    $("#wykresPopulacji").html('<canvas id="wykresCanvasPopulacji" width="100%" height="300"></canvas>')

    // zakres dat i państwo
    
    $("#lataOd").html(lata[0]);
    $("#lataDo").html(lata[lata.length-1]);

    let data = [];

    $("#wykresDla").html('')

    populacja.forEach(pop => {
        let random = Math.floor((Math.random() * colors.length));
        $("#wykresDla").append(`${(pop.country).toUpperCase()}, `);
        data.push({
            data: pop.population,
            label: (pop.country).toUpperCase(),
            borderColor: colors[random],
            fill : true
        })
    })

    //console.log(data);

    new Chart($("#wykresCanvasPopulacji"), {
        type:"line",
        data: {
            labels: lata,
            datasets: data
        }
    })
}