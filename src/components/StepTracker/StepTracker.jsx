import React, { useState , useEffect} from "react";
import "./StepTracker.css";
import { useLocation } from 'react-router-dom';


const StepTracker = ({ percentage }) => {

  const location = useLocation();
  const pathname = location.pathname; // "/agnsteptwo/2"
  const segments = pathname.split('/'); // ["", "agnsteptwo", "2"]
  const targetSegment = segments[1]; // "agnsteptwo"
  const prefix = targetSegment.substring(0, 3);
    const [isTrue , setIsTrue] =useState(prefix !== "agn"? false : false)


  const totalSteps = prefix === "agn"? 5 : 6; 

  
  const completedSteps = Math.floor((percentage / 100) * totalSteps); // Calculate completed steps
  
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  // Define labels for each step
  const stepLabels =  prefix === "agn"?  [
    "Personal Details",
    "Residence Details",
    "Eduction and Profession",
    "Verification",
    "Payment",
  ]: [
    {text : "Personal Details", text1 : "Enter your details"},
    {text : "Religious Details", text1 : "Enter your religious details"},
    {text : "Family Details", text1 : "Enter your family details"},
    {text : "Partner Expectations", text1 : "Enter your partner expectation details"},
    {text : "Privacy Selection", text1 : "Select your privacy"},
    {text : "Review & Confirm", text1 : "Review & Confirm the details"},

  ]  ;
  
  const stepSpacing = 100 / (totalSteps - 1);
  const progressWidth = stepSpacing * (completedSteps - 1);

  return (
    !isTrue ? (
       <div className="step-tracker">
      <div className="tracker-line" style={{height:"0"}}>
        {/* Progress Line */}
        <div
          className="progress-line"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {/* Render Steps */}
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${step <= completedSteps ? "completed" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {/* Render inner circle only for completed steps */}
            {step <= completedSteps && <div className="inner-circle"></div>}
          </div>
        ))}

        
      </div>

      <div className="tracker-line">
        <div
          className="progress-line"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {steps.map((step, index) => (
          <div
            key={step}
            className={`step1 ${step <= completedSteps ? "completed" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {step <= completedSteps && <div className="inner-circle1">
            </div>}
            <span className="step-label">{stepLabels[index]?.text}</span>
            <span className="step-label2">{stepLabels[index]?.text1}</span>


          </div>
        ))}

        
      </div>
    </div>
    )
     :
     (
      <div className="step-tracker">
      <div className="tracker-line" style={{height:"0"}}>
        {/* Progress Line */}
        <div
          className="progress-line"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {/* Render Steps */}
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${step <= completedSteps ? "completed" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {/* Render inner circle only for completed steps */}
            {step <= completedSteps && <div className="inner-circle"></div>}
          </div>
        ))}

        
      </div>

      <div className="tracker-line">
        {/* Progress Line */}
        <div
          className="progress-line"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {/* Render Steps */}
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${step <= completedSteps ? "completed" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {/* Render inner circle only for completed steps */}
            {step <= completedSteps && <div className="inner-circle"></div>}
            <span className="step-label1">{stepLabels[index]}</span>

          </div>
        ))}

        
      </div>
    </div>
    )
  );
  
};

export default StepTracker;

