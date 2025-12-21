import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const TechnicalDetailsAccordion = ({ technicalData }) => {
  const [openSections, setOpenSections] = useState(new Set(['overview']));

  const toggleSection = (sectionId) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections?.has(sectionId)) {
      newOpenSections?.delete(sectionId);
    } else {
      newOpenSections?.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const sections = [
    {
      id: 'overview',
      title: 'Analysis Overview',
      icon: 'BarChart3',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Primary Algorithm</h4>
              <p className="text-sm text-text-secondary">{technicalData?.primaryAlgorithm}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Model Architecture</h4>
              <p className="text-sm text-text-secondary">{technicalData?.modelArchitecture}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Training Dataset</h4>
              <p className="text-sm text-text-secondary">{technicalData?.trainingDataset}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Model Version</h4>
              <p className="text-sm text-text-secondary">{technicalData?.modelVersion}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'parameters',
      title: 'Processing Parameters',
      icon: 'Settings',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicalData?.parameters?.map((param, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-1">{param?.name}</h4>
                <p className="text-lg font-semibold text-primary mb-1">{param?.value}</p>
                <p className="text-xs text-text-secondary">{param?.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'confidence',
      title: 'Confidence Levels',
      icon: 'TrendingUp',
      content: (
        <div className="space-y-4">
          {technicalData?.confidenceLevels?.map((level, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{level?.component}</h4>
                <span className="text-sm font-semibold text-primary">{level?.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${level?.confidence}%` }}
                ></div>
              </div>
              <p className="text-sm text-text-secondary">{level?.description}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'methodology',
      title: 'Detection Methodology',
      icon: 'Microscope',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Analysis Pipeline</h4>
            <div className="space-y-3">
              {technicalData?.methodology?.steps?.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{step?.title}</h5>
                    <p className="text-sm text-text-secondary">{step?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Key Indicators Analyzed</h4>
            <div className="flex flex-wrap gap-2">
              {technicalData?.methodology?.indicators?.map((indicator, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full"
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Code" size={20} color="var(--color-primary)" strokeWidth={2} />
          <h2 className="text-lg font-semibold text-foreground">Technical Details</h2>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          Comprehensive analysis parameters and methodology
        </p>
      </div>
      <div className="divide-y divide-border">
        {sections?.map((section) => (
          <div key={section?.id}>
            <button
              onClick={() => toggleSection(section?.id)}
              className="w-full p-6 text-left hover:bg-muted transition-micro focus:outline-none focus:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={section?.icon} 
                    size={18} 
                    color="var(--color-primary)" 
                    strokeWidth={2}
                  />
                  <h3 className="font-medium text-foreground">{section?.title}</h3>
                </div>
                <Icon 
                  name={openSections?.has(section?.id) ? 'ChevronUp' : 'ChevronDown'} 
                  size={18} 
                  color="var(--color-text-secondary)"
                  strokeWidth={2}
                />
              </div>
            </button>
            
            {openSections?.has(section?.id) && (
              <div className="px-6 pb-6">
                {section?.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalDetailsAccordion;