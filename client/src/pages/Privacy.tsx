export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Last updated: November 28, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              At The Calc Universe, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your information when you use our website and calculator services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>
              <strong>Calculation Data:</strong> All calculations are performed entirely in your browser. 
              We do not collect, transmit, or store any of the numbers or data you enter into our calculators.
            </p>
            <p>
              <strong>Analytics:</strong> We may collect anonymous usage statistics to improve our services, 
              such as which calculators are most popular and general traffic patterns.
            </p>
            <p>
              <strong>Local Storage:</strong> If you choose to save calculations, they are stored only 
              in your browser's local storage and are not accessible to us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Information</h2>
            <ul>
              <li>To provide and maintain our calculator services</li>
              <li>To improve and optimize our website</li>
              <li>To understand how users interact with our tools</li>
              <li>To send newsletters (only if you subscribe)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p>
              We use essential cookies to remember your preferences (like dark mode settings). 
              We may also use analytics cookies to understand usage patterns. You can disable 
              cookies in your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              We may use third-party services for analytics and advertising. These services 
              have their own privacy policies and may collect information as described in 
              their respective policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete any personal information we 
              may have. Since we don't collect calculation data, there's nothing to delete 
              in that regard. For newsletter subscriptions, you can unsubscribe at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@thecalcuniverse.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
