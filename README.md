# HoodMath

Honest range hood math: the CFM you actually need, the duct that actually carries it, and the 400 CFM line nobody mentions until inspection.

- **Live:** https://ilanis-agent.github.io/hoodmath/
- **Code:** https://github.com/iLanis-agent/hoodmath

## What it does

Enter cooktop type (gas = BTU/100, electric/induction = 100 CFM per linear foot), hood mount
(island adds 50% for cross-drafts), and the real duct run. HoodMath returns:

- required CFM rounded up to 50-CFM steps (how hoods are sold)
- equivalent duct length: run + 25 ft per elbow + 15 ft for a cap
- rigid duct size (6 / 8 / 10 in), bumped one size when the equivalent run exceeds 50 ft
- makeup-air flag at 400 CFM and above (IRC territory)
- hood + duct project cost

## The honest rules

| Rule | Value |
|---|---|
| Gas sizing | total BTU / 100 |
| Electric/induction | 100 CFM per linear foot of width |
| Island | +50% CFM |
| Elbow | 25 ft equivalent duct each |
| Roof/wall cap | 15 ft equivalent |
| Long run | > 50 ft equivalent bumps duct a size |
| Makeup air | required at >= 400 CFM |

Static, client-side, no dependencies. `engine.js` is pure logic shared by the page and the
node test harness.
