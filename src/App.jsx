import { useEffect, useState, useRef } from "react";
import ProdutoForm from "./ProdutoForm";
import ProdutoList from "./ProdutoList";
import "./index.css";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState("");

  // FILTROS
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [qtdMin, setQtdMin] = useState("");
  const [qtdMax, setQtdMax] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  // PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const formRef = useRef(null);

  const mostrarMensagem = (texto, tipo = "success") => {
    setMensagem(texto);
    setTipoMensagem(tipo);

    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  };

  const carregarProdutos = () => {
    fetch("http://localhost:8080/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch(() => mostrarMensagem("Erro ao carregar produtos", "error"));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // RESET DE PAGINA AO FILTRO/BUSCA
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, precoMin, precoMax, qtdMin, qtdMax]);

  const salvarProduto = (e) => {
    e.preventDefault();

    if (!nome || !descricao || !preco || !quantidade) {
      mostrarMensagem("Preencha todos os campos!", "error");
      return;
    }

    const produto = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    };

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId
      ? `http://localhost:8080/produtos/${editandoId}`
      : "http://localhost:8080/produtos";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    })
      .then(() => {
        carregarProdutos();

        setNome("");
        setDescricao("");
        setPreco("");
        setQuantidade("");
        setEditandoId(null);

        mostrarMensagem(
          editandoId
            ? "Produto atualizado com sucesso!"
            : "Produto cadastrado com sucesso!",
          "success"
        );
      })
      .catch(() => mostrarMensagem("Erro ao salvar produto", "error"));
  };

  const editarProduto = (produto) => {
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setQuantidade(produto.quantidade);
    setEditandoId(produto.id);

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const deletarProduto = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?"))
      return;

    fetch(`http://localhost:8080/produtos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        carregarProdutos();
        mostrarMensagem("Produto excluído com sucesso!", "success");
      })
      .catch(() => mostrarMensagem("Erro ao excluir produto", "error"));
  };

  // FILTRO
  const produtosFiltrados = produtos.filter((p) => {
    const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());

    const precoMatch =
      (precoMin === "" || p.preco >= Number(precoMin)) &&
      (precoMax === "" || p.preco <= Number(precoMax));

    const qtdMatch =
      (qtdMin === "" || p.quantidade >= Number(qtdMin)) &&
      (qtdMax === "" || p.quantidade <= Number(qtdMax));

    return nomeMatch && precoMatch && qtdMatch;
  });

  // EXPORTAR APENAS FILTRADOS (IMPORTANTE)
  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Produtos");

    sheet.columns = [
      { header: "Nome", key: "nome", width: 25 },
      { header: "Descrição", key: "descricao", width: 30 },
      { header: "Preço", key: "preco", width: 15 },
      { header: "Quantidade", key: "quantidade", width: 15 },
    ];

    produtosFiltrados.forEach((p) => {
      sheet.addRow({
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        quantidade: p.quantidade,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "produtos.xlsx");
  };

  // PAGINAÇÃO SEGURA
  const totalPaginas = Math.max(
    1,
    Math.ceil(produtosFiltrados.length / itensPorPagina)
  );

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(1);
    }
  }, [totalPaginas]);

  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;

  const produtosPaginados = produtosFiltrados.slice(indiceInicio, indiceFim);

  const irParaPagina = (num) => setPaginaAtual(num);

  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas)
      setPaginaAtual(paginaAtual + 1);
  };

  const limparFiltros = () => {
    setBusca("");
    setPrecoMin("");
    setPrecoMax("");
    setQtdMin("");
    setQtdMax("");
    setPaginaAtual(1);
  };

  return (
    <div className="container mt-4">

      <h1 className="text-center mb-3">Lista de Produtos</h1>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={exportarExcel}>
          Exportar Excel
        </button>
      </div>

      {mensagem && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            color: "white",
            backgroundColor: tipoMensagem === "success" ? "#198754" : "#dc3545",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {mensagem}
        </div>
      )}

      <div className="card p-4 mb-4 shadow-sm border-0" ref={formRef}>
        <ProdutoForm
          nome={nome}
          setNome={setNome}
          descricao={descricao}
          setDescricao={setDescricao}
          preco={preco}
          setPreco={setPreco}
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          salvarProduto={salvarProduto}
          editandoId={editandoId}
          formularioValido={nome && descricao && preco && quantidade}
        />
      </div>

      <input
        className="form-control mb-2"
        placeholder="Buscar produto..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="row mb-2">
        <div className="col-md-3 mb-2">
          <input className="form-control" placeholder="Preço mín"
            type="number" value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value)} />
        </div>

        <div className="col-md-3 mb-2">
          <input className="form-control" placeholder="Preço máx"
            type="number" value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)} />
        </div>

        <div className="col-md-3 mb-2">
          <input className="form-control" placeholder="Qtd mín"
            type="number" value={qtdMin}
            onChange={(e) => setQtdMin(e.target.value)} />
        </div>

        <div className="col-md-3 mb-2 d-grid">
          <button className="btn btn-outline-secondary" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="card p-3 shadow-sm border-0">

        <ProdutoList
          produtos={produtosPaginados}
          onEditar={editarProduto}
          onDeletar={deletarProduto}
        />

        <nav className="mt-3 d-flex justify-content-center">
          <ul className="pagination">

            <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={paginaAnterior}>◀</button>
            </li>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <li key={num} className={`page-item ${paginaAtual === num ? "active" : ""}`}>
                <button className="page-link" onClick={() => irParaPagina(num)}>
                  {num}
                </button>
              </li>
            ))}

            <li className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`}>
              <button className="page-link" onClick={proximaPagina}>▶</button>
            </li>

          </ul>
        </nav>

      </div>
    </div>
  );
}

export default App;