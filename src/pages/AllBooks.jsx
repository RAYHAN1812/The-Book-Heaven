import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/LoadingSpinner';

const AllBooks = () => {
  const apiAxios = useAxios();
  const [rawBooks, setRawBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('none');

  useEffect(() => {
    setLoading(true);
    apiAxios.get('/books')
      .then(res => setRawBooks(res.data))
      .catch(err => console.error('Error fetching books:', err))
      .finally(() => setLoading(false));
  }, [apiAxios]);

  const sortedBooks = useMemo(() => {
    let currentBooks = [...rawBooks];
    if (sortOrder === 'rating_desc') currentBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortOrder === 'rating_asc') currentBooks.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    return currentBooks;
  }, [rawBooks, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(prev => {
      if (prev === 'rating_desc') return 'rating_asc';
      if (prev === 'rating_asc') return 'none';
      return 'rating_desc';
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="main-heading text-center mb-6">All Books 📚</h1>

      <div className='flex justify-between items-center mb-6 p-4 bg-base-200 rounded-lg shadow-md'>
        <button onClick={handleSortToggle} className="btn btn-outline btn-primary flex items-center gap-2">
          <FaStar />
          <span>
            Sort by Rating: 
            {sortOrder === 'rating_desc' && <> High to Low ⬇️</>}
            {sortOrder === 'rating_asc' && <> Low to High ⬆️</>}
            {sortOrder === 'none' && ' Unsorted'}
          </span>
        </button>
      </div>

      {sortedBooks.length === 0 ? (
        <div className='alert alert-info'>No books found in the collection.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-hover w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th className='text-center'>Rating</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.map((book, index) => (
                <tr key={book._id || index}>
                  <td className='font-semibold'>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <div className="badge badge-outline badge-secondary">{book.genre}</div>
                  </td>
                  <td className='text-center font-bold text-warning flex items-center justify-center gap-1'>
                    <FaStar />{book.rating || 'N/A'}
                  </td>
                  <td>
                    <Link to={`/book/${book._id}`} className="btn btn-sm btn-primary text-white">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBooks;
