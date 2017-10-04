// form functions will go here
let apiString = 'https://com601-assign1.herokuapp.com/api';

$(document).ready(() => {
    // switch view to search
    $('#search-link').click(() => {
        $('.booking-form').hide();
        $('.search-form').show();
    })

    // switch view to booking form
    $('#booking-link').click(() => {
        $('.booking-form').show();
        $('.search-form').hide();
    })

    // hide booking form
    $('.booking-form').hide();

    // add click handler for submit button
    let submitBtn = $('#submit-btn');
    submitBtn.click(() => {
        // get form values and save to object
        let firstName = $('#firstname').val();
        let lastName = $('#lastname').val();
        let email = $('#lastname').val();
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

    let postData = {
        'first': booking.first,
        'last': booking.last,
        'email': booking.email
    };

    let query = apiString + '/create';
    console.log('querying: %s', query);
    /* $.post(query, postData, (result) => {
        // TODO: change this to display better
        console.log(result);
    }); */

    $.ajax({
        url: query,
        type: 'POST',
        data: postData,
        success: (res, status) => {
            console.log(res, status);
        },
        error: (res) => {
            console.log(res.status, res.statusText);
        }
    });
}

function findByRef(id) {
    let query = apiString + '/booking/' + id;
    console.log('querying: %s', query);
    $.getJSON(query, (result) => {
        // TODO: change this to display better
        console.log(result);
    });
}