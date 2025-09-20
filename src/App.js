import React, { useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Dashboard from "./Dashboard";
import { waitForImagesToLoad, genNumero } from "./utils";

const API_URL = process.env.REACT_APP_API_URL || "https://samassa-backend.onrender.com";

function App() {
  const [clientName, setClientName] = useState("Client Test");
  const [items, setItems] = useState([{ description: "Service informatique", qty: 1, price: 10000 }]);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Espèces");
  const [activePage, setActivePage] = useState("home");

  const handleItemChange = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };
  const addItem = () => setItems([...items, { description: "", qty: 1, price: 0 }]);

  // ---------- Helpers to fill HTML blocks ----------
  const fillInvoiceHtml = ({ numero, client, items }) => {
    const tbody = document.getElementById("invoice-rows");
    const numEl = document.getElementById("invoice-number");
    const clientEl = document.getElementById("invoice-client");
    const totalEl = document.getElementById("invoice-total");
    if (!tbody) return 0;
    tbody.innerHTML = "";
    numEl.innerText = numero;
    clientEl.innerText = client;
    let total = 0;
    items.forEach(it => {
      const subtotal = Number(it.qty) * Number(it.price);
      total += subtotal;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:8px;border:1px solid #ddd">${it.description}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center">${it.qty}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${Number(it.price).toLocaleString('fr-FR')}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${subtotal.toLocaleString('fr-FR')}</td>
      `;
      tbody.appendChild(tr);
    });
    totalEl.innerText = `TOTAL : ${total.toLocaleString('fr-FR')} F CFA`;
    return total;
  };

  const fillDevisHtml = ({ numero, client, items }) => {
    const tbody = document.getElementById("devis-rows");
    const numEl = document.getElementById("devis-number");
    const clientEl = document.getElementById("devis-client");
    const totalEl = document.getElementById("devis-total");
    tbody.innerHTML = "";
    numEl.innerText = numero;
    clientEl.innerText = client;
    let total = 0;
    items.forEach(it => {
      const subtotal = Number(it.qty) * Number(it.price);
      total += subtotal;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:8px;border:1px solid #ddd">${it.description}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center">${it.qty}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${Number(it.price).toLocaleString('fr-FR')}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${subtotal.toLocaleString('fr-FR')}</td>
      `;
      tbody.appendChild(tr);
    });
    totalEl.innerText = `TOTAL : ${total.toLocaleString('fr-FR')} F CFA`;
    return total;
  };

  const fillRecuHtml = ({ numero, client, montant, moyen }) => {
    document.getElementById("recu-number").innerText = numero;
    document.getElementById("recu-client").innerText = client;
    document.getElementById("recu-montant").innerText = `${Number(montant).toLocaleString('fr-FR')} F CFA`;
    document.getElementById("recu-moyen").innerText = moyen;
  };

  // ---------- Downloads ----------
  const downloadInvoice = async () => {
    const numero = genNumero("F");
    const payload = { numero, client: clientName, total: items.reduce((s,i)=> s + Number(i.qty)*Number(i.price),0), items };
    try {
      // save to backend
      await axios.post(`${API_URL}/api/factures`, payload);

      // fill html and ensure images loaded
      fillInvoiceHtml(payload);
      const element = document.getElementById("invoice-content");
      await waitForImagesToLoad(element);

      const opt = { margin:10, filename:`facture_${numero}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2, useCORS:true}, jsPDF:{unit:'mm', format:'a4', orientation:'portrait'} };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
      alert("Erreur génération facture. Vérifie la console et l'API.");
    }
  };

  const downloadDevis = async () => {
    const numero = genNumero("D");
    const payload = { numero, client: clientName, total: items.reduce((s,i)=> s + Number(i.qty)*Number(i.price),0), items };
    try {
      await axios.post(`${API_URL}/api/devis`, payload);
      fillDevisHtml(payload);
      const element = document.getElementById("devis-content");
      await waitForImagesToLoad(element);
      const opt = { margin:10, filename:`devis_${numero}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2, useCORS:true}, jsPDF:{unit:'mm', format:'a4', orientation:'portrait'} };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
      alert("Erreur génération devis.");
    }
  };

  const downloadRecu = async () => {
    const numero = genNumero("R");
    const payload = { numero, client: clientName, montant: amount, moyen: paymentMethod };
    try {
      await axios.post(`${API_URL}/api/recus`, payload);
      fillRecuHtml(payload);
      const element = document.getElementById("recu-content");
      await waitForImagesToLoad(element);
      const opt = { margin:10, filename:`recu_${numero}.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2, useCORS:true}, jsPDF:{unit:'mm', format:'a4', orientation:'portrait'} };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
      alert("Erreur génération reçu.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SAMASSA TECHNOLOGIE</h1>
          <p className="text-sm text-gray-600">Tout pour l’informatique</p>
        </div>
        <div>
          <button onClick={() => setActivePage("home")} className={`px-4 py-2 rounded mr-2 ${activePage==="home" ? "bg-blue-600 text-white" : "bg-gray-400"}`}>🏠 Accueil</button>
          <button onClick={() => setActivePage("dashboard")} className={`px-4 py-2 rounded ${activePage==="dashboard" ? "bg-green-600 text-white" : "bg-gray-400"}`}>📊 Tableau de bord</button>
        </div>
      </header>

      {activePage === "home" && <>
        <section className="mb-6 bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Informations Client</h2>
          <input type="text" value={clientName} onChange={e=>setClientName(e.target.value)} className="border p-2 w-full rounded" placeholder="Nom du client"/>
        </section>

        <section className="mb-6 bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Articles</h2>
          {items.map((it, idx)=>(
            <div key={idx} className="flex space-x-2 mb-2">
              <input type="text" placeholder="Description" value={it.description} onChange={e=>handleItemChange(idx,"description",e.target.value)} className="border p-2 flex-1 rounded"/>
              <input type="number" placeholder="Qté" value={it.qty} onChange={e=>handleItemChange(idx,"qty",e.target.value)} className="border p-2 w-16 rounded"/>
              <input type="number" placeholder="Prix" value={it.price} onChange={e=>handleItemChange(idx,"price",e.target.value)} className="border p-2 w-24 rounded"/>
            </div>
          ))}
          <button onClick={addItem} className="mt-2 px-3 py-1 bg-green-600 text-white rounded">+ Ajouter un article</button>
        </section>

        <section className="mb-6 bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Paiement (pour reçu)</h2>
          <input type="number" placeholder="Montant payé" value={amount} onChange={e=>setAmount(e.target.value)} className="border p-2 w-full rounded mb-2"/>
          <input type="text" placeholder="Moyen de paiement" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} className="border p-2 w-full rounded"/>
        </section>

        <section>
          <button onClick={downloadInvoice} className="px-6 py-2 bg-blue-600 text-white rounded shadow">Télécharger Facture PDF</button>
          <button onClick={downloadDevis} className="ml-2 px-6 py-2 bg-green-600 text-white rounded shadow">Télécharger Devis PDF</button>
          <button onClick={downloadRecu} className="ml-2 px-6 py-2 bg-yellow-600 text-white rounded shadow">Télécharger Reçu PDF</button>
        </section>
      </>}

      {activePage === "dashboard" && <Dashboard />}

      <footer className="mt-10 text-gray-500 text-sm">SAMASSA TECHNOLOGIE — Grand Marché de Kayes — 00223 77291931</footer>

      {/* ---------------------------
          Hidden HTML blocks used to generate PDFs
         --------------------------- */}

      {/* Invoice (facture) */}
      <div id="invoice-content" style={{position:"absolute", left:"-9999px", top:0, width:"210mm", padding:20, fontFamily:"Arial"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <img src="/logo.png" alt="logo" style={{height:80}}/>
          <div style={{textAlign:"right"}}>
            <h2>SAMASSA TECHNOLOGIE</h2>
            <div>Grand Marché de Kayes</div>
            <div>00223 77291931</div>
          </div>
        </div>
        <hr style={{margin:"10px 0"}}/>
        <h3 style={{textAlign:"center", margin:"10px 0"}}>FACTURE</h3>
        <div><strong>N° :</strong> <span id="invoice-number"></span></div>
        <div><strong>Client :</strong> <span id="invoice-client"></span></div>
        <table style={{width:"100%", borderCollapse:"collapse", marginTop:12}}>
          <thead>
            <tr style={{background:"#1e3a8a", color:"#fff"}}>
              <th style={{padding:8, border:"1px solid #ddd"}}>Description</th>
              <th style={{padding:8, border:"1px solid #ddd"}}>Qté</th>
              <th style={{padding:8, border:"1px solid #ddd", textAlign:"right"}}>Prix</th>
              <th style={{padding:8, border:"1px solid #ddd", textAlign:"right"}}>Total</th>
            </tr>
          </thead>
          <tbody id="invoice-rows"></tbody>
        </table>
        <h3 id="invoice-total" style={{textAlign:"right", marginTop:12}}></h3>
        <div style={{marginTop:20}}><em>Merci pour votre confiance — SAMASSA TECHNOLOGIE</em></div>
      </div>

      {/* Devis */}
      <div id="devis-content" style={{position:"absolute", left:"-9999px", top:0, width:"210mm", padding:20, fontFamily:"Arial"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <img src="/logo.png" alt="logo" style={{height:80}}/>
          <div style={{textAlign:"right"}}>
            <h2>SAMASSA TECHNOLOGIE</h2>
            <div>Grand Marché de Kayes</div>
            <div>00223 77291931</div>
          </div>
        </div>
        <hr style={{margin:"10px 0"}}/>
        <h3 style={{textAlign:"center", margin:"10px 0"}}>DEVIS</h3>
        <div><strong>N° :</strong> <span id="devis-number"></span></div>
        <div><strong>Client :</strong> <span id="devis-client"></span></div>
        <table style={{width:"100%", borderCollapse:"collapse", marginTop:12}}>
          <thead>
            <tr style={{background:"#059669", color:"#fff"}}>
              <th style={{padding:8, border:"1px solid #ddd"}}>Description</th>
              <th style={{padding:8, border:"1px solid #ddd"}}>Qté</th>
              <th style={{padding:8, border:"1px solid #ddd", textAlign:"right"}}>Prix</th>
              <th style={{padding:8, border:"1px solid #ddd", textAlign:"right"}}>Total</th>
            </tr>
          </thead>
          <tbody id="devis-rows"></tbody>
        </table>
        <h3 id="devis-total" style={{textAlign:"right", marginTop:12}}></h3>
        <div style={{marginTop:20}}><em>Valable 30 jours — SAMASSA TECHNOLOGIE</em></div>
      </div>

      {/* Reçu */}
      <div id="recu-content" style={{position:"absolute", left:"-9999px", top:0, width:"210mm", padding:20, fontFamily:"Arial"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <img src="/logo.png" alt="logo" style={{height:80}}/>
          <div style={{textAlign:"right"}}>
            <h2>SAMASSA TECHNOLOGIE</h2>
            <div>Grand Marché de Kayes</div>
            <div>00223 77291931</div>
          </div>
        </div>
        <hr style={{margin:"10px 0"}}/>
        <h3 style={{textAlign:"center", margin:"10px 0"}}>REÇU DE PAIEMENT</h3>
        <div><strong>N° :</strong> <span id="recu-number"></span></div>
        <div><strong>Reçu de :</strong> <span id="recu-client"></span></div>
        <div><strong>Montant :</strong> <span id="recu-montant"></span></div>
        <div><strong>Moyen :</strong> <span id="recu-moyen"></span></div>
        <div style={{marginTop:30}}>Signature & Cachet :</div>
      </div>
    </div>
  );
}

export default App;
