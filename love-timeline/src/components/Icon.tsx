import React from 'react';
import { icons, LucideProps } from 'lucide-react';

// Define the props for our custom Icon component
interface IconProps extends LucideProps {
  name: keyof typeof icons; // Restrict name to only valid lucide-react icon names
}

/**
 * A dynamic icon component that renders a specified icon from the lucide-react library.
 * It dynamically looks up the icon by name and creates the component.
 * All props (like className, style, size, color, etc.) are forwarded to the underlying SVG.
 */
const Icon = ({ name, ...props }: IconProps) => {
  // Look up the icon component from the 'icons' object
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // Fallback for an invalid icon name
    return <svg width={props.size || 24} height={props.size || 24} />;
  }

  // Render the found icon component, passing all props to it
  return <LucideIcon {...props} />;
};

export default Icon;