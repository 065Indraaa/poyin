import { useState } from 'react';
import { useLang } from '../context/LanguageContext';

// ─── DATA ─────────────────────────────────────────────────────────────
const SPACES_DATA = {
  id: [
    {
      id: 'space-0',
      date: '11 Maret 2026',
      xLink: 'https://x.com/i/spaces/1yxBeMvqddEJN?s=20',
      title: 'Rahasia Trading & Kisah Hidup Ray Ponyin: Dari Warnet Jadi Pro Trader',
      desc: 'Ngobrolin trik pisahin wallet, manajemen portofolio super aman ala miliarder, sampai bongkar masa lalu Bang Ray dari jaga rental PS.',
      tag: 'Portofolio · Story',
      insights: [
        {
          num: '1',
          title: 'Seni Menyiksa Diri Pakai "Challenge Wallet"',
          body: 'Buat menghindari penyakit gatel mencet Buy (<em>overtrade</em>), Bang Ray mewajibkan pemisahan antara <strong>Main Wallet</strong> dan <strong>Challenge Wallet</strong>.<br/><br/><strong>Logikanya:</strong> Taruh saldo super tipis di Challenge Wallet. Pas saldo mepet, insting bertahan hidupmu bakal menyala. Kamu otomatis jadi jauh lebih tajam dan kejam saat milih koin karena takut modal recehmu beneran ludes kena rug!',
        },
        {
          num: '2',
          title: 'Awas Tool Bodong di TikTok & Wallet Kena Kuras',
          body: 'Jangan gampang ngiler lihat <em>tools</em> kripto ajaib yang dipamerin di TikTok! Bang Ray ngingetin kalau bikin alat buat nge-rug itu nggak sembarangan.<br/><br/><strong>Aturan Besi:</strong> Kalau dompetmu pernah asal "Connect" ke web/aplikasi scam, SECEPATNYA pindahin sisa koin ke wallet baru. Scammer itu pintar, mereka sering sabar nunggu saldomu gendut dulu baru disedot sampai kering seketika.',
        },
        {
          num: '3',
          title: 'Nostalgia Perjuangan: Dari Operator Warnet ke Blockchain',
          body: 'Sukses itu nggak instan. Bang Ray cerita gila-gilaan soal masa lalunya yang merangkak dari bawah banget.<br/><br/>Dari jaga rental PS waktu SD, nyambi jadi <strong>operator warnet</strong> pas SMP cuma biar bisa main komputer gratisan. Dia bahkan kenal Bitcoin pas eranya masih dipakai buat beli <em>cash game online</em>! Dari situ insting teknologinya terasah sampai sekarang mahir bermanuver di Solana, Base, hingga TON.',
        },
        {
          num: '4',
          title: 'Formasi Portofolio Anti-Miskin (No Uang Panas!)',
          body: '<strong>Haram hukumnya trading pakai Uang Panas!</strong> (uang kos, uang susu, dll). Manajemen portofolio asli Bang Ray ini bikin kaget karena super aman.<br/><br/><strong>Rahasianya:</strong> Cuma <strong>1%</strong> nyawa buat judi di Memecoin. Sisanya? <strong>70%</strong> tidur tenang di Koin Spot (BTC/SOL dll), <strong>20%</strong> ditaruh di obligasi SBN negara, dan <strong>5%</strong> jadi Emas murni. Jangan cuma nafsu cari kaya dadakan tanpa mikir sabuk pengaman!',
        },
        {
          num: '5',
          title: 'Gimana Sih Cara Jadi Developer Token yang Sukses?',
          body: 'Mau bikin token sendiri? Jangan harap laku kalau akun developermu masih bau kencur.<br/><br/>Bang Ray bilang, kamu harus ngebangun <strong>Reputasi Akun Dev</strong> biar pelacak bot dan publik percaya. Selain itu, cari tim yang emang jujur dan pantau terus narasi (<em>meta</em>) apa yang lagi hype. Tujuannya simpel: buat tokenmu tembus tahap <em>bonding</em> sampai punya kolam likuiditas permanen!',
        },
        {
          num: '6',
          title: 'Berburu RUG, Bukan Terbang ke Bulan',
          body: 'Fakta keras: Sejago apapun analisismu, kamu <strong>Nggak Bakal Bisa Menebak 100%</strong> mana koin yang pasti bakal <em>Runner</em> gila-gilaan.<br/><br/><strong>Mindsetnya dibalik:</strong> Fokus pelajari ciri-ciri koin RUG (scam) sampai khatam. Begitu kamu jago ngehindarin koin sampah, secara otomatis rasio koin yang tersisa di tanganmu berpeluang jadi <em>runner</em>. Hoki itu akan datang sendiri kalau kamu selamat dari ranjau!',
        },
      ],
    },
    {
      id: 'space-1',
      date: '18 Maret 2026',
      xLink: 'https://x.com/i/spaces/1qGvvkmVpvpGB?s=20',
      title: 'Bongkar Rahasia Multi-Wallet & Strategi Trading Memecoin',
      desc: 'Ngobrolin dapur strategi multi-wallet, trik milih koin micin yang bener, dan bahayanya kalau cuma ngintip wallet paus tanpa mikir.',
      tag: 'Multi-Wallet · Strategi',
      insights: [
        {
          num: '1',
          title: 'Cara Milih Koin Micin Biar Gak Kena Jebakan Developer',
          body: 'Banyak banget developer nakal yang sengaja <strong>"farming"</strong>—alias buang barang pas harga koinnya lagi naik daun.<br/><br/><strong>Kunci utamanya:</strong> Jangan malas ngecek rekam jejak developernya! Pastikan mereka emang beneran niat bangun project-nya secara organik, bukan cuma numpang lewat buat ngeruk duit retail.',
        },
        {
          num: '2',
          title: 'Rahasia Gelap Multi-Wallet Para Influencer',
          body: 'Tahu nggak? Top influencer atau <em>Crypto Twitter (CT)</em> rata-rata main pakai banyak wallet. Mereka bakal serok koin pelan-pelan pakai <strong>wallet rahasia (side ID)</strong>.<br/><br/>Nah, sesudah muatannya penuh, baru deh mereka teriak <em>"call"</em> di akun utamanya. Pas harga nge-pump berjamaah, mereka senyum sambil jualan pelan-pelan dari wallet rahasianya. <br/><strong>Tips buat kamu:</strong> Intip transaksi gede yang anehnya masuk 5 menit SEBELUM si influencer nge-post!',
        },
        {
          num: '3',
          title: 'Strategi Nyicil (DCA) Jenius Pakai Banyak Wallet',
          body: 'Punya banyak dompet crypto itu gak harus buat nipu kok, malah bagus buat atur keuanganmu.<br/><br/>Kalau modal tembus di atas <strong>5 SOL</strong>, mending bagi-bagi peluru. Cobain <em>Dollar Cost Averaging (DCA)</em> pakai wallet yang beda-beda. Trik ini terbukti <strong>10–20% lebih ngefek</strong> buat nurunin modal rata-ratamu ketimbang cuma nge-spam tombol beli di satu dompet.',
        },
        {
          num: '4',
          title: 'Awas, Jangan Asal Nge-kor Wallet Whale!',
          body: 'Paus (Whales) main dengan dana tak berseri. Mereka bisa aja rugi <strong>50 SOL</strong> sehari tapi tetep bisa nongkrong asik.<br/><br/>Kalau kamu cuma ikutan <em>copy-trade</em> tanpa paham nalar mereka, siap-siap aja nyangkut. Ingat, ketahanan mental dan <strong>kedalaman kantongmu</strong> itu beda jauh sama mereka. Jangan dipaksa!',
        },
        {
          num: '5',
          title: 'Cari Karakter Tradingmu Sendiri, Jangan Cuma Nunggu Suapan',
          body: 'Mulai sekarang, kurangi kebiasaan mantengin layar cuma nungguin sinyal atau "call" dari orang lain. Bangun <strong>gaya tradingmu sendiri</strong>!<br/><br/>Kalau kamu ngerasa nyaman dan cuan konstan di satu trik, <strong>kunci lalu asah terus skill itu</strong>. Gak usah gampang FOMO gonta-ganti gaya, biar ilmu dan instingmu gak balik ke level satu lagi.',
        },
      ],
    },
    {
      id: 'space-2',
      date: '18 Maret 2026',
      xLink: 'https://x.com/i/spaces/1qxoNezjdmjJv?s=20',
      title: 'Tips Jitu Trading Crypto & Cara Menemukan Gaya Tradingmu ala Bang Ponyin',
      desc: 'Dari curhat soal gaya trading, ngebahas Kabal Play, sampai pentingnya nyatet performa di Excel. Daging semua!',
      tag: 'Trading Style · Kabal',
      insights: [
        {
          num: '1',
          title: 'Nyari Jati Diri (Trading Style) di Crypto',
          body: 'Saran tulus dari Bang Ponyin: Perbanyak jam terbang, tapi <strong>jangan bakar semua tabunganmu</strong>. Cukup siapin dana receh khusus sebagai "uang sekolah".<br/><br/><strong>Satu hal yang wajib:</strong> Catat terus untung-rugimu di Excel. Nanti bakal kelihatan tuh, kamu nyangkutnya sering di koin apa, dan cuannya meluber di koin model apa (misal meme kucing atau politik). Tekuni aja yang emang bikin kamu cuan santai.',
        },
        {
          num: '2',
          title: 'Kenapa Kadang Berani Masuk Koin yang Baunya "RUG"?',
          body: 'Selamat datang di dunia <strong>"Kabal Play"</strong>. Di area abu-abu ini, indikator teknikal udah nggak mempan lagi.<br/><br/>Yang paling dicari cuma satu: <strong>Jejak dompet orang-orang sakti</strong>. Kalau ada afiliasi grup solid atau *developer* yang dompetnya ke-track sering untung, meskipun koinnya kelihatan ngeri, *data on-chain* itu yang jadi pelampung keselamatanmu.',
        },
        {
          num: '3',
          title: 'Fokus Hindari Jebakan, Bukan Cuma Ngejar Terbang',
          body: 'Pusing tiap hari nebak koin mana yang bakal terbang ke bulan? Mending geser pola pikirmu. Fokus aja belajar <strong>gimana cara mengenali ciri-ciri koin RUG (penipuan)</strong>.<br/><br/>Logikanya sederhana: Kalau kamu makin jago hindarin koin bodong, sisa koin di pilihanmu otomatis punya probabilitas terbang lebih besar. Sisanya? Biar nasib yang tentukan!',
        },
        {
          num: '4',
          title: 'Apa Sih "Kabal" Itu Sebenarnya?',
          body: 'Sering dengar kata "Kabal"? Santai, itu cuma sebutan keren buat <strong>grup privat atau sirkel yang punya dana patungan super jumbo</strong> plus kenalan orang-orang penting.<br/><br/>Mereka bisa dengan gampang nyuntik dana buat bikin chart meroket. Makanya di dunia koin micin ini, <em>"Tahu siapa bandar di balik koinnya"</em> seringkali jauh lebih berharga daripada semalaman mantengin chart.',
        },
        {
          num: '5',
          title: 'Konsistensi Itu Datangnya dari Excel!',
          body: 'Rahasia terbesar trader pro? <strong>Disiplin nyatet!</strong> Lihat kembali di kalendermu, apa yang bikin dompet berdarah dan mana yang bikin hijau.<br/><br/>Prinsip dasar: <strong>"Mending aman daripada nangis belakangan"</strong>. Pas cuan gede, buang jauh-jauh rasa sombongmu. Segera amankan uang modalmu, perlakukan sisanya murni sebagai bonus main.',
        },
      ],
    },
    {
      id: 'space-3',
      date: '19 Maret 2026',
      xLink: 'https://x.com/i/spaces/1pJkOybvgOrJj?s=20',
      title: 'Rahasia Trading Koin Micin: Strategi, Psikologi, dan Analisis Ala Mas Ponyin',
      desc: 'Bahas santai soal taktik keluar (exit) pas bawa duit banyak, tips nyicil 3-dip biar gak rungkad, sampe urusan bot vs orang beneran.',
      tag: 'Psikologi · Analisis',
      insights: [
        {
          num: '1',
          title: 'Cara Jualan Biar Harga Gak Hancur (Size Play)',
          body: 'Lagi bawa duit gede? Cara jual (exit) kamu wajib banget disesuaikan sama <strong>ketebalan uang (likuiditas)</strong> si koin. Kolam yang airnya banyak nggak bakal surut cuma gara-gara kamu serok pakai gayung.<br/><br/><strong>Trik kotornya:</strong> Pakai momen rilis "Berita Hype" buat ajang jualanmu. Waktu orang pada fomo mau beli, di situlah kamu pelan-pelan nyicil jualan (<em>DCA Out</em>). Ingat, bensin euforia itu cepat banget habis!',
        },
        {
          num: '2',
          title: 'Jurus 3-Dip Biar Masuk Koin Lebih Tenang',
          body: 'Gini cara nyicil asik pas mau masuk koin yang volumenya meledak:<br/>• <strong>Cipratan 1:</strong> Pantau aja, kalem.<br/>• <strong>Cipratan 2:</strong> Lempar receh (misal 0.1 SOL) sekadar pasang alat pelacak, intip gimana kelakuan gas fee dan gerak-gerik holdernya.<br/>• <strong>Cipratan 3:</strong> Begitu grafik beneran konfirmasi naik kuat, baru buang modal gedenya! Anggap aja ini sabuk pengamanmu dari developer yang kabur mendadak.',
        },
        {
          num: '3',
          title: 'Ngintil Smart Wallet & Orang Dalam (Insider)',
          body: 'Jangan terlalu polos ngandelin akun raksasa di Twitter; mereka kebanyakan cuma cari mangsa retail. Mending cari akun-akun dewa yang sepi pengikut tapi kasih info gila.<br/><br/><strong>Cara melacak:</strong> Cobain cek aktivitas 5-10 menit sebelum akun itu cuap-cuap, lacak adakah dompet yang udah "ngetem" duluan. Oh ya awas! Orang dalam yang terlalu pintar kadang sengaja bakar duit beli "koin buangan" biar <em>winrate</em> asli mereka di blockchain kelihatan buruk dan gak diawasin.',
        },
        {
          num: '4',
          title: 'Mending Solana Atau Base?',
          body: '<strong>Solana</strong> itu kayak sirkuit balap liar; bikin koin segampang kedip mata (Pump.fun) dan putaran duitnya kencang banget.<br/><strong>Base</strong> berasa ngejalanin restoran *fine dining*; pergerakannya lambat tapi uang yang ngendap jumlahnya tebel parah.<br/>Intinya: <strong>Tinggalin rasa fanatik asumu sama satu ekosistem!</strong> Kejar aja ke mana uang lagi banyak-banyaknya ngalir.',
        },
        {
          num: '5',
          title: 'Jaga Mentalku, Amankan Cuan! (Psikologi)',
          body: 'Menang banyak di koin micin itu bukan adu pinter baca grafik, tapi murni adu <strong>ngendaliin hawa nafsu (greed) & gengsi</strong>!<br/><br/>Coba tempel foto target aslimu, misal "Beliin Motor Ortu". Itu jadi rem paling pakem biar ketikan jarimu nggak liar beli koin fomo. Sukses di sini itu artinya kamu <em>masih bisa napas 10 tahun lagi</em>, bukan sekadar hoki menang undian hari ini doang.',
        },
        {
          num: '6',
          title: 'Deteksi "Global Fee" & Bot Manipulasi',
          body: '<strong>Global Fee itu bosnya matriks.</strong> Kalau biaya fee-nya loncat, artinya koin itu beneran laku keras atau emang ada "perang bot" yang brutal di dalamnya.<br/>Nah, kita harus cukup pintar bedain mana <strong>Volume Orang Asli</strong> dan mana <strong>"Volume Robot"</strong> buatan Dev, fungsinya biar nggak ketipu beli koin yang sebenernya cuma diputar-putar sama pihak internal.',
        },
        {
          num: '7',
          title: 'Tahu Kapan Pake Bot, Kapan Pake Terminal',
          body: 'Ngeksekusi via <strong>Bot Telegram (Trojan/BullX/dsb)</strong> itu sumpah lebih hemat ongkos gas fee-nya. Tapi kalau pakai Terminal Web (macem Dex dll), matamu bakal lebih puas pantau pergerakan super cepat.<br/><br/><strong>Buat yang pro:</strong> Belajarlah dasar ngoding (kayak Rust atau JS) terus colok langsung ke jalur satelit sendiri (RPC Helios). Bikin <em>Bundler</em> rahasiamu biar transaksinya tembus kilat tanpa perlu singgah antri di platform orang lain.',
        },
      ],
    },
  ],
  en: [
    {
      id: 'space-0',
      date: 'March 11, 2026',
      xLink: 'https://x.com/i/spaces/1yxBeMvqddEJN?s=20',
      title: 'Trading Secrets & Ray Ponyin\'s Origin: From Cybercafe Boy to Pro Trader',
      desc: 'Unpacking the "Challenge Wallet" hack, extreme portfolio defense, and Ray\'s crazy journey from running a Playstation rental store to mastering crypto.',
      tag: 'Portfolio · Story',
      insights: [
        {
          num: '1',
          title: 'Torture Yourself With a "Challenge Wallet"',
          body: 'To cure the itch of impulsive buying (<em>overtrading</em>), Ray enforces a strict segregation between your <strong>Main Wallet</strong> and a <strong>Challenge Wallet</strong>.<br/><br/><strong>The logic is brutal:</strong> Load only a microscopic balance in the Challenge Wallet. When capital is tight, your survival instincts flare up. You naturally become hyper-critical and ruthless in vetting coins because you\'re terrified of getting rugged out of your last pennies.',
        },
        {
          num: '2',
          title: 'Toxic TikTok Tools & Wallet Drainers',
          body: 'Stop drooling over "magic" crypto tools promoted by randoms on TikTok! Ray explicitly warns that actual drainer/rug software isn\'t randomly handed out online.<br/><br/><strong>Iron Rule:</strong> If your wallet has EVER been "Connected" to a shady app, nuke it immediately and migrate to a fresh wallet. Scammers are notoriously patient; they\'ll happily wait until your balance gets fat before indiscriminately draining every last drop.',
        },
        {
          num: '3',
          title: 'The Origin Story: Cybercafe Operator to Web3 Veteran',
          body: 'Success isn\'t an overnight package. Ray unloads his absolute ground-zero origin story.<br/><br/>He went from watching over a Playstation rental joint in elementary school to grinding as a <strong>cybercafe operator</strong> in junior high just to get free computer access. He encountered Bitcoin back when it was only traded for black-market online game cash! That raw grit fundamentally forged his blockchain instincts across Solana, Base, and TON today.',
        },
        {
          num: '4',
          title: 'The Anti-Broke Portfolio (No Hot Money!)',
          body: '<strong>It is utterly forbidden to trade with "Hot Money"!</strong> (rent, groceries, emergency funds). Ray\'s actual real-life portfolio mechanics are shockingly conservative.<br/><br/><strong>The setup:</strong> A mere <strong>1%</strong> of his net worth gambles in the Memecoin trenches. The rest? <strong>70%</strong> sleeping peacefully in mainstream Spot holdings, <strong>20%</strong> locked in Government Bonds (SBN), and <strong>5%</strong> shielded in solid Gold. Quit hunting the mythical jackpot without strapping on your financial seatbelt first!',
        },
        {
          num: '5',
          title: 'The Blueprint to Becoming a Successful Token Dev',
          body: 'Thinking of deploying your own token? Don\'t remotely expect retail volume if your dev wallet is a complete ghost.<br/><br/>Ray states that establishing a flawless <strong>Dev Account Reputation</strong> is mandatory to gain the trust of tracking bots and massive communities. Surrounding yourself with a non-shady team and riding the immediate meta is the only way to effectively push a coin into permanent <em>bonding</em> liquidity.',
        },
        {
          num: '6',
          title: 'Hunt for the RUGs, Not the Runners',
          body: 'The hardest pill to swallow: Regardless of how superhuman your analysis is, you <strong>cannot mathematically predict</strong> which completely random coin will trigger a 1000x <em>Runner</em>.<br/><br/><strong>Flip your mental model:</strong> Obsessively master exactly how to identify RUGs mechanically. Once you become a master at dodging literal landmines, the remaining coins in your wallet statistically manifest into runners on their own. Luck is just a byproduct of survival!',
        },
      ],
    },
    {
      id: 'space-1',
      date: 'March 18, 2026',
      xLink: 'https://x.com/i/spaces/1qGvvkmVpvpGB?s=20',
      title: 'Exposing Multi-Wallet Secrets & Memecoin Trading Strategies',
      desc: 'Let\'s talk about multi-wallet cookery, strictly filtering micin coins, and the real dangers of blindly tailgating whale wallets.',
      tag: 'Multi-Wallet · Strategy',
      insights: [
        {
          num: '1',
          title: 'How to Filter Trash Coins and Dodgy Devs',
          body: 'A lot of shady developers out there are openly <strong>"farming"</strong>—meaning they just wait for the market cap to surge before relentlessly dumping their bags.<br/><br/><strong>The ultimate filter:</strong> Don\'t skip doing your homework on the dev\'s track record! Make sure they genuinely intend to push the project organically, rather than just treating retail money as their personal ATM.',
        },
        {
          num: '2',
          title: 'The Dark Secret of Influencer Multi-Wallets',
          body: 'Did you know? Major <em>Crypto Twitter (CT)</em> personalities usually play the game with multiple hidden wallets. They quietly accumulate coins utilizing <strong>secret side IDs</strong>.<br/><br/>Only when their bags are packed do they scream <em>"call"</em> on their main accounts. As the followers swarm in and pump the price, they comfortably unload from the shadows.<br/><strong>Pro tip:</strong> Start sniffing around for abnormally large transactions that magically occur 5 minutes BEFORE the influencer posts!',
        },
        {
          num: '3',
          title: 'Genius DCA Tactics Using Multiple Wallets',
          body: 'Spreading your crypto across wallets isn\'t solely for deceiving people; it\'s legitimately great for portfolio engineering.<br/><br/>If you\'re wielding more than <strong>5 SOL</strong>, try spacing your bullets out. Execute <em>Dollar Cost Averaging (DCA)</em> across entirely different wallets. It\'s mathematically proven to be <strong>10–20% more effective</strong> at lowering your average cost basis than recklessly hammering the buy button from a single address.',
        },
        {
          num: '4',
          title: 'The Fatal Attraction of Copy-Trading Whales',
          body: 'Whales are swimming in effectively bottomless liquidity. Taking a <strong>50 SOL loss</strong> on a Tuesday doesn\'t even ruin their breakfast.<br/><br/>If you mindlessly <em>copy-trade</em> without understanding their overarching vision, you\'re preparing to become exit liquidity. Remember, your psychological resilience and <strong>wallet depth</strong> are vastly inadequate compared to theirs. Play your own game!',
        },
        {
          num: '5',
          title: 'Find Your Trading Persona; Stop Waiting to be Spoon-fed',
          body: 'Start breaking the habit of refreshing Twitter hoping someone drops a magic "call." You need to architect <strong>your very own core trading style</strong>!<br/><br/>Once you stumble upon a strategy that comfortably prints green, <strong>lock it in and sharpen it</strong>. Don\'t succumb to FOMO by constantly shifting mechanics, otherwise you\'re resetting your built-up experience back to zero for no reason.',
        },
      ],
    },
    {
      id: 'space-2',
      date: 'March 18, 2026',
      xLink: 'https://x.com/i/spaces/1qxoNezjdmjJv?s=20',
      title: 'Pro Trading Tips & Cultivating Your Unique Edge à la Bang Ponyin',
      desc: 'From discovering your lane, grasping "Cabal Plays", to why you absolutely need an Excel sheet to survive.',
      tag: 'Trading Style · Cabal',
      insights: [
        {
          num: '1',
          title: 'Soul Searching for Your Market Edge',
          body: 'Bang Ponyin\'s golden rule: Log insane amounts of screen time, but <strong>do not burn through your savings</strong>. Allocate a tiny "tuition fee" just for learning.<br/><br/><strong>Non-negotiable:</strong> Track every single win and loss in Excel. Soon you\'ll notice a pattern—whether you naturally excel at cat coins, utility tokens, or political narratives. Lean into what feels effortless, and stop fighting mechanics you inherently suck at.',
        },
        {
          num: '2',
          title: 'Why Buy "Dangerous" Coins Expecting a Pump?',
          body: 'Welcome to the shady realm of the <strong>"Cabal Play"</strong>. Out here, your fancy technical indicators are practically useless.<br/><br/>What truly dictates the trade is religiously following <strong>the on-chain footprints of elite wallets</strong> that hold a proven strike rate, or are notoriously tied to the developers. Despite looking like an imminent rug, verified wallet movements act as your safety net.',
        },
        {
          num: '3',
          title: 'Stop Chasing Moonshots; Focus on Dodging Landmines',
          body: 'Exhausted from trying to snipe the next 100x runner? Shift your paradigm. Pour all your focus into mastering precisely <strong>how to spot devastating RUGs and scams</strong>.<br/><br/>It\'s simple math: the better you get at immediately eliminating absolute trash coins, the higher your statistical probability of accidentally landing a spectacular <em>runner</em>. The rest is just pure, unadulterated luck.',
        },
        {
          num: '4',
          title: 'What Exactly is a "Cabal" Anyway?',
          body: 'People love romanticizing the word "Cabal". Let\'s be real, a Cabal is simply an <strong>exclusive private group chat sitting on an enormous pool of combined funding</strong> and ridiculous networking leverage.<br/><br/>They possess the raw capital to effortlessly pump a chart. This is exactly why in the trenches, <em>"knowing exactly WHO is manipulating the coin"</em> often yields far better returns than attempting to read the chart.',
        },
        {
          num: '5',
          title: 'Consistency Lives Inside a Spreadsheet',
          body: 'The greatest secret held by professional traders? <strong>Disciplined Tracking!</strong> Look back at your logs and decode exactly what bleeds your portfolio and what spikes it.<br/><br/>The absolute iron law: <strong>"Better safe than sorry"</strong>. Do not get cocky when you\'re on a massive winning streak. Quickly secure your initial investment, and treat any remaining running profits purely as a free bonus ride.',
        },
      ],
    },
    {
      id: 'space-3',
      date: 'March 19, 2026',
      xLink: 'https://x.com/i/spaces/1pJkOybvgOrJj?s=20',
      title: 'Memecoin Trading Secrets: Strategy, Psychology & Analysis',
      desc: 'Relaxed chat outlining scaling out massive positions, nailing the 3-dip approach so you don\'t get crushed, and dealing with aggressive volume bots.',
      tag: 'Psychology · Analytics',
      insights: [
        {
          num: '1',
          title: 'How to Unload Without Crashing The Price (Size Plays)',
          body: 'Playing with heavy size? Your exit protocols absolutely must align with the token\'s <strong>Liquidity Depth</strong>. A deep liquidity pool won\'t flinch if you drop a tiny bag.<br/><br/><strong>The dirty trick:</strong> Treat "News" (and the ensuing euphoric hype) purely as your exit liquidity. Casually scale out (<em>DCA Out</em>) directly as retail FOMO reaches its absolute climax—because that’s precisely when the artificial rally fuel dries up.',
        },
        {
          num: '2',
          title: 'The 3-Dip Strat for Keeping Your Sanity',
          body: 'Here\'s the pro-method for entering hyper-volatile plays:<br/>• <strong>Splash 1:</strong> Strict observation mode. Watch and wait.<br/>• <strong>Splash 2:</strong> Chuck a <em>crumb</em> (e.g., 0.1 SOL) just to lock the chart on your radar. Start meticulously monitoring gas behavior and the influx of new holders.<br/>• <strong>Splash 3:</strong> The moment buying pressure goes legitimately parabolic with strong trend confirmation, unleash the heavy bags! This framework eloquently shields you from catastrophic instant rug-pulls.',
        },
        {
          num: '3',
          title: 'Stalking Smart Wallets and Sneaky Insiders',
          body: 'Stop relying on massive Crypto Twitter accounts; mostly they just utilize retail followers as exit liquidity. You want to hunt down micro-accounts manifesting utterly insane win-rates.<br/><br/><strong>How to stalk:</strong> Investigate the critical 5-10 minute window immediately BEFORE an account drops a call. See who was waiting there first. But a fair warning: exceptionally smart insiders intentionally buy garbage tokens with their main wallets to butcher their on-chain winrate metrics and evade public surveillance.',
        },
        {
          num: '4',
          title: 'The Showdown: Solana vs Base',
          body: '<strong>Solana</strong> is the street-racing circuit of crypto; spinning up a coin takes a millisecond (Pump.fun) and the capital velocity is beautifully chaotic.<br/><strong>Base</strong> feels much more like a <em>"Slow Cook"</em> meta; the pacing is slower but is heavily compensated by monstrous liquidity walls.<br/>The takeaway: <strong>Abandon your chain loyalty!</strong> Aggressively migrate your focus wherever the vast majority of capital happens to reside today.',
        },
        {
          num: '5',
          title: 'Mental Defense & Locking in the Cash',
          body: 'Dominating micin coins isn\'t about showcasing your intellect on a chart, it\'s a brutal test of <strong>commanding your deeply-rooted Greed & Ego</strong>.<br/><br/>Keep a tangible real-world target in mind (like "Buying my parents a car"). This acts as an emergency mental brake-pad against reckless FOMO buys. Winning in crypto isn\'t scoring a ridiculous lottery hit; it\'s about ensuring you can still functionally <em>SURVIVE</em> the market ten years from now.',
        },
        {
          num: '6',
          title: 'Decoding "Global Fees" and Bot Deception',
          body: '<strong>The Global Fee is essentially the final boss metric.</strong> If fees are spiking uncontrollably, it signifies overwhelming organic demand or viciously aggressive bot warfare.<br/>As a trader, you must develop the sharp intuition to separate <strong>Native Human Volume</strong> from <strong>Dev-Engineered Bot Illusions</strong>. This ultimately dictates whether a rally is structurally sound, or if it\'s merely a puppet master pulling synthetic strings.',
        },
        {
          num: '7',
          title: 'Knowing When to Bot vs When to Trade Manually',
          body: 'Relying exclusively on <strong>Telegram Bots (Trojan/BullX/etc)</strong> is significantly more forgiving on your gas expenses. Yet, operating directly through Web Terminals (like Dex/Photoshop) gifts you an undeniable edge in rapid visual response.<br/><br/><strong>Stepping into Pro-Tier:</strong> Spend time digesting baseline coding (Rust/JS) and acquire a private RPC (e.g. Helios). The endgame is deploying your absolute own custom <em>Bundler</em>, slicing straight through the mempool instantly without ever waiting in line at a middleman platform.',
        },
      ],
    },
  ],
};

