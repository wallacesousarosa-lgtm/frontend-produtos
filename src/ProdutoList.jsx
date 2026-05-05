function ProdutoList({
  produtos,
  onEditar,
  onDeletar,
}) {
  return (
    <div
      className="table-responsive"
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        borderRadius: "8px",
      }}
    >
      <table className="table table-striped table-hover align-middle mb-0">

        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3">
                Nenhum produto encontrado
              </td>
            </tr>
          ) : (
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>R$ {produto.preco}</td>
                <td>{produto.quantidade}</td>

                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEditar(produto)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDeletar(produto.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default ProdutoList;