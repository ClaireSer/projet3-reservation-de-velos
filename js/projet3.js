// **************************************  Diaporama ************************************** 

var flecheGaucheElt = document.getElementById("flecheGauche");
var flecheDroiteElt = document.getElementById("flecheDroite");
var compteurSlide = 0;
var goLeft = false;

flecheDroiteElt.addEventListener("click", function clicFlecheDroite() {
  var sliderElt = document.querySelector(".slider");
  sliderElt.style.transform += "translateX(-900px)";
  goLeft = true;
  compteurSlide++;
  if (compteurSlide % 4 == 0) {
    sliderElt.style.transform += "translateX(3600px)";
  }
});
flecheGaucheElt.addEventListener("click", function clicFlecheGauche() {
  if (goLeft) {
    compteurSlide--;
    var sliderElt = document.querySelector(".slider");
    sliderElt.style.transform += "translateX(900px)";
    if (compteurSlide % 4 == 3 || compteurSlide % 4 == -1) {
      sliderElt.style.transform += "translateX(-3600px)";
    }
  }
});


// ******************* Création de la carte de l'api google map ******************* 

var map;
var marker;
var markers = [];
var api = "http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&rows=1224";


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 48.856614, lng: 2.3522219000000177 },
    zoom: 12
  });

  ajaxGet(api, function (reponse) {
    var velib = JSON.parse(reponse);
    velib.records.forEach(function (record) {
      var coordonnees = record.geometry.coordinates;

      marker = new google.maps.Marker({
        position: { lat: coordonnees[1], lng: coordonnees[0] },
        map: map,
        title: 'Cliquez pour plus d\'informations'
      });

      marker.addListener('click', function () {
        var nomStationElt = document.getElementById("nomStation");
        nomStationElt.textContent = record.fields.name;
        var adresseElt = document.getElementById("adresse");
        adresseElt.textContent = record.fields.address;
        var placeElt = document.getElementById("nbPlaces");
        placeElt.textContent = record.fields.bike_stands;
        var dispoElt = document.getElementById("disponibilite");
        dispoElt.textContent = record.fields.available_bikes;
        var statutElt = document.getElementById("statut");
        statutElt.textContent = record.fields.status;


        if (window.sessionStorage) {
          window.sessionStorage.setItem('nomStationItem', nomStationElt.textContent);
          window.sessionStorage.setItem('disponibiliteItem', dispoElt.textContent);
        } else {
          alert('le sessionStorage n\'est pas implémenté sur ce navigateur');
        }
      });

      markers.push(marker);
    });

    var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
  });
}


// **************************************  Gestion de la réservation ******************* 

var minuteElt = document.getElementById("minute");
var secondeElt = document.getElementById("seconde");
var finDecompte;


function decompte() {
  var compteurMinute = Number(minuteElt.textContent);
  var compteurSeconde = Number(secondeElt.textContent);
  if (compteurSeconde == 0) {
    secondeElt.textContent = 59;
    if (compteurMinute > 0) {
      minuteElt.textContent = compteurMinute - 1;
    } else {
      clearInterval(finDecompte);
      var decompteElt = document.getElementById("decompte");
      decompteElt.innerHTML = "";
      decompteElt.textContent = "Décompte terminé, veuillez recommencer l'opération de réservation.";
    }
  } else {
    secondeElt.textContent = compteurSeconde - 1;
  }
}

var submitElt = document.getElementById("reserver");
submitElt.addEventListener('click', function (e) {
  e.preventDefault();
  var messageElt = document.querySelectorAll("#decompte p")[0];
  var reservationImpossibleElt = document.querySelectorAll("#decompte p")[1];
  if (window.sessionStorage.getItem('disponibiliteItem') == 0) {
    messageElt.style.display = "none";
    reservationImpossibleElt.style.display = "block";
    reservationImpossibleElt.textContent = "Réservation impossible car aucun vélo n'est disponible";
  } else {
    messageElt.style.display = "block";
    reservationImpossibleElt.style.display = "none";
    minuteElt.textContent = 20;
    secondeElt.textContent = 00;

    var stationSelectionElt = document.getElementById("stationSelection");
    stationSelectionElt.textContent = window.sessionStorage.getItem('nomStationItem');

    clearInterval(finDecompte);
    finDecompte = setInterval(decompte, 1000);

  }
});