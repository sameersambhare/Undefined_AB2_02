import { Button } from "@/components/ui/button";  // Shadcn UI
import { Input } from "@/components/ui/input";  
import { Card } from "@/components/ui/card";  

// Define a type for component keys
export type ComponentType = "button" | "input" | "card";

// Create a component mapping
export const componentMap: Record<ComponentType, JSX.Element> = {
  button: <Button>Click Me</Button>,
  input: <Input placeholder="Type here" />,
  card: <Card>This is a card</Card>,
};

// Function to get a component by type
export const getComponent = (type: ComponentType): JSX.Element | null => {
  return componentMap[type] || null;
};
