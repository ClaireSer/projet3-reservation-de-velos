function Reservation(station) {
  var minuteElt = document.getElementById("minute");
  var secondeElt = document.getElementById("seconde");
  var that = this;

  var finDecompte = setInterval(function () {
    var compteurMinute = Number(minuteElt.textContent);
    var compteurSeconde = Number(secondeElt.textContent);

    if (compteurSeconde == 0) {
      secondeElt.textContent = 59;
      if (compteurMinute > 0) {
        minuteElt.textContent = compteurMinute - 1;
      } else {
        clearInterval(finDecompte);
        var decompteElt = document.getElementById("decompte");
        decompteElt.textContent = "La session est expirée et votre vélo n'est plus disponible.\nVeuiller recommencer l'opération de réservation.";
        decompteElt.style.textTransform = "uppercase";
        if (window.sessionStorage) {
          window.sessionStorage.setItem('nomStationItem', null);
          window.sessionStorage.setItem('adresseStationItem', null);
        } else {
          alert('Le sessionStorage n\'est pas implémenté sur ce navigateur : les informations n\'ont pas été sauvergardées');
        }
      }
    } else {
      secondeElt.textContent = compteurSeconde - 1;
    }
  }, 1000);

  this.station = station;

  this.messageReservationValidee = function () {
    minuteElt.textContent = "20";
    secondeElt.textContent = "00";
    document.getElementById("decompte").style.display = "block";
    document.getElementById("signature").style.display = "none";
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
}
