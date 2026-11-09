# GATE CS 2027 video library

One 30-minute animated explainer per topic of the GATE 2027 CS syllabus (IIT Madras), 88 topics in 10 sections.
Each video is a single offline HTML file: canvas animation, browser voice narration, captions, 1–4× speed,
Voice Studio (record your own voice) and MP4 export. Open `out/index.html` in Chrome.

```
syllabus.js        topic list (id, title, subtitle) per section -> gallery order
content/<id>.js    one video script (scenes + narration)
engine.html        player/renderer template
build.py           content -> out/<id>.html + out/index.html (checks icons, table shapes, 30-min target)
qa.py              headless render: text overflow + JS errors (needs playwright)
```

```bash
python3 build.py                 # build all videos and the gallery
python3 qa.py <id> --shots=0,5   # check one video, save frames to qa/
```

Topics without a content file appear in the gallery as "Planned".
