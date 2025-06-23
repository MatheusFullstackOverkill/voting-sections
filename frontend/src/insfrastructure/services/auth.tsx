import axios from "axios"
import { environment } from "../../environments/environment";
import store from "../state/store";
import { setToken } from "../state/tokenSlice";
import { setUser } from "../state/userSlice";
import { router } from "src/presenters/navigation/routes";

interface LoginData {
    email: string,
    password: string
};

interface LoginResponse {
    auth_token: string
};

export const login = async (data: LoginData) => {
    const response = await axios.post<LoginResponse>(environment.apiUrl+'/api/login', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.status !== 200) {
        throw Error('error');
    };

    return response;
};
  
export const onLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_token');

    store.dispatch(setToken({
      auth_token: ''
    }));

    store.dispatch(setUser({
      user_id: null,
      full_name: '',
      email: '',
      cpf: ''
    }));

    const loggedRoutes = [
      '/topics/create'
    ];

    if (loggedRoutes.filter(route => window.location.pathname.includes(route)).length > 0) {
      router.navigate('/login');  
    }
};