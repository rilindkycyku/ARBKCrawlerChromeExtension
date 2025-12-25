
<body>

<h1>ARBK Crawler Chrome Extension</h1>

<h2>Kosovo ARBK Offline Search</h2>

<p>Ky është një Chrome Extension që ju mundëson kërkim të shpejtë dhe offline të të dhënave të bizneseve të regjistruara në Agjencinë e Regjistrimit të Bizneseve të Kosovës (ARBK).</p>

<h2>Përshkrimi</h2>

<p>Ky extension ju lejon të ngarkoni të dhëna të plota të regjistrit të bizneseve të Kosovës (nga API-ja e mundësuar nga <a href="https://arbk.micro-devs.com/">https://arbk.micro-devs.com/</a>, zhvilluar nga Edonit Rexhepi) dhe të kryeni kërkime të shpejta lokalisht, pa pasur nevojë për internet pas ngarkimit fillestar.</p>

<ul>
    <li><strong>Përdorimi kryesor</strong>: Për këdo që ka biznes ose ka nevojë për të dhëna të bizneseve (p.sh. emri, numri fiskal, numri i regjistrimit, statusi, etj.).</li>
    <li><strong>Avantazhet</strong>: Kërkim i shpejtë offline, filtrime të lehta, ruajtje lokale e të dhënave.</li>
    <li><strong>Teknologjitë e përdorura</strong>:
        <ul>
            <li>Dexie.js për IndexedDB (ruajtje lokale).</li>
            <li>JSZip për trajtimin e file-ve ZIP/CSV të gjeneruar nga API-ja.</li>
        </ul>
    </li>
</ul>

<p>Aktualisht, extension-i është në proces verifikimi për publikim në Chrome Web Store, prandaj duhet të instalohet manualisht si "unpacked extension".</p>

<h2>Si të Instaloni</h2>

<ol>
    <li>Shkarkoni repository-në nga GitHub:<br>
        <a href="https://github.com/rilindkycyku/ARBKCrawlerChromeExtension">https://github.com/rilindkycyku/ARBKCrawlerChromeExtension</a>
    </li>
    <li>Hapni Chrome dhe shkoni te <code>chrome://extensions/</code>.</li>
    <li>Aktivizoni "Developer mode" (në këndin e sipërm djathtas).</li>
    <li>Klikoni "Load unpacked" dhe zgjidhni dosjen ku keni shkarkuar extension-in.</li>
</ol>

<p>Udhëzues i detajuar:<br>
<a href="https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked">https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked</a></p>

<h2>Si të Përdorni</h2>

<ol>
    <li><strong>Merrni të dhënat</strong>:
        <ul>
            <li>Vizitoni <a href="https://arbk.micro-devs.com/">https://arbk.micro-devs.com/</a>.</li>
            <li>Regjistrohuni për të marrë API key (falas).</li>
        </ul>
    </li>
    <li><strong>Ngarkoni të dhënat në extension</strong>:
        <ul>
            <li>Hapni popup-in e extension-it (klikoni ikonën në toolbar).</li>
            <li>Vendosni API Key në rubriken e parë në tekstin <code>Shkarkoni të Dhënat e Fundit</code></li>
            <li>Klikoni <code>Ruaj Çelësin</code> pastaj <code>Shkarko ZIP</code></li>
            <li>Ngarkoni file-in CSV/ZIP të shkarkuar.</li>
            <li>Extension-i do të përpunojë dhe ruajë të dhënat në IndexedDB lokalisht.</li>
        </ul>
    </li>
    <li><strong>Kërkoni</strong>:
        <ul>
            <li>Në popup, shtypni terma kërkimi (emër biznesi, numër regjistrimi, etj.).</li>
            <li>Rezultatet do të filtruar në kohë reale nga të dhënat lokale.</li>
        </ul>
    </li>
</ol>

<p>Të dhënat ruhen lokalisht në shfletuesin tuaj, kështu që kërkimi funksionon offline pas ngarkimit të parë.</p>

<h2>Kreditë</h2>

<ul>
    <li>API dhe të dhëna bazë: <a href="https://arbk.micro-devs.com/">https://arbk.micro-devs.com/</a> – Zhvilluar nga Edonit Rexhepi.</li>
</ul>

</body>