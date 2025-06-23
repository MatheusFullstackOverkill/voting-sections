import { Link } from 'react-router-dom'
import './styles.sass'

export const Footer = () => {
  return (
    <footer>
      <div className='content'>
        <p>Powered by <Link to='https://github.com/MatheusFullstackOverkill' target='_blank'>Matheus G. de Oliveira</Link></p>
      </div>
    </footer>
  )
}
