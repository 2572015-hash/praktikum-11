$(document).ready(function () {

    $('#btnTambah').on('click', function () {
    var isiInput = $('#taskInput').val().trim();

    if (isiInput == '') {
        alert('Tugas tidak boleh kosong!');
        return;
    }

    var liBaru = '<li>';
    liBaru += '<span class="task-text">' + isiInput + '</span>';
    liBaru += '<div>';
    liBaru += '<button class="btn-done">Selesai</button>';
    liBaru += '<button class="btn-edit">Edit</button>';
    liBaru += '</div>';
    liBaru += '</li>';

    $('#taskList').append(liBaru);
    $('#taskInput').val('');
    });

    $(document).on('click', '.btn-done', function () {
    var li = $(this).closest('li');
    var namaTugas = li.find('.task-text').text();

    var rowBaru = '<tr>';
    rowBaru += '<td class="tercoret">' + namaTugas + '</td>';
    rowBaru += '<td><button class="btn-delete">Hapus</button></td>';
    rowBaru += '</tr>';

    $('#completedTable tbody').append(rowBaru);
    li.remove();
    });

    $(document).on('click', '.btn-edit', function () {
    var li = $(this).closest('li');
    var spanTeks = li.find('.task-text');
    var teksLama = spanTeks.text();

    var inputEdit = $('<input type="text" class="edit-input" maxlength="20">');
    inputEdit.val(teksLama);
    spanTeks.replaceWith(inputEdit);
    inputEdit.focus();

    $(this).replaceWith('<button class="btn-submit">Simpan</button>');
    });

    $(document).on('click', '.btn-submit', function () {
    var li = $(this).closest('li');
    var inputEdit = li.find('.edit-input');
    var teksBaru = inputEdit.val().trim();

    if (teksBaru == '') {
        alert('Tugas tidak boleh kosong!');
        return;
    }

    var spanBaru = $('<span class="task-text"></span>');
    spanBaru.text(teksBaru);
    inputEdit.replaceWith(spanBaru);

    $(this).replaceWith('<button class="btn-edit">Edit</button>');
    });

    $(document).on('click', '.btn-delete', function () {
    var baris = $(this).closest('tr');
    baris.remove();
    });

});