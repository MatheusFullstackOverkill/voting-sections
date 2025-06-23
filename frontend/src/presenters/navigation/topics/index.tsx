import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { ListResponse } from 'src/insfrastructure/services/utils'
import { listTopics, Topic } from 'src/insfrastructure/services/topics'
import Table from 'src/presenters/components/table'
import './styles.sass'
import { useSelector } from 'react-redux'
import { User } from 'src/insfrastructure/services/users'
var moment = require('moment-timezone')

export const Topics = () => {
  const userdata = useSelector((state: any) => state.user.userdata) as User
  const [topics, setTopics] = useState<ListResponse<Topic>>({
    data: [],
    count: 0
  })
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const status: Record<string, string> = {
    'not_started': 'Não iniciado',
    'started': 'Aberto para votação',
    'finished': 'Encerrado'
  }

  useEffect(() => {
    onListTopics(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onListTopics = async (offset: number) => {
    try {

      const topics = await listTopics({
        limit: 10,
        offset
      });
      
      setOffset(offset);
      setTopics(topics);
      setLoading(false);
    } catch (error) {
      
    }
  }

  return (
    <div className='topics'>
        <div className='content'>
          <div className='page-header'>
            <h2>Tópicos</h2>
            {userdata.user_id && <Link to={'create'}><button>Criar Tópico</button></Link>}
          </div>
          <Table
          data={topics.data}
          total={topics.count}
          loading={loading}
          offset={offset}
          limit={10}
          onNavigate={({ offset }: any) => {
            onListTopics(offset);
          }}
          header={
            <thead>
              <tr>
                <th className='name'>Tópico:</th>
                <th>Data de publicação:</th>
                <th>Status:</th>
              </tr>
            </thead>}
            body={
              (offers: any) => {
                return offers.map((topic: Topic, index: number) =>
                <tr key={'tr_'+index} >
                  <td>
                    <Link to={topic.topic_id+''}>
                      {topic.title}
                    </Link>
                  </td>
                  <td>
                    <Link to={topic.topic_id+''}>
                      {moment.utc(topic.created_at).format('DD/MM/YYYY HH:mm:ss')}
                    </Link>
                  </td>
                  <td>
                    <Link to={topic.topic_id+''}>
                      {topic.status && status[topic.status]}
                    </Link>
                  </td>
                </tr>
              )}
            }></Table>
        </div>
    </div>
  )
}
