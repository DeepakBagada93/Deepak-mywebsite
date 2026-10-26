# Cold Outreach Sequence: Generated for Marcus Vance (VP of Engineering, Apex Logistics)

## Touch 1: The Teardown & Quick Win (Day 1)
**Subject**: quick note on the fleet map re-renders

Marcus,

Noticed on your public fleet demo that updating a single truck marker re-triggers a full Mapbox canvas render across the entire cluster. On mobile devices with 50+ vehicles, that drops frame rate from 60fps to under 20fps.

Isolated the issue to the parent state handler re-instantiating the geojson feature collection on every socket tick. Moving marker updates into an isolated geojson source buffer eliminates 80% of the re-render cycles.

Happy to send over a 2-minute Loom walking through the exact React hook fix—no strings attached.

Aarav Sharma  
Founding Engineer, DevCraft Studio

---

## Touch 2: The Hiring Relief Angle (Day 4)
**Subject**: Apex Staff Frontend role / interim velocity

Marcus,

Saw your Staff Frontend posting has been open for about 6 weeks. High-scale geospatial UI talent takes months to recruit and onboard.

If your core team is blocked on shipping the Q4 driver tracking revamp while you interview candidates, we can plug in for a dedicated 2-week performance sprint to knock out the Mapbox state bottlenecks.

Open to a brief 10-minute technical chat this Thursday to see if it makes sense?

Aarav

---

## Touch 3: The Graceful Close (Day 8)
**Subject**: closing the loop on Apex map performance

Marcus,

Assuming you've either filled the role or this isn't on your priority backlog right now—totally understand.

I'll keep following Apex's roadmap from afar. If you ever need senior Mapbox + React performance bandwidth down the road, feel free to ping me.

Best,  
Aarav
