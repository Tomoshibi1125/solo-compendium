function Enrich-Block($block, $rank, $index) {
    if ($block -notmatch 'name:\s+"(.*?)"') { return $block }
    $name = $matches[1]
    
    $theme = "Absolute"
    if ($name -match "Heart|Blood|Carnage|Necro|Siphon|Vampiric") { $theme = "Blood" }
    elseif ($name -match "Bright|Light|Corona|Solar|Sun|Radiant|Dawn") { $theme = "Solar" }
    elseif ($name -match "Umbral|Void|Night|Shadow|Entropy|Abyssal") { $theme = "Void" }
    elseif ($name -match "Shock|Bolt|Volt|Storm|Static|Lightning|Surge|Thunder") { $theme = "Storm" }
    elseif ($name -match "Rime|Frost|Arctic|Ice|Chill|Glacial|Frozen") { $theme = "Glacial" }
    elseif ($name -match "Pulse|Aether|Lattice|Force|Resonance|Dimensional") { $theme = "Aetheric" }
    elseif ($name -match "Basalt|Titan|Core|Stone|Gravity|Earthquake|Shatter") { $theme = "Titanic" }

    $die = "d10"; $count = 8
    if ($rank -eq "A") { $count = 8; $die = "d10" }
    elseif ($rank -eq "B") { $count = 5; $die = "d8" }
    elseif ($rank -eq "C") { $count = 3; $die = "d6" }
    elseif ($rank -eq "D") { $count = 1; $die = "d12" }

    $dmgType = "force"
    switch ($theme) {
        "Blood" { $dmgType = "necrotic" }
        "Solar" { $dmgType = "radiant" }
        "Void" { $dmgType = "necrotic" }
        "Storm" { $dmgType = "lightning" }
        "Glacial" { $dmgType = "cold" }
        "Aetheric" { $dmgType = "force" }
        "Titanic" { $dmgType = "bludgeoning" }
    }

    $isUtility = ($index % 2 -eq 1)
    $desc = "A specialized manifestation of $theme Resonance. This form allows the caster to weave the $name into an Absolute Decree."
    
    $newMech = ""
    if ($isUtility) {
        $effect = "Target must make a Con save or be "
        switch ($theme) {
            "Blood" { $effect += "blinded by erupting ichor." }
            "Solar" { $effect += "burned, taking half damage at start of next turn." }
            "Void" { $effect += "pulled 10ft into the entropy field." }
            "Storm" { $effect += "paralyzed until end of next turn." }
            "Glacial" { $effect += "restrained by creeping frost." }
            "Aetheric" { $effect += "pushed 15ft by dimensional pressure." }
            "Titanic" { $effect += "knocked prone by seismic impact." }
            default { $effect += "stunned until the end of its next turn." }
        }
        $newMech = "mechanics: {
attack: { mode: 'ranged', resolution: 'spell_attack', damage: { dice: '$($count - 2)$die', type: '$dmgType' } },
saving_throw: { ability: 'CON', dc: 'spell_save', failure: '$effect' }
}"
    } else {
        $newMech = "mechanics: {
attack: { mode: 'ranged', resolution: 'spell_attack', damage: { dice: '$count$die', type: '$dmgType' }, critical: true }
}"
    }

    $newBlock = [regex]::Replace($block, 'description:\s+`?"?.*?`?"?,?', "description: `"$desc`",")
    $newBlock = [regex]::Replace($newBlock, 'mechanics:\s+\{.*?\}', $newMech, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    return $newBlock
}

foreach ($rankFile in @("rank-a.ts", "rank-b.ts", "rank-c.ts", "rank-d.ts")) {
    $path = "src/data/compendium/spells/$rankFile"
    if (-not (Test-Path $path)) { continue }
    $rank = $rankFile.Split("-")[1][0].ToString().ToUpper()
    $content = Get-Content $path -Raw
    $parts = $content -split "(?m)^\{"
    $newContent = $parts[0]
    for ($i = 1; $i -lt $parts.Length; $i++) {
        $newContent += "{" + (Enrich-Block $parts[$i] $rank $i)
    }
    Set-Content $path $newContent
}
