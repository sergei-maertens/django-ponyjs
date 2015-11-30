import rest from 'rest';
import mime from 'rest/interceptor/mime';


let baseUrl = '/api/v1/';

client = rest.wrap(mime);


class Api {
    constructor(relEndpoint, params) {
        this.path = baseUrl + relEndpoint;
        this.params = params;
    }

    get() {
        return client({
            path: this.path,
            method: 'GET',
            params: this.params
        })
    }
}


export default Api;
