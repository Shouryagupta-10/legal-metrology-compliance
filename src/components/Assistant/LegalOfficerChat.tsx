import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, ChevronRight, Scale, BookOpen } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  ruleCitation?: string;
}

const FAQ_PROMPTS = [
  "Can I use 'gms' instead of 'g' on packaging?",
  "When is Unit Sale Price (USP) mandatory?",
  "What is the penalty for missing 'inclusive of all taxes'?",
  "What is the minimum font height for a 500g package under Rule 7?",
  "What 4 consumer care details are required under Rule 6(1)(n)?"
];

export const LegalOfficerChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am your Legal Metrology Compliance Assistant. You can ask me any question regarding the Legal Metrology (Packaged Commodities) Rules, 2011, standard SI metric units, Unit Sale Price (USP) rules, or Section 36 penalty provisions.',
      ruleCitation: 'LMPC Rules 2011 Statutory Advisory Desk'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim()) return;

    sounds.playClick();

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');

    // Generate accurate legal response based on LMPC 2011 rules
    setTimeout(() => {
      let botReply = '';
      let citation = '';
      const lower = q.toLowerCase();

      if (lower.includes('gms') || lower.includes('unit') || lower.includes('gm') || lower.includes('symbol')) {
        botReply = "Under Rule 11 & Rule 13 of the Legal Metrology (Packaged Commodities) Rules, 2011, the use of symbols such as 'gm', 'gms', 'kgs', 'ml.', 'mtrs' is strictly PROHIBITED. Only standard SI symbols must be used: 'g' for gram, 'kg' for kilogram, 'ml' or 'mL' for millilitre, and 'l' or 'L' for litre. Using 'gms' constitutes a statutory violation under Section 36(1) with a fine up to ₹25,000.";
        citation = 'Rule 11 & Rule 13 of LMPC Rules, 2011';
      } else if (lower.includes('usp') || lower.includes('unit sale price') || lower.includes('unit price')) {
        botReply = "Under the Legal Metrology (Second Amendment) Rules, 2021 (mandatory from Dec 2022), Unit Sale Price (USP) is MANDATORY for all packages where net quantity exceeds 1 kg (in ₹/g or ₹/kg), 1 L (in ₹/ml or ₹/L), 1 metre, or items sold by count (in ₹/piece). The declared USP must mathematically match (MRP ÷ Net Quantity) rounded to 2 decimal places.";
        citation = 'Rule 6(1)(e) Proviso (2021 Second Amendment)';
      } else if (lower.includes('tax') || lower.includes('mrp') || lower.includes('inclusive')) {
        botReply = "Under Rule 6(1)(e) and Rule 18, every package must state the Maximum Retail Price with the mandatory words 'inclusive of all taxes' or 'incl. of all taxes'. Omitting this phrase or stating 'taxes extra' is a punishable violation under Section 36 with fines up to ₹25,000 for the first offence and up to ₹50,000 for subsequent offences.";
        citation = 'Rule 6(1)(e) & Rule 18(2) of LMPC Rules, 2011';
      } else if (lower.includes('font') || lower.includes('height') || lower.includes('rule 7') || lower.includes('pdp') || lower.includes('500g')) {
        botReply = "Under Rule 7 and Table 1 of LMPC Rules, 2011:\n• Up to 50g/ml: Min numeral height is 1.5 mm\n• 50g to 200g/ml: Min numeral height is 2.0 mm\n• 200g to 1kg/1L: Min numeral height is 4.0 mm\n• Above 1kg/1L: Min numeral height is 6.0 mm.\nFor a 500g package, the numeral height of the net quantity must be at least 4.0 mm.";
        citation = 'Rule 7 & Table 1 of LMPC Rules, 2011';
      } else if (lower.includes('consumer') || lower.includes('care') || lower.includes('email') || lower.includes('phone') || lower.includes('6(1)(n)')) {
        botReply = "Rule 6(1)(n) mandates that every package MUST declare ALL 4 elements:\n1. Name/Designation of the contact person/office\n2. Complete Postal Address\n3. Telephone number or Toll-Free Helpline\n4. Valid Email Address.\nMissing either the telephone number or email address is a direct statutory defect leading to compounding notices.";
        citation = 'Rule 6(1)(n) of LMPC Rules, 2011';
      } else {
        botReply = `Under the Legal Metrology Act, 2009 and Packaged Commodities Rules, 2011, all pre-packaged commodities distributed in India must bear mandatory declarations: Manufacturer/Packer/Importer with PIN code, Generic Commodity Name, Net Quantity in standard metric units, Month & Year of Mfg/Packing, MRP inclusive of all taxes, Unit Sale Price (USP if >1kg/1L), Country of Origin, and complete Consumer Care details.`;
        citation = 'Legal Metrology Act, 2009 & LMPC Rules, 2011';
      }

      sounds.playSuccess();
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now()),
          sender: 'bot',
          text: botReply,
          ruleCitation: citation
        }
      ]);
    }, 400);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Legal Metrology Compliance Assistant
            </h3>
            <p className="text-[10px] text-slate-400">Grounded in LMPC Rules 2011 & Legal Metrology Act 2009</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 space-y-1.5">
        <span className="text-[10px] font-bold uppercase text-slate-400">Common Statutory Questions:</span>
        <div className="flex flex-wrap gap-1.5">
          {FAQ_PROMPTS.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1 text-left transition-colors flex items-center gap-1"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-2.5 h-2.5 text-sky-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none shadow-md shadow-sky-600/20'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.ruleCitation && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-sky-300 font-semibold flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-sky-400" />
                  <span>{m.ruleCitation}</span>
                </div>
              )}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 focus-within:border-sky-500"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a rule question (e.g. 'Is gms allowed?')..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:hover:bg-sky-600 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};