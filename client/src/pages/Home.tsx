import { useMemo, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Edit3,
  FileCheck2,
  FileText,
  Globe2,
  Headphones,
  Languages,
  Menu,
  MessageCircle,
  Mic,
  PencilLine,
  Play,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Volume2,
  WandSparkles,
  Waves,
  X,
} from "lucide-react";

const languages = ["Auto Detect", "Hindi", "Marathi", "Bengali", "Tamil", "Telugu", "Gujarati", "Kannada", "Malayalam", "Punjabi", "English"];
const steps = [
  { number: "01", title: "Language", text: "Choose the language you think in.", icon: Languages, tone: "violet" },
  { number: "02", title: "Form", text: "Pick the form you need to complete.", icon: FileText, tone: "blue" },
  { number: "03", title: "Speak", text: "Tell VaaniFlow what you know.", icon: Mic, tone: "coral" },
  { number: "04", title: "AI processing", text: "Your words become structured answers.", icon: WandSparkles, tone: "mint" },
  { number: "05", title: "Review", text: "Confirm anything that needs a second look.", icon: PencilLine, tone: "yellow" },
  { number: "06", title: "Submit", text: "Send your completed form with confidence.", icon: Check, tone: "violet" },
];

type FieldStatus = "confirmed" | "review" | "missing";
type FormField = { label: string; value: string; status: FieldStatus; helper?: string };

const initialFields: FormField[] = [
  { label: "Full name", value: "Ananya Kulkarni", status: "confirmed" },
  { label: "Date of birth", value: "17 August 1994", status: "confirmed" },
  { label: "Age", value: "30", status: "confirmed" },
  { label: "Address", value: "Pune, Maharashtra", status: "review", helper: "Please confirm this information." },
  { label: "Phone number", value: "+91 98765 43210", status: "confirmed" },
  { label: "Email address", value: "ananya@example.com", status: "confirmed" },
  { label: "Preferred contact", value: "Phone call", status: "confirmed" },
  { label: "Emergency contact", value: "Add information", status: "missing", helper: "Vaani Assistant can ask you for this." },
];

