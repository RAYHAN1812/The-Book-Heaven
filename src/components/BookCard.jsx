import { Link } from 'react-router-dom';
import { IoIosStar } from "react-icons/io";

const BookCard = ({ book }) => {
    const { _id, title, author, category, rating, imageUrl } = book;

    const imgSrc = imageUrl?.startsWith('http')
        ? imageUrl
        : `${import.meta.env.VITE_API_BASE_URL}/${imageUrl}`;

    return (
        <div className="card-style">
            <figure className='h-64'>
                <img src={imgSrc} alt={`Cover of ${title}`} className='object-cover w-full h-full rounded-lg' />
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-xl text-primary">{title}</h2>
                <p className='text-sm text-base-content/80'>By: <span className='font-semibold'>{author}</span></p>
                <div className="badge badge-outline badge-primary">{category}</div>
                <div className="flex items-center gap-1">
                    <IoIosStar className='text-yellow-500 text-lg' />
                    <span className='font-bold'>{rating?.toFixed(1) || 0}</span>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link to={`/book/${_id}`} className="btn-primary-custom btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
