export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Account information (email, name, phone)</li>
            <li>• Betting data you manually enter</li>
            <li>• Usage analytics and performance data</li>
            <li>• Payment information (processed by Stripe)</li>
          </ul>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Data</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Provide betting tracking and analytics</li>
            <li>• Process payments and subscriptions</li>
            <li>• Send important account notifications</li>
            <li>• Improve our service and features</li>
          </ul>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
          <p className="text-gray-300">We use industry-standard encryption and security measures to protect your data. Your betting information is private and never shared.</p>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Stripe for payment processing</li>
            <li>• The Odds API for live sports data</li>
            <li>• Analytics services for app improvement</li>
          </ul>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Access your personal data</li>
            <li>• Request data deletion</li>
            <li>• Export your betting history</li>
            <li>• Opt out of marketing emails</li>
          </ul>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300">For privacy questions, email: privacy@bettracker.pro</p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <a href="/" className="text-cyan-400 hover:text-cyan-300 font-semibold">← Back to Dashboard</a>
      </div>
    </div>
  );
}