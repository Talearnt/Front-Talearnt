import { FormProvider, useForm } from "react-hook-form";

import { StepFormContainer } from "@pages/auth/SignUp/components/StepFormContainer/StepFormContainer";

function SignUp() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <StepFormContainer />
    </FormProvider>
  );
}

export default SignUp;
