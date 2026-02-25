import React, { useRef, useState, useEffect } from 'react';
import { getGeminiClient } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Loader2 } from 'lucide-react';

const audioContextOptions = { sampleRate: 16000 };
const outputSampleRate = 24000;

export const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio/Video logic refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const frameIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSession = () => {
    setIsActive(false);
    
    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop video frame loop
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    // Close Audio Contexts
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    // Attempt to close session if SDK supported it (Live session cleanup)
    sessionPromiseRef.current = null;
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const startSession = async () => {
    setError(null);
    try {
      const ai = getGeminiClient();
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass(audioContextOptions);
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: outputSampleRate });
      
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      // Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Connect to Gemini Live
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setupAudioInput(stream);
            setupVideoInput();
          },
          onmessage: async (message: LiveServerMessage) => {
             await handleMessage(message, outputNode);
          },
          onclose: () => {
            stopSession();
          },
          onerror: (e) => {
            console.error(e);
            setError("Connection error. Please try again.");
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are an expert tutor for a digital learning platform. You are helpful, encouraging, and concise. You speak in English but can explain concepts in Spanish if asked.",
          speechConfig: {
             voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });
      
    } catch (e) {
      console.error(e);
      setError("Failed to start session. Check permissions and API Key.");
    }
  };

  const setupAudioInput = (stream: MediaStream) => {
    if (!inputAudioContextRef.current || !sessionPromiseRef.current) return;
    
    const source = inputAudioContextRef.current.createMediaStreamSource(stream);
    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
    
    scriptProcessor.onaudioprocess = (e) => {
      if (isMuted) return; // Simple software mute
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);
      
      sessionPromiseRef.current?.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };
    
    source.connect(scriptProcessor);
    scriptProcessor.connect(inputAudioContextRef.current.destination);
  };

  const setupVideoInput = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    frameIntervalRef.current = window.setInterval(() => {
        if (!isVideoEnabled) return;

        canvas.width = video.videoWidth * 0.5; // Scale down for performance
        canvas.height = video.videoHeight * 0.5;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
        
        sessionPromiseRef.current?.then(session => {
            session.sendRealtimeInput({
                media: { data: base64Data, mimeType: 'image/jpeg' }
            });
        });
    }, 1000 / 2); // 2 FPS is enough for context usually
  };

  const handleMessage = async (message: LiveServerMessage, outputNode: GainNode) => {
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio && outputAudioContextRef.current) {
        const ctx = outputAudioContextRef.current;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
        
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            ctx,
            outputSampleRate,
            1
        );

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputNode);
        source.addEventListener('ended', () => {
            sourcesRef.current.delete(source);
        });

        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        sourcesRef.current.add(source);
    }
  };

  // --- Helpers ---
  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    const uint8 = new Uint8Array(int16.buffer);
    let binary = '';
    const len = uint8.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8[i]);
    }
    const b64 = btoa(binary);
    return {
        data: b64,
        mimeType: 'audio/pcm;rate=16000'
    };
  };

  const decode = (base64: string) => {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  };

  const decodeAudioData = async (
      data: Uint8Array,
      ctx: AudioContext,
      sampleRate: number,
      numChannels: number
  ) => {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
          }
      }
      return buffer;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-slate-900 rounded-2xl overflow-hidden relative">
      {/* Video Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {!isActive && !error && (
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold">Start Live Session</h3>
                <p className="text-slate-400">Connect with your AI Tutor for real-time help.</p>
                <button 
                    onClick={startSession}
                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
                >
                    Connect Now
                </button>
            </div>
        )}
        
        {isActive && (
            <video 
                ref={videoRef} 
                className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`} 
                muted 
                playsInline 
            />
        )}
        
        {isActive && !isVideoEnabled && (
             <div className="flex flex-col items-center justify-center text-slate-500">
                <User className="w-24 h-24 mb-4" />
                <p>Camera is off</p>
             </div>
        )}

        {error && (
             <div className="text-red-400 text-center p-4">
                 <p>{error}</p>
                 <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-slate-800 rounded">Dismiss</button>
             </div>
        )}

        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Status Badge */}
        {isActive && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                LIVE
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-20 bg-slate-800 flex items-center justify-center space-x-6 border-t border-slate-700">
         <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            disabled={!isActive}
         >
             {isMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
         </button>

         <button 
            onClick={() => setIsActive(false)} // Just toggle state to trigger effect cleanup
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            disabled={!isActive}
         >
             <PhoneOff className="text-white" />
         </button>

         <button 
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`p-4 rounded-full transition-colors ${!isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            disabled={!isActive}
         >
             {!isVideoEnabled ? <VideoOff className="text-white" /> : <Video className="text-white" />}
         </button>
      </div>
    </div>
  );
};
