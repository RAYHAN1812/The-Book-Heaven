import { createContext, useEffect, useState } from 'react';
import { 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import useAxios from '../hooks/useAxios';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiAxios = useAxios();

    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateAuthProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                currentUser.getIdToken()
                    .then(idToken => {
                        console.log('Firebase ID Token:', idToken);
                        apiAxios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
                    })
                    .catch(error => {
                        console.error("Error getting ID token:", error);
                        setUser(null);
                        apiAxios.defaults.headers.common['Authorization'] = '';
                    });
            } else {
                apiAxios.defaults.headers.common['Authorization'] = '';
            }
        });

        return () => unsubscribe();
    }, [apiAxios]);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        logOut,
        updateAuthProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
