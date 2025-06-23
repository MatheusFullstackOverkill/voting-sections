import { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import './styles.sass'

interface InputOptions { 
  name: string,
  label?: string,
  placeholder?: string,
  type?: string,
  dateFormat?: string,
  showTimeSelect?: boolean,
  value?: any,
  mask?: string,
  readonly?: boolean,
  disabled?: boolean,
  icon?: any,
  passwordIcon?: any,
  onChange?: (value: any) => any
}

export const Input = ({ name, label, placeholder, type, value, icon, mask, readonly, disabled, passwordIcon, onChange }: InputOptions) => {
  const[currentValue, setCurrentValue] = useState(value)
  const[showPassword, togglePassword] = useState(false)

  const onInputChange = (e: any) => {
    onChange && onChange(e.target.value);
    setCurrentValue(e.target.value);
  }

  useEffect(() => {
    setCurrentValue(value);
  }, [value])

  return (
    <div className={'input-container '+type+' '+(disabled ? 'disabled' : '')+(icon ? 'with-icon' : '')}>
      {label && <label>{label}</label>}
      <div className='input'>
        {icon && <img className='icon' src={icon} alt='input-icon' />}
        {
          type === 'textarea' &&
          <textarea
          name={name}
          placeholder={placeholder}
          value={currentValue}
          disabled={disabled}
          readOnly={readonly}
          onChange={onInputChange}>
          </textarea>
        }
        {
          (!type || !['date', 'money', 'textarea'].includes(type)) && !mask &&
          <input
          name={name}
          type={type && !showPassword ? type : 'text'}
          placeholder={placeholder}
          value={currentValue}
          disabled={disabled}
          readOnly={readonly}
          onChange={onInputChange} />
        }
        {
          (!type || !['date', 'money', 'textarea'].includes(type)) && mask &&
          <InputMask
          name={name}
          placeholder={placeholder}
          value={currentValue}
          disabled={disabled}
          mask={mask}
          onChange={onInputChange} />
        }
        {type === 'password' && passwordIcon && 
        <img
        className='icon password-icon'
        src={passwordIcon}
        onClick={() => togglePassword(!showPassword)}
        alt='password-eye-icon' />}
      </div>
    </div>
  )
}