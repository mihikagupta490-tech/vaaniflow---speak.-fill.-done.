import { useState } from "react";
import {
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  Globe2,
  Headphones,
  Languages,
  Mic,
  PencilLine,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  WandSparkles,
  Waves,
  X,
  Zap,
} from "lucide-react";

const languages = ["Marathi", "Bengali", "Tamil", "Telugu", "Gujarati", "Kannada", "Malayalam", "Punjabi"];

const steps = [
  { number: "01", title: "Choose language", text: "Select a supported Indian language or let VaaniFlow auto-detect your voice.", icon: Languages, tone: "violet" },
  { number: "02", title: "Choose form", text: "Pick from government, healthcare, education, banking or general forms.", icon: FileText, tone: "blue" },
  { number: "03", title: "Speak naturally", text: "Talk like you normally would. No scripts, keywords or rigid sentence patterns.", icon: Mic, tone: "coral" },
  { number: "04", title: "AI understands", text: "Speech becomes text while important details are mapped to the right fields.", icon: WandSparkles, tone: "mint" },
  { number: "05", title: "Review & edit", text: "Check each answer, speak again, or type directly wherever you need to.", icon: PencilLine, tone: "yellow" },
  { number: "06", title: "Submit", text: "Confirm your information with confidence and send the completed form.", icon: Check, tone: "violet" },
];

const formFields = [
  { label: "Full name", value: "Ananya Kulkarni", status: "confirmed" },
  { label: "Date of birth", value: "17 August 1994", status: "confirmed" },
  { label: "Address", value: "Pune, Maharashtra", status: "review" },
  { label: "Phone number", value: "+91 98765 43210", status: "confirmed" },
];

