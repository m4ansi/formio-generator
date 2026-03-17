import { Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface MiddlePanelProps {
  hasFiles: boolean;
  onGenerate: () => void;
  isGenerating: boolean;
  formPreview?: any;
  onClear: () => void;
}

export function MiddlePanel({ hasFiles, onGenerate, isGenerating, formPreview, onClear }: MiddlePanelProps) {
  const [signature, setSignature] = useState('');

  return (
    <div className="h-full bg-gradient-to-br from-[#0F57C2] to-[#4F2FAA] rounded-l-[20px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
      {!formPreview ? (
        <div className="text-center relative z-10">
          <div className="mb-6">
            <svg 
              className="w-24 h-24 mx-auto text-blue-300 opacity-50" 
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 10 50 L 30 50 L 35 35 L 42 65 L 50 50 L 90 50" />
            </svg>
          </div>
          
          <p className="text-white text-lg mb-8">
            {hasFiles 
              ? 'Ready to extract fields from your PDF' 
              : 'Upload a form to start mapping fields'}
          </p>

          {hasFiles && (
            <Button
              size="lg"
              onClick={onGenerate}
              disabled={isGenerating}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Form...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Form
                </>
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg p-6 overflow-auto relative">
          {/* Clear Button */}
          <Button
            onClick={onClear}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 shadow-lg z-10"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Form
          </Button>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            {/* Document Header */}
            <div className="border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-3xl mb-2">{formPreview.title || 'Patient Consent Form'}</h1>
              <p className="text-sm text-gray-500">MedSpa Patient Documentation</p>
            </div>

            {/* Content Box */}
            <div className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[300px]">
                <h2 className="text-lg mb-4">Patient Information & Consent</h2>
                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <p>
                    I hereby authorize the medical staff at this facility to perform the necessary 
                    procedures and treatments as discussed during my consultation. I understand that 
                    the practice of medicine is not an exact science and acknowledge that no guarantees 
                    have been made to me concerning the results of any procedure or treatment.
                  </p>
                  <p>
                    I certify that I have been given the opportunity to ask questions and that all 
                    my questions have been answered to my satisfaction. I understand the risks, 
                    benefits, and alternatives associated with the proposed treatment.
                  </p>
                  <p>
                    I consent to the administration of medications and treatments as deemed necessary 
                    by the medical staff. I understand that I may refuse any treatment at any time.
                  </p>
                  
                  {formPreview.content && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p>{formPreview.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-t-2 border-gray-300 pt-6">
              <h3 className="text-sm mb-4">
                Patient Signature <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">(Required)</span>
              </h3>
              
              <div className="mb-6">
                <div className="border-2 border-gray-900 rounded-lg h-32 bg-gray-50 flex items-center justify-center relative">
                  {signature ? (
                    <div className="text-3xl italic font-serif text-gray-800">{signature}</div>
                  ) : (
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Sign here</p>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Type your full name to sign"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  required
                />
              </div>

              {/* Date Section */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    defaultValue={new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  />
                </div>
              </div>

              {/* Removed Submit Button - Clear button is now in top-right */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}