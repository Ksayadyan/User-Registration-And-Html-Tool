class WS {
    constructor() {}
    request(url, method, body, token ) {
        return fetch (url, {
            method,
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : token,
            },
            body: method === 'GET' ? {} : JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) { throw response; }
            return response.json();    
        })
        .catch(error => {
            throw error;
        })
    }
}

const WebService = new WS();
export default WebService;