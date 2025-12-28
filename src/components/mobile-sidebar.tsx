"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent">
                    <Menu className="h-6 w-6 text-slate-700" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-transparent border-none w-[260px]">
                <Sidebar className="flex h-full w-full border-r-0" />
            </SheetContent>
        </Sheet>
    );
}
