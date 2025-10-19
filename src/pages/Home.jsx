import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { auth, database } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import Table from "../components/Table";
import Filters from "../components/Filters";

function Home() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [sitesSeus, setSitesSeus] = useState([]);
  const [sitesAlocaodos, setSitesAlocados] = useState([]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado com sucesso");
        navigate("/login"); // 👈 redireciona para a tela de login
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const roleRef = ref(database, "users/" + user.uid);
          const snapshot = await get(roleRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            // console.log("Dados do usuário:", data);
            setRole(data.role);
            setUsername(data.nome);
          } else {
            console.log("Nenhum dado encontrado para este usuário");
          }
        } catch (error) {
          console.error("Erro ao buscar role:", error);
        }
      } else {
        console.log("Usuário deslogado");
      }
    });

    return () => unsubscribe();
  }, []);

  const objToArray = (obj) => {
    return Object.entries(obj).map(([, value]) => ({
      IDMETRO: value.IDMETRO || "",
      UFSIGLA: value.UFSIGLA || "",
      MUNICIPIO: value.MUNICIPIO || "",
      TOPOLOGIA: value.TOPOLOGIA_METRO || value.TOPOLOGIA || "",
      TIPO_TRANSMISSAO: value.TIPO_TRANSMISSAO || "",
      projetista: value.projetista || "",
    }));
  };

  useEffect(() => {
    const getSites = async () => {
      try {
        const sitesRef = ref(database, "sites/");
        const snapshot = await get(sitesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sitesArray = objToArray(data);
          setSites(sitesArray);
        } else {
          console.log("Nenhum dado encontrado para os sites");
        }
      } catch (error) {
        console.error("Erro ao buscar sites:", error);
      }
    };

    getSites();
  }, []);

  useEffect(() => {
    const getSeusSites = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !username) return;

        const sitesRef = ref(database, `sites-alocados/`);
        const snapshot = await get(sitesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();

          // converte objeto em array
          const sitesArray = objToArray(data);

          setSitesAlocados(sitesArray);

          // filtra apenas os sites do projetista logado
          const meusSites = sitesArray.filter(
            (site) => site.projetista === (username ?? "Desconhecido")
          );

          setSitesSeus(meusSites);
        } else {
          console.log("Nenhum dado encontrado para os sites alocados");
        }
      } catch (error) {
        console.error("Erro ao buscar sites:", error);
      }
    };

    getSeusSites();
  }, [username]);



  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestão de Projetos - Vivo</h1>
        <h2>
          Bem-vindo,{" "}
          {auth.currentUser
            ? auth.currentUser.email
            : "Usuário não autenticado"}
        </h2>
        <button onClick={handleLogout}>Sair</button>
      </header>

      {role === "coordenador" && (
        <div>
          <div>
            <h2>Sites com colaboradores</h2>
            {sitesAlocaodos.length === 0 && <p>Carregando sites...</p>}
            {sitesAlocaodos.length > 0 && <Table data={sitesAlocaodos} />}
          </div>

          <div>
            <h2>Sites sem projeto</h2>
            {sites.length === 0 && <p>Carregando sites...</p>}
            {sites.length > 0 && <Table data={sites} />}
          </div>
        </div>
      )}
      {role === "colaborador" && (
        <div>
          <div>
            {sites.length === 0 && <p>Carregando sites...</p>}
            {sites.length > 0 && <Filters data={sites} />}
          </div>
          <div>
            <h2>Seus projetos:</h2>
            {sitesSeus.length === 0 && <p>Carregando sites...</p>}
            {sitesSeus.length > 0 && <Table data={sitesSeus} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
