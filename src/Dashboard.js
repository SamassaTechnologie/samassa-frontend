import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://samassa-backend.onrender.com";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("factures");
  const [factures, setFactures] = useState([]);
  const [devis, setDevis] = useState([]);
  const [recus, setRecus] = useState([]);

  // Charger les données une seule fois au démarrage
  useEffect(() => {
    axios.get(`${API_URL}/api/factures`).then(res => setFactures(res.data));
    axios.get(`${API_URL}/api/devis`).then(res => setDevis(res.data));
    axios.get(`${API_URL}/api/recus`).then(res => setRecus(res.data));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 Tableau de bord</h1>

      {/* Onglets */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("factures")}
          className={`px-4 py-2 rounded ${activeTab==="factures" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Factures
        </button>
        <button
          onClick={() => setActiveTab("devis")}
          className={`px-4 py-2 rounded ${activeTab==="devis" ? "bg-green-600 text-white" : "bg-gray-300"}`}
        >
          Devis
        </button>
        <button
          onClick={() => setActiveTab("recus")}
          className={`px-4 py-2 rounded ${activeTab==="recus" ? "bg-yellow-600 text-white" : "bg-gray-300"}`}
        >
          Reçus
        </button>
      </div>

      {/* Tableau factures */}
      {activeTab === "factures" && (
        <table className="w-full border bg-white shadow">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-2 border">Numéro</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {factures.map(f => (
              <tr key={f.id}>
                <td className="border p-2">{f.numero}</td>
                <td className="border p-2">{f.client}</td>
                <td className="border p-2">{f.total} F CFA</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Tableau devis */}
      {activeTab === "devis" && (
        <table className="w-full border bg-white shadow">
          <thead>
            <tr className="bg-green-200">
              <th className="p-2 border">Numéro</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {devis.map(d => (
              <tr key={d.id}>
                <td className="border p-2">{d.numero}</td>
                <td className="border p-2">{d.client}</td>
                <td className="border p-2">{d.total} F CFA</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Tableau reçus */}
      {activeTab === "recus" && (
        <table className="w-full border bg-white shadow">
          <thead>
            <tr className="bg-yellow-200">
              <th className="p-2 border">Numéro</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Montant</th>
              <th className="p-2 border">Moyen</th>
            </tr>
          </thead>
          <tbody>
            {recus.map(r => (
              <tr key={r.id}>
                <td className="border p-2">{r.numero}</td>
                <td className="border p-2">{r.client}</td>
                <td className="border p-2">{r.montant} F CFA</td>
                <td className="border p-2">{r.moyen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
