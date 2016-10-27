// **************************************  Variables globales ************************************** 

var map;
var marker;
var markers = [];
var api = "http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&rows=1224";


var selectedStation = null;
var reservationEnCours = null;


var minuteElt = document.getElementById("minute");
var secondeElt = document.getElementById("seconde");
var finDecompte;


var messageElt = document.querySelectorAll("#decompte p")[0];
var reservationImpossibleElt = document.querySelectorAll("#decompte p")[1];
var stationSelectionElt = document.getElementById("stationSelection");


// **************************************  Classes ************************************** 

function Station(record) {
  this.name = record.fields.name;
  this.address = record.fields.address;
  this.nbPlaces = record.fields.bike_stands;
  this.disponibilite = record.fields.available_bikes;
  this.statut = record.fields.status;

  this.majStation = function () {
    var nomStationElt = document.getElementById("nomStation");
    nomStationElt.textContent = this.name;
    var adresseElt = document.getElementById("adresse");
    adresseElt.textContent = this.adresse;
    var placeElt = document.getElementById("nbPlaces");
    placeElt.textContent = this.nbPlaces;
    var dispoElt = document.getElementById("disponibilite");
    dispoElt.textContent = this.disponibilite;
    var statutElt = document.getElementById("statut");
    statutElt.textContent = this.status;
  }
}

function Reservation(station) {
  var that = this;
  this.station = station;
  this.isExpired = false;
  this.majMessage = function () {
    if (that.station.disponibilite == 0) {
      messageElt.style.display = "none";
      reservationImpossibleElt.style.display = "block";
      reservationImpossibleElt.textContent = "Réservation impossible car aucun vélo n'est disponible";
    } else {
      messageElt.style.display = "block";
      reservationImpossibleElt.style.display = "none";
      minuteElt.textContent = 20;
      secondeElt.textContent = 00;

      clearInterval(finDecompte);
      finDecompte = setInterval(function () {
        var compteurMinute = Number(minuteElt.textContent);
        var compteurSeconde = Number(secondeElt.textContent);
        if (compteurSeconde == 0) {
          secondeElt.textContent = 59;
          if (compteurMinute > 0) {
            minuteElt.textContent = compteurMinute - 1;
          } else {
            that.isExpired = true;
            clearInterval(finDecompte);
            var decompteElt = document.getElementById("decompte");
            decompteElt.textContent = "Décompte terminé, veuillez recommencer l'opération de réservation en actualisant la page.";
          }
        } else {
          secondeElt.textContent = compteurSeconde - 1;
        }
      }, 1000);
    }
  };
}

function Diaporama() {

  var compteurSlide = 0;
  var goLeft = false;

  this.flecheDroite = function () {
    sliderElt.style.transform += "translateX(-900px)";
    goLeft = true;
    compteurSlide++;
    if (compteurSlide % 4 == 0) {
      sliderElt.style.transform += "translateX(3600px)";
    }
  }

  this.flecheGauche = function () {
    if (goLeft) {
      sliderElt.style.transform += "translateX(900px)";
      compteurSlide--;
      if (compteurSlide % 4 == 3 || compteurSlide % 4 == -1) {
        sliderElt.style.transform += "translateX(-3600px)";
      }
    }
  }
}

// **************************************  Diaporama ************************************** 


var sliderElt = document.querySelector(".slider");
var goSlide = new Diaporama();

document.getElementById("flecheDroite").addEventListener("click", function () {
  goSlide.flecheDroite();
});
document.getElementById("flecheGauche").addEventListener("click", function () {
  goSlide.flecheGauche();
});


// ******************* Création de la carte de l'api google map ******************* 


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
        selectedStation = new Station(record);
        selectedStation.majStation();
      });

      markers.push(marker);
    });

    var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
  });
}

// **************************************  Gestion de la réservation **************************************


document.getElementById("reserver").addEventListener('click', function () {
  stationSelectionElt.textContent = selectedStation.name;

  reservationEnCours = new Reservation(selectedStation);
  reservationEnCours.majMessage();
});





    // if (window.sessionStorage) {
    //   window.sessionStorage.getItem('reservations');
    //   window.sessionStorage.setItem('disponibiliteItem', this.disponibilite);
    // reservations.push(reservationValidée);
    // } else {
    //   alert('le sessionStorage n\'est pas implémenté sur ce navigateur');
    // }