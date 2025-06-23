import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from 'src/insfrastructure/state/tokenSlice'
import { setUser } from 'src/insfrastructure/state/userSlice'
import arrowWhite from '../../../../assets/icons/arrow_white.png'
import './styles.sass'


export const DeskHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showUserMenu, toggleUserMenu] = useState(false)
  const userdata = useSelector((state: any) => state.user.userdata)

  useEffect(() => {
    window.addEventListener('click', (e) => {
      let userDataElement = document.querySelector('.user-data') as HTMLElement;
      if(!userDataElement) return;

      if(userDataElement.contains(e.target as HTMLElement)) {
        userDataElement = document.querySelector('.user-data') as HTMLElement;
        toggleUserMenu(userDataElement.classList.contains('opened') ? false : true);        
      } else {
        toggleUserMenu(false);
      };
    });
  }, [])

  const onLogout = () => {
    toggleUserMenu(false);

    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_token');

    dispatch(setToken({
      auth_token: ''
    }));

    dispatch(setUser({
      user_id: null,
      full_name: '',
      email: '',
      cpf: ''
    }));

    navigate('/login');
  }
  
  return (
    <header className='desk'>
      <div className='content'>
        <div className='left-content'>
          <Link to='topics'>
            <li>Tópicos</li>
          </Link>
        </div>
        <div className='right-content'>
          {
            userdata?.full_name &&
            <div className='user-menu-container'>
              <div className={'user-data '+(showUserMenu ? 'opened' : '')}>
                <div className='user-info'>
                  <h4 className='cut-text'>Olá, <b>{userdata?.full_name}</b></h4>
                </div>
                <div className='profile-picture-container'>
                </div>
                <img src={arrowWhite} className='arrow' alt='arrow-icon' />
              </div>
              {showUserMenu &&
              <div className='user-menu'>
                <ul>
                  <li onClick={onLogout}>Sair</li>
                </ul>
              </div>}
            </div>
          }
          {!userdata?.full_name && 
            <ul className='unlogged-links'>
              <Link to='sign-up'><li>Cadastro</li></Link>
              <Link to='login'><li>Entre</li></Link>
            </ul>
          }
        </div>
      </div>
    </header>
  )
}
