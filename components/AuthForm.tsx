"use client";

import React from "react";
import {
  Controller,
  DefaultValues,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "@/components/FileUpload";
import Link from "next/link";
import { toast } from "sonner";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();

  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success) {
      toast.success(isSignIn ? "Login successful" : "Register successful");
      router.push("/");
    } else {
      toast.error(result.error || "something went wrong");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100 text-blue-500">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup className="w-full mt-3">
          {(
            Object.keys(defaultValues) as Array<keyof typeof defaultValues>
          ).map((defaultKey) => (
            <Controller
              key={String(defaultKey)}
              name={defaultKey as any}
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="capitalize">
                      {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES] ||
                        field.name}
                    </FieldLabel>
                    {field.name === "universityCard" ? (
                      <FileUpload onFileChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          ))}
        </FieldGroup>

        <Button type="submit" className="form-btn mt-3">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <p className="text-center text-base font-medium mt-3">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;
