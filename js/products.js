fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response => {
        if(!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {

        //Configuración de la tarjeta del Susuki Celerio
        let susuki = data.products[2];
                
        let susukiCardTitle = document.getElementById("susukiCardTitle");
        let susukiCardSubtitle = document.getElementById("susukiCardSubtitle");
        let susukiDescription = document.getElementById("susukiDescription");
        let susukiPrice = document.getElementById("susukiPrice");
        let susukiSoldCount = document.getElementById("susukiSoldCount");

        susukiCardTitle.textContent = susuki.name.split(" ")[0];
        susukiCardSubtitle.textContent = susuki.name.split(" ")[1];
        susukiDescription.textContent = susuki.description;
        susukiPrice.textContent = susuki.currency + " " + susuki.cost
        susukiSoldCount.textContent = "Vendidos: " + susuki.soldCount

        //Configuración de la tarjeta del Chevrolet Onix Joy
        let chevrolet = data.products[0];
                
        let chevroletCardTitle = document.getElementById("chevroletCardTitle");
        let chevroletCardSubtitle = document.getElementById("chevroletCardSubtitle");
        let chevroletDescription = document.getElementById("chevroletDescription");
        let chevroletPrice = document.getElementById("chevroletPrice");
        let chevroletSoldCount = document.getElementById("chevroletSoldCount");

        chevroletCardTitle.textContent = chevrolet.name.split(" ")[0];
        chevroletCardSubtitle.textContent = chevrolet.name.split(" ")[1] + " " + chevrolet.name.split(" ")[2];
        chevroletDescription.textContent = chevrolet.description;
        chevroletPrice.textContent = chevrolet.currency + " " + chevrolet.cost
        chevroletSoldCount.textContent = "Vendidos: " + chevrolet.soldCount

        //Configuración de la tarjeta del Fiat Way
        let fiat = data.products[1];
                
        let fiatCardTitle = document.getElementById("fiatCardTitle");
        let fiatCardSubtitle = document.getElementById("fiatCardSubtitle");
        let fiatDescription = document.getElementById("fiatDescription");
        let fiatPrice = document.getElementById("fiatPrice");
        let fiatSoldCount = document.getElementById("fiatSoldCount");

        fiatCardTitle.textContent = fiat.name.split(" ")[0];
        fiatCardSubtitle.textContent = fiat.name.split(" ")[1];
        fiatDescription.textContent = fiat.description;
        fiatPrice.textContent = fiat.currency + " " + fiat.cost
        fiatSoldCount.textContent = "Vendidos: " + fiat.soldCount

        //Configuración de la tarjeta del Peugeot 208
        let peugeot = data.products[3];
                
        let peugeotCardTitle = document.getElementById("peugeotCardTitle");
        let peugeotCardSubtitle = document.getElementById("peugeotCardSubtitle");
        let peugeotDescription = document.getElementById("peugeotDescription");
        let peugeotPrice = document.getElementById("peugeotPrice");
        let peugeotSoldCount = document.getElementById("peugeotSoldCount");

        peugeotCardTitle.textContent = peugeot.name.split(" ")[0];
        peugeotCardSubtitle.textContent = peugeot.name.split(" ")[1];
        peugeotDescription.textContent = peugeot.description;
        peugeotPrice.textContent = peugeot.currency + " " + peugeot.cost
        peugeotSoldCount.textContent = "Vendidos: " + peugeot.soldCount

        //Configuración de la tarjeta del Bugatti Chiron
        let bugatti = data.products[4];
                
        let bugattiCardTitle = document.getElementById("bugattiCardTitle");
        let bugattiCardSubtitle = document.getElementById("bugattiCardSubtitle");
        let bugattiDescription = document.getElementById("bugattiDescription");
        let bugattiPrice = document.getElementById("bugattiPrice");
        let bugattiSoldCount = document.getElementById("bugattiSoldCount");

        bugattiCardTitle.textContent = bugatti.name.split(" ")[0];
        bugattiCardSubtitle.textContent = bugatti.name.split(" ")[1];
        bugattiDescription.textContent = bugatti.description;
        bugattiPrice.textContent = bugatti.currency + " " + bugatti.cost
        bugattiSoldCount.textContent = "Vendidos: " + bugatti.soldCount

    })
