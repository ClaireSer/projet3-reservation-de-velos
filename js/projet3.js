
// **************************************  Variables globales ************************************** 

var selectedStation = null;
var reservationEnCours = null;
var newSignature = null;

// **************************************  Diaporama ************************************** 


var goSlide = new Diaporama();

document.getElementById("flecheDroite").addEventListener("click", function () {
  goSlide.flecheDroite();
});
document.getElementById("flecheGauche").addEventListener("click", function () {
  goSlide.flecheGauche();
});
window.addEventListener("keyup", function (e) {
  if (e.keyCode == 37) {
    goSlide.flecheGauche();
  } else if (e.keyCode == 39) {
    goSlide.flecheDroite();
  }
});

// ******************* Création de la carte de l'api google map et mise en place de marqueurs ******************* 


function initMap() {
  var markers = [];
  var api = "http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&rows=1224";

  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 48.856614, lng: 2.3522219000000177 },
    zoom: 12
  });

  ajaxGet(api, function (reponse) {
    var velib = JSON.parse(reponse);
    velib.records.forEach(function (record) {
      var coordonnees = record.geometry.coordinates;

      var marker = new google.maps.Marker({
        position: { lat: coordonnees[1], lng: coordonnees[0] },
        map: map,
        title: 'Cliquez pour plus d\'informations'
      });

      marker.addListener('click', function () {
        if (reservationEnCours == null || reservationEnCours.isValid == false) {
          selectedStation = new Station(record);
          selectedStation.majStation();
          if (newSignature !== null) {
            newSignature.hideSignature();
          }
        }
      });

      markers.push(marker);
    });

    var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
  });
}

// **************************************  Gestion de la réservation **************************************

document.getElementById("reserver").addEventListener("click", function () {
  if (selectedStation == null) {
    alert("Veuillez sélectionner une station sur la carte.");
  } else if (selectedStation.disponibilite == 0 || selectedStation.statut == "CLOSED") {
    alert("Aucun vélo n'est disponible et/ou la station est fermée.\nVeuillez choisir une autre station.");
  } else {
    newSignature = new Signature();
    if (reservationEnCours == null || reservationEnCours.isValid == false) {
      newSignature.showSignature();
      newSignature.clear();
    }
  }
});

// **************************************  Gestion de la validation de la signature *****************************


document.getElementById("valider").addEventListener("click", function () {
  if (newSignature.isValid) {
    reservationEnCours = new Reservation(selectedStation);
    reservationEnCours.messageReservationValidee();
    reservationEnCours.sauvegardeDataStation();
    newSignature.hideSignature();
    reservationEnCours.isValid = true;
  } else {
    alert("Veuillez d'abord signer avant de valider.");
  }
});

document.getElementById("effacer").addEventListener("click", function () {
  newSignature.clear();
  newSignature.isValid = false;
});

document.getElementById("close").addEventListener("click", function () {
  newSignature.hideSignature();
});

// **************************************  Gestion du canvas **************************************


var monCanvas = document.getElementById("canvas");
var paint = false;

monCanvas.addEventListener("mousedown", function (e) {
  paint = true;
  newSignature.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  newSignature.redraw();
});
monCanvas.addEventListener("mousemove", function (e) {
  if (paint) {
    newSignature.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    newSignature.redraw();
    newSignature.isValid = true;
  }
});
monCanvas.addEventListener("mouseup", function (e) {
  paint = false;
});
monCanvas.addEventListener("mouseleave", function (e) {
  paint = false;
});
