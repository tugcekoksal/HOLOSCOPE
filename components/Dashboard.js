// pages/dashboard.js
import dbConnect from '../lib/mongodb';
import Email from '../models/Email';

const Dashboard = ({ emails }) => {
  return (
    <div>
      <h1>Email Subscriptions</h1>
      <ul>
        {emails.map((email) => (
          <li key={email._id}>{email.email} - {new Date(email.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  await dbConnect();
  const emails = await Email.find({}).lean();
  return {
    props: {
      emails: emails.map((email) => ({
        ...email,
        _id: email._id.toString(),
        createdAt: email.createdAt.toISOString(),
      })),
    },
  };
}

export default Dashboard;
