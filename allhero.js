function parseTanggalIndo(tanggal) {
  const bulanMap = { 'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11 };
  const [tgl, bulan, tahun] = tanggal.split(' ');
  return new Date(tahun, bulanMap[bulan], parseInt(tgl));
}
function toggleMenu() {
  const menu = document.getElementById('menu');
  if (!menu.classList.contains('show')) {
    // Masuk
    menu.style.display = 'block';
    setTimeout(() => menu.classList.add('show'), 10);
  } else {
    // Keluar
    menu.classList.remove('show');
    setTimeout(() => menu.style.display = 'none', 300);
  }
}
// Tutup menu kalau klik di luar menu/hamburger
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const hamburger = document.querySelector('.hamburger');
  
  if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      setTimeout(() => menu.style.display = 'none', 300);
    }
  }
});

function renderSkins(filter = '', page = 1) {
  const list = document.getElementById('skinList');
  const noResult = document.getElementById('noResult');
  list.innerHTML = '';
  filteredSkins = skins.filter(skin => skin.name.toLowerCase().includes(filter));
  const startIndex = (page - 1) * perPage;
  const pageSkins = filteredSkins.slice(startIndex, startIndex + perPage);

  if (pageSkins.length === 0) {
    noResult.style.display = 'block';
  } else {
    noResult.style.display = 'none';
    pageSkins.forEach((skin) => {
      const div = document.createElement('div');
      div.className = 'skin-card';
      div.innerHTML = `
        <a href="#" onclick="handleClick('${skin.link}', this.parentNode); return false;">
          <img src="${skin.img}" alt="${skin.name}" />
          <div style="font-size: 12px; color: #666; margin-top: 6px;">${skin.date}</div>
          <div style="color: black; font-weight: 400;">${skin.name}</div>
        </a>
        <div class="loading-popup">Tunggu sebentar ya...</div>
      `;
      list.appendChild(div);
    });
  }
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredSkins.length / perPage);
  pagination.innerHTML = '';

  const goToPage = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
  };

  const buttonRow = document.createElement('div');
  buttonRow.style.display = 'flex';
  buttonRow.style.justifyContent = 'center';
  buttonRow.style.flexWrap = 'wrap';
  buttonRow.style.gap = '6px';
  buttonRow.style.marginBottom = '10px';

  // Tombol ⏮️
  const first = document.createElement('span');
  first.textContent = '⏮️';
  if (currentPage === 1) {
    first.style.opacity = 0.4;
    first.style.cursor = 'not-allowed';
  } else {
    first.onclick = () => goToPage(1);
  }
  buttonRow.appendChild(first);

  // Tombol ◀️
  const prev = document.createElement('span');
  prev.textContent = '◀️';
  if (currentPage === 1) {
    prev.style.opacity = 0.4;
    prev.style.cursor = 'not-allowed';
  } else {
    prev.onclick = () => goToPage(currentPage - 1);
  }
  buttonRow.appendChild(prev);

  // Tombol Angka
  for (let i = 1; i <= totalPages; i++) {
    const span = document.createElement('span');
    span.textContent = i;
    if (i === currentPage) span.classList.add('active');
    span.onclick = () => goToPage(i);
    buttonRow.appendChild(span);
  }

  // Tombol ▶️
  const next = document.createElement('span');
  next.textContent = '▶️';
  if (currentPage === totalPages) {
    next.style.opacity = 0.4;
    next.style.cursor = 'not-allowed';
  } else {
    next.onclick = () => goToPage(currentPage + 1);
  }
  buttonRow.appendChild(next);

  // Tombol ⏭️
  const last = document.createElement('span');
  last.textContent = '⏭️';
  if (currentPage === totalPages) {
    last.style.opacity = 0.4;
    last.style.cursor = 'not-allowed';
  } else {
    last.onclick = () => goToPage(totalPages);
  }
  buttonRow.appendChild(last);

  // Append tombol baris atas
  pagination.appendChild(buttonRow);

  // Form pencarian halaman manual
  const inputRow = document.createElement('div');
  inputRow.style.display = 'flex';
  inputRow.style.justifyContent = 'center';
  inputRow.style.alignItems = 'center';
  inputRow.style.gap = '8px';
  inputRow.style.marginTop = '15px';

  const pageInput = document.createElement('input');
  pageInput.type = 'number';
  pageInput.min = 1;
  pageInput.max = totalPages;
  pageInput.placeholder = 'Cari halaman...';
  pageInput.style.padding = '4px 8px';
  pageInput.style.width = '100px';
  pageInput.style.border = '1px solid #ccc';
  pageInput.style.borderRadius = '4px';

  const goBtn = document.createElement('button');
  goBtn.textContent = '➜';
  goBtn.style.padding = '4px 8px';
  goBtn.style.border = 'none';
  goBtn.style.backgroundColor = '#1E90FF';
  goBtn.style.color = 'white';
  goBtn.style.borderRadius = '4px';
  goBtn.style.cursor = 'pointer';

  goBtn.onclick = () => {
    const pageVal = parseInt(pageInput.value);
    if (!isNaN(pageVal) && pageVal >= 1 && pageVal <= totalPages) {
      goToPage(pageVal);
    } else {
      alert('Halaman tidak valid!');
    }
  };

  inputRow.appendChild(pageInput);
  inputRow.appendChild(goBtn);
  pagination.appendChild(inputRow);
}

function handleSearch() {
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  renderSkins(input, 1);
  renderPagination();
}
function handleKeyPress(e) {
  if (e.key === 'Enter') handleSearch();
}
function handleClick(link, el) {
  if (el) el.classList.add('clicked');
  setTimeout(() => window.location.href = link, 800);
}
document.addEventListener('DOMContentLoaded', () => {
  skins.sort((a, b) => parseTanggalIndo(b.date) - parseTanggalIndo(a.date));
  filteredSkins = [...skins];
  renderSkins('', currentPage);
  renderPagination();
});
