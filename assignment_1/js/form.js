/* 
FOR THE PURPOSES OF THIS ASSIGNMENT, please consider the 
API linked above to be a "blackbox" API with the 
following behavior:

Retrieve booking record:
- HTTP request:  'GET /api/booking/<book_id>' 
    params: <book_id>, the ID of the record to search for
- Response (JSON):
    { 'message': <success/fail>, 'data': <found_data> }

Create booking record:
- HTTP request:  'POST /api/create'
    params: form data as JSON object
- Response: 
    { 'message': <success/fail>, 'data': <new_data> }
*/

// assignment code begins here
let apiString = 'https://com601-assign1.herokuapp.com/api';

// AJAX for creating new bookings
// TODO: handle updating booking
function submitForm(booking, oldId) {
    // flag for updating or creating
    let updateFlag = (oldId == "") ? false : true;
    console.log('update? ' + updateFlag);
    let postData = {
        'first': booking.first,
        'last': booking.last,
        'email': booking.email
    };

    let query = '';
    if (updateFlag) {
         // update existing record
         query = apiString + '/booking/' + oldId;
         $.ajax({
             url: query,
             type: 'PUT',
             data: postData,
             success: handleSuccess
         });
    } else {
        // create new booking record
        query = apiString + '/create';
        $.post(query, postData, handleSuccess);
    }
     // DEBUG: print AJAX query
     console.log('querying: %s', query);
    
}

function handleSuccess(result, status, resp) {
    // TODO: change this to display better
    // DEBUG: print AJAX result status and data
    console.log(result, status, resp.statusText, resp.status);
    if (resp.status == 201) {
        // process success page
        $('#booked-id').text('Your booking ID: ' + result.data.book_id)
        $('#booked-name').text('Registered name: ' + result.data.first + ' ' + result.data.last);
        $('#booked-email').text('Email address: ' + result.data.email);

        // set message if update
        if ($('#found-id').val() != "") {
            $('.success-page > .section-header > p').text("Your accomodations have been updated successfully. Check out the details below:");
            $('#found-id').val('');
        }

        $('.booking-form').hide();
        $('.success-page').show();
    } else {
        // error tooltips
        if ($('#errormsg').length == 0) {
            $('.booking-form .section-wrapper').append('<p id="errormsg">Looks like there was an error, %s %s! Try again.</p>', resp.status, resp.statusText);
        } else {
            // TODO: make this all better
        }
    }
}

// AJAX for finding booking
function findByRef(id) {
    let query = apiString + '/booking/' + id;
    // DEBUG: print AJAX query
    // console.log('querying: %s', query);
    $.getJSON(query, (result) => {
        // DEBUG: print result data
        // console.log(result, result.data);
        if (result.data) {
            $('#firstname').val(result.data.first);
            $('#lastname').val(result.data.last);
            $('#email').val(result.data.email);
            $('#found-id').val(result.data.book_id);

            // change header text and button text
            $('.booking-form > .section-header > h3').text('Update your booking')
            $('.booking-form > .section-header > p').text('We found your booking record, ' + result.data.first + '. Feel free to change any of the fields below if you need to update it.');
            $('#submit-btn').text('Update booking');
            $('.booking-form > .section-footer > p').html('Want to start over? <a href="#" class="search-link">Go back</a>');
            $('.search-link').click(() => {
                $('.booking-form').hide();
                $('.search-form').show();
            });
            $('#search-input').val('');

            $('.booking-form').show();
            $('.search-form').hide();
        } else {
            // TODO: Use tooltip here
            // DEBUG: log if ID not found
            console.log('not found!');
        }
    });
}


// AJAX loading spinners, powered by spin.js
function showSpinner() {
    $('.ajax-spinner').show();
}

function hideSpinner() {
    $('.ajax-spinner').hide();
}

// DOM manipulation after document is ready
$(document).ready(() => {
    // hide booking form and success page
    $('.booking-form').hide();
    $('.success-page').hide();
    $('.ajax-spinner').hide();

    // switch view to search
    $('.search-link').click(() => {
        $('.booking-form').hide();
        $('.search-form').show();
    });

    // switch view to booking form
    $('.booking-link').click(() => {
        // clear forms
        $('#firstname').val('');
        $('#lastname').val('');
        $('#email').val('');
        $('#search-input').val('');
        $('#found-id').val('');

        // reset text
        $('#submit-btn').text('Reserve now');
        $('.booking-form > .section-header > h3').text('Create a new booking');
        $('.booking-form > .section-header > p').text('Fill out the fields below to book a new accomodation');
        $('.booking-form > .section-footer > p').html('Already have accomodations? <a href="#" class="search-link">Look up your booking here!</a>');
        $('.search-link').click(() => {
            $('.booking-form').hide();
            $('.search-form').show();
        });

        $('.booking-form').show();
        $('.search-form').hide();
        $('.success-page').hide();
    });

    // add click handler for submit button
    let submitBtn = $('#submit-btn');
    submitBtn.click(() => {
        // get form values and save to object
        let firstName = $('#firstname').val();
        let lastName = $('#lastname').val();
        let email = $('#email').val();
        let newBooking = {
            'first': firstName,
            'last': lastName,
            'email': email
        };

        // validate fields
        if (!firstName || !lastName || !email) {
            // TODO: show tooltip, console.log for now
            // TODO: better email client validation
            // DEBUG: log if form incomplete
            console.log("form values missing!");
        } else {
            // submit form with old ID, if found
            let oldId = $('#found-id').val();
            console.log('booking: ' , newBooking, oldId);
            submitForm(newBooking, oldId);
        }        
    });

    // add click handler for search button
    let searchBtn = $('#search-btn');
    searchBtn.click(() => {
        let searchId = $('#search-input').val();
        if (!searchId) {
            // TODO: replace this with tooltip
            // DEBUG: log if form incomplete
            console.log("search ID missing!", searchId);
        } else {
            // show spinner
            showSpinner();
            
            // search with ID
            findByRef(searchId);

            // hide spinner
            hideSpinner();
        }
    });

    // handle enter key on search
    let searchInp = $('#search-input');
    searchInp.keypress((e) => {
        if (e.keyCode == 13) {
            searchBtn.click();
        }
    });

    // set up AJAX spinner element
    let opts = { lines: 9, length: 34, width: 6, radius: 24, scale: 1, corners: 0.2, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 0.8, trail: 25, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: false, hwaccel: true, position: 'absolute' }
    let target = $('.ajax-spinner');
    let spinner = new Spinner(opts).spin();
    target.append(spinner);
});