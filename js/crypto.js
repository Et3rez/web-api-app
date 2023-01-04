// funkcja wyszukania kryptowaluty
$("#search-crypto").submit(function(e){
    e.preventDefault();

    let crypto = $("#crypto").val();
    let days = $("#days").val();

    if(crypto.length > 0){
        if(days<0 || days=="" || days>365){
            days = 7;
        }

        // zapytanie o kursy walut
        // tutaj....
        console.log(`waluta: ${crypto}`);
        console.log(`dni: ${days}`);

    }
    else{
        alert("Uzupełnij wszystkie pola formularza.");
    }

    console.log(`${crypto} ${days}`);
})