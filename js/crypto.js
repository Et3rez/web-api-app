const now = new Date();
let currentCryptoChart = '';
let colors = ["#1CA4FA","#FF6633", "#FFB399", "#FFFF99", "#00B3E6"];

// zapytanie o kursy walut
function apiCoin(token, dni){
    $.ajax({
       url: `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=usd&days=${dni}&interval=daily`,
       method: 'GET',
       success: function(data){
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
                rates.push(parseFloat((data.prices[i][1]).toFixed(4)));
            }

            coin.push(rates);

            currentCryptoChart = token;
            refreshChartCrypto(time, coin, dni);
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
});

$("#search-crypto-days-chart").submit(function(e){
    e.preventDefault();

    let noweDni;
    noweDni = $("#days-chart").val();

    if(noweDni > 0 && noweDni < 361){
        //$("#searchedCrypto").html(`${currentCryptoChart.toUpperCase()} (wykres dla ${noweDni}) dni`);
        apiCoin(currentCryptoChart, noweDni)

    }
    else{
        alert('Podaj prawidłową liczbę')
    }
    
    console.log(noweDni);

});

function refreshChartCrypto(time, crypto, dayNum){
    $("#cryptoBoxSearch").css({"display":"flex"});
    $("#chartCanvasCrypto").html('')
    $("#chartCanvasCrypto").html('<canvas id="line-chart-krypto" width="100%" height="30"></canvas>');
    $("#searchedCrypto").html(`${(crypto[0].coin).toUpperCase()} (wykres dla ${dayNum}) dni`);

    let random = Math.floor((Math.random() * colors.length));

    let data = [{
        data: crypto[1],
        label: (crypto[0].coin).toUpperCase(),
        borderColor: colors[random],
        fill: true
    }]

    //console.log(data);

    new Chart($("#line-chart-krypto"), {
        type: 'line',
        data: {
            labels: time,
            datasets: data
        }
    })
}