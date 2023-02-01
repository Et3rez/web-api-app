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
    $("#chartCanvasCrypto").html('<canvas id="line-chart-krypto" width="100%" height="300"></canvas>');
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

// zmiana liczby wierszy w rankingu
$("#search-crypto-days").submit(function(e){
    e.preventDefault();

    let liczbaRekordow = $("#days-ranking").val();

    if(liczbaRekordow > 0 && liczbaRekordow <= 100){
        //console.log(`Liczba wierszy do wyświetlenia: ${liczbaRekordow}`);
        generateTable(liczbaRekordow)
    }
    else{
        alert('Wprowadź poprawną liczbę (między 1 a 100)');
    }
});

// generowanie tabelki z rankingiem
function generateTable(num){
    // generowanie pierwszego wiersza tabelki
    $("#cryptoTableBox").html(`
        <table class="table col-12">
            <thead class="table-dark">
                <th class="text-center">#</>
                <th class="text-center">Nazwa</th>
                <th class="text-center">Kurs (w USD)</th>
                <th class="text-center">Zmiana 24h (w USD)</th>
                <th class="text-center">ATH</th>
                <th class="text-center">Zobacz wykres</th>
            </thead>
            <tbody id="cryptoRankingTable">

            </tbody>
        </table>
    `)
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd',
        method: 'GET',
        success: function(response){
            response.forEach((crypto, index) => {
                if(index < num){
                    let priceChange24H = '';
                    let priceChangeATH = '';

                    if(crypto.price_change_percentage_24h > 0) priceChange24H = `<span class="text-success">(${(crypto.price_change_percentage_24h).toFixed(2)}%)</span>`;
                    else priceChange24H =`<span class="text-danger">(${(crypto.price_change_percentage_24h).toFixed(2)}%)</span>`;


                    $('#cryptoRankingTable').append(`
                        <tr>
                            <td class="text-center">${crypto.market_cap_rank}</td>
                            <td class="text-center">${crypto.name}</td>
                            <td class="text-center">${crypto.current_price}</td>
                            <td class="text-center">${(crypto.price_change_24h).toFixed(2)} ${priceChange24H}</td>
                            <td class="text-center">${crypto.ath}</td>
                            <td class="text-center"><i class="fa-solid fa-magnifying-glass"></i></td>
                        </tr>
                    `)
                }
            })
        },
        error: function(){
            alert(`Wystąpił błąd podczas ładowania rankingu kryptowalut.`)
        }
    })
}

$(document).ready(function(){
    let limit = 5;
    generateTable(limit)
})