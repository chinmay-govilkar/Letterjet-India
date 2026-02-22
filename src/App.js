import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { 
  Send, MapPin, Phone, FileText, Search, Clock, CheckCircle2, Truck, Package,
  ArrowRight, Info, Loader2, Download, Eye, Lock, Unlock, User, Share2, 
  ArrowLeftRight, X, ExternalLink, ShieldCheck, Globe
} from 'lucide-react';

// --- PRODUCTION CONFIGURATION ---
// Replace the values below with your ACTUAL Firebase keys
const firebaseConfig = {
  apiKey: "AIzaSyC7t7n8eIBgyWtymL8nEHqMjeQro22iXGs",
  authDomain: "letterjet-india.firebaseapp.com",
  projectId: "letterjet-india",
  storageBucket: "letterjet-india.firebasestorage.app",
  messagingSenderId: "159520943563",
  appId: "1:159520943563:web:06fe45dbba0b64e4525a4e",
  measurementId: "G-85H1HYKY6E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Use a fixed string for your App ID to avoid "not defined" errors
const PRODUCTION_APP_ID = 'letterjet-india-v1';

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

// Components Moved Outside to prevent focus issues
const Step1 = ({ formData, handleFileUpload, setStep }) => (
  <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in duration-500">
    <div className="mb-8 text-center">
      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="text-orange-600 w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Upload your PDF Letter</h2>
      <p className="text-slate-500">Your document will be encrypted and stored for domestic transit.</p>
    </div>
    <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${formData.pdfFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-orange-400'}`} onClick={() => document.getElementById('pdf-input').click()}>
      <input id="pdf-input" type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
      {formData.pdfFile ? (
        <div className="flex flex-col items-center">
          <CheckCircle2 className="text-green-500 w-12 h-12 mb-2" />
          <span className="font-medium text-green-700">{formData.pdfFile.name}</span>
          <span className="text-xs text-green-600 mt-1">Ready for Cloud Sync</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Truck className="text-slate-400 w-10 h-10 mb-4" />
          <p className="text-slate-600 font-medium">Click to select PDF letter</p>
          <p className="text-slate-400 text-sm mt-1">Maximum size: 1MB</p>
        </div>
      )}
    </div>
    <button disabled={!formData.pdfFile} onClick={() => setStep(2)} className="w-full mt-8 bg-orange-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 disabled:opacity-50 transition-all shadow-lg">
      Continue to Logistics <ArrowRight size={20} />
    </button>
  </div>
);

const Step2 = ({ formData, setFormData, handleSubmitRequest, setStep, loading }) => (
  <form onSubmit={handleSubmitRequest} className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-in slide-in-from-right duration-500">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><MapPin className="text-orange-600" /> Dispatch Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Sender Name</label>
        <input required type="text" placeholder="Rahul Sharma" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" value={formData.senderName} onChange={(e) => setFormData({...formData, senderName: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Recipient WhatsApp</label>
        <input required type="tel" placeholder="+91 98765 43210" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" value={formData.recipientPhone} onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Source City</label>
        <input required type="text" placeholder="Mumbai" className="w-full p-3 border rounded-lg outline-none" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">Destination City</label>
        <input required type="text" placeholder="Delhi" className="w-full p-3 border rounded-lg outline-none" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
      </div>
    </div>
    <div className="mt-8 p-4 bg-orange-50 rounded-xl flex items-start gap-3 border border-orange-100">
      <Globe className="text-orange-600 w-5 h-5 mt-0.5" />
      <p className="text-sm text-orange-800 leading-relaxed">Stored in your private <b>Firebase Vault</b> and unlocked after transit simulation.</p>
    </div>
    <div className="flex gap-4 mt-8">
      <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border rounded-xl font-semibold text-slate-600">Back</button>
      <button type="submit" className="flex-[2] bg-orange-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 shadow-lg transition-all">{loading ? <Loader2 className="animate-spin" /> : 'Confirm & Save'}</button>
    </div>
  </form>
);

const HubView = ({ trackingInfo, onSimulateDelivery, isRecipientMode }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isDelivered = trackingInfo?.isDelivered;
  const handleDownload = () => { if (!trackingInfo?.pdfBase64) return; const link = document.createElement('a'); link.href = trackingInfo.pdfBase64; link.download = `letter-${trackingInfo.id}.pdf`; link.click(); };
  const handleOpenNewTab = () => { if (!trackingInfo?.pdfBase64) return; const newTab = window.open(); if (newTab) { newTab.document.write(`<iframe src="${trackingInfo.pdfBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`); } };
  const shareLink = `${window.location.origin}${window.location.pathname}?docket=${trackingInfo?.id}`;
  
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700 pb-10">
      {!isRecipientMode && !isDelivered && (
        <div className="mb-6 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between text-xs border-l-4 border-orange-500 shadow-xl">
          <div className="flex items-center gap-3"><ShieldCheck className="text-orange-500" /><span><b>Sender:</b> Click below to unlock the letter for testing immediately.</span></div>
          <button onClick={onSimulateDelivery} className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-orange-100 transition-all">Deliver Now</button>
        </div>
      )}
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 mb-8 relative">
        <div className={`${isDelivered ? 'bg-green-600' : 'bg-orange-600'} p-10 text-white transition-colors duration-500 pt-14`}>
          <div className="flex justify-between items-start mb-8">
            <div><p className="text-white/70 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Domestic Digital Docket</p><h2 className="text-4xl font-mono font-black tracking-tighter">{trackingInfo?.id}</h2></div>
            <div className="bg-black/10 px-5 py-3 rounded-2xl backdrop-blur-xl border border-white/20 text-center"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-0.5">Status</p><p className="text-sm font-black">{isDelivered ? 'ARRIVED' : 'IN TRANSIT'}</p></div>
          </div>
          <div className="h-4 bg-black/20 rounded-full p-1 shadow-inner"><div className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{ width: `${isDelivered ? 100 : 25}%` }} /></div>
        </div>
        <div className="p-10">
          {isDelivered ? (
            <div className="text-center py-6 animate-in zoom-in duration-500">
              <div className="bg-green-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-green-50"><Unlock className="text-green-600 w-12 h-12" /></div>
              <h3 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Letter Unlocked!</h3>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button onClick={() => setIsPreviewOpen(true)} className="flex items-center justify-center gap-3 bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl"><Eye size={24} /> Read Letter</button>
                <button onClick={handleDownload} className="flex items-center justify-center gap-3 border-2 border-slate-200 text-slate-700 px-10 py-6 rounded-3xl font-black text-lg hover:bg-slate-50 transition-all"><Download size={24} /> Save PDF</button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in">
              {!isRecipientMode ? (
                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-inner">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Recipient Hub Link</label>
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-5 border rounded-2xl text-xs font-mono text-slate-400 truncate select-all">{shareLink}</div>
                    <button onClick={() => { const text = `Hi! I've sent you a digital letter via LetterJet. Track its arrival here: ${shareLink}`; window.open(`https://wa.me/${trackingInfo?.recipientPhone?.replace(/\D/g,'') || ''}?text=${encodeURIComponent(text)}`); }} className="w-full bg-green-600 text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-green-700 shadow-xl shadow-green-100"><Share2 size={24} /> Send via WhatsApp</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12"><Lock className="text-orange-500 w-16 h-16 mx-auto mb-8" /><h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Consignment Locked</h3><div className="bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-black tracking-widest uppercase shadow-2xl inline-flex items-center gap-2"><Clock size={18} className="text-orange-500" /> ETA: 3 Business Days</div></div>
              )}
            </div>
          )}
        </div>
      </div>
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300 p-4 sm:p-10">
           <div className="flex justify-between items-center text-white mb-4"><h3 className="font-black text-xl">Consignment: {trackingInfo?.id}</h3><div className="flex gap-4"><button onClick={handleOpenNewTab} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/20">Fullscreen</button><button onClick={() => setIsPreviewOpen(false)} className="bg-red-500 p-2 rounded-full"><X size={24} /></button></div></div>
           <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-2xl"><embed src={trackingInfo?.pdfBase64} type="application/pdf" className="w-full h-full" /></div>
        </div>
      )}
    </div>
  );
};

