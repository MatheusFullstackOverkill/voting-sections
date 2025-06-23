import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emptyField, ErrorMessage, errorsLength, formatErrors } from 'src/insfrastructure/utils/form-validators'
import { createTopic } from 'src/insfrastructure/services/topics'
import { Input } from 'src/presenters/components/input'
import { SubmitBtn } from 'src/presenters/components/submit'
import ResponseModal from 'src/presenters/components/response-modal'
import './styles.sass'

export const CreateTopic = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        description:  ''
    })
    const [formErrors, setFormErrors] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [responseData, setResponseData] = useState<any>(null)

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async () => {
        const errors = formatErrors({
            title: [emptyField(form.title, 'string')],
            description: [emptyField(form.description, 'string')]
        });

        setFormErrors(errors);

        if(errorsLength(errors) > 0) return;

        setLoading(true);

        try {
            await createTopic(form);
            
            let responseData = {
                type: 'success',
                title: 'Tópico criado com sucesso!',
                text: () => <></>
            };

            setResponseData(responseData);
            setLoading(false);
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

            setResponseData(responseData);
            setLoading(false);
        }
    }

    return (
        <div className='create-topic'>
            <div className='content'>
                <div className='form'>
                    <Input
                    name='title'
                    label='Título'
                    onChange={e => setForm({ ...form, title: e })}/>
                    <ErrorMessage errors={formErrors['title']} />
                    <Input
                    name='description'
                    label='Descrição'
                    type='textarea'
                    onChange={e => setForm({ ...form, description: e })}/>
                    <ErrorMessage errors={formErrors['description']} />
                </div>
                <SubmitBtn className='secondary' text='Confirmar' loadingText='Enviando...' loading={loading} onSubmit={onSubmit} />
            </div>
            <ResponseModal
            render={responseData}
            type={responseData?.type}
            title={responseData?.title}
            text={responseData?.text}
            onClose={() => {
                if (responseData?.type === 'success') {
                    navigate('/topics');
                };

                setResponseData(null);
            }} />
        </div>
    )
}
