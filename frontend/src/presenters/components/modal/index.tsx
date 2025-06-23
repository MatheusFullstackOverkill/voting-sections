import React, { Component } from 'react'
import closeIcon from '../../../assets/icons/close.svg'
import './styles.sass'


interface ModalProps {
  render: boolean,
  onClose: () => void,
  children: any
}

export default class Modal extends Component<ModalProps> {
  state = {
    render: false,
    opened: false,
    childrenWithProps: null
  }

  componentDidMount() {
    if(this.props.render) {
      this.setState({ render: true });
      setTimeout(() => {
        this.setState({ opened: true }); 
      });
    } else {
      this.setState({ opened: false });
      setTimeout(() => {
        this.setState({ render: false });
      }, 200);
    };
  }

  componentDidUpdate(prevProps: Readonly<ModalProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if(prevProps.render !== this.props.render) {
      if(this.props.render) {
        this.setState({ render: true });
        setTimeout(() => {
          this.setState({ opened: true }); 
        });
      } else {
        this.setState({ opened: false });
        setTimeout(() => {
          this.setState({ render: false });
        }, 200);
      };
    };
  }

  onClose = () => {
    this.props.onClose();
  }

  render() {
    return this.state.render ?
      <div className={'modal-bg '+(this.state.opened ? 'opened' : '')}>
        <div className='modal'>
          <img className='close-icon' src={closeIcon} onClick={this.onClose} alt='close-icon' />
          {this.props.children}
        </div>
      </div> : 
      <></>
  }
}