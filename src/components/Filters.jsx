import { useEffect, useState } from "react";
import "./Filters.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { get, ref, set } from "firebase/database";

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

    const novosDados = data.filter(
      (item) =>
        !projetosSelecionados.some(
          (sel) => JSON.stringify(sel) === JSON.stringify(item)
        )
    );

    console.log("Projetos selecionados:", projetosSelecionados);
    console.log("Novos dados após remoção:", novosDados);

    

    const todo = projetosSelecionados.map((projeto) => ({
      IDMETRO: projeto["IDMETRO"] ?? "",
      UFSIGLA: projeto["UFSIGLA"] ?? "",
      MUNICIPIO: projeto["MUNICIPIO"] ?? "",
      TOPOLOGIA: projeto["TOPOLOGIA"] ?? "",
      TIPO_TRANSMISSAO: projeto["TIPO_TRANSMISSAO"] ?? "",
      projetista: user ? user.nome : "Desconhecido",
    }));

    const salvarSitesAlocados = async (todo) => {
      try {

        todo.forEach(async  item => {
          const siteRef = ref(database, `sites/${item.IDMETRO}`);
          await set(siteRef, null);
        });

        // caminho: "sites-alocados"
        const sitesRef = ref(database, "sites-alocados");

        // grava o array todo no Realtime Database
        await set(sitesRef, todo);

        console.log("Sites alocados salvos com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar sites alocados:", error);
      }
    };  

    salvarSitesAlocados(todo);

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
