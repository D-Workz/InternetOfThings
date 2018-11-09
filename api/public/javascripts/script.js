var sensor1On = true;
var sensor2On = true;
var messageCount = 0;

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
            sensor1();
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
            sensor2();
        }
    });

    sensor2();
    setTimeout(function () {
        sensor1();
    }, 5000)

});


//2
function sensor2() {
    setTimeout(function () {
        var value = ((Math.random() * 10) + 1).toFixed(2);
        $('#container2-output').append('<div class="value">'+ value +'</div>');
        con_sendValue(value, "producer2");
        if(sensor1On) sensor2();
    }, 10000)
}

//1
function sensor1() {
    setTimeout(function () {
        var value = ((Math.random() * 10) + 1).toFixed(2);
        $('#container1-output').append('<div class="value">'+ value +'</div>');
        con_sendValue(value, "producer1");
        if(sensor2On) sensor1();
    }, 10000)
}

function con_sendValue(value, sensor) {
    console.log("sending value.");
    url = "http://localhost:3001/upload";
    $.ajax({
        url: url,
        type: "post",
        data: {
            "offset":messageCount,
            "sensor":sensor,
            "value":value
        },
        success: function (data){
            messageCount++;
            callback(data);
        }
    });
}