function getUserData() {
    var CryptoCoins = ['BTC', 'ETH', 'ETH2', 'USDT', 'MATIC', 'USDC', 'BUSD', 'LTC', 'SHIB', 'DOGE']
    var url = "https://api.coinbase.com/v2/prices/" + CryptoCoins[0] + "-DKK/spot/"
    
    for (let index = 0; index < CryptoCoins.length; index++) {
        url = "https://api.coinbase.com/v2/prices/" + CryptoCoins[index] + "-DKK/spot/"
        
        $.get(url, function(response) {
            // console.log(response.data)
            
            var listItem = document.getElementById(`item-${index+=1}`)
            listItem.innerHTML = `${response.data.base} koster lige nu ~${Math.round(response.data.amount * 10000) / 10000} ${response.data.currency}`

            if (localStorage.getItem(`${response.data.base}-PriceFirst`) == null) {
                var coinName = response.data.base + "-PriceFirst"
                localStorage.setItem(coinName, response.data.amount)
            } 

            if (Math.round(localStorage.getItem(`${response.data.base}-PriceFirst`)) != Math.round(response.data.amount)) {
                Notification.requestPermission().then(perm => {
                    if (perm === "granted") {
                        new Notification("You have a notification", {
                            body: `The price on ${response.data.base} has changed was this: ${Math.round(localStorage.getItem(`${response.data.base}-PriceFirst`))} ${response.data.currency} and has changed to this ${Math.round(response.data.amount)} ${response.data.currency}`
                        })
                    }
                })
            }            
        })
    }
}

window.addEventListener('load', () => {
    registerSW();
    getUserData()
  });

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
        await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
        console.log(`SW registration failed`);
        }
    }
}