import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

const ActiveIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://localhost:5000/api/activeIncidents', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setIncidents(response.data);
      } catch (err) {
        // console.error('Error fetching incidents:', err);
        setError('Failed to fetch incidents data');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center pt-[72px]">
        {/* Heading - 8px from top */}
        <h2 className="text-3xl font-bold bg-white p-6 shadow-lg rounded-lg w-full max-w-4xl text-center">
          Active Incidents
        </h2>

        {/* Content Section */}
        <div className="w-full max-w-6xl p-6">
          {loading && <p className="text-center text-lg font-semibold">Loading...</p>}
          {error && <p className="text-red-500 text-center text-lg font-semibold">{error}</p>}
          {incidents.length === 0 ? (
            <p className="text-center mt-6 text-lg text-gray-600">No active incidents found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {incidents.map((incident, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                  {incident.Image && (
                    <img
                      src={incident.Image}
                      alt={`Post by ${incident.Username}`}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{incident.Username}</h3>
                    <p className="text-sm text-gray-700 mb-2">{incident.Text}</p>
                    <p className="text-xs text-gray-500">
                      Posted on: {new Date(incident["Created At"]).toLocaleString()}
                    </p>
                    <div className="flex justify-between mt-4">
                      <span className="text-sm text-gray-600">Retweets: {incident.Retweets}</span>
                      <span className="text-sm text-gray-600">Likes: {incident.Likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActiveIncidents;
