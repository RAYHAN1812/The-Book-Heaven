import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaStar } from 'react-icons/fa';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';

const MyBooks = () => {
    const { user } = useContext(AuthContext);
    const apiAxios = useAxios();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBooks = () => {
        if (!user?.uid) return;
        setLoading(true);
        apiAxios.get(`/books?userId=${user.uid}`)
            .then(res => setBooks(res.data))
            .catch(err => {
                console.error(err);
                toast.error('Failed to load your books.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMyBooks();
    }, [user, apiAxios]);

    const handleDelete = async (bookId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book? This action is permanent.");
        if (!confirmDelete) return;

        try {
            await apiAxios.delete(`/books/${bookId}`);
            toast.success('Book deleted successfully!');
            fetchMyBooks();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete book.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="main-heading text-center mb-4">My Books 📚</h1>
            <p className='text-center mb-8 text-base-content/70'>Here are all the books you have added to the collection.</p>

            {books.length === 0 ? (
                <div className='alert alert-info max-w-lg mx-auto'>
                    You have not added any books yet. <Link to="/add-book" className='link link-hover font-bold'>Add one now!</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className='text-lg'>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th className='text-center'>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book._id}>
                                    <td className='font-semibold'>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td><div className="badge badge-outline badge-primary">{book.category}</div></td>
                                    <td className='text-center font-bold text-warning flex items-center justify-center gap-1'>
                                        <FaStar />{book.rating}
                                    </td>
                                    <td className='flex gap-2'>
                                        <Link to={`/update-book/${book._id}`} className="btn btn-sm btn-warning text-white tooltip" data-tip="Update">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(book._id)} className="btn btn-sm btn-error text-white tooltip" data-tip="Delete">
                                            <FaTrashAlt />
                                        </button>
                                        <Link to={`/book/${book._id}`} className="btn btn-sm btn-primary text-white">
                                            Details
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

export default MyBooks;
