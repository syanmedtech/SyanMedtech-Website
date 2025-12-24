
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/gemini.ts';
import { ICONS, SectionLabel } from '../constants.tsx';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const PublicDiagnoseRight: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentCase, setCurrentCase] = useState<any>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [grading, setGrading] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, grading]);

  const startNewCase = async () => {
    setLoading(true);
    setGrading(null);
    setChat([]);
    try {
      const newCase = await geminiService.initiateCase();
      setCurrentCase(newCase);
      setChat([{
        role: 'model',
        text: `Hello doctor. My name is ${newCase.name}. ${newCase.presentingComplaint}`
      }]);
    } catch (e) {
      alert("Error initiating simulation. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentCase || loading) return;

    const userMsg: Message = { role: 'user', text: input };
    const updatedChat = [...chat, userMsg];
    setChat(updatedChat);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await geminiService.processClinicalQuery(updatedChat, currentCase.caseContext);
      setChat([...updatedChat, { role: 'model', text: aiResponse || '' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitDiagnosis = async () => {
    const diagnosis = prompt("Enter your final diagnosis and management plan:");
    if (!diagnosis) return;

    setIsGrading(true);
    try {
      const result = await geminiService.gradeDiagnosis(diagnosis, currentCase.caseContext, currentCase.hiddenDiagnosis);
      setGrading(result || "Grading error.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="bg-syan-gray min-h-screen pb-20">
      <section className="bg-white py-12 px-6 lg:px-20 border-b border-syan-sky/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-xl">
            <SectionLabel num="AI Simulator" text="DiagnoseRight 3.0" />
            <h1 className="serif text-4xl text-syan-dark mb-2">Clinical Reasoning Engine.</h1>
            <p className="text-gray-500 text-sm font-medium">
              Take a patient history, order virtual tests, and prove your diagnostic acumen. 
              Powered by SYAN Clinical Intelligence.
            </p>
          </div>
          <button 
            onClick={startNewCase}
            disabled={loading}
            className="px-8 py-4 bg-syan-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-syan-teal transition-all disabled:opacity-50"
          >
            {loading && !currentCase ? 'Synthesizing Case...' : 'Generate New Case'}
          </button>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 mt-12">
        {!currentCase ? (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <ICONS.AI className="w-16 h-16 text-syan-sky/20 mx-auto mb-6" />
            <h3 className="serif text-2xl text-gray-400">Waiting for clinical signal...</h3>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Press Generate New Case to begin simulation</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Vitals Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-syan-dark p-6 rounded-3xl shadow-2xl border border-white/5 text-white">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-syan-sky">Patient Monitor</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[8px] uppercase font-bold text-gray-500 tracking-widest mb-1">Heart Rate</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black text-white">{currentCase.vitals.heartRate}</span>
                      <span className="text-[10px] text-syan-sky font-bold">BPM</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase font-bold text-gray-500 tracking-widest mb-1">Blood Pressure</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-white">{currentCase.vitals.bloodPressure}</span>
                      <span className="text-[10px] text-syan-teal font-bold">mmHg</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[8px] uppercase font-bold text-gray-400 tracking-widest mb-1">Temp</p>
                      <p className="text-sm font-bold">{currentCase.vitals.temp}°C</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase font-bold text-gray-400 tracking-widest mb-1">SpO2</p>
                      <p className="text-sm font-bold text-syan-sky">{currentCase.vitals.spo2}%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="h-12 bg-black/40 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 medical-grid opacity-10"></div>
                    <div className="w-full h-full bg-gradient-to-r from-syan-teal/20 via-syan-sky/40 to-syan-teal/20 animate-ecg-scan"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Patient Demographics</p>
                <div className="space-y-3">
                  <p className="text-sm font-bold text-syan-dark">ID: {currentCase.patientId}</p>
                  <p className="text-sm text-gray-600">Age: {currentCase.age}</p>
                  <p className="text-sm text-gray-600">Gender: {currentCase.gender}</p>
                </div>
              </div>
            </div>

            {/* Interaction Area */}
            <div className="lg:col-span-9 flex flex-col h-[700px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="px-8 py-4 bg-syan-gray/50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-syan-dark">Clinical Consultation</h3>
                <button 
                  onClick={submitDiagnosis}
                  disabled={isGrading}
                  className="px-4 py-1.5 bg-syan-teal text-white text-[9px] font-black uppercase tracking-widest rounded-md hover:bg-syan-dark transition-all disabled:opacity-50"
                >
                  {isGrading ? 'Processing...' : 'Submit Diagnosis'}
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      msg.role === 'user' 
                      ? 'bg-syan-teal text-white rounded-tr-none' 
                      : 'bg-syan-gray text-syan-dark border border-gray-100 rounded-tl-none font-medium'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-syan-gray/50 rounded-2xl px-6 py-4 rounded-tl-none flex space-x-1 items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}

                {grading && (
                  <div className="mt-8 p-8 bg-syan-yellow/10 border border-syan-yellow/30 rounded-3xl animate-in zoom-in-95 duration-500">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-syan-yellow rounded-lg flex items-center justify-center text-white">
                        <ICONS.Exam className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-syan-dark">Assessment Report</h4>
                    </div>
                    <div className="prose prose-sm max-w-none text-syan-dark font-medium leading-loose whitespace-pre-wrap">
                      {grading}
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={startNewCase}
                        className="text-[10px] font-black uppercase tracking-widest text-syan-teal hover:underline"
                      >
                        Start Next Clinical Case →
                      </button>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-gray-50">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <input 
                    type="text"
                    disabled={loading || !!grading}
                    className="flex-grow bg-syan-gray border border-gray-100 rounded-xl px-6 py-4 outline-none focus:border-syan-teal text-sm font-medium transition-all"
                    placeholder={grading ? "Case resolved. Generate new case to continue." : "Ask a question (e.g., 'Do you have any medical conditions?')"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                  />
                  <button 
                    disabled={loading || !!grading}
                    className="p-4 bg-syan-sky text-white rounded-xl shadow-lg hover:bg-syan-teal transition-all disabled:opacity-50"
                  >
                    <svg className="w-6 h-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDiagnoseRight;
