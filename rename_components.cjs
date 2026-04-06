const fs = require('fs');
const path = require('path');
function walk(dir) {
  let r = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) r = r.concat(walk(fp));
    else if (fp.endsWith('.ts') || fp.endsWith('.tsx') || fp.endsWith('.css')) r.push(fp);
  });
  return r;
}
const reps = [
  ['SystemHeading', 'RiftHeading'],
  ['SystemText', 'AscendantText'],
  ['SystemWindow', 'AscendantWindow'],
  ['SystemHologram', 'RiftManifestation'],
  ['SystemOverlay', 'RiftOverlay'],
  ['SystemSigilLogo', 'AscendantSigil'],
  ['DataStreamText', 'ManaFlowText'],
  ['SystemTextProps', 'AscendantTextProps'],
  ['SystemWindowProps', 'AscendantWindowProps'],
  ['SystemHeadingProps', 'RiftHeadingProps'],
  ['system_favor', 'rift_favor'],
  ['systemFavor', 'riftFavor'],
  ['SystemFavor', 'RiftFavor'],
  ['getSystemFavorDie', 'getRiftFavorDie'],
  ['useSystemSound', 'useRiftSound'],
  ['system-ui.css', 'ascendant-ui.css'],
];
let c = 0;
const all = [...walk(path.join(process.cwd(), 'src')), ...walk(path.join(process.cwd(), 'tests'))];
all.forEach(fp => {
  const buf = fs.readFileSync(fp);
  let s = buf.toString('utf8');
  const o = s;
  for (const [from, to] of reps) {
    s = s.split(from).join(to);
  }
  if (o !== s) { fs.writeFileSync(fp, s); c++; }
});
console.log('Renamed in ' + c + ' files.');
