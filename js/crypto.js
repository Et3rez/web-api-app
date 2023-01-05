// zapytanie o kursy walut
function apiCoin(token, dni){
    $.ajax({
       url: `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=usd&days=${dni}&interval=daily`,
       method: 'GET',
       success: function(data){
            console.log(data);

       },
       error: function(){
            alert(`Brak danych dla ${token}`);
       }
    })
}


// funkcja wyszukania kryptowaluty
$("#search-crypto").submit(function(e){
    e.preventDefault();

    let crypto = $("#crypto").val();
    let days = $("#days").val();

    if(crypto.length > 0){
        if(days<0 || days=="" || days>365){
            days = 7;
        }

        apiCoin(crypto, days);
    }
    else{
        alert("Uzupełnij wszystkie pola formularza.");
    }

    console.log(`${crypto} ${days}`);
})