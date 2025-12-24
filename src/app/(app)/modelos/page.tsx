"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ModelosPage() {
    return (
        <div className="p-8 min-h-screen bg-[#F0F2F5]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modelos de Documentos</h1>
                    <p className="text-gray-500">Gerencie modelos de atestados e laudos</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Novo Modelo
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Editor de modelos em desenvolvimento...</p>
            </div>
        </div>
    )
}
