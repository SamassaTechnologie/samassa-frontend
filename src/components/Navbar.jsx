import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex items-center justify-between">
      <div className="font-bold text-xl">SAMASSA Suite</div>
      <div>
        <a href="#" className="mx-2 hover:underline">Clients</a>
        <a href="#" className="mx-2 hover:underline">Factures</a>
        <a href="#" className="mx-2 hover:underline">Interventions</a>
      </div>
    </nav>
  );
}
