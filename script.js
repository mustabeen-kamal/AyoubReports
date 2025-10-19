let roomsBackup = {};

document.getElementById('logoUpload').addEventListener('change', function(e){
    let img = document.getElementById('logoPreview');
    if (e.target.files && e.target.files[0]){
        let reader = new FileReader();
        reader.onload = function(ev){
            img.src = ev.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(e.target.files[0]);
    }
});

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
        roomLabel.textContent = "Room " + i;
        panel.appendChild(roomLabel);

        let roomType = document.createElement('select');
        roomType.innerHTML = '<option>Standard room</option><option>Sea view room</option><option>Pool view room</option>';
        panel.appendChild(roomType);

        let meal = document.createElement('select');
        meal.innerHTML = '<option>BB</option><option>HB</option><option>FB</option><option>All soft</option>';
        meal.style.marginLeft = "9px";
        panel.appendChild(meal);

        let guestCount = document.createElement('input');
        guestCount.type = "number";
        guestCount.value = 2;
        guestCount.min = 1;
        guestCount.max = 6;
        guestCount.style.marginLeft = "11px";
        panel.appendChild(document.createTextNode("Guests Count:"));
        panel.appendChild(guestCount);

        let guestsDiv = document.createElement('div');
        guestsDiv.className = "guests-container";
        panel.appendChild(guestsDiv);

        function renderGuests(n){
            guestsDiv.innerHTML = "";
            for(let j=1;j<=n;j++){
                let group = document.createElement('div');
                group.className = "guest-group";
                
                let gtype = document.createElement('select');
                gtype.innerHTML='<option>Adult</option><option>Child</option>';
                
                let gtitle = document.createElement('select');
                gtitle.innerHTML='<option>Mr</option><option>Mrs</option><option>Ms</option>';
                
                let gname = document.createElement('input');
                gname.type = "text";
                gname.placeholder = 'Guest ' + j;
                
                group.appendChild(gtype);
                group.appendChild(gtitle);
                group.appendChild(gname);
                guestsDiv.appendChild(group);
            }
        }
        guestCount.addEventListener('input', function(){
            let val = parseInt(this.value);
            if(val>0 && val<=6) renderGuests(val);
        });
        renderGuests(guestCount.value);

        container.appendChild(panel);

        roomsBackup[i] = {
            RoomType: roomType,
            MealPlan: meal,
            GuestCount: guestCount,
            GuestsDiv: guestsDiv
        };
    }
}

function addRoomsToTable(){
    let table = document.getElementById('roomsTable').getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    for(let i=1; i<=Object.keys(roomsBackup).length; i++){
        let row = table.insertRow();
        row.insertCell(0).innerText = i;
        let data = roomsBackup[i];
        row.insertCell(1).innerText = data.RoomType.value;
        row.insertCell(2).innerText = data.MealPlan.value;
        row.insertCell(3).innerText = data.GuestCount.value;

        // Guests
        let guestsList = [];
        let guestGroups = data.GuestsDiv.getElementsByClassName('guest-group');
        for(let g=0;g<guestGroups.length;g++){
            let type = guestGroups[g].getElementsByTagName('select')[0].value;
            let title = guestGroups[g].getElementsByTagName('select')[1].value;
            let name = guestGroups[g].getElementsByTagName('input')[0].value;
            guestsList.push(type + ' · ' + title + ' ' + name);
        }
        row.insertCell(4).innerText = guestsList.join(', ');
    }
}

function resetAll(){
    document.getElementById('companyPhone').value='';
    document.getElementById('companyAddress').value='';
    document.getElementById('mail').value='';
    document.getElementById('phone').value='';
    document.getElementById('voucherReference').value='';
    document.getElementById('bookingId').value='';
    document.getElementById('bookingIdSupplier').value='';
    document.getElementById('bookingDate').value='';
    document.getElementById('bookingTime').value='';
    document.getElementById('hotelName').value='';
    document.getElementById('checkIn').value='';
    document.getElementById('checkOut').value='';
    document.getElementById('roomCount').value='';
    document.getElementById('roomsContainer').innerHTML='';
    document.getElementById('logoPreview').src='';
    document.getElementById('logoPreview').style.display='none';
    document.getElementById('roomsTable').getElementsByTagName('tbody')[0].innerHTML='';
    roomsBackup = {};
}

function printReport(){
    let container = document.createElement('div');
    container.style.padding = "30px";
    container.style.direction = "ltr";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "14px";
    
    let now = new Date();
    let issueDate = now.toLocaleDateString('en-US');
    let issueTime = now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #223396; margin-bottom: 10px;">Travlink Booking</h1>
            ${document.getElementById('logoPreview').src ? `<img src="${document.getElementById('logoPreview').src}" style="max-width:120px; margin-bottom:10px;">` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #223396; margin-bottom: 10px;">Issue Date & Time</h3>
            <p><strong>${issueDate}</strong><br>${issueTime}</p>
        </div>
        
        <hr style="margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
            <p><strong>Mail</strong> : ${document.getElementById('mail').value || ''}<br>
            <strong>Phone</strong> : ${document.getElementById('phone').value || ''}</p>
            
            <p><strong>Address</strong> : ${document.getElementById('companyAddress').value || 'Libya. Tripoli'}<br>
            <strong>Phone</strong> : ${document.getElementById('companyPhone').value || '0980031113'}</p>
        </div>
        
        <hr style="margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #223396; margin-bottom: 10px;">Hotel Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; width: 30%;"><strong>Hotel Name</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('hotelName').value || 'Erawn hotel'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Check-in</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('checkIn').value || '8/18/2025'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Check-out</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('checkOut').value || '8/20/2025'}</td>
                </tr>
            </table>
        </div>
        
        <hr style="margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #223396; margin-bottom: 10px;">Booking Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; width: 30%;"><strong>Voucher Reference</strong></td><td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('voucherReference').value || '25496'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>BookingID</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('bookingId').value || '23940'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Supplier</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Tunisiaheds</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Booking ID supplier</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('bookingIdSupplier').value || '.'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Booking Date & Time</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${document.getElementById('bookingDate').value || issueDate} ${document.getElementById('bookingTime').value || issueTime}</td>
                </tr>
            </table>
        </div>
        
        <hr style="margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #223396; margin-bottom: 10px;">Rooms Information</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                <thead>
                    <tr style="background: #223396; color: white;">
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Room Number</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Room Type</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Meal Plan</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Guest Count</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Guests</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...document.getElementById('roomsTable').getElementsByTagName('tbody')[0].rows].map(row=>{
                        return `<tr>
                            <td style="border:1px solid #ddd;padding:6px;text-align:center;">${row.cells[0].innerText}</td>
                            <td style="border:1px solid #ddd;padding:6px;text-align:center;">${row.cells[1].innerText}</td>
                            <td style="border:1px solid #ddd;padding:6px;text-align:center;">${row.cells[2].innerText}</td>
                            <td style="border:1px solid #ddd;padding:6px;text-align:center;">${row.cells[3].innerText}</td>
                            <td style="border:1px solid #ddd;padding:6px;text-align:center;">${row.cells[4].innerText}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;

    html2canvas(container).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('booking_report.pdf');
    });
}
