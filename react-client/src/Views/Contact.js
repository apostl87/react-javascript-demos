import React from 'react'

const Imprint = () => {

    const imprint_en = {
        title: "Note on the imprint obligation (AT, Austria)",
        text: "This website is a demonstration site and is intended solely for information and presentation purposes. It is a non-commercial website that does not offer any services or products and does not pursue any commercial purpose. Therefore, according to § 5 of the E-Commerce Act (ECG), there is no obligation to publish an imprint. All data used on this website is meaningless and has been created for demonstration purposes only."
    }
    const imprint_de = {
        title: "Hinweis zur Impressumspflicht (AT, Österreich)",
        text: "Diese Webseite ist eine Demonstrationsseite und dient ausschließlich zu Informations- und Präsentationszwecken. Es handelt sich um eine nicht-kommerzielle Webseite, die keine Dienstleistungen oder Produkte anbietet und keinen wirtschaftlichen Zweck verfolgt. Daher besteht gemäß § 5 E-Commerce-Gesetz (ECG) keine Pflicht zur Veröffentlichung eines Impressums. Alle auf dieser Webseite verwendeten Daten sind bedeutungslos und wurden lediglich zu Demonstrationszwecken erstellt."
    }

    return (
        <div className='mainly-text-contentt'>
            {/* <h3 className='text-left'>Contact</h3> */}
            <h4>Responsible for the content on this website</h4>
            Andreas Postl <br />
            andreas.postl.42 (at) gmail.com <br />
            –––––––––––––––––––––––––––– <br/>
            Austria

            <h5 className='pt-5'>{imprint_en.title}</h5>
            <div>{imprint_en.text}</div>

            <h5 className='pt-5'>{imprint_de.title}</h5>
            <div>{imprint_de.text}</div>
        </div>
    )
}

export default Imprint