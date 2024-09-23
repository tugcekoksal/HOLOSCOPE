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
    return <div>Loading...</div>;
  }

  return (
<div className="container mx-auto p-4">
  <h1 className="text-2xl font-bold mb-4">Dashboard Holoscope</h1>
  
  {/* Add a scrollable div around the table */}
  <div className="overflow-y-auto max-h-[600px] border border-black"> {/* This makes the div scrollable */}
    <table className="table-auto w-full mt-4   z-[99]">
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
</div>
  );
};

export default Dashboard;
