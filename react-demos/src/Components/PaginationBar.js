import React from 'react'

const PaginationBar = ({ currentPage, switchPageFn, startIdx, endIdx, nProducts, isFiltered }) => {
    const productsPerPage = endIdx - startIdx + 1;

    const paginationDisplayArray = () => {
        let Npages = Math.ceil(nProducts / productsPerPage)
        let s = new Set([Npages, currentPage + 20, currentPage + 10, currentPage + 2, currentPage + 1, currentPage, currentPage - 1, currentPage - 2, currentPage - 10, currentPage - 20, 1])
        let a = Array.from(s).sort((a, b) => (a - b));
        return a.filter(x => x > 0 && x <= Npages)
    }

    const displayedItemsText = (isFiltered) ?
        `${startIdx + 1}-${endIdx + 1} of ${nProducts} (filtered)` :
        `${startIdx + 1}-${endIdx + 1} of ${nProducts}`;

    const output =
        <>
            <div>
                {displayedItemsText}
            </div>
            <div>
                {paginationDisplayArray().map(idx => {
                    if (idx == currentPage) {
                        return (<button key={idx} onClick={() => switchPageFn(idx)} className='pagination-active'>
                            Page {idx}
                        </button>)
                    } else {
                        return (<button key={idx} onClick={() => switchPageFn(idx)}>
                            {idx}
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