import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { AuthProvider } from './context/AuthContent'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/landing' element={<Landing />} />
            <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
            <Route path='/products' element={<ProtectedRoute> <Products/></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path='/wishlist' element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />
            <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>} />
            <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
            <Route path='/order-success/:id' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
            <Route path='/orders' element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
