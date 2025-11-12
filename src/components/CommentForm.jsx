import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthProvider';
import useAxios from '../hooks/useAxios';

const CommentForm = ({ bookId }) => {
    const { user } = useContext(AuthContext);
    const apiAxios = useAxios();
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to comment.');
            return;
        }

        if (commentText.trim() === '') {
            toast.error('Comment cannot be empty.');
            return;
        }

        setIsSubmitting(true);

        const newComment = {
            bookId,
            userEmail: user.email,
            userName: user.displayName,
            photoURL: user.photoURL,
            text: commentText.trim(),
        };

        try {
            await apiAxios.post(`/books/${bookId}/comments`, newComment);
            setCommentText('');
            toast.success('Comment posted!');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error(error.response?.data?.message || 'Failed to post comment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Please log in to leave a comment.</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <h3 className="text-2xl font-bold mb-3">Add Your Comment</h3>
            <textarea
                className="textarea textarea-bordered w-full h-24"
                placeholder="Write your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                disabled={isSubmitting}
            ></textarea>
            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    className="btn-primary-custom"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <span className="loading loading-spinner"></span> : 'Post Comment'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
