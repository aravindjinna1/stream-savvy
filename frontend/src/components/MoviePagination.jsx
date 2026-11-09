import "./MoviePagination.css";

export default function MoviePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <nav className="movie-pagination" aria-label="Movie pages">
      <p className="movie-pagination-summary" aria-live="polite">
        Showing {firstItem}–{lastItem} of {totalItems} movies
      </p>
      <div className="movie-pagination-controls">
        <button
          className="movie-pagination-button movie-pagination-step"
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <span aria-hidden="true">‹</span>
          <span>Previous</span>
        </button>
        <div className="movie-pagination-numbers">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === page;

            return (
              <button
                key={pageNumber}
                className={`movie-pagination-button movie-pagination-number${
                  isCurrentPage ? " is-current" : ""
                }`}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          className="movie-pagination-button movie-pagination-step"
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </nav>
  );
}
