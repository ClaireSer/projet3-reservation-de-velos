// **************************************  Variables globales ************************************** 

var selectedStation = null;
var reservationEnCours = null;

// **************************************  Diaporama ************************************** 


var goSlide = new Diaporama();

document.getElementById("flecheDroite").addEventListener("click", function () {
  goSlide.flecheDroite();
});
document.getElementById("flecheGauche").addEventListener("click", function () {
  goSlide.flecheGauche();
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
  document.getElementById("stationSelection").textContent = selectedStation.name;
  if (reservationEnCours !== null) {
    reservationEnCours.stopDecompte();
  }
  reservationEnCours = new Reservation(selectedStation);
  reservationEnCours.majMessage();
});


// **************************************  Gestion de la validation de la signature **************************************


document.getElementById("valider").addEventListener("click", function () {
  if (selectedStation.isExpired) {
    alert("Après 20 minutes d'inactivité, la session est expirée.\nVeuiller recommencer l'opération de réservation.");
    reservationEnCours.deleteDataStation();
  } else if (selectedStation.disponibilite == 0 || selectedStation.statut == "CLOSED") {
    alert("Aucun vélo n'est disponible et/ou la station est fermée.\nVeuillez choisir une autre station.");
  } else {
    reservationEnCours.sauvegardeDataStation();
    reservationEnCours.messageReservationValidee();
  }
});


// **************************************  Gestion du canvas **************************************

$(function () {

  var monCanvas = document.getElementById("canvas");
  var context = monCanvas.getContext("2d");

  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var paint;

  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }

  function redraw() {
    context.clearRect(0, 0, monCanvas.width, monCanvas.height);
    // vider tableaux
    context.strokeStyle = "purple";
    context.lineJoin = "round";
    context.lineWidth = 3;

    for (var i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }
      context.moveTo(clickX[i], clickY[i]);
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.stroke();
    }
  }

  $('#canvas').mousedown(function (e) {
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });

  $('#canvas').mousemove(function (e) {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });


  $('#canvas').mouseup(function (e) {
    paint = false;
  });

  $('#canvas').mouseleave(function (e) {
    paint = false;
  });


  document.getElementById("annuler").addEventListener("click", function () {
    context.clearRect(0, 0, monCanvas.width, monCanvas.height);
  });
});
