import React from 'react';

function SearchBar({ onInputChange }) {
    return (
        <div className='flex flex-row flex-wrap justify-center pb-2 pt-2 gap-2'>
            <input
                id="searchStringInput"
                className='my-auto h-8 rounded-md flex-auto'
                type="text"
                placeholder="Quick search"
                onChange={(e) => onInputChange(e.target.value)}
            />

            <div className='my-auto'>
                <a onClick={ () => {document.getElementById('searchStringInput').value = '' ; onInputChange('')} } className='cursor-pointer'>
                    <strong>Clear filter</strong>
                </a>
            </div>
        </div>
    );
}

export default SearchBar;