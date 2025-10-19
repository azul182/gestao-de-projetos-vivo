import { useEffect, useState } from "react";
import "./Filters.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { get, ref, set, update } from "firebase/database";

function Filters({ data }) {
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [numeroSelecionado, setNumeroSelecionado] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const roleRef = ref(database, "users/" + user.uid);
          const snapshot = await get(roleRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            // console.log("Dados do usuário:", data);
            setUser(data);
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

  useEffect(() => {
    if (data.length > 0) {
      const siglas = data
        .map((item) => {
          const valor = item["UFSIGLA"];
          if (!valor) return null;
          return String(valor).slice(0, 2);
        })
        .filter(Boolean);

      const unicos = [...new Set(siglas)];
      setEstados(unicos);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!estadoSelecionado || !numeroSelecionado) {
      alert("Selecione um estado e uma quantidade válida de projetos.");
      return;
    }

    const regex = new RegExp(`^${estadoSelecionado}`, "i");
    const projetosFiltrados = data.filter((item) =>
      regex.test(String(item["UFSIGLA"]))
    );
    const projetosSelecionados = projetosFiltrados.slice(0, numeroSelecionado);

    const todo = projetosSelecionados.map((projeto) => ({
      IDMETRO: projeto["IDMETRO"] ?? "",
      UFSIGLA: projeto["UFSIGLA"] ?? "",
      MUNICIPIO: projeto["MUNICIPIO"] ?? "",
      TOPOLOGIA: projeto["TOPOLOGIA"] ?? "",
      TIPO_TRANSMISSAO: projeto["TIPO_TRANSMISSAO"] ?? "",
      projetista: user ? user.nome : "Desconhecido",
    }));

    const adicionarSitesAlocados = async (todo) => {
      try {
        const updates = {};

        todo.forEach(async  item => {
          const siteRef = ref(database, `sites/${item.IDMETRO}`);
          await set(siteRef, null);
        });

        // transforma array em objeto indexado por IDMETRO
        todo.forEach((site) => {
          const chave = site.IDMETRO;
          if (chave) {
            updates[chave] = site; // vai adicionar ou sobrescrever apenas este site
          }
        });

        // faz update no nó sites-alocados sem apagar outros
        await update(ref(database, "sites-alocados"), updates);

        console.log("Sites adicionados/atualizados sem apagar os antigos!");
      } catch (error) {
        console.error("Erro ao adicionar sites:", error);
      }
    };

    adicionarSitesAlocados(todo);

    // setData(novosDados);
    // setTodo((prev) => [
    //   ...prev,
    //   ...projetosSelecionados.map((projeto) => ({
    //     IDMETRO: projeto["IDMETRO"],
    //     UFSIGLA: projeto["UFSIGLA"],
    //     MUNICIPIO: projeto["MUNICIPIO"],
    //     TOPOLOGIA: projeto["TOPOLOGIA"],
    //     projetista: projetistaSelecionado,
    //   })),
    // ]);
  };

  return (
    <>
      {data.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Estado</label>
            <select
              onChange={(e) => setEstadoSelecionado(e.target.value)}
              value={estadoSelecionado}
            >
              <option value="">Selecione</option>
              {estados.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Número de Projetos</label>
            <input
              type="number"
              min="1"
              onChange={(e) => setNumeroSelecionado(e.target.value)}
              value={numeroSelecionado}
            />
          </div>

          <button type="submit">Adicionar na Fila</button>
        </form>
      )}
    </>
  );
}

export default Filters;
