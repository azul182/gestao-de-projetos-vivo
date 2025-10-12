import { useState } from "react";
import FileInput from "./components/FileInput";
import Filters from "./components/Filters";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [todo, setTodo] = useState([]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestão de Projetos - Vivo</h1>
        <p>Carregue o arquivo Excel e visualize as tarefas de cada projetista</p>
      </header>

      <div className="section-card">
        <FileInput setData={setData} />
      </div>

      <div className="section-card">
        <Filters data={data} setData={setData} setTodo={setTodo} />
      </div>

      <div className="section-card">
        <TodoList todo={todo} />
      </div>
    </div>
  );
}

export default App;
