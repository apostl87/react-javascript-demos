import $ from 'jquery';

export default async function verifyUrlImage(url) {
    try {
        let resp = $.ajax(url);
        await resp;
        let headers = resp.getAllResponseHeaders().split(/\n/g);
        for (let i = 0; i <= headers.length; i++) {
            let hd = headers[i].split(': ')
            if (hd[0] == 'content-type' && hd[1].indexOf('image') == 0)
                return true;
        }
    }
    catch { }
    return false;
}