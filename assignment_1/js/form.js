// form functions will go here
let apiString = 'https://com601-assign1.herokuapp.com/api';

$(document).ready(() => {
    // add click handler for submit button
    let submitBtn = $('#submit-btn');
    submitBtn.click(() => {
        // get form values and save to object
        let firstName = $('#firstname').value;
        let lastName = $('#lastname').value;
        let email = $('#lastname').value;
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
        let searchId = $('#search-input').value;
        if (!searchId) {
            // TODO: replace this with tooltip
            console.log("search ID missing!");
        } else {
            findByRef(searchId);
        }
    });

    // switch view to search
    let searchLink = $('#search-link')
    searchLink.click(() => {
        $('.booking-form').hide();
        $('.search-form').show();
    })

    // switch view to booking form
    let searchLink = $('#booking-link')
    searchLink.click(() => {
        $('.booking-form').show();
        $('.search-form').hide();
    })
});

// handle submit to create new booking
// TODO: handle updating booking
function submitForm(booking) {
    $.post(apiString+'/create', {
        'first': booking.first,
        'last': booking.last,
        'email': booking.email
    }, (result) => {
        // TODO: change this to display better
        console.log(result);
    });
}

function findByRef(id) {
    let query = apiString + '/booking/' + id;
    $.get(query, (result) => {
        // TODO: change this to display better
        console.log(result);
    })
}