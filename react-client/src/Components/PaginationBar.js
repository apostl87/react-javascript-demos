import React from 'react'
import { LeftCaret, RightCaret } from './Misc';

const PaginationBar = ({ currentPage, nPages, isFiltered, index1, index2, nProducts, handleClick }) => {
    const caretSize = 5.5;
    const colorDisabled = '#7c7c7c';

    const buttonLabels = ['First', 'Previous', 'Next', 'Last']
    const availablePageNumbers = [1, Math.max(1, currentPage - 1), Math.min(nPages, currentPage + 1), nPages]
    const isDisabled = availablePageNumbers.map((value) => value == currentPage)

    const output =
        <>
            <button onClick={() => handleClick(availablePageNumbers[0])}
                className={"button-pagination min-w-16 flex flex-rows flex-nowrap" + (isDisabled[0] ? ' hover:bg-white' : '')}
                style={isDisabled[0] ? { color: colorDisabled, borderColor: 'white' } : {}}
                disabled={isDisabled[0]}>
                <div className='flex flex-row flex-nowrap items-center'>
                    <LeftCaret size={caretSize} color={isDisabled[0] ? colorDisabled : '#000000'} />
                    <LeftCaret size={caretSize} color={isDisabled[0] ? colorDisabled : '#000000'} />
                    <div className='pl-2'>{buttonLabels[0]}</div>
                </div>
            </button >
            <button onClick={() => handleClick(availablePageNumbers[1])}
                className={"button-pagination min-w-16 flex flex-rows flex-nowrap" + (isDisabled[1] ? ' hover:bg-white' : '')}
                style={isDisabled[1] ? { color: colorDisabled, borderColor: 'white' } : {}}
                disabled={isDisabled[1]}>
                <div className='flex flex-row flex-nowrap items-center'>
                    <LeftCaret size={caretSize} color={isDisabled[1] ? colorDisabled : '#000000'} />
                    <div className='pl-2'>{buttonLabels[1]}</div>
                </div>
            </button >
            <span className='text-nowrap pl-2 pr-2'>
                Products {index1 + 1} - {index2 + 1} of {nProducts} {isFiltered ? '(filtered)' : ''}
                {/* Page {value} of {nPages} */}
            </span>
            <button onClick={() => handleClick(availablePageNumbers[2])}
                className={"button-pagination min-w-16 flex flex-rows flex-nowrap" + (isDisabled[2] ? ' hover:bg-white' : '')}
                style={isDisabled[2] ? { color: colorDisabled, borderColor: 'white' } : {}}
                disabled={isDisabled[2]}>
                <div className='flex flex-row flex-nowrap items-center'>
                    <RightCaret size={caretSize} color={isDisabled[2] ? colorDisabled : '#000000'} />
                    <div className='pl-2'>{buttonLabels[2]}</div>
                </div>
            </button >
            <button onClick={() => handleClick(availablePageNumbers[3])}
                className={"button-pagination min-w-16 flex flex-rows flex-nowrap" + (isDisabled[3] ? ' hover:bg-white' : '')}
                style={isDisabled[3] ? { color: colorDisabled, borderColor: 'white' } : {}}
                disabled={isDisabled[3]}>
                <div className='flex flex-row flex-nowrap items-center'>
                    <RightCaret size={caretSize} color={isDisabled[2] ? colorDisabled : '#000000'} />
                    <RightCaret size={caretSize} color={isDisabled[2] ? colorDisabled : '#000000'} />
                    <div className='pl-2'>{buttonLabels[3]}</div>
                </div>
            </button >
        </>;

    return (
        <div className="pagination flex flex-row flex-wrap gap-1 items-center pb-2 pt-2">
            {nProducts > 0 ? output : ''}
        </div>
    )
}

export default PaginationBar