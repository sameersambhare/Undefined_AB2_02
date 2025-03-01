'use client';

import React from 'react';
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export interface ShadcnButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export function Button({ children, ...props }: ShadcnButtonProps) {
  return <ShadcnButton {...props}>{children}</ShadcnButton>;
}

export default Button; 