function Logo() {
  return (
    <a href="#top" className="brand" aria-label="VaaniFlow home">
      <span className="brand-mark" aria-hidden="true">
        <Waves size={18} strokeWidth={2.4} />
        <span className="brand-mark-dot" />
      </span>
      <span>VaaniFlow</span>
    </a>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("Marathi");
  const [isListening, setIsListening] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleMic = () => setIsListening((current) => !current);

  return (
    <main id="top" className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <Logo />
          <nav className={showMenu ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
            <a href="#top">Home</a>
            <a href="#how-it-works">How it works</a>
            <a href="#preview">Forms</a>
            <a href="#languages">Languages</a>
            <a href="#help">Help</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-button" aria-label="Accessibility options" title="Accessibility options">
              <CircleHelp size={18} />
            </button>
            <button className="button button-dark button-small" onClick={() => scrollToId("preview")}>
              Start filling <ArrowRight size={15} />
            </button>
            <button className="menu-button" aria-label="Toggle navigation" onClick={() => setShowMenu((open) => !open)}>
              {showMenu ? <X size={20} /> : <span className="menu-lines"><i /><i /></span>}
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-pulse" /> Voice-first forms for everyone</div>
            <h1>Forms are easier when you can <em>just speak.</em></h1>
            <p className="hero-subtext">Fill digital forms naturally in your preferred Indian language. VaaniFlow understands your voice and turns it into structured information.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => scrollToId("preview")}>Start filling <ArrowRight size={17} /></button>
              <button className="button button-quiet" onClick={() => scrollToId("how-it-works")}><span className="play-icon"><Play size={12} fill="currentColor" /></span> See how it works</button>
            </div>
            <div className="hero-note"><ShieldCheck size={16} /> Your voice stays yours. Review every field before you submit.</div>
          </div>

          <div className="hero-demo-wrap" aria-label="Interactive voice form demo">
            <div className="demo-orbit orbit-one" />
            <div className="demo-orbit orbit-two" />
            <div className="voice-demo-card">
              <div className="demo-topbar">
                <div className="demo-label"><span className="live-dot" /> Live form assistant</div>
                <div className="demo-step">Step 03 <span>/ 06</span></div>
              </div>
              <div className="demo-body">
                <div className="voice-panel">
                  <div className="language-picker-label">Speaking in</div>
                  <button className="language-picker" onClick={() => setSelectedLanguage(selectedLanguage === "Marathi" ? "Bengali" : "Marathi")}>
                    <span className="language-bubble"><Globe2 size={15} /></span>
                    {selectedLanguage}
                    <ChevronDown size={15} />
                  </button>
                  <button className={isListening ? "mic-button listening" : "mic-button"} onClick={handleMic} aria-label={isListening ? "Stop listening" : "Start listening"}>
                    <span className="mic-ring ring-a" /><span className="mic-ring ring-b" />
                    <Mic size={31} strokeWidth={2.1} />
                  </button>
                  <div className="mic-hint">{isListening ? "Listening… tap to pause" : "Tap to speak naturally"}</div>
                  <div className="waveform" aria-hidden="true">
                    {[18, 28, 38, 23, 48, 32, 56, 29, 42, 24, 51, 31, 43, 18, 34, 24, 46, 28, 39, 21, 31, 17].map((height, index) => <i key={index} style={{ height: `${isListening ? height + (index % 3) * 8 : height * 0.62}px`, animationDelay: `${index * 0.035}s` }} />)}
                  </div>
                  <div className="transcription"><span className="transcription-icon"><AudioLines size={13} /></span><span>{isListening ? "माझं नाव अनन्या कुलकर्णी आहे…" : "माझं नाव अनन्या कुलकर्णी आहे"}</span></div>
                </div>
                <div className="demo-form-panel">
                  <div className="form-panel-header"><div><span className="mini-label">Auto-filled fields</span><strong>Personal details</strong></div><span className="ai-chip"><Sparkles size={12} /> AI mapped</span></div>
                  <div className="mini-form-fields">
                    <div className="mini-field"><label>Full name</label><div>Ananya Kulkarni <Check size={13} /></div></div>
                    <div className="mini-field"><label>Age</label><div>30 <Check size={13} /></div></div>
                    <div className="mini-field"><label>City</label><div>Pune <span className="review-dot" /></div></div>
                  </div>
                  <div className="processing-row"><span className="processing-spinner"><Sparkles size={12} /></span> Understanding your answer <span className="processing-dots">···</span></div>
                </div>
              </div>
              <div className="demo-footer"><span><span className="secure-mark"><ShieldCheck size={13} /></span> You’re in control</span><button onClick={() => scrollToId("preview")}>Open full form <ArrowRight size={14} /></button></div>
            </div>
            <div className="floating-note note-one"><span className="note-icon note-icon-mint"><Check size={13} /></span><span><strong>Field understood</strong><small>Confidence 98%</small></span></div>
            <div className="floating-note note-two"><span className="note-icon note-icon-lilac"><Languages size={14} /></span><span><strong>10+ languages</strong><small>and code-switching</small></span></div>
          </div>
        </div>
      </section>

      <section className="language-strip" id="languages">
        <div className="container language-strip-inner">
          <span className="language-intro"><Languages size={16} /> Works in the language you think in</span>
          <div className="language-list">{languages.map((language) => <button key={language} className={selectedLanguage === language ? "language-tag active" : "language-tag"} onClick={() => setSelectedLanguage(language)}>{language}</button>)}<button className="language-tag more">+ more</button></div>
        </div>
      </section>

      <section className="flow-section" id="how-it-works">
        <div className="container">
          <div className="section-heading centered-heading">
            <div className="eyebrow eyebrow-light">A better way to fill forms</div>
            <h2>From voice to <span>done.</span> <br className="desktop-break" />Without the paperwork anxiety.</h2>
            <p>Six simple steps that make every digital form feel a little more human.</p>
          </div>
          <div className="steps-grid">
            {steps.map(({ number, title, text, icon: Icon, tone }) => <article className="step-card" key={number}><div className={`step-icon tone-${tone}`}><Icon size={19} strokeWidth={2.1} /></div><div className="step-number">{number}</div><h3>{title}</h3><p>{text}</p><ArrowRight className="step-arrow" size={17} /></article>)}
          </div>
        </div>
      </section>

      <section className="preview-section" id="preview">
        <div className="container preview-grid">
          <div className="preview-copy">
            <div className="eyebrow">See the difference</div>
            <h2>A form that listens, <em>notices</em> and helps.</h2>
            <p>VaaniFlow doesn’t just transcribe words. It understands what you mean, maps it to the right place and shows you exactly what it heard.</p>
            <div className="feature-list">
              <div><span className="feature-check"><Check size={14} /></span><span><strong>Confidence-based verification</strong><small>Know what’s confirmed and what needs a second look.</small></span></div>
              <div><span className="feature-check"><Check size={14} /></span><span><strong>Voice + typing, together</strong><small>Use the input method that feels easiest in the moment.</small></span></div>
              <div><span className="feature-check"><Check size={14} /></span><span><strong>Read it back to me</strong><small>Hear every answer before you press submit.</small></span></div>
            </div>
            <button className="text-link" onClick={() => scrollToId("help")}>Explore accessibility features <ArrowRight size={15} /></button>
          </div>
          <div className="form-preview-shell">
            <div className="form-preview-head"><div><span className="preview-kicker">Healthcare / Personal details</span><h3>Patient registration</h3></div><div className="progress-ring"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="17" /><circle className="progress-circle" cx="21" cy="21" r="17" /></svg><span>68%</span></div></div>
            <div className="review-banner"><Sparkles size={15} /><span><strong>VaaniFlow filled this in</strong><small>Review the highlighted answer before continuing</small></span><button aria-label="Dismiss review tip"><X size={15} /></button></div>
            <div className="full-form-fields">{formFields.map((field) => <div className={field.status === "review" ? "full-field needs-review" : "full-field"} key={field.label}><label>{field.label}{field.status === "review" && <span>Needs review</span>}</label><div className="full-field-input"><span>{field.value}</span>{field.status === "review" ? <RotateCcw size={15} /> : <Check size={15} />}</div></div>)}</div>
            <div className="form-status-key"><span><Check size={13} /> Confirmed</span><span><span className="key-warning" /> Needs review</span><span><Plus size={13} /> Missing</span></div>
            <div className="form-actions"><button className="read-aloud"><Volume2 size={15} /> Read form aloud</button><button className="button button-primary button-submit" onClick={() => setConfirmed(true)}>{confirmed ? "Form confirmed" : "Confirm & submit"}<ArrowRight size={15} /></button></div>
            {confirmed && <div className="success-toast"><Check size={15} /> Your form is ready to submit.</div>}
          </div>
        </div>
      </section>

      <section className="trust-section" id="help">
        <div className="container trust-inner"><div className="trust-quote"><span className="quote-mark">“</span><p>Designed for first-time users, built for everyone.</p><span className="quote-author">Clear language · thoughtful prompts · no wrong way to begin</span></div><div className="trust-pills"><span><Headphones size={16} /> Read-aloud support</span><span><Zap size={16} /> Fast, natural input</span><span><ShieldCheck size={16} /> Review before submit</span></div></div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner"><div><div className="eyebrow eyebrow-light">Ready when you are</div><h2>Let your voice do<br /><em>the paperwork.</em></h2></div><div className="cta-side"><p>Start with any form. Speak in the language that feels like home.</p><button className="button button-cream" onClick={() => scrollToId("preview")}>Start filling <ArrowRight size={16} /></button></div></div>
      </section>

      <footer className="site-footer"><div className="container footer-inner"><Logo /><p>Speak. Fill. Done.</p><div className="footer-links"><a href="#how-it-works">How it works</a><a href="#languages">Languages</a><a href="#help">Accessibility</a><a href="#help">Help center</a></div><span className="footer-copyright">© 2026 VaaniFlow</span></div></footer>
    </main>
  );
}
