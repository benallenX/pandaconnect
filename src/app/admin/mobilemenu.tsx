// app/admin/MobileMenuToggle.tsx
'use client';

import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function MobileMenuToggle() {
  return (
    <Button
      variant="ghost"
      className="md:hidden fixed top-4 left-4 z-20"
      onClick={() => {
        const sidebar = document.querySelector('aside');
        sidebar?.classList.toggle('-translate-x-full');
      }}
    >
      <Menu size={24} />
    </Button>
  );
}