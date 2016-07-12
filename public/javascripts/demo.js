
/**
 * Created by Administrator on 2016/7/11 0011.
 */
var $box = $('.box');
$canvas = $('#canvas');

var height = $box.height();
var width = $box.width();

$canvas.height(height);
$canvas.width(width);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var Dots = [];
getDots();

for (var i = 0; i < 128; i++) {
    ctx.beginPath();
    var o = Dots[i];
    var r = arr[i] / 256 * 50;
    ctx.arc(o.x, o.y,r, 0, Math.PI * 2, true);
    ctx.strockStyle = "#fff";
    ctx.stroke();
}

function getDots() {
    Dots = [];
    for (var i = 0; i < size; i++) {
        var x = random(0, width);
        var y = random(0, height);
        var color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
        Dots.push({
            x: x,
            y: y,
            color: color
        })
    }
}



