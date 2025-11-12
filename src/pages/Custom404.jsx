
import { Link } from 'react-router-dom';
import { FaBookOpen, FaHome } from 'react-icons/fa';

const Custom404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
            <h1 className="text-9xl font-extrabold text-error">404</h1>
            <p className="text-3xl font-semibold text-base-content/80 mt-4 mb-6">Page Not Found</p>
            <p className="text-lg text-base-content/70 max-w-md mb-10">
                Oops! It looks like the book you were searching for has been misplaced. Please check the URL or navigate back to the home page.
            </p>
            <div className='flex gap-4'>
                <Link to="/" className="btn-primary-custom">
                    <FaHome /> Go Home
                </Link>
                <Link to="/all-books" className="btn btn-outline btn-primary">
                    <FaBookOpen /> All Books
                </Link>
            </div>
        </div>
    );
};

export default Custom404;