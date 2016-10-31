
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
    adresseElt.textContent = this.address;
    var placeElt = document.getElementById("nbPlaces");
    placeElt.textContent = this.nbPlaces;
    var dispoElt = document.getElementById("disponibilite");
    dispoElt.textContent = this.disponibilite;
    var statutElt = document.getElementById("statut");
    statutElt.textContent = this.statut;
  }
}