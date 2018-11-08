var sensor1On = true;
var sensor2On = true;

$(document).ready(function() {
    var $sens1Btn = $('#stop1');
    var $sens2Btn = $("#stop2");

    $sens1Btn.click(function () {
        if(sensor1On){
            $sens1Btn.val("start");
            sensor1On = false;
        }
        else {
            $sens1Btn.val("stop");
            sensor1On = true;
            airHumiditySensor();
        }
    });

    $sens2Btn.click(function () {
        if(sensor2On) {
            $sens2Btn.val("start");
            sensor2On = false;
        }
        else {
            $sens2Btn.val("stop");
            sensor2On = true;
            fridgeSensor();
        }
    });

    fridgeSensor();
    airHumiditySensor();

});


//2
function fridgeSensor() {
    setTimeout(function () {
        var value = (Math.random() * 10) + 1;
        $('#container2-output').append('<div class="value">'+ value +'</div>');
        con_sendValue(value, "temparature");
        if(sensor1On) fridgeSensor();
    }, 3000)
}

//1
function airHumiditySensor() {
    setTimeout(function () {
        var value = (Math.random() * 70) + 15;
        $('#container1-output').append('<div class="value">'+ value +'</div>');
        con_sendValue(value, "humidity");
        if(sensor2On) airHumiditySensor();
    }, 2000)
}

function con_sendValue(value, sensor) {
    console.log("sending value.");
    url = "http://localhost:3001/upload";
    $.ajax({
        url: url,
        type: "post",
        data: {
            "sensor":sensor,
            "value":value
        },
        success: function (data){
            callback(data);
        }
    });
}