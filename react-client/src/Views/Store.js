import React from 'react';
import StoreContextProvider from '../Contexts/StoreContext';
import StoreMenu from '../Components/Store/StoreMenu';
import StoreBody from '../Components/Store/StoreBody';
import StoreHeader from '../Components/Store/StoreHeader';
import { useEffect } from 'react';

export const currency = 'EUR';

const Store = () => {
    return (
        <StoreContextProvider>
            <div className='flex flex-col flex-nowrap'>
                <StoreHeader />
                <StoreBody />
            </div>
        </StoreContextProvider>
    )
}

export default Store