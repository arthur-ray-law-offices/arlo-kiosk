
// Object where form response is stored
var form_data = {
    name: "",
    designation: "",
    appointment: false,
    spoken_to: false
};

// History used for back button
var hist = ["#pre"];

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

var idleTime = parseInt(getCookie("time")) + 1;

// Hides everything except pre-question after load
$( document ).ready(function() {
    $("#q1").hide();
    $("#q2").hide();
    $("#q3").hide();
    $("#q3b").hide();
    $("#q4a").hide();
    $("#q4b").hide();
    $("#keyb").hide();
    $("#back").hide();
    $("#post").hide();    

    var idleInterval = setInterval(timerIncrement, 30000); // 30 sec
    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

function timerIncrement() {
    document.cookie = "time=" + idleTime;
    console.log(idleTime);
    if (idleTime==2){
        window.location.reload();
    }
    idleTime = idleTime + 1; 
}

// Pre -> Q1
$(".q1btn").click(function(event){
    event.preventDefault();
    $("#pre").hide();
    $("#q1").show();
    $("#keyb").show();
    $("#back").show();
    hist.push("#q1");
    document.getElementById("back").classList.remove("bb");
    document.getElementById("back").classList.add("bb2");
    show = true;
});

// Q3 -> Q2
$(".q2btn").click(function(event){
    event.preventDefault();
    hist.push("#q2");
    $(hist[hist.length-2]).hide();
    $(hist[hist.length-1]).show();
});

// Q2 -> Q3
$(".q3btn").click(function(event){
    event.preventDefault();
    hist.push("#q3");
    if (form_data.designation=="ray"){
        $("#custom")[0].innerHTML="Select NOT YET if you are only here to work a case up or consult with an attorney."
    }
    else {
        $("#custom")[0].innerHTML="Select NOT YET if you are only here to discuss a legal issue & consult with an attorney."
    }
    $(hist[hist.length-2]).hide();
    $(hist[hist.length-1]).show();
});

$(".q3bbtn").click(function(event){
    event.preventDefault();
    hist.push("#q3b");
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

$(".q4cbtn").click(function(event){
    event.preventDefault();
    if (form_data.designation=="ray"){
        hist.push("#q4b");
    }
    else {
        hist.push("#q4a");
    }
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
$("#non-client").click(function(event){
    event.preventDefault();
    if (form_data.designation=="ray"){
        form_data.designation = "non-client-bankruptcy";
    }
    else {
        form_data.designation = "non-client-other";
    }
});
$("#appt-yes").click(function(event){
    event.preventDefault();
    form_data.appointment = true;
    form_data.spoken_to = true;
    fin();
});
$("#appt-no").click(function(event){
    event.preventDefault();
    form_data.appointment = false;
    form_data.spoken_to = null;
    fin();
});
$("#speak-yes").click(function(event){
    event.preventDefault();
    form_data.appointment = null;
    form_data.spoken_to = true;
    fin();
});
$("#speak-no").click(function(event){
    event.preventDefault();
    form_data.appointment = null;
    form_data.spoken_to = false;
    fin();
});

// Back Button implementation
$("#back").click(function(event){
    event.preventDefault();
    if (hist.length>1){
        $(hist.pop()).hide()
        $(hist[hist.length-1]).show()
    }
    if (hist[hist.length-1] == "#q1"){
        show = true;
        $("#keyb").show();
        document.getElementById("back").classList.remove("bb");
        document.getElementById("back").classList.add("bb2");    
    }
    else {
        show = false;
        $("#keyb").hide();
        document.getElementById("back").classList.remove("bb2");
        document.getElementById("back").classList.add("bb");    
    }
    if (hist[hist.length-1] == "#pre"){
        $("#back").hide();
    }
    else {
        $("#back").show();
    }
});

// API Requests
var request;
function msgChat(info, data){
    var fields = [];
    var sent = "";
    if (form_data.designation == "ray"){
        if (form_data.spoken_to){
            sent = "Bankruptcy Client: " + form_data.name + " is here and is expected";

        }
        else {
            sent = "Bankruptcy Client: " + form_data.name + " is here and is not expected";
        }
    }
    else if (form_data.designation == "skip"){
        if (form_data.appointment){
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
    console.log(sender);
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
            logoutChat(info);
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
function logoutChat(info){
    request = $.ajax({
        type: "POST",
        url: "https://arlochat.com/api/v1/logout",
        dataType: 'json',
        contentType: 'application/json',
        headers: info,
        success: function (response) {
        }
    });
}   
function authChat(data){
    var info = {
        "user": "signin.bot",
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
function fin(){
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
        if (form_data.name.length>0){
            authChat(form_data);
        }
    });

}

// Disabled keyboard toggle
//$("#field").focus(function() {
//    $("#keyb").show();
//});
