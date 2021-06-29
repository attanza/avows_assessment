import axios, { AxiosRequestConfig } from 'axios';

class Api {
  constructor() {
    this.initApi();
  }
  initApi() {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.withCredentials = true;
  }

  async get(url: string, options?: AxiosRequestConfig): Promise<any> {
    return axios.get(url, options).then((r) => r.data);
  }
  async post(url: string, data: any): Promise<any> {
    return axios.post(url, data).then((r) => r.data);
  }
  async put(url: string, data: any): Promise<any> {
    return axios.put(url, data).then((r) => r.data);
  }
  async delete(url: string): Promise<any> {
    return axios.delete(url).then((r) => r.data);
  }

  cancel() {
    return axios.CancelToken.source();
  }

  isCancel(error: any) {
    return axios.isCancel(error);
  }

  async uploadImage(url: string, data: any) {
    try {
      const resp = await axios
        .post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((r) => r.data);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}

export default new Api();