function Logo() {
  return <a href="#top" className="brand" aria-label="VaaniFlow home"><span className="brand-mark" aria-hidden="true"><Waves size={18} strokeWidth={2.4} /><span className="brand-mark-dot" /></span><span>VaaniFlow</span></a>;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function StatusIcon({ status }: { status: FieldStatus }) {
  if (status === "confirmed") return <Check size={15} />;
  if (status === "review") return <RotateCcw size={15} />;
  return <Plus size={15} />;
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("Marathi");
  const [isListening, setIsListening] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([{ from: "ai", text: "Hi! I’ll help you fill this form." }, { from: "ai", text: "What is your date of birth?" }]);
  const [fields, setFields] = useState(initialFields);
  const [activeStep, setActiveStep] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);

  const completedCount = useMemo(() => fields.filter((field) => field.status === "confirmed").length, [fields]);
  const selectedLanguageLabel = selectedLanguage === "Auto Detect" ? "Auto Detect" : selectedLanguage;

  const handleMic = () => {
    setIsListening((current) => !current);
    setActiveStep(isListening ? 4 : 3);
    if (!isListening) {
      window.setTimeout(() => {
        setFields((current) => current.map((field) => field.label === "Emergency contact" ? { ...field, status: "review", value: "Rahul Kulkarni", helper: "Please confirm this information." } : field));
        setActiveStep(4);
      }, 900);
    }
  };

  const readFormAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = fields.map((field) => `${field.label}: ${field.value}`).join(". ");
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const confirmField = (label: string) => setFields((current) => current.map((field) => field.label === label ? { ...field, status: "confirmed", helper: undefined } : field));
  const speakAgain = (label: string) => {
    setAssistantMessages((current) => [...current, { from: "ai", text: `Let’s try ${label} again. Speak naturally when you’re ready.` }]);
    setShowAssistant(true);
    setIsListening(true);
  };
  const sendAssistantMessage = () => {
    const value = assistantText.trim();
    if (!value) return;
    setAssistantMessages((current) => [...current, { from: "user", text: value }, { from: "ai", text: "Got it. I’ll keep that in mind and help you review the next field." }]);
    setAssistantText("");
  };

  return (
    <main id="top" className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap"><Logo /><nav className={showMenu ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          <a href="#top" onClick={() => setShowMenu(false)}>Home</a><a href="#how-it-works" onClick={() => setShowMenu(false)}>How it works</a><a href="#preview" onClick={() => setShowMenu(false)}>Forms</a><a href="#languages" onClick={() => setShowMenu(false)}>Languages</a><a href="#help" onClick={() => setShowMenu(false)}>Help</a>
        </nav><div className="nav-actions"><button className="icon-button" aria-label="Accessibility options" title="Accessibility options"><CircleHelp size={18} /></button><button className="button button-dark button-small" onClick={() => scrollToId("preview")}>Start filling <ArrowRight size={15} /></button><button className="menu-button" aria-label="Toggle navigation" onClick={() => setShowMenu((open) => !open)}>{showMenu ? <X size={20} /> : <Menu size={21} />}</button></div></div>
      </header>

      <section className="hero-section"><div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" /><div className="container hero-grid">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-pulse" /> Voice-first forms for everyone</div><h1>Forms are easier when you can <em>just speak.</em></h1><p className="hero-subtext">Fill digital forms naturally in your preferred Indian language. VaaniFlow understands your voice and turns it into structured information.</p><div className="hero-actions"><button className="button button-primary" onClick={() => scrollToId("preview")}>Start filling <ArrowRight size={17} /></button><button className="button button-quiet" onClick={() => scrollToId("how-it-works")}><span className="play-icon"><Play size={12} fill="currentColor" /></span> See how it works</button></div><div className="hero-note"><ShieldCheck size={16} /> Your voice stays yours. Review every field before you submit.</div></div>
        <div className="hero-demo-wrap" aria-label="Interactive voice form demo"><div className="demo-orbit orbit-one" /><div className="demo-orbit orbit-two" /><div className="voice-demo-card">
          <div className="demo-topbar"><div className="demo-label"><span className="live-dot" /> Live form assistant</div><div className="demo-step">Step {String(activeStep + 1).padStart(2, "0")} <span>/ 06</span></div></div>
          <div className="demo-body"><div className="voice-panel"><div className="language-picker-label">Speaking in</div><select className="language-picker" value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)} aria-label="Select language">{languages.map((language) => <option key={language}>{language}</option>)}</select><button className={isListening ? "mic-button listening" : "mic-button"} onClick={handleMic} aria-label={isListening ? "Stop listening" : "Start listening"}><span className="mic-ring ring-a" /><span className="mic-ring ring-b" />{isListening ? <Square size={28} fill="currentColor" /> : <Mic size={31} strokeWidth={2.1} />}</button><div className="mic-state">{isListening ? "Listening..." : "Tap to Speak"}</div><div className="mic-hint">Speak naturally in your preferred language.</div><div className="waveform" aria-label={isListening ? "Voice waveform active" : "Voice waveform ready"} aria-hidden="true">{[18, 28, 38, 23, 48, 32, 56, 29, 42, 24, 51, 31, 43, 18, 34, 24, 46, 28].map((height, index) => <i key={index} style={{ height: `${isListening ? height + (index % 3) * 8 : height * 0.62}px`, animationDelay: `${index * 0.035}s` }} />)}</div><div className="voice-controls"><button onClick={() => setIsListening(false)} disabled={!isListening}><Square size={12} /> Stop</button><button onClick={() => setIsListening(false)}><X size={13} /> Cancel</button><button onClick={handleMic}><RotateCcw size={13} /> Speak again</button></div><div className="transcription"><span className="transcription-icon"><AudioLines size={13} /></span><span>{isListening ? "माझं नाव अनन्या कुलकर्णी आहे…" : "माझं नाव अनन्या कुलकर्णी आहे"}</span></div></div>
            <div className="demo-form-panel"><div className="form-panel-header"><div><span className="mini-label">Automatic field filling</span><strong>Personal details</strong></div><span className="ai-chip"><Sparkles size={12} /> AI understood</span></div><div className="mini-form-fields">{fields.slice(0, 3).map((field) => <div className="mini-field" key={field.label}><label>{field.label}</label><div>{field.value}<StatusIcon status={field.status} /></div></div>)}</div><div className="processing-row"><span className="processing-spinner"><Sparkles size={12} /></span> {isListening ? "Listening to your answer" : "Fields update as you speak"}<span className="processing-dots">···</span></div></div></div>
          <div className="demo-footer"><span><span className="secure-mark"><ShieldCheck size={13} /></span> You’re in control</span><button onClick={() => scrollToId("preview")}>Open full form <ArrowRight size={14} /></button></div>
        </div><div className="floating-note note-one"><span className="note-icon note-icon-mint"><Check size={13} /></span><span><strong>Field understood</strong><small>Confidence 98%</small></span></div><div className="floating-note note-two"><span className="note-icon note-icon-lilac"><Languages size={14} /></span><span><strong>10+ languages</strong><small>and code-switching</small></span></div></div>
      </div></section>

      <section className="journey-bar" aria-label="VaaniFlow journey"><div className="container journey-steps">{steps.map((step, index) => <button key={step.number} className={index === activeStep ? "journey-step active" : index < activeStep ? "journey-step complete" : "journey-step"} onClick={() => setActiveStep(index)}><span>{index < activeStep ? <Check size={13} /> : step.number}</span><strong>{step.title}</strong>{index < steps.length - 1 && <ArrowRight size={14} className="journey-arrow" />}</button>)}</div></section>

      <section className="language-strip" id="languages"><div className="container language-strip-inner"><span className="language-intro"><Languages size={16} /> Works in the language you think in</span><div className="language-list">{languages.map((language) => <button key={language} className={selectedLanguage === language ? "language-tag active" : "language-tag"} onClick={() => setSelectedLanguage(language)}>{language}</button>)}</div></div></section>

      <section className="flow-section" id="how-it-works"><div className="container"><div className="section-heading centered-heading"><div className="eyebrow eyebrow-light">A better way to fill forms</div><h2>From voice to <span>done.</span> <br className="desktop-break" />Without the paperwork anxiety.</h2><p>Six simple steps that make every digital form feel a little more human.</p></div><div className="steps-grid">{steps.map(({ number, title, text, icon: Icon, tone }) => <article className="step-card" key={number}><div className={`step-icon tone-${tone}`}><Icon size={19} strokeWidth={2.1} /></div><div className="step-number">{number}</div><h3>{title}</h3><p>{text}</p><ArrowRight className="step-arrow" size={17} /></article>)}</div></div></section>

      <section className="preview-section" id="preview"><div className="container preview-grid"><div className="preview-copy"><div className="eyebrow">See the difference</div><h2>A form that listens, <em>notices</em> and helps.</h2><p>VaaniFlow doesn’t just transcribe words. It understands what you mean, maps it to the right place and shows you exactly what it heard.</p><div className="feature-list"><div><span className="feature-check"><Check size={14} /></span><span><strong>Confidence-based verification</strong><small>Know what’s confirmed and what needs a second look.</small></span></div><div><span className="feature-check"><Check size={14} /></span><span><strong>Voice + typing, together</strong><small>Use the input method that feels easiest in the moment.</small></span></div><div><span className="feature-check"><Check size={14} /></span><span><strong>Read it back to me</strong><small>Hear every answer before you press submit.</small></span></div></div><button className="text-link" onClick={() => setShowAssistant(true)}>Ask Vaani Assistant for help <ArrowRight size={15} /></button></div>
        <div className="form-preview-shell"><div className="review-heading"><div><span className="preview-kicker">Healthcare / Personal details</span><h3>Review your information before submitting.</h3></div><div className="completion-count"><strong>{completedCount} of {fields.length}</strong><span>fields completed</span></div></div><div className="review-banner"><Sparkles size={15} /><span><strong>VaaniFlow filled this in</strong><small>Review highlighted answers. Nothing submits without your confirmation.</small></span><button aria-label="Dismiss review tip"><X size={15} /></button></div><div className="full-form-fields">{fields.map((field) => <div className={field.status === "review" ? "full-field needs-review" : field.status === "missing" ? "full-field missing-field" : "full-field"} key={field.label}><label>{field.label}<span className={`status-label status-${field.status}`}>{field.status === "confirmed" ? "Confirmed" : field.status === "review" ? "Needs review" : "Missing"}</span></label>{editingLabel === field.label ? <input className="full-field-input edit-input" autoFocus defaultValue={field.value} onBlur={(event) => { setFields((current) => current.map((item) => item.label === field.label ? { ...item, value: event.target.value, status: "confirmed" } : item)); setEditingLabel(null); }} onKeyDown={(event) => { if (event.key === "Enter") (event.target as HTMLInputElement).blur(); }} /> : <button className="full-field-input" onClick={() => field.status === "missing" ? setShowAssistant(true) : setEditingLabel(field.label)}><span>{field.value}</span><StatusIcon status={field.status} /></button>}{field.helper && <small className="field-helper">{field.helper}</small>}{field.status === "review" && <div className="field-actions"><button onClick={() => confirmField(field.label)}><Check size={13} /> Confirm</button><button onClick={() => speakAgain(field.label)}><Mic size={13} /> Speak Again</button><button onClick={() => setEditingLabel(field.label)}><Edit3 size={13} /> Edit</button></div>}</div>)}</div><div className="form-status-key"><span><Check size={13} /> Confirmed</span><span><span className="key-warning" /> Needs review</span><span><Plus size={13} /> Missing</span></div><div className="form-actions"><div className="review-secondary-actions"><button className="read-aloud" onClick={readFormAloud}><Volume2 size={15} /> Read form aloud</button><button className="read-aloud" onClick={() => speakAgain("the missing information")}><Mic size={15} /> Speak again</button><button className="read-aloud" onClick={() => setShowAssistant(true)}><Plus size={15} /> Add information</button></div><button className="button button-primary button-submit" onClick={() => { setSubmitted(true); setActiveStep(5); }}>{submitted ? "Submitted successfully" : "Confirm & submit"}<ArrowRight size={15} /></button></div>{submitted && <div className="success-toast"><FileCheck2 size={15} /> Your information is confirmed and ready.</div>}</div>
      </div></section>

      <section className="trust-section" id="help"><div className="container trust-inner"><div className="trust-quote"><span className="quote-mark">“</span><p>Designed for first-time users, built for everyone.</p><span className="quote-author">Clear language · thoughtful prompts · no wrong way to begin</span></div><div className="trust-pills"><span><Headphones size={16} /> Read-aloud support</span><span><ZapIcon /> Fast, natural input</span><span><ShieldCheck size={16} /> Review before submit</span></div></div></section>

      <section className="final-cta"><div className="container final-cta-inner"><div><div className="eyebrow eyebrow-light">Ready when you are</div><h2>Let your voice do<br /><em>the paperwork.</em></h2></div><div className="cta-side"><p>Start with any form. Speak in the language that feels like home.</p><button className="button button-cream" onClick={() => scrollToId("preview")}>Start filling <ArrowRight size={16} /></button></div></div></section>
      <footer className="site-footer"><div className="container footer-inner"><Logo /><p>Speak. Fill. Done.</p><div className="footer-links"><a href="#how-it-works">How it works</a><a href="#languages">Languages</a><a href="#help">Accessibility</a><a href="#help">Help center</a></div><span className="footer-copyright">© 2026 VaaniFlow</span></div></footer>

      <button className="assistant-fab" onClick={() => setShowAssistant(true)} aria-label="Open Vaani Assistant"><span className="assistant-fab-icon"><MessageCircle size={21} /></span><span>Vaani Assistant</span></button>
      {showAssistant && <div className="assistant-overlay" onClick={() => setShowAssistant(false)}><aside className="assistant-panel" onClick={(event) => event.stopPropagation()}><div className="assistant-head"><div><span className="assistant-avatar"><Bot size={19} /></span><div><strong>Vaani Assistant</strong><small><span className="assistant-online" /> Ready to help</small></div></div><button className="assistant-close" onClick={() => setShowAssistant(false)} aria-label="Close assistant"><X size={19} /></button></div><div className="assistant-body">{assistantMessages.map((message, index) => <div className={message.from === "ai" ? "assistant-message ai" : "assistant-message user"} key={`${message.text}-${index}`}>{message.from === "ai" && <span className="assistant-mini-avatar"><Sparkles size={12} /></span>}<p>{message.text}</p></div>)}<button className="assistant-speak-again" onClick={() => { setIsListening(true); setAssistantMessages((current) => [...current, { from: "ai", text: "I’m listening. Speak naturally in your preferred language." }]); }}><Mic size={15} /> Speak Again</button></div><div className="assistant-composer"><button className={isListening ? "assistant-mic active" : "assistant-mic"} onClick={handleMic} aria-label="Talk to Vaani Assistant"><Mic size={18} /></button><input value={assistantText} onChange={(event) => setAssistantText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendAssistantMessage()} placeholder="Type a message..." aria-label="Message Vaani Assistant" /><button className="send-button" onClick={sendAssistantMessage} aria-label="Send message"><Send size={17} /></button></div></aside></div>}
    </main>
  );
}

function ZapIcon() {
  return <span className="zap-icon">✦</span>;
}
