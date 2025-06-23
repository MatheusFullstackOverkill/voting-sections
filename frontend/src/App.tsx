import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Header } from './presenters/components/header';
import { Footer } from './presenters/components/footer';
import { parseJwt } from './insfrastructure/utils/JWTParser';
import { setUser } from './insfrastructure/state/userSlice';
import { setToken } from './insfrastructure/state/tokenSlice';
import { retrieveUser } from './insfrastructure/services/users';
import { onLogout } from './insfrastructure/services/auth';
import './styles/main.sass';

axios.interceptors.response.use(
  response => {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      onLogout();
    }

    return Promise.reject(error)
  }
)

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    validateLogin();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const validateLogin = async () => {
    const parsedJWT = parseJwt(localStorage.getItem('auth_token') + '');

    if (!parsedJWT) {
      onLogout();

      return;
    };

    dispatch(setToken({
      auth_token: localStorage.getItem('auth_token')
    }));

    const userdata = await retrieveUser(parsedJWT.user_id);

    dispatch(setUser(userdata));
  }

  return (
    <div className="page">
      <Header />
      <div className='page-content'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
