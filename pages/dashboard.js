// pages/dashboard.js
import React, { useEffect, useState } from 'react';
// import { connectToDatabase } from '../lib/mongodb'; // Adjust the path if necessary

const Dashboard = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    // Fetch subscribers from your API
    const fetchSubscribers = async () => {
      try {
        const response = await fetch('/api/subscribe'); // Ensure your API route exists and works
        const data = await response.json();
        setSubscribers(data.subscribers);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Date Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber._id}>
              <td className="border px-4 py-2">{subscriber.email}</td>
              <td className="border px-4 py-2">{new Date(subscriber.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
