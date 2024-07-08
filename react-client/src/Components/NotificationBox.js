import React, { useEffect } from 'react'

const NotificationBox = ({ text, setText }) => {
    let notificationContainer = document.getElementById('notification-container');

    useEffect(() => {
        if (text !== '') {
            notificationContainer.classList.remove('hidden');
            setTimeout(handleCloseClick, 5000);
        }
    }, [text])

    const handleCloseClick = () => {
        setText('');
        notificationContainer.classList.add('hidden');
    }

    return (
        <div id='notification-container' className='hidden'>
            <div className='notification flex flex-col justify-center fixed w-1/2 min-h-10 max-h-30 h-10
                    overflow-scroll left-1/4 text-center z-10 border-slate-900 border-2 top-20 rounded-lg
                    text-wrap font-bold text-medium text-white pb-8 pt-8'>
                {text}
                <button onClick={handleCloseClick} className='absolute right-5 text-2xl'>
                    X
                </button>
            </div>
        </div>
    )
}

export default NotificationBox