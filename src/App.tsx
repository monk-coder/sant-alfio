import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {
    Dashboard,
    Login,
    ProductCreate,
    ProductEdit,
    Products,
    ShipmentCreate,
    ShipmentEdit,
    Shipments,
    Reports,
    ReportCreate,
    ReportEdit,
    Operations,
    OperationCreate,
    OperationEdit,
} from "@pages";
import AuthProvider from '@hooks/AuthProvider';
import PrivateRoute from '@utils/PrivateRoute';
import './App.css'

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            <Route path="/products/create" element={<PrivateRoute><ProductCreate /></PrivateRoute>} />
            <Route path="/products/:id" element={<PrivateRoute><ProductEdit /></PrivateRoute>} />
            <Route path="/shipments" element={<PrivateRoute><Shipments /></PrivateRoute>} />
            <Route path="/shipments/create" element={<PrivateRoute><ShipmentCreate /></PrivateRoute>} />
            <Route path="/shipments/:id" element={<PrivateRoute><ShipmentEdit /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/reports/create" element={<PrivateRoute><ReportCreate /></PrivateRoute>} />
            <Route path="/reports/:id" element={<PrivateRoute><ReportEdit /></PrivateRoute>} />
            <Route path="/operations" element={<PrivateRoute><Operations /></PrivateRoute>} />
            <Route path="/operations/create" element={<PrivateRoute><OperationCreate /></PrivateRoute>} />
            <Route path="/operations/:id" element={<PrivateRoute><OperationEdit /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  )
}

export default App
