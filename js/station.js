
function Station(record) {
  this.name = record.fields.name;
  this.address = record.fields.address;
  this.nbPlaces = record.fields.bike_stands;
  this.disponibilite = record.fields.available_bikes;
  this.statut = record.fields.status;

  this.majStation = function () {
    // détails Station
    document.getElementById("nomStation").textContent = this.name;
    document.getElementById("adresse").textContent = this.address;
    document.getElementById("nbPlaces").textContent = this.nbPlaces;
    document.getElementById("disponibilite").textContent = this.disponibilite;
    document.getElementById("statut").textContent = this.statut;

    // message final après réservation
    document.getElementById("nomStationSelection").textContent = selectedStation.name;
    document.getElementById("adresseStationSelection").textContent = selectedStation.address;
  }
}