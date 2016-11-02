
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
window.addEventListener("keydown", function (e) {
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
        selectedStation = new Station(record);
        selectedStation.majStation();
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
  } else {
    document.getElementById("stationSelection").textContent = selectedStation.name;
    if (reservationEnCours !== null) {
      reservationEnCours.stopDecompte();
    }
    reservationEnCours = new Reservation(selectedStation);
    reservationEnCours.majMessage();
  }
});


// **************************************  Gestion de la validation de la signature *****************************

newSignature = new Signature();

document.getElementById("valider").addEventListener("click", function () {
  if (selectedStation == null) {
    alert("Veuillez choisir une station sur la carte.");
  } else if (reservationEnCours == null) {
    alert("Veuillez cliquer sur le bouton \'réserver\' avant de valider la réservation.");
  } else if (newSignature.isValid == false) {
    alert("Veuillez d'abord signer avant de valider.");
  } else if (selectedStation.isExpired) {
    alert("Après 20 minutes d'inactivité, la session est expirée.\nVeuiller recommencer l'opération de réservation.");
    reservationEnCours.deleteDataStation();
  } else if (selectedStation.disponibilite == 0 || selectedStation.statut == "CLOSED") {
    alert("Aucun vélo n'est disponible et/ou la station est fermée.\nVeuillez choisir une autre station.");
  } else {
    reservationEnCours.sauvegardeDataStation();
    reservationEnCours.messageReservationValidee();
  }
});

document.getElementById("annuler").addEventListener("click", function () {
  newSignature.clear();
  newSignature.isValid = false;
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


// **************************************  Gestion du modal **************************************


$(document).ready(function () {

  // Lorsque l'on clique sur show on affiche la fenêtre modale
  $('#show').click(function (e) {
    //On désactive le comportement du lien
    e.preventDefault();
    showModal();
  });

  // Lorsque l'on clique sur le fond on cache la fenetre modale   
  $('#fond').click(function () {
    hideModal();
  });

  // Lorsque l'on modifie la taille du navigateur la taille du fond change
  $(window).resize(function () {
    resizeModal()
  });




  function showModal() {
    var id = '#modal';
    $(id).html('Voici ma fenetre modale<br/><a href="#" class="close">Fermer la fenetre</a>');

    // On definit la taille de la fenetre modale
    resizeModal();

    // Effet de transition     
    $('#fond').fadeIn(1000);
    $('#fond').fadeTo("slow", 0.8);
    // Effet de transition   
    $(id).fadeIn(2000);

    $('.popup .close').click(function (e) {
      // On désactive le comportement du lien
      e.preventDefault();
      // On cache la fenetre modale
      hideModal();
    });
  }



  function hideModal() {
    // On cache le fond et la fenêtre modale
    $('#fond, .popup').hide();
    $('.popup').html('');
  }


  function resizeModal() {
    var modal = $('#modal');
    // On récupère la largeur de l'écran et la hauteur de la page afin de cacher la totalité de l'écran
    var winH = $(document).height();
    var winW = $(window).width();

    // le fond aura la taille de l'écran
    $('#fond').css({ 'width': winW, 'height': winH });

    // On récupère la hauteur et la largeur de l'écran
    var winH = $(window).height();
    // On met la fenêtre modale au centre de l'écran
    modal.css('top', winH / 2 - modal.height() / 2);
    modal.css('left', winW / 2 - modal.width() / 2);
  }
});

