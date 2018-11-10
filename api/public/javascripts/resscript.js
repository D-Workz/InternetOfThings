

$(document).ready(function() {
    var $sens1Btn = $('#stop1');
    var $sens2Btn = $("#stop2");


    con_getSensorResults(function (result) {
        console.log(result);
    })



});

function con_getSensorResults(callback) {
    url = "http://localhost:3001/upload";
    $.ajax({
        url: url,
        type: "get",
        success: function (data){
            callback(data);
        }
    });
}