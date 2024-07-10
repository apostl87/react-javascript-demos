import React from 'react';

function SearchBar({ onInputChange }) {
    return (
        <div className='flex flex-row justify-center pb-2 pt-2'>
            <input
                id="searchStringInput"
                className='my-auto h-8 w-auto'
                type="text"
                placeholder="Search"
                onChange={(e) => onInputChange(e.target.value)}
            />

            <div className='my-auto pl-2'>
                <a onClick={ () => {document.getElementById('searchStringInput').value = '' ; onInputChange('')} } className='cursor-pointer'>
                    <strong>Clear filter</strong>
                </a>
            </div>
        </div>
    );
}

export default SearchBar;