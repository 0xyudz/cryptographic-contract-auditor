# Demo Video & Pitch Guide

This guide provides a detailed storyboard and script for your hackathon submission video. Follow these steps to showcase the technical quality and practical use case of the `@pharos/cryptographic-contract-auditor` package.

---

## 📹 Video Outline (Target Duration: 3 Minutes)

### Section 1: Intro & The Pitch (0:00 - 0:45)
*   **Aksi Layar**: Tampilkan halaman awal repositori GitHub Anda (menampilkan berkas `README.md` dan struktur folder).
*   **Naskah Pembicaraan**:
    > *"Halo para juri. Nama saya [Nama Anda], dan hari ini saya mendemokan `@pharos/cryptographic-contract-auditor` — pemindai keamanan bytecode pintar untuk ekosistem AI Agent Pharos.*
    > 
    > *Mengapa ini penting? Di jaringan Pharos, AI Agent bertransaksi secara otonom. Jika agen berinteraksi dengan smart contract jahat yang memiliki fungsi merusak (seperti SELFDESTRUCT), dana agen bisa hilang seketika.*
    > 
    > *Sistem audit tradisional terlalu lambat, dan LLM sering berhalusinasi saat membaca bytecode. Kami memecahkan ini dengan membangun analisis opcode deterministik yang sangat cepat (off-chain, 0 gas) serta disegel menggunakan tanda tangan kriptografis tepercaya (Cryptographic Attestation)."*

### Section 2: Technical Deep Dive & Clean Architecture (0:45 - 1:30)
*   **Aksi Layar**: Buka VS Code / Editor Anda. Tampilkan folder `src/domain/` dan `src/agent/index.ts`.
*   **Naskah Pembicaraan**:
    > *"Mari kita lihat kodenya. Kami merancang proyek ini menggunakan **Clean Architecture**.*
    > 
    > *Di tingkat terdalam, kami memiliki **Domain Layer** yang murni bebas dependensi (Zero NPM Dependencies). Ini memastikan integritas kode dan meminimalkan celah supply chain attack.*
    > 
    > *Di lapisan luar, kami memiliki integrasi **Pharos Agent Kit**. Di file `src/agent/index.ts`, agen inisialisasi koneksi `viem` ke Pharos Testnet RPC untuk menarik runtime bytecode secara langsung dari blockchain.*
    > 
    > *Untuk fleksibilitas, skill kami mendukung **Dual-Compatibility**: diekspor sebagai Tool programmatic, adaptor LangChain Tool, Action berbasis skema Zod, serta perintah CLI Pharos Skill Engine."*

### Section 3: Menjalankan Unit Tests (1:30 - 2:00)
*   **Aksi Layar**: Buka terminal dan jalankan perintah:
    ```bash
    npm test
    ```
*   **Naskah Pembicaraan**:
    > *"Keandalan adalah kunci utama. Kami memiliki pengujian ketat menggunakan Vitest. Di layar, saya menjalankan seluruh suite pengujian sebanyak 55 tests. Tes ini memvalidasi alamat EVM, kalkulasi skor risiko secara dinamis, kecocokan pola biner opcodes, dan parser keluaran JSON LangChain. Semua 55 tes lulus dengan sempurna."*

### Section 4: Live E2E Agent Demo (2:00 - 2:45)
*   **Aksi Layar**: Jalankan perintah demo agen di terminal:
    ```bash
    npx tsx examples/agent-demo.ts
    ```
*   **Naskah Pembicaraan**:
    > *"Sekarang mari kita lihat demo integrasi agen secara langsung.*
    > 
    > *Di sini, Sentinel AI Agent mensimulasikan dua kasus transaksi DeFi:*
    > 
    > *Kasus 1: Agen mengaudit target kontrak berbahaya (`0x...9999`). Sistem kami menarik bytecode-nya, dan Heuristic Engine mendeteksi adanya opcode SELFDESTRUCT dan DELEGATECALL. Skor risikonya adalah 75/100 (HIGH). Agen secara otomatis memutuskan untuk MEMBATALKAN (`ABORT`) transaksi demi keamanan.*
    > 
    > *Kasus 2: Agen mengaudit alamat kontrak aman (`0x...0001`). Skor risiko adalah 0 (SECURE), dan agen memutuskan SAFE untuk melanjutkan transaksi.*
    > 
    > *Kedua hasil audit ini disegel menggunakan tanda tangan hash kriptografis yang diverifikasi langsung secara on-chain."*

### Section 5: Kesimpulan & Visi Masa Depan (2:45 - 3:00)
*   **Aksi Layar**: Tampilkan kembali halaman repositori GitHub / Slide penutup.
*   **Naskah Pembicaraan**:
    > *"Dengan `@pharos/cryptographic-contract-auditor`, pengembang Pharos kini memiliki infrastruktur keamanan tangguh yang menjamin transaksi AI Agent bebas dari eksploitasi kode berbahaya secara tepercaya dan dapat dibuktikan. Terima kasih!"*
