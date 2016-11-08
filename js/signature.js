function Signature() {
    var monCanvas = document.getElementById("canvas");
    var context = monCanvas.getContext("2d");
    var clickX = [];
    var clickY = [];
    var clickDrag = [];

    this.redraw = function () {
        context.strokeStyle = "#7b68ee";
        context.lineJoin = "round";
        context.lineWidth = 3;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]); // permet de faire un point quand il y a seulement un mousedown
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }
    this.addClick = function (x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }
    this.clear = function () {
        clickX = [];
        clickY = [];
        clickDrag = [];
        context.clearRect(0, 0, monCanvas.width, monCanvas.height);
    }
    this.isValid = false;

    this.showSignature = function () {
        $("#modal").fadeIn();
        $("#decompte").hide();
    }
    this.hideSignature = function () {
        $("#modal").fadeOut();

    }
}