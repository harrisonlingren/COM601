/* 
FOR THE PURPOSES OF THIS ASSIGNMENT, please consider the 
API linked above to be a "blackbox" API with the 
following CRUD behavior:

    Create booking record:
    - HTTP request:  'POST /api/create'
        params: form data as JSON object
    - Response: 
        { 'message': <success/fail>, 'data': <new_data> }

    Retrieve booking record:
    - HTTP request:  'GET /api/booking/<book_id>' 
        params: <book_id>, the ID of the record to search for
    - Response (JSON):
        { 'message': <success/fail>, 'data': <found_data> }

    Update booking record:
    - HTTP request:  'PUT /api/booking/<book_id>'
        params: form data as JSON object
    - Response: 
        { 'message': <success/fail>, 'data': <new_data> }

    Delete booking record:
    - HTTP request:  'DELETE /api/booking/<book_id>' 
        params: <book_id>, the ID of the record to be deleted
    - Response (JSON):
        { 'message': <success/fail> }
*/

// assignment code begins here
var apiString = 'https://com601-assign1.herokuapp.com/api';

// AJAX for creating and updating bookings
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
             success: handleEditSuccess
         });
    } else {
        // create new booking record
        query = apiString + '/create';
        $.post(query, postData, handleEditSuccess);
    }
     // DEBUG: print AJAX query
     console.log('querying: %s', query);
    
}

// handle AJAX CREATE & UPDATE success
function handleEditSuccess(result, status, resp) {
    // TODO: change this to display better
    // DEBUG: print AJAX result status and data
    console.log(result, status, resp.statusText, resp.status);
    if (resp.status == 201) {
        // process success page
        $('.success-page > .section-header > h3').text('Thank you!');
        $('#booked-id').text('Your booking ID: ' + result.data.book_id)
        $('#booked-name').text('Registered name: ' + result.data.first + ' ' + result.data.last);
        $('#booked-email').text('Email address: ' + result.data.email);
        $('.success-page > .section-wrapper > p').show();

        // set message if update
        let id = $('#found-id').val();
        if (id != "") {
            $('.success-page > .section-header > p').text("Your accomodations have been updated successfully. Check out the details below:");
            $('#found-id').val('');
        } else {
            $('.success-page > .section-header > p').text("Your accomodations have been booked successfully. Check out the details below:");
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

// AJAX for cancel booking
function cancelBooking(id) {
    let query = apiString + '/booking/' + id;
    $.ajax({
        url: query,
        type: 'DELETE',
        success: handleDeleteSuccess
    });
}

// handle AJAX DELETE success
function handleDeleteSuccess() {
    // set success page text
    let id = $('#found-id').val();
    $('.success-page > .section-header > h3').text('Cancelled reservation');
    $('.success-page > .section-wrapper > p').hide();
    $('.success-page > .section-header > p').text("Your booking (#" + id + ") has been cancelled. We're sorry to see you go!");
    
    // show success page
    $('.booking-form').hide();
    $('.success-page').show();
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
            
            // cancel link
            $('.cancel-link').click(() => { cancelBooking(result.data.book_id) });

            $('.cancel-prompt').show();
            $('.booking-form').show();
            $('.search-form').hide();

            // re-init search link event handler
            $('.search-link').click(() => {
                $('.booking-form').hide();
                $('.search-form').show();
            }); $('#search-input').val('');            
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
    $('.cancel-prompt').hide();
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
        $('.cancel-prompt').hide();

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

    // handle enter key on form
    let formInp = $('.booking-form > .section-wrapper > input');
    formInp.keypress((e) => {
        if (e.keyCode == 13) {
            submitBtn.click();
        }
    });

    // set up AJAX spinner element
    let opts = { lines: 9, length: 34, width: 6, radius: 24, scale: 1, corners: 0.2, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 0.8, trail: 25, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: false, hwaccel: true, position: 'absolute' }
    let target = $('.ajax-spinner');
    let spinner = new Spinner(opts).spin(target);
});