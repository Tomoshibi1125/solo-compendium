const fs = require('fs');
const path = 'c:/Users/jjcal/Documents/solo-compendium/src/pages/warden-directives/VTTEnhanced.tsx';
let txt = fs.readFileSync(path, 'utf8');

// 1. Fix the dangling tags at the end of the sidebar
// We want to move </TabsContent></Tabs>)} inside the sidebar div
const badPattern = /<\/AscendantWindow>\s+<\/div>\s+\s+<\/TabsContent>\s+<\/Tabs>\s+\)}\s+{\/\* Main Map Area \*\//;
const goodPattern = `								</AscendantWindow>
										</TabsContent>
									</Tabs>
								)}
							</div>

							{/* Main Map Area */}`;

if (badPattern.test(txt)) {
    txt = txt.replace(badPattern, goodPattern);
} else {
    // Fallback: finding the specific lines if regex is too strict
    txt = txt.replace(/<\/AscendantWindow>\s+<\/div>\s+\s+<\/TabsContent>\s+<\/Tabs>\s+\)}/, GOOD_SIDEBAR_END_TEMPLATE());
}

function GOOD_SIDEBAR_END_TEMPLATE() {
    return `								</AscendantWindow>
										</TabsContent>
									</Tabs>
								)}
							</div>`;
}

// 2. Fix audio logic
const audioTarget = `										onMusicChange={(musicId) => {
											if (!musicEngineRef.current) {
												musicEngineRef.current = new VttMusicEngine();
											}
											if (musicId === "stop") {
												musicEngineRef.current.stop();
												vttRealtime.broadcastAudioSync("music_stop", "stop");
												toast({ title: "Music Stopped" });
											} else {
												musicEngineRef.current.play(musicId as MusicMood);
												vttRealtime.broadcastAudioSync("music_change", musicId);
												toast({
													title: "Music Changed",
													description: \`Playing \${musicId} ambient music\`,
												});
											}
										}}`;

const audioReplacement = `										onMusicChange={(musicId) => {
											if (musicId === "stop") {
												if (musicEngineRef.current) musicEngineRef.current.stop();
												audioService.stopAll();
												vttRealtime.broadcastAudioSync("music_stop", "stop");
												toast({ title: "Music Stopped" });
											} else {
												// Check if it's a library track or procedural mood
												if (musicId.startsWith("default-")) {
													if (musicEngineRef.current) musicEngineRef.current.stop();
													audioService.playTrack(musicId);
												} else {
													if (!musicEngineRef.current) {
														musicEngineRef.current = new VttMusicEngine();
													}
													musicEngineRef.current.play(musicId as MusicMood);
												}
												vttRealtime.broadcastAudioSync("music_change", musicId);
												toast({
													title: "Music Changed",
													description: \`Playing \${musicId} ambient music\`,
												});
											}
										}}`;

if (txt.includes(audioTarget)) {
    txt = txt.replace(audioTarget, audioReplacement);
}

fs.writeFileSync(path, txt, 'utf8');
console.log('Final surgical patch applied');
