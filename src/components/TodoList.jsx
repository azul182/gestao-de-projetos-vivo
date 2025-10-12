import "./TodoList.css";

function TodoList({ todo }) {
  if (!todo || todo.length === 0) {
    return <></>;
  }

  return (
    <div className="todo-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Projetista</th>
            <th>UFSIGLA</th>
            <th>IDMETRO</th>
            <th>MUNICÍPIO</th>
            <th>TOPOLOGIA</th>
          </tr>
        </thead>
        <tbody>
          {todo.map((item, index) => (
            <tr key={index}>
              <td>{item.projetista || "Sem projetista cadastrados"}</td>
              <td>{item.UFSIGLA}</td>
              <td>{item.IDMETRO ?? "Sem IDMETRO cadastrados"}</td>
              <td>{item.MUNICIPIO || "Sem MUNICÍPIO cadastrados"}</td>
              <td>{item.TOPOLOGIA || "Sem TOPOLOGIA cadastrados"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoList;
