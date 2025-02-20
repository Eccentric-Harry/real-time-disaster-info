import React, { useState } from "react";

const InfoPage = () => {
  const [selectedState, setSelectedState] = useState("");

  const organizations = [
    { name: "NDRF", contact: "+91-11-23438017", email: "hq.ndrf@nic.in", website: "https://ndrf.gov.in" },
    { name: "NDMA", contact: "+91-11-26701700", email: "info@ndma.gov.in", website: "https://ndma.gov.in" },
    { name: "Sphere India", contact: "+91-11-20811211", email: "contact@sphereindia.org.in", website: "https://www.sphereindia.org.in" },
    { name: "Goonj", contact: "+91-11-41401216", email: "mail@goonj.org", website: "https://goonj.org" }
  ];

  const sdrfData = {
    "Uttar Pradesh": { contact: "+91-7839869302", email: "info@sdrfup.in", website: "https://www.sdrfup.in" },
    "Maharashtra": { contact: "+91-22-22027990", email: "info@sdrfmaha.in", website: "https://www.sdrfmaharashtra.in" },
    "Bihar": { contact: "+91-612-2217305", email: "info@sdrfbihar.in", website: "https://www.sdrfbihar.in" },
    "West Bengal": { contact: "+91-33-22143526", email: "info@sdrfwb.in", website: "https://www.sdrfwb.in" }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">Disaster Response Contacts</h1>
      
      {/* General Organizations */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="p-3 text-left">Organization</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Website</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, index) => (
              <tr key={index} className="border-b hover:bg-gray-200">
                <td className="p-3">{org.name}</td>
                <td className="p-3">{org.contact}</td>
                <td className="p-3">{org.email}</td>
                <td className="p-3">
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                    {org.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* SDRF Dropdown */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Select State SDRF:</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">-- Select a State --</option>
          {Object.keys(sdrfData).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* SDRF Details */}
      {selectedState && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">SDRF Details for {selectedState}</h2>
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Website</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-200">
                <td className="p-3">{sdrfData[selectedState].contact}</td>
                <td className="p-3">{sdrfData[selectedState].email}</td>
                <td className="p-3">
                  <a href={sdrfData[selectedState].website} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                    {sdrfData[selectedState].website}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InfoPage;