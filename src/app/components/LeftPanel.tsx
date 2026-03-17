import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';

interface Template {
  id: string;
  name: string;
  description: string;
  fieldCount: number;
}

interface SavedFile {
  id: string;
  name: string;
  createdAt: string;
  jsonData: any;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
}

interface LeftPanelProps {
  onFilesUpload: (files: File[]) => void;
  onTemplateLoad: (template: Template) => void;
  onSavedFileLoad: (jsonData: any) => void;
  uploadedFiles: UploadedFile[];
  selectedFileId?: string;
  onFileSelect: (fileId: string) => void;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Intake Forms',
    description: 'Standard patient intake',
    fieldCount: 2  // Number of saved intake forms
  },
  {
    id: '2',
    name: 'Consent Forms',
    description: 'Patient consent documents',
    fieldCount: 3  // Number of saved consent forms
  }
];

// Mock saved files for each category
const savedIntakeForms: SavedFile[] = [
  {
    id: 'intake-1',
    name: 'New Patient Intake',
    createdAt: '2024-03-15',
    jsonData: {
      title: 'New Patient Intake Form',
      display: 'form',
      components: [{
        type: 'well',
        key: 'intakeFormWell',
        label: 'Intake Form Container',
        components: [
          { type: 'textfield', key: 'firstName', label: 'First Name', placeholder: 'Enter first name', input: true, required: true },
          { type: 'textfield', key: 'lastName', label: 'Last Name', placeholder: 'Enter last name', input: true, required: true },
          { type: 'email', key: 'email', label: 'Email Address', placeholder: 'Enter email', input: true, required: true },
          { type: 'phoneNumber', key: 'phone', label: 'Phone Number', placeholder: '(555) 555-5555', input: true },
          { type: 'textarea', key: 'medicalHistory', label: 'Medical History', placeholder: 'Please describe any relevant medical history', input: true, rows: 4 }
        ]
      }]
    }
  },
  {
    id: 'intake-2',
    name: 'Allergy Intake Form',
    createdAt: '2024-03-10',
    jsonData: {
      title: 'Allergy & Medication Intake',
      display: 'form',
      components: [{
        type: 'well',
        key: 'allergyFormWell',
        label: 'Allergy Form Container',
        components: [
          { type: 'textfield', key: 'patientName', label: 'Patient Name', input: true, required: true },
          { type: 'textarea', key: 'allergies', label: 'Known Allergies', placeholder: 'List any known allergies', input: true, rows: 3 },
          { type: 'textarea', key: 'medications', label: 'Current Medications', placeholder: 'List current medications', input: true, rows: 3 },
          { type: 'checkbox', key: 'noAllergies', label: 'I have no known allergies', input: true }
        ]
      }]
    }
  }
];

const savedConsentForms: SavedFile[] = [
  {
    id: 'consent-1',
    name: 'Treatment Consent',
    createdAt: '2024-03-14',
    jsonData: {
      title: 'Treatment Consent Form',
      display: 'form',
      components: [{
        type: 'well',
        key: 'consentFormWell',
        label: 'Consent Form Container',
        components: [
          {
            type: 'htmlelement',
            tag: 'h1',
            key: 'documentHeader',
            content: 'Treatment Consent Form',
            className: 'text-3xl mb-2'
          },
          {
            type: 'content',
            key: 'consentContent',
            label: 'Consent Information',
            html: '<div class="bg-gray-50 border border-gray-200 rounded-lg p-6"><p>I hereby consent to the proposed treatment and acknowledge that I have been informed of the risks and benefits.</p></div>'
          },
          {
            type: 'signature',
            key: 'patientSignature',
            label: 'Patient Signature',
            required: true,
            validate: { required: true }
          },
          {
            type: 'datetime',
            key: 'signatureDate',
            label: 'Date',
            format: 'yyyy-MM-dd',
            required: true
          }
        ]
      }]
    }
  },
  {
    id: 'consent-2',
    name: 'Botox Consent',
    createdAt: '2024-03-12',
    jsonData: {
      title: 'Botox Treatment Consent',
      display: 'form',
      components: [{
        type: 'well',
        key: 'botoxConsentWell',
        label: 'Botox Consent Container',
        components: [
          {
            type: 'htmlelement',
            tag: 'h1',
            key: 'documentHeader',
            content: 'Botox Treatment Consent',
            className: 'text-3xl mb-2'
          },
          {
            type: 'content',
            key: 'botoxContent',
            html: '<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[200px]"><h2 class="text-lg mb-3">Botox Treatment Information</h2><p>I consent to Botox injections and understand the potential risks, benefits, and side effects as explained by my provider.</p></div>'
          },
          {
            type: 'signature',
            key: 'patientSignature',
            label: 'Patient Signature',
            required: true,
            validate: { required: true }
          },
          {
            type: 'datetime',
            key: 'signatureDate',
            label: 'Date',
            format: 'yyyy-MM-dd',
            required: true
          }
        ]
      }]
    }
  },
  {
    id: 'consent-3',
    name: 'Filler Consent',
    createdAt: '2024-03-08',
    jsonData: {
      title: 'Dermal Filler Consent',
      display: 'form',
      components: [{
        type: 'well',
        key: 'fillerConsentWell',
        label: 'Filler Consent Container',
        components: [
          {
            type: 'htmlelement',
            tag: 'h1',
            key: 'documentHeader',
            content: 'Dermal Filler Consent',
            className: 'text-3xl mb-2'
          },
          {
            type: 'content',
            key: 'fillerContent',
            html: '<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[200px]"><h2 class="text-lg mb-3">Filler Treatment Information</h2><p>I consent to dermal filler treatment and understand all associated risks including bruising, swelling, and potential complications.</p></div>'
          },
          {
            type: 'signature',
            key: 'patientSignature',
            label: 'Patient Signature',
            required: true,
            validate: { required: true }
          },
          {
            type: 'datetime',
            key: 'signatureDate',
            label: 'Date',
            format: 'yyyy-MM-dd',
            required: true
          }
        ]
      }]
    }
  }
];