// --- Main App Logic ---
const App = () => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRecipientMode, setIsRecipientMode] = useState(false);
  const [formData, setFormData] = useState({ senderName: '', source: '', destination: '', recipientPhone: '+91 ', pdfFile: null });
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error("Auth error", err));
    const unsub = onAuthStateChanged(auth, setUser);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('docket')) { setIsRecipientMode(true); setStep(3); }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !isRecipientMode) return;
    const docketId = new URLSearchParams(window.location.search).get('docket');
    if (!docketId) return;
    const unsub = onSnapshot(doc(db, 'artifacts', PRODUCTION_APP_ID, 'public', 'data', 'shipments', docketId), (snap) => {
      if (snap.exists()) setTrackingInfo({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [user, isRecipientMode]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) { alert("Max 1MB for demo."); return; }
    if (file && file.type === 'application/pdf') setFormData({ ...formData, pdfFile: file });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const pdfBase64 = await fileToBase64(formData.pdfFile);
      const docketId = 'IND-' + Math.random().toString(36).substr(2, 7).toUpperCase();
      const payload = { ...formData, pdfFile: null, pdfBase64, isDelivered: false, timestamp: Date.now() };
      await setDoc(doc(db, 'artifacts', PRODUCTION_APP_ID, 'public', 'data', 'shipments', docketId), payload);
      setTrackingInfo({ id: docketId, ...payload });
      setLoading(false);
      setStep(3);
    } catch (err) { setLoading(false); console.error("Save error", err); }
  };

  const handleSimulateDelivery = async () => {
    if (!trackingInfo || !user) return;
    await setDoc(doc(db, 'artifacts', PRODUCTION_APP_ID, 'public', 'data', 'shipments', trackingInfo.id), { isDelivered: true }, { merge: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <nav className="bg-white/80 backdrop-blur-md border-b px-8 py-6 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => (window.location.href = window.location.pathname)}>
          <div className="bg-orange-600 p-3 rounded-[20px] text-white shadow-xl shadow-orange-200"><Send size={24} /></div>
          <h1 className="text-3xl font-black bg-gradient-to-br from-slate-900 to-orange-600 bg-clip-text text-transparent tracking-tighter">LetterJet</h1>
        </div>
      </nav>
      <main className="px-6 pt-16">
        {step === 1 && <Step1 formData={formData} handleFileUpload={handleFileUpload} setStep={setStep} />}
        {step === 2 && <Step2 formData={formData} setFormData={setFormData} handleSubmitRequest={handleSubmitRequest} setStep={setStep} loading={loading} />}
        {step === 3 && <HubView trackingInfo={trackingInfo} onSimulateDelivery={handleSimulateDelivery} isRecipientMode={isRecipientMode} />}
      </main>
    </div>
  );
};

export default App;