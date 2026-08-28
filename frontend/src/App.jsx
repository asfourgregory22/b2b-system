import { Routes , Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from "./components/ProtectedRoute"
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Items from './pages/Items'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import NewOrder from './pages/NewOrder'
import Users from './pages/Users'
import CustomerDetail from './pages/CustomerDetail'
import CreateUser from './pages/CreateUser'

function App () {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>

        <Route element = {<ProtectedRoute/>}>        
          <Route   element={<Layout/>}>
            <Route   path="/dashboard"    element={ <Dashboard/> } />
            <Route   path="/items"        element={ <Items/> } /> 
            <Route   path="/orders"       element={ <Orders/> } />
            <Route   path="/orders/new"   element={ <NewOrder/> } />
            <Route   path="/orders/:id"   element={ <OrderDetail/> } />  
            <Route   path="/users"        element={ <Users/> } />
            <Route   path="/users/new"    element={<CreateUser />} />
            <Route   path="/users/:id"    element={<CustomerDetail />} /> 
          </Route>
        </Route>

    </Routes>
  )
}

export default App