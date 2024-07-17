import React, { useEffect } from 'react'

const NotificationContainer = ({ notifications, deleteNotification, className }) => {

    const handleCloseClick = (index) => {
        let banner = document.getElementById('notification' + index);
        deleteNotification(index);
    }

    // This effect is not optimally implemented, since it is always called when notifications changes
    // (also if a notification is deleted)
    useEffect(() => {
        if (notifications.length > 0) {
            let banner = document.getElementById('notification' + notifications[notifications.length - 1][0]);
            // Automatically hide after 5 seconds
            setTimeout(() => {
                banner.classList.add('hidden');
            }, 5000);
            console.log(notifications.length);
        }
        // Delete old notifications to avoid overflow
        if (notifications.length > 10) {
            deleteNotification(0);
        }
    }, [notifications])

    // non-Tailwind styles
    const styleContainer = {
        maxWidth: '400px',
    }
    const styleItem = {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    }

    return (
        <div id='notification-container'
            className={className}
            style={styleContainer}>

            {notifications.map((notification) => {
                const index = notification[0];
                const message = notification[1];
                return (
                    <div id={'notification' + index} key={index}
                        className='flex flex-row flex-nowrap justify-between items-center gap-2
                                    pb-6 pt-6 pr-2 pl-2
                                    min-h-10 max-h-30 h-10
                                    border-slate-900 border-2 rounded-lg
                                    text-medium text-center text-white font-bold 
                                    text-wrap overflow-scroll'
                        style={styleItem}>

                        <div className='text-small text-wrap'>{message}</div>
                        <button onClick={() => handleCloseClick(index)} className='text-xl font-bold pl-2'>
                            X
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default NotificationContainer