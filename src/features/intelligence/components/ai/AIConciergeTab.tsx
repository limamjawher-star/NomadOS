import React, { useState, useEffect, useRef } from 'react';
import { NomadState } from '../../../../types';
import { AIProvider, ChatMessage } from '../../services/aiService';
import { Sparkles, Send, Loader2, Info, ArrowRight, ShieldCheck, MapPin, Zap, X } from 'lucide-react';
import { RouteOptimizer } from './RouteOptimizer';
import ReactMarkdown from 'react-markdown';

interface AIConciergeTabProps {
  state: NomadState;
  onNavigateTab: (tab: any) => void;
  onOpenPricing: () => void;
  isPro: boolean;
}

export const AIConciergeTab: React.FC<AIConciergeTabProps> = ({ state, onNavigateTab, onOpenPricing, isPro }) => {
  const [activeView, setActiveView] = useState<'chat' | 'optimizer'>('chat');
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string, actions?: any[]}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: "Hello! I'm your NomadOS Concierge. How can I help with your next move?"
        }
      ]);
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    if (!isPro) {
      onOpenPricing();
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })) as ChatMessage[];

      const response = await AIProvider.chat(state, userMessage, history);
      
      let fullContent = response.answer;
      if (response.warnings && response.warnings.length > 0) {
         fullContent += "\n\n**Warnings:**\n" + response.warnings.map(w => `- ${w}`).join('\n');
      }
      if (response.recommendations && response.recommendations.length > 0) {
         fullContent += "\n\n**Recommendations:**\n" + response.recommendations.map(r => `- ${r}`).join('\n');
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: fullContent,
        actions: response.actions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "I'm sorry, I encountered an error connecting to the intelligence engine. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold font-display text-stone-900 mb-2">NomadOS Intelligence</h2>
        <p className="text-stone-500 mb-8 text-sm">
          Upgrade to Pro to unlock the AI Concierge and Smart Route Optimizer. Plan your travels with full context awareness, Schengen safety checks, and tax optimization.
        </p>
        <button
          onClick={onOpenPricing}
          className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors shadow-lg"
        >
          Unlock Pro Features
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden relative">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveView('chat')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeView === 'chat' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Concierge
          </button>
          <button 
            onClick={() => setActiveView('optimizer')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeView === 'optimizer' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Route Optimizer
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Context Active</span>
        </div>
      </div>

      {activeView === 'optimizer' ? (
        <RouteOptimizer state={state} onActionClick={onNavigateTab} />
      ) : (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-display">AI Concierge</h3>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                Ask about your Schengen limits, budget, next destinations, or work schedules.
              </p>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-stone-200' : 'bg-stone-900 text-white'}`}>
                  {msg.role === 'user' ? <span className="text-xs font-bold">ME</span> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-stone-100 text-stone-800 rounded-tr-sm' : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm markdown-body'}`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                  
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => onNavigateTab(act.actionId)}
                          className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-bold text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors flex items-center gap-1.5 shadow-xs uppercase tracking-wider"
                        >
                          {act.label}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-stone-200 rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-stone-100">
            <div className="mb-3 px-1">
               <p className="text-[9px] text-stone-400 font-medium text-center">
                 Responses are informational and should be verified with the relevant authority/professional.
               </p>
            </div>
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about visas, budget, or where to go next..."
                className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-stone-400"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="absolute right-2 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
               {['Plan my next 90 days', 'Can I stay in Spain for 30 days?', 'Check my upcoming trips'].map((prompt, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setInputMessage(prompt)}
                   className="shrink-0 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-medium text-stone-600 transition-colors"
                 >
                   {prompt}
                 </button>
               ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
