// wyszukiwanie panstwa
$("#search-country").submit(function(e){
    e.preventDefault();

    let country = $("#country").val();
    console.log(country)

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
            }
        })
    }
    else{
        alert("Wprowadź nazwę państwa!");
    }
})