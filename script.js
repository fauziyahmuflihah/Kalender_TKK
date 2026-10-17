document.addEventListener('DOMContentLoaded', () => {
    const agendaForm = document.getElementById('agenda-form');
    const agendaList = document.getElementById('agenda-list');

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

    let agendas = JSON.parse(localStorage.getItem('tkk_fixed_agendas')) || defaultAgendas;

    function renderAgendas() {
        agendaList.innerHTML = '';
        agendas.sort((a, b) => new Date(a.date) - new Date(b.date));

        if(agendas.length === 0) {
            agendaList.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada agenda kustom. Silakan tambah di samping!</td></tr>`;
            return;
        }

        agendas.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.date}</strong></td>
                <td>${item.title}</td>
                <td>${item.pj}</td>
                <td><small style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">${item.type}</small></td>
                <td><button class="btn-del" onclick="deleteAgenda(${index})">Hapus</button></td>
            `;
            agendaList.appendChild(tr);
        });

        localStorage.setItem('tkk_fixed_agendas', JSON.stringify(agendas));
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
        renderAgendas();
        agendaForm.reset();
    });

    window.deleteAgenda = function(index) {
        if(confirm('Yakin mau menghapus agenda ini, dik?')) {
            agendas.splice(index, 1);
            renderAgendas();
        }
    };

    renderAgendas();
});