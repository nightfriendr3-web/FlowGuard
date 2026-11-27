// FlowGuard — navigasi prototipe antar-slide, kunci seleksi teks, dan logo.
// File ini dipakai oleh semua halaman di folder halaman/.
(function () {
  var FILES = {"1": "01-workspace-utama-idle-state", "2": "02-pre-session-cognitive-check-in", "3": "03-active-focus-session-flow-mode", "4": "04-micro-break-overlay-20-20-20", "5": "05-post-session-check-in", "6": "06-insights-dan-burnout-radar", "7": "07-perpustakaan-istirahat-break-library", "8": "08-pengaturan-dan-wellness-guardrails", "9": "09-pengaturan-sesi-adaptif", "10": "10-pengaturan-mode-konteks", "11": "11-pengaturan-profil-dan-persona", "12": "12-pengaturan-tampilan", "13": "13-pengaturan-notifikasi", "14": "14-pengaturan-soundscape", "15": "15-pengaturan-posture-check", "16": "16-pengaturan-motivasi", "17": "17-pengaturan-data-dan-privasi", "18": "18-pengaturan-bantuan", "19": "19-landing-login-flowguard", "20": "20-quick-onboarding-3-langkah", "21": "21-edit-profil-modal", "22": "22-panduan-relaksasi-mata-20-20-20", "23": "23-panduan-peregangan-leher-dan-bahu", "24": "24-panduan-box-breathing-4-4-4-4", "25": "25-panduan-peregangan-pergelangan-tangan", "26": "26-panduan-peregangan-punggung-dan-bahu", "27": "27-panduan-palming-mata"}; // nomor halaman -> nama file
  var here = (location.pathname.split("/").pop() || "").slice(0, 2);
  var page = parseInt(here, 10) || 0;

  function go(n) { if (FILES[n]) location.href = FILES[n] + ".html"; }
  function toast(msg) {
    var t = document.getElementById("fg-toast");
    if (!t) { t = document.createElement("div"); t.id = "fg-toast"; document.body.appendChild(t); }
    t.textContent = msg; t.className = "show";
    clearTimeout(t._h); t._h = setTimeout(function () { t.className = ""; }, 2600);
  }
  var SOON = "Fitur ini akan berfungsi setelah aplikasi dibangun dengan backend.";

  // [halaman (null = semua), pola teks tombol, tujuan (angka) atau fungsi]
  var RULES = [
    [null, /flowguard home/, 1],
    [null, /^home\s*home$/, 1],
    [null, /^bar_chart\s*insights$/, 6],
    [null, /^menu_book\s*istirahat$/, 7],
    [null, /^settings\s*pengaturan$/, 8],
    [null, /profil andi pratama/, 11],
    [null, /ganti tema/, 12],
    [null, /^notifikasi\s*notifications$/, 13],
    [null, /^music_note\s*preset/, 14],
    [null, /^shield\s*guardrails/, 8],
    [null, /^tune\s*sesi adaptif$/, 9],
    [null, /^auto_awesome\s*mode konteks/, 10],
    [null, /^person\s*profil & persona$/, 11],
    [null, /^palette\s*tampilan$/, 12],
    [null, /^notifications\s*notifikasi$/, 13],
    [null, /^graphic_eq\s*soundscape$/, 14],
    [null, /^accessibility_new\s*posture check$/, 15],
    [null, /^emoji_events\s*motivasi$/, 16],
    [null, /^database\s*data & privasi$/, 17],
    [null, /^help\s*bantuan$/, 18],
    [[1], /mulai sesi fokus/, 2],
    [[2], /mulai sesi fokus/, 3],
    [[2], /tutup check-in/, 1],
    [[3], /keluar flow/, 1],
    [[3], /lewati/, 4],
    [[3], /akhiri/, 5],
    [[3], /^pause\s*jeda$/, function () { toast("Timer dijeda (simulasi)."); }],
    [[4], /kembali fokus/, 3],
    [[4], /tunda/, function () { toast("Jeda ditunda 5 menit (simulasi)."); }],
    [[5], /lanjut sesi berikutnya/, 2],
    [[5], /akhiri hari kerja/, 6],
    [[5], /^tutup\s*close$/, 1],
    [[7], /mulai panduan/, function (el) {
      var all = [].slice.call(document.querySelectorAll("button")).filter(function (b) { return /mulai panduan/i.test(b.textContent); });
      go(22 + Math.max(0, all.indexOf(el)));
    }],
    [[11], /ganti avatar/, 21],
    [[12], /^mulai sesi$/, 2],
    [[19], /^masuk$|masuk dengan google|^daftar$|coba tanpa daftar/, 20],
    [[20], /lewati|lanjut/, 1],
    [[21], /tutup|batal|simpan perubahan/, 11],
    [[22, 23, 24, 25, 26, 27], /kembali ke perpustakaan|selesai/, 7]
  ];

  function labelOf(el) {
    return ((el.getAttribute("aria-label") || "") + " " + el.textContent).replace(/\s+/g, " ").trim().toLowerCase();
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("a, button, [role=button]");
    if (!el || el.closest("#fg-menu")) return;
    var label = labelOf(el);
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (r[0] && r[0].indexOf(page) < 0) continue;
      if (!r[1].test(label)) continue;
      e.preventDefault();
      typeof r[2] === "function" ? r[2](el) : go(r[2]);
      return;
    }
    if (el.tagName === "A" && (el.getAttribute("href") || "#") === "#") e.preventDefault();
    if (el.type === "submit") e.preventDefault();
    // Tombol pilihan (grup) -> tandai yang dipilih; tombol tunggal -> beri tahu
    var p = el.parentElement, group = p ? p.querySelectorAll(":scope > button") : [];
    if (el.tagName === "BUTTON" && group.length >= 2) {
      [].forEach.call(group, function (b) { b.classList.remove("fg-picked"); });
      el.classList.add("fg-picked");
    } else {
      toast(SOON);
    }
  }, true);

  // Enter di kolom isian (mis. "Tambah tugas baru") jangan memuat ulang halaman
  document.addEventListener("submit", function (e) { e.preventDefault(); toast(SOON); }, true);
  document.addEventListener("dragstart", function (e) { if (e.target.tagName === "IMG" || e.target.tagName === "A") e.preventDefault(); });

  function ready() {
    // Logo FlowGuard menggantikan ikon perisai bawaan Stitch
    [].forEach.call(document.querySelectorAll(".material-symbols-outlined"), function (s) {
      if (s.textContent.trim() !== "shield") return;
      var p = s.parentElement;
      var img = document.createElement("img");
      img.src = "../aset/logo-256.png"; img.alt = "FlowGuard"; img.className = "fg-logo";
      if (p.matches('a[aria-label*="FlowGuard"]')) {
        img.style.width = img.style.height = "34px";
        p.replaceChild(img, s);
        p.style.background = "transparent"; p.style.border = "0"; p.style.boxShadow = "none";
      } else if (p.nextElementSibling && /flowguard/i.test(p.nextElementSibling.textContent)) {
        img.style.width = img.style.height = "112px";
        p.parentElement.replaceChild(img, p);
      }
    });

    // Tombol menu daftar halaman
    var m = document.createElement("a");
    m.id = "fg-menu"; m.href = "../index.html"; m.setAttribute("aria-label", "Daftar semua halaman");
    m.innerHTML = '<span aria-hidden="true">&#9776;</span> Halaman';
    document.body.appendChild(m);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ready) : ready();
})();
