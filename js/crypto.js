const now = new Date();
let currentCryptoChart = '';

// zapytanie o kursy walut
function apiCoin(token, dni){
    $.ajax({
       url: `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=usd&days=${dni}&interval=daily`,
       method: 'GET',
       success: function(data){
            $("#cryptoBoxSearch").css({"display":"flex"});
            console.log(data);

            // oś x
            let time = [];
            // oś y
            let coin = [{
                'coin': token
            }];
            let rates = [];

            // oś x - daty dni kursów waluty
            for(let i = dni-1; i >=0; i--){
                let day = new Date(now);
                day.setDate(now.getDate()-i);
                let d = day.getDate();
                if(d<10) d="0"+d;
                let m = day.getMonth()+1;
                if(m<10) m="0"+m;
                let y = day.getFullYear();

                time.push(`${d}-${m}-${y}`);
                rates.push(parseFloat(data.prices[i][1]).toFixed(4));
            }

            console.log(`czas (oś x):`, time)
            console.log(`kursy (oś y): `, rates);

            $("#searchedCrypto").html(`${token.toUpperCase()} (wykres dla ${dni}) dni`);
            currentCryptoChart = token;
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

$("#search-crypto-days-chart").submit(function(e){
    e.preventDefault();

    let noweDni;
    noweDni = $("#days-chart").val();

    if(noweDni > 0 && noweDni < 361){
        $("#searchedCrypto").html(`${currentCryptoChart.toUpperCase()} (wykres dla ${noweDni}) dni`);    
    }
    else{
        alert('Podaj prawidłową liczbę')
    }
    
    
    console.log(noweDni);

})