// script.js (fixed)
let roomsBackup = {};
let roomsData = [];

function generateRooms(){
    let count = parseInt(document.getElementById('roomCount').value);
    if (isNaN(count) || count < 1) return alert('Enter valid room number');
    let container = document.getElementById('roomsContainer');
    container.innerHTML = '';
    roomsBackup = {};
    for(let i=1;i<=count;i++){
        let panel = document.createElement('div');
        panel.className = "room-panel";
        panel.id = "roomPanel"+i;

        let roomLabel = document.createElement('label');
        roomLabel.textContent = "Room " + i + " ";
        panel.appendChild(roomLabel);

        let roomType = document.createElement('select');
        roomType.innerHTML = '<option>Standard room</option><option>Sea view room</option><option>Pool view room</option>';
        panel.appendChild(roomType);

        let meal = document.createElement('select');
        meal.innerHTML = '<option>BB</option><option>HB</option><option>FB</option><option>All soft</option>';
        meal.style.marginLeft = "9px";
        panel.appendChild(meal);

        panel.appendChild(document.createTextNode("  Guests Count: "));
        let guestCount = document.createElement('input');
        guestCount.type = "number";
        guestCount.value = 2;
        guestCount.min = 1;
        guestCount.max = 6;
        guestCount.style.marginLeft = "6px";
        panel.appendChild(guestCount);

        let guestsDiv = document.createElement('div');
        guestsDiv.className = "guests-container";
        panel.appendChild(guestsDiv);

      function renderGuests(n){
    guestsDiv.innerHTML = "";
    for(let j=1;j<=n;j++){
        let group = document.createElement('div');
        group.className = "guest-group";
        group.style.marginTop = "6px";

        let gtype = document.createElement('select');
        gtype.innerHTML='<option>Adult</option><option>Child</option>';
        gtype.style.marginRight = "6px";

        let gtitle = document.createElement('select');
        gtitle.innerHTML='<option>Mr</option><option>Mrs</option><option>Ms</option>';
        gtitle.style.marginRight = "6px";

        let gname = document.createElement('input');
        gname.type = "text";
        gname.placeholder = 'Guest ' + j;

        // combo box للأعمار
        let ageSelect = document.createElement('select');
        for(let k=1; k<=12; k++){
            let opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            ageSelect.appendChild(opt);
        }
        ageSelect.style.marginLeft = "6px";
        ageSelect.style.display = "none"; // مخفي افتراضيًا

        gtype.addEventListener('change', function(){
            if(this.value === "Child"){
                ageSelect.style.display = "inline-block";
            } else {
                ageSelect.style.display = "none";
            }
        });

        group.appendChild(gtype);
        group.appendChild(gtitle);
        group.appendChild(gname);
        group.appendChild(ageSelect);

        guestsDiv.appendChild(group);
    }
}


        guestCount.addEventListener('input', function(){
            let val = parseInt(this.value) || 0;
            if(val < 1) val = 1;
            if(val > 6) val = 6;
            this.value = val;
            renderGuests(val);
        });
        renderGuests(guestCount.value);

        container.appendChild(panel);

        roomsBackup[i] = {
            number: i,
            RoomType: roomType,
            MealPlan: meal,
            GuestCount: guestCount,
            GuestsDiv: guestsDiv
        };
    }
}

