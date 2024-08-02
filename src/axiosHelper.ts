import axios from 'axios';

export class AxiosHelper {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async get(endpoint: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/${endpoint}.json`);
            return response.data;
        } catch (error) {
            // console.error('Error fetching data:', error);
            // throw error;
        }
    }
}