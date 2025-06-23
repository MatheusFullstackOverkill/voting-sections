import { Component } from 'react'
import Modal from '../modal'
import successIcon from '../../../assets/icons/success.png'
import errorIcon from '../../../assets/icons/warning.png'
import './styles.sass'

interface ModalProps {
    render: boolean,
    type: 'success' | 'error',
    title: string,
    text?: any,
    onClose: () => void
}  

export default class ResponseModal extends Component<ModalProps> {
  render() {
    return (
      <Modal render={this.props.render} onClose={() => this.props.onClose()}>
        <div className='modal-content'>
          <img src={this.props.type === 'success' ? successIcon : errorIcon} alt={this.props.type+'_icon'} className='icon' />
          <h3>{this.props.title}</h3>
          {this.props.text && this.props.text()}
        </div>
      </Modal>
    )
  }
}
