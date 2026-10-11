
import { useState } from "react";
import "./App.css";

const sections = ["Home", "About", "Services", "FAQs", "SEO metadata"];

function App() {
  const [business, setBusiness] = useState({
    name: "",
    industry: "",
    description: "",
    services: "",
    audience: "",
    tone: "Professional and friendly",
    language: "English",
  });

  const [active, setActive] = useState("Home");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState({});

  function update(event) {
    setBusiness({ ...business, [event.target.name]: event.target.value });
  }
async function generateSample() {
  if (!business.name.trim() || !business.description.trim()) {
    setMessage("Please enter your business name and description first.");
    return;
  }

  setMessage("Generating content...");
  
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business }),
    });

    const text = await response.text();
    console.log("API response:",response.status,text);
    const data=JSON.parse(text);

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate content.");
    }

    setContent(data.content);
    setMessage("Content generated successfully!");
  } catch (error) {
    setMessage("Error: " + error.message);
  }
}


   

  async function copyCurrent() {
  const textToCopy = content[active] || "";

  if (!textToCopy.trim()) {
    setMessage("No content to copy. Generate content first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    setMessage("Content copied successfully!");
  } catch (error) {
    setMessage("Copy failed. Please select the text and press Ctrl+C.");
  }
}

  function exportContent() {
    const blob = new Blob([JSON.stringify({ business, content }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "webcopy-ai-content.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">W</div>
        <p className="eyebrow">CONTENT STUDIO</p>
        <h2>WebCopy AI</h2>
        <p className="muted">Your workspace for business website content.</p>
        <div className="side-list">
          <strong>Project features</strong>
          <span>✓ Business information</span>
          <span>✓ Five content sections</span>
          <span>✓ Content editing</span>
          <span>✓ Export</span>
        </div>
        <p className="side-footer">Code Vibors · Hackathon</p>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">WEBSITE CONTENT GENERATOR</p>
            <h1>Build your website copy.</h1>
            <p className="muted">Start with your business details, then review your content.</p>
          </div>
          <span className="badge">Prototype</span>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">STEP 01</p>
            <h2>Tell us about your business</h2>
            <p>Complete the form to create a first draft of your website content.</p>
          </div>
          <div className="welcome-icon">✦</div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Business brief</h2>
              <p className="muted">Business name and description are required.</p>
            </div>
            <span className="step-label">INPUT</span>
          </div>

          <div className="form-grid">
            <label>Business name *
              <input name="name" value={business.name} onChange={update} placeholder="e.g. BrightPath Digital" />
            </label>
            <label>Industry
              <input name="industry" value={business.industry} onChange={update} placeholder="e.g. Digital marketing" />
            </label>
            <label className="full">Business description *
              <textarea name="description" value={business.description} onChange={update} rows="3" placeholder="What does your business do?" />
            </label>
            <label>Services
              <input name="services" value={business.services} onChange={update} placeholder="SEO, design, social media" />
            </label>
            <label>Target audience
              <input name="audience" value={business.audience} onChange={update} placeholder="e.g. small businesses" />
            </label>
            <label>Brand tone
              <select name="tone" value={business.tone} onChange={update}>
                <option>Professional and friendly</option>
                <option>Premium</option>
                <option>Playful</option>
                <option>Simple and direct</option>
              </select>
            </label>
            <label>Language
              <select name="language" value={business.language} onChange={update}>
                <option>English</option>
                <option>Telugu</option>
                <option>Hindi</option>
                <option>Telugu + English</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button className="primary" onClick={generateSample}>✦ Generate sample content</button>
            <button className="secondary" onClick={() => {
              setBusiness({
                name: "BrightPath Digital",
                industry: "Digital marketing",
                description: "We help small businesses improve their online presence.",
                services: "SEO, website design, social media management",
                audience: "Small businesses",
                tone: "Professional and friendly",
                language: "English",
              });
              setMessage("Example business loaded. Click Generate sample content.");
            }}>Load example</button>
          </div>
          {message && <p className="notice" role="status">{message}</p>}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your website content</h2>
              <p className="muted">Select a section to review or edit it.</p>
            </div>
            <span className="step-label">OUTPUT</span>
          </div>
          <div className="tabs">
            {sections.map((section) => (
              <button key={section} className={active === section ? "tab active" : "tab"} onClick={() => setActive(section)}>
                {section}
              </button>
            ))}
          </div>
          <textarea className="content-editor" value={content[active] || ""} onChange={(event) => setContent({ ...content, [active]: event.target.value })} placeholder="Your content will appear here after you generate a sample." rows="10" />
          {active === "SEO metadata"&&(
          <p className="muted small">
          SEO title and description are suggestions. Review their length and accuracy before publishing.
          </p>
          )}
          <div className="actions">
  <button
    type="button"
    className="secondary"
    onClick={copyCurrent}
    disabled={!(content[active] || "").trim()}
  >
    Copy section
  </button>

  <button
    type="button"
    className="primary"
    onClick={exportContent}
    disabled={Object.keys(content).length === 0}
  >
    Export content
  </button>
</div>
        </section>

        <section className="panel">
          <p className="eyebrow">LIVE PREVIEW</p>
          <h2>{business.name || "Your business name"}</h2>
          <p>{content.Home || "Generate sample content to see your home-page copy here."}</p>
        </section>

        <footer>WebCopy AI · AI integration will be added in a later step.</footer>
      </main>
    </div>
  );

}
export default App;
