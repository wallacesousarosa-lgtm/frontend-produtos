export default function ProdutoForm({
  nome,
  setNome,
  descricao,
  setDescricao,
  preco,
  setPreco,
  quantidade,
  setQuantidade,
  salvarProduto,
  editandoId,
  formularioValido, 
}) {
  return (
    <form onSubmit={salvarProduto}>

      <input
        className="form-control mb-2"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Preço"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        type="number"
        min="0"
      />

      <input
        className="form-control mb-2"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        type="number"
        min="0"
      />

      {/* BOTÃO */}
      <div className="d-grid mt-3">
        <button
          type="submit"
          className="btn btn-success"
          disabled={!formularioValido}
        >
          {editandoId ? "Atualizar" : "Adicionar"}
        </button>
      </div>

    </form>
  );
}