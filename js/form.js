
// Object where form response is stored
var form_data = {
    name: "",
    designation: "",
    appointment: false,
    spoken_to: false
};

// History used for back button
var hist = ["#q1"];


// Hides everything except pre-question after load
$( document ).ready(function() {
    $("#q1").hide();
    $("#q2").hide();
    $("#q3").hide();
    $("#q4a").hide();
    $("#q4b").hide();
    $("#keyb").hide();
    $("#back").hide();
    $("#post").hide();
});


// Q1 -> Q2
$(".q1btn").click(function(event){
    event.preventDefault();
    $("#pre").hide();
    $("#q1").show();
    $("#keyb").show();
});

// Q2 -> Q3
$(".q3btn").click(function(event){
    event.preventDefault();
    hist.push("#q3");
    $(hist[hist.length-2]).hide();
    $(hist[hist.length-1]).show();
});

// Q3 -> Q4A
$(".q4abtn").click(function(event){
    event.preventDefault();
    hist.push("#q4a");
    $(hist[hist.length-2]).hide();
    $(hist[hist.length-1]).show();
});

// Q3 -> Q4B
$(".q4bbtn").click(function(event){
    event.preventDefault();
    hist.push("#q4b");
    $(hist[hist.length-2]).hide();
    $(hist[hist.length-1]).show();
});

// Updates form_data object
$("#skip-client").click(function(event){
    event.preventDefault();
    form_data.designation = "skip";
});
$("#ray-client").click(function(event){
    event.preventDefault();
    form_data.designation = "ray";
});
$("#bankruptcy").click(function(event){
    event.preventDefault();
    form_data.designation = "non-client-bankruptcy";
});
$("#other").click(function(event){
    event.preventDefault();
    form_data.designation = "non-client-other";
});
$("#appt-yes").click(function(event){
    event.preventDefault();
    form_data.appointment = true;
    form_data.spoken_to = true;
});
$("#appt-no").click(function(event){
    event.preventDefault();
    form_data.appointment = false;
    form_data.spoken_to = null;
});
$("#speak-yes").click(function(event){
    event.preventDefault();
    form_data.appointment = null;
    form_data.spoken_to = true;
});
$("#speak-no").click(function(event){
    event.preventDefault();
    form_data.appointment = null;
    form_data.spoken_to = false;
});

// Back Button implementation
$("#back").click(function(event){
    event.preventDefault();
    if (hist.length>=2){
        $(hist.pop()).hide()
        $(hist[hist.length-1]).show()
    }
    if (hist.length==1){
        $("#back").hide();
    }
    else {
        $("#back").show();
    }
    if (hist[hist.length-1] == "#q1"){
        show = true;
        $("#keyb").show();
    }
});

// API Requests
var request;
function msgChat(info, data){
    var fields = [];
    var sent = "";
    if (form_data.designation == "ray"){
        if (form_data.spoken_to){
            sent = "Ray Client: " + form_data.name + " is here and is expected";

        }
        else {
            sent = "Ray Client: " + form_data.name + " is here and is not expected";
        }
    }
    else if (form_data.designation == "skip"){
        if (data.appointment){
            sent = "Skip Client: " + form_data.name + " is here and has an appointment.";

        }
        else {
            sent = "Skip Client: " + form_data.name + " is here and doesn't have an apppointment.";
        }
    }
    else if (form_data.designation == "non-client-bankruptcy"){
        if (form_data.appointment){
            sent = "Bankruptcy Non-Client: " + form_data.name + " is here and has an appointment.";

        }
        else {
            sent = "Bankruptcy Non-Client: " + form_data.name + " is here and doesn't have an apppointment.";
        }
    }
    else if (form_data.designation == "non-client-other"){
        if (form_data.appointment){
            sent = "Miscellaneous Non-Client: " + form_data.name + " is here and has an appointment.";
        }
        else {
            sent = "Miscellaneous Non-Client: " + form_data.name + " is here and doesn't have an apppointment.";
        }
    }
    var sender = {
        roomId: data.roomId,
        text: sent,
    }
    Object.keys(data.text).forEach(function(element) {
        fields.push({
            "short": true,
            "title": element,
            "value": form_data[element]
        })
    });
    $.ajax({
        type: "POST",
        url: "https://arlochat.com/api/v1/chat.postMessage",
        dataType: 'json',
        contentType: 'application/json',
        headers: info,
        data: JSON.stringify(sender),
        success: function (response) {
            console.log("Sent\t"+sender.text);
            $(hist[hist.length-1]).hide()
            $("#back").hide();
            $("#post").show();
            var re = function(){
                location.reload()
            };
            setTimeout(re, 5000);
        }
    });
}
function loginChat(data, res){
    var info = {
        "X-Auth-Token": res.data.authToken,
        "X-User-Id": res.data.userId,
    };
    request = $.ajax({
        type: "GET",
        url: "https://arlochat.com/api/v1/groups.list",
        dataType: 'json',
        contentType: 'application/json',
        headers: info,
        success: function (response) {
            var newData = {
                roomId: response.groups[0]._id,
                text: data
            };
            console.log(response);
            msgChat(info, newData);
        }
    });
}   
function authChat(data){
    var info = {
        "user": "will_e",
        "password": ""
    };
    request = $.ajax({
        type: "POST",
        url: "https://arlochat.com/api/v1/login",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(info),
        success: function (response) {
            console.log(response);
            loginChat(data, response);
        }
    });
}

// Final button press -> Submit form
$(".finbtn").click(function(event){
    // Clean up
    event.preventDefault();
    if (request) {
        request.abort();
    }
    $( "button" ).prop("disabled",true);
      
    // Google Docs
    request = $.ajax({
      url: "",
      type: "post",
      data: form_data
    });

    request.done(function (response, textStatus, jqXHR){
        authChat(form_data);
    });

});


// Disabled keyboard toggle
//$("#field").focus(function() {
//    $("#keyb").show();
//});
