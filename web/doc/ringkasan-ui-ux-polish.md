# RINGKASAN PERUBAHAN — UI/UX POLISH

> **Konteks:** Lanjutan dari `ringkasan-phase-0.md`. Dokumen ini mendokumentasikan
> perubahan UI/UX yang bertujuan meningkatkan kualitas visual dan pengalaman pengguna
> sesuai standar **Monozukuri** (craftsmanship) dari brief case study.

---

## DAFTAR ISI

1. [Konteks & Motivasi](#1-konteks--motivasi)
2. [Ringkasan Perubahan](#2-ringkasan-perubahan)
3. [Alasan & Dampak](#3-alasan--dampak)
4. [Manfaat untuk Pengguna](#4-manfaat-untuk-pengguna)

---

## 1. KONTEKS & MOTIVASI

Brief case study (Step 5, Monozukuri Implementation) menuntut:

> **"Polished UI/UX Interface:** Great visual taste, harmonious layout, handling all
> interaction states (loading, empty, error, partial, long text, and responsive views)
> using or extending the design system."

> **"Pride in Making (Monozukuri):** Deep care for the product, meticulous attention
> to detail, and a drive to craft software that feels complete and reliable."

Sebelum polish, frontend memiliki beberapa masalah:
- **Tidak ada custom font** — menggunakan browser default (terkesan template)
- **Login page plain** — tidak ada visual depth, tidak ada branding
- **Heading tidak konsisten** — 3 ukuran berbeda (text-xl, text-lg, text-2xl) di berbagai page
- **Tidak ada shared Breadcrumb** — 6+ pola berbeda untuk navigasi
- **Error states tidak konsisten** — 5 pola berbeda (banner, card, text, inline, silent)
- **Tidak ada 404 route** — path salah render blank page
- **Hardcoded `bg-white`** di 6 lokasi — dark mode broken
- **Tidak ada shared Alert/Empty State component** — setiap page build sendiri
- **Interview page raw HTML buttons** — bukan Button component, emoji bukan icon
- **Portfolio error unfriendly** — "Portfolio generation failed." tanpa penjelasan (rate limit, timeout, dll)

---

## 2. RINGKASAN PERUBAHAN

### P3.3 Custom Font — Inter

- **File:** `web/index.html`, `web/tailwind.config.js`, `web/src/index.css`
- **Apa:** Load **Inter** dari Google Fonts, set sebagai default font via Tailwind `fontFamily`.
- **Sebelum:** Browser default system font (times new roman / system-ui)
- **Sesudah:** Inter — clean, modern, excellent readability di semua size

### P3.4 Login Page Makeover

- **File:** `web/src/pages/auth/LoginPage.tsx`
- **Apa:**
  - Gradient background (`bg-gradient-to-br from-primary/5 via-background to-secondary/5`)
  - Card container (`border rounded-xl shadow-sm bg-card p-8`)
  - BrainCircuit icon dalam lingkaran primary
  - Placeholders di email + password inputs
  - Error menggunakan `Alert variant="danger"` (shared component)
  - Footer "AI Interview Platform"
- **Sebelum:** Plain white, no card, no icon, no visual depth
- **Sesudah:** Professional, branded, visually appealing

### P3.5 Standardize Page Headings

- **File:** `AssessmentInvitePage.tsx`, `LiveMonitorPage.tsx`, `PortfolioPage.tsx`, `TranscriptPage.tsx`, `FitGapReportPage.tsx`
- **Apa:** Semua page headings distandardisasi ke `text-xl font-semibold`
- **Sebelum:** 3 ukuran berbeda (text-xl, text-lg, text-2xl)
- **Sesudah:** Konsisten di semua page

### P3.6 Shared Breadcrumb Component

- **File:** `web/src/components/ui/breadcrumb.tsx` (new), 8 pages diupdate
- **Apa:** Component reusable untuk navigasi breadcrumb — di-adopt di:
  - `AssessmentNewPage`, `AssessmentEditPage`, `AssessmentInvitePage` (2 locations)
  - `VacancyNewPage`, `VacancyEditPage`
  - `LiveMonitorPage` (2 locations), `PortfolioPage` (2 locations)
  - `FitGapReportPage`, `TranscriptPage`
- **Sebelum:** 6+ pola berbeda (manual `<span>`, raw `/`, ArrowLeft icon)
- **Sesudah:** Satu component yang dipakai ulang di semua page

### P3.7 Standardize Error States

- **File:** Semua page dengan error states — sekarang pakai shared `Alert` component
- **Apa:** Semua error states distandardisasi ke `Alert` component dengan variants:
  - `Alert variant="danger"` — load errors, login errors, end session errors
  - `Alert variant="warning"` — portfolio generation failed (recoverable)
  - `Alert variant="info"` — reconnected prompt
- **Pages:** `PortfolioPage`, `FitGapReportPage`, `LiveMonitorPage`, `TranscriptPage`, `LoginPage`, `InterviewPage`, `VacancyListPage`, `AssessmentListPage`
- **Sebelum:** 5 pola berbeda (banner, card, text, inline, silent)
- **Sesudah:** Satu `Alert` component dengan semantic variants

### P3.8 404 Route

- **File:** `web/src/App.tsx`, `web/src/pages/NotFoundPage.tsx` (new)
- **Apa:** Catch-all route untuk path yang tidak dikenal
- **Sebelum:** Path salah render blank page
- **Sesudah:** "404 — Page not found" + link ke `/assessments`

### P3.9 Shared Alert Component

- **File:** `web/src/components/ui/alert.tsx` (new)
- **Apa:** Component reusable untuk banner notifikasi dengan 5 semantic variants:
  - `default` — neutral, untuk informasi umum
  - `success` — hijau, untuk operasi berhasil
  - `warning` — amber, untuk peringatan (rate limit, recoverable errors)
  - `danger` — merah, untuk error fatal
  - `info` — biru, untuk informasi tambahan
- **Sub-components:** `Alert`, `AlertIcon`, `AlertContent` — bisa dikombinasikan
- **Sebelum:** Setiap page build banner sendiri (inline styles, hardcoded colors)
- **Sesudah:** Satu component dengan design tokens yang konsisten

### P3.10 Shared Empty State Component

- **File:** `web/src/components/ui/empty-state.tsx` (new)
- **Apa:** Component reusable untuk menampilkan empty state (tidak ada data)
- **Props:** `icon`, `title`, `description`, `action` — semua optional
- **Default:** `FileX` icon + centered layout
- **Adopted di:** `VacancyListPage`, `AssessmentListPage`, `AssessmentInvitePage`
- **Sebelum:** Setiap page build empty state sendiri (hardcoded div + text)
- **Sesudah:** Satu component dengan layout yang konsisten

### P3.11 InterviewPage Polish

- **File:** `web/src/pages/interview/InterviewPage.tsx`
- **Apa:**
  - Emoji ✅ → `CheckCircle` Lucide icon (complete state)
  - Emoji ⚠️ → `AlertTriangle` Lucide icon (failed state)
  - Raw `<button>` → `<Button>` component (retry, refresh)
  - Hardcoded banners → `Alert` component (reconnecting, time warning, reconnected)
  - `bg-white` → `bg-background` (header + footer, dark mode fix)
- **Sebelum:** Emoji, raw HTML buttons, hardcoded colored banners
- **Sesudah:** Lucide icons, Button component, Alert component — consistent design system

### P3.12 bg-white Cleanup (Dark Mode Fix)

- **File:** `SkillCard.tsx`, `AssessorLayout.tsx`, `CandidateLayout.tsx`, `AssessmentInvitePage.tsx`, `InterviewPage.tsx`
- **Apa:** Ganti `bg-white` dengan `bg-background` atau `bg-card` di 5 lokasi
- **Sebelum:** `bg-white` hardcoded — dark mode broken (putih terang di dark theme)
- **Sesudah:** Menggunakan design tokens — dark mode berfungsi dengan benar
- **Catatan:** `HardwareCheck.tsx` tetap pakai `bg-white` karena itu decorative dot (bukan container bg)

### P3.13 Portfolio Rate Limit UX

- **File:** `web/src/pages/portfolio/PortfolioPage.tsx`
- **Apa:** Tampilkan `generation_error` dari API dengan pesan user-friendly:
  - Rate limit → "Busy right now — retrying automatically. Please wait a moment."
  - Timeout → "The request timed out. Please try again."
  - No content → "The AI did not return a result. Please try again."
  - Lainnya → tampilkan error asli
- **Helper:** `friendlyGenerationError(raw)` — translate pesan teknis ke bahasa user
- **Technical detail:** Ditampilkan kecil di bawah (untuk debugging, bisa dihide)
- **Sebelum:** "Portfolio generation failed." — hardcoded, tanpa penjelasan
- **Sesudah:** Pesan yang membantu user memahami situasi + tahu bahwa ini recoverable

---

## 3. ALASAN & DAMPAK

### 3.1 Mengapa Custom Font Penting

**Alasan:** Typography adalah salah satu elemen visual paling berpengaruh dalam UI. Browser default font (Times New Roman, system-ui) memberikan kesan "template" dan tidak profesional. Inter adalah font yang dipakai oleh Vercel, Linear, GitHub — platform yang terkenal dengan design quality.

**Dampak:**
- **Visual:** Aplikasi langsung terasa lebih modern dan profesional
- **Readability:** Inter dirancang khusus untuk screen, excellent di semua size
- **Brand consistency:** Font yang sama di semua halaman, tidak tergantung browser/OS user
- **Monozukuri:** Menunjukkan perhatian terhadap detail visual

### 3.2 Mengapa Login Page Perlu Makeover

**Alasan:** Login page adalah **halaman pertama** yang dilihat user. Kesan pertama menentukan persepsi terhadap seluruh aplikasi. Plain white tanpa branding = terkesan unfinished.

**Dampak:**
- **First impression:** User langsung merasa aplikasi ini "serius" dan "ready"
- **Branding:** Icon BrainCircuit + "AI Interview" = identity yang clear
- **Trust:** Card dengan shadow = depth = terkesan solid, bukan prototype
- **UX:** Gradient background = tidak plain, ada visual interest

### 3.3 Mengapa Heading Perlu Distandardisasi

**Alasan:** Inconsistent typography = tidak profesional. User beralih dari halaman ke halaman, heading size berubah-ubah = tidak predictabel.

**Dampak:**
- **Visual hierarchy:** Konsisten = user tahu apa yang penting
- **Professionalism:** Detail kecil yang menunjukkan craftsmanship
- **Maintainability:** Satu standar = mudah diubah nanti

### 3.4 Mengapa Breadcrumb Perlu Dibuat Shared Component

**Alasan:** 6+ pola berbeda untuk navigasi = code duplication + inconsistency. Setiap page build breadcrumb sendiri = waste time + bugs.

**Dampak:**
- **Code quality:** DRY principle, satu component dipakai ulang
- **Consistency:** User tahu cara navigasi karena pola yang sama
- **Maintainability:** Ubah sekali, berubah di semua page

### 3.5 Mengapa Error States Perlu Distandardisasi

**Alasan:** Error adalah momen krusial — user bingung, butuh bantuan. Kalau pola error berbeda-beda di setiap page = user tidak tahu harus apa.

**Dampak:**
- **UX:** User tahu cara recovery (tombol "Back" selalu ada)
- **Trust:** Error yang ditangani dengan baik = lebih trustworthy daripada blank page
- **Debugging:** Developer tahu harus melihat mana saat ada bug

### 3.6 Mengapa 404 Route Penting

**Alasan:** Tanpa catch-all route, path salah = blank page. User tidak tahu apa yang terjadi = frustration.

**Dampak:**
- **UX:** User tahu bahwa page tidak ada, bukan aplikasi error
- **Professionalism:** Detail kecil yang menunjukkan completeness
- **SEO/Accessibility:** Proper HTTP status handling

### 3.7 Mengapa Alert Component Penting

**Alasan:** Banner notifikasi (error, warning, info) dibutuhkan di banyak tempat. Tanpa shared component, setiap page build sendiri = inconsistent styling + code duplication.

**Dampak:**
- **Consistency:** Semua notifikasi terlihat sama, user tahu cara membacanya
- **Semantic meaning:** Variant (`danger`, `warning`, `info`) memberikan konteks visual
- **Maintainability:** Ubah sekali, berubah di semua page
- **Accessibility:** Role `alert` sudah built-in

### 3.8 Mengapa Empty State Component Penting

**Alasan:** Halaman tanpa data (list kosong) adalah momen yang sering diabaikan. Tanpa shared component, empty state dibangun berbeda-beda = inconsistent.

**Dampak:**
- **UX:** User tahu bahwa memang belum ada data (bukan error)
- **Onboarding:** Action button ("Create your first...") membantu user memulai
- **Visual consistency:** Semua empty state terlihat sama

### 3.9 Mengapa Portfolio Error Perlu Di-friendly-kan

**Alasan:** "Portfolio generation failed." adalah pesan yang menakutkan dan tidak membantu. User tidak tahu apakah ini error permanent, apakah bisa dicoba lagi, atau apakah ini masalah sementara (rate limit).

**Dampak:**
- **Trust:** User tahu bahwa ini situasi sementara, bukan aplikasi broken
- **Actionable:** User tahu harus apa (tunggu, coba lagi, atau hubungi admin)
- **Reduced support:** User tidak panic dan menghubungi support untuk hal yang sebenarnya recoverable

---

## 4. MANFAAT UNTUK PENGGUNA

### Untuk Assessor/Hiring Manager
- **Login page yang menarik** → kesan pertama positif
- **Font yang mudah dibaca** → nyaman membaca portfolio, transcript, fit-gap report
- **Breadcrumb yang konsisten** → mudah navigasi antar page
- **Error states yang jelas** → tahu harus apa saat ada error
- **Portfolio error yang friendly** → tidak panic saat rate limit, tahu ini recoverable

### Untuk Candidate
- **Interview page yang polished** → merasa dihargai, bukan "cuma test"
- **Loading states yang baik** → tidak bingung saat menunggu
- **Error handling yang jelas** → tahu kalau ada masalah, bukan blank screen
- **Connection lost handling** → tahu cara retry, bukan stuck

### Untuk Developer (Maintainability)
- **Shared components** → kurang code duplication (Alert, Breadcrumb, EmptyState)
- **Consistent patterns** → mudah add page baru
- **Design tokens** → mudah ubah warna/font nanti
- **Semantic variants** → error handling lebih expressif

---

*Dibuat: 17 Agu 2026. Diperbarui: 18 Agu 2026.*