export function LeftPanel({ onFilesUpload, onTemplateLoad, onSavedFileLoad, uploadedFiles, selectedFileId, onFileSelect }: LeftPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'intake' | 'consent' | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (files.length > 0) {
      onFilesUpload(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onFilesUpload(files);
    }
  };

  const handleTemplateLoad = (template: Template) => {
    onTemplateLoad(template);
  };

  const handleSavedFileLoad = (jsonData: any) => {
    onSavedFileLoad(jsonData);
    handleModalClose();
  };

  const handleCategorySelect = (category: 'intake' | 'consent') => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="h-full p-6 flex flex-col bg-[#f2f2f2] overflow-y-auto">
      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-sm mb-4 text-gray-600">Upload PDFs</h2>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-900 mx-auto mb-4 flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm mb-1">Drop multiple PDFs here</p>
            <p className="text-xs text-gray-500">or click to browse</p>
          </label>
        </div>
      </div>

      {/* Uploaded Files Section */}
      <div className="mb-8 flex-1">
        <h2 className="text-sm mb-4 text-gray-600">Uploaded Files ({uploadedFiles.length})</h2>
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No PDFs uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div 
                key={file.id} 
                className={`bg-white rounded p-3 flex items-center gap-3 cursor-pointer transition-all ${ 
                  selectedFileId === file.id 
                    ? 'ring-2 ring-blue-500 shadow-md' 
                    : 'hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => onFileSelect(file.id)}
              >
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                {selectedFileId === file.id && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Library Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-gray-600">Template Library</h2>
          <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-1">
            <FileText className="w-3 h-3 mr-1" />
            Save Current
          </Button>
        </div>
        <div className="space-y-3">
          {mockTemplates.map(template => (
            <div 
              key={template.id} 
              className="bg-gray-900 text-white rounded-lg p-4"
            >
              <h3 className="text-sm mb-1">{template.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{template.fieldCount} forms</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-white h-auto p-1 hover:bg-gray-800"
                  onClick={() => handleCategorySelect(template.id === '1' ? 'intake' : 'consent')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Load
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Files Modal */}
      {showModal && (
        <div className="fixed left-0 top-0 right-0 bottom-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96 max-h-[80vh] overflow-y-auto pointer-events-auto border-2 border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {selectedCategory === 'intake' ? 'Intake Forms' : 'Consent Forms'}
              </h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={handleModalClose}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {selectedCategory === 'intake' && savedIntakeForms.map(file => (
                <div 
                  key={file.id} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-100 hover:border-blue-300"
                  onClick={() => handleSavedFileLoad(file.jsonData)}
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Created on {file.createdAt}
                    </p>
                  </div>
                </div>
              ))}
              {selectedCategory === 'consent' && savedConsentForms.map(file => (
                <div 
                  key={file.id} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-100 hover:border-blue-300"
                  onClick={() => handleSavedFileLoad(file.jsonData)}
                >
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Created on {file.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Backdrop that closes modal when clicked */}
          <div className="fixed inset-0 -z-10 pointer-events-auto" onClick={handleModalClose}></div>
        </div>
      )}
    </div>
  );
}