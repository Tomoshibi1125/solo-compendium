import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCampaignInventory } from '@/hooks/useCampaignInventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Package, Plus, Trash2, ArrowLeft, Coins } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/lib/auth/authContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useCampaignGold } from '@/hooks/useCampaignGold';

export default function PartyStash() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const campaignId = queryParams.get('campaignId');
    const { user } = useAuth();

    // Fetch the current user's character in this campaign to attribute the action to them
    const { data: myCharacter } = useQuery({
        queryKey: ['my_campaign_character', campaignId, user?.id],
        queryFn: async () => {
            if (!campaignId || !user?.id) return null;
            const { data } = await supabase
                .from('campaign_members')
                .select('character_id')
                .eq('campaign_id', campaignId)
                .eq('user_id', user.id)
                .maybeSingle();
            return data?.character_id || null;
        },
        enabled: !!campaignId && !!user?.id,
    });

    const { inventory, isLoading, addItem, removeItem, updateItem } = useCampaignInventory(campaignId, myCharacter || undefined);
    const { partyGold, isLoading: isGoldLoading, updateGold } = useCampaignGold(campaignId);

    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);

    // State for local gold edits before saving
    const [goldEdits, setGoldEdits] = useState(partyGold);
    const [isEditingGold, setIsEditingGold] = useState(false);

    // Sync local edits when remote data changes (if not currently editing)
    React.useEffect(() => {
        if (!isEditingGold) {
            setGoldEdits(partyGold);
        }
    }, [partyGold, isEditingGold]);

    if (!campaignId) {
        return (
            <Layout>
                <div className="container p-8 text-center max-w-2xl mx-auto">
                    <SystemWindow title="PARTY STASH">
                        <h2 className="text-xl mb-4 font-arise gradient-text-shadow">No Campaign Selected</h2>
                        <p className="text-muted-foreground mb-4">Please select a campaign from your DM tools or player dashboard to view its Party Stash.</p>
                        <Button onClick={() => navigate('/campaigns')}>Find Campaign</Button>
                    </SystemWindow>
                </div>
            </Layout>
        );
    }

    const handleAdd = async () => {
        if (!newItemName.trim()) return;
        await addItem({ name: newItemName, quantity: newItemQuantity });
        setNewItemName('');
        setNewItemQuantity(1);
    };

    const handleSaveGold = async () => {
        await updateGold(goldEdits);
        setIsEditingGold(false);
    };

    return (
        <Layout>
            <div className="container py-8 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="font-arise text-4xl gradient-text-shadow">PARTY STASH</h1>
                        <p className="text-muted-foreground">Manage shared loot, gold, and bag of holding contents.</p>
                    </div>
                </div>

                <SystemWindow title="ADD LOOT">
                    <div className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <Label>Item Name</Label>
                            <Input
                                placeholder="e.g. 500 Gold Pieces, Health Potion"
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                            />
                        </div>
                        <div className="w-24 space-y-2">
                            <Label>QTY</Label>
                            <Input
                                type="number"
                                min={1}
                                value={newItemQuantity}
                                onChange={e => setNewItemQuantity(parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <Button onClick={handleAdd}>
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </div>
                </SystemWindow>

                <SystemWindow title="PARTY WEALTH" className="relative">
                    {isGoldLoading ? (
                        <p className="text-muted-foreground p-4">Counting coins...</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                                {(['pp', 'gp', 'ep', 'sp', 'cp'] as const).map(coin => (
                                    <div key={coin} className="flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border
                                            ${coin === 'pp' ? 'bg-slate-200 text-slate-800 border-slate-400' : ''}
                                            ${coin === 'gp' ? 'bg-yellow-400 text-yellow-900 border-yellow-600' : ''}
                                            ${coin === 'ep' ? 'bg-blue-200 text-blue-900 border-blue-400' : ''}
                                            ${coin === 'sp' ? 'bg-gray-300 text-gray-800 border-gray-500' : ''}
                                            ${coin === 'cp' ? 'bg-amber-700 text-amber-100 border-amber-900' : ''}
                                        `}>
                                            {coin.toUpperCase()}
                                        </div>
                                        {isEditingGold ? (
                                            <Input
                                                type="number"
                                                value={goldEdits[coin]}
                                                onChange={e => setGoldEdits(prev => ({ ...prev, [coin]: parseInt(e.target.value) || 0 }))}
                                                className="w-full text-center"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold">{partyGold[coin]}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2">
                                {isEditingGold ? (
                                    <>
                                        <Button variant="outline" onClick={() => { setGoldEdits(partyGold); setIsEditingGold(false); }}>Cancel</Button>
                                        <Button onClick={handleSaveGold}>Save Wealth</Button>
                                    </>
                                ) : (
                                    <Button variant="outline" onClick={() => setIsEditingGold(true)}>
                                        <Coins className="w-4 h-4 mr-2" /> Edit Coins
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </SystemWindow>

                <SystemWindow title="STASH INVENTORY">
                    {isLoading ? (
                        <p className="text-muted-foreground p-4">Loading stash...</p>
                    ) : inventory.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>The party stash is empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {inventory.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                                    <div>
                                        <span className="font-semibold text-lg">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateItem({ id: item.id, updates: { quantity: Math.max(0, item.quantity - 1) } })}
                                            >-</Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => updateItem({ id: item.id, updates: { quantity: item.quantity + 1 } })}
                                            >+</Button>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeItem({ id: item.id, name: item.name })}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SystemWindow>
            </div>
        </Layout>
    );
}
