import React, { useEffect, useState } from "react";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${apiUrl}/clients`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des clients</h2>
      <ul className="bg-white p-4 rounded shadow">
        {clients.length === 0 ? (
          <li>Aucun client trouvé.</li>
        ) : (
          clients.map((client) => (
            <li key={client.id} className="border-b last:border-none py-2">
              <span className="font-semibold">{client.nom}</span><br />
              <span className="text-sm text-gray-600">{client.email} / {client.telephone}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
