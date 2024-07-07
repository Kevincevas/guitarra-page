import { useEffect, useState } from 'react'
import Guitarra from "./components/Guitarra"
import { Header } from "./components/Header"
import { db } from './data/db'


function App() {

  const initialCarrito = () => {
    const localStorageCarrito = localStorage.getItem('carrito')
    // convertir de string a array
    return localStorageCarrito ? JSON.parse(localStorageCarrito) : []
  }

  const [data] = useState(db)
  const [carrito, setCarrito] = useState(initialCarrito)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1
  
  useEffect(() => {
    // setData(db)
    // convirtiendo de array a string
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])


  const addToCarrito = (item) => {
    // Encuentra el index del array de carrito para encontrar un item en específico
    const itemExists = carrito.findIndex((guitarra) => guitarra.id === item.id)
    if (itemExists >= 0) { //existe en el carrito
      if (carrito[itemExists].quantity >= MAX_ITEMS) return
      const updatedCarrito = [...carrito]
      updatedCarrito[itemExists].quantity++
      setCarrito(updatedCarrito)
      // Guardando en localStorage
    } else {
      item.quantity = 1
      setCarrito([...carrito, item])
    }    
  }

  const removeFromCarrito = (guitarra) => {
    setCarrito( carrito => carrito.filter( item => item.id !== guitarra.id ) )
  }

  const increaseQuantity = (id) => {
    const updatedCarrito = carrito.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCarrito(updatedCarrito)
  }

  const decrementQuantity = (id) => {
    const updatedCarrito = carrito.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCarrito(updatedCarrito)
  }

  const clearCarrito = () => {
    setCarrito([])
  }


  
  return (
    <>
      <Header 
        carrito={carrito}
        removeFromCarrito={removeFromCarrito}
        increaseQuantity={increaseQuantity}
        decrementQuantity={decrementQuantity}
        clearCarrito={clearCarrito}
      />
      

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">

          {
            data.map(guitarra => (
              <Guitarra
                guitarra={guitarra}
                key={guitarra.id}
                carrito={carrito}
                addToCarrito={addToCarrito}
                setCarrito={setCarrito}
              />
            ))
          }
            
            
                  
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
          <div className="container-xl">
              <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
          </div>
      </footer>

    </>
  )
}

export default App
