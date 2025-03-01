'use client';

import React from 'react';
import { Input as ShadcnInput } from "@/components/ui/input";

export interface ShadcnInputProps extends React.ComponentProps<"input"> {
  // Add any additional props here
}

export function Input(props: ShadcnInputProps) {
  return <ShadcnInput {...props} />;
}

export default Input; 