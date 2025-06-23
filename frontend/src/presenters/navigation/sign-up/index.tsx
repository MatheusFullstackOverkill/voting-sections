import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setToken } from 'src/insfrastructure/state/tokenSlice'
import { setUser } from 'src/insfrastructure/state/userSlice'
import { CPFValidator, ErrorMessage, emptyField, errorsLength, formatErrors, validatePasswordConfirmation } from '../../../insfrastructure/utils/form-validators'
import { login } from '../../../insfrastructure/services/auth'
import { parseJwt } from '../../../insfrastructure/utils/JWTParser'
import { createUser } from '../../../insfrastructure/services/users'
import { encrypt } from 'src/insfrastructure/utils/encrypt'
import { SubmitBtn } from '../../components/submit'
import { Input } from '../../components/input'
import ResponseModal from '../../components/response-modal'
import './styles.sass'

export const SignUp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        cpf: '',
        password:  '',
        password_confirmation: ''
    })
    const [formErrors, setFormErrors] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [responseData, setResponseData] = useState<any>(null)

    const onSubmit = async () => {
        const errors = formatErrors({
            full_name: [emptyField(form.full_name, 'string')],
            email: [emptyField(form.email, 'string')],
            cpf: [CPFValidator(form.cpf)],
            password: [emptyField(form.password, 'string')],
            password_confirmation: [validatePasswordConfirmation(form.password, form.password_confirmation)]
        });

        setFormErrors(errors);

        if(errorsLength(errors) > 0) return;

        setLoading(true);

        try {
            await createUser({
                ...form,
                password: encrypt(form.password)
            });

            const response = await login({
                email: form.email,
                password: encrypt(form.password)
            });

            const parsedJWT = parseJwt(response.data.auth_token);

            localStorage.setItem('auth_token', response.data.auth_token);
            localStorage.setItem('user_id', parsedJWT.user_id);

            dispatch(setToken(response.data.auth_token));
            dispatch(setUser(parsedJWT.user_id));
            
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
                responseData.title = 'Usuário já cadastrado';
                responseData.text = () => <></>
            };

            setResponseData(responseData);
            setLoading(false);
        }
    }


    return (
         <div className='sign-up'>
            <div className='content'>
                <div className='block'>
                    <div className='text'>
                        <h1>Bem vindo!</h1>
                    </div>
                    <div className='form'>
                        <Input
                        name='full_name'
                        label='Nome Completo'
                        placeholder='Insira seu nome'
                        onChange={e => setForm({ ...form, full_name: e })}/>
                        <ErrorMessage errors={formErrors['full_name']} />
                        <Input
                        name='email'
                        label='Email'
                        placeholder='Insira seu email'
                        onChange={e => setForm({ ...form, email: e })}/>
                        <ErrorMessage errors={formErrors['email']} />
                        <Input
                        name='cpf'
                        label='CPF'
                        mask='999.999.999-99'
                        placeholder='Insira seu CPF'
                        onChange={e => setForm({ ...form, cpf: e })}/>
                        <ErrorMessage errors={formErrors['cpf']} />
                        <Input
                        name='password'
                        label='Senha'
                        type='password'
                        placeholder='Insira sua senha'
                        onChange={e => setForm({ ...form, password: e })}/>
                        <ErrorMessage errors={formErrors['password']} />
                        <Input
                        name='password_confirmation'
                        label='Confirmar Senha'
                        type='password'
                        placeholder='Confirmar sua senha'
                        onChange={e => setForm({ ...form, password_confirmation: e })}/>
                        <ErrorMessage errors={formErrors['password_confirmation']} />
                    </div>
                    <SubmitBtn className='secondary' text='Confirmar' loadingText='Enviando...' loading={loading} onSubmit={onSubmit} />
                    <div className='bottom-text'>
                        <p>Já possui uma conta?</p>
                        <Link to='/login'><b>Acessar</b></Link>
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