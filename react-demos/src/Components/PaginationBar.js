import React from 'react'

const PaginationBar = ({ currentPage, switchPageFn, startIdx, endIdx, nProducts, isFiltered }) => {
    const productsPerPage = endIdx - startIdx + 1;
    let nPages = null

    const paginationDisplayArray = () => {
        nPages = Math.ceil(nProducts / productsPerPage)
        // let s = new Set([Npages, currentPage + 20, currentPage + 10, currentPage + 2, currentPage + 1, currentPage, currentPage - 1, currentPage - 2, currentPage - 10, currentPage - 20, 1])
        // let s = new Set([nPages, currentPage + 1, currentPage, currentPage - 1, 1])
        // let a = Array.from(s).sort((a, b) => (a - b));
        // return a.filter(x => x > 0 && x <= nPages)
        return [1, Math.max(1, currentPage - 1), currentPage, Math.min(nPages, currentPage + 1), nPages]
    }

    const buttonLabels = ['First', 'Previous', '', 'Next', 'Last']

    // const displayedItemsText = (isFiltered) ?
    //     `Items ${startIdx + 1}-${endIdx + 1} of ${nProducts} (filtered)` :
    //     `Items ${startIdx + 1}-${endIdx + 1} of ${nProducts}`;

    const output =
        <>
            {/* <div>
                {displayedItemsText}
            </div> */}
            <div>
                {paginationDisplayArray().map((value, index) => {
                    if (index == 2) {
                        return (
                        <span key={index} onClick={() => switchPageFn(value)} className='pl-2 pr-2'>
                            Page {value} of {nPages}
                        </span>)
                    } else {
                        return (
                        <button key={index} onClick={() => switchPageFn(value)} className='button-pagination'>
                            {buttonLabels[index]}
                        </button>)
                    }
                })}
            </div>
        </>;

    return (
        <div className="pagination flex flex-col gap-2">
            {nProducts > 0 ? output : ''}
        </div>
    )
}

export default PaginationBar