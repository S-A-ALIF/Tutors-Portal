import { useState } from 'react';

export default function TestEmailPage() {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    text: '',
    html: '',
    institutionName: '',
    institutionEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Ensure this matches your backend URL and port
      const response = await fetch('http://localhost:5000/api/v1/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                   <h2>Tutors Portal Test Email</h2>
                   <p>${emailData.text}</p>
                 </div>`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email.');
      }

      setMessage({ type: 'success', text: 'Email sent successfully!' });
      setEmailData({ to: '', subject: '', text: '' }); // Clear form
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'An error occurred while sending.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Test Email Service
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Send a quick test email to verify your Nodemailer configuration.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSendEmail}>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                Recipient Email
              </label>
              <div className="mt-1">
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  value={emailData.to}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="test@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <div className="mt-1">
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={emailData.subject}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Hello from Tutors Portal"
                />
              </div>
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Message Body
              </label>
              <div className="mt-1">
                <textarea
                  id="text"
                  name="text"
                  rows="4"
                  required
                  value={emailData.text}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type your test message here..."
                />
              </div>
            </div>

            {message.text && (
              <div
                className={`p-4 rounded-md text-sm ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}