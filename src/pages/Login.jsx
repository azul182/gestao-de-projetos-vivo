import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Define que a sessão deve persistir mesmo após fechar o navegador
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Só faz o login depois que a persistência for configurada
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then(() => {
        // console.log("Usuário logado:", userCredential.user);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });

    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Logar</button>
      </form>
    </div>
  );
}

export default Login;
