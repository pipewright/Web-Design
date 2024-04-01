


const showCalendarButton = document.getElementById('show-calendar-button')
const closeCalendarButton = document.getElementById('close-calendar-button')
const calendarModal = document.getElementById('calendar-modal')


showCalendarButton.addEventListener('click', () => {
    $("#calendar-modal").css('display', 'flex').css('opacity', '0');
    $("#calendar-modal").fadeTo(400, 1); 
});


closeCalendarButton.addEventListener('click', () => {
    $("#calendar-modal").fadeTo(400, 0, function() {
        $(this).css('display', 'none');
    });
});

let selectedDate = new Date();

function buildCalendar() {
    updateMonthHeader();

    const container = document.getElementById('calendar-rows-container');
    container.innerHTML = ''; // Clear existing calendar rows

    // Removed the local declarations to use the global currentMonth and currentYear
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    // Initialize selectedDate with today's date only if we are in the current month
    if (isCurrentMonth) {
        selectedDate = new Date(currentYear, currentMonth, today.getDate());
    }
    updateSelectedDateDisplay(selectedDate); // Update the button text to selected date

    const firstDay = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const paddingDays = firstDay.getDay();
    let totalSquares = paddingDays + daysInMonth;
    totalSquares += (7 - (totalSquares % 7)) % 7;

    for (let i = 0; i < totalSquares; i++) {
        if (i % 7 === 0) {
            var row = document.createElement('div');
            row.className = 'day-row';
            container.appendChild(row);
        }
        const daySquare = document.createElement('div');

        if (i < paddingDays || i >= paddingDays + daysInMonth) {
            daySquare.className = 'day-row-text-empty';
        } else {
            const day = i - paddingDays + 1;
            daySquare.className = 'day-row-text';
            daySquare.textContent = day;

            if (day === today.getDate() && isCurrentMonth) {
                daySquare.classList.add('day-row-text-selected');
            }

            daySquare.addEventListener('click', function() {
                selectedDate = new Date(currentYear, currentMonth, day);
                updateSelectedDateDisplay(selectedDate);
                document.querySelectorAll('.day-row-text-selected').forEach(element => {
                    element.classList.remove('day-row-text-selected');
                });
                daySquare.classList.add('day-row-text-selected');

                $("#calendar-modal").fadeTo(400, 0, function() {
                    $(this).css('display', 'none');
                });
                
                checkChairsAvailability();

            });
        }

        row.appendChild(daySquare);
    }
}



function updateSelectedDateDisplay(date) {
    const calendarButtonText = document.getElementById('calendar-button-text');
    const suffix = ["th", "st", "nd", "rd"][((date.getDate() % 100) - 20) % 10] || "th";
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}${suffix}, ${date.getFullYear()}`;
    calendarButtonText.textContent = formattedDate;
}

// Names of months for display
const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];


let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function updateMonthHeader() {
    const previousMonthIndex = (currentMonth - 1 + 12) % 12;
    const nextMonthIndex = (currentMonth + 1) % 12;

    document.getElementById('previous-month-text').textContent = monthAbbreviations[previousMonthIndex];
    document.getElementById('current-month-text').textContent = monthAbbreviations[currentMonth];
    document.getElementById('next-month-text').textContent = monthAbbreviations[nextMonthIndex];
}

function addMonthNavigationListeners() {
    document.getElementById('previous-month-text').addEventListener('click', () => {
        currentMonth = (currentMonth - 1 + 12) % 12;
        if (currentMonth === 11) {
            currentYear -= 1;
        }
        buildCalendar();
    });

    document.getElementById('next-month-text').addEventListener('click', () => {
        currentMonth = (currentMonth + 1) % 12;
        if (currentMonth === 0) {
            currentYear += 1;
        }
        buildCalendar();
    });
}




async function checkChairsAvailability() {
    const dateToCheck = new Date(selectedDate);
    dateToCheck.setHours(0, 0, 0, 0); 
    const nextDay = new Date(dateToCheck);
    nextDay.setDate(dateToCheck.getDate() + 1); 

    for (let i = 1; i <= 8; i++) {
        const chairId = `chair-${i}`;
        const chairAvailabilityDivId = `chair-${i}-availability`;
        const reservationsRef = db.collection('Chairs').doc(chairId).collection('Reservations');

        // Query for reservations that start before the end of the selected day
        const query = reservationsRef.where('startDate', '<', firebase.firestore.Timestamp.fromDate(nextDay));

        try {
            let isAvailable = true;
            const querySnapshot = await query.get();
            querySnapshot.forEach(doc => {
                const reservation = doc.data();
                if (reservation.endDate.toDate() > dateToCheck) {
                    isAvailable = false; 
                }
            });

            const availabilityDiv = document.getElementById(chairAvailabilityDivId);
            const toggleId = `chair-toggle-${i}`;
            const toggle = document.getElementById(toggleId);
            if (!isAvailable) {
                // Chair is not available
                availabilityDiv.textContent = 'UNAVAILABLE';
                availabilityDiv.classList.add('chair-text-unavailable');
                availabilityDiv.classList.remove('chair-text-available');

                toggle.classList.remove('chair-toggle-open');
                toggle.classList.add('chair-toggle-closed');
                toggle.innerHTML = "" //Checkbox 

            } else {
                // Chair is available
                availabilityDiv.textContent = 'AVAILABLE';
                availabilityDiv.classList.add('chair-text-available');
                availabilityDiv.classList.remove('chair-text-unavailable');

                toggle.classList.remove('chair-toggle-closed');
                toggle.classList.add('chair-toggle-open');
                toggle.innerHTML = "" //Checkbox Open
                
            }
        } catch (error) {
            console.error("Error checking availability for chair:", chairId, error);
        }
    }
}



function addToggleEventListeners() {
    for (let i = 1; i <= 8; i++) {
        const toggleId = `chair-toggle-${i}`;
        const toggle = document.getElementById(toggleId);

        if (!toggle) continue; // Skip if the toggle isn't found

        toggle.addEventListener('click', async () => {
            const chairId = `chair-${i}`;
            // Check if the toggle has the class indicating the chair is currently "open"
            const isOpen = toggle.classList.contains('chair-toggle-open');

            const reservationsRef = db.collection('Chairs').doc(chairId).collection('Reservations');
            const dummyReservationId = `admin-${selectedDate.toISOString().split('T')[0]}`;

            if (!isOpen) {
                try {
                    await reservationsRef.doc(dummyReservationId).delete();
                    toggle.classList.remove('chair-toggle-closed');
                    toggle.classList.add('chair-toggle-open');
                    toggle.innerHTML = "" //Checkbox

                    checkChairsAvailability()

                } catch (error) {
                    console.error(`Error opening chair ${i}: `, error);
                }
            } else {
                const startDate = new Date(selectedDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(selectedDate);
                endDate.setHours(23, 59, 59, 999);
                try {
                    await reservationsRef.doc(dummyReservationId).set({
                        startDate: firebase.firestore.Timestamp.fromDate(startDate),
                        endDate: firebase.firestore.Timestamp.fromDate(endDate),
                        description: 'Administrative Closure',
                        // Add any additional dummy reservation identifiers here
                    });
                    toggle.classList.remove('chair-toggle-open');
                    toggle.classList.add('chair-toggle-closed');
                    toggle.innerHTML = "" //Checkbox

                    checkChairsAvailability()

                } catch (error) {
                    console.error(`Error closing chair ${i}: `, error);
                }
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    buildCalendar();
    addMonthNavigationListeners();

    checkChairsAvailability()
    addToggleEventListeners()
});

