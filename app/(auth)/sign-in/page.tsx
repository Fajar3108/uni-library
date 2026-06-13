"use client";

import React from "react";
import { signInSchema } from "@/lib/validation";
import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";

const SignIn = () => (
  <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: "",
      password: "",
    }}
    onSubmit={signInWithCredentials}
  >
    SignIn
  </AuthForm>
);
export default SignIn;
