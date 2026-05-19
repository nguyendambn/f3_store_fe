import AllRoute from './components/allRouter/index.allRoute';
function App() {

  const cart = localStorage.getItem("cart");
  const favorite= localStorage.getItem("favorite");
  if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
    
  }
  if(!favorite) {
    localStorage.setItem("favorite", JSON.stringify([]));
  }

  return (
    
      <AllRoute />
    
  );
}

export default App;
