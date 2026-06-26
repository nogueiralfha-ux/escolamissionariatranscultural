import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface StudentProfile {
  name: string;
  email: string;
  status: 'active' | 'blocked';
  modulesCompleted: number;
}

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleSubscriptionStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is a simulated local session first
    const localSession = localStorage.getItem('user_session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        setUser({
          uid: 'simulated_user',
          email: parsed.email,
          displayName: parsed.name,
        } as any);
        setProfile({
          name: parsed.name,
          email: parsed.email,
          status: 'active',
          modulesCompleted: 0
        });
        setLoading(false);
        return;
      } catch (e) {
        console.error("Erro ao carregar sessão local simulada:", e);
      }
    }

    let unsubscribeProfile: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Listen to profile changes
        unsubscribeProfile = onSnapshot(doc(db, 'students', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as StudentProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Erro ao carregar perfil. Verifique as regras do Firestore.", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Create student profile simulating a paid state if it doesn't exist
    try {
      const docRef = doc(db, 'students', result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: result.user.displayName || 'Aluno',
          email: result.user.email,
          status: 'active',
          modulesCompleted: 0
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar perfil no Firestore. Verifique as regras de segurança.", error);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('user_session');
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const toggleSubscriptionStatus = async () => {
    if (user && profile) {
      const newStatus = profile.status === 'active' ? 'blocked' : 'active';
      if (user.uid === 'simulated_user') {
        setProfile({ ...profile, status: newStatus });
        return;
      }
      try {
        await setDoc(doc(db, 'students', user.uid), { status: newStatus }, { merge: true });
      } catch (error) {
        console.error("Erro ao alterar status da assinatura no Firestore.", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, toggleSubscriptionStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
