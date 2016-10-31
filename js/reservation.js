function Reservation(station) {
  var minuteElt = document.getElementById("minute");
  var secondeElt = document.getElementById("seconde");
  var messageElt = document.querySelectorAll("#decompte p")[0];
  var that = this;
  
  var finDecompte = setInterval(function () {
    var compteurMinute = Number(minuteElt.textContent);
    var compteurSeconde = Number(secondeElt.textContent);

    if (compteurSeconde == 0) {
      secondeElt.textContent = 59;
      if (compteurMinute > 0) {
        minuteElt.textContent = compteurMinute - 1;
      } else {
        that.isExpired = true;
        that.stopDecompte();
        var decompteElt = document.getElementById("decompte");
        decompteElt.textContent = "Décompte terminé, veuillez recommencer l'opération de réservation.";
      }
    } else {
      secondeElt.textContent = compteurSeconde - 1;
    }
  }, 1000);

  this.station = station;
  this.isExpired = false;
  this.majMessage = function () {
    var reservationImpossibleElt = document.querySelectorAll("#decompte p")[1];

    if (that.station.disponibilite == 0 || that.station.statut == "CLOSED") {
      messageElt.style.display = "none";
      reservationImpossibleElt.style.display = "block";
      reservationImpossibleElt.textContent = "Réservation impossible car aucun vélo n'est disponible et/ou la station est fermée.";
    } else {
      messageElt.style.display = "block";
      reservationImpossibleElt.style.display = "none";
      minuteElt.textContent = "20";
      secondeElt.textContent = "00";
    }
  };
  this.stopDecompte = function () {
    clearInterval(finDecompte);
  }
  this.messageReservationValidee = function () {
    document.getElementById("messageValidation").textContent = "Vous venez de réserver un vélo à la station :";
    messageElt.style.display = "none";
  }
  this.sauvegardeDataStation = function () {
    if (window.sessionStorage) {
      window.sessionStorage.getItem(selectedStation.name);
      window.sessionStorage.getItem(selectedStation.address);
      window.sessionStorage.setItem('nomStationItem', selectedStation.name);
      window.sessionStorage.setItem('adresseStationItem', selectedStation.address);
    } else {
      alert('le sessionStorage n\'est pas implémenté sur ce navigateur');
    }
  }
  this.deleteDataStation = function () {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('nomStationItem', null);
      window.sessionStorage.setItem('adresseStationItem', null);
    } else {
      alert('le sessionStorage n\'est pas implémenté sur ce navigateur');
    }
  }
}
