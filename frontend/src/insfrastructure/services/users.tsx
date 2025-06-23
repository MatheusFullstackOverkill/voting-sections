import axios from "axios";
import { environment } from "../../environments/environment";

export interface User {
    user_id?: number,
    full_name: string,
    email: string,
    cpf: string,
    password: string,
    password_confirmation?: string
};

export const createUser = async (data: User): Promise<any> => {
    const response = await axios.post<any>(environment.apiUrl+'/api/users', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status !== 201) {
        throw Error('error');
    };

    return response.data;
};

export const retrieveUser = async (user_id: number) => {
    const response = await axios.get<User>(environment.apiUrl+'/api/users/'+user_id, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('auth_token')
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response.data;
};

export const updateUser = async (user_id: number, data: User): Promise<any> => {
    const response = await axios.put<User>(environment.apiUrl+'/api/users/'+user_id, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('auth_token')
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response.data;
};