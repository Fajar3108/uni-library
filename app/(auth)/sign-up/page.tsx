"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validation";
import { signUp } from "@/lib/actions/auth";

const SignUp = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      fullname: "",
      email: "",
      universityId: 0,
      universityCard: "",
      password: "",
    }}
    onSubmit={signUp}
  >
    SignIn
  </AuthForm>
);

export default SignUp;
