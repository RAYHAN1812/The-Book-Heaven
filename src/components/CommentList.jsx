import { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from './LoadingSpinner';
import { formatDistanceToNow, parseISO } from 'date-fns';

const socket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
    transports: ['websocket'],
});

const CommentList = ({ bookId }) => {
    const apiAxios = useAxios();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatCommentDate = (dateStr) => {
        if (!dateStr) return 'Unknown time';
        try {
            return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
        } catch (err) {
            console.error('Error parsing date:', err);
            return 'Unknown time';
        }
    };

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await apiAxios.get(`/books/${bookId}/comments`);
            setComments(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments.');
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!bookId) return;

        fetchComments();

        socket.emit('joinBookRoom', bookId);

        socket.on('newComment', (newComment) => {
            console.log('Received real-time comment:', newComment);
            setComments(prevComments => [...prevComments, newComment]);
        });

        return () => {
            console.log('Cleaning up socket listeners and leaving room.');
            socket.off('newComment');
            socket.emit('leaveBookRoom', bookId);
        };
    }, [bookId, apiAxios]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Comments ({comments.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet. Be the first!</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-base-100 rounded-lg shadow-sm border border-base-200">
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full">
                                    <img src={comment.photoURL} alt={comment.userName} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-primary">{comment.userName}</h4>
                                    <span 
                                        className="text-xs text-gray-500" 
                                        title={comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                                    >
                                        {formatCommentDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-base-content/90 mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentList;
