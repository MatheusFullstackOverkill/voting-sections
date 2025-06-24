import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { retrieveTopic, retrieveTopicResults, startTopicSession, TopicResults, Topic as TopicType, voteOnTopic } from 'src/insfrastructure/services/topics'
import { emptyField, ErrorMessage, errorsLength, formatErrors } from 'src/insfrastructure/utils/form-validators'
import ResponseModal from 'src/presenters/components/response-modal'
import { User } from 'src/insfrastructure/services/users'
import { Input } from 'src/presenters/components/input'
import { SubmitBtn } from 'src/presenters/components/submit'
import './styles.sass'

export const Topic = () => {
    const params = useParams()
    const navigate = useNavigate()
    const userdata = useSelector((state: any) => state.user.userdata) as User
    const [topic, setTopic] = useState<TopicType | null>(null)
    const [results, setResults] = useState<TopicResults>()
    const [sessionForm, setSessionForm] = useState({
        status: 'started',
        duration_minutes: 0
    })
    const [voteForm, setVoteForm] = useState<{ approved: boolean | null }>({
        approved: null
    })
    const [formErrors, setFormErrors] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [responseData, setResponseData] = useState<any>(null)
    const resultsMap: Record<string, string> = {
      approved: 'Aprovado',
      repproved: 'Reprovado',
      tied: 'Empatado'
    }

    useEffect(() => {
      if (params.topic_id) {
        retriveTopic(parseInt(params.topic_id));
      };
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const retriveTopic = async (topic_id: number) => {
      try {
        const topic = await retrieveTopic(topic_id);

        if (topic.status === 'finished') {
          onRetrieveTopicResults();
        };

        setTopic(topic);
      } catch (error) {
        navigate('/topics');
      }
    }

    const onStartTopicSession = async () => {
        const errors = formatErrors({
          duration_minutes: [emptyField(sessionForm.duration_minutes+'', 'number')]
        });

        setFormErrors(errors);

        if(errorsLength(errors) > 0) return;

        setLoading(true);

        try {
            await startTopicSession(parseInt(params.topic_id+''), sessionForm);
            
            let responseData = {
                type: 'success',
                title: 'Tópico iniciado com sucesso!',
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

    const onVoteOnTopic = async () => {
        const errors = formatErrors({
          approved: [emptyField(voteForm.approved == null ? '' : voteForm.approved+'', 'string')]
        });

        setFormErrors(errors);

        if(errorsLength(errors) > 0) return;

        setLoading(true);

        try {
            await voteOnTopic(parseInt(params.topic_id+''), voteForm);
            
            let responseData = {
                type: 'success',
                title: 'Tópico votado com sucesso!',
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

    const onRetrieveTopicResults = async () => {
      try {
        const results = await retrieveTopicResults(parseInt(params.topic_id+''));

        setResults(results);
      } catch (error) {
        
      }
    }

    return (
        <div className='topic'>
            <div className='content'>
              <div className='page-header'>
                <h2>Tópico</h2>
              </div>
              <div>
                <div>
                  <h3>{topic?.title}</h3>
                  <p>{topic?.description}</p>
                </div>
              </div>
              {
                topic?.creator_id === userdata.user_id &&
                topic?.status === 'not_started' &&
                <div className='form'>
                  <h3>Iniciar contagem de votos</h3>
                  <Input
                  name='duration_minutes'
                  label='Duração em minutos'
                  type='number'
                  onChange={e => setSessionForm({ ...sessionForm, duration_minutes: parseInt(e) })}/>
                  <ErrorMessage errors={formErrors['duration_minutes']} />
                  <SubmitBtn className='primary' text='Confirmar' loadingText='Enviando...' loading={loading} onSubmit={onStartTopicSession} />
                </div>
              }
              {
                topic?.creator_id !== userdata.user_id &&
                topic?.status === 'started' &&
                <div className='form'>
                  <h3>Votar</h3>
                  <div className='options'>
                    <button className={voteForm.approved ? 'selected' : ''} onClick={() => setVoteForm({ approved: true })}>Sim</button>
                    <button className={!voteForm.approved ? 'selected' : ''} onClick={() => setVoteForm({ approved: false })}>Não</button>
                  </div>
                  <ErrorMessage errors={formErrors['approved']} />
                  <SubmitBtn className='primary' text='Confirmar' loadingText='Enviando...' loading={loading} onSubmit={onVoteOnTopic} />
                </div>
              }
              {
                topic?.status === 'finished' &&
                <div className='form'>
                  <h3>Resultados</h3>
                  <div>
                    <h4>{resultsMap[results?.result+'']}</h4>
                    <div>
                      <p>Prós: <b>{results?.approved_count}</b></p>
                      <p>Contras: <b>{results?.repproved_count}</b></p>
                    </div>
                  </div>
                </div>
              }
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
