import React from 'react'
import ReactDom from 'react-dom'

function Modal({ open, children, onClose}){
    if (!open) return null
    return ReactDom.createPortal(
        <>
            {children}
            <button onClick ={onClose}>
                Close
            </button>
        </>,
        document.getElementById('root')
    )
}

export default Modal