document.addEventListener('DOMContentLoaded', () => {
    const agendaForm = document.getElementById('agenda-form');
    const agendaList = document.getElementById('agenda-list');
    const calendarGridContainer = document.getElementById('calendar-grid-container');

    // Daftar bulan lengkap dari Oktober 2026 sampai September 2027
    const monthsData = [
        { name: 'OKTOBER 2026', class: 'oct', year: 2026, monthIndex: 9, startDay: 3, totalDays: 31 },
        { name: 'NOVEMBER 2026', class: 'nov', year: 2026, monthIndex: 10, startDay: 6, totalDays: 30 },
        { name: 'DESEMBER 2026', class: 'dec', year: 2026, monthIndex: 11, startDay: 1, totalDays: 31 },
        { name: 'JANUARI 2027', class: 'jan', year: 2027, monthIndex: 0, startDay: 4, totalDays: 31 },
        { name: 'FEBRUARI 2027', class: 'feb', year: 2027, monthIndex: 1, startDay: 0, totalDays: 28 },
        { name: 'MARET 2027', class: 'mar', year: 2027, monthIndex: 2, startDay: 0, totalDays: 31 },
        { name: 'APRIL 2027', class: 'apr', year: 2027, monthIndex: 3, startDay: 3, totalDays: 30 },
        { name: 'MEI 2027', class: 'mei', year: 2027, monthIndex: 4, startDay: 5, totalDays: 31 },
        { name: 'JUNI 2027', class: 'jun', year: 2027, monthIndex: 5, startDay: 1, totalDays: 30 },
        { name: 'JULI 2027', class: 'jul', year: 2027, monthIndex: 6, startDay: 3, totalDays: 31 },
        { name: 'AGUSTUS 2027', class: 'agu', year: 2027, monthIndex: 7, startDay: 6, totalDays: 31 },
        { name: 'SEPTEMBER 2027', class: 'sep', year: 2027, monthIndex: 8, startDay: 2, totalDays: 30 }
    ];

    // Default agenda sampai Desember 2026
    const defaultAgendas = [
        { date: '2026-10-23', title: 'Sowan & Observasi TPA 4 Masjid', pj: 'Tim Sowan', type: 'Sowan / Observasi' },
        { date: '2026-11-06', title: 'Kajian Senja Kampus #1', pj: 'Husna & Diena', type: 'Kajian Senja' },
        { date: '2026-11-13', title: 'Islamic Content (Reels)', pj: 'Aviva & Wahab', type: 'Islamic Content (Video)' },
        { date: '2026-11-20', title: 'TKK Mengajar #1 (Fun Learning)', pj: 'Qisti', type: 'TKK Mengajar' },
        { date: '2026-11-27', title: 'Islamic Content (Feed)', pj: 'Aviva & Wahab', type: 'Islamic Content (Feed)' },
        { date: '2026-12-04', title: 'Kajian Senja Kampus #2', pj: 'Husna & Diena', type: 'Kajian Senja' },
        { date: '2026-12-11', title: 'Islamic Content (Reels)', pj: 'Aviva & Wahab', type: 'Islamic Content (Video)' },
        { date: '2026-12-18', title: 'TKK Mengajar #2', pj: 'Qisti', type: 'TKK Mengajar' },
        { date: '2026-12-25', title: 'Islamic Content (Feed)', pj: 'Aviva & Wahab', type: 'Islamic Content (Feed)' }
    ];

    let agendas = JSON.parse(localStorage.getItem('tkk_dynamic_agendas')) || defaultAgendas;

    function renderApp() {
        renderAgendasTable();
        renderCalendarGrid();
    }

    function renderAgendasTable() {
        agendaList.innerHTML = '';
        agendas.sort((a, b) => new Date(a.date) - new Date(b.date));

        if(agendas.length === 0) {
            agendaList.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada agenda tersimpan.</td></tr>`;
            return;
        }

        agendas.forEach((item, index) => {
            const tr = document.createElement('tr');
            const pjText = item.pj ? item.pj : '-';
            tr.innerHTML = `
                <td><strong>${item.date}</strong></td>
                <td>${item.title}</td>
                <td>${pjText}</td>
                <td><small style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">${item.type}</small></td>
                <td><button class="btn-del" onclick="deleteAgenda(${index})">Hapus</button></td>
            `;
            agendaList.appendChild(tr);
        });

        localStorage.setItem('tkk_dynamic_agendas', JSON.stringify(agendas));
    }

    function renderCalendarGrid() {
        calendarGridContainer.innerHTML = '';

        monthsData.forEach(m => {
            const monthCard = document.createElement('div');
            monthCard.className = 'month-card';

            // Header Bulan
            let headerHTML = `<div class="month-header" style="background: var(--primary-navy);">${m.name}</div>`;
            
            // Buat Matriks Tanggal
            let tableHTML = `<div class="calendar-table">
                <div class="day-name">Sn</div><div class="day-name">Sl</div><div class="day-name">Rb</div><div class="day-name">Km</div><div class="day-name">Jm</div><div class="day-name">Sb</div><div class="day-name sun">Mg</div>`;
            
            // Blank spaces untuk awal bulan
            for(let i = 0; i < m.startDay; i++) {
                tableHTML += `<div></div>`;
            }

            // Tanggal dalam bulan
            for(let d = 1; d <= m.totalDays; d++) {
                let formattedDay = String(d).padStart(2, '0');
                let formattedMonth = String(m.monthIndex + 1).padStart(2, '0');
                let dateString = `${m.year}-${formattedMonth}-${formattedDay}`;

                // Cek apakah tanggal ini ada agendanya
                let isHighlighted = agendas.some(ag => ag.date === dateString);
                let highlightClass = isHighlighted ? 'highlight-date' : '';
                let isSunday = (m.startDay + d - 1) % 7 === 6;
                let sunClass = isSunday ? 'sun' : '';

                tableHTML += `<div class="num ${sunClass} ${highlightClass}">${d}</div>`;
            }

            tableHTML += `</div>`;

            // Rincian Keterangan di Bawah Bulan
            let monthAgendas = agendas.filter(ag => {
                let agDate = new Date(ag.date);
                return agDate.getFullYear() === m.year && agDate.getMonth() === m.monthIndex;
            });

            let detailsHTML = `<div class="month-details"><h4>📌 Agenda:</h4>`;
            if(monthAgendas.length > 0) {
                detailsHTML += `<ul>`;
                monthAgendas.forEach(ag => {
                    detailsanh = `<li><span class="dot"></span> <strong>${ag.date.split('-')[2]}:</strong> ${ag.title}</li>`;
                    detailsHTML += detailsanh;
                });
                detailsHTML += `</ul>`;
            } else {
                detailsHTML += `<p style="color:#777; font-style:italic;">Tidak ada agenda di bulan ini.</p>`;
            }
            detailsHTML += `</div>`;

            monthCard.innerHTML = headerHTML + tableHTML + detailsHTML;
            calendarGridContainer.appendChild(monthCard);
        });
    }

    agendaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAgenda = {
            date: document.getElementById('agenda-date').value,
            title: document.getElementById('agenda-title').value,
            pj: document.getElementById('agenda-pj').value,
            type: document.getElementById('agenda-type').value
        };

        agendas.push(newAgenda);
        renderApp();
        agendaForm.reset();
    });

    window.deleteAgenda = function(index) {
        if(confirm('Yakin ingin menghapus agenda ini?')) {
            agendas.splice(index, 1);
            renderApp();
        }
    };

    renderApp();
});
