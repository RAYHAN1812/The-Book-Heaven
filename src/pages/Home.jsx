import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/LoadingSpinner';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const apiAxios = useAxios();
    const [latestBooks, setLatestBooks] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiAxios.get('/books/latest')
            .then(res => setLatestBooks(Array.isArray(res.data) ? res.data : []))
            .catch(() => setLatestBooks([
                { _id: 1, title: 'The Silent Code', author: 'A. N. Programmer', imageUrl: 'https://images.unsplash.com/photo-1593720213428-20a2b0be1775?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price: 20 },
                { _id: 2, title: 'Starfall Protocol', author: 'Elara Vance', imageUrl: 'https://images.unsplash.com/photo-1544865108-7206138676c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price: 25 },
                { _id: 3, title: 'Dragon’s Whisper', author: 'J. R. Elms', imageUrl: 'https://images.unsplash.com/photo-1563200922-386f1e838633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price: 30 },
            ]))
            .finally(() => setLoading(false));
    }, [apiAxios]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition duration-500">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div
                    className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-16 transition-all duration-500 hover:shadow-primary/50"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-150784221734fd-4ba53fb7c3a0?q=80&w=2800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 40%',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/60"></div>
                    <div className="absolute inset-0 flex items-center justify-start p-10">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-xl transition-transform duration-500 hover:scale-[1.02]">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                                Explore <span className="text-secondary dark:text-yellow-400">New Worlds</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-6">
                                Discover, share, and track your favorite books. Dive into our community collection.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/all-books"
                                    className="btn btn-secondary btn-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.05] hover:-translate-y-1"
                                >
                                    Browse All Books
                                </Link>
                                <Link
                                    to="/add-book"
                                    className="btn btn-outline border-white text-white hover:bg-white hover:text-gray-900 btn-lg font-semibold transition-all duration-300 transform hover:scale-[1.05] hover:-translate-y-1"
                                >
                                    Contribute
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-sky-400 dark:to-teal-400">
                        ✨ Latest Community Picks
                    </h2>
                    
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                            {latestBooks.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-12">
                        <Link to="/all-books" className="btn btn-ghost text-primary text-lg hover:bg-primary/10 transition duration-300">
                            See All Books →
                        </Link>
                    </div>
                </section>
                
                <div className="divider my-16 text-gray-400 dark:text-gray-700"></div>

                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
                        <span className="text-primary">Spotlight:</span> Book of the Week 
                    </h2>
                    <div className="card lg:card-side bg-white dark:bg-gray-800 shadow-2xl p-6 lg:p-10 border border-gray-100 dark:border-gray-700 transition duration-500 hover:shadow-xl transform hover:-translate-y-1">
                        <figure className="lg:w-1/3 flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                className="w-full h-full max-h-[400px] object-cover rounded-xl shadow-xl transition-transform duration-500 hover:scale-[1.02]"
                                alt="Book of the Week Cover"
                            />
                        </figure>
                        <div className="card-body p-0 lg:ml-10 mt-6 lg:mt-0 lg:w-2/3">
                            <h3 className="text-4xl font-extrabold text-primary dark:text-sky-300">The Quantum Labyrinth</h3>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">By Alex R. Kepler</p>
                            <p className="py-6 text-gray-700 dark:text-gray-300 leading-relaxed">A thrilling blend of science fiction and mystery, exploring the boundaries of reality and time. Follow Dr. Aris Thorne in a complex world where logic is constantly challenged.</p>
                            <div className="card-actions justify-start">
                                <button className="btn btn-secondary btn-wide text-white font-bold transition duration-300 transform hover:translate-y-[-2px] shadow-md">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-10">
                    <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
                        Explore <span className="text-secondary">Categories</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['Fantasy', 'Sci-Fi', 'Thriller', 'Romance'].map((genre) => (
                            <div
                                key={genre}
                                className="card bg-white dark:bg-gray-800 border-t-4 border-secondary dark:border-yellow-500 shadow-lg text-center p-6 sm:p-8 hover:shadow-2xl hover:scale-[1.03] transition duration-300 transform cursor-pointer"
                            >
                                <h4 className="text-3xl font-bold text-gray-800 dark:text-white">{genre}</h4>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Dive into the curated collection.</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