function addRoomsToTable(){
    // empty previous table
    let tableBody = document.getElementById('roomsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    roomsData = [];

    const keys = Object.keys(roomsBackup).map(k => parseInt(k)).sort((a,b)=>a-b);
    for(let idx=0; idx<keys.length; idx++){
        let i = keys[idx];
        let data = roomsBackup[i];
        let row = tableBody.insertRow();

        row.insertCell(0).innerText = data.number;
        row.insertCell(1).innerText = data.RoomType.value;
        row.insertCell(2).innerText = data.MealPlan.value;
        row.insertCell(3).innerText = data.GuestCount.value;

        // Guests with age for children
        let guestsList = [];
        let guestGroups = data.GuestsDiv.getElementsByClassName('guest-group');
        for(let g=0; g<guestGroups.length; g++){
            let selects = guestGroups[g].getElementsByTagName('select');
            let inputs = guestGroups[g].getElementsByTagName('input');
            let type = selects[0] ? selects[0].value : '';
            let title = selects[1] ? selects[1].value : '';
            let name = inputs[0] ? inputs[0].value : '';
            
            let ageText = '';
            if(type === 'Child' && selects[2]){
                ageText = ' (' + selects[2].value + ' yrs)';
            }

            guestsList.push(type + ' · ' + title + ' ' + name + ageText);
        }
        row.insertCell(4).innerText = guestsList.join(', ');

        // push to roomsData for PDF
        roomsData.push({
            number: data.number,
            type: data.RoomType.value,
            mealPlan: data.MealPlan.value,
            guestCount: data.GuestCount.value,
            guestNames: guestsList.join(', ')
        });
    }

    if (roomsData.length === 0) {
        // if nothing generated, add default room to both table and roomsData
        let row = tableBody.insertRow();
        row.insertCell(0).innerText = 1;
        row.insertCell(1).innerText = 'Standard room';
        row.insertCell(2).innerText = 'BB';
        row.insertCell(3).innerText = 2;
        row.insertCell(4).innerText = 'Adult · Mr John Doe';
        roomsData.push({
            number: 1, type: 'Standard room', mealPlan: 'BB', guestCount: 2, guestNames: 'Adult · Mr John Doe'
        });
    }
}

function resetAll() {
    document.querySelectorAll('input').forEach(input => {
        if (input.type === 'file') {
            input.value = '';
        } else if (input.type !== 'button') {
            input.value = '';
        }
    });
    document.getElementById('supplier').value = 'Tunisiaheds';
    document.getElementById('roomsContainer').innerHTML = '';
    document.querySelector('#roomsTable tbody').innerHTML = '';
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('logoPreview').src = '';
    roomsData = [];
    roomsBackup = {};
}

// logo upload handler
document.getElementById('logoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            const logoPreview = document.getElementById('logoPreview');
            logoPreview.src = ev.target.result;
            logoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// function addLogo(doc, imgSrc) {
//     const maxWidth = 35;  // أقصى عرض للوغو
//     const maxHeight = 30; // أقصى ارتفاع للوغو
//     const x = 10;         // موقع اللوغو أفقي
//     const y = 8;          // موقع اللوغو عمودي

//     const image = new Image();
//     image.src = imgSrc;
//     image.onload = function() {
//         let width = image.width;
//         let height = image.height;

//         // ضبط الحجم مع الحفاظ على نسبة الارتفاع إلى العرض
//         const ratio = Math.min(maxWidth / width, maxHeight / height);
//         width = width * ratio;
//         height = height * ratio;

//         doc.addImage(image, 'PNG', x, y, width, height);
//     };
// }


// main PDF generator
function generatePDF() {
    // Correct checks for UMD jsPDF & autoTable
    if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
        alert('jsPDF library not loaded. Make sure you included jspdf.umd.min.js before script.js');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFillColor(241, 241, 241);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");


    if (typeof doc.autoTable !== 'function') {
        alert('jspdf-autotable plugin not found. Make sure you included jspdf.plugin.autotable.min.js before script.js');
        return;
    }

    // Collect form values
    const companyPhone = document.getElementById('companyPhone').value || 'xxxxxxxxx';
    const companyName = document.getElementById('Name').value || 'Null';
    const companyAddress = document.getElementById('companyAddress').value || 'Null';
    const mail = document.getElementById('mail').value || 'Null';
    const phone = document.getElementById('phone').value || 'xxxxxxxxx';
    const voucherReference = document.getElementById('voucherReference').value || 'Null';
    const bookingId = document.getElementById('bookingId').value || 'Null';
    const supplier = document.getElementById('supplier').value || 'Tunisiaheds';
    const bookingIdSupplier = document.getElementById('bookingIdSupplier').value || 'Null';
    const bookingDate = document.getElementById('bookingDate').value || 'Null';
    const bookingTime = document.getElementById('bookingTime').value || 'Null';
    const hotelName = document.getElementById('hotelName').value || 'Null';
    const checkIn = document.getElementById('checkIn').value || 'Null';
    const checkOut = document.getElementById('checkOut').value || 'Null';

    // Add logo if present
    const logoPreview = document.getElementById('logoPreview');
    if (logoPreview && logoPreview.src && logoPreview.style.display !== 'none') {
        // detect mime from data URL
        const src = logoPreview.src;
        let imgType = 'PNG';
        if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) imgType = 'JPEG';
        try {
            doc.addImage(src, imgType, 160, 8, 35, 30);
        } catch(e) {
            console.warn('addImage failed:', e);
        }
    }

// Add static logo if present
const staticLogo = document.getElementById('staticLogo');
if (staticLogo && staticLogo.src) {
    const src = staticLogo.src;
    let imgType = 'PNG';
    if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) imgType = 'JPEG';
    try {
        doc.addImage(src, imgType, 5, 0, 70, 60); // عرض أكبر وارتفاع أكبر
    } catch(e) {
        console.warn('addImage failed (staticLogo):', e);
    }
}


    // Header
   doc.setFontSize(20);
 //   doc.text(companyName, 105, 20, { align: 'center' });
    doc.setFontSize(16);
  // doc.text('Travlink Booking', 105, 30, { align: 'center' });
    doc.line(10, 40, 200, 40);

    // Date/time
    doc.setFontSize(10);
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();
    doc.text('Issue Date & Time:', 20, 45);
    doc.text(`${currentDate} ${currentTime}`, 52, 45);

    // Contacts
    doc.text(`Mail: ${mail}`, 20, 55);
    doc.text(`Phone: ${phone}`, 20, 62);
   doc.text(`Company Name: ${companyName}`, 120, 55);
    doc.text(`Address: ${companyAddress}`, 120, 62);
    doc.text(`Phone: ${companyPhone}`, 120, 69);

    doc.line(10, 75, 200, 75);

    // Hotel info table
    doc.setFontSize(14);
    doc.text('Hotel Information', 20, 85);

    doc.autoTable({
        startY: 90,
        head: [['Field', 'Value']],
        body: [
            ['Hotel Name', hotelName],
            ['Check-in', checkIn],
            ['Check-out', checkOut]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        
        headStyles: { fillColor: [243, 218, 163]
 }

    });

    // Booking info
    doc.setFontSize(14);
    const afterHotelY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 110;
    doc.text('Booking Information', 20, afterHotelY);

    const bookingDateTime = bookingDate && bookingTime ? `${bookingDate} ${bookingTime}` : 'N/A';

    doc.autoTable({
        startY: afterHotelY + 5,
        head: [['Field', 'Value']],
        body: [
            ['Voucher Reference', voucherReference],
            ['Booking ID', bookingId],
            ['Supplier', supplier],
            ['Booking ID supplier', bookingIdSupplier],
            ['Booking Date & Time', bookingDateTime]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [243, 218, 163]
 }

    });

    // Rooms table
    const afterBookingY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : afterHotelY + 40;
    doc.setFontSize(14);
    doc.text('Rooms Information', 20, afterBookingY);

    const roomsTableData = (roomsData.length > 0) ? roomsData.map(r => [String(r.number), r.type, r.mealPlan, String(r.guestCount), r.guestNames]) :
        [['Null','Null','Null','Null','Null']];

    doc.autoTable({
        startY: afterBookingY + 5,
        head: [['Room Number','Room Type','Meal Plan','Guest Count','Guest Names']],
        body: roomsTableData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [243, 218, 163]
}

    });

    const notes = [
        '- Tourism tax in Tunisian hotels is not included and must be paid on-site.',
        '- Check-in from 2.00 PM | Check-out by 12.00 PM.',
        '- Most bookings are non-refundable. Please check the cancellation policy before booking.'
    ];

    doc.setFontSize(10);
    let notesY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 250;
    notes.forEach(note => {
        if (notesY > 280) {
            doc.addPage();
            notesY = 20;
        }
        doc.text(note, 20, notesY);
        notesY += 6;
    });

    // Save
    doc.save('BookingReport.pdf'); 
}
