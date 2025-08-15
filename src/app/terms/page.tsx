export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-black text-white mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-amber-300 mb-3">Age Requirement</h2>
          <p className="text-amber-100">You must be 18 years or older to use BetTracker Pro. Sports betting may be illegal in your jurisdiction.</p>
        </div>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300">By using BetTracker Pro, you agree to these terms. If you disagree, please discontinue use.</p>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
          <p className="text-gray-300">BetTracker Pro is a betting tracking and analytics tool. We do not facilitate gambling or provide betting advice.</p>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• You are responsible for the accuracy of your betting data</li>
            <li>• You must comply with local gambling laws</li>
            <li>• You will not use the service for illegal activities</li>
            <li>• You are responsible for your account security</li>
          </ul>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">4. Subscription Terms</h2>
          <p className="text-gray-300">Pro subscriptions are $0.99/month, billed monthly. Cancel anytime. No refunds for partial months.</p>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-300">BetTracker Pro is provided "as is". We are not liable for any losses from your betting activities.</p>
        </section>

        <section className="bg-gray-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">6. Responsible Gambling</h2>
          <p className="text-gray-300">Gambling can be addictive. Please gamble responsibly. If you need help:</p>
          <ul className="text-cyan-400 mt-2 space-y-1">
            <li>• National Problem Gambling Helpline: 1-800-522-4700</li>
            <li>• GamCare: www.gamcare.org.uk</li>
            <li>• Gamblers Anonymous: www.gamblersanonymous.org</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center">
        <a href="/" className="text-cyan-400 hover:text-cyan-300 font-semibold">← Back to Dashboard</a>
      </div>
    </div>
  );
}