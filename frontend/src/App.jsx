import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
     <div>
      <h1>b2b-system</h1>
     </div>
    </AuthProvider>
  );
}

export default App;