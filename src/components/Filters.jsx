import { useEffect, useState } from "react";
import "./Filters.css";

const projetistas = ["Thiago", "Antonesson", "Victor", "Gabriel", "Albino"];

function Filters({ data, setData, setTodo }) {
  const [estados, setEstados] = useState([]);
  const [projetistaSelecionado, setProjetistaSelecionado] = useState("");
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [numeroSelecionado, setNumeroSelecionado] = useState(0);

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

    setData(novosDados);
    setTodo((prev) => [
      ...prev,
      ...projetosSelecionados.map((projeto) => ({
        IDMETRO: projeto["IDMETRO"],
        UFSIGLA: projeto["UFSIGLA"],
        MUNICIPIO: projeto["MUNICIPIO"],
        TOPOLOGIA: projeto["TOPOLOGIA"],
        projetista: projetistaSelecionado,
      })),
    ]);
  };

  return (
    <>
      {data.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Projetista</label>
            <select
              onChange={(e) => setProjetistaSelecionado(e.target.value)}
              value={projetistaSelecionado}
            >
              <option value="">Selecione</option>
              {projetistas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

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
