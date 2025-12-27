
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Patient } from "../../pacientes/types";

export interface AgendaFilters {
    type?: string;
    patientId?: string;
}

interface AgendaFilterProps {
    patients: Patient[];
    activeFilters: AgendaFilters;
    onFilterChange: (filters: AgendaFilters) => void;
}

export function AgendaFilter({ patients, activeFilters, onFilterChange }: AgendaFilterProps) {
    const [open, setOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState<AgendaFilters>(activeFilters);

    const handleApply = () => {
        onFilterChange(tempFilters);
        setOpen(false);
    };

    const handleClear = () => {
        const cleared = { type: undefined, patientId: undefined };
        setTempFilters(cleared);
        onFilterChange(cleared);
        setOpen(false);
    };

    const hasFilters = activeFilters.type || activeFilters.patientId;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`bg-white/80 hover:bg-white border text-slate-700 shadow-sm backdrop-blur-sm ${hasFilters ? 'border-red-200 text-red-600 bg-red-50' : 'border-red-100'}`}
                >
                    <Filter className="mr-2 h-3 w-3" />
                    Filtros
                    {hasFilters && <span className="ml-1 w-2 h-2 rounded-full bg-red-500" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white" align="end">
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium leading-none text-slate-900">Filtrar Agenda</h4>
                        {hasFilters && (
                            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-red-500 hover:text-red-700">
                                Limpar
                            </Button>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Paciente</Label>
                        <Select
                            value={tempFilters.patientId || "ALL"}
                            onValueChange={(val) => setTempFilters(prev => ({ ...prev, patientId: val === "ALL" ? undefined : val }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todos os pacientes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos os pacientes</SelectItem>
                                {patients.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Tipo de Agendamento</Label>
                        <Select
                            value={tempFilters.type || "ALL"}
                            onValueChange={(val) => setTempFilters(prev => ({ ...prev, type: val === "ALL" ? undefined : val }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todos os tipos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos os tipos</SelectItem>
                                <SelectItem value="Avaliação">Avaliação</SelectItem>
                                <SelectItem value="Sessão de Devolutiva">Sessão de Devolutiva</SelectItem>
                                <SelectItem value="Terapia">Terapia</SelectItem>
                                <SelectItem value="Exame">Exame</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleApply} className="bg-red-500 hover:bg-red-600 text-white w-full shadow-md shadow-red-100 mt-2">
                        Aplicar Filtros
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
