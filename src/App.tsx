import Guitar from "./components/Guitar";
import GuitarForm from "./components/GuitarForm";
import Header from "./components/Header";
import { useCart } from "./hooks/useCart";
function App() {
  const {
    cart,
    data,
    loading,
    error,
    loadGuitars,
    isEmpty,
    cartTotal,
    addToCart,
    decreseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <>
      <Header
        cart={cart}
        decreseQuantity={decreseQuantity}
        increaseQuantity={increaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        {loading && <p className="text-center mt-5">Cargando catálogo...</p>}
        {error && <div className="alert alert-danger mt-5">{error}</div>}
        {!loading && !error && data.length === 0 && (
          <p className="text-center mt-5">Aún no hay guitarras registradas.</p>
        )}

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <GuitarForm onCreated={loadGuitars} />

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
