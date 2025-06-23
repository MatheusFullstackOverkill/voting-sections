import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ErrorMessage, emptyField, errorsLength, formatErrors } from '../../../insfrastructure/utils/form-validators'
import { login } from '../../../insfrastructure/services/auth'
import { parseJwt } from '../../../insfrastructure/utils/JWTParser'
import { encrypt } from 'src/insfrastructure/utils/encrypt'
import { setToken } from 'src/insfrastructure/state/tokenSlice'
import { setUser } from 'src/insfrastructure/state/userSlice'
import { SubmitBtn } from '../../components/submit'
import { Input } from '../../components/input'
import ResponseModal from '../../components/response-modal'
import './styles.sass'
import { retrieveUser } from 'src/insfrastructure/services/users'

export const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: '',
        password:  ''
    })
    const [formErrors, setFormErrors] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [responseData, setResponseData] = useState<any>(null)
    
    const onSubmit = async () => {
        const errors = formatErrors({
            email: [emptyField(form.email, 'string')],
            password: [emptyField(form.password, 'string')]
        });

        setFormErrors(errors);

        if(errorsLength(errors) > 0) return;

        setLoading(true);

        try {
            const response = await login({
                ...form,
                password: encrypt(form.password)
            });

            const parsedJWT = parseJwt(response.data.auth_token);

            localStorage.setItem('auth_token', response.data.auth_token);
            localStorage.setItem('user_id', parsedJWT.user_id);

            const userdata = await retrieveUser(parsedJWT.user_id);

            dispatch(setToken(response.data.auth_token));
            dispatch(setUser(userdata));
         
            setTimeout(() => {
                navigate('/topics');
            });
        } catch (error: any) {
            let responseData = {
                type: 'error',
                title: '',
                text: () => <></>
            };

            if (error.response.status === 500) {
                responseData.title = 'Ocorreu um erro inesperado';
                responseData.text = () => <><p>Favor tentar novamente mais tarde</p></>
            };

            if (error.response.status === 400) {
                responseData.title = 'Login inválido';
                responseData.text = () => <></>
            };

            setResponseData(responseData);
            setLoading(false);
        }
    }

  return (
    <div className='login'>
        <div className='content'>
            <div className='block'>
                <div className='text'>
                    <h1>Bem vindo!</h1>
                </div>
                <div className='form'>
                    <Input
                    name='email'
                    label='Email'
                    placeholder='Insira seu email'
                    onChange={e => setForm({ ...form, email: e })}/>
                    <ErrorMessage errors={formErrors['email']} />
                    <Input
                    name='password'
                    label='Senha'
                    type='password'
                    placeholder='Insira sua senha'
                    onChange={e => setForm({ ...form, password: e })}/>
                    <ErrorMessage errors={formErrors['password']} />
                </div>
                <SubmitBtn className='secondary' text='Confirmar' loadingText='Enviando...' loading={loading} onSubmit={onSubmit} />
                <div className='bottom-text'>
                    <p>Ainda não possui uma conta?</p>
                    <Link to='/sign-up'><b>Cadastrar-se</b></Link>
                </div>
            </div>
        </div>
        <ResponseModal
        render={responseData}
        type={responseData?.type}
        title={responseData?.title}
        text={responseData?.text}
        onClose={() => setResponseData(null)} />
    </div>
)
}