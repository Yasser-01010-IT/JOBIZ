import React, { Children, isValidElement, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import './Stepper.css';

export function Step({ children }) {
  return <>{children}</>;
}

export default function Stepper({
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  onInvalid,
  canContinue = true,
  errorMessage = '',
  isSubmitting = false,
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  indicator = 'numbers',
  orientation = 'horizontal',
  transition = 'slide',
  width = '100%',
  radius = 24,
  frame = true,
  linear = false,
  disableStepIndicators = false,
  showFooter = true,
  completeButtonText = 'Complete',
  children
}) {
  const steps = Children.toArray(children).filter(
    child => isValidElement(child) && child.type === Step
  );
  const [currentStep, setCurrentStep] = useState(initialStep);
  const reduceMotion = useReducedMotion();
  const activeStep = steps[currentStep - 1];
  const stepCount = steps.length;
  const progress = stepCount ? (currentStep / stepCount) * 100 : 0;
  const style = {
    '--stepper-width': typeof width === 'number' ? `${width}px` : width,
    '--stepper-radius': typeof radius === 'number' ? `${radius}px` : radius
  };

  const goToStep = step => {
    setCurrentStep(step);
    onStepChange?.(step);
  };

  const handleContinue = () => {
    if (!canContinue) {
      onInvalid?.();
      return;
    }

    if (currentStep < stepCount) {
      const nextStep = currentStep + 1;
      goToStep(nextStep);
      return;
    }

    onFinalStepCompleted?.();
  };

  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const animation = reduceMotion || transition === 'none'
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, x: transition === 'slide' ? 18 : 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: transition === 'slide' ? -18 : 0 }
      };

  return (
    <div
      className={`stepper${frame ? ' stepper--framed' : ''}${orientation === 'vertical' ? ' stepper--vertical' : ''}`}
      style={style}
      data-indicator={indicator}
    >
      <div className="stepper__header">
        <div className="stepper__summary">
          <div>
            <span className="stepper__eyebrow">Étape {currentStep} sur {stepCount}</span>
            <h3 className="stepper__active-title">{activeStep?.props.title}</h3>
            {activeStep?.props.description && (
              <p className="stepper__active-description">{activeStep.props.description}</p>
            )}
          </div>
          <span className="stepper__percentage">{Math.round(progress)} %</span>
        </div>

        <div
          className="stepper__progress"
          role="progressbar"
          aria-label="Progression du questionnaire"
          aria-valuemin={0}
          aria-valuemax={stepCount}
          aria-valuenow={currentStep}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        {!disableStepIndicators && (
          <div
            className="stepper__track"
            aria-label="Étapes du questionnaire"
            style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}
          >
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isComplete = stepNumber < currentStep;
              const isDisabled = linear && stepNumber > currentStep;

              return (
                <button
                  type="button"
                  className={`stepper__segment${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`}
                  key={stepNumber}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Étape ${stepNumber} : ${step.props.title}`}
                  disabled={isDisabled}
                  onClick={() => goToStep(stepNumber)}
                >
                  <span className="stepper__badge">
                    {isComplete ? <Check aria-hidden="true" /> : stepNumber}
                  </span>
                  <span className="stepper__text">{step.props.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="stepper__body">
        <div className="stepper__viewport">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="stepper__pane"
              key={currentStep}
              {...animation}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            >
              {activeStep?.props.children}
            </motion.div>
          </AnimatePresence>
        </div>

        {errorMessage && (
          <p className="stepper__error" role="alert">
            {errorMessage}
          </p>
        )}

        {showFooter && (
          <div className="stepper__footer">
            <button
              type="button"
              className="stepper__button stepper__button--back"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft aria-hidden="true" />
              {backButtonText}
            </button>
            <button
              type="button"
              className="stepper__button stepper__button--next"
              onClick={handleContinue}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Envoi en cours…'
                : currentStep === stepCount
                  ? completeButtonText
                  : nextButtonText}
              {!isSubmitting && currentStep === stepCount
                ? <Check aria-hidden="true" />
                : !isSubmitting && <ArrowRight aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
