
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/gemini.ts';
import { ICONS, SectionLabel } from '../constants.tsx';
import { GoogleGenAI, Modality } from "@google/genai";

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
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'exams'>('chat');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, transcription]);

  const startNewCase = async () => {
    if (isVoiceActive) stopVoiceConsultation();
    setLoading(true);
    setGrading(null);
    setChat([]);
    try {
      const newCase = await geminiService.initiateCase();
      setCurrentCase(newCase);
      setChat([{
        role: 'model',
        text: `Hello doctor. I'm ${newCase.name}. I've been feeling... ${newCase.presentingComplaint.toLowerCase()}`
      }]);
    } catch (e) {
      alert("Error initiating simulation.");
    } finally {
      setLoading(false);
    }
  };

  const startVoiceConsultation = async () => {
    if (!currentCase) return;
    setIsVoiceActive(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: geminiService.audio.encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buffer = await geminiService.audio.decodeAudioData(
                geminiService.audio.decode(audioData),
                outputCtx,
                24000,
                1
              );
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.turnComplete) {
               setTranscription('');
            }
          },
          onclose: () => setIsVoiceActive(false),
          onerror: () => setIsVoiceActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: currentCase.gender.toLowerCase().includes('female') ? 'Kore' : 'Zephyr' } }
          },
          systemInstruction: `You are a patient named ${currentCase.name}, age ${currentCase.age}. 
          Case: ${currentCase.caseContext}. 
          Be natural, speak in character. Do not reveal diagnosis: ${currentCase.hiddenDiagnosis}. 
          Answer concisely as if in a doctor's office.`
        }
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsVoiceActive(false);
    }
  };

  const stopVoiceConsultation = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
      audioContextRef.current = null;
    }
    setIsVoiceActive(false);
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
    const diagnosis = prompt("State your definitive diagnosis and primary management plan:");
    if (!diagnosis) return;

    setIsGrading(true);
    try {
      const result = await geminiService.gradeDiagnosis(diagnosis, currentCase.caseContext, currentCase.hiddenDiagnosis);
      setGrading(result || "Evaluation unavailable.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <section className="bg-white py-12 px-6 lg:px-20 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <SectionLabel num="Simulator" text="DiagnoseRight 3.0" />
            <h1 className="serif text-4xl text-syan-dark">Clinical Case Engine.</h1>
            <p className="text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">GEMINI PRO CLINCAL PERSONA EMULATION</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={startNewCase} 
              disabled={loading}
              className="px-10 py-4 bg-syan-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-syan-teal transition-all disabled:opacity-50"
            >
              {loading && !currentCase ? 'Generating Case...' : 'Start New Simulation'}
            </button>
            {currentCase && (
               <button 
                onClick={isVoiceActive ? stopVoiceConsultation : startVoiceConsultation}
                className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 border-2 ${
                  isVoiceActive ? 'bg-red-500 border-red-400 text-white animate-pulse' : 'bg-white border-syan-teal text-syan-teal hover:bg-syan-teal hover:text-white'
                }`}
              >
                <span>{isVoiceActive ? 'End Patient Call' : 'Call Patient (Voice)'}</span>
                <ICONS.Clinic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {!currentCase ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
             <ICONS.AI className="w-20 h-20 text-gray-100 mx-auto mb-6" />
             <h3 className="serif text-3xl text-gray-300">Awaiting Clinical Data...</h3>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4">Proctored environment initialized</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Monitor Column */}
            <div className="lg:col-span-3 space-y-6">
               <div className="bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ICONS.AI className="w-40 h-40" />
                  </div>
                  <div className="flex items-center justify-between mb-10 relative z-10">
                     <span className="text-[10px] font-black uppercase tracking-widest text-syan-sky">Vital Signs Monitor</span>
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  </div>
                  
                  <div className="space-y-10 relative z-10">
                    {[
                      { label: "Heart Rate", value: currentCase.vitals.heartRate, unit: "BPM", color: "text-green-400" },
                      { label: "Blood Pressure", value: currentCase.vitals.bloodPressure, unit: "mmHg", color: "text-syan-sky" },
                      { label: "SPO2", value: currentCase.vitals.spo2, unit: "%", color: "text-blue-400" },
                      { label: "Temp", value: currentCase.vitals.temp, unit: "°C", color: "text-orange-400" }
                    ].map((v, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                        <div>
                          <p className="text-[8px] uppercase font-black text-gray-500 tracking-widest mb-1">{v.label}</p>
                          <p className={`text-3xl font-black tracking-tighter ${v.color}`}>{v.value}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 mb-1">{v.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient ID</p>
                    <p className="text-xs font-mono text-gray-300">{currentCase.patientId}</p>
                  </div>
               </div>
               
               <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h4 className="font-black text-[10px] uppercase tracking-widest mb-6 text-gray-400">Simulation Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-syan-teal"></div>
                      <p className="text-xs font-bold text-syan-dark">History Taking Active</p>
                    </div>
                    <div className="flex items-center space-x-3 opacity-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <p className="text-xs font-bold text-gray-400">Physical Exam Locked</p>
                    </div>
                  </div>
                  <button 
                    onClick={submitDiagnosis}
                    className="w-full mt-10 py-4 bg-syan-teal text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-syan-dark transition-all shadow-lg"
                  >
                    Submit Differential
                  </button>
               </div>
            </div>

            {/* Consultation Column */}
            <div className="lg:col-span-9 bg-white rounded-[3rem] shadow-xl border border-gray-100 flex flex-col h-[750px] overflow-hidden relative">
              {/* Header */}
              <div className="px-10 py-6 border-b border-gray-50 bg-syan-gray/20 flex justify-between items-center">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-syan-teal rounded-2xl flex items-center justify-center font-black text-white text-xl">
                      {currentCase.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-syan-dark text-lg">{currentCase.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {currentCase.age}Y • {currentCase.gender}
                      </p>
                    </div>
                 </div>
                 {isVoiceActive && (
                    <div className="flex items-center space-x-3 px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
                       <span className="text-[10px] font-black uppercase tracking-widest">Voice Active</span>
                       <div className="flex space-x-1">
                          {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />)}
                       </div>
                    </div>
                 )}
              </div>

              {/* Chat Area */}
              <div className="flex-grow overflow-y-auto p-10 space-y-8 bg-medical-grid no-scrollbar">
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-6 rounded-[2rem] shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-syan-teal text-white rounded-tr-none' 
                      : 'bg-[#F8F9FA] text-syan-dark border border-gray-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isVoiceActive && transcription && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] p-6 bg-syan-sky/10 border border-syan-sky/20 rounded-[2rem] rounded-tl-none italic text-syan-sky">
                      <p className="text-sm font-bold leading-relaxed">{transcription}...</p>
                    </div>
                  </div>
                )}
                
                {loading && !isVoiceActive && (
                   <div className="flex justify-start">
                      <div className="flex space-x-2 p-4 bg-gray-50 rounded-2xl">
                         <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                         <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                         <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                   </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Footer Input */}
              <div className="p-8 border-t border-gray-50 bg-white">
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isVoiceActive || loading}
                    className="w-full pl-8 pr-32 py-5 bg-syan-gray border border-gray-100 rounded-2xl outline-none focus:border-syan-teal text-sm font-medium transition-all"
                    placeholder={isVoiceActive ? "Speaking is active. Click 'End Call' to use text." : "Ask the patient about their symptoms..."} 
                  />
                  <button 
                    type="submit"
                    disabled={isVoiceActive || loading || !input.trim()}
                    className="absolute right-3 top-2.5 px-8 py-3 bg-syan-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-syan-teal transition-all disabled:opacity-30"
                  >
                    Send Query
                  </button>
                </form>
              </div>

              {/* AI Grading Overlay */}
              {grading && (
                 <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-12 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                    <div className="max-w-2xl w-full text-center space-y-8">
                       <SectionLabel num="Evaluation" text="TruGrade™ Simulation Result" />
                       <div className="p-10 bg-syan-dark rounded-[3rem] text-white shadow-2xl relative overflow-hidden text-left">
                          <div className="absolute top-0 right-0 p-10 opacity-10">
                            <ICONS.Scholarship className="w-40 h-40" />
                          </div>
                          <div className="prose prose-invert max-w-none">
                             <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-6">Expert Assessment</p>
                             <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{grading}</div>
                          </div>
                       </div>
                       <div className="flex space-x-6">
                         <button onClick={startNewCase} className="flex-1 py-5 bg-syan-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">New Simulation</button>
                         <button onClick={() => setGrading(null)} className="flex-1 py-5 bg-white border border-gray-200 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-syan-dark transition-all">Back To History</button>
                       </div>
                    </div>
                 </div>
              )}
              
              {isGrading && (
                <div className="absolute inset-0 z-[60] bg-syan-dark/90 backdrop-blur-sm flex items-center justify-center">
                   <div className="text-center">
                      <div className="w-16 h-16 border-4 border-syan-sky/20 border-t-syan-sky rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">AI Faculty Evaluating Decision Path...</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bg-medical-grid {
          background-image: 
            linear-gradient(to right, rgba(43, 122, 109, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 122, 109, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default PublicDiagnoseRight;
