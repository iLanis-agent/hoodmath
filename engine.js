// HoodMath engine - honest range hood sizing math.
// Pure logic, no DOM. Shared by app.html and the node test harness.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HoodMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ISLAND_MULT = 1.5;      // no wall to corral the plume
  var ELBOW_EQUIV_FT = 25;    // each 90 deg elbow adds this much equivalent duct
  var CAP_EQUIV_FT = 15;      // roof/wall cap
  var LONG_RUN_FT = 50;       // equivalent length that earns a duct size bump
  var MAKEUP_AIR_CFM = 400;   // IRC: at or above this, makeup air is required

  function round2(x) { return Math.round(x * 100) / 100; }

  function baseCfm(opts) {
    if (opts.cooktop === 'gas') return (opts.btu || 0) / 100;
    return (opts.widthIn / 12) * 100; // electric/induction: 100 CFM per linear foot
  }

  function ductSize(cfm, equivFt) {
    var size = cfm > 900 ? 10 : (cfm > 400 ? 8 : 6);
    if (equivFt > LONG_RUN_FT && size < 10) size += 2;
    return size;
  }

  function plan(opts) {
    var base = baseCfm(opts);
    var mult = opts.mount === 'island' ? ISLAND_MULT : 1.0;
    var cfm = Math.ceil((base * mult) / 50) * 50;
    var equivFt = round2((opts.ductRunFt || 0) + ELBOW_EQUIV_FT * (opts.elbows || 0) + (opts.roofCap ? CAP_EQUIV_FT : 0));
    var ductIn = ductSize(cfm, equivFt);
    var sizeBeforeBump = cfm > 900 ? 10 : (cfm > 400 ? 8 : 6);
    var wasBumped = ductIn > sizeBeforeBump;
    var makeupAir = cfm >= MAKEUP_AIR_CFM;
    var hoodCost = opts.hoodPrice || 0;
    var ductCost = round2((opts.ductRunFt || 0) * (opts.ductPricePerFt || 0));
    var totalCost = round2(hoodCost + ductCost);
    return {
      baseCfm: round2(base),
      islandMult: mult,
      cfm: cfm,
      equivFt: equivFt,
      ductIn: ductIn,
      ductBumped: wasBumped,
      makeupAir: makeupAir,
      hoodCost: hoodCost,
      ductCost: ductCost,
      totalCost: totalCost
    };
  }

  return { plan: plan, baseCfm: baseCfm, round2: round2 };
});
