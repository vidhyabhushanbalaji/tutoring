import React from 'react'
import ReactDom from 'react-dom'

function Modal({ open, children, onClose}){
    if (!open) return null

    //const popupstyle = {position: 'fixed', top: '50%', left: '50%', backgroundColor: '#FFF', padding: '50px', outline: '#000'}
    const popupstyle = {
        outlineStyle: 'solid',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#FFF',
        padding: '50px',
    }

    return ReactDom.createPortal(
        <>
        <div style={popupstyle}>
            {children}
            <button onClick ={onClose}>
                Close
            </button>
        </div>
        </>,
        document.getElementById('root')
    )
}

export default Modal