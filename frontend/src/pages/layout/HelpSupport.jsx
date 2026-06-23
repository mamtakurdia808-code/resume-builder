import { useState } from "react";

export default function HelpSupport() {
  const [query, setQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const TEAL = {
  50:  "#E1F5EE",
  100: "#9FE1CB",
  200: "#5DCAA5",
  400: "#1D9E75",
  600: "#0F6E56",
  800: "#085041",
  900: "#04342C",
};

  const faqs = [
  {
    q: "How do I reset my password?",
    a: 'Go to the Settings page and scroll down to "Change password." There you can change it.',
  },
//   {
//     q: "Can I change my plan at any time?",
//     a: "Yes. Upgrades take effect immediately and you're billed the prorated difference. Downgrades apply at the start of your next billing cycle — you keep access to current features until then.",
//   },
//   {
//     q: "How do I invite team members?",
//     a: "Head to Settings → Team, then enter the email addresses of the people you'd like to invite. They'll receive a join link valid for 7 days. You can resend or revoke invites at any time.",
//   },
//   {
//     q: "Where is my data stored?",
//     a: "Your data is stored on servers in the EU (Frankfurt) and US (Virginia) depending on your region. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). You can export or delete it anytime from Account Settings.",
//   },
//   {
//     q: "What happens if I exceed my usage limit?",
//     a: "We'll warn you at 80% and 100% of your limit. Once you hit the cap, new actions are paused until the next billing cycle or until you upgrade. No data is lost — everything resumes when your limit resets.",
//   },
];

  const filteredFaqs = faqs.filter(({ q, a }) =>
    q.toLowerCase().includes(query.toLowerCase()) ||
    a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: 850,
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 8,
          color: TEAL[800],
        }}
      >
        Help & Support
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "1.5rem",
        }}
      >
        Find answers to common questions.
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpenFaqIndex(null);
        }}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: "2rem",
          outline: "none",
          fontSize: 14,
        }}
      />

      {/* FAQ */}
      {filteredFaqs.length === 0 ? (
        <p style={{ color: "#777" }}>No matching questions found.</p>
      ) : (
        filteredFaqs.map(({ q, a }, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              marginBottom: 10,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() =>
                setOpenFaqIndex(openFaqIndex === index ? null : index)
              }
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#fff",
                border: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {q}
              <span>{openFaqIndex === index ? "−" : "+"}</span>
            </button>

            {openFaqIndex === index && (
              <div
                style={{
                  padding: "0 16px 16px",
                  color: "#555",
                  lineHeight: 1.6,
                }}
              >
                {a}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}