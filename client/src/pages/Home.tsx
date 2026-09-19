import { useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  AudioLines,
  Camera,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Edit3,
  FileCheck2,
  FileText,
  FileUp,
  Globe2,
  Headphones,
  Languages,
  Menu,
  MessageCircle,
  Mic,
  PencilLine,
  Play,
  Plus,
  Search,
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
const formLibrary = [
  { id: "admission", title: "College / Admission", meta: "8 detected fields", accent: "violet", icon: "CA" },
  { id: "scholarship", title: "Scholarship", meta: "6 detected fields", accent: "mint", icon: "SC" },
  { id: "government", title: "Government Services", meta: "10 detected fields", accent: "blue", icon: "GS" },
  { id: "job", title: "Job Application", meta: "9 detected fields", accent: "coral", icon: "JA" },
  { id: "bank", title: "Bank / KYC", meta: "12 detected fields", accent: "yellow", icon: "BK" },
  { id: "insurance", title: "Insurance", meta: "7 detected fields", accent: "violet", icon: "IN" },
  { id: "exam", title: "Exam Registration", meta: "8 detected fields", accent: "blue", icon: "ER" },
  { id: "custom", title: "Custom Uploaded Form", meta: "Upload a photo or PDF", accent: "mint", icon: "+" },
];
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
type AssistantMessage = { from: "ai" | "user"; text: string; attachment?: { name: string; type: string; url: string } };

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

const detectedFormFields = ["Full name", "Date of birth", "Age", "Permanent address", "Phone number", "Email address", "Preferred contact", "Emergency contact"];

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
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([{ from: "ai", text: "Hi! I’ll help you fill this form." }, { from: "ai", text: "What is your date of birth?" }]);
  const [fields, setFields] = useState(initialFields);
  const [activeStep, setActiveStep] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [activeFormId, setActiveFormId] = useState("admission");
  const [uploadedFormName, setUploadedFormName] = useState("college-admission-form.pdf");
  const [selectedField, setSelectedField] = useState("Permanent address");
  const [workspaceTranscript, setWorkspaceTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formStates, setFormStates] = useState<Record<string, FormField[]>>({ admission: initialFields });
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [attachmentAnalyzing, setAttachmentAnalyzing] = useState(false);
  const [attachmentFields, setAttachmentFields] = useState(["Full name", "Date of birth", "Permanent address", "Phone number"]);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const activeFields = formStates[activeFormId] || fields;
  const completedCount = useMemo(() => activeFields.filter((field) => field.status === "confirmed").length, [activeFields]);
  const selectedLanguageLabel = selectedLanguage === "Auto Detect" ? "Auto Detect" : selectedLanguage;

  const updateActiveFields = (nextFields: FormField[]) => {
    setFields(nextFields);
    setFormStates((current) => ({ ...current, [activeFormId]: nextFields }));
  };

  const handleAttachmentUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachmentUrl(url);
    setAttachmentMenuOpen(false);
    setAttachmentAnalyzing(true);
    setAssistantMessages((current) => [...current, { from: "user", text: assistantText || "Please help me understand this form.", attachment: { name: file.name, type: file.type, url } }]);
    setAssistantText("");
    window.setTimeout(() => {
      setAttachmentAnalyzing(false);
      setAttachmentFields(["Full name", "Date of birth", "Permanent address", "Phone number", "Email address", "Emergency contact"]);
      setAssistantMessages((current) => [...current, { from: "ai", text: "I can see this form. I found 14 fields, including Full Name, Date of Birth, Permanent Address and Contact Details. Tap a detected field below and I’ll explain what belongs there." }]);
    }, 1100);
  };

  const selectAttachmentField = (field: string) => {
    setSelectedField(field);
    setAssistantMessages((current) => [...current, { from: "ai", text: field === "Permanent address" ? "This field asks for the address where you permanently live. You can tell me your house number, area, city, state and PIN code." : `This field asks for your ${field.toLowerCase()}. You can answer by voice or type it in your own words.` }]);
  };

  const switchForm = (id: string) => {
    const nextFields = formStates[id] || initialFields.map((field) => ({ ...field, status: id === "bank" ? "missing" : field.status }));
    setActiveFormId(id);
    setFields(nextFields);
    setSubmitted(false);
    setSelectedField(nextFields.find((field) => field.status !== "confirmed")?.label || nextFields[0].label);
  };

  const handleFormUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFormName(file.name);
    setActiveFormId("custom");
    setIsAnalyzing(true);
    window.setTimeout(() => setIsAnalyzing(false), 1100);
    setSelectedField("Permanent address");
  };

  const fillFromWorkspace = () => {
    const answer = workspaceTranscript.trim();
    if (!answer) return;
    const nameMatch = answer.match(/(?:my name is|mera naam|name is)\s+([a-zA-Z ]+)/i);
    const addressMatch = answer.match(/(?:address|pata|permanent address)\s+(?:is|hai)?\s*(.+)/i);
    const nextFields = activeFields.map((field) => {
      if (selectedField === "Full name" && nameMatch) return { ...field, value: nameMatch[1].trim(), status: "confirmed" as FieldStatus };
      if (selectedField === "Permanent address" && addressMatch && field.label === "Address") return { ...field, value: addressMatch[1].trim(), status: "confirmed" as FieldStatus, helper: undefined };
      if (field.label === selectedField) return { ...field, value: answer, status: "confirmed" as FieldStatus, helper: undefined };
      return field;
    });
    updateActiveFields(nextFields);
    setWorkspaceTranscript("");
    setActiveStep(4);
  };

  const handleMic = () => {
    setIsListening((current) => !current);
    setActiveStep(isListening ? 4 : 3);
    if (!isListening) {
      window.setTimeout(() => {
      updateActiveFields(fields.map((field) => field.label === "Emergency contact" ? { ...field, status: "review", value: "Rahul Kulkarni", helper: "Please confirm this information." } : field));
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

  const confirmField = (label: string) => updateActiveFields(fields.map((field) => field.label === label ? { ...field, status: "confirmed", helper: undefined } : field));
  const speakAgain = (label: string) => {
    setAssistantMessages((current) => [...current, { from: "ai", text: `Let’s try ${label} again. Speak naturally when you’re ready.` }]);
    setShowAssistant(true);
    setIsListening(true);
  };
  const sendAssistantMessage = () => {
    const value = assistantText.trim();
    if (!value) return;
    const lower = value.toLowerCase();
    const nameMatch = value.match(/(?:my name is|mera naam|name is)\s+([a-zA-Z ]+)/i);
    const addressMatch = value.match(/(?:address|pata|permanent address)\s+(?:is|hai)?\s*(.+)/i);
    let response = `For ${selectedField}, ${selectedField === "Permanent address" ? "tell me your house number, area, city, state and PIN code." : "you can answer by voice or type the information directly."}`;
    if (selectedField === "Permanent address" && addressMatch) {
      updateActiveFields(fields.map((field) => field.label === "Address" ? { ...field, value: addressMatch[1].trim(), status: "confirmed" as FieldStatus, helper: undefined } : field));
      response = `I found your address and added “${addressMatch[1].trim()}” to the Permanent Address field. Please review it before moving on.`;
    } else if (nameMatch) {
      const nextFields = fields.map((field) => field.label === "Full name" ? { ...field, value: nameMatch[1].trim(), status: "confirmed" as FieldStatus } : field);
      updateActiveFields(nextFields);
      setSelectedField("Date of birth");
      response = `I found a Full Name in your message and placed “${nameMatch[1].trim()}” into that field. The next field to complete is Date of birth.`;
    } else if (lower.includes("samajh") || lower.includes("explain") || lower.includes("what is") || lower.includes("ye wala")) {
      response = selectedField === "Permanent address" ? "Permanent address means the place where you live long-term. Include your house number, area, city, state and PIN code." : `The ${selectedField.toLowerCase()} field is asking for the ${selectedField.toLowerCase()} shown on this form.`;
    } else if (lower.includes("skip") || lower.includes("optional")) {
      response = `${selectedField} is ${selectedField === "Emergency contact" ? "optional for this example, so you can skip it and come back later" : "important to complete before submitting"}.`;
    } else if (lower.includes("wrong") || lower.includes("galat") || lower.includes("change") || lower.includes("pehle")) {
      response = `I’ve kept the form editable. Tap ${selectedField} in the document preview and tell me the corrected information.`;
    } else if (lower.includes("same address")) {
      const address = fields.find((field) => field.label === "Address")?.value || "your saved address";
      updateActiveFields(fields.map((field) => field.label === selectedField ? { ...field, value: address, status: "confirmed" as FieldStatus } : field));
      response = `I reused ${address} for ${selectedField}. Please review it before submitting.`;
    } else if (lower.includes("remaining") || lower.includes("bacha") || lower.includes("left")) {
      const remaining = fields.filter((field) => field.status !== "confirmed").map((field) => field.label).join(", ");
      response = remaining ? `The remaining fields are: ${remaining}. The first one to review is ${remaining.split(", ")[0]}.` : "All fields are complete. You can review the form and submit it.";
    } else if (lower.includes("read")) {
      response = `I can read this section aloud in ${selectedLanguageLabel}. The selected field is ${selectedField}.`;
      readFormAloud();
    }
    setAssistantMessages((current) => [...current, { from: "user", text: value }, { from: "ai", text: response }]);
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

      <section className="workspace-section" id="workspace"><div className="container"><div className="workspace-heading"><div><div className="eyebrow">The form is the interface</div><h2>Choose a form. <em>Talk to the fields.</em></h2><p>Vaani understands the document first, then maps what you say into the actual field you selected.</p></div><label className="upload-form-button"><FileUp size={16} /> Upload / scan form<input type="file" accept="image/*,.pdf" onChange={handleFormUpload} /></label></div>
        <div className="form-library" aria-label="Form library"><div className="library-label"><span>Form library</span><small>{formLibrary.length} ready-to-use templates</small></div><div className="library-grid">{formLibrary.map((form) => <button key={form.id} className={activeFormId === form.id ? `library-card active ${form.accent}` : `library-card ${form.accent}`} onClick={() => switchForm(form.id)}><span className="library-icon">{form.icon}</span><span><strong>{form.title}</strong><small>{form.id === "custom" && uploadedFormName ? uploadedFormName : form.meta}</small></span>{activeFormId === form.id && <Check size={15} />}</button>)}</div></div>
        <div className="workspace-grid"><div className="document-card"><div className="document-head"><div><span className="mini-label">{isAnalyzing ? "Analyzing uploaded form" : "AI understood this form"}</span><strong>{activeFormId === "custom" ? uploadedFormName : formLibrary.find((form) => form.id === activeFormId)?.title}</strong></div><span className={isAnalyzing ? "scan-status scanning" : "scan-status"}><span /> {isAnalyzing ? "Scanning fields" : `${activeFields.length} fields detected`}</span></div><div className="document-preview"><div className="paper-toolbar"><span><FileText size={14} /> Original form preview</span><span><Search size={14} /> Tap a highlighted field</span></div><div className="paper-sheet"><div className="paper-title">{activeFormId === "custom" ? uploadedFormName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase() : formLibrary.find((form) => form.id === activeFormId)?.title?.toUpperCase()}</div><div className="paper-line short" /><div className="paper-line" /><div className="paper-field-grid">{detectedFormFields.slice(0, 6).map((field) => <button key={field} className={selectedField === field ? "paper-field selected" : "paper-field"} onClick={() => setSelectedField(field)}><span>{field}</span><i>{(() => { const mappedField = fields.find((item) => item.label === field || (field === "Permanent address" && item.label === "Address")); return mappedField?.status === "missing" ? "Tap to answer" : mappedField?.value || "Tap to answer"; })()}</i></button>)}</div><div className="paper-signature"><span>Applicant signature</span><span>________________</span></div></div></div></div><div className="field-coach"><div className="coach-head"><span className="assistant-mini-avatar"><Sparkles size={12} /></span><div><strong>{selectedField}</strong><small>Detected field · {selectedLanguageLabel}</small></div><button aria-label="Explain selected field"><CircleHelp size={16} /></button></div><div className="coach-explanation">{selectedField === "Permanent address" ? "This field asks for the address where you permanently live. You can tell me your house number, area, city, state and PIN code." : `This field asks for your ${selectedField.toLowerCase()}. You can answer by voice or type it below.`}</div><div className="extraction-card"><span className="extraction-label"><WandSparkles size={13} /> AI extraction</span><p>{workspaceTranscript ? `“${workspaceTranscript}”` : "Your answer will appear here, then Vaani maps it to the selected field."}</p><div className="mapping-row"><span>Answer</span><ArrowRight size={14} /><strong>{selectedField}</strong></div></div><div className="workspace-composer"><button className={isListening ? "assistant-mic active" : "assistant-mic"} onClick={handleMic} aria-label="Speak answer"><Mic size={18} /></button><input value={workspaceTranscript} onChange={(event) => setWorkspaceTranscript(event.target.value)} placeholder="Say or type your answer..." aria-label="Answer selected form field" onKeyDown={(event) => event.key === "Enter" && fillFromWorkspace()} /><button className="send-button" onClick={fillFromWorkspace} aria-label="Fill selected field"><ArrowRight size={17} /></button></div><button className="explain-link" onClick={() => setShowAssistant(true)}>Ask Vaani what this means <MessageCircle size={14} /></button></div></div>
      </div></section>

      <section className="flow-section" id="how-it-works"><div className="container"><div className="section-heading centered-heading"><div className="eyebrow eyebrow-light">A better way to fill forms</div><h2>From voice to <span>done.</span> <br className="desktop-break" />Without the paperwork anxiety.</h2><p>Six simple steps that make every digital form feel a little more human.</p></div><div className="steps-grid">{steps.map(({ number, title, text, icon: Icon, tone }) => <article className="step-card" key={number}><div className={`step-icon tone-${tone}`}><Icon size={19} strokeWidth={2.1} /></div><div className="step-number">{number}</div><h3>{title}</h3><p>{text}</p><ArrowRight className="step-arrow" size={17} /></article>)}</div></div></section>

      <section className="preview-section" id="preview"><div className="container preview-grid"><div className="preview-copy"><div className="eyebrow">See the difference</div><h2>A form that listens, <em>notices</em> and helps.</h2><p>VaaniFlow doesn’t just transcribe words. It understands what you mean, maps it to the right place and shows you exactly what it heard.</p><div className="feature-list"><div><span className="feature-check"><Check size={14} /></span><span><strong>Confidence-based verification</strong><small>Know what’s confirmed and what needs a second look.</small></span></div><div><span className="feature-check"><Check size={14} /></span><span><strong>Voice + typing, together</strong><small>Use the input method that feels easiest in the moment.</small></span></div><div><span className="feature-check"><Check size={14} /></span><span><strong>Read it back to me</strong><small>Hear every answer before you press submit.</small></span></div></div><button className="text-link" onClick={() => setShowAssistant(true)}>Ask Vaani Assistant for help <ArrowRight size={15} /></button></div>
        <div className="form-preview-shell"><div className="review-heading"><div><span className="preview-kicker">Healthcare / Personal details</span><h3>Review your information before submitting.</h3></div><div className="completion-count"><strong>{completedCount} of {fields.length}</strong><span>fields completed</span></div></div><div className="review-banner"><Sparkles size={15} /><span><strong>VaaniFlow filled this in</strong><small>Review highlighted answers. Nothing submits without your confirmation.</small></span><button aria-label="Dismiss review tip"><X size={15} /></button></div><div className="full-form-fields">{fields.map((field) => <div className={field.status === "review" ? "full-field needs-review" : field.status === "missing" ? "full-field missing-field" : "full-field"} key={field.label}><label>{field.label}<span className={`status-label status-${field.status}`}>{field.status === "confirmed" ? "Confirmed" : field.status === "review" ? "Needs review" : "Missing"}</span></label>{editingLabel === field.label ? <input className="full-field-input edit-input" autoFocus defaultValue={field.value} onBlur={(event) => { setFields((current) => current.map((item) => item.label === field.label ? { ...item, value: event.target.value, status: "confirmed" } : item)); setEditingLabel(null); }} onKeyDown={(event) => { if (event.key === "Enter") (event.target as HTMLInputElement).blur(); }} /> : <button className="full-field-input" onClick={() => field.status === "missing" ? setShowAssistant(true) : setEditingLabel(field.label)}><span>{field.value}</span><StatusIcon status={field.status} /></button>}{field.helper && <small className="field-helper">{field.helper}</small>}{field.status === "review" && <div className="field-actions"><button onClick={() => confirmField(field.label)}><Check size={13} /> Confirm</button><button onClick={() => speakAgain(field.label)}><Mic size={13} /> Speak Again</button><button onClick={() => setEditingLabel(field.label)}><Edit3 size={13} /> Edit</button></div>}</div>)}</div><div className="form-status-key"><span><Check size={13} /> Confirmed</span><span><span className="key-warning" /> Needs review</span><span><Plus size={13} /> Missing</span></div><div className="form-actions"><div className="review-secondary-actions"><button className="read-aloud" onClick={readFormAloud}><Volume2 size={15} /> Read form aloud</button><button className="read-aloud" onClick={() => speakAgain("the missing information")}><Mic size={15} /> Speak again</button><button className="read-aloud" onClick={() => setShowAssistant(true)}><Plus size={15} /> Add information</button></div><button className="button button-primary button-submit" onClick={() => { setSubmitted(true); setActiveStep(5); }}>{submitted ? "Submitted successfully" : "Confirm & submit"}<ArrowRight size={15} /></button></div>{submitted && <div className="success-toast"><FileCheck2 size={15} /> Your information is confirmed and ready.</div>}</div>
      </div></section>

      <section className="trust-section" id="help"><div className="container trust-inner"><div className="trust-quote"><span className="quote-mark">“</span><p>Designed for first-time users, built for everyone.</p><span className="quote-author">Clear language · thoughtful prompts · no wrong way to begin</span></div><div className="trust-pills"><span><Headphones size={16} /> Read-aloud support</span><span><ZapIcon /> Fast, natural input</span><span><ShieldCheck size={16} /> Review before submit</span></div></div></section>

      <section className="final-cta"><div className="container final-cta-inner"><div><div className="eyebrow eyebrow-light">Ready when you are</div><h2>Let your voice do<br /><em>the paperwork.</em></h2></div><div className="cta-side"><p>Start with any form. Speak in the language that feels like home.</p><button className="button button-cream" onClick={() => scrollToId("preview")}>Start filling <ArrowRight size={16} /></button></div></div></section>
      <footer className="site-footer"><div className="container footer-inner"><Logo /><p>Speak. Fill. Done.</p><div className="footer-links"><a href="#how-it-works">How it works</a><a href="#languages">Languages</a><a href="#help">Accessibility</a><a href="#help">Help center</a></div><span className="footer-copyright">© 2026 VaaniFlow</span></div></footer>

      <button className="assistant-fab" onClick={() => setShowAssistant(true)} aria-label="Open Vaani Assistant"><span className="assistant-fab-icon"><MessageCircle size={21} /></span><span>Vaani Assistant</span></button>
      {showAssistant && <div className="assistant-overlay" onClick={() => setShowAssistant(false)}><aside className="assistant-panel" onClick={(event) => event.stopPropagation()}><div className="assistant-head"><div><span className="assistant-avatar"><Bot size={19} /></span><div><strong>Vaani Assistant</strong><small><span className="assistant-online" /> Form-aware and ready</small></div></div><button className="assistant-close" onClick={() => setShowAssistant(false)} aria-label="Close assistant"><X size={19} /></button></div><div className="assistant-body">{assistantMessages.map((message, index) => <div className={message.from === "ai" ? "assistant-message ai" : "assistant-message user"} key={`${message.text}-${index}`}>{message.from === "ai" && <span className="assistant-mini-avatar"><Sparkles size={12} /></span>}<div><p>{message.text}</p>{message.attachment && <div className="chat-attachment">{message.attachment.type.startsWith("image/") ? <img src={message.attachment.url} alt="Uploaded physical form" /> : <div className="chat-file-icon"><FileText size={20} /></div>}<span><strong>{message.attachment.name}</strong><small>{message.attachment.type.startsWith("image/") ? "✓ Attached · Form photo" : `✓ Attached · ${message.attachment.type === "application/pdf" ? "PDF document" : "Document"}`}</small></span></div>}</div></div>)}{attachmentAnalyzing && <div className="analysis-state"><span className="analysis-spinner"><Sparkles size={13} /></span><div><strong>Analyzing your form…</strong><small>Understanding the document and finding fields</small></div></div>}{!attachmentAnalyzing && attachmentFields.length > 4 && <div className="detected-fields-chat"><div><strong>Detected fields</strong><small>Tap a field to understand it</small></div><div className="detected-field-chips">{attachmentFields.map((field) => <button key={field} onClick={() => selectAttachmentField(field)} className={selectedField === field ? "selected" : ""}>{field}<ArrowRight size={12} /></button>)}</div><div className="attachment-actions"><button onClick={() => { setSelectedField(attachmentFields.find((field) => activeFields.some((item) => item.label === field && item.status !== "confirmed")) || "Full name"); setAssistantMessages((current) => [...current, { from: "ai", text: "We’ll go one field at a time. I’ve selected the first field that needs your attention." }]); }}>Start guided filling</button><button onClick={() => setAssistantMessages((current) => [...current, { from: "ai", text: "This looks like a personal details form. I found identity, contact and address fields. Select any highlighted field and I’ll explain whether it is required and what to enter." }])}>Explain the form</button></div></div>}<button className="assistant-speak-again" onClick={() => { setIsListening(true); setAssistantMessages((current) => [...current, { from: "ai", text: `Tell me what you want to add to ${selectedField}.` }]); }}><Mic size={15} /> Speak Again</button></div><div className="assistant-composer"><div className="attachment-anchor"><button className={attachmentMenuOpen ? "attachment-button active" : "attachment-button"} onClick={() => setAttachmentMenuOpen((open) => !open)} aria-label="Attach a form or image" aria-expanded={attachmentMenuOpen}><Plus size={19} /></button>{attachmentMenuOpen && <div className="attachment-menu" role="menu"><button role="menuitem" onClick={() => document.getElementById("camera-upload")?.click()}><Camera size={17} /><span><strong>Take a photo</strong><small>Scan a physical form</small></span></button><button role="menuitem" onClick={() => document.getElementById("image-upload")?.click()}><Waves size={17} /><span><strong>Upload image</strong><small>JPG, PNG or screenshot</small></span></button><button role="menuitem" onClick={() => document.getElementById("pdf-upload")?.click()}><FileText size={17} /><span><strong>Upload PDF</strong><small>Digital or scanned form</small></span></button><button role="menuitem" onClick={() => document.getElementById("document-upload")?.click()}><FileUp size={17} /><span><strong>Upload document</strong><small>DOC, DOCX or TXT</small></span></button></div>}<input id="camera-upload" className="hidden-file-input" type="file" accept="image/*" capture="environment" onChange={handleAttachmentUpload} /><input id="image-upload" className="hidden-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAttachmentUpload} /><input id="pdf-upload" className="hidden-file-input" type="file" accept="application/pdf" onChange={handleAttachmentUpload} /><input id="document-upload" className="hidden-file-input" type="file" accept=".doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleAttachmentUpload} /></div><button className={isListening ? "assistant-mic active" : "assistant-mic"} onClick={handleMic} aria-label="Talk to Vaani Assistant"><Mic size={18} /></button><input value={assistantText} onChange={(event) => setAssistantText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendAssistantMessage()} placeholder="Ask Vaani anything about this form..." aria-label="Message Vaani Assistant" /><button className="send-button" onClick={sendAssistantMessage} aria-label="Send message"><ArrowRight size={18} /></button></div></aside></div>}
    </main>
  );
}

function ZapIcon() {
  return <span className="zap-icon">✦</span>;
}
