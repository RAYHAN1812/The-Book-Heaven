import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import useAxios from '../hooks/useAxios';
import { AuthContext } from '../context/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBookOpen, FaPenFancy, FaTrash } from 'react-icons/fa6';

const UpdateBook = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const apiAxios = useAxios();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    const categories = ['Fiction', 'Non-Fiction', 'Science', 'Fantasy', 'Mystery', 'Biography', 'Other'];

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        apiAxios.get(`/books/${id}`)
            .then(res => {
                const fetchedBook = res.data;
                if (fetchedBook.userId === user.uid) {
                    setIsOwner(true);
                    setBook(fetchedBook);
                    setValue('title', fetchedBook.title);
                    setValue('author', fetchedBook.author);
                    setValue('category', fetchedBook.category);
                    setValue('rating', fetchedBook.rating);
                    setValue('description', fetchedBook.description);
                } else {
                    setIsOwner(false);
                    setBook(fetchedBook);
                }
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load book data.');
            })
            .finally(() => setLoading(false));
    }, [id, apiAxios, user, setValue]);

    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
        if (!imgbbKey) throw new Error('ImgBB API key is missing.');
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.message || 'Image upload failed.');
        return data.data.url;
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        let imageUrl = book.imageUrl;

        try {
            if (data.coverImage && data.coverImage.length > 0) {
                const uploadToast = toast.loading('Uploading new cover image...');
                try {
                    imageUrl = await uploadImageToImgBB(data.coverImage[0]);
                    toast.success('Image uploaded!', { id: uploadToast });
                } catch (err) {
                    toast.error(`Image upload failed: ${err.message}`, { id: uploadToast });
                    setIsSubmitting(false);
                    return;
                }
            }

            const updateData = {
                title: data.title,
                author: data.author,
                category: data.category,
                rating: parseFloat(data.rating),
                description: data.description,
                imageUrl,
            };

            await apiAxios.put(`/books/${id}`, updateData);
            toast.success('Book updated successfully!');
            navigate(`/book/${id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update book.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`);
        if (!confirmDelete) return;

        try {
            setIsSubmitting(true);
            await apiAxios.delete(`/books/${id}`);
            toast.success('Book deleted successfully!');
            navigate('/my-books');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to delete book.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-error my-10">{error}</div>;
    if (!book) return null;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-base-100 rounded-2xl shadow-2xl border border-warning/20 mt-10">
            <h1 className="text-3xl font-extrabold text-center text-warning mb-3">
                {isOwner ? 'Update Book:' : 'Book Details:'} <span className="text-primary">{book.title}</span>
            </h1>
            {!isOwner && (
                <p className="text-center mb-6 text-base-content/70">
                    You cannot edit or delete this book because you are not the owner.
                </p>
            )}
            <div className="flex justify-center mb-6">
                <img 
                    src={book.imageUrl} 
                    alt="Current Cover" 
                    className="w-48 h-64 object-cover rounded-xl shadow-xl border border-base-300"
                />
            </div>

            {isOwner ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Title*</span></label>
                            <input 
                                type="text" 
                                placeholder="Book Title"
                                className="input input-bordered w-full input-primary"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Author*</span></label>
                            <input 
                                type="text" 
                                placeholder="Author Name"
                                className="input input-bordered w-full input-primary"
                                {...register('author', { required: 'Author is required' })}
                            />
                            {errors.author && <span className="text-error text-sm">{errors.author.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Category*</span></label>
                            <select 
                                className="select select-bordered w-full select-primary"
                                {...register('category', { required: 'Category is required' })}
                            >
                                <option value="" disabled>Select a Category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <span className="text-error text-sm">{errors.category.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Rating (1-5)*</span></label>
                            <input 
                                type="number" 
                                step="0.1" 
                                min="1" max="5" 
                                placeholder="Rating"
                                className="input input-bordered w-full input-primary"
                                {...register('rating', { required: 'Rating required', min: 1, max: 5 })}
                            />
                            {errors.rating && <span className="text-error text-sm">{errors.rating.message}</span>}
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">New Cover Image (Optional)</span></label>
                        <input 
                            type="file" 
                            accept="image/*"
                            className="file-input file-input-bordered file-input-primary w-full"
                            {...register('coverImage')}
                        />
                        <p className="text-xs text-base-content/70 mt-1">Leave blank to keep the current image.</p>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Description*</span></label>
                        <textarea 
                            className="textarea textarea-bordered h-32 w-full textarea-primary" 
                            placeholder="Book description..."
                            {...register('description', { required: 'Description is required' })}
                        ></textarea>
                        {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-gradient w-full flex items-center justify-center gap-3 py-3"
                            disabled={isSubmitting}
                        >
                            <FaBookOpen className="text-xl animate-pulse" />
                            <FaPenFancy className="text-xl" />
                            {isSubmitting ? 'Updating...' : 'Update Book'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-error w-full flex items-center justify-center gap-3 py-3 hover:scale-105 transition-transform"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            <FaTrash className="text-xl" />
                            Delete Book
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center text-base-content/70">
                    <p>Owner: {book.userName}</p>
                </div>
            )}

            {isSubmitting && <LoadingSpinner />}
        </div>
    );
};

export default UpdateBook;
