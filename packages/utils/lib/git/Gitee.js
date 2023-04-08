import axios from 'axios';
import GitServer from './GitServer.js';

const BASE_URL = 'https://gitee.com/api/v5/';

class Gitee extends GitServer {
    constructor() {
        super();
        this.createService();
    }

    createService() {
        this.service = axios.create({
            baseURL: BASE_URL,
            timeout: 5000
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
            params: {
                ...params,
                access_token: this.token
            },
            headers
        })
    }

    searchRepositories(params) {
        return this.get('/search/repositories', params);
    }

    getRepoUrl(fullName) {
        return `https://gitee.com/${fullName}.git`;
    }

}

export default Gitee;