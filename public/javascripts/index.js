/**
 * Created by Administrator on 2016/7/7 0007.
 */
$(function () {
    /*init();
     bind();*/
    /*init*/
    var $lis = $('#list li');
    var $volume = $('#volume');

    var $box = $('#box');
    $box.append($("<canvas id='canvas'></canvas>"));

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var height, width;


    var source = null;
    var count = 0;
    var xhr = new XMLHttpRequest();
    var ac = new (window.AudioContext || window.webkitAudioContext)();

    var gainNode = ac[ac.createGain ? "createGain" : "createGainNode"]();
    gainNode.connect(ac.destination);

    var analyser = ac.createAnalyser();
    var size = 128;
    analyser.fftsize = size * 2;
    analyser.connect(gainNode);

    changeVolume($volume.attr('value') / $volume.attr('max'));
    visualizer();

    var Dots = [];

    function random(m, n) {
        return Math.round(Math.random() * (n - m) + m);
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

    resize();

    /*bind*/

    $lis.on('click', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        //getData("/media/" + this.title)

        load("/media/" + this.title)
    });

    $volume.on('change', function () {
        changeVolume($(this).attr('value') / $(this).attr('max'))
    });

    $(window).on('resize', function () {
        resize()
    });
    $('.tab li').on('click', function () {
        draw.type = $(this).data('type');
        $(this).addClass('selected').siblings().removeClass('selected');
    });


    function resize() {
        $box = $('#box');
        $canvas = $('#canvas');

        height = $box.height();
        width = $box.width();

        var line = ctx.createLinearGradient(0, 0, 0, height);
        line.addColorStop(0, "red");
        line.addColorStop(0.5, "yellow");
        line.addColorStop(1, "green");
        $canvas.height(height);
        $canvas.width(width);
        ctx.fillStyle = line;
        getDots();
    }

    function load(url) {
        var n = ++count; //????
        xhr.open('GET', url);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            if (n != count)return; //????
            source && source[source.stop ? "stop" : "noteOff"]();
            // xhr.abort(); //????
            ac.decodeAudioData(xhr.response, function (buffer) {
                if (n != count)return;  //?????
                var bufferSource = ac.createBufferSource();
                bufferSource.buffer = buffer;
                bufferSource.connect(analyser);
                bufferSource[bufferSource.start ? "start" : "noteOn"](0);
                source = bufferSource;
            }, function (err) {
                console.log(err)
            })
        };
        xhr.send()
    }

    function visualizer() {
        var arr = new Uint8Array(analyser.frequencyBinCount);
        //console.log(arr)//?????打出的结果有所不同
        requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame;
        function v() {
            analyser.getByteFrequencyData(arr);
            draw(arr);
            requestAnimationFrame(v)
        }

        requestAnimationFrame(v)
    }

    function draw(arr) {
        ctx.clearRect(0, 0, width, height);
        var w = width / size;
        for (var i = 0; i < 128; i++) {
            if (draw.type == "colume") {
                var h = arr[i] / 256 * height;//?????
                ctx.fillRect(w * i, height - h, w * 0.6, h);
            } else if (draw.type == "dot") {
                ctx.beginPath();
                var o = Dots[i];
                var r = arr[i] / 256 * 50;
                ctx.arc(o.x, o.y,r, 0, Math.PI * 2, true);
                ctx.strockStyle = "#fff";
                ctx.stroke();
            }

        }
    }

    draw.type = "colume";

    function changeVolume(percent) {
        gainNode.gain.value = percent * percent;
    }
});
/*function init() {
 var $volume = $('#volume');
 var $box = $('#box');
 $box.append($("<canvas id='canvas'></canvas>"));
 visualizer();
 changeVolume($volume.attr('value') / $volume.attr('max'))
 }

 function bind() {
 var $lis = $('#list li');
 $lis.on('click', function () {
 $(this).addClass('selected').siblings().removeClass('selected');
 //getData("/media/" + this.title)

 load("/media/" + this.title)
 });

 var $volume = $('#volume');
 $volume.on('change', function () {
 changeVolume($(this).attr('value') / $(this).attr('max'))
 });

 $(window).on('resize', function () {
 resize()
 })
 }*/

/*var source = null;
 var count = 0;
 var xhr = new XMLHttpRequest();
 var ac = new (window.AudioContext || window.webkitAudioContext)();

 var gainNode = ac[ac.createGain ? "createGain" : "createGainNode"]();
 gainNode.connect(ac.destination);

 var analyser = ac.createAnalyser();
 var size = 128;
 analyser.fftsize = size * 2;
 analyser.connect(gainNode);
 function load(url) {
 var n = ++count; //????
 xhr.open('GET', url);
 xhr.responseType = "arraybuffer";
 xhr.onload = function () {
 if (n != count)return; //????
 source && source[source.stop ? "stop" : "noteOff"]();
 // xhr.abort(); //????
 ac.decodeAudioData(xhr.response, function (buffer) {
 if (n != count)return;  //?????
 var bufferSource = ac.createBufferSource();
 bufferSource.buffer = buffer;
 bufferSource.connect(analyser);
 bufferSource[bufferSource.start ? "start" : "noteOn"](0);
 source = bufferSource;
 }, function (err) {
 console.log(err)
 })
 };
 xhr.send()
 }

 function visualizer() {
 var arr = new Uint8Array(analyser.frequencyBinCount);
 //console.log(arr)//?????打出的结果有所不同
 requestAnimationFrame = window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame;
 function v() {
 analyser.getByteFrequencyData(arr);
 draw(arr);
 requestAnimationFrame(v)
 }

 requestAnimationFrame(v)
 }

 function draw(arr) {
 var w = width / size;
 for (var i = 0; i < arr.length; i++) {
 var h = arr[i] / 256 * height;//?????
 ctx.fillRect(w * i, height - h, w * 0.6, h);
 }
 }

 function changeVolume(percent) {
 gainNode.gain.value = percent * percent;
 }*/


