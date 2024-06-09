import { getLanguage, getAuthDetails } from "./storage";

export function get(path) {
    return request(path, 'GET');
}
export function post(path, body) {
    return request(path, 'POST', body);
}
export function put(path, body) {
    return request(path, 'PUT', body);
}
export function del(path) {
    return request(path, 'DELETE')
}

async function request(path, method, body) {
    const host = process.env.REACT_APP_CONNECTION_HOST;
    const language = getLanguage();
    const headers = { 'Accept-Language': language }
    const authDetails = getAuthDetails();

    const options = {
        method,
        headers,
    };

    if(body !== undefined) {
        if (body instanceof FormData) {
            options.body = body;
        } else {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    };

    if (authDetails !== null) {
        if ( authDetails.token !== undefined && authDetails.token !== null) {
            options.headers['Authentication'] =  authDetails.token;
        }
    }

    try{
        const response = await fetch(host + path, options);
        if (response.status < 200 || response.status > 201 || response.ok === false) {
            throw new Error(response.status);
        }


        if (response.headers.get("content-type") != null) {
            if (response.headers.get("content-type").includes("text")) {
                return response.text();
            } else {
                return response.json();
            }
        }

    } catch (error) {
        if (error.message === 'NetworkError when attempting to fetch resource.') {
            throw Error('Server is down!')
        } else {
            throw error;
        }
    };
}