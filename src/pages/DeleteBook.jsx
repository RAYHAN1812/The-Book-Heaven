import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAxios from '../hooks/useAxios';
import { AuthContext } from '../context/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTrashAlt, FaTimes } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';

const DeleteBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const apiAxios = useAxios();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (!user) return;

        setLoading(true);

        apiAxios.get(`/books/${id}`)
            .then(res => {
                const fetchedBook = res.data;

                if (user.uid === fetchedBook.userId) {
                    setIsOwner(true);
                } else {
                    toast.error("You do not have permission to delete this book.");
                    navigate('/my-books', { replace: true });
                    return;
                }

                setBook(fetchedBook);
            })
            .catch(err => {
                console.error('Error fetching book:', err);
                setError('Failed to load book data for deletion.');
            })
            .finally(() => setLoading(false));
    }, [id, apiAxios, user, navigate]);

    const handleDelete = async () => {
        if (!book || !isOwner) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`);
        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const token = currentUser ? await currentUser.getIdToken() : null;

            await apiAxios.delete(`/books/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });

            toast.success(`Book "${book.title}" deleted successfully!`);
            navigate('/my-books');
        } catch (err) {
            console.error('Error deleting book:', err);
            toast.error(err.response?.data?.message || 'Failed to delete book.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-error my-10">{error}</div>;
    if (!book) return <div className="alert alert-warning my-10">Book not found or unauthorized access.</div>;

    return (
        <div className="max-w-xl mx-auto p-10 bg-gradient-to-r from-red-50 to-red-100 rounded-3xl shadow-2xl border border-red-300 text-center mt-10">
            <h1 className="text-4xl font-extrabold text-red-600 mb-4 animate-pulse">
                Confirm Deletion
            </h1>
            <p className="text-lg font-semibold mb-6 text-red-500">
                Are you absolutely sure you want to delete this book?
            </p>

            <div className="alert alert-warning justify-center text-lg font-bold mb-8 bg-yellow-100 border-yellow-400 shadow-md">
                "{book.title}" by {book.author}
            </div>

            <img
                src={book.imageUrl || book.coverImage}
                alt={`Cover of ${book.title}`}
                className="w-40 h-60 object-cover rounded-xl shadow-lg mx-auto mb-6 border border-red-200"
            />

            <p className="text-sm text-gray-700 mb-8">
                This action is <span className="font-bold text-red-600">permanent</span> and will also delete all associated comments.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow-md hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    disabled={isDeleting}
                >
                    <FaTimes /> Cancel
                </button>

                <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    disabled={isDeleting}
                >
                    <FaTrashAlt /> {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
            </div>
        </div>
    );
};

export default DeleteBook;
