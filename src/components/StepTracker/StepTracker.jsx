import React, { useState, useEffect } from "react";
import "./StepTracker.css";
import { useLocation } from 'react-router-dom';

const StepTracker = ({ percentage }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split('/');
  const targetSegment = segments[1];
  const prefix = targetSegment.substring(0, 3);
  const [isTrue, setIsTrue] = useState(prefix !== "agn" ? false : false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Determine current step based on URL path
  const getCurrentStepFromPath = () => {
    if (prefix === "agn") {
      if (pathname.includes('/agnstepone')) return 1;
      if (pathname.includes('/agnsteptwo')) return 2;
      if (pathname.includes('/agnstepthree')) return 3;
      if (pathname.includes('/agnstepfour')) return 4;
      if (pathname.includes('/agnstepfive')) return 5;
      return 1;
    } else {
      if (pathname.includes('/memstepone')) return 1;
      if (pathname.includes('/memsteptwo')) return 2;
      if (pathname.includes('/memstepthree')) return 3;
      if (pathname.includes('/memstepfour')) return 4;
      if (pathname.includes('/memstepfive')) return 5;
      if (pathname.includes('/memstepsix')) return 6;
      return 1;
    }
  };
  
  const currentStep = getCurrentStepFromPath();
  const totalSteps = prefix === "agn" ? 5 : 6;
  const completedSteps = currentStep - 1; // Use actual current step instead of percentage

  // Auto-scroll to current step on mobile
  useEffect(() => {
    if (isMobile) {
      const scrollToCurrentStep = (attempt = 1) => {
        const currentStepElement = document.querySelector(`.step-item.current`);
        const stepTrackerContainer = document.querySelector('.step-tracker-container');
        
        if (currentStepElement && stepTrackerContainer) {
          // Get the position of the current step element
          const containerRect = stepTrackerContainer.getBoundingClientRect();
          const elementRect = currentStepElement.getBoundingClientRect();
          
          // Calculate the scroll position to center the current step
          const scrollLeft = currentStepElement.offsetLeft - (containerRect.width / 2) + (elementRect.width / 2);
          
          console.log('Scrolling to step:', currentStep, 'scrollLeft:', scrollLeft);
          
          // Force immediate scroll without smooth behavior first
          stepTrackerContainer.scrollLeft = Math.max(0, scrollLeft);
          
          // Try different scroll methods
          setTimeout(() => {
            // Method 1: scrollTo
            stepTrackerContainer.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: 'smooth'
            });
            
            // Method 2: scrollIntoView
            currentStepElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
            
            // Method 3: Direct scrollLeft assignment
            stepTrackerContainer.scrollLeft = Math.max(0, scrollLeft);
          }, 100);
        } else if (attempt < 5) {
          // Retry if elements not found
          setTimeout(() => scrollToCurrentStep(attempt + 1), 200);
        }
      };

      // Multiple attempts with increasing delays
      const timer1 = setTimeout(() => scrollToCurrentStep(), 100);
      const timer2 = setTimeout(() => scrollToCurrentStep(), 500);
      const timer3 = setTimeout(() => scrollToCurrentStep(), 1000);
      
      // Use requestAnimationFrame for better timing
      const rafTimer = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToCurrentStep();
        });
      });
      
      // Use MutationObserver to detect when DOM is ready
      const observer = new MutationObserver(() => {
        scrollToCurrentStep();
      });
      
      const stepTrackerContainer = document.querySelector('.step-tracker-container');
      if (stepTrackerContainer) {
        observer.observe(stepTrackerContainer, {
          childList: true,
          subtree: true
        });
      }
      
      // Also scroll on window resize
      const handleResize = () => {
        setTimeout(() => scrollToCurrentStep(), 100);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        cancelAnimationFrame(rafTimer);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      };
    }
  }, [currentStep, isMobile]);

  // Calculate progress for horizontal layout based on actual steps
  const progressWidth = isMobile ? `${(completedSteps / totalSteps) * 100}%` : '0%';
  const progressHeight = `${(completedSteps / totalSteps) * 100}%`;
  
  // Calculate progress based on actual current step position
  const getProgressWidth = () => {
    if (!isMobile) return '0px';
    
    // Calculate based on actual step positions
    const stepWidth = 160; // Base step width
    const stepGap = 24; // Gap between steps (1.5rem = 24px)
    const iconSize = 60; // Icon size
    const iconOffset = 30; // Icon offset from left
    
    // Calculate total width up to current step (not completed steps)
    let totalWidth = iconOffset; // Start from icon offset
    
    // Line should extend up to current step, not completed steps
    for (let i = 0; i < currentStep - 1; i++) {
      totalWidth += stepWidth + stepGap;
    }
    
    return `${totalWidth}px`;
  };

  // Professional SVG Icons
  const getStepIcon = (stepId, isCompleted, isCurrent) => {
    if (isCompleted) {
      return (
        <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    const iconProps = {
      className: "icon-svg",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    };

    switch (stepId) {
      case 1:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 2:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 3:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 4:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 5:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 6:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Define steps with professional titles and descriptions
  const steps = prefix === "agn" ? [
    {
      id: 1,
      title: "Personal Details",
      description: "Enter your basic information",
      completed: 1 < currentStep,
      current: 1 === currentStep
    },
    {
      id: 2,
      title: "Residence Details", 
      description: "Add your address information",
      completed: 2 < currentStep,
      current: 2 === currentStep
    },
    {
      id: 3,
      title: "Education & Profession",
      description: "Share your background",
      completed: 3 < currentStep,
      current: 3 === currentStep
    },
    {
      id: 4,
      title: "Verification",
      description: "Verify your details",
      completed: 4 < currentStep,
      current: 4 === currentStep
    },
    {
      id: 5,
      title: "Payment",
      description: "Complete payment",
      completed: 5 < currentStep,
      current: 5 === currentStep
    }
  ] : [
    {
      id: 1,
      title: "Personal Details",
      description: "Enter your basic information",
      completed: 1 < currentStep,
      current: 1 === currentStep
    },
    {
      id: 2,
      title: "Religious Details",
      description: "Share your religious background", 
      completed: 2 < currentStep,
      current: 2 === currentStep
    },
    {
      id: 3,
      title: "Family Details",
      description: "Add family information",
      completed: 3 < currentStep,
      current: 3 === currentStep
    },
    {
      id: 4,
      title: "Partner Expectations",
      description: "Define your preferences",
      completed: 4 < currentStep,
      current: 4 === currentStep
    },
    {
      id: 5,
      title: "Privacy Selection",
      description: "Set your privacy settings",
      completed: 5 < currentStep,
      current: 5 === currentStep
    },
    {
      id: 6,
      title: "Review & Confirm",
      description: "Review and submit",
      completed: 6 < currentStep,
      current: 6 === currentStep
    }
  ];

  return (
        <div
      className="modern-step-tracker"
          style={{
        '--progress-width': progressWidth,
        '--progress-height': progressHeight,
        '--progress-width-px': getProgressWidth()
      }}
    >
      <div className="step-tracker-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step-item">
            {/* Step Icon and Status */}
            <div className={`step-icon-container ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
              <div className="step-icon">
                {getStepIcon(step.id, step.completed, step.current)}
      </div>
    </div>

            {/* Step Content */}
            <div className="step-content">
              <h4 className="step-title">{step.title}</h4>
              <p className="step-description">{step.description}</p>
      </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className={`connecting-line ${step.completed ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Scroll indicator for mobile */}
      {isMobile && (
        <div className="scroll-indicator">
          <div className="scroll-text">← Scroll to see all steps →</div>
      </div>
      )}
    </div>
  );
};

export default StepTracker;

