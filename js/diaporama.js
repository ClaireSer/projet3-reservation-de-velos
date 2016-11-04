
function Diaporama() {
  var sliderElt = document.querySelector(".slider");
  var compteurSlide = 0;
  var goLeft = false;

  this.flecheDroite = function () {
    sliderElt.style.transform += "translateX(-1200px)";
    goLeft = true;
    compteurSlide++;
    if (compteurSlide % 6 == 0) {
      sliderElt.style.transform += "translateX(7200px)";
    }
  }

  this.flecheGauche = function () {
    if (goLeft) {
      sliderElt.style.transform += "translateX(1200px)";
      compteurSlide--;
      if (compteurSlide % 6 == 5 || compteurSlide % 6 == -1) {
        sliderElt.style.transform += "translateX(-7200px)";
      }
    }
  }
}