// ─── INSIGHT CARD ─────────────────────────────────────────────────────
function InsightCard({ insight, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`sr-insight-card${open ? ' open' : ''}`}
      onClick={() => setOpen(v => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setOpen(v => !v)}
    >
      <div className="sr-insight-top">
        <span className="sr-insight-num" style={{ background: color }}>{insight.num}</span>
        <span className="sr-insight-title">{insight.title}</span>
        <span className="sr-insight-chevron">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="sr-insight-body" dangerouslySetInnerHTML={{ __html: insight.body }}></div>
      )}
    </div>
  );
}

// ─── RECORDING CARD ───────────────────────────────────────────────────
function RecordingCard({ space, index }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const colors = ['#2455d4', '#7c3aed', '#059669', '#ea580c'];
  const color = colors[index % colors.length];

  return (
    <div className="sr-card reveal">
      {/* Header */}
      <div className="sr-card-header" style={{ borderLeftColor: color }}>
        <div className="sr-card-meta">
          <span className="sr-card-tag" style={{ background: `${color}18`, color }}>
            {space.tag}
          </span>
          <span className="sr-card-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {space.date}
          </span>
        </div>
        <h3 className="sr-card-title">{space.title}</h3>
        <p className="sr-card-desc">{space.desc}</p>

        <div className="sr-card-actions">
          <a
            href={space.xLink}
            target="_blank"
            rel="noopener noreferrer"
            className="sr-listen-btn"
            style={{ background: color }}
            onClick={e => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.845L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {t('Dengarkan Space', 'Listen to Space')}
          </a>
          <button
            className="sr-expand-btn"
            onClick={() => setExpanded(v => !v)}
            style={{ color, borderColor: `${color}40` }}
          >
            {expanded
              ? t('Sembunyikan Insight', 'Hide Insights')
              : t(`Lihat ${space.insights.length} Insight`, `View ${space.insights.length} Insights`)}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ marginLeft: 6, transition: 'transform .25s', transform: expanded ? 'rotate(180deg)' : 'none' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Insights */}
      {expanded && (
        <div className="sr-insights-list">
          <div className="sr-insights-label">
            {t('Rangkuman Insight', 'Summary Insights')}
            <span className="sr-note">
              {t(
                '⚠️ Bisa ada yang kurang tepat. Dengarkan ulang space untuk verifikasi.',
                '⚠️ Some details may be inaccurate. Re-listen to the space to verify.'
              )}
            </span>
          </div>
          {space.insights.map(insight => (
            <InsightCard key={insight.num} insight={insight} color={color} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────
export default function SpaceRecordings() {
  const { lang, t } = useLang();
  const spaces = SPACES_DATA[lang];

  return (
    <section className="space-recordings" id="space-recordings">
      {/* Section Header */}
      <div className="sr-header reveal">
        <div className="sr-eyebrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.845L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {t('Space Recordings', 'Space Recordings')}
        </div>
        <h2 className="sr-title">
          {t(
            <>Rangkuman <em>Twitter Space</em><br />Bang Ponyin</>,
            <>Summary of Bang Ponyin's<br /><em>Twitter Spaces</em></>
          )}
        </h2>
        <p className="sr-subtitle">
          {t(
            'Poin-poin penting dari diskusi audio langsung. Bisa ada yang kurang akurat — dengarkan spacenya langsung untuk verifikasi.',
            'Key takeaways from live audio discussions. Some details may be inaccurate — listen to the space directly to verify.'
          )}
        </p>

        {/* Stats bar */}
        <div className="sr-stats">
          <div className="sr-stat">
            <span className="sr-stat-num">{spaces.length}</span>
            <span className="sr-stat-label">{t('Space Terekam', 'Recorded Spaces')}</span>
          </div>
          <div className="sr-stat-div" />
          <div className="sr-stat">
            <span className="sr-stat-num">{spaces.reduce((a, s) => a + s.insights.length, 0)}</span>
            <span className="sr-stat-label">{t('Total Insight', 'Total Insights')}</span>
          </div>
          <div className="sr-stat-div" />
          <div className="sr-stat">
            <span className="sr-stat-num">🔄</span>
            <span className="sr-stat-label">{t('Terus Diperbarui', 'Continuously Updated')}</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="sr-cards">
        {spaces.map((space, i) => (
          <RecordingCard key={space.id} space={space} index={i} />
        ))}
      </div>
    </section>
  );
}
