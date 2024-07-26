import React from 'react'
import { LeftCaret, RightCaret } from './Misc';

const PaginationBar = ({ currentPage, nPages, isFiltered, index1, index2, nProducts, handleClick }) => {
    const caretSize = 5.5;
    const colorDisabled = '#7c7c7c'; // needs to go here due to caret

    const buttonLabels = ['First', 'Previous', 'Next', 'Last']
    const availablePageNumbers = [1, Math.max(1, currentPage - 1), Math.min(nPages, currentPage + 1), nPages]
    const isDisabled = availablePageNumbers.map((value) => value == currentPage)

    const output =
        <>
            <div className='flex'>
                <button onClick={() => handleClick(availablePageNumbers[0])}
                    className={"button-pagination" + (isDisabled[0] ? ' disabled' : '')}
                    style={isDisabled[0] ? { color: colorDisabled } : {}}
                    disabled={isDisabled[0]}>
                    <LeftCaret size={caretSize} color={isDisabled[0] ? colorDisabled : '#000000'} />
                    <LeftCaret size={caretSize} color={isDisabled[0] ? colorDisabled : '#000000'} />
                    <div className='max-sm:hidden pl-2'>{buttonLabels[0]}</div>
                </button >
                <button onClick={() => handleClick(availablePageNumbers[1])}
                    className={"button-pagination" + (isDisabled[1] ? ' disabled' : '')}
                    style={isDisabled[1] ? { color: colorDisabled, borderColor: 'white' } : {}}
                    disabled={isDisabled[1]}>
                    <LeftCaret size={caretSize} color={isDisabled[1] ? colorDisabled : '#000000'} />
                    <div className='max-sm:hidden pl-2'>{buttonLabels[1]}</div>
                </button >
            </div>
            <span className='text-nowrap px-2'>
                Showing {index1 + 1} - {index2 + 1} of {nProducts} {isFiltered ? '(filtered)' : ''}
                {/* Page {value} of {nPages} */}
            </span>
            <div className='flex'>
                <button onClick={() => handleClick(availablePageNumbers[2])}
                    className={"button-pagination" + (isDisabled[2] ? ' disabled' : '')}
                    style={isDisabled[2] ? { color: colorDisabled, borderColor: 'white' } : {}}
                    disabled={isDisabled[2]}>
                    <RightCaret size={caretSize} color={isDisabled[2] ? colorDisabled : '#000000'} />
                    <div className='max-sm:hidden'>{buttonLabels[2]}</div>
                </button >
                <button onClick={() => handleClick(availablePageNumbers[3])}
                    className={"button-pagination" + (isDisabled[3] ? ' disabled' : '')}
                    style={isDisabled[3] ? { color: colorDisabled, borderColor: 'white' } : {}}
                    disabled={isDisabled[3]}>
                    <RightCaret size={caretSize} color={isDisabled[2] ? colorDisabled : '#000000'} />
                    <RightCaret size={caretSize} color={isDisabled[2] ? colorDisabled : '#000000'} />
                    <div className='max-sm:hidden'>{buttonLabels[3]}</div>
                </button >
            </div>
        </>;

    return (
        <div className="pagination">
            {nProducts > 0 ? output : ''}
        </div>
    )
}

export default PaginationBar