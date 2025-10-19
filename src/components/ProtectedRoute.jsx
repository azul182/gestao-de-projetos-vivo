import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebase";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = ainda carregando

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Enquanto verifica o estado de autenticação
  if (user === undefined) {
    return <div>Carregando...</div>;
  }

  // Se não estiver logado, redireciona para /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza o conteúdo protegido
  return children;
}

export default ProtectedRoute;
