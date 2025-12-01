//logo problem


let roomsBackup = {};
let roomsData = [];

function toggleDataType() {
    const dataType = document.getElementById('dataType').value;
    const companyFields = document.getElementById('companyFields');
    const customerFields = document.getElementById('customerFields');
    
    if (dataType === 'company') {
        companyFields.style.display = 'block';
        customerFields.style.display = 'none';
    } else {
        companyFields.style.display = 'none';
        customerFields.style.display = 'block';
    }
}

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

                let ageSelect = document.createElement('select');
                for(let k=1; k<=12; k++){
                    let opt = document.createElement('option');
                    opt.value = k;
                    opt.textContent = k;
                    ageSelect.appendChild(opt);
                }
                ageSelect.style.marginLeft = "6px";
                ageSelect.style.display = "none";

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

        roomsData.push({
            number: data.number,
            type: data.RoomType.value,
            mealPlan: data.MealPlan.value,
            guestCount: data.GuestCount.value,
            guestNames: guestsList.join(', ')
        });
    }

    if (roomsData.length === 0) {
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
    document.querySelectorAll('select').forEach(select => {
        if (select.id !== 'dataType') {
            select.selectedIndex = 0;
        }
    });
    
    // Reset company/customer fields
    document.getElementById('companyName').value = '';
    document.getElementById('companyPhone').value = '';
    document.getElementById('companyAddress').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('dataType').selectedIndex = 0;
    toggleDataType();
    
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

function generatePDF() {
    if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
        alert('jsPDF library not loaded.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFillColor(241, 241, 241);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");

    if (typeof doc.autoTable !== 'function') {
        alert('jspdf-autotable plugin not found.');
        return;
    }

    // Get data type and values
    const dataType = document.getElementById('dataType').value;
    let name, phone, address;
    
    if (dataType === 'company') {
        name = document.getElementById('companyName').value || 'Null';
        phone = document.getElementById('companyPhone').value || 'xxxxxxxxx';
        address = document.getElementById('companyAddress').value || 'Null';
    } else {
        name = document.getElementById('customerName').value || 'Null';
        phone = document.getElementById('customerPhone').value || 'xxxxxxxxx';
        address = document.getElementById('customerAddress').value || 'Null';
    }
    
    const typeLabel = dataType === 'company' ? 'Company' : 'Customer';

    const voucherReference = document.getElementById('voucherReference').value || 'Null';
    const supplier = document.getElementById('supplier').value || 'Tunisiaheds';
    const bookingIdSupplier = document.getElementById('bookingIdSupplier').value || 'Null';
    const hotelName = document.getElementById('hotelName').value || 'Null';
    const checkIn = document.getElementById('checkIn').value || 'Null';
    const checkOut = document.getElementById('checkOut').value || 'Null';

    // ===== اللوقو كما كان يعمل في الأصل =====
    
    // Add uploaded logo إذا اختاره المستخدم
       // ===== اللوقو كما كان يعمل في الأصل =====
    
    // Add uploaded logo إذا اختاره المستخدم
    const logoPreview = document.getElementById('logoPreview');
    const staticLogo = document.getElementById('staticLogo');
    
    let logoAdded = false;
    
    // أولاً: حاول إضافة اللوقو المرفوع إذا كان موجوداً ومرئياً
    if (logoPreview && logoPreview.src && logoPreview.style.display !== 'none') {
        const src = logoPreview.src;
        let imgType = 'PNG';
        if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) imgType = 'JPEG';
        try {
            doc.addImage(src, imgType,  5, 0, 50, 45);
            logoAdded = true;
        } catch(e) {
            console.warn('addImage failed:', e);
        }
    }
    
    // ثانياً: إذا لم يتم إضافة لوقو مرفوع، أضف اللوقو الافتراضي
    if (!logoAdded && staticLogo && staticLogo.src) {
        const src = staticLogo.src;
        let imgType = 'PNG';
        if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) imgType = 'JPEG';
        try {
            doc.addImage(src, imgType, 5, 0, 50, 45);
        } catch(e) {
            console.warn('addImage failed (staticLogo):', e);
        }
    }

    // ===== باقي الكود كما كان =====
    
    // Header
    doc.setFontSize(20);
    doc.line(10, 30, 200, 30);

    // Date/time
    doc.setFontSize(10);
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();
    doc.text('Issue Date & Time:', 120, 25);
    doc.text(`${currentDate} ${currentTime}`, 153, 25);

    // Company/Customer info
    doc.setFontSize(15);
    doc.text(`${typeLabel} Name: ${name}`, 20, 45);
    doc.text(`${typeLabel} Phone: ${phone}`, 20, 55);
    doc.text(`${typeLabel} Address: ${address}`, 20, 65);

    // خط فاصل
    doc.line(10, 75, 200, 75);

    // ===== Booking Information =====
    doc.setFontSize(14);
    doc.text('Booking Information', 20, 85);

    doc.autoTable({
        startY: 90,
        head: [['Field', 'Value']],
        body: [
            ['Voucher Reference', voucherReference],
            ['Supplier', supplier],
            ['Booking ID Supplier', bookingIdSupplier]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [243, 218, 163] }
    });

    // ===== Hotel Information =====
    const afterBookingY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;
    doc.setFontSize(14);
    doc.text('Hotel Information', 20, afterBookingY);

    doc.autoTable({
        startY: afterBookingY + 5,
        head: [['Field', 'Value']],
        body: [
            ['Hotel Name', hotelName],
            ['Check-in', checkIn],
            ['Check-out', checkOut]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [243, 218, 163] }
    });

    // ===== Rooms Information =====
    const afterHotelY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150;
    doc.setFontSize(14);
    doc.text('Rooms Information', 20, afterHotelY);

    const roomsTableData = (roomsData.length > 0) ? roomsData.map(r => [String(r.number), r.type, r.mealPlan, String(r.guestCount), r.guestNames]) :
        [['Null','Null','Null','Null','Null']];

    doc.autoTable({
        startY: afterHotelY + 5,
        head: [['Room Number','Room Type','Meal Plan','Guest Count','Guest Names']],
        body: roomsTableData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [243, 218, 163] }
    });

    // ===== Notes =====
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

    // Add email footer
    doc.setFontSize(10);
    doc.text('Email: Blackbird.tourism@outlook.com', 105, 285, { align: 'center' });

    // Save
    doc.save('BookingReport.pdf');
}