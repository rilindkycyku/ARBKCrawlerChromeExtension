<body>

<h1>ARBK - Kërko Biznesin Chrome Extension</h1>

<h2>Kërkim Offline i të Dhënave të Bizneseve në ARBK (Kosovë)</h2>

<p>Ky është një Chrome Extension që ju mundëson kërkim të shpejtë, të lehtë dhe pa internet të të dhënave të bizneseve aktive të regjistruara në Agjencinë e Regjistrimit të Bizneseve të Kosovës (ARBK).</p>

<h3>Linku për Shkarkim nga Chrome Web Store</h3>

<p>Tani extension-i është i disponueshëm zyrtarisht në Chrome Web Store:</p>

<p><strong><a href="https://chromewebstore.google.com/detail/arbk-k%C3%ABrko-biznesin/ekghbegmgipofaljpolgjfhpiakfpomj">Shkarko nga Chrome Web Store</a></strong></p>

<h2>Përshkrimi</h2>

<p>Extension-i përdor të dhënat e plota nga API-ja e hapur (e zhvilluar nga Edonit Rexhepi në <a href="https://arbk.micro-devs.com/">arbk.micro-devs.com</a>). Pas ngarkimit të parë të të dhënave, ju mund të kryeni kërkime të shpejta lokalisht në shfletues, pa pasur nevojë për internet.</p>

<ul>
    <li><strong>Përdorimi kryesor</strong>: Për këdo që ka biznes ose ka nevojë për të dhëna të bizneseve.</li>
    <li><strong>Avantazhet kryesore</strong>:
        <ul>
            <li>Kërkim i menjëhershëm offline.</li>
            <li>Filtrim në kohë reale sipas çdo kolone.</li>
            <li>Ruajtje lokale e të dhënave (IndexedDB).</li>
            <li>Mundësi kopjimi të lehtë të të dhënave me një klik.</li>
        </ul>
    </li>
    <li><strong>Teknologjitë e përdorura</strong>:
        <ul>
            <li>Dexie.js për ruajtje lokale në IndexedDB.</li>
            <li>JSZip për trajtimin e file-ve ZIP/CSV.</li>
        </ul>
    </li>
</ul>

<h2>Si të Instaloni</h2>

<p><strong>Mënyra më e lehtë dhe e rekomanduar:</strong></p>

<ol>
    <li>Hapni <a href="https://chromewebstore.google.com/detail/arbk-k%C3%ABrko-biznesin/ekghbegmgipofaljpolgjfhpiakfpomj">linkun në Chrome Web Store</a>.</li>
    <li>Klikoni "Shto në Chrome" (Add to Chrome).</li>
    <li>Konfirmoni instalimin.</li>
</ol>

<p><strong>Instalim manual:</strong></p>

<ol>
    <li>Shkarkoni repository-në nga GitHub:<br>
        <a href="https://github.com/rilindkycyku/ARBKCrawlerChromeExtension">https://github.com/rilindkycyku/ARBKCrawlerChromeExtension</a>
    </li>
    <li>Hapni Chrome dhe shkoni te <code>chrome://extensions/</code>.</li>
    <li>Aktivizoni "Developer mode" (në këndin e sipërm djathtas).</li>
    <li>Klikoni "Load unpacked" dhe zgjidhni dosjen kryesore të extension-it.</li>
</ol>

<p>Udhëzues i detajuar për instalimin manual:<br>
<a href="https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked">https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked</a></p>

<h2>Si të Përdorni</h2>

<ol>
    <li><strong>Merrni të dhënat nga API-ja</strong>:
        <ul>
            <li>Vizitoni <a href="https://arbk.micro-devs.com/">https://arbk.micro-devs.com/</a>.</li>
            <li>Regjistrohuni (falas) për të marrë API Key.</li>
        </ul>
    </li>
    <li><strong>Ngarkoni të dhënat në extension</strong>:
        <ul>
            <li>Hapni popup-in e extension-it (klikoni ikonën në toolbar të Chrome).</li>
            <li>Në seksionin <strong>Shkarkoni të Dhënat e Fundit</strong>, vendosni API Key-in tuaj.</li>
            <li>Klikoni <strong>Ruaj Çelësin</strong>, pastaj <strong>Shkarko ZIP</strong>.</li>
            <li>Ngarkoni file-in ZIP ose CSV të shkarkuar.</li>
            <li>Extension-i do të përpunojë dhe ruajë të dhënat lokalisht (kjo mund të zgjasë disa minuta varësisht nga madhësia).</li>
        </ul>
    </li>
    <li><strong>Kërkoni biznese</strong>:
        <ul>
            <li>Në popup, shtypni terma kërkimi (emër, numër regjistrimi, numër fiskal, etj.).</li>
            <li>Rezultatet filtrohen në kohë reale.</li>
            <li>Klikoni mbi çdo qelizë për të kopjuar vlerën.</li>
        </ul>
    </li>
</ol>

<p><strong>Shënim</strong>: Pas ngarkimit të parë, të gjitha kërkimet funksionojnë plotësisht offline. Të dhënat ruhen vetëm në shfletuesin tuaj lokal.</p>

<h2>Kreditë</h2>

<ul>
    <li>Të dhënat dhe API bazë: <a href="https://arbk.micro-devs.com/">https://arbk.micro-devs.com/</a> – Zhvilluar nga Edonit Rexhepi.</li>
</ul>

</body>