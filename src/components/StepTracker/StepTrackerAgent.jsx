import React, { useState , useEffect} from "react";
import "./StepTrackerAgent.css";
import { useLocation } from 'react-router-dom';


const AgentStepTracker = ({ percentage }) => {

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
    "Choose Plan, Pay & Use",
  ]: [
    {text : "Personal Details", text1 : "Personal Details details"},
    {text : "Residence Details", text1 : "Residence Details details"},
    {text : "Eduction and Profession", text1 : "Eduction and Profession details"},
    {text : "Verification", text1 : "Verification details"},
    {text : "Payment", text1 : "Payment the details"},
    {text : "Choose Plan, Pay & Use", text1 : "Choose Plan, Pay & Use the details"},

  ]  ;
  
  const stepSpacing = 100 / (totalSteps - 1);
  const progressWidth = stepSpacing * (completedSteps - 1);

  return (
    !isTrue ? (
       <div className="step_tracker_agent">
      <div className="tracker_line_agent" style={{height:"0"}}>
        {/* Progress Line */}
        <div
          className="progress_line_agent"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {/* Render Steps */}
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${step <= completedSteps ? "completed_agent" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {/* Render inner circle only for completed steps */}
            {step <= completedSteps && <div className="inner_circle_agent"></div>}
          </div>
        ))}

        
      </div>

      <div className="tracker_line_agent">
        <div
          className="progress_line_agent"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {steps.map((step, index) => (
          <div
            key={step}
            className={`step1 ${step <= completedSteps ? "completed_agent" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {step <= completedSteps && <div className="inner_circle1_agent">
            </div>}
            <span className="step_label_agent">{stepLabels[index]?.text}</span>
            <span className="step_label2_agent">{stepLabels[index]?.text1}</span>


          </div>
        ))}

        
      </div>
    </div>
    )
     :
     (
      <div className="step_tracker_agent">
      <div className="tracker_line_agent" style={{height:"0"}}>
        {/* Progress Line */}
        <div
          className="progress_line_agent"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {/* Render Steps */}
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${step <= completedSteps ? "completed_agent" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {/* Render inner circle only for completed steps */}
            {step <= completedSteps && <div className="inner_circle_agent"></div>}
          </div>
        ))}

        
      </div>

      <div className="tracker_line_agent">
        {/* Progress Line */}
        <div
          className="progress_line_agent"
          style={{
            width: `${progressWidth}%`,
          }}
        ></div>

        {/* Render Steps */}
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${step <= completedSteps ? "completed_agent" : ""}`}
            style={{
              left: `${(step - 1) * stepSpacing}%`,
            }}
          >
            {/* Render inner circle only for completed steps */}
            {step <= completedSteps && <div className="inner_circle_agent"></div>}
            <span className="step_label1_agent">{stepLabels[index]}</span>

          </div>
        ))}

        
      </div>
    </div>
    )
  );
  
};

export default AgentStepTracker;
