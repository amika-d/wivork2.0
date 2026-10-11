import { createRequire } from 'module';
import { readFileSync, mkdirSync, rmSync } from 'fs';
import { spawn } from 'child_process';
const require = createRequire('/home/neo/projects/tai/tailabsv2/package.json');
const { chromium } = require('playwright-core');
const FPS=30, out=process.argv[2]||'wivork-promo.mp4', only=process.argv[3];
const html=readFileSync(new URL('./promo.html',import.meta.url),'utf8');
const b=await chromium.launch({executablePath:process.env.HOME+'/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome'});
const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.route('http://localhost:4323/__promo',r=>r.fulfill({contentType:'text/html',body:html}));
await p.goto('http://localhost:4323/__promo');await p.evaluate(()=>window.ready);
if(only){for(const t of only.split(',')){await p.evaluate(t=>seek(t),+t);await p.screenshot({path:`/tmp/claude-1000/-home-neo-projects-wivork-new-simple/f1f75ea5-d0c0-47fa-b4dd-4274d5d87ab5/scratchpad/shots/t${t}.png`});}await b.close();process.exit()}
const D=await p.evaluate(()=>DURATION);
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libopenh264','-pix_fmt','yuv420p','-b:v','12M','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
for(let f=0;f<D*FPS;f++){await p.evaluate(t=>seek(t),f/FPS);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();
