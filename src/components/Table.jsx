function Table({ data }) {
  return (
    <>
      {data.length > 0 && (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>IDMETRO</th>
                <th>UFSIGLA</th>
                <th>MUNICIPIO</th>
                <th>TOPOLOGIA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item["IDMETRO"]}</td>
                    <td>{item["UFSIGLA"]}</td>
                    <td>{item["MUNICIPIO"]}</td>
                    <td>{item["TOPOLOGIA"]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Table;
