import React, { useEffect } from 'react'

const NotificationBox = ({ notifications, setNotifications }) => {
    let notificationContainer = document.getElementById('notification-container');

    const handleCloseClick = (index) => {
        console.log('notification' + index);
        let banner = document.getElementById('notification' + index);
        banner.classList.add('hidden');
    }

    useEffect(() => {
        if (notifications.length > 0) {
            let banner = document.getElementById('notification' + notifications[notifications.length - 1][0]);
            // Automatically hide after 5 seconds
            setTimeout(() => {
                banner.classList.add('hidden');
            }, 5000);
        }
        // Delete old notifications to avoid overflow
        if (notifications.length > 10) {
            setNotifications([...notifications].slice(10));
        }
    }, [notifications])

    return (
        <div id='notification-container' className='fixed flex flex-col gap-1 top-20 w-1/2 right-2'>
            {notifications.map((notification) => {
                const index = notification[0];
                const message = notification[1];
                return (
                    <div id={'notification' + index} key={index} className='notification flex flex-col justify-center min-h-10 max-h-30 h-10
                    overflow-scroll text-center z-10 border-slate-900 border-2 rounded-lg
                    text-wrap font-bold text-medium text-white pb-8 pt-8'>
                        {message}
                        <button onClick={() => handleCloseClick(index)} className='absolute left-5 text-2xl'>
                            X
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default NotificationBox