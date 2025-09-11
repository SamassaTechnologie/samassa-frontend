
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://samassa-backend.onrender.com';

function App() {
  const [clientName, setClientName] = useState("Client Test");
  const [items, setItems] = useState([
    { description: "Service informatique", qty: 1, price: 10000 }
  ]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", qty: 1, price: 0 }]);
  };

  const downloadInvoice = async () => {
    const payload = {
      invoice_number: "SAM-001",
      client_name: clientName,
      items
    };
    try {
      const res = await axios.post(`${API_URL}/api/generate_invoice`, payload, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture_${payload.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération de la facture.");
    }
  };

  const downloadDevis = async () => {
    const payload = {
      devis_number: "DEV-001",
      client_name: clientName,
      items
    };
    try {
      const res = await axios.post(`${API_URL}/api/generate_devis`, payload, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `devis_${payload.devis_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération du devis.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">SAMASSA TECHNOLOGIE</h1>
        <p className="text-sm text-gray-600">Tout pour l’informatique</p>
      </header>

      <section className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Informations Client</h2>
        <input
          type="text"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Nom du client"
        />
      </section>

      <section className="mb-6 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Articles</h2>
        {items.map((item, idx) => (
          <div key={idx} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={e => handleItemChange(idx, "description", e.target.value)}
              className="border p-2 flex-1 rounded"
            />
            <input
              type="number"
              placeholder="Qté"
              value={item.qty}
              onChange={e => handleItemChange(idx, "qty", e.target.value)}
              className="border p-2 w-16 rounded"
            />
            <input
              type="number"
              placeholder="Prix"
              value={item.price}
              onChange={e => handleItemChange(idx, "price", e.target.value)}
              className="border p-2 w-24 rounded"
            />
          </div>
        ))}
        <button onClick={addItem} className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
          + Ajouter un article
        </button>
      </section>

      <section>
        <button
          onClick={downloadInvoice}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow"
        >
          Télécharger Facture PDF
        </button>
        <button
          onClick={downloadDevis}
          className="ml-2 px-6 py-2 bg-green-600 text-white rounded shadow"
        >
          Télécharger Devis PDF
        </button>
      </section>

      <footer className="mt-10 text-gray-500 text-sm">
        SAMASSA TECHNOLOGIE — Grand Marché de Kayes — 00223 77291931
      </footer>
    </div>
  );
}

export default App;
