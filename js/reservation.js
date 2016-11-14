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
        $("#decompte").hide();
        $("#expiration").show();
        if (window.sessionStorage) {
          sessionStorage.clear();
          console.log(sessionStorage.adresseStationItem);
          console.log(sessionStorage.nomStationItem);
        } else {
          alert('Le sessionStorage n\'est pas implémenté sur ce navigateur : les informations n\'ont pas été sauvergardées.');
        }
      }
    } else {
      secondeElt.textContent = compteurSeconde - 1;
    }
  }, 1000);

  this.station = station;

  this.stopDecompte = function () {
    clearInterval(finDecompte);
  }

  this.messageReservationValidee = function () {
    document.getElementById("nomStationSelection").textContent = station.name;
    document.getElementById("adresseStationSelection").textContent = station.address;
    minuteElt.textContent = "0";
    secondeElt.textContent = "5";
    $("#decompte").show();
    $("#modal").hide();
    $("#expiration").hide();    
  }

  this.sauvegardeDataStation = function () {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('nomStationItem', selectedStation.name);
      window.sessionStorage.setItem('adresseStationItem', selectedStation.address);
      console.log(sessionStorage.nomStationItem);
      console.log(sessionStorage.adresseStationItem);
    } else {
      alert('le sessionStorage n\'est pas implémenté sur ce navigateur : les informations n\'ont pas été sauvergardées.');
    }
  }
}
