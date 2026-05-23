var VALID_NAMA = "budi";
var VALID_PIN = "1234";
var activeFilter = "semua";

function showToast(msg) {
    $('#toastMsg').text(msg).stop(true).hide().fadeIn(300).delay(1600).fadeOut(400);
}

function formatDate(ts) {
    var d = new Date(ts);
    var jam = d.getHours().toString().padStart(2, '0');
    var menit = d.getMinutes().toString().padStart(2, '0');
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + jam + ':' + menit;
}

function getBadgeClass(kat) {
    if (kat == 'kerja') return 'badge-kerja';
    if (kat == 'pribadi') return 'badge-pribadi';
    if (kat == 'ide') return 'badge-ide';
    if (kat == 'penting') return 'badge-penting';
    return '';
}

function getNotes() {
    var data = localStorage.getItem("catatanList");
    if (data != null) {
    return JSON.parse(data);
    } else {
    return [];
    }
}

function saveNotes(arr) {
    localStorage.setItem("catatanList", JSON.stringify(arr));
}

function renderNotes() {
    var notes = getNotes();

    notes.sort(function(a, b) {
    return b.pinned - a.pinned;
    });

    var filtered = [];
    if (activeFilter == 'semua') {
    filtered = notes;
    } else {
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].kategori == activeFilter) {
        filtered.push(notes[i]);
        }
    }
    }

    $('#noteList').empty();
    $('#statsText').text('Menampilkan ' + filtered.length + ' dari ' + notes.length + ' catatan');

    if (filtered.length == 0) {
    $('#noteList').append('<p class="empty-msg">Belum ada catatan.</p>');
    return;
    }

    for (var j = 0; j < filtered.length; j++) {
    var n = filtered[j];

    var pinnedHTML = '';
    if (n.pinned == true) {
        pinnedHTML = '<span class="pinned-label">📌 Disematkan</span>';
    }

    var cardHTML = '<div class="note-card" data-id="' + n.id + '">';
    cardHTML += '<div class="note-header">';
    cardHTML += '<span class="note-title">' + n.judul + '</span>';
    cardHTML += '<div class="note-actions">';
    cardHTML += '<button class="btn-pin">📌 Pin</button>';
    cardHTML += '<button class="btn-hapus">Hapus</button>';
    cardHTML += '</div></div>';
    cardHTML += '<div class="note-body">' + n.isi + '</div>';
    cardHTML += '<div class="note-footer">';
    cardHTML += '<span class="badge ' + getBadgeClass(n.kategori) + '">' + n.kategori + '</span>';
    cardHTML += '<span class="note-date">' + formatDate(n.timestamp) + '</span>';
    cardHTML += pinnedHTML;
    cardHTML += '</div></div>';

    $('#noteList').append(cardHTML);
    }
}

$(document).ready(function () {

    var cekLogin = localStorage.getItem("namaUser");
    if (cekLogin != null) {
    $('#loginPage').hide();
    $('#appPage').show();
    $('#namaUser').text('Halo, ' + cekLogin + '!');
    renderNotes();
    }

    $('#btnMasuk').on('click', function () {
    var nama = $('#inputNama').val().toLowerCase().trim();
    var pin = $('#inputPin').val();

    if (nama == VALID_NAMA && pin == VALID_PIN) {
        localStorage.setItem("namaUser", nama);
        $('#loginPage').hide();
        $('#appPage').show();
        $('#namaUser').text('Halo, ' + nama + '!');
        $('#loginError').hide();
        renderNotes();
    } else {
        $('#loginError').show();
    }
    });

    $('#btnLogout').on('click', function () {
    localStorage.removeItem("namaUser");
    location.replace(location.href);
    });

    $('#btnSimpan').on('click', function () {
    var judul = $('#inputJudul').val().trim();
    var isi = $('#inputIsi').val().trim();
    var kat = $('#selectKategori').val();

    if (judul == '' || isi == '') {
        showToast('Judul dan isi tidak boleh kosong!');
        return;
    }

    var notes = getNotes();

    var catatan = {
        id: Date.now(),
        judul: judul,
        isi: isi,
        kategori: kat,
        timestamp: Date.now(),
        pinned: false
    };

    notes.unshift(catatan);
    saveNotes(notes);

    $('#inputJudul').val('');
    $('#inputIsi').val('');
    showToast('Catatan berhasil disimpan!');
    renderNotes();
    });

    $(document).on('click', '.filter-btn', function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    activeFilter = $(this).data('filter');
    renderNotes();
    });

    $(document).on('click', '.btn-hapus', function () {
    var id = parseInt($(this).closest('.note-card').data('id'));
    var notes = getNotes();
    var baru = [];
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id != id) {
        baru.push(notes[i]);
        }
    }
    saveNotes(baru);
    showToast('Catatan dihapus.');
    renderNotes();
    });

    $(document).on('click', '.btn-pin', function () {
    var id = parseInt($(this).closest('.note-card').data('id'));
    var notes = getNotes();
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
        if (notes[i].pinned == true) {
            notes[i].pinned = false;
        } else {
            notes[i].pinned = true;
        }
        }
    }
    saveNotes(notes);
    renderNotes();
    });

});