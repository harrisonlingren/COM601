function getCalendarDate() {
    let now = new Date();
    return now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function getClockTime() {
    let now = new Date();
    return now.toLocaleTimeString('en-US');
}