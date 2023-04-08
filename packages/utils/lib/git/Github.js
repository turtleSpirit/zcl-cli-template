import axios from 'axios';
import GitServer from './GitServer.js';

const BASE_URL = 'https://api.github.com';

class GitHub extends GitServer {
    constructor() {
        super();
        this.createService();
    }

    createService() {
        this.service = axios.create({
            baseURL: BASE_URL,
            timeout: 5000
        })
        this.service.interceptors.request.use(configs => {
                configs.headers['Authorization'] = `Bearer ${this.token}`;
                configs.headers['Accept'] = 'application/vnd.github+json';
                return configs;
            },
            err => {
                return Promise.reject(err);
            })
        this.service.interceptors.response.use(
            response => {
                return response.data;
            },
            err => {
                if (err.response && err.response.status === 401) {
                    return Promise.reject('token过期，通过-rt或者--resetToken重置token');
                } else {
                    return Promise.reject(err);
                }
            }
        )
    }

    get(url, params, headers) {
        return this.service({
            methods: 'get',
            url,
            params,
            headers
        })
    }

    searchRepositories(params) {
        return this.get('/search/repositories', params);
    }

    getRepoUrl(fullName) {
        return `https://github.com/${fullName}.git`;
    }

}

export default GitHub;