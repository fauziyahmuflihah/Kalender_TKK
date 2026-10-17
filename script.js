document.addEventListener('DOMContentLoaded', () => {
    const agendaForm = document.getElementById('agenda-form');
    const agendaList = document.getElementById('agenda-list');
    const calendarGridContainer = document.getElementById('calendar-grid-container');

    // Struktur 12 Bulan (Oktober 2026 - September 2027)
    const monthsData = [
        { name: 'OKTOBER 2026', year: 2026, monthIndex: 9, startDay: 3, totalDays: 31 },
        { name: 'NOVEMBER 2026', year: 2026, monthIndex: 10, startDay: 6, totalDays: 30 },
        { name: 'DESEMBER 2026', year: 2026, monthIndex: 11, startDay: 1, totalDays: 31 },
        { name: 'JANUARI 2027', year: 2027, monthIndex: 0, startDay: 4, totalDays: 31 },
        { name: 'FEBRUARI 2027', year: 2027, monthIndex: 1, startDay: 0, totalDays: 28 },
        { name: 'MARET 2027', year: 2027, monthIndex: 2, startDay: 0, totalDays: 31 },
        { name: 'APRIL 2027', year: 2027, monthIndex: 3, startDay: 3, totalDays: 30 },
        { name: 'MEI 2027', year: 2027, monthIndex: 4, startDay: 5, totalDays: 31 },
        { name: 'JUNI 2027', year: 2027, monthIndex: 5, startDay: 1, totalDays: 30 },
        { name: 'JULI 2027', year: 2027, monthIndex: 6, startDay: 3, totalDays: 31 },
        { name: 'AGUSTUS 2027', year: 2027, monthIndex: 7, startDay: 6, totalDays: 31 },
        { name: 'SEPTEMBER 2027', year: 2027, monthIndex: 8, startDay: 2, totalDays: 30 }
    ];

    // Data Awal Default
    const defaultAgendas = [
        { date: '2026-10-23', title: 'Sowan & Observasi TPA 4 Masjid', pj: 'Tim Sowan', type: 'Sowan / Observasi TPA' },
        { date: '2026-10-30', title: 'Islamic Content (Feed)', pj: 'Aviva & Wahab', type: 'Islamic Content (Feed)' },
        { date: '2026-11-06', title: 'Kajian Senja Kampus #1', pj: 'Husna & Diena', type: 'Kajian Senja Kampus' },
        { date: '2026-11-13', title: 'Islamic Content (Reels)', pj: 'Aviva & Wahab', type: 'Islamic Content (Video/Reels)' },
        { date: '2026-11-20', title: 'TKK Mengajar #1 (Fun Learning)', pj: 'Qisti', type: 'TKK Mengajar' },
        { date: '2026-11-27', title: 'Islamic Content (Feed)', pj: 'Aviva & Wahab', type: 'Islamic Content (Feed)' },
        { date: '2026-12-04', title: 'Kajian Senja Kampus #2', pj: 'Husna & Diena', type: 'Kajian Senja Kampus' },
        { date: '2026-12-11', title: 'Islamic Content (Reels)', pj: 'Aviva & Wahab', type: 'Islamic Content (Video/Reels)' },
        { date: '2026-12-18', title: 'TKK Mengajar #2', pj: 'Qisti', type: 'TKK Mengajar' },
        { date: '2026-12-25', title: 'Islamic Content (Feed)', pj: 'Aviva & Wahab', type: 'Islamic Content (Feed)' }
    ];

    let agendas = JSON.parse(localStorage.getItem('tkk_realtime_agendas')) || defaultAgendas;

    function renderApp() {
        renderAgendasTable();
        renderCalendarGrid();
    }

    function renderAgendasTable() {
        agendaList.innerHTML = '';
        agendas.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (agendas.length === 0) {
            agendaList.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada agenda tersimpan.</td></tr>`;
            return;
        }

        agendas.forEach((item, index) => {
            const tr = document.createElement('tr');
            const pjText = item.pj && item.pj.trim() !== '' ? item.pj : '-';
            tr.innerHTML = `
                <td><strong>${item.date}</strong></td>
                <td>${item.title}</td>
                <td>${pjText}</td>
                <td><small style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">${item.type}</small></td>
                <td><button class="btn-del" onclick="deleteAgenda(${index})">Hapus</button></td>
            `;
            agendaList.appendChild(tr);
        });

        localStorage.setItem('tkk_realtime_agendas', JSON.stringify(agendas));
    }

    function renderCalendarGrid() {
        calendarGridContainer.innerHTML = '';

        monthsData.forEach(m => {
            const monthCard = document.createElement('div');
            monthCard.className = 'month-card';

            let headerHTML = `<div class="month-header">${m.name}</div>`;
            
            let tableHTML = `<div class="calendar-table">
                <div class="day-name">Sn</div><div class="day-name">Sl</div><div class="day-name">Rb</div><div class="day-name">Km</div><div class="day-name">Jm</div><div class="day-name">Sb</div><div class="day-name sun">Mg</div>`;
            
            for (let i = 0; i < m.startDay; i++) {
                tableHTML += `<div></div>`;
            }

            for (let d = 1; d <= m.totalDays; d++) {
                let formattedDay = String(d).padStart(2, '0');
                let formattedMonth = String(m.monthIndex + 1).padStart(2, '0');
                let dateString = `${m.year}-${formattedMonth}-${formattedDay}`;

                let isHighlighted = agendas.some(ag => ag.date === dateString);
                let highlightClass = isHighlighted ? 'highlight-active' : '';
                let isSunday = (m.startDay + d - 1) % 7 === 6;
                let sunClass = isSunday ? 'sun' : '';

                tableHTML += `<div class="num ${sunClass} ${highlightClass}">${d}</div>`;
            }

            tableHTML += `</div>`;

            // Filter agenda khusus bulan ini
            let monthAgendas = agendas.filter(ag => {
                if (!ag.date) return false;
                let [agYear, agMonth] = ag.date.split('-');
                return parseInt(agYear) === m.year && parseInt(agMonth) === (m.monthIndex + 1);
            });

            let detailsHTML = `<div class="month-details"><h4>📌 Agenda:</h4>`;
            if (monthAgendas.length > 0) {
                detailsHTML += `<ul>`;
                monthAgendas.forEach(ag => {
                    let dayNum = parseInt(ag.date.split('-')[2]);
                    let pjDisplay = ag.pj && ag.pj.trim() !== '' ? ` (PJ: ${ag.pj})` : '';
                    detailsHTML += `<li><span class="dot"></span> <strong>Tgl ${dayNum}:</strong> ${ag.title}${pjDisplay}</li>`;
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
        if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
            agendas.splice(index, 1);
            renderApp();
        }
    };

    renderApp();
});
