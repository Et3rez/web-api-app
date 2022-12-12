let years = [];
let population = [];

// wyszukiwanie panstwa
$("#search-country").submit(function(e){
    e.preventDefault();

    $("#boxWykresPopulacja").css({"display":"none"});
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
                console.log(response);
                //pokazanie boxa z wykresem
                $("#boxWykresPopulacja").css({"display":"block"});

                // zakres dat i państwo
                $("#wykresDla").html(response.data.country);
                $("#lataOd").html(response.data.populationCounts[0].year);
                $("#lataDo").html(response.data.populationCounts[response.data.populationCounts.length-1].year);

                let populationWithCountry = [];

                response.data.populationCounts.forEach(rok => {
                    //console.log(`${rok.year} ${rok.value}`);
                    years.push(rok.year);
                    populationWithCountry.push(rok.value);

                })

                population.push({
                    country: country,
                    population: populationWithCountry
                })

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

    let data = [];

    populacja.forEach(pop => {
        data.push({
            data: pop.population,
            label: pop.country
        })
    })

    console.log(data);


    new Chart($("#wykresCanvasPopulacji"), {
        type:"line",
        data: {
            labels: lata,
            datasets: data
        }
    })
}