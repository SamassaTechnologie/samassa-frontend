import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://samassa-backend.onrender.com';

function App(){
  const [clients, setClients] = useState([]);
  useEffect(()=> {
    axios.get(`${API_URL}/api/clients`)
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);
  const downloadInvoice = async () => {
    const payload = {
      invoice_number: "SAM-001",
      client_name: "Client Test",
      items: [{description:"Intervention", qty:1, price:15000}]
    };
    try {
      const res = await axios.post(`${API_URL}/api/generate_invoice`, payload, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'facture_SAM-001.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération du PDF. Vérifie l'URL de l'API.");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">SAMASSA TECHNOLOGIE</h1>
        <p className="text-sm text-gray-600">Tout pour l'informatique — Grand Marché de Kayes</p>
      </header>
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Clients (exemple)</h2>
        <ul className="mt-2">
          {clients.map(c => <li key={c.id} className="p-2 bg-white rounded shadow mb-2">{c.name} — {c.phone}</li>)}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Générer une facture</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={downloadInvoice}>Télécharger facture exemple</button>
      </section>
      <footer className="mt-8 text-gray-500 text-sm">
        SAMASSA TECHNOLOGIE — Tél: 00223 77291931 — samassatechnologie10@gmail.com
      </footer>
    </div>
  );
}

export default App;