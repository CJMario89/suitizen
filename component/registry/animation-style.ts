const beforeStepStyle = {
  opacity: 0,
  transform: "translateY(150%)",
};

const onStepStyle = {
  opacity: 1,
  transform: "translateY(0)",
};

const afterStepStyle = {
  opacity: 0,
  transform: "translateY(-150%)",
};

export const getAnimationStyle = (step: number, currentStep: number) => ({
  ...(currentStep < step
    ? beforeStepStyle
    : step === currentStep
    ? onStepStyle
    : afterStepStyle),
  transition: "all 0.3s ease-in-out",
});
