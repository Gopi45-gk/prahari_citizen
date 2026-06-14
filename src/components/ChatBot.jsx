import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { sendChatMessage } from '../services/chatService';
import { useTranslation } from '../i18n/useTranslation';

export default function ChatBot() {
  const { t, selectedLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with translated welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t('chatWelcome')
      }]);
    }
  }, [t, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      // Send only role/content pairs (exclude the welcome message for cleaner context)
      const apiMessages = updatedMessages
        .filter((_, i) => i > 0 || updatedMessages[0].role === 'user')
        .map(m => ({ role: m.role, content: m.content }));
      
      const reply = await sendChatMessage(apiMessages, selectedLanguage);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(t('chatError'));
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: t('chatQuickEmergency'), prompt: t('chatPromptEmergency') },
    { label: t('chatQuickScan'), prompt: t('chatPromptScan') },
    { label: t('chatQuickHelpline'), prompt: t('chatPromptHelpline') },
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    setTimeout(() => {
      const userMessage = { role: 'user', content: prompt };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setError(null);
      setIsLoading(true);

      const apiMessages = updatedMessages
        .filter((_, i) => i > 0 || updatedMessages[0].role === 'user')
        .map(m => ({ role: m.role, content: m.content }));

      sendChatMessage(apiMessages, selectedLanguage)
        .then(reply => setMessages(prev => [...prev, { role: 'assistant', content: reply }]))
        .catch(err => {
          setError(t('chatError'));
          console.error('Chat error:', err);
        })
        .finally(() => setIsLoading(false));
    }, 50);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        id="prahari-chat-bubble"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-[90] transition-all duration-300 ease-out ${
          isOpen 
            ? 'bottom-[480px] md:bottom-[540px] right-4 md:right-6 scale-90' 
            : 'bottom-20 md:bottom-6 right-4 md:right-6 scale-100 hover:scale-110'
        }`}
      >
        <div className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-600 dark:bg-slate-500 shadow-slate-500/30' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40 hover:shadow-blue-500/60'
        }`}>
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </>
          )}
        </div>
      </button>

      {/* Chat Panel */}
      <div className={`fixed z-[89] bottom-0 right-0 md:bottom-4 md:right-4 transition-all duration-300 ease-out ${
        isOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}>
        <div className="w-screen h-[470px] md:w-[400px] md:h-[520px] md:rounded-2xl bg-white dark:bg-slate-800 shadow-2xl shadow-black/20 border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden md:mr-2">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{t('chatTitle')}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-blue-100 text-xs">{t('chatPoweredBy')}</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 dark:bg-blue-900/40' 
                    : 'bg-indigo-100 dark:bg-indigo-900/40'
                }`}>
                  {msg.role === 'user' 
                    ? <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    : <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  }
                </div>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/40 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t('chatThinking')}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (only show when few messages) */}
          {messages.length <= 1 && !isLoading && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chatPlaceholder')}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{ minHeight: '40px', maxHeight: '80px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                  input.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
      `}} />
    </>
  );
}
