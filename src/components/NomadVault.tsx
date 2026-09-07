import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CheckSquare,
  Square,
  Shield,
  Layers,
} from 'lucide-react';
import { NomadDocCheck } from '../types';
import { getDaysUntil } from '../utils/formatters';

interface NomadVaultProps {
  documents: NomadDocCheck[];
  onAddDoc: (doc: Omit<NomadDocCheck, 'id'>) => void;
  onDeleteDoc: (id: string) => void;
}

export const NomadVault: React.FC<NomadVaultProps> = ({
  documents,
  onAddDoc,
  onDeleteDoc,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<NomadDocCheck['type']>('passport');
  const [newRef, setNewRef] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Nomad departure checklist items
  const [checklist, setChecklist] = useState([
    { id: '1', text: 'Passport validity >6 months beyond return date', checked: true },
    { id: '2', text: 'Primary and secondary backup multi-currency cards (Wise, Revolut)', checked: true },
    { id: '3', text: 'Nomad medical evacuation insurance active (SafetyWing / Allianz)', checked: true },
    { id: '4', text: 'Universal GaN travel adapter (EU, UK, US, AU pins)', checked: true },
    { id: '5', text: 'eSIM profile installed & activated for next destination', checked: false },
    { id: '6', text: 'Emergency embassy hotline saved to offline phone contacts', checked: false },
    { id: '7', text: 'Offline Google Maps downloaded for destination city', checked: true },
    { id: '8', text: 'Printed proof of onward travel / return ticket', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExpiry) return;

    onAddDoc({
      title: newTitle.trim(),
      type: newType,
      referenceNumber: newRef.trim(),
      expirationDate: newExpiry,
      notes: newNotes.trim(),
    });

    setNewTitle('');
    setNewRef('');
    setNewExpiry('');
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Nomad Vault & Expiry Monitor
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 mt-1">
              Documents, Visas & Border Protocols
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Never get turned away at border control. Track passport expiration 6-month validity countdowns, health insurance, and pre-departure checklists.
            </p>
          </div>

          <button
            id="add-nomad-doc-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Document</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="mt-6 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
          >
            <div className="text-sm font-semibold text-stone-200">Register Document</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Passport, SafetyWing Policy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Doc Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as NomadDocCheck['type'])}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="passport">Passport</option>
                  <option value="insurance">Insurance Policy</option>
                  <option value="visa">Visa / Residence Permit</option>
                  <option value="driving_permit">International Driving Permit</option>
                  <option value="other">Other Credential</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Ref / Policy Number</label>
                <input
                  type="text"
                  placeholder="e.g. P12345678"
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Notes / Coverage Limits</label>
              <input
                type="text"
                placeholder="e.g. 24/7 hotline +1-800-..., includes extreme sports rider"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors"
              >
                Save Document
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Grid: Documents list on left + Departure checklist on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Registered Credentials & Expiration Countdowns</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">{documents.length} registered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const daysLeft = getDaysUntil(doc.expirationDate);
              const isUrgent = daysLeft <= 180; // 6-month rule
              const isExpired = daysLeft <= 0;

              return (
                <div
                  key={doc.id}
                  className={`rounded-xl border p-4 bg-stone-900/60 flex flex-col justify-between transition-colors ${
                    isExpired
                      ? 'border-rose-500/50'
                      : isUrgent
                      ? 'border-amber-500/40'
                      : 'border-stone-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                          {doc.type.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-stone-100 mt-2">{doc.title}</h4>
                        {doc.referenceNumber && (
                          <div className="text-xs font-mono text-stone-400 mt-0.5">
                            Ref: {doc.referenceNumber}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteDoc(doc.id)}
                        className="p-1 rounded hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {doc.notes && (
                      <p className="text-xs text-stone-400 mt-3 pt-2 border-t border-stone-800/80">
                        {doc.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800/70 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-mono">
                      Expires: {doc.expirationDate}
                    </span>

                    {isExpired ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Expired!
                      </span>
                    ) : isUrgent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {daysLeft}d (&lt;6mo warning)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {daysLeft} days valid
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Departure Protocol Checklist */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <h3 className="font-bold text-stone-100 text-sm">Nomad Pre-Flight Checklist</h3>
          </div>
          <p className="text-xs text-stone-400 mb-4">
            Border readiness and hardware checklist before stepping onto the tarmac.
          </p>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-800/40 transition-colors group"
              >
                {item.checked ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-stone-500 group-hover:text-stone-300 mt-0.5 flex-shrink-0" />
                )}
                <span
                  className={`text-xs leading-relaxed ${
                    item.checked ? 'text-stone-400 line-through' : 'text-stone-200'
                  }`}
                >
                  {item.text}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-1">Pro-Tip for Nomads:</span>
            Always keep physical photocopies of your passport and visa approval letters separated in your daypack from your original credentials.
          </div>
        </div>
      </div>
    </div>
  );
};
