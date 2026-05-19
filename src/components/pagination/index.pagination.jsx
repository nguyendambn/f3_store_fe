function Pagination({ currentPage, totalPages, onPageChange  }) {
    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;

    return (
        <>
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => !isFirst && onPageChange(currentPage - 1)}
                    disabled={isFirst}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Trang trước
                </button>
                <span className="text-sm font-medium text-gray-700">
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => !isLast && onPageChange(currentPage + 1)}
                    disabled={isLast}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === totalPages ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Trang sau
                </button>
            </div>

        </>
    );
}

export default Pagination;
