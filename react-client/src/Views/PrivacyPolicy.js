import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { NotLoggedIn } from '../Components/Misc';
import Markdown from 'markdown-to-jsx'
import { render } from 'react-dom'

const PrivacyPolicy = () => {
    const MyMarkdown = () => {
        return (
                <Markdown>
                    {'<a name="english" />' + 
                     mdPrivacyPolicyEN +
                     '<br/>' +
                     '<a name="deutsch" />' + 
                     mdPrivacyPolicyDE}
                </Markdown >
        )
    }

    // Rendering Markdown to JSX
    useEffect(() => {
        let element = createRoot(document.getElementById('privacy-policy'));
        if (element) {
            element.render(<MyMarkdown />);
        }
    }, [])

    return (
        
        <div id='privacy-policy' className='mainly-text-contentt'>
            Privacy Policy
        </div>
        
    );
};

export default PrivacyPolicy;


const mdPrivacyPolicyDE = `
### Datenschutzrichtlinie [^(english)]

**Gültigkeitsdatum:** 01.06.2024

##### 1. Allgemeines

Der Schutz Ihrer Daten ist uns äußerst wichtig. Wir verpflichten uns, Ihre Privatsphäre zu schützen und sicherzustellen, dass Ihre persönlichen Daten sicher und verantwortungsvoll behandelt werden. Diese Datenschutzrichtlinie beschreibt, wie wir Informationen sammeln, verwenden und schützen, wenn Sie unsere Website besuchen. Dabei halten wir uns an die gesetzlichen Bestimmungen der EU-Datenschutz-Grundverordnung
(<a href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE" target="_blank">DSGVO, Art. 13 und 14</a>)
und des österreichischen Telekommunikationsgesetzes
(<a href="https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011678&Artikel=&Paragraf=165" target="_blank">TKG 2021, § 165</a>).

##### 2. Personenbezogene Daten, die wir erheben

Wir können die folgenden Arten von personenbezogenen Daten über Sie („Personenbezogene Daten“) sammeln und verarbeiten:

- **Persönliche Informationen**: Name, E-Mail-Adresse und andere Kontaktdaten, die Sie in Ihrem Nutzerprofil angeben, wenn Sie uns kontaktieren oder sich für unsere Dienste anmelden.
- **Nutzungsdaten**: Informationen darüber, wie Sie unsere Website nutzen, wie z.B. IP-Adressen, Browsertypen und besuchte Seiten.

##### 3. Wie wir Personenbezogene Daten verwenden

- **Persönliche Informationen**: Wir speichern keine Informationen, die Sie in Ihrem Nutzerprofil angeben, auf unseren Domänen. Diese werden über eine gesicherte Verbindung an unseren Authentizierungsanbieter
<a href="https://auth0.com/" target="_blank">Auth0 (https://auth0.com/)</a> 
weitergegeben. Wir können persönliche Information auch zur Kommunikation mit Ihnen verwenden.

- **Nutzungsdaten**: Wir können diese Informationen für folgende Zwecke speichern:  
\\- Zur Bereitstellung und Verbesserung unserer Dienstleistungen  
\\- Zur Analyse und zum Verständnis, wie unsere Website genutzt wird

##### 4. Cookies

Wir verwenden Cookies und ähnliche Tracking-Technologien, um die Nutzung der Webseite für authentifizierte Nutzer zu ermöglichen, Aktivitäten auf unserer Website zu verfolgen und bestimmte Informationen zu speichern. Sie können die Verwendung von Cookies auf Browser-Ebene steuern.

##### 5. Weitergabe von Personenbezogenen Daten

Wir verkaufen oder vermieten Personenbezogenen Daten an Dritte. Wir können Ihre Informationen mit vertrauenswürdigen Dritten teilen, die uns bei Betrieb und der Verwaltung unserer Webseite unterstüzen (siehe auch Punkt 3).

##### 7. Ihre Rechte

Sie haben jederzeit das Recht, über Ihr [Nutzerprofil](/profile) auf Ihre persönlichen Daten zuzugreifen, sie zu aktualisieren oder zu löschen. Außerdem können Sie uns auch unter [kontaktieren](/contact), um diese Rechte auszuüben.

##### 8. Änderungen an dieser Datenschutzrichtlinie

Wir können unsere Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir informieren über alle Änderungen, indem wir die neue Datenschutzrichtlinie auf dieser Seite veröffentlichen.
`


const mdPrivacyPolicyEN = `

### Privacy Policy [^(deutsch)]

**Effective Date:** 01.06.2024

##### 1. General

The protection of your data is extremely important to us. We are committed to protecting your privacy and ensuring that your personal data is handled safely and responsibly. This privacy policy describes how we collect, use, and protect information when you visit our website. We comply with the legal provisions of the EU General Data Protection Regulation
(<a href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&from=EN" target="_blank">GDPR, Art. 13 and 14</a>)
and the Telecommunications Act
(<a href="https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011678&Artikel=&Paragraf=165" target="_blank">TKG 2021, § 165</a>)
in Austria.

##### 2. Personal Data We Collect

We may collect and process the following types of personal data about you ("Personal Data"):

- **Personal Information**: Name, email address, and other contact details that you provide in your user profile when you contact us or register for our services.
- **Usage Data**: Information about how you use our website, such as IP addresses, browser types, and visited pages.

##### 3. How We Use Personal Data

- **Personal Information**: We do not store information that you provide in your user profile on our domains. This data is transmitted via a secure connection to our authentication provider
<a href="https://auth0.com/" target="_blank">Auth0 (https://auth0.com/)</a>.
We may also use personal information to communicate with you.

- **Usage Data**: We may store this information for the following purposes:  
  \\- To provide and improve our services  
  \\- To analyze and understand how our website is used

##### 4. Cookies

We use cookies and similar tracking technologies to enable the use of the website for authenticated users, track activities on our website, and store certain information. You can control the use of cookies at the browser level.

##### 5. Sharing Personal Data

We do not sell or rent personal data to third parties. We may share your information with trusted third parties who assist us in operating and managing our website (see also point 3).

##### 7. Your Rights

You have the right at any time to access, update, or delete your personal data through your [user profile](/profile). You can also contact us at [contact](/contact) to exercise these rights.

##### 8. Changes to This Privacy Policy

We may update our privacy policy from time to time. We will inform you of any changes by posting the new privacy policy on this page.
`