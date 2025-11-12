import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaPhone, FaUser } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white pt-16 pb-10 relative">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          <div className="space-y-4 max-w-sm">
            <NavLink to="/" className="text-4xl font-extrabold hover:scale-105 transition-transform flex items-center gap-2">
              <span>📚</span> Book Haven
            </NavLink>
            <p className="text-base text-white/80">
              Your one-stop destination for books worldwide. Providing reliable book data since 2023.
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <FaUser /> MD RAIHAN - Owner
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <FaPhone /> +880 1610607010
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li><NavLink to="/" className="hover:text-yellow-300 transition">Home</NavLink></li>
              <li><NavLink to="/all-books" className="hover:text-yellow-300 transition">All Books</NavLink></li>
              <li><NavLink to="/add-book" className="hover:text-yellow-300 transition">Add Book</NavLink></li>
              <li><NavLink to="/my-books" className="hover:text-yellow-300 transition">My Books</NavLink></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold mb-2">Follow Us</h2>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/MDRAIHAN181299/" target="_blank" rel="noopener noreferrer"
                 className="text-3xl hover:text-blue-400 transition-transform hover:scale-125">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                 className="text-3xl hover:text-pink-400 transition-transform hover:scale-125">
                <FaInstagram />
              </a>
              <a href="https://x.com/home" target="_blank" rel="noopener noreferrer"
                 className="text-3xl hover:text-sky-400 transition-transform hover:scale-125">
                <FaXTwitter />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
                 className="text-3xl hover:text-blue-600 transition-transform hover:scale-125">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm font-medium text-white/80">
          <p>© 2023 Book Haven. All rights reserved by MD RAIHAN</p>
        </div>
      </div>

      <div className="absolute -top-8 right-10 text-[80px] opacity-10 select-none">📖</div>
    </footer>
  );
};

export default Footer;
