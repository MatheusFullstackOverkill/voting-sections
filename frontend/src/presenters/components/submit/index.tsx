import React from 'react'

export const SubmitBtn = ({
    className,
    text,
    loading,
    loadingText,
    onSubmit
}: {
    className: string,
    text: string,
    loading?: boolean,
    loadingText?: string,
    onSubmit?: Function
}) => {
  return (
    <button className={'submit-btn '+className} onClick={() => onSubmit && onSubmit()}>{ !loading ? text : loadingText }</button>
  )
}
