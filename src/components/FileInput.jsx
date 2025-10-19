import * as XLSX from "xlsx";
import "./FileInput.css";

function FileInput( ) {
  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validação simples
    if (!file.name.endsWith(".xlsx")) {
      alert("Por favor, selecione um arquivo .xlsx");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0]; // primeira aba
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

       const sitesObject = jsonData.reduce((acc, site) => {
        if (site.CHAVE_METRO) {
          acc[site.CHAVE_METRO] = site;
        }
        return acc;
      }, {});

      // setData(jsonData);
      console.log("Dados do Excel:", sitesObject);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="file-input-container">
      <label htmlFor="file-upload" className="file-input-label">
        📁 Selecionar Arquivo Excel
      </label>
      <input
        id="file-upload"
        className="file-input"
        type="file"
        onChange={handleFileSubmit}
        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
      <span className="file-helper">Apenas arquivos .xlsx são aceitos</span>
    </div>
  );
}

export default FileInput;
