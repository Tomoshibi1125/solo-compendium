import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Share2 } from 'lucide-react';
import { useGlobalDDBeyondIntegration } from '@/hooks/useGlobalDDBeyondIntegration';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { ACBreakdown } from '@/hooks/useArmorClass';

interface DefensesModalProps {
    acBreakdown: ACBreakdown;
    resistances?: string[];
    immunities?: string[];
    vulnerabilities?: string[];
    conditionImmunities?: string[];
    triggerButton?: React.ReactNode;
    characterId: string;
}

export function DefensesModal({
    acBreakdown,
    resistances = [],
    immunities = [],
    vulnerabilities = [],
    conditionImmunities = [],
    triggerButton,
    characterId,
}: DefensesModalProps) {
    const [open, setOpen] = useState(false);
    const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
    const playerTools = usePlayerToolsEnhancements();

    const handleShare = () => {
        const message = `Shared Defenses: AC ${acBreakdown.total}. ${resistances.length > 0 ? `Resistances: ${resistances.join(', ')}.` : ''} ${immunities.length > 0 ? `Immunities: ${immunities.join(', ')}.` : ''} ${vulnerabilities.length > 0 ? `Vulnerabilities: ${vulnerabilities.join(', ')}.` : ''}`;

        playerTools.rollInCampaign(undefined as never, {
            dice_formula: '0',
            result: acBreakdown.total,
            rolls: [],
            roll_type: 'ability',
            context: message,
            character_id: characterId,
        });
    };

    const hasExtraDefenses =
        resistances.length > 0 ||
        immunities.length > 0 ||
        vulnerabilities.length > 0 ||
        conditionImmunities.length > 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <button className="flex flex-col items-center justify-center p-2 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group">
                        <div className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                            <span className="text-2xl font-bold">{acBreakdown.total}</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mt-0.5">
                            Armor Class
                        </span>
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" /> Defenses & Resistances
                        </DialogTitle>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 border rounded-md hover:bg-muted"
                            title="Share to Campaign"
                        >
                            <Share2 className="h-3.5 w-3.5" /> Share
                        </button>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* AC Breakdown Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-semibold text-sm">Armor Class</h3>
                            <span className="text-xl font-bold text-blue-600">{acBreakdown.total}</span>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded-md">
                            {acBreakdown.formula}
                        </p>
                        <div className="text-sm space-y-1.5 px-1 pb-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Base</span>
                                <span className="font-medium">{acBreakdown.base}</span>
                            </div>
                            {acBreakdown.agiApplied !== 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">AGI modifier</span>
                                    <span className="font-medium">
                                        {acBreakdown.agiApplied >= 0 ? '+' : ''}{acBreakdown.agiApplied}
                                    </span>
                                </div>
                            )}
                            {acBreakdown.shieldBonus > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shield</span>
                                    <span className="font-medium">+{acBreakdown.shieldBonus}</span>
                                </div>
                            )}
                            {acBreakdown.magicalBonus > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Magical bonus</span>
                                    <span className="font-medium">+{acBreakdown.magicalBonus}</span>
                                </div>
                            )}
                            {acBreakdown.otherBonuses !== 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Other bonuses</span>
                                    <span className="font-medium">
                                        {acBreakdown.otherBonuses >= 0 ? '+' : ''}{acBreakdown.otherBonuses}
                                    </span>
                                </div>
                            )}
                        </div>

                        {acBreakdown.warnings.length > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs p-2 rounded-md space-y-1">
                                {acBreakdown.warnings.map((warning, i) => (
                                    <p key={i} className="flex items-start gap-1.5">
                                        <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                        <span>{warning}</span>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Resistances Section */}
                    {hasExtraDefenses && (
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold text-sm">Damage & Conditions</h3>

                            {resistances.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Resistances
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {resistances.map((r) => (
                                            <Badge key={r} variant="outline" className="text-[11px] font-normal border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                                                {r}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {immunities.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Immunities
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {immunities.map((i) => (
                                            <Badge key={i} variant="outline" className="text-[11px] font-normal border-green-200 bg-green-50/50 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
                                                {i}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {vulnerabilities.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                                        <ShieldX className="h-3.5 w-3.5" /> Vulnerabilities
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {vulnerabilities.map((v) => (
                                            <Badge key={v} variant="outline" className="text-[11px] font-normal border-red-200 bg-red-50/50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                                                {v}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {conditionImmunities.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                                        <ShieldAlert className="h-3.5 w-3.5" /> Condition Immunities
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {conditionImmunities.map((c) => (
                                            <Badge key={c} variant="outline" className="text-[11px] font-normal border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                                                {c}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!hasExtraDefenses && (
                        <div className="pt-4 border-t text-sm text-muted-foreground text-center italic">
                            No special resistances or immunities.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
