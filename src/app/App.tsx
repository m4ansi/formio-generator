import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { MiddlePanel } from './components/MiddlePanel';
import { RightPanel } from './components/RightPanel';
import { extractText } from "../lib/fileTextExtractor";
import { generateFormIO } from "../lib/formioAI";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File
}

interface FormData {
  title: string;
  display: string;
  content: string;
  components: any[];
}

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: 'Untitled Form',
    display: 'form',
    content: '',
    components: []
  });
  const [validation, setValidation] = useState({
    fieldsMapped: 0,
    errors: 0,
    warnings: 0
  });

  const handleFilesUpload = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    // Auto-select the first uploaded file if none selected
    if (!selectedFileId && newFiles.length > 0) {
      setSelectedFileId(newFiles[0].id);
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  const handleClearForm = () => {
    setFormData({
      title: 'Untitled Form',
      display: 'form',
      content: '',
      components: []
    });
    setValidation({
      fieldsMapped: 0,
      errors: 0,
      warnings: 0
    });
    setSelectedFileId(undefined);
  };

  const handleTemplateLoad = (template: any) => {
    // Mock loading a template
    const mockComponents = [
      {
        type: 'well',
        key: 'templateFormWell',
        label: 'Template Form Container',
        components: [
          {
            type: 'textfield',
            key: 'firstName',
            label: 'First Name',
            placeholder: 'Enter your first name',
            input: true
          },
          {
            type: 'textfield',
            key: 'lastName',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            input: true
          },
          {
            type: 'textfield',
            key: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            input: true
          },
          {
            type: 'textarea',
            key: 'medicalHistory',
            label: 'Medical History',
            placeholder: 'Please describe your medical history',
            input: true
          },
          {
            type: 'checkbox',
            key: 'consent',
            label: 'I consent to treatment',
            input: true
          }
        ]
      }
    ];

    setFormData({
      title: template.name,
      display: 'form',
      content: '',
      components: mockComponents
    });

    setValidation({
      fieldsMapped: 5, // Actual form fields inside well
      errors: 0,
      warnings: 0
    });
  };

  const handleSavedFileLoad = (jsonData: any) => {
    setFormData(jsonData);
    
    // Count fields inside well component
    const fieldCount = jsonData.components?.[0]?.components?.length || 0;
    
    setValidation({
      fieldsMapped: fieldCount,
      errors: 0,
      warnings: 0
    });
  };

  const handleGenerate = async () => {

  if (!uploadedFiles.length) return;

  setIsGenerating(true);

  try {

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = input?.files?.[0];

    if (!file) {
      setIsGenerating(false);
      return;
    }

    const text = await extractText(file);

    const json = await generateFormIO(text);

    setFormData(json);

    setValidation({
      fieldsMapped: json.components?.length || 0,
      errors: 0,
      warnings: 0
    });

  } catch (err) {

    console.error(err);

    setValidation({
      fieldsMapped: 0,
      errors: 1,
      warnings: 0
    });

  }

  setIsGenerating(false);
};

      setFormData(generatedForm);

      setValidation({
        fieldsMapped: 6, // Updated count for components inside well
        errors: 0,
        warnings: 0
      });

      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal">
          {/* Left Panel */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <LeftPanel
              onFilesUpload={handleFilesUpload}
              onTemplateLoad={handleTemplateLoad}
              uploadedFiles={uploadedFiles}
              selectedFileId={selectedFileId}
              onFileSelect={handleFileSelect}
              onSavedFileLoad={handleSavedFileLoad}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-blue-500 transition-colors" />

          {/* Middle Panel */}
          <Panel defaultSize={45} minSize={30}>
            <MiddlePanel
              hasFiles={uploadedFiles.length > 0}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              formPreview={formData.components.length > 0 ? formData : undefined}
              onClear={handleClearForm}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-blue-500 transition-colors" />

          {/* Right Panel */}
          <Panel defaultSize={35} minSize={25}>
            <RightPanel
              jsonData={formData}
              validation={validation}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
