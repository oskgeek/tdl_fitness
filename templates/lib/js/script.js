var obj = {};
$(function () {
    // $('form').submit(function(event){
    //     event.preventDefault();
    // });

    if (checkCookie('tdl_email') && checkCookie('tdl_pw')) {
        $('#loginbox, signupbox').hide();
        $('#content').show();
        init();
    };
    
    $('#btn-signup').click(function(event) {
        $.ajax({
            url: 'http://localhost:8000/signup/',
            type: 'POST',
            dataType: 'json',
            data: $('#signupform').serialize(),
        })
        .done(function(res) {
            if (res.status == 'OK') {
                $('#signupbox').hide()
                $('#loginbox').show();
            };
            console.log("signup success");
        })
        .fail(function() {
            console.log("signup error");
        })
        .always(function() {
            console.log("signup complete");
        });
    });
    $('#btn-login').click(function(event) {
        $.ajax({
            url: 'http://localhost:8000/login/',
            type: 'POST',
            dataType: 'json',
            data: $('#loginform').serialize(),
        })
        .done(function(res) {
            if (res.status == 'OK') {
                $('#loginbox, #signupbox').hide();
                $('#content').show();
                var email = $('#loginform [name="email"]').val();
                var pw = $('#loginform [name="password"]').val();
                setCookie('tdl_email', email);
                setCookie('tdl_pw', pw);
                init();
            };
            console.log("login success");
        })
        .fail(function() {
            console.log("login error");
        })
        .always(function() {
            console.log("login complete");
        });
    });
    $('#sign_out').click(function(event) {
        document.cookie = "tdl_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "tdl_pw=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        window.location.reload();
    });
    var form = document.forms.namedItem("add_ex_form");
    form.addEventListener('submit', function(ev) {
      ev.preventDefault();

      var oOutput = document.querySelector("div"),
          oData = new FormData(form);

      oData.append("CustomField", "This is some extra data");

      var oReq = new XMLHttpRequest();
      oReq.open("POST", "http://localhost:8000/excercise/", true);
      oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
            $('#addExerciseModal').modal('hide');
            console.log('Uploaded!');
        } else {
            console.log('Error' + oReq.status + ' occurred when trying to upload your file.<br \/>');
        }
      };

      oReq.send(oData);
    }, false);
})
function setCookie(cname, cvalue) {

    document.cookie = cname + "=" + cvalue;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function checkCookie(cname) {
    var cname=getCookie(cname);
    if (cname!="") {
        return true;
    }
}
function init() {

    /* initialize the external events
    -----------------------------------------------------------------*/

    $('#external-events .fc-event').each(function() {
        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });
    });
        
    /* initialize the calendar
    -----------------------------------------------------------------*/

    var arr = [];

    // var today = new Date();
    // var dd = today.getDate();
    // var mm = today.getMonth()+1; //January is 0!
    // var yyyy = today.getFullYear();
    // var date = yyyy+'-0'+mm+'-0'+dd;

    var m = moment();
    m = m.stripTime();
    m = m.format();
    $('#calendar').fullCalendar({
        // defaultDate: new Date(),
        header: {
            center: 'title',
            left: '', // 'prev,next today'
            right: '' // 'month,agendaWeek,agendaDay'
        },
        defaultView: 'agendaWeek', //basicWeek
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        viewRender: function(view, element) {
            // console.log(m.toString());
            // $('#calendar').fullCalendar( 'gotoDate', '2014-05-01' );
            // $('#calendar').fullCalendar('gotoDate', m);
            // var moment = $('#calendar').fullCalendar('getDate');
            // console.log("The current date of the calendar is " + moment.format());
        },
        drop: function(date, jsEvent, ui) {
            // console.log('drop', $(this));
            // is the "remove after drop" checkbox checked?
            //if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                //$(this).remove();
            //}
        },
        eventClick: function(event, jsEvent, view){
            // var r = confirm("Delete " + event.title);
            // if (r===true){
            //     $('#calendar').fullCalendar('removeEvents', event._id);
            // }
            //event.description = $(this).find('.fc-desc').text();
            //var updatedDesc = prompt('Event Title:', event.description, { buttons: { Ok: true, Cancel: false} });
            //if (updatedDesc){
                //event.description = updatedDesc;
                //$(this).find('.fc-desc').text(updatedDesc);
                //$('#calendar').fullCalendar('updateEvent', event._id);
            //}
            $('#myModal').modal('show');
            var clickedElement = $(this);
            $('#save_changes').click(function () {
                saveChanges(event._id, clickedElement);
            });
        },
        eventMouseover: function(event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                $(jsEvent.target).attr('title', event.title);
            }
        },
        eventRender: function(event, element, view) {
            element.attr('data-id', event._id);
            element.find('.fc-title')
                .append('<div class="fc-desc"><span class="ex-set">3</span> sets, <span class="ex-reps">12</span> reps.</div>');
            
        },
        eventAfterRender: function(event, element, view ) { 
            if (!$.isEmptyObject(obj)) {
                var elemID = $(element).attr('data-id');
                if (obj[elemID]) {

                    $('[data-id="'+elemID+'"]').find('.ex-set').text(obj[elemID].set);
                    $('[data-id="'+elemID+'"]').find('.ex-reps').text(obj[elemID].reps);
                    
                };
            };
            
        },
        eventDragStop: function(event,jsEvent) {
            
            var trashEl = $('#calendarTrash');
            var ofs = trashEl.offset();

            var x1 = ofs.left;
            var x2 = ofs.left + trashEl.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + trashEl.outerHeight(true);

            if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                jsEvent.pageY>= y1 && jsEvent.pageY <= y2) {

                var r = confirm("Sure! Want to Delete " + event.title + "?");
                if (r===true){
                    $('#calendar').fullCalendar('removeEvents', event._id);
                }
            }
        }
    })

    $('div.fc-right').append('<div id="calendarTrash" class="hidden-print calendar-trash" title="Drop the event here to delete!"><img src="lib/trash.png"></img></div>');
    $('div.fc-left').append('<button id="print" type="button" class="hidden-print fc-button fc-state-default fc-corner-left fc-corner-right">Print</button>')
        .append('<button id="addExModal" type="button" data-toggle="modal" data-target="#addExerciseModal" class="hidden-print fc-button fc-state-default fc-corner-left fc-corner-right">Add Exercise</button>');

    /* Modal
    ---------------------------------------------------------------- */

    $('#myModal').on('shown.bs.modal', function () {

    })

    $('.fc-widget-header .fc-sun').append('<div>Routine 1</div><div class="ex-header">Chest & Tricep</div>');
    $('.fc-widget-header .fc-mon').append('<div>Routine 2</div><div class="ex-header">Soulder & Legs</div>');
    $('.fc-widget-header .fc-tue').append('<div>Routine 3</div><div class="ex-header">Lats & Biceps</div>');
    $('.fc-widget-header .fc-wed').append('<div>Routine 4</div><div class="ex-header">Chest & Tricep</div>');
    $('.fc-widget-header .fc-thu').append('<div>Routine 5</div><div class="ex-header">Soulder & Legs</div>');
    $('.fc-widget-header .fc-fri').append('<div>Routine 6</div><div class="ex-header">Lats & Biceps</div>');
    $('.fc-widget-header .fc-sat').append('<div>Routine 7</div><div class="ex-header">As per choice</div>');

    $('#print').click(function () {
        // PrintElem($('.fc-view-container'));
        window.print();
    })
};
function saveChanges(id, elem) {
    var exSet = $('#ex_set').val();
    var exReps =$('#ex_reps').val();
    
    if (!obj.hasOwnProperty(id)) {
        obj[id] = {
            set: exSet,
            reps: exReps
        };
    };

    elem.find('.ex-set').text(exSet);
    elem.find('.ex-reps').text(exReps);

    $('#myModal').modal('hide');
}
function PrintElem(elem) {

    Popup($(elem).html());
}
function Popup(data) {
    var mywindow = window.open('', 'My Exercise Schedule', 'height=600,width=600');
    mywindow.document.open();
    mywindow.document.write('<html><head><title>My Exercise Schedule</title>');
    /*optional stylesheet*/ 
    mywindow.document.write('</head><body >');
    mywindow.document.write('<link href="lib/fullcalendar.print.css" rel="stylesheet" media="print" />');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}
