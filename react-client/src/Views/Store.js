import React from 'react';
import StoreContextProvider from '../Contexts/StoreContext';
import StoreMenu from '../Components/Store/StoreMenu';
import StoreContent from '../Components/Store/StoreContent';

const Store = () => {
    return (
        <StoreContextProvider>
            <div className='flex flex-row flex-nowrap'>
                <StoreMenu />
                <StoreContent />
            </div>
        </StoreContextProvider>
    )
}

export default Store