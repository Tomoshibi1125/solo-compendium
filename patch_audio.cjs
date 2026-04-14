const fs = require('fs');
const path = 'c:/Users/jjcal/Documents/solo-compendium/src/pages/warden-directives/VTTEnhanced.tsx';
let txt = fs.readFileSync(path, 'utf8');

const target = `										onMusicChange={(musicId) => {
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

const replacement = `										onMusicChange={(musicId) => {
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

// Use a regex to be more flexible with whitespace if needed, or better yet, just do a direct find if we trust the indentation
if (txt.includes(target)) {
	txt = txt.replace(target, replacement);
	fs.writeFileSync(path, txt, 'utf8');
	console.log('Audio logic patched successfully');
} else {
	console.log('Target not found for audio logic');
}
