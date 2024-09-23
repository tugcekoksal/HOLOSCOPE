import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchSubscribers = async () => {
      try {
        // Check authentication
        const authResponse = await fetch('/api/check-auth');
        if (!authResponse.ok) {
          router.push('/admin-signin');
          return;
        }

        // Fetch subscribers
        const subscribersResponse = await fetch('/api/subscribe');
        if (subscribersResponse.ok) {
          const data = await subscribersResponse.json();
          setSubscribers(data.subscribers);
        } else {
          console.error('Failed to fetch subscribers');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchSubscribers();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dashboard - Holoscope</h1>

        <div className="overflow-y-auto max-h-[600px] border border-gray-300 rounded-lg shadow-sm">
          <table className="min-w-full table-auto bg-white rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{subscriber.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(subscriber.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;