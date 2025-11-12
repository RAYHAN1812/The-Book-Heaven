import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUserEdit, FaTrashAlt, FaStar } from 'react-icons/fa';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { AuthContext } from '../context/AuthProvider';
import { format } from 'date-fns';

const BookDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext); 
    const apiAxios = useAxios();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        setLoading(true);
        apiAxios.get(`/books/${id}`)
            .then(res => {
                const bookData = res.data;

                bookData.createdAt = bookData.createdAt ? new Date(bookData.createdAt) : null;
                bookData.price = bookData.price || 0;
                bookData.rating = bookData.rating || 0;
                bookData.category = bookData.category || 'Uncategorized';
                bookData.description = bookData.description || 'No description available.';
                bookData.userName = bookData.userName || 'Unknown';

                setBook(bookData);
                setIsOwner(user?.uid === bookData.userId);
            })
            .catch(err => {
                console.error('Error fetching book details:', err);
                setError('Failed to load book details. It might not exist.');
            })
            .finally(() => setLoading(false));
    }, [id, apiAxios, user]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-error my-10">{error}</div>;
    if (!book) return <div className="alert alert-warning my-10">Book not found.</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="card lg:card-side bg-base-100 shadow-xl p-6 border border-base-200">
                <figure className="lg:w-1/3 w-full h-96 lg:h-auto">
                    <img 
                        src={book.imageUrl || '/placeholder-image.png'} 
                        alt={`Cover of ${book.title}`} 
                        className="object-cover w-full h-full rounded-lg"
                    />
                </figure>
                <div className="card-body lg:w-2/3 p-4 lg:p-8">
                    <div className='flex justify-between items-start'>
                        <h1 className="text-4xl font-bold text-primary">{book.title}</h1>
                        <div className="flex gap-2">
                            {isOwner && (
                                <>
                                    <Link to={`/update-book/${book._id}`} className="btn btn-sm btn-warning text-white tooltip" data-tip="Update Book">
                                        <FaUserEdit />
                                    </Link>
                                    <Link to={`/delete-book/${book._id}`} className="btn btn-sm btn-error text-white tooltip" data-tip="Delete Book">
                                        <FaTrashAlt />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <p className="text-xl font-semibold text-secondary">by {book.author || 'Unknown Author'}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="badge badge-lg badge-outline badge-primary">{book.category}</div>
                        
                        <div className="flex items-center gap-1 font-bold text-lg text-yellow-500">
                            <FaStar />
                            {book.rating.toFixed(1)} / 5.0
                        </div>
                        
                        <div className="text-2xl font-extrabold text-green-600">${book.price.toFixed(2)}</div>
                        
                        <p className="text-sm text-gray-500">Added by: {book.userName}</p>
                        <p className="text-sm text-gray-500">
                            on: {book.createdAt ? format(book.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                        </p>
                    </div>

                    <div className="divider"></div>

                    <h2 className="text-2xl font-bold text-base-content">Summary</h2>
                    <p className="text-base-content/90 leading-relaxed">{book.description}</p>
                </div>
            </div>

            <div className="mt-10 p-6 bg-base-200 rounded-xl shadow-lg">
                <CommentForm bookId={id} />
                <CommentList bookId={id} />
            </div>
        </div>
    );
};

export default BookDetails;
