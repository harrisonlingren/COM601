/* 
    FOR THE PURPOSES OF THIS ASSIGNMENT, please consider the 
    REST API  to be a "blackbox" with the 
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
// |---- assignment code begins here ----|
// REST API base URL
var apiString = 'https://com601-assign1.herokuapp.com/api';

// AJAX method for creating and updating bookings
function submitForm(booking, oldId) {
    // flag for updating or creating
    let updateFlag = (oldId == "") ? false : true;
    let postData = {
        'first': booking.first,
        'last': booking.last,
        'email': booking.email,
        'adults': booking.adults,
        'children': booking.children,
        'destination': booking.destination
    };

    let query = '';
    showSpinner();
    if (updateFlag) {
         // update existing record
         query = apiString + '/booking/' + oldId;
         $.ajax({
             url: query,
             type: 'PUT',
             data: postData,
             success: handleEditSuccess,
             error: (result, status, resp) => {
                 hideSpinner();
                 console.error('Could not make changes', resp);
             }
         });
    } else {
        // create new booking record
        showSpinner();
        query = apiString + '/create';
        $.ajax({
            url: query,
            data: postData, 
            type: 'POST',
            success: handleEditSuccess,
            error: (result, status, resp) => {
                hideSpinner();
                console.error('Could not create record!', resp);
            }
        });
    }
}

// handle AJAX CREATE & UPDATE success
function handleEditSuccess(result, status, resp) {
    hideSpinner();
    if (resp.status == 201) {
        // process success page
        $('.success-page > .section-header > h3').text('Thank you!');
        $('#booked-id').text('Your booking ID: ' + result.data.book_id)
        $('#booked-name').text('Registered name: ' + result.data.first + ' ' + result.data.last);
        $('#booked-email').text('Email address: ' + result.data.email);
        $('#booked-people').text(result.data.adults + ' adults and ' + result.data.children + ' children');
        $('#booked-dest').text('Traveling to: ' + result.data.destination);
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
        showTooltip(
            '.booking-form .section-wrapper', 
            'Looks like there was a ' + resp.status + 'error! Try again.'
        );
    }
}

// AJAX for cancel booking
function cancelBooking(id) {
    let query = apiString + '/booking/' + id;
    showSpinner();
    $.ajax({
        url: query,
        type: 'DELETE',
        success: handleDeleteSuccess,
        error: (result, status, resp) => {
            hideSpinner();
            showTooltip('.cancel-link', 'Could not delete record!');
        }
    });
}

// handle AJAX DELETE success
function handleDeleteSuccess() {
    hideSpinner();
    // set success page text
    let id = $('#found-id').val();
    $('.success-page > .section-header > h3').text('Cancelled reservation');
    $('.success-page > .section-wrapper > p').hide();
    $('.success-page > .section-header > p').text("Your booking (#" + id + ") has been cancelled. We're sorry to see you go!");
    removeTooltip('.cancel-link');

    // show success page
    $('.booking-form').hide();
    $('.success-page').show();
}

// AJAX for finding booking
function findByRef(id) {
    showSpinner();
    let query = apiString + '/booking/' + id;
    $.ajax({
        url: query,
        type: 'GET',
        error: (result, status, resp) => {
            hideSpinner();
            // notify user of error
            showTooltip('.search', 'Reference ID #' + id + ' not found!');
        },
        success: (result, status, resp) => {
            if (resp.status == 200) {
                $('#firstname').val(result.data.first);
                $('#lastname').val(result.data.last);
                $('#email').val(result.data.email);
                $('#adults').val(result.data.adults);
                $('#children').val(result.data.children);
                $('#destination').val(result.data.destination);
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

                // reset search link event handler
                $('.search-link').click(() => {
                    $('.booking-form').hide();
                    $('.search-form').show();
                }); $('#search-input').val('');
            } hideSpinner();
        }
    });
}

// AJAX loading spinner shortcuts, powered by spin.js.org
function showSpinner() {
    $('.spinner').show();
}

function hideSpinner() {
    $('.spinner').hide();
}

// show tooltip with message 'content' at 'target'
function showTooltip(target, content) {
    $(target).tooltip({
        items: target,
        content: content,
        position: {
            my: 'top',
            at: 'center bottom',
        }, tooltipClass: 'ui-state-error'
    }); $(target).tooltip('open');
    setTimeout(() => $(target).tooltip('close'), 5500);
}

// "remove" tooltip
function removeTooltip(target) {
    $(target).tooltip();
    $(target).tooltip('disable');
}

// DOM manipulation after document is ready
$(document).ready(() => {
    // hide booking form and success page
    $('.booking-form').hide();
    $('.cancel-prompt').hide();
    $('.success-page').hide();
    $('.spinner').hide();

    // switch view to search
    $('.search-link, header>h2').click(() => {
        $('.booking-form').hide();
        $('.search-form').show();
    });

    // switch view to booking form
    $('.booking-link').click(() => {
        // clear forms
        $('#firstname').val('');
        $('#lastname').val('');
        $('#email').val('');
        $('#adults').val('');
        $('#children').val('');
        $('#destination').val(0);
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
        let adults = $('#adults').val();
        let children = $('#children').val();
        let destination = $('#destination').val();

        // validate fields are filled
        if (!firstName || !lastName || !email || !adults || !children || !destination) {
            showTooltip(submitBtn, 'Please fill out all fields!');
        } else {
            removeTooltip(submitBtn);
            // submit form with old ID, if found
            let oldId = $('#found-id').val();
            let newBooking = {
                'first': firstName,
                'last': lastName,
                'email': email,
                'adults': adults,
                'children': children,
                'destination': destination
            }; submitForm(newBooking, oldId);
        }        
    });

    // spinners init
    $('#adults,#children').spinner();

    // add click handler for search button
    let searchBtn = $('#search-btn');
    searchBtn.click(() => {
        let searchId = $('#search-input').val();
        if (!searchId) { showTooltip('.search', 'Reference ID is missing!'); }
        else {
            if (searchId != parseInt(searchId, 10)) {
                showTooltip('.search', 'Reference ID must be a number!')
            } else {
                searchId = parseInt(searchId);
                removeTooltip('.search');
                findByRef(searchId);
            }
        }
    });

    // handle enter key on search & form
    let searchInp = $('#search-input');
    searchInp.keypress((e) => {
        if (e.keyCode == 13) { searchBtn.click(); }
    });

    let formInp = $('.booking-form > .section-wrapper > input');
    formInp.keypress((e) => {
        if (e.keyCode == 13) { submitBtn.click(); }
    });

    // load locations into selectmenu
    let destMenu = $('#destination');
    $.getJSON('src/js/destinations.json', (data) => {
        // append each region as optgroup
        $.each(data.destinations, (i, dest) => {
            destMenu.append('<optgroup label="' + dest.region + '"></optgroup>');
            // append each location to new optgroup alphabetically
            let loc = dest.locations; loc.sort();
            let newGrp = $('optgroup[label="' + dest.region + '"]');
            $.each(loc, (j, location) => {
                newGrp.append('<option value="' + location + '">' + location + '</option>');
            });
        });
    });


    // configure AJAX loading spinner element
    let opts = { lines: 11, length: 16, width: 6, radius: 16, scale: 1, corners: 0.2, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 0.8, trail: 25, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: false, hwaccel: true, position: 'absolute' }
    let target = $('.container');
    let s = new Spinner(opts).spin();
    target.append(s.el);
    hideSpinner();
});