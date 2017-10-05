// form functions will go here
let apiString = 'https://com601-assign1.herokuapp.com/api';

$(document).ready(() => {
    // switch view to search
    $('.search-link').click(() => {
        $('.booking-form').hide();
        $('.search-form').show();
    })

    // switch view to booking form
    $('.booking-link').click(() => {
        $('.booking-form').show();
        $('.search-form').hide();
        $('.success-page').hide();
    })

    // hide booking form and success page
    $('.booking-form').hide();
    $('.success-page').hide();

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
            console.log("form values missing!");
        } else {
            // pass to helper function
            submitForm(newBooking)
        }
    });

    // add click handler for search button
    let searchBtn = $('#search-btn');
    searchBtn.click(() => {
        let searchId = $('#search-input').val();
        if (!searchId) {
            // TODO: replace this with tooltip
            console.log("search ID missing!", searchId);
        } else {
            findByRef(searchId);
        }
    });
});

// handle submit to create new booking
// TODO: handle updating booking
function submitForm(booking) {
    let query = apiString + '/create';
    let postData = {
        'first': booking.first,
        'last': booking.last,
        'email': booking.email
    };
    
    console.log('querying: %s', query);

    $.post(query, postData, (result, status, resp) => {
        // TODO: change this to display better
        console.log(result, status, resp.statusText, resp.status);
        if (resp.status == 201) {
            // process success page
            $('#booked-id').append(result.data.book_id);
            $('#booked-name').append(result.data.first + ' ' + result.data.last);
            $('#booked-email').append(result.data.email);

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
    });
}

function findByRef(id) {
    let query = apiString + '/booking/' + id;
    console.log('querying: %s', query);
    $.getJSON(query, (result) => {
        console.log(result, result.data);
        if (result.data) {
            $('#firstname').val(result.data.first);
            $('#lastname').val(result.data.last);
            $('#email').val(result.data.email);

            $('.booking-form').show();
            $('.search-form').hide();
        } else {
            console.log('not found!');
        }
    });
}