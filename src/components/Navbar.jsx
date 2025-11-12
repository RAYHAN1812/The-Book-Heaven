import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthProvider';
import ThemeToggle from './ThemeToggle';
import { FaBars } from 'react-icons/fa';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => toast.success('Logged out successfully!'))
      .catch((error) => {
        console.error(error);
        toast.error('Error logging out.');
      });
  };

  const navLinks = (
    <>
      <li><NavLink to="/" className="hover:text-primary">Home</NavLink></li>
      <li><NavLink to="/all-books" className="hover:text-primary">All Books</NavLink></li>
      {user && <li><NavLink to="/add-book" className="hover:text-primary">Add Book</NavLink></li>}
      {user && <li><NavLink to="/my-books" className="hover:text-primary">My Books</NavLink></li>}
    </>
  );

  return (
    <header className="bg-base-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">

        <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          📚 Book Haven
        </NavLink>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={user.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                    alt={user.displayName || 'User'}
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <span className="justify-between font-semibold">
                    {user.displayName || 'User'}
                  </span>
                </li>
                <li>
                  <button onClick={handleLogOut}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary text-white hidden sm:inline-flex">Register</NavLink>
            </>
          )}

          <div className="lg:hidden dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              <FaBars className="text-lg" />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {navLinks}
              {user ? (
                <>
                  <li className="divider"></li>
                  <li>
                    <span className="font-semibold">{user.displayName || 'User'}</span>
                  </li>
                  <li><button onClick={handleLogOut}>Logout</button></li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
