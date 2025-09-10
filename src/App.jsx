import Navbar from './components/Navbar'
import ClientList from './components/ClientList'

function App() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <ClientList />
      </div>
    </div>
  )
}

export default App
