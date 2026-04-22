var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => KidScorePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian19 = require("obsidian");

// src/data/emoji-data.ts
var EMOJI_DATA = {
  "\u{1F600} \u7B11\u8138": ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}", "\u{1F605}", "\u{1F923}", "\u{1F602}", "\u{1F642}", "\u{1F643}", "\u{1F609}", "\u{1F60A}", "\u{1F607}", "\u{1F970}", "\u{1F60D}", "\u{1F929}", "\u{1F618}", "\u{1F617}", "\u{1F61A}", "\u{1F619}", "\u{1F972}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F61D}", "\u{1F911}", "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}", "\u{1FAE1}", "\u{1F910}", "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1FAE5}", "\u{1F60F}", "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F925}", "\u{1F60C}", "\u{1F614}", "\u{1F62A}", "\u{1F924}", "\u{1F634}", "\u{1F637}", "\u{1F912}", "\u{1F915}", "\u{1F922}", "\u{1F92E}", "\u{1F975}", "\u{1F976}", "\u{1F974}", "\u{1F635}", "\u{1F92F}", "\u{1F920}", "\u{1F973}", "\u{1F978}", "\u{1F60E}", "\u{1F913}", "\u{1F9D0}", "\u{1F615}", "\u{1FAE4}", "\u{1F61F}", "\u{1F641}", "\u{1F62E}", "\u{1F62F}", "\u{1F632}", "\u{1F633}", "\u{1F97A}", "\u{1F979}", "\u{1F627}", "\u{1F628}", "\u{1F630}", "\u{1F625}", "\u{1F622}", "\u{1F62D}", "\u{1F631}", "\u{1F616}", "\u{1F623}", "\u{1F61E}", "\u{1F613}", "\u{1F629}", "\u{1F62B}", "\u{1F971}", "\u{1F624}", "\u{1F621}", "\u{1F620}", "\u{1F92C}", "\u{1F608}", "\u{1F47F}", "\u{1F480}", "\u2620\uFE0F", "\u{1F4A9}", "\u{1F921}", "\u{1F479}", "\u{1F47A}", "\u{1F47B}", "\u{1F47D}", "\u{1F47E}", "\u{1F916}"],
  "\u{1F44B} \u624B\u52BF": ["\u{1F44B}", "\u{1F91A}", "\u{1F590}\uFE0F", "\u270B", "\u{1F596}", "\u{1FAF1}", "\u{1FAF2}", "\u{1FAF3}", "\u{1FAF4}", "\u{1F44C}", "\u{1F90C}", "\u{1F90F}", "\u270C\uFE0F", "\u{1F91E}", "\u{1FAF0}", "\u{1F91F}", "\u{1F918}", "\u{1F919}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F595}", "\u{1F447}", "\u261D\uFE0F", "\u{1FAF5}", "\u{1F44D}", "\u{1F44E}", "\u270A", "\u{1F44A}", "\u{1F91B}", "\u{1F91C}", "\u{1F44F}", "\u{1F64C}", "\u{1FAF6}", "\u{1F450}", "\u{1F932}", "\u{1F91D}", "\u{1F64F}", "\u{1F4AA}", "\u{1F9BE}", "\u{1F9BF}", "\u{1F9B5}", "\u{1F9B6}", "\u{1F442}", "\u{1F9BB}", "\u{1F443}", "\u{1F9E0}", "\u{1FAC0}", "\u{1FAC1}", "\u{1F9B7}", "\u{1F9B4}", "\u{1F440}", "\u{1F441}\uFE0F", "\u{1F445}", "\u{1F444}"],
  "\u2B50 \u661F\u53F7": ["\u2B50", "\u{1F31F}", "\u2728", "\u{1F4AB}", "\u{1F525}", "\u{1F4A5}", "\u{1F4A2}", "\u{1F4A6}", "\u{1F4A8}", "\u{1F573}\uFE0F", "\u{1F4A3}", "\u{1F4AC}", "\u{1F4AD}", "\u{1F4A4}", "\u{1F3AF}", "\u{1F3C6}", "\u{1F3C5}", "\u{1F947}", "\u{1F948}", "\u{1F949}", "\u26BD", "\u{1F3C0}", "\u{1F3C8}", "\u26BE", "\u{1F3BE}", "\u{1F3D0}", "\u{1F3C9}", "\u{1F3B1}", "\u{1F3B0}", "\u{1F3D3}", "\u{1F3F8}", "\u{1F94A}", "\u{1F94B}", "\u26F3", "\u26F8\uFE0F", "\u{1F3A3}", "\u{1F93F}", "\u{1F3BF}", "\u{1F6F7}", "\u{1F94C}", "\u{1F3AA}", "\u{1F3AD}", "\u{1F3A8}", "\u{1F3AC}", "\u{1F3A4}", "\u{1F3A7}", "\u{1F3BC}", "\u{1F3B9}", "\u{1F941}", "\u{1FA98}", "\u{1F3B7}", "\u{1F3BA}", "\u{1FA97}", "\u{1F3B8}", "\u{1FA95}", "\u{1F3BB}"],
  "\u{1F466} \u4EBA\u7269": ["\u{1F476}", "\u{1F9D2}", "\u{1F466}", "\u{1F467}", "\u{1F9D1}", "\u{1F471}", "\u{1F468}", "\u{1F9D4}", "\u{1F469}", "\u{1F9D3}", "\u{1F474}", "\u{1F475}", "\u{1F64D}", "\u{1F64E}", "\u{1F645}", "\u{1F646}", "\u{1F481}", "\u{1F64B}", "\u{1F647}", "\u{1F926}", "\u{1F937}", "\u{1F482}", "\u{1F575}\uFE0F", "\u{1F486}", "\u{1F487}", "\u{1F6B6}", "\u{1F9CD}", "\u{1F9CE}", "\u{1F3C3}", "\u{1F483}", "\u{1F57A}", "\u{1F46F}", "\u{1F9D6}", "\u{1F9D7}", "\u{1F93A}", "\u{1F3C7}", "\u26F7\uFE0F", "\u{1F3C2}", "\u{1F3CC}\uFE0F", "\u{1F3C4}", "\u{1F6A3}", "\u{1F3CA}", "\u{1F93D}", "\u{1F9D8}", "\u{1F6C0}", "\u{1F6CC}"],
  "\u{1F34E} \u98DF\u7269": ["\u{1F34E}", "\u{1F350}", "\u{1F34A}", "\u{1F34B}", "\u{1F34C}", "\u{1F349}", "\u{1F347}", "\u{1F353}", "\u{1FAD0}", "\u{1F348}", "\u{1F352}", "\u{1F351}", "\u{1F96D}", "\u{1F34D}", "\u{1F965}", "\u{1F95D}", "\u{1F345}", "\u{1F346}", "\u{1F951}", "\u{1F966}", "\u{1F96C}", "\u{1F952}", "\u{1F336}\uFE0F", "\u{1FAD1}", "\u{1F33D}", "\u{1F955}", "\u{1FAD2}", "\u{1F9C4}", "\u{1F9C5}", "\u{1F954}", "\u{1F360}", "\u{1FAD8}", "\u{1F950}", "\u{1F35E}", "\u{1F956}", "\u{1F968}", "\u{1F9C0}", "\u{1F95A}", "\u{1F373}", "\u{1F9C8}", "\u{1F95E}", "\u{1F9C7}", "\u{1F953}", "\u{1F969}", "\u{1F357}", "\u{1F356}", "\u{1F32D}", "\u{1F354}", "\u{1F35F}", "\u{1F355}", "\u{1FAD3}", "\u{1F96A}", "\u{1F959}", "\u{1F9C6}", "\u{1F32E}", "\u{1F32F}", "\u{1FAD4}", "\u{1F957}", "\u{1F958}", "\u{1FAD5}", "\u{1F96B}", "\u{1F35D}", "\u{1F35C}", "\u{1F372}", "\u{1F35B}", "\u{1F363}", "\u{1F371}", "\u{1F95F}", "\u{1F9AA}", "\u{1F364}", "\u{1F359}", "\u{1F35A}", "\u{1F358}", "\u{1F365}", "\u{1F960}", "\u{1F362}", "\u{1F361}", "\u{1F367}", "\u{1F368}", "\u{1F366}", "\u{1F967}", "\u{1F9C1}", "\u{1F370}", "\u{1F382}", "\u{1F36E}", "\u{1F36D}", "\u{1F36C}", "\u{1F36B}", "\u{1F37F}", "\u{1F369}", "\u{1F36A}", "\u{1F330}", "\u{1F95C}", "\u{1F36F}", "\u{1F95B}", "\u{1F37C}", "\u{1FAD6}", "\u2615", "\u{1F375}", "\u{1F9C3}", "\u{1F964}", "\u{1F9CB}", "\u{1F376}", "\u{1F37A}", "\u{1F37B}", "\u{1F942}", "\u{1F377}", "\u{1F378}", "\u{1F379}", "\u{1F9C9}", "\u{1F37E}", "\u{1F9CA}", "\u{1F944}", "\u{1F52A}", "\u{1F3FA}"],
  "\u{1F3E0} \u5730\u70B9": ["\u{1F3E0}", "\u{1F3E1}", "\u{1F3D8}\uFE0F", "\u{1F3DA}\uFE0F", "\u{1F3D7}\uFE0F", "\u{1F3E2}", "\u{1F3EC}", "\u{1F3E3}", "\u{1F3E4}", "\u{1F3E5}", "\u{1F3E6}", "\u{1F3E8}", "\u{1F3EA}", "\u{1F3EB}", "\u{1F3E9}", "\u{1F492}", "\u{1F3DB}\uFE0F", "\u26EA", "\u{1F54C}", "\u{1F54D}", "\u{1F6D5}", "\u{1F54B}", "\u26E9\uFE0F", "\u{1F6E4}\uFE0F", "\u{1F6E3}\uFE0F", "\u{1F5FE}", "\u{1F391}", "\u{1F3DE}\uFE0F", "\u{1F305}", "\u{1F304}", "\u{1F320}", "\u{1F387}", "\u{1F386}", "\u{1F307}", "\u{1F306}", "\u{1F3D9}\uFE0F", "\u{1F303}", "\u{1F30C}", "\u{1F309}", "\u{1F301}"],
  "\u{1F331} \u81EA\u7136": ["\u{1F331}", "\u{1FAB4}", "\u{1F332}", "\u{1F333}", "\u{1F334}", "\u{1F335}", "\u{1F33F}", "\u2618\uFE0F", "\u{1F340}", "\u{1F341}", "\u{1F342}", "\u{1F343}", "\u{1FAB9}", "\u{1FABA}", "\u{1F344}", "\u{1F33E}", "\u{1F490}", "\u{1F337}", "\u{1F339}", "\u{1F940}", "\u{1F33A}", "\u{1F338}", "\u{1F33C}", "\u{1F33B}", "\u{1F31E}", "\u{1F31D}", "\u{1F31B}", "\u{1F31C}", "\u{1F31A}", "\u{1F315}", "\u{1F316}", "\u{1F317}", "\u{1F318}", "\u{1F311}", "\u{1F312}", "\u{1F313}", "\u{1F314}", "\u{1F319}", "\u{1F30E}", "\u{1F30D}", "\u{1F30F}", "\u{1FA90}", "\u{1F4AB}", "\u2B50", "\u{1F31F}", "\u2728", "\u26A1", "\u2604\uFE0F", "\u{1F4A5}", "\u{1F525}", "\u{1F32A}\uFE0F", "\u{1F308}", "\u2600\uFE0F", "\u{1F324}\uFE0F", "\u26C5", "\u{1F325}\uFE0F", "\u2601\uFE0F", "\u{1F326}\uFE0F", "\u{1F327}\uFE0F", "\u26C8\uFE0F", "\u{1F329}\uFE0F", "\u{1F328}\uFE0F", "\u2744\uFE0F", "\u2603\uFE0F", "\u26C4", "\u{1F32C}\uFE0F", "\u{1F4A8}", "\u{1F4A7}", "\u{1F4A6}", "\u{1FAE7}", "\u2614", "\u2602\uFE0F", "\u{1F30A}", "\u{1F32B}\uFE0F"],
  "\u{1F4DA} \u7269\u54C1": ["\u{1F4DA}", "\u{1F4D6}", "\u{1F4D5}", "\u{1F4D7}", "\u{1F4D8}", "\u{1F4D9}", "\u{1F4D3}", "\u{1F4D2}", "\u{1F4C3}", "\u{1F4DC}", "\u{1F4C4}", "\u{1F4F0}", "\u{1F5DE}\uFE0F", "\u{1F4D1}", "\u{1F516}", "\u{1F3F7}\uFE0F", "\u{1F4B0}", "\u{1FA99}", "\u{1F4B4}", "\u{1F4B5}", "\u{1F4B6}", "\u{1F4B7}", "\u{1F4B8}", "\u{1F4B3}", "\u{1F9FE}", "\u{1F4B9}", "\u2709\uFE0F", "\u{1F4E7}", "\u{1F4E8}", "\u{1F4E9}", "\u{1F4E4}", "\u{1F4E5}", "\u{1F4E6}", "\u{1F4EB}", "\u{1F4EA}", "\u{1F4EC}", "\u{1F4ED}", "\u{1F4EE}", "\u{1F5F3}\uFE0F", "\u270F\uFE0F", "\u2712\uFE0F", "\u{1F58B}\uFE0F", "\u{1F58A}\uFE0F", "\u{1F58C}\uFE0F", "\u{1F58D}\uFE0F", "\u{1F4DD}", "\u{1F4BC}", "\u{1F4C1}", "\u{1F4C2}", "\u{1F5C2}\uFE0F", "\u{1F4C5}", "\u{1F4C6}", "\u{1F5D2}\uFE0F", "\u{1F5D3}\uFE0F", "\u{1F4C7}", "\u{1F4C8}", "\u{1F4C9}", "\u{1F4CA}", "\u{1F4CB}", "\u{1F4CC}", "\u{1F4CD}", "\u{1F4CE}", "\u{1F587}\uFE0F", "\u{1F4CF}", "\u{1F4D0}", "\u2702\uFE0F", "\u{1F5C3}\uFE0F", "\u{1F5C4}\uFE0F", "\u{1F5D1}\uFE0F", "\u{1F512}", "\u{1F513}", "\u{1F50F}", "\u{1F510}", "\u{1F511}", "\u{1F5DD}\uFE0F", "\u{1F528}", "\u{1FA93}", "\u26CF\uFE0F", "\u2692\uFE0F", "\u{1F6E0}\uFE0F", "\u{1F5E1}\uFE0F", "\u2694\uFE0F", "\u{1F52B}", "\u{1FA83}", "\u{1F3F9}", "\u{1F6E1}\uFE0F", "\u{1FA9A}", "\u{1F527}", "\u{1FA9B}", "\u{1F529}", "\u2699\uFE0F", "\u{1F5DC}\uFE0F", "\u2696\uFE0F", "\u{1F9AF}", "\u{1F517}", "\u26D3\uFE0F", "\u{1FA9D}", "\u{1F527}", "\u{1F9F0}", "\u{1F9F2}", "\u{1FA9C}", "\u2697\uFE0F", "\u{1F9EA}", "\u{1F9EB}", "\u{1F9EC}", "\u{1F52C}", "\u{1F52D}", "\u{1F4E1}", "\u{1F489}", "\u{1FA78}", "\u{1F48A}", "\u{1FA79}", "\u{1FA7C}", "\u{1FA7A}", "\u{1F321}\uFE0F", "\u{1F6BD}", "\u{1F6B0}", "\u{1F6BF}", "\u{1F6C1}", "\u{1F6C0}", "\u{1F9F4}", "\u{1F9F7}", "\u{1F9F9}", "\u{1F9FA}", "\u{1F9FB}", "\u{1F9FC}", "\u{1F9FD}", "\u{1F9EF}", "\u{1F6D2}", "\u{1F6AC}", "\u26B0\uFE0F", "\u{1FAA6}", "\u26B1\uFE0F", "\u{1F5FF}", "\u{1FAA7}", "\u{1F3E7}", "\u{1F6AE}", "\u{1F6B0}", "\u267F", "\u{1F6B9}", "\u{1F6BA}", "\u{1F6BB}", "\u{1F6BC}", "\u{1F6BE}", "\u{1F6C2}", "\u{1F6C3}", "\u{1F6C4}", "\u{1F6C5}", "\u26A0\uFE0F", "\u{1F6B8}", "\u26D4", "\u{1F6AB}", "\u{1F6B3}", "\u{1F6AD}", "\u{1F6AF}", "\u{1F6B1}", "\u{1F6B7}", "\u{1F4F5}", "\u{1F51E}", "\u2622\uFE0F", "\u2623\uFE0F", "\u2B06\uFE0F", "\u2197\uFE0F", "\u27A1\uFE0F", "\u2198\uFE0F", "\u2B07\uFE0F", "\u2199\uFE0F", "\u2B05\uFE0F", "\u2196\uFE0F", "\u2195\uFE0F", "\u2194\uFE0F", "\u21A9\uFE0F", "\u21AA\uFE0F", "\u2934\uFE0F", "\u2935\uFE0F", "\u{1F503}", "\u{1F504}", "\u{1F519}", "\u{1F51A}", "\u{1F51B}", "\u{1F51C}", "\u{1F51D}", "\u{1F6D0}", "\u269B\uFE0F", "\u{1F549}\uFE0F", "\u2721\uFE0F", "\u2638\uFE0F", "\u262F\uFE0F", "\u271D\uFE0F", "\u2626\uFE0F", "\u262A\uFE0F", "\u262E\uFE0F", "\u{1F54E}", "\u{1F52F}", "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D", "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653", "\u26CE", "\u{1F500}", "\u{1F501}", "\u{1F502}", "\u25B6\uFE0F", "\u23E9", "\u23ED\uFE0F", "\u23EF\uFE0F", "\u25C0\uFE0F", "\u23EA", "\u23EE\uFE0F", "\u{1F53C}", "\u23EB", "\u{1F53D}", "\u23EC", "\u23F8\uFE0F", "\u23F9\uFE0F", "\u23FA\uFE0F", "\u23CF\uFE0F", "\u{1F3A6}", "\u{1F505}", "\u{1F506}", "\u{1F4F6}", "\u{1F4F3}", "\u{1F4F4}", "\u2640\uFE0F", "\u2642\uFE0F", "\u26A7\uFE0F", "\u2716\uFE0F", "\u2795", "\u2796", "\u2797", "\u267E\uFE0F", "\u203C\uFE0F", "\u2049\uFE0F", "\u2753", "\u2754", "\u2755", "\u2757", "\u3030\uFE0F", "\u{1F4B1}", "\u{1F4B2}", "\u2695\uFE0F", "\u267B\uFE0F", "\u269C\uFE0F", "\u{1F531}", "\u{1F4DB}", "\u{1F530}", "\u2B55", "\u2705", "\u2611\uFE0F", "\u2714\uFE0F", "\u274C", "\u274E", "\u27B0", "\u27BF", "\u303D\uFE0F", "\u2733\uFE0F", "\u2734\uFE0F", "\u2747\uFE0F", "\xA9\uFE0F", "\xAE\uFE0F", "\u2122\uFE0F"],
  "\u{1F697} \u4EA4\u901A": ["\u{1F697}", "\u{1F695}", "\u{1F699}", "\u{1F68C}", "\u{1F68E}", "\u{1F3CE}\uFE0F", "\u{1F693}", "\u{1F691}", "\u{1F692}", "\u{1F690}", "\u{1F6FB}", "\u{1F69A}", "\u{1F69B}", "\u{1F69C}", "\u{1F9AF}", "\u{1F9BD}", "\u{1F9BC}", "\u{1F6F4}", "\u{1F6B2}", "\u{1F6F5}", "\u{1F3CD}\uFE0F", "\u{1F6FA}", "\u{1F694}", "\u{1F68D}", "\u{1F698}", "\u{1F696}", "\u{1F6A1}", "\u{1F6A0}", "\u{1F69F}", "\u{1F683}", "\u{1F68B}", "\u{1F69E}", "\u{1F69D}", "\u{1F684}", "\u{1F685}", "\u{1F688}", "\u{1F682}", "\u{1F686}", "\u{1F687}", "\u{1F68A}", "\u{1F689}", "\u2708\uFE0F", "\u{1F6EB}", "\u{1F6EC}", "\u{1F6E9}\uFE0F", "\u{1F4BA}", "\u{1F6F0}\uFE0F", "\u{1F680}", "\u{1F6F8}", "\u{1F681}", "\u{1F6F6}", "\u26F5", "\u{1F6A4}", "\u{1F6E5}\uFE0F", "\u{1F6A2}", "\u2693", "\u{1FA9D}", "\u26FD", "\u{1F6A7}", "\u{1F6A6}", "\u{1F6A5}", "\u{1F68F}", "\u{1F5FA}\uFE0F", "\u{1F6D1}", "\u{1F6AD}", "\u{1F6B0}", "\u267F", "\u{1F6B9}", "\u{1F6BA}", "\u{1F6BB}", "\u{1F6BC}", "\u{1F6BE}", "\u{1F6C2}", "\u{1F6C3}", "\u{1F6C4}", "\u{1F6C5}", "\u26A0\uFE0F"]
};
var EMOJI_SEARCH = {
  "\u{1F600}": "\u7B11 \u5F00\u5FC3 \u9AD8\u5174 \u5FEB\u4E50 smile happy grin",
  "\u{1F603}": "\u7B11 \u5F00\u5FC3 \u9AD8\u5174 smile happy",
  "\u{1F604}": "\u7B11 \u5F00\u5FC3 \u5927\u7B11 smile grin laugh",
  "\u{1F601}": "\u7B11 \u563F\u563F \u9732\u9F7F grin beam",
  "\u{1F606}": "\u7B11 \u54C8\u54C8 \u5927\u7B11 laugh squint",
  "\u{1F605}": "\u7B11 \u5C34\u5C2C \u6C57 sweat smile awkward",
  "\u{1F923}": "\u7B11 \u5927\u7B11 \u7B11\u54ED \u54C8\u54C8 rofl laugh cry",
  "\u{1F602}": "\u7B11 \u7B11\u54ED \u773C\u6CEA joy laugh cry tear",
  "\u{1F642}": "\u5FAE\u7B11 \u7B11 smile slight",
  "\u{1F643}": "\u5012\u8138 \u98A0\u5012 upside down",
  "\u{1F609}": "\u7728\u773C \u6697\u793A wink",
  "\u{1F60A}": "\u5BB3\u7F9E \u5FAE\u7B11 \u817C\u8146 blush smile shy",
  "\u{1F607}": "\u5929\u4F7F \u5584\u826F angel halo",
  "\u{1F970}": "\u559C\u6B22 \u7231\u5FC3 \u7231 love heart face",
  "\u{1F60D}": "\u7231\u5FC3 \u559C\u6B22 \u7231 \u5FC3\u773C heart eyes love",
  "\u{1F929}": "\u661F\u661F \u5D07\u62DC \u8FFD\u661F star struck wow",
  "\u{1F618}": "\u4EB2\u4EB2 \u98DE\u543B \u543B kiss blow",
  "\u{1F617}": "\u4EB2\u4EB2 \u561F\u5634 kiss",
  "\u{1F61A}": "\u4EB2\u4EB2 \u5BB3\u7F9E kiss shy blush",
  "\u{1F619}": "\u4EB2\u4EB2 \u53E3\u54E8 kiss whistle",
  "\u{1F972}": "\u611F\u52A8 \u7B11\u4E2D\u5E26\u6CEA \u5FAE\u7B11 smile tear",
  "\u{1F60B}": "\u597D\u5403 \u7F8E\u5473 \u998B yummy delicious tongue",
  "\u{1F61B}": "\u5410\u820C \u8C03\u76AE tongue playful",
  "\u{1F61C}": "\u8C03\u76AE \u641E\u602A \u5410\u820C wink tongue crazy",
  "\u{1F92A}": "\u75AF\u72C2 \u641E\u602A zany crazy wild",
  "\u{1F61D}": "\u5410\u820C \u9B3C\u8138 tongue squint",
  "\u{1F911}": "\u53D1\u8D22 \u94B1 \u8D22\u8FF7 money rich dollar",
  "\u{1F917}": "\u62E5\u62B1 \u62B1\u62B1 hug warm",
  "\u{1F92D}": "\u5077\u7B11 \u6342\u5634 giggle cover",
  "\u{1F92B}": "\u5618 \u5B89\u9759 \u79D8\u5BC6 shush quiet secret",
  "\u{1F914}": "\u601D\u8003 \u60F3 \u7591\u95EE think wonder hmm",
  "\u{1FAE1}": "\u656C\u793C \u5C0A\u91CD salute respect",
  "\u{1F910}": "\u95ED\u5634 \u6C89\u9ED8 zip mouth silent",
  "\u{1F928}": "\u6000\u7591 \u8D28\u7591 raised eyebrow skeptic",
  "\u{1F610}": "\u51B7\u6F20 \u65E0\u8BED neutral blank",
  "\u{1F611}": "\u65E0\u8BED \u65E0\u804A expressionless",
  "\u{1F636}": "\u6C89\u9ED8 \u65E0\u8BED mute no mouth",
  "\u{1FAE5}": "\u865A\u7EBF\u8138 \u9690\u5F62 dotted line face invisible",
  "\u{1F60F}": "\u574F\u7B11 \u5F97\u610F smirk sly",
  "\u{1F612}": "\u4E0D\u5C51 \u5ACC\u5F03 unamused bored",
  "\u{1F644}": "\u767D\u773C \u65E0\u8BED eye roll whatever",
  "\u{1F62C}": "\u5C34\u5C2C \u9F87\u7259 grimace awkward",
  "\u{1F925}": "\u8BF4\u8C0E \u9A97\u5B50 lying liar",
  "\u{1F60C}": "\u653E\u677E \u8212\u9002 \u6EE1\u8DB3 relieved calm peaceful",
  "\u{1F614}": "\u5931\u843D \u96BE\u8FC7 \u6CAE\u4E27 sad pensive down",
  "\u{1F62A}": "\u56F0 \u778C\u7761 \u7761\u89C9 sleepy tired",
  "\u{1F924}": "\u6D41\u53E3\u6C34 \u998B drool hungry",
  "\u{1F634}": "\u7761\u89C9 \u56F0 \u7761\u7720 \u665A\u5B89 sleep zzz night",
  "\u{1F637}": "\u53E3\u7F69 \u751F\u75C5 \u611F\u5192 mask sick cold",
  "\u{1F912}": "\u53D1\u70E7 \u751F\u75C5 \u6E29\u5EA6\u8BA1 fever sick thermometer",
  "\u{1F915}": "\u53D7\u4F24 \u5934\u75DB \u7EF7\u5E26 hurt injury bandage",
  "\u{1F922}": "\u6076\u5FC3 \u60F3\u5410 nauseous sick green",
  "\u{1F92E}": "\u5410 \u6076\u5FC3 \u5455\u5410 vomit throw up sick",
  "\u{1F975}": "\u70ED \u51FA\u6C57 \u53D1\u70ED hot heat sweat",
  "\u{1F976}": "\u51B7 \u51BB \u5BD2\u51B7 cold freeze frozen",
  "\u{1F974}": "\u6655 \u9189 woozy dizzy drunk",
  "\u{1F635}": "\u6655 \u5934\u6655 \u7729\u6655 dizzy daze",
  "\u{1F92F}": "\u7206\u70B8 \u9707\u60CA \u70B8\u88C2 mind blown explode shock",
  "\u{1F920}": "\u725B\u4ED4 \u5E05 cowboy",
  "\u{1F973}": "\u5E86\u795D \u6D3E\u5BF9 \u751F\u65E5 \u805A\u4F1A party celebrate birthday",
  "\u{1F978}": "\u4F2A\u88C5 \u5047\u80E1\u5B50 disguised face",
  "\u{1F60E}": "\u9177 \u58A8\u955C \u5E05 cool sunglasses",
  "\u{1F913}": "\u4E66\u5446\u5B50 \u773C\u955C \u5B66\u9738 nerd glasses geek",
  "\u{1F9D0}": "\u5BA1\u89C6 \u5355\u7247\u773C\u955C monocle inspect",
  "\u{1F615}": "\u56F0\u60D1 \u4E0D\u89E3 confused",
  "\u{1FAE4}": "\u90C1\u95F7 \u76B1\u7709 diagonal mouth meh",
  "\u{1F61F}": "\u62C5\u5FC3 \u5FE7\u8651 worried concern",
  "\u{1F641}": "\u96BE\u8FC7 \u4E0D\u5F00\u5FC3 sad frown",
  "\u{1F62E}": "\u60CA\u8BB6 \u5403\u60CA surprise open mouth",
  "\u{1F62F}": "\u60CA\u8BB6 \u5403\u60CA hushed surprise",
  "\u{1F632}": "\u9707\u60CA \u5927\u60CA astonished shock",
  "\u{1F633}": "\u8138\u7EA2 \u5BB3\u7F9E \u5C34\u5C2C flushed blush embarrass",
  "\u{1F97A}": "\u53EF\u601C \u6C42\u6C42 \u6492\u5A07 pleading puppy eyes",
  "\u{1F979}": "\u611F\u52A8 \u5FCD\u4F4F holding tears touched",
  "\u{1F627}": "\u75DB\u82E6 \u7126\u8651 anguished",
  "\u{1F628}": "\u5BB3\u6015 \u6050\u60E7 fearful scared afraid",
  "\u{1F630}": "\u7126\u8651 \u7D27\u5F20 \u51B7\u6C57 anxious nervous sweat",
  "\u{1F625}": "\u5931\u671B \u91CA\u7136 disappointed relieved",
  "\u{1F622}": "\u54ED \u96BE\u8FC7 \u4F24\u5FC3 cry sad tear",
  "\u{1F62D}": "\u5927\u54ED \u4F24\u5FC3 \u75DB\u54ED sob cry loud",
  "\u{1F631}": "\u5C16\u53EB \u6050\u60E7 \u5413 scream fear horror",
  "\u{1F616}": "\u75DB\u82E6 \u96BE\u53D7 confounded pain",
  "\u{1F623}": "\u5FCD\u8010 \u575A\u6301 persevere endure",
  "\u{1F61E}": "\u5931\u671B \u6CAE\u4E27 disappointed sad",
  "\u{1F613}": "\u6C57 \u65E0\u5948 sweat downcast",
  "\u{1F629}": "\u75B2\u5026 \u7D2F \u5D29\u6E83 weary exhausted tired",
  "\u{1F62B}": "\u7D2F \u75B2\u5026 tired exhausted",
  "\u{1F971}": "\u6253\u54C8\u6B20 \u56F0 \u65E0\u804A yawn sleepy bored",
  "\u{1F624}": "\u751F\u6C14 \u6124\u6012 \u54FC angry huff steam",
  "\u{1F621}": "\u6124\u6012 \u751F\u6C14 rage angry red",
  "\u{1F620}": "\u751F\u6C14 \u4E0D\u6EE1 angry mad",
  "\u{1F92C}": "\u9A82\u4EBA \u810F\u8BDD \u6124\u6012 swear curse angry",
  "\u{1F608}": "\u6076\u9B54 \u574F \u8C03\u76AE devil evil imp",
  "\u{1F47F}": "\u6076\u9B54 \u751F\u6C14 devil angry imp",
  "\u{1F480}": "\u9AB7\u9AC5 \u6B7B \u5413 skull dead",
  "\u2620\uFE0F": "\u9AB7\u9AC5 \u5371\u9669 \u6B7B\u4EA1 skull crossbones danger",
  "\u{1F4A9}": "\u4FBF\u4FBF \u5C4E poop poo shit",
  "\u{1F921}": "\u5C0F\u4E11 clown",
  "\u{1F479}": "\u5996\u602A \u9B3C ogre monster",
  "\u{1F47A}": "\u5929\u72D7 \u9B3C goblin tengu",
  "\u{1F47B}": "\u9B3C \u5E7D\u7075 \u4E07\u5723\u8282 ghost halloween boo",
  "\u{1F47D}": "\u5916\u661F\u4EBA alien ufo",
  "\u{1F47E}": "\u602A\u7269 \u6E38\u620F monster alien game",
  "\u{1F916}": "\u673A\u5668\u4EBA robot bot",
  "\u{1F44B}": "\u6325\u624B \u4F60\u597D \u518D\u89C1 \u62DC\u62DC wave hello hi bye",
  "\u{1F91A}": "\u624B \u505C \u4E3E\u624B hand stop raise",
  "\u{1F590}\uFE0F": "\u624B \u4E94 \u5F20\u5F00 hand five open",
  "\u270B": "\u624B \u505C \u9AD8\u4E3E hand stop high five",
  "\u{1F596}": "\u624B vulcan spock",
  "\u{1FAF1}": "\u5411\u53F3\u7684\u624B rightward hand",
  "\u{1FAF2}": "\u5411\u5DE6\u7684\u624B leftward hand",
  "\u{1FAF3}": "\u638C\u5FC3\u5411\u4E0B\u7684\u624B palm down hand",
  "\u{1FAF4}": "\u638C\u5FC3\u5411\u4E0A\u7684\u624B palm up hand",
  "\u{1F44C}": "\u597D\u7684 OK \u53EF\u4EE5 \u6CA1\u95EE\u9898 ok okay perfect",
  "\u{1F90C}": "\u634F\u624B\u6307 pinched fingers",
  "\u{1F90F}": "\u4E00\u70B9\u70B9 \u5C11\u91CF pinch small little",
  "\u270C\uFE0F": "\u80DC\u5229 \u8036 \u526A\u5200 victory peace yeah",
  "\u{1F91E}": "\u7948\u7977 \u597D\u8FD0 cross finger luck hope",
  "\u{1FAF0}": "\u6BD4\u5FC3 \u7231\u5FC3 \u5FC3 heart hands love",
  "\u{1F91F}": "\u7231\u4F60 \u6447\u6EDA love you rock",
  "\u{1F918}": "\u6447\u6EDA rock metal horn",
  "\u{1F919}": "\u6253\u7535\u8BDD \u8054\u7CFB call phone shaka",
  "\u{1F448}": "\u5DE6 \u6307 left point",
  "\u{1F449}": "\u53F3 \u6307 right point",
  "\u{1F446}": "\u4E0A \u6307 up point",
  "\u{1F595}": "\u7AD6\u4E2D\u6307 \u5192\u72AF middle finger",
  "\u{1F447}": "\u4E0B \u6307 down point",
  "\u261D\uFE0F": "\u4E0A \u6307 \u7B2C\u4E00 point up first",
  "\u{1FAF5}": "\u6307\u5411\u89C2\u770B\u8005 index pointing at viewer",
  "\u{1F44D}": "\u597D \u8D5E \u68D2 \u5389\u5BB3 \u70B9\u8D5E like good thumb up great nice",
  "\u{1F44E}": "\u5DEE \u4E0D\u597D \u8E29 dislike bad thumb down",
  "\u270A": "\u52A0\u6CB9 \u62F3\u5934 \u575A\u6301 fist power fight",
  "\u{1F44A}": "\u62F3\u5934 \u6253 \u52A0\u6CB9 punch fist bump",
  "\u{1F91B}": "\u5DE6\u62F3 left-facing fist",
  "\u{1F91C}": "\u53F3\u62F3 right-facing fist",
  "\u{1F44F}": "\u9F13\u638C \u638C\u58F0 \u62CD\u624B \u68D2 clap applause bravo",
  "\u{1F64C}": "\u5E86\u795D \u4E07\u5C81 \u6B22\u547C raise hand hooray celebrate",
  "\u{1FAF6}": "\u6BD4\u5FC3 \u7231\u5FC3 \u5FC3 heart hands love",
  "\u{1F450}": "\u5F20\u5F00 \u62E5\u62B1 open hand hug",
  "\u{1F932}": "\u638C\u5FC3\u5411\u4E0A\u5E76\u62E2 palms up together",
  "\u{1F91D}": "\u63E1\u624B \u5408\u4F5C \u534F\u8BAE handshake deal agree",
  "\u{1F64F}": "\u7948\u7977 \u611F\u8C22 \u62DC\u6258 \u8C22\u8C22 \u8BF7 pray thank please hope",
  "\u{1F4AA}": "\u808C\u8089 \u529B\u91CF \u52A0\u6CB9 \u5065\u8EAB \u5F3A muscle strong power flex gym",
  "\u{1F9BE}": "\u673A\u68B0\u624B\u81C2 mechanical arm",
  "\u{1F9BF}": "\u673A\u68B0\u817F mechanical leg",
  "\u{1F9B5}": "\u817F leg",
  "\u{1F9B6}": "\u811A foot",
  "\u{1F442}": "\u8033\u6735 ear",
  "\u{1F9BB}": "\u6234\u52A9\u542C\u5668 ear with hearing aid",
  "\u{1F443}": "\u9F3B\u5B50 nose",
  "\u{1F9E0}": "\u5927\u8111 brain",
  "\u{1FAC0}": "\u5FC3\u810F anatomical heart",
  "\u{1FAC1}": "\u80BA lungs",
  "\u{1F9B7}": "\u7259\u9F7F tooth",
  "\u{1F9B4}": "\u9AA8\u5934 bone",
  "\u{1F440}": "\u770B \u773C\u775B \u6CE8\u610F eyes look see watch",
  "\u{1F441}\uFE0F": "\u773C\u775B eye",
  "\u{1F445}": "\u820C\u5934 \u5410\u820C tongue lick",
  "\u{1F444}": "\u5634 \u5634\u5507 \u4EB2 mouth lips kiss",
  "\u{1F9D1}\u200D\u{1F37C}": "\u54FA\u4E73\u7684\u4EBA person feeding baby",
  "\u{1F47C}": "\u5929\u4F7F\u5B9D\u5B9D baby angel",
  "\u{1F385}": "\u5723\u8BDE\u8001\u4EBA santa christmas",
  "\u{1F936}": "\u5723\u8BDE\u5976\u5976 mrs claus",
  "\u{1F9B8}": "\u8D85\u7EA7\u82F1\u96C4 superhero",
  "\u{1F9B9}": "\u8D85\u7EA7\u53CD\u6D3E supervillain",
  "\u{1F9D9}": "\u9B54\u6CD5\u5E08 wizard",
  "\u{1F9DA}": "\u7CBE\u7075 fairy",
  "\u{1F9DB}": "\u5438\u8840\u9B3C vampire",
  "\u{1F9DC}": "\u7F8E\u4EBA\u9C7C merperson",
  "\u{1F9DD}": "\u5C0F\u7CBE\u7075 elf",
  "\u{1F9DE}": "\u795E\u706F\u7CBE\u7075 genie",
  "\u{1F9DF}": "\u50F5\u5C38 zombie",
  "\u{1F9CC}": "\u5DE8\u9B54 troll",
  "\u{1F486}": "\u6309\u6469 \u653E\u677E massage relax spa",
  "\u{1F487}": "\u7406\u53D1 \u526A\u53D1 haircut barber",
  "\u{1F6B6}": "\u8D70\u8DEF \u6B65\u884C \u6563\u6B65 walk pedestrian",
  "\u{1F9CD}": "\u7AD9\u7ACB\u7684\u4EBA person standing",
  "\u{1F9CE}": "\u8DEA\u7740\u7684\u4EBA person kneeling",
  "\u{1F3C3}": "\u8DD1\u6B65 \u8FD0\u52A8 \u8DD1 run jog exercise",
  "\u{1F483}": "\u8DF3\u821E \u821E\u8E48 dance salsa",
  "\u{1F57A}": "\u8DF3\u821E \u821E\u8E48 dance disco",
  "\u{1F574}\uFE0F": "\u7A7F\u897F\u88C5\u60AC\u6D6E\u7684\u4EBA person in suit levitating",
  "\u{1F46F}": "\u6234\u5154\u8033\u7684\u4EBA people with bunny ears",
  "\u{1F9D6}": "\u84B8\u6851\u62FF\u7684\u4EBA person in steamy room",
  "\u{1F9D7}": "\u6500\u5CA9\u7684\u4EBA person climbing",
  "\u{1F93A}": "\u51FB\u5251 fencer",
  "\u{1F3C7}": "\u8D5B\u9A6C horse racing",
  "\u26F7\uFE0F": "\u6ED1\u96EA skier",
  "\u{1F3C2}": "\u5355\u677F\u6ED1\u96EA snowboarder",
  "\u{1F3CC}\uFE0F": "\u6253\u9AD8\u5C14\u592B\u7403\u7684\u4EBA person golfing",
  "\u{1F3C4}": "\u51B2\u6D6A \u6ED1\u6D6A surf wave",
  "\u{1F6A3}": "\u5212\u8239 person rowing boat",
  "\u{1F3CA}": "\u6E38\u6CF3 swim pool",
  "\u26F9\uFE0F": "\u6253\u7BEE\u7403\u7684\u4EBA person bouncing ball",
  "\u{1F3CB}\uFE0F": "\u4E3E\u91CD \u5065\u8EAB weightlift gym fitness",
  "\u{1F6B4}": "\u9A91\u8F66 \u81EA\u884C\u8F66 \u9A91\u884C bike cycle bicycle",
  "\u{1F6B5}": "\u9A91\u5C71\u5730\u8F66\u7684\u4EBA person mountain biking",
  "\u{1F938}": "\u7FFB\u8DDF\u5934 \u4F53\u64CD cartwheel gymnastics",
  "\u{1F93C}": "\u6454\u8DE4 wrestle",
  "\u{1F93D}": "\u6C34\u7403 water polo",
  "\u{1F93E}": "\u624B\u7403 handball",
  "\u{1F933}": "\u81EA\u62CD selfie",
  "\u{1F485}": "\u7F8E\u7532 \u6D82\u6307\u7532\u6CB9 nail polish",
  "\u{1F934}": "\u738B\u5B50 prince",
  "\u{1F478}": "\u516C\u4E3B princess",
  "\u{1F473}": "\u5934\u5DFE turban",
  "\u{1F472}": "\u6234\u74DC\u76AE\u5E3D\u7684\u4EBA person with skullcap",
  "\u{1F9D5}": "\u6234\u5934\u5DFE\u7684\u5973\u4EBA woman with headscarf",
  "\u{1F935}": "\u65B0\u90CE \u897F\u88C5 groom suit tuxedo",
  "\u{1F470}": "\u65B0\u5A18 \u5A5A\u793C bride wedding",
  "\u{1F930}": "\u5B55\u5987 \u6000\u5B55 pregnant",
  "\u{1F931}": "\u54FA\u4E73 \u5988\u5988 \u5582\u5976 breastfeed nursing mother",
  "\u{1F46E}": "\u8B66\u5BDF police cop officer",
  "\u{1F575}\uFE0F": "\u4FA6\u63A2 detective spy",
  "\u{1F482}": "\u536B\u5175 guard",
  "\u{1F977}": "\u5FCD\u8005 ninja",
  "\u{1F477}": "\u5DE5\u4EBA \u5EFA\u7B51 worker construction builder",
  "\u{1FAC5}": "\u6234\u7687\u51A0\u7684\u4EBA person with crown",
  "\u2B50": "\u661F \u661F\u661F star",
  "\u{1F31F}": "\u661F \u95EA\u4EAE \u53D1\u5149 star glow shine",
  "\u2728": "\u95EA \u95EA\u4EAE \u95EA\u8000 \u4EAE\u6676\u6676 sparkle shine glitter",
  "\u{1F4AB}": "\u5934\u6655 \u661F\u661F dizzy star",
  "\u{1F525}": "\u706B \u70ED\u95E8 \u5389\u5BB3 \u725B fire hot lit flame",
  "\u{1F4A5}": "\u7206\u70B8 \u78B0\u649E boom crash explosion",
  "\u{1F4A2}": "\u751F\u6C14 \u6124\u6012 anger symbol",
  "\u{1F4A6}": "\u6C57 \u6C34 sweat drop water splash",
  "\u{1F4A8}": "\u98CE \u5FEB \u8DD1 wind dash fast",
  "\u{1F573}\uFE0F": "\u6D1E hole",
  "\u{1F4A3}": "\u70B8\u5F39 bomb",
  "\u{1F4AC}": "\u5BF9\u8BDD \u8BF4\u8BDD \u804A\u5929 speech chat talk bubble",
  "\u{1F4AD}": "\u601D\u8003 \u60F3\u6CD5 thought think bubble",
  "\u{1F4A4}": "\u7761\u89C9 \u56F0 zzz sleep",
  "\u{1F3AF}": "\u76EE\u6807 \u9776\u5B50 \u547D\u4E2D target bullseye goal",
  "\u{1F3C6}": "\u5956\u676F \u51A0\u519B \u7B2C\u4E00 \u80DC\u5229 trophy champion winner cup",
  "\u{1F3C5}": "\u5956\u724C \u52CB\u7AE0 medal award",
  "\u{1F947}": "\u91D1\u724C \u7B2C\u4E00 \u51A0\u519B gold first winner",
  "\u{1F948}": "\u94F6\u724C \u7B2C\u4E8C silver second",
  "\u{1F949}": "\u94DC\u724C \u7B2C\u4E09 bronze third",
  "\u26BD": "\u8DB3\u7403 \u7403 soccer football",
  "\u{1F3C0}": "\u7BEE\u7403 \u7403 basketball",
  "\u{1F3C8}": "\u6A44\u6984\u7403 football american",
  "\u26BE": "\u68D2\u7403 baseball",
  "\u{1F3BE}": "\u7F51\u7403 tennis",
  "\u{1F3D0}": "\u6392\u7403 volleyball",
  "\u{1F3C9}": "\u6A44\u6984\u7403 rugby",
  "\u{1F3B1}": "\u53F0\u7403 \u684C\u7403 billiards pool",
  "\u{1F3B0}": "\u8001\u864E\u673A slot machine",
  "\u{1F3D3}": "\u4E52\u4E53\u7403 \u7403 ping pong table tennis",
  "\u{1F3F8}": "\u7FBD\u6BDB\u7403 \u7403 badminton",
  "\u{1F94A}": "\u62F3\u51FB \u6253\u62F3 boxing glove",
  "\u{1F94B}": "\u6B66\u672F \u8DC6\u62F3\u9053 \u7A7A\u624B\u9053 martial arts karate",
  "\u{1F6F7}": "\u96EA\u6A47 sled",
  "\u{1F94C}": "\u51B0\u58F6 curling stone",
  "\u26F3": "\u9AD8\u5C14\u592B\u7403 golf",
  "\u26F8\uFE0F": "\u6ED1\u51B0 ice skate",
  "\u{1F3A3}": "\u9493\u9C7C fishing pole",
  "\u{1F93F}": "\u6F5C\u6C34\u955C diving mask",
  "\u{1F3BD}": "\u8FD0\u52A8\u80CC\u5FC3 running shirt",
  "\u{1F3BF}": "\u6ED1\u96EA skis",
  "\u{1F6FC}": "\u8F6E\u6ED1\u978B roller skate",
  "\u{1F3AA}": "\u9A6C\u620F\u56E2 \u6F14\u51FA circus tent",
  "\u{1F3AD}": "\u620F\u5267 \u8868\u6F14 \u9762\u5177 theater drama mask",
  "\u{1F3A8}": "\u753B \u7ED8\u753B \u7F8E\u672F \u827A\u672F art paint palette draw",
  "\u{1F3AC}": "\u7535\u5F71 \u62CD\u6444 movie film clapper",
  "\u{1F3A4}": "\u9EA6\u514B\u98CE \u5531\u6B4C KTV microphone sing karaoke",
  "\u{1F3A7}": "\u8033\u673A \u542C\u6B4C \u97F3\u4E50 headphone music listen",
  "\u{1F3BC}": "\u97F3\u4E50 \u4E50\u8C31 music score note",
  "\u{1F3B9}": "\u94A2\u7434 \u5F39\u7434 piano keyboard",
  "\u{1F941}": "\u9F13 \u6253\u9F13 drum",
  "\u{1FA98}": "\u957F\u9F13 long drum",
  "\u{1F3B7}": "\u8428\u514B\u65AF \u97F3\u4E50 saxophone",
  "\u{1F3BA}": "\u5587\u53ED \u53F7 trumpet horn",
  "\u{1FA97}": "\u624B\u98CE\u7434 accordion",
  "\u{1F3B8}": "\u5409\u4ED6 \u97F3\u4E50 guitar",
  "\u{1FA95}": "\u73ED\u5353\u7434 banjo",
  "\u{1F3BB}": "\u5C0F\u63D0\u7434 \u97F3\u4E50 violin",
  "\u{1F396}\uFE0F": "\u519B\u529F\u7AE0 military medal",
  "\u{1F3F5}\uFE0F": "\u82B1\u73AF rosette",
  "\u{1F397}\uFE0F": "\u63D0\u793A\u4E1D\u5E26 reminder ribbon",
  "\u{1F3AB}": "\u7968 ticket",
  "\u{1F39F}\uFE0F": "\u5165\u573A\u5238 admission tickets",
  "\u{1F3AE}": "\u6E38\u620F \u624B\u67C4 video game",
  "\u{1F579}\uFE0F": "\u64CD\u7EB5\u6746 joystick",
  "\u{1F3B2}": "\u9AB0\u5B50 game die",
  "\u{1F9E9}": "\u62FC\u56FE puzzle piece",
  "\u{1F9F8}": "\u6CF0\u8FEA\u718A teddy bear",
  "\u{1FA85}": "\u5F69\u7F50 pi\xF1ata",
  "\u{1FAA9}": "\u8FEA\u65AF\u79D1\u7403 mirror ball",
  "\u{1FA86}": "\u5957\u5A03 nesting dolls",
  "\u2660\uFE0F": "\u9ED1\u6843 spade suit",
  "\u2665\uFE0F": "\u7EA2\u6843 heart suit",
  "\u2666\uFE0F": "\u65B9\u7247 diamond suit",
  "\u2663\uFE0F": "\u6885\u82B1 club suit",
  "\u265F\uFE0F": "\u56FD\u9645\u8C61\u68CB\u68CB\u5B50 chess pawn",
  "\u{1F0CF}": "\u738B\u724C joker",
  "\u{1F004}": "\u9EBB\u5C06\u7EA2\u4E2D mahjong red dragon",
  "\u{1F3B4}": "\u82B1\u672D\u7EB8\u724C flower playing cards",
  "\u{1F5BC}\uFE0F": "\u5E26\u6846\u7684\u753B framed picture",
  "\u{1F9F5}": "\u7EBF thread",
  "\u{1FAA1}": "\u7F1D\u8863\u9488 sewing needle",
  "\u{1F9F6}": "\u6BDB\u7EBF yarn",
  "\u{1F453}": "\u773C\u955C glasses",
  "\u{1F576}\uFE0F": "\u58A8\u955C sunglasses",
  "\u{1F97D}": "\u62A4\u76EE\u955C goggles",
  "\u{1F97C}": "\u767D\u5927\u8902 lab coat",
  "\u{1F9BA}": "\u5B89\u5168\u80CC\u5FC3 safety vest",
  "\u{1F454}": "\u9886\u5E26 necktie",
  "\u{1F455}": "T\u6064 t-shirt",
  "\u{1F456}": "\u725B\u4ED4\u88E4 jeans",
  "\u{1F9E3}": "\u56F4\u5DFE scarf",
  "\u{1F9E4}": "\u624B\u5957 gloves",
  "\u{1F9E5}": "\u5916\u5957 coat",
  "\u{1F9E6}": "\u889C\u5B50 socks",
  "\u{1F457}": "\u8FDE\u8863\u88D9 dress",
  "\u{1F458}": "\u548C\u670D kimono",
  "\u{1F97B}": "\u7EB1\u4E3D sari",
  "\u{1FA71}": "\u8FDE\u4F53\u6CF3\u8863 one-piece swimsuit",
  "\u{1FA72}": "\u6CF3\u88E4 briefs",
  "\u{1FA73}": "\u77ED\u88E4 shorts",
  "\u{1F459}": "\u6BD4\u57FA\u5C3C bikini",
  "\u{1F45A}": "\u5973\u88C5 woman's clothes",
  "\u{1F45B}": "\u94B1\u5305 purse",
  "\u{1F45C}": "\u624B\u63D0\u5305 handbag",
  "\u{1F45D}": "\u624B\u5305 clutch bag",
  "\u{1F6CD}\uFE0F": "\u8D2D\u7269\u888B shopping bags",
  "\u{1F392}": "\u4E66\u5305 \u80CC\u5305 backpack",
  "\u{1FA74}": "\u4EBA\u5B57\u62D6 thong sandal",
  "\u{1F45E}": "\u7537\u978B man's shoe",
  "\u{1F45F}": "\u8FD0\u52A8\u978B running shoe",
  "\u{1F97E}": "\u767B\u5C71\u9774 hiking boot",
  "\u{1F97F}": "\u5E73\u5E95\u978B flat shoe",
  "\u{1F460}": "\u9AD8\u8DDF\u978B high-heeled shoe",
  "\u{1F461}": "\u5973\u5F0F\u51C9\u978B woman's sandal",
  "\u{1FA70}": "\u82AD\u857E\u821E\u978B ballet shoes",
  "\u{1F462}": "\u5973\u9774 woman's boot",
  "\u{1F451}": "\u7687\u51A0 crown",
  "\u{1F452}": "\u5973\u5E3D woman's hat",
  "\u{1F3A9}": "\u793C\u5E3D top hat",
  "\u{1F393}": "\u6BD5\u4E1A\u5E3D graduation cap",
  "\u{1F9E2}": "\u9E2D\u820C\u5E3D billed cap",
  "\u{1FA96}": "\u519B\u7528\u5934\u76D4 military helmet",
  "\u26D1\uFE0F": "\u767D\u5341\u5B57\u5934\u76D4 rescue worker's helmet",
  "\u{1F4FF}": "\u5FF5\u73E0 prayer beads",
  "\u{1F484}": "\u53E3\u7EA2 lipstick",
  "\u{1F48D}": "\u6212\u6307 ring",
  "\u{1F48E}": "\u5B9D\u77F3 gem stone",
  "\u{1F507}": "\u9759\u97F3 speaker muted",
  "\u{1F508}": "\u5C0F\u58F0 speaker low volume",
  "\u{1F509}": "\u4E2D\u58F0 speaker medium volume",
  "\u{1F50A}": "\u5927\u58F0 speaker high volume",
  "\u{1F4E2}": "\u6269\u97F3\u5668 loudspeaker",
  "\u{1F4E3}": "\u5587\u53ED megaphone",
  "\u{1F4EF}": "\u90AE\u653F\u53F7\u89D2 postal horn",
  "\u{1F514}": "\u94C3\u94DB bell",
  "\u{1F515}": "\u7981\u6B62\u94C3\u94DB bell with slash",
  "\u{1F3B5}": "\u97F3\u7B26 musical note",
  "\u{1F3B6}": "\u97F3\u7B26 musical notes",
  "\u{1F399}\uFE0F": "\u5F55\u97F3\u5BA4\u9EA6\u514B\u98CE studio microphone",
  "\u{1F39A}\uFE0F": "\u8C03\u97F3\u53F0 level slider",
  "\u{1F39B}\uFE0F": "\u63A7\u5236\u65CB\u94AE control knobs",
  "\u{1F4FB}": "\u6536\u97F3\u673A radio",
  "\u{1F4F1}": "\u624B\u673A mobile phone",
  "\u{1F4F2}": "\u5E26\u7BAD\u5934\u7684\u624B\u673A mobile phone with arrow",
  "\u260E\uFE0F": "\u7535\u8BDD telephone",
  "\u{1F4DE}": "\u7535\u8BDD\u542C\u7B52 telephone receiver",
  "\u{1F4DF}": "\u5BFB\u547C\u673A pager",
  "\u{1F4E0}": "\u4F20\u771F\u673A fax machine",
  "\u{1F50B}": "\u7535\u6C60 battery",
  "\u{1F50C}": "\u63D2\u5934 electric plug",
  "\u{1F4BB}": "\u7B14\u8BB0\u672C\u7535\u8111 laptop",
  "\u{1F5A5}\uFE0F": "\u53F0\u5F0F\u7535\u8111 desktop computer",
  "\u{1F5A8}\uFE0F": "\u6253\u5370\u673A printer",
  "\u2328\uFE0F": "\u952E\u76D8 keyboard",
  "\u{1F5B1}\uFE0F": "\u9F20\u6807 computer mouse",
  "\u{1F5B2}\uFE0F": "\u8F68\u8FF9\u7403 trackball",
  "\u{1F4BD}": "\u8FF7\u4F60\u789F minidisc",
  "\u{1F4BE}": "\u8F6F\u76D8 floppy disk",
  "\u{1F4BF}": "\u5149\u76D8 optical disk",
  "\u{1F4C0}": "DVD dvd",
  "\u{1F9EE}": "\u7B97\u76D8 abacus",
  "\u{1F3A5}": "\u7535\u5F71\u6444\u50CF\u673A movie camera",
  "\u{1F39E}\uFE0F": "\u7535\u5F71\u80F6\u7247 film frames",
  "\u{1F4FD}\uFE0F": "\u7535\u5F71\u653E\u6620\u673A film projector",
  "\u{1F4FA}": "\u7535\u89C6\u673A television",
  "\u{1F4F7}": "\u76F8\u673A camera",
  "\u{1F4F8}": "\u95EA\u5149\u706F\u76F8\u673A camera with flash",
  "\u{1F4F9}": "\u6444\u50CF\u673A video camera",
  "\u{1F4FC}": "\u5F55\u50CF\u5E26 videocassette",
  "\u{1F50D}": "\u5411\u5DE6\u7684\u653E\u5927\u955C magnifying glass tilted left",
  "\u{1F50E}": "\u5411\u53F3\u7684\u653E\u5927\u955C magnifying glass tilted right",
  "\u{1F56F}\uFE0F": "\u8721\u70DB candle",
  "\u{1F4A1}": "\u706F\u6CE1 \u60F3\u6CD5 light bulb idea",
  "\u{1F526}": "\u624B\u7535\u7B52 flashlight",
  "\u{1F3EE}": "\u7EA2\u706F\u7B3C red paper lantern",
  "\u{1FA94}": "\u6CB9\u706F diya lamp",
  "\u{1F4D4}": "\u5E26\u88C5\u9970\u5C01\u9762\u7684\u7B14\u8BB0\u672C notebook with decorative cover",
  "\u{1F4D5}": "\u5408\u4E0A\u7684\u7EA2\u4E66 closed book",
  "\u{1F4D6}": "\u6253\u5F00\u7684\u4E66 open book",
  "\u{1F4D7}": "\u7EFF\u4E66 green book",
  "\u{1F4D8}": "\u84DD\u4E66 blue book",
  "\u{1F4D9}": "\u6A59\u4E66 orange book",
  "\u{1F4DA}": "\u4E66 \u4E66\u7C4D books",
  "\u{1F4D3}": "\u7B14\u8BB0\u672C notebook",
  "\u{1F4D2}": "\u8D26\u672C ledger",
  "\u{1F4C3}": "\u5E26\u5377\u8FB9\u7684\u9875\u9762 page with curl",
  "\u{1F4DC}": "\u5377\u8F74 scroll",
  "\u{1F4C4}": "\u6587\u4EF6 page facing up",
  "\u{1F4F0}": "\u62A5\u7EB8 newspaper",
  "\u{1F5DE}\uFE0F": "\u5377\u8D77\u6765\u7684\u62A5\u7EB8 rolled-up newspaper",
  "\u{1F4D1}": "\u4E66\u7B7E\u6807\u7B7E bookmark tabs",
  "\u{1F516}": "\u4E66\u7B7E bookmark",
  "\u{1F3F7}\uFE0F": "\u6807\u7B7E label",
  "\u{1F4B0}": "\u94B1\u888B money bag",
  "\u{1FA99}": "\u786C\u5E01 coin",
  "\u{1F4B4}": "\u65E5\u5143 yen banknote",
  "\u{1F4B5}": "\u7F8E\u5143 dollar banknote",
  "\u{1F4B6}": "\u6B27\u5143 euro banknote",
  "\u{1F4B7}": "\u82F1\u9551 pound banknote",
  "\u{1F4B8}": "\u957F\u7FC5\u8180\u7684\u94B1 money with wings",
  "\u{1F4B3}": "\u4FE1\u7528\u5361 credit card",
  "\u{1F9FE}": "\u6536\u636E receipt",
  "\u{1F4B9}": "\u56FE\u8868\u4E0A\u6DA8 chart increasing with yen",
  "\u2709\uFE0F": "\u4FE1\u5C01 envelope",
  "\u{1F4E7}": "\u7535\u5B50\u90AE\u4EF6 e-mail",
  "\u{1F4E8}": " incoming envelope",
  "\u{1F4E9}": "\u5E26\u7BAD\u5934\u7684\u4FE1\u5C01 envelope with arrow",
  "\u{1F4E4}": "\u53D1\u4EF6\u7BB1 outbox tray",
  "\u{1F4E5}": "\u6536\u4EF6\u7BB1 inbox tray",
  "\u{1F4E6}": "\u5305\u88F9 package",
  "\u{1F4EB}": "\u6709\u5F85\u53D6\u90AE\u4EF6\u7684\u90AE\u7BB1 closed mailbox with raised flag",
  "\u{1F4EA}": "\u65E0\u5F85\u53D6\u90AE\u4EF6\u7684\u90AE\u7BB1 closed mailbox with lowered flag",
  "\u{1F4EC}": "\u6709\u5F85\u53D6\u90AE\u4EF6\u7684\u5F00\u90AE\u7BB1 open mailbox with raised flag",
  "\u{1F4ED}": "\u65E0\u5F85\u53D6\u90AE\u4EF6\u7684\u5F00\u90AE\u7BB1 open mailbox with lowered flag",
  "\u{1F4EE}": "\u90AE\u7B52 postbox",
  "\u{1F5F3}\uFE0F": "\u5E26\u9009\u7968\u7684\u6295\u7968\u7BB1 ballot box with ballot",
  "\u270F\uFE0F": "\u94C5\u7B14 pencil",
  "\u2712\uFE0F": "\u94A2\u7B14 black nib",
  "\u{1F58B}\uFE0F": "\u94A2\u7B14 fountain pen",
  "\u{1F58A}\uFE0F": "\u5706\u73E0\u7B14 pen",
  "\u{1F58C}\uFE0F": "\u753B\u7B14 paintbrush",
  "\u{1F58D}\uFE0F": "\u8721\u7B14 crayon",
  "\u{1F4DD}": "\u5907\u5FD8\u5F55 memo",
  "\u{1F4BC}": "\u516C\u6587\u5305 briefcase",
  "\u{1F4C1}": "\u6587\u4EF6\u5939 file folder",
  "\u{1F4C2}": "\u6253\u5F00\u7684\u6587\u4EF6\u5939 open file folder",
  "\u{1F5C2}\uFE0F": "\u5361\u7247\u7D22\u5F15 card index dividers",
  "\u{1F4C5}": "\u65E5\u5386 calendar",
  "\u{1F4C6}": "\u6495\u9875\u65E5\u5386 tear-off calendar",
  "\u{1F5D2}\uFE0F": "\u87BA\u65CB\u8BB0\u4E8B\u672C spiral notepad",
  "\u{1F5D3}\uFE0F": "\u87BA\u65CB\u65E5\u5386 spiral calendar",
  "\u{1F4C7}": "\u5361\u7247\u7D22\u5F15 card index",
  "\u{1F4C8}": "\u4E0A\u6DA8\u7684\u56FE\u8868 chart increasing",
  "\u{1F4C9}": "\u4E0B\u964D\u7684\u56FE\u8868 chart decreasing",
  "\u{1F4CA}": "\u67F1\u72B6\u56FE bar chart",
  "\u{1F4CB}": "\u526A\u8D34\u677F clipboard",
  "\u{1F4CC}": "\u56FE\u9489 pushpin",
  "\u{1F4CD}": "\u5706\u56FE\u9489 round pushpin",
  "\u{1F4CE}": "\u56DE\u5F62\u9488 paperclip",
  "\u{1F587}\uFE0F": "\u76F8\u8FDE\u7684\u56DE\u5F62\u9488 linked paperclips",
  "\u{1F4CF}": "\u76F4\u5C3A straight ruler",
  "\u{1F4D0}": "\u4E09\u89D2\u5C3A triangular ruler",
  "\u2702\uFE0F": "\u526A\u5200 scissors",
  "\u{1F5C3}\uFE0F": "\u5361\u7247\u6587\u4EF6\u76D2 card file box",
  "\u{1F5C4}\uFE0F": "\u6587\u4EF6\u67DC file cabinet",
  "\u{1F5D1}\uFE0F": "\u5E9F\u7EB8\u7BD3 wastebasket",
  "\u{1F512}": "\u9501 locked",
  "\u{1F513}": "\u6253\u5F00\u7684\u9501 unlocked",
  "\u{1F50F}": "\u5E26\u94A2\u7B14\u7684\u9501 locked with pen",
  "\u{1F510}": "\u5E26\u94A5\u5319\u7684\u9501 locked with key",
  "\u{1F511}": "\u94A5\u5319 key",
  "\u{1F5DD}\uFE0F": "\u65E7\u94A5\u5319 old key",
  "\u{1F528}": "\u9524\u5B50 hammer",
  "\u{1FA93}": "\u65A7\u5934 axe",
  "\u26CF\uFE0F": "\u9550 pick",
  "\u2692\uFE0F": "\u9524\u5B50\u548C\u9550 hammer and pick",
  "\u{1F6E0}\uFE0F": "\u9524\u5B50\u548C\u6273\u624B hammer and wrench",
  "\u{1F5E1}\uFE0F": "\u5315\u9996 dagger",
  "\u2694\uFE0F": "\u4EA4\u53C9\u7684\u5251 crossed swords",
  "\u{1F52B}": "\u6C34\u67AA pistol",
  "\u{1FA83}": "\u56DE\u65CB\u9556 boomerang",
  "\u{1F3F9}": "\u5F13\u548C\u7BAD bow and arrow",
  "\u{1F6E1}\uFE0F": "\u76FE\u724C shield",
  "\u{1FA9A}": "\u6728\u5DE5\u952F carpentry saw",
  "\u{1F527}": "\u6273\u624B wrench",
  "\u{1FA9B}": "\u87BA\u4E1D\u5200 screwdriver",
  "\u{1F529}": "\u87BA\u6BCD\u548C\u87BA\u6813 nut and bolt",
  "\u2699\uFE0F": "\u9F7F\u8F6E gear",
  "\u{1F5DC}\uFE0F": "\u5939\u94B3 clamp",
  "\u2696\uFE0F": "\u5929\u5E73 balance scale",
  "\u{1F9AF}": "\u767D\u624B\u6756 white cane",
  "\u{1F517}": "\u94FE\u63A5 link",
  "\u26D3\uFE0F": "\u94FE\u6761 chains",
  "\u{1FA9D}": "\u94A9\u5B50 hook",
  "\u{1F9F0}": "\u5DE5\u5177\u7BB1 toolbox",
  "\u{1F9F2}": "\u78C1\u94C1 magnet",
  "\u{1FA9C}": "\u68AF\u5B50 ladder",
  "\u2697\uFE0F": "\u84B8\u998F\u5668 alembic",
  "\u{1F9EA}": "\u8BD5\u7BA1 test tube",
  "\u{1F9EB}": "\u57F9\u517B\u76BF petri dish",
  "\u{1F9EC}": "DNA dna",
  "\u{1F52C}": "\u663E\u5FAE\u955C microscope",
  "\u{1F52D}": "\u671B\u8FDC\u955C telescope",
  "\u{1F4E1}": "\u536B\u661F\u5929\u7EBF satellite antenna",
  "\u{1F489}": "\u6CE8\u5C04\u5668 syringe",
  "\u{1FA78}": "\u8840\u6EF4 drop of blood",
  "\u{1F48A}": "\u836F\u4E38 pill",
  "\u{1FA79}": "\u521B\u53EF\u8D34 adhesive bandage",
  "\u{1FA7C}": "\u62D0\u6756 crutch",
  "\u{1FA7A}": "\u542C\u8BCA\u5668 stethoscope",
  "\u{1F321}\uFE0F": "\u6E29\u5EA6\u8BA1 thermometer",
  "\u{1F6AA}": "\u95E8 door",
  "\u{1F6D7}": "\u7535\u68AF elevator",
  "\u{1FA9E}": "\u955C\u5B50 mirror",
  "\u{1FA9F}": "\u7A97\u6237 window",
  "\u{1F6CF}\uFE0F": "\u5E8A bed",
  "\u{1F6CB}\uFE0F": "\u6C99\u53D1\u548C\u706F couch and lamp",
  "\u{1FA91}": "\u6905\u5B50 chair",
  "\u{1F6BD}": "\u5395\u6240 toilet",
  "\u{1FAA0}": "\u76AE\u640B\u5B50 plunger",
  "\u{1F6BF}": "\u6DCB\u6D74 shower",
  "\u{1F6C1}": "\u6D74\u7F38 bathtub",
  "\u{1FAA4}": "\u6355\u9F20\u5668 mouse trap",
  "\u{1FA92}": "\u5243\u987B\u5200 razor",
  "\u{1F9F4}": "\u4E73\u6DB2\u74F6 lotion bottle",
  "\u{1F9F7}": "\u5B89\u5168\u522B\u9488 safety pin",
  "\u{1F9F9}": "\u626B\u5E1A broom",
  "\u{1F9FA}": "\u7BEE\u5B50 basket",
  "\u{1F9FB}": "\u5377\u7EB8 roll of paper",
  "\u{1F9FC}": "\u80A5\u7682 soap",
  "\u{1F9FD}": "\u6D77\u7EF5 sponge",
  "\u{1F9EF}": "\u706D\u706B\u5668 fire extinguisher",
  "\u{1F6D2}": "\u8D2D\u7269\u8F66 shopping cart",
  "\u{1F6AC}": "\u9999\u70DF cigarette",
  "\u26B0\uFE0F": "\u68FA\u6750 coffin",
  "\u{1FAA6}": "\u5893\u7891 headstone",
  "\u26B1\uFE0F": "\u9AA8\u7070\u74EE funeral urn",
  "\u{1F5FF}": "\u6469\u827E\u77F3\u50CF moai",
  "\u{1FAA7}": "\u6807\u8BED\u724C placard",
  "\u{1F697}": "\u8F66 \u6C7D\u8F66 car",
  "\u{1F695}": "\u51FA\u79DF\u8F66 taxi",
  "\u{1F699}": "SUV \u8D8A\u91CE\u8F66 sport utility vehicle",
  "\u{1F68C}": "\u516C\u4EA4\u8F66 bus",
  "\u{1F68E}": "\u65E0\u8F68\u7535\u8F66 trolleybus",
  "\u{1F3CE}\uFE0F": "\u8D5B\u8F66 racing car",
  "\u{1F693}": "\u8B66\u8F66 police car",
  "\u{1F691}": "\u6551\u62A4\u8F66 ambulance",
  "\u{1F692}": "\u6D88\u9632\u8F66 fire engine",
  "\u{1F690}": "\u9762\u5305\u8F66 minibus",
  "\u{1F6FB}": "\u76AE\u5361\u8F66 pickup truck",
  "\u{1F69A}": "\u8D27\u8F66 delivery truck",
  "\u{1F69B}": " articulated lorry",
  "\u{1F69C}": "\u62D6\u62C9\u673A tractor",
  "\u{1F3CD}\uFE0F": "\u6469\u6258\u8F66 motorcycle",
  "\u{1F6F5}": "\u7535\u52A8\u8F66 motor scooter",
  "\u{1F9BD}": "\u624B\u52A8\u8F6E\u6905 manual wheelchair",
  "\u{1F9BC}": "\u7535\u52A8\u8F6E\u6905 motorized wheelchair",
  "\u{1F6FA}": "\u81EA\u52A8\u4EBA\u529B\u8F66 auto rickshaw",
  "\u{1F6B2}": "\u81EA\u884C\u8F66 bicycle",
  "\u{1F6F4}": "\u6ED1\u677F\u8F66 kick scooter",
  "\u{1F6F9}": "\u6ED1\u677F skateboard",
  "\u{1F68F}": "\u516C\u4EA4\u8F66\u7AD9 bus stop",
  "\u{1F6E3}\uFE0F": "\u9AD8\u901F\u516C\u8DEF motorway",
  "\u{1F6E4}\uFE0F": "\u94C1\u8F68 railway track",
  "\u{1F6E2}\uFE0F": "\u6CB9\u6876 oil drum",
  "\u26FD": "\u52A0\u6CB9\u7AD9 fuel pump",
  "\u{1F6DE}": "\u8F66\u8F6E wheel",
  "\u{1F6A8}": "\u8B66\u8F66\u65CB\u8F6C\u706F police car light",
  "\u{1F6A5}": "\u6A2A\u5411\u7EA2\u7EFF\u706F horizontal traffic light",
  "\u{1F6A6}": "\u7EB5\u5411\u7EA2\u7EFF\u706F vertical traffic light",
  "\u{1F6D1}": "\u505C\u8F66\u6807\u5FD7 stop sign",
  "\u{1F6A7}": "\u65BD\u5DE5 construction",
  "\u2693": "\u951A anchor",
  "\u{1F6DF}": "\u6551\u751F\u5708 ring buoy",
  "\u26F5": "\u5E06\u8239 sailboat",
  "\u{1F6F6}": "\u72EC\u6728\u821F canoe",
  "\u{1F6A4}": "\u5FEB\u8247 speedboat",
  "\u{1F6F3}\uFE0F": "\u5BA2\u8239 passenger ship",
  "\u26F4\uFE0F": "\u6E21\u8F6E ferry",
  "\u{1F6E5}\uFE0F": "\u6C7D\u8247 motor boat",
  "\u{1F6A2}": "\u8F6E\u8239 ship",
  "\u2708\uFE0F": "\u98DE\u673A airplane",
  "\u{1F6E9}\uFE0F": "\u5C0F\u578B\u98DE\u673A small airplane",
  "\u{1F6EB}": "\u98DE\u673A\u8D77\u98DE airplane departure",
  "\u{1F6EC}": "\u98DE\u673A\u964D\u843D airplane arriving",
  "\u{1FA82}": "\u964D\u843D\u4F1E parachute",
  "\u{1F4BA}": "\u5EA7\u4F4D seat",
  "\u{1F681}": "\u76F4\u5347\u673A helicopter",
  "\u{1F69F}": "\u60AC\u6302\u5F0F\u94C1\u8DEF suspension railway",
  "\u{1F6A0}": "\u7F06\u8F66 mountain cableway",
  "\u{1F6A1}": "\u7A7A\u4E2D\u7F06\u8F66 aerial tramway",
  "\u{1F6F0}\uFE0F": "\u536B\u661F satellite",
  "\u{1F680}": "\u706B\u7BAD rocket",
  "\u{1F6F8}": "\u98DE\u789F flying saucer",
  "\u{1F320}": "\u6D41\u661F shooting star",
  "\u{1F30C}": "\u94F6\u6CB3 milky way",
  "\u26F1\uFE0F": "\u6C99\u6EE9\u4F1E umbrella on ground",
  "\u{1F386}": "\u70DF\u82B1 fireworks",
  "\u{1F387}": "\u7130\u706B sparkler",
  "\u{1F391}": "\u8D4F\u6708 moon viewing ceremony",
  "\u{1F3D9}\uFE0F": "\u57CE\u5E02\u591C\u666F cityscape",
  "\u{1F305}": "\u65E5\u51FA sunrise",
  "\u{1F304}": "\u5C71\u8FB9\u65E5\u51FA sunrise over mountains",
  "\u{1F307}": "\u65E5\u843D sunset",
  "\u{1F306}": "\u57CE\u5E02\u9EC4\u660F cityscape at dusk",
  "\u{1F303}": "\u591C\u665A with stars",
  "\u{1F309}": "\u591C\u666F\u6865 bridge at night",
  "\u{1F301}": "\u6709\u96FE foggy",
  "\u231A": "\u624B\u8868 watch",
  "\u23F0": "\u95F9\u949F alarm clock",
  "\u23F1\uFE0F": "\u79D2\u8868 stopwatch",
  "\u23F2\uFE0F": "\u8BA1\u65F6\u5668 timer clock",
  "\u{1F570}\uFE0F": "\u5EA7\u949F mantelpiece clock",
  "\u{1F55B}": "\u5341\u4E8C\u70B9 twelve o'clock",
  "\u{1F567}": "\u5341\u4E8C\u70B9\u534A twelve-thirty",
  "\u{1F55C}": "\u4E00\u70B9 half past one",
  "\u{1F550}": "\u4E00\u70B9 one o'clock",
  "\u{1F34E}": "\u82F9\u679C \u6C34\u679C apple fruit",
  "\u{1F350}": "\u68A8 \u6C34\u679C pear fruit",
  "\u{1F34A}": "\u6A58\u5B50 \u6A59\u5B50 \u6C34\u679C orange tangerine fruit",
  "\u{1F34B}": "\u67E0\u6AAC \u6C34\u679C lemon fruit",
  "\u{1F34C}": "\u9999\u8549 \u6C34\u679C banana fruit",
  "\u{1F349}": "\u897F\u74DC \u6C34\u679C watermelon fruit",
  "\u{1F347}": "\u8461\u8404 \u6C34\u679C grape fruit",
  "\u{1F353}": "\u8349\u8393 \u6C34\u679C strawberry fruit",
  "\u{1FAD0}": "\u84DD\u8393 \u6C34\u679C blueberry fruit",
  "\u{1F348}": "\u751C\u74DC \u6C34\u679C melon fruit",
  "\u{1F352}": "\u6A31\u6843 \u6C34\u679C cherry fruit",
  "\u{1F351}": "\u6843\u5B50 \u6C34\u679C peach fruit",
  "\u{1F96D}": "\u8292\u679C \u6C34\u679C mango fruit",
  "\u{1F34D}": "\u83E0\u841D \u6C34\u679C pineapple fruit",
  "\u{1F965}": "\u6930\u5B50 \u6C34\u679C coconut fruit",
  "\u{1F95D}": "\u7315\u7334\u6843 \u6C34\u679C kiwi fruit",
  "\u{1F345}": "\u756A\u8304 \u897F\u7EA2\u67FF \u852C\u83DC tomato vegetable",
  "\u{1F346}": "\u8304\u5B50 \u852C\u83DC eggplant aubergine",
  "\u{1F951}": "\u725B\u6CB9\u679C \u852C\u83DC avocado",
  "\u{1F966}": "\u897F\u5170\u82B1 \u852C\u83DC broccoli vegetable",
  "\u{1F96C}": "\u7EFF\u53F6\u852C\u83DC leafy green",
  "\u{1F952}": "\u9EC4\u74DC \u852C\u83DC cucumber vegetable",
  "\u{1F336}\uFE0F": "\u8FA3\u6912 \u8FA3 pepper hot chili spicy",
  "\u{1FAD1}": "\u751C\u6912 bell pepper",
  "\u{1F33D}": "\u7389\u7C73 corn",
  "\u{1F955}": "\u80E1\u841D\u535C \u841D\u535C \u852C\u83DC carrot vegetable",
  "\u{1FAD2}": "\u6A44\u6984 olive",
  "\u{1F9C4}": "\u5927\u849C \u849C garlic",
  "\u{1F9C5}": "\u6D0B\u8471 onion",
  "\u{1F954}": "\u571F\u8C46 \u9A6C\u94C3\u85AF potato",
  "\u{1F360}": "\u7EA2\u85AF \u5730\u74DC sweet potato",
  "\u{1FAD8}": "\u8C46\u5B50 beans",
  "\u{1F950}": "\u725B\u89D2\u9762\u5305 croissant",
  "\u{1F35E}": "\u9762\u5305 bread",
  "\u{1F956}": "\u6CD5\u68CD baguette bread",
  "\u{1F968}": "\u6912\u76D0\u5377\u997C pretzel",
  "\u{1F96F}": "\u767E\u5409\u997C bagel",
  "\u{1F95E}": "\u714E\u997C \u8584\u997C pancake",
  "\u{1F9C7}": "\u534E\u592B\u997C waffle",
  "\u{1F9C0}": "\u5976\u916A \u829D\u58EB cheese",
  "\u{1F356}": "\u6392\u9AA8\u4E0A\u7684\u8089 meat on bone",
  "\u{1F357}": "\u9E21\u817F \u8089 chicken leg drumstick",
  "\u{1F969}": "\u725B\u6392 \u8089 steak meat beef",
  "\u{1F953}": "\u57F9\u6839 \u8089 bacon meat",
  "\u{1F354}": "\u6C49\u5821 \u5FEB\u9910 burger hamburger fast food",
  "\u{1F35F}": "\u85AF\u6761 \u5FEB\u9910 fries fast food",
  "\u{1F355}": "\u62AB\u8428 \u5FEB\u9910 pizza",
  "\u{1F32D}": "\u70ED\u72D7 hotdog",
  "\u{1F96A}": "\u4E09\u660E\u6CBB sandwich",
  "\u{1F32E}": "\u58A8\u897F\u54E5 \u5377 taco",
  "\u{1F32F}": "\u5377\u997C burrito",
  "\u{1FAD4}": "\u7389\u7C73\u7C89\u84B8\u8089 tamale",
  "\u{1F959}": "\u76AE\u5854\u997C stuffed flatbread",
  "\u{1F9C6}": "\u70B8\u8C46\u4E38\u5B50 falafel",
  "\u{1F95A}": "\u9E21\u86CB \u86CB egg",
  "\u{1F373}": "\u714E\u86CB \u505A\u996D \u716E cooking egg fry",
  "\u{1F958}": " shallow pan of food",
  "\u{1F372}": "\u4E00\u9505\u98DF\u7269 pot of food",
  "\u{1FAD5}": "\u5976\u916A\u706B\u9505 fondue",
  "\u{1F963}": "\u7897\u52FA bowl with spoon",
  "\u{1F957}": "\u6C99\u62C9 \u852C\u83DC salad",
  "\u{1F37F}": "\u7206\u7C73\u82B1 popcorn",
  "\u{1F9C8}": "\u9EC4\u6CB9 butter",
  "\u{1F9C2}": "\u76D0 salt",
  "\u{1F96B}": "\u7F50\u5934\u98DF\u54C1 canned food",
  "\u{1F371}": "\u4FBF\u5F53 \u76D2\u996D \u996D\u76D2 bento lunch box",
  "\u{1F358}": "\u7C73\u997C rice cracker",
  "\u{1F359}": "\u996D\u56E2 \u7C73\u996D rice ball onigiri",
  "\u{1F35A}": "\u7C73\u996D \u996D rice bowl",
  "\u{1F35B}": "\u5496\u55B1\u996D curry rice",
  "\u{1F35C}": "\u9762\u6761 \u62C9\u9762 \u6C64\u9762 noodle ramen soup",
  "\u{1F35D}": "\u610F\u9762 \u9762\u6761 pasta spaghetti noodle",
  "\u{1F362}": "\u5173\u4E1C\u716E \u4E32 oden skewer",
  "\u{1F363}": "\u5BFF\u53F8 \u65E5\u6599 sushi japanese",
  "\u{1F364}": "\u5929\u5987\u7F57 fried shrimp",
  "\u{1F365}": "\u9C7C\u677F fish cake with swirl",
  "\u{1F96E}": "\u6708\u997C moon cake",
  "\u{1F361}": "\u56E2\u5B50 \u4E38\u5B50 dango",
  "\u{1F95F}": "\u997A\u5B50 \u9984\u9968 dumpling",
  "\u{1F960}": "\u5E78\u8FD0\u997C\u5E72 fortune cookie",
  "\u{1F961}": "\u5916\u5356\u76D2 takeout box",
  "\u{1F980}": "\u87F9 crab",
  "\u{1F99E}": "\u9F99\u867E lobster",
  "\u{1F990}": "\u867E \u70B8\u867E shrimp prawn",
  "\u{1F991}": "\u4E4C\u8D3C squid",
  "\u{1F9AA}": "\u7261\u86CE oyster",
  "\u{1F366}": "\u751C\u7B52 \u51B0\u6DC7\u6DCB ice cream cone",
  "\u{1F367}": "\u5228\u51B0 shaved ice",
  "\u{1F368}": "\u51B0\u6DC7\u6DCB ice cream",
  "\u{1F369}": "\u751C\u751C\u5708 donut doughnut",
  "\u{1F36A}": "\u997C\u5E72 \u66F2\u5947 cookie",
  "\u{1F382}": "\u751F\u65E5\u86CB\u7CD5 \u751F\u65E5 birthday cake",
  "\u{1F370}": "\u86CB\u7CD5 \u751C\u70B9 cake dessert",
  "\u{1F9C1}": "\u676F\u5B50\u86CB\u7CD5 cupcake",
  "\u{1F967}": "\u6D3E \u9985\u997C pie",
  "\u{1F36B}": "\u5DE7\u514B\u529B chocolate",
  "\u{1F36C}": "\u7CD6\u679C candy sweet",
  "\u{1F36D}": "\u68D2\u68D2\u7CD6 lollipop candy",
  "\u{1F36E}": "\u5E03\u4E01 custard pudding",
  "\u{1F36F}": "\u8702\u871C honey pot",
  "\u{1F37C}": "\u5976\u74F6 \u5A74\u513F baby bottle",
  "\u{1F95B}": "\u725B\u5976 \u5976 milk",
  "\u2615": "\u5496\u5561 \u70ED\u996E coffee cafe hot drink",
  "\u{1FAD6}": "\u8336\u58F6 tea pot",
  "\u{1F375}": "\u8336 \u62B9\u8336 \u7EFF\u8336 tea matcha green",
  "\u{1F9C3}": "\u679C\u6C41\u76D2 beverage box",
  "\u{1F964}": "\u5976\u8336 \u996E\u6599 drink cup straw",
  "\u{1F9CB}": "\u73CD\u73E0\u5976\u8336 \u5976\u8336 \u6CE2\u9738 bubble tea boba milk tea",
  "\u{1F376}": "\u6E05\u9152 sake",
  "\u{1F37A}": "\u5564\u9152 \u5E72\u676F beer",
  "\u{1F37B}": "\u5E72\u676F \u5564\u9152 \u78B0\u676F cheers beer clink",
  "\u{1F942}": "\u9999\u69DF \u5E86\u795D \u5E72\u676F champagne cheers toast",
  "\u{1F377}": "\u7EA2\u9152 \u8461\u8404\u9152 wine red",
  "\u{1F943}": "\u5A01\u58EB\u5FCC\u9152\u676F tumbler glass",
  "\u{1F378}": "\u9E21\u5C3E\u9152 cocktail martini",
  "\u{1F379}": "\u996E\u6599 \u70ED\u5E26 tropical drink",
  "\u{1F37E}": "\u9999\u69DF\u74F6 bottle with popping cork",
  "\u{1F9CA}": "\u51B0 \u51B0\u5757 ice cube",
  "\u{1F944}": "\u52FA\u5B50 spoon",
  "\u{1F52A}": "\u5200 kitchen knife",
  "\u{1F3FA}": "\u53CC\u8033\u74F6 amphora",
  "\u{1F30D}": "\u5730\u7403 \u6B27\u6D32\u975E\u6D32 earth globe europe-africa",
  "\u{1F30E}": "\u5730\u7403 \u7F8E\u6D32 earth globe americas",
  "\u{1F30F}": "\u5730\u7403 \u4E9A\u6D32\u6FB3\u6D32 earth globe asia-australia",
  "\u{1F310}": "\u5E26\u5B50\u5348\u7EBF\u7684\u5730\u7403 globe with meridians",
  "\u{1F5FA}\uFE0F": "\u4E16\u754C\u5730\u56FE world map",
  "\u{1F5FE}": "\u65E5\u672C\u5730\u56FE map of japan",
  "\u{1F9ED}": "\u6307\u5357\u9488 compass",
  "\u{1F3D4}\uFE0F": "\u96EA\u5C71 mountain snow capped",
  "\u26F0\uFE0F": "\u5C71 mountain",
  "\u{1F30B}": "\u706B\u5C71 volcano",
  "\u{1F5FB}": "\u5BCC\u58EB\u5C71 mount fuji",
  "\u{1F3D5}\uFE0F": "\u9732\u8425 camping",
  "\u{1F3D6}\uFE0F": "\u6C99\u6EE9\u4F1E \u6D77\u6EE9 beach with umbrella",
  "\u{1F3DC}\uFE0F": "\u6C99\u6F20 desert",
  "\u{1F3DD}\uFE0F": "\u8352\u5C9B desert island",
  "\u{1F3DE}\uFE0F": "\u56FD\u5BB6\u516C\u56ED national park",
  "\u{1F3DF}\uFE0F": "\u4F53\u80B2\u9986 stadium",
  "\u{1F3DB}\uFE0F": "\u53E4\u5178\u5EFA\u7B51 classical building",
  "\u{1F3D7}\uFE0F": "\u5EFA\u7B51\u5DE5\u5730 building construction",
  "\u{1F9F1}": "\u7816 brick",
  "\u{1FAA8}": "\u5CA9\u77F3 rock",
  "\u{1FAB5}": "\u6728\u5934 wood",
  "\u{1F6D6}": "\u5C0F\u5C4B hut",
  "\u{1F3D8}\uFE0F": "\u623F\u5C4B\u5EFA\u7B51\u7FA4 houses",
  "\u{1F3DA}\uFE0F": "\u5E9F\u5F03\u7684\u623F\u5C4B derelict house",
  "\u{1F3E0}": "\u5BB6 \u623F\u5B50 \u623F\u5C4B home house",
  "\u{1F3E1}": "\u522B\u5885 \u82B1\u56ED house garden",
  "\u{1F3E2}": "\u529E\u516C\u697C \u516C\u53F8 \u4E0A\u73ED office building work",
  "\u{1F3E3}": "\u65E5\u672C\u90AE\u5C40 japanese post office",
  "\u{1F3E4}": "\u90AE\u5C40 post office",
  "\u{1F3E5}": "\u533B\u9662 \u770B\u75C5 hospital",
  "\u{1F3E6}": "\u94F6\u884C bank",
  "\u{1F3E8}": "\u9152\u5E97 \u5BBE\u9986 \u4F4F hotel",
  "\u{1F3E9}": "\u7231\u60C5\u65C5\u9986 love hotel",
  "\u{1F492}": "\u5A5A\u793C\u6559\u5802 wedding",
  "\u{1F3EC}": "\u767E\u8D27\u5546\u5E97 department store",
  "\u{1F3ED}": "\u5DE5\u5382 factory",
  "\u{1F3EF}": "\u65E5\u672C\u57CE\u5821 japanese castle",
  "\u{1F3F0}": "\u6B27\u6D32\u57CE\u5821 european castle",
  "\u{1F488}": "\u7406\u53D1\u5E97 barber pole",
  "\u{1F682}": "\u84B8\u6C7D\u706B\u8F66 locomotive",
  "\u{1F683}": "\u6709\u8F68\u7535\u8F66 railway car",
  "\u{1F684}": "\u9AD8\u94C1 \u5B50\u5F39\u5934\u5217\u8F66 high-speed train",
  "\u{1F685}": "\u5B50\u5F39\u5934\u5217\u8F66 bullet train",
  "\u{1F686}": "\u706B\u8F66 train",
  "\u{1F687}": "\u5730\u94C1 subway",
  "\u{1F688}": "\u8F7B\u8F68 light rail",
  "\u{1F689}": "\u8F66\u7AD9 station",
  "\u{1F68A}": "\u6709\u8F68\u7535\u8F66 tram",
  "\u{1F69D}": "\u5355\u8F68 monorail",
  "\u{1F69E}": "\u5C71\u533A\u94C1\u8DEF mountain railway",
  "\u{1F68B}": "\u6709\u8F68\u7535\u8F66 tram car",
  "\u{1F68D}": "\u8FCE\u9762\u800C\u6765\u7684\u516C\u4EA4\u8F66 oncoming bus",
  "\u{1F694}": "\u8FCE\u9762\u800C\u6765\u7684\u8B66\u8F66 oncoming police car",
  "\u{1F696}": "\u8FCE\u9762\u800C\u6765\u7684\u51FA\u79DF\u8F66 oncoming taxi",
  "\u{1F698}": "\u8FCE\u9762\u800C\u6765\u7684\u6C7D\u8F66 oncoming automobile",
  "\u{1F6CE}\uFE0F": "\u670D\u52A1\u94C3 bellhop bell",
  "\u{1F9F3}": "\u884C\u674E luggage",
  "\u{1F311}": "\u65B0\u6708 new moon",
  "\u{1F312}": "\u5A25\u7709\u6708 waxing crescent moon",
  "\u{1F313}": "\u4E0A\u5F26\u6708 first quarter moon",
  "\u{1F314}": "\u76C8\u51F8\u6708 waxing gibbous moon",
  "\u{1F315}": "\u6EE1\u6708 full moon",
  "\u{1F316}": "\u4E8F\u51F8\u6708 waning gibbous moon",
  "\u{1F317}": "\u4E0B\u5F26\u6708 last quarter moon",
  "\u{1F318}": "\u6B8B\u6708 waning crescent moon",
  "\u{1F319}": "\u5F2F\u6708 crescent moon",
  "\u{1F31A}": "\u65B0\u6708\u8138 new moon face",
  "\u{1F31B}": "\u4E0A\u5F26\u6708\u8138 first quarter moon face",
  "\u{1F31C}": "\u4E0B\u5F26\u6708\u8138 last quarter moon face",
  "\u2600\uFE0F": "\u592A\u9633 \u6674\u5929 sun",
  "\u{1F31D}": "\u6EE1\u6708\u8138 full moon face",
  "\u{1F31E}": "\u592A\u9633\u8138 sun with face",
  "\u{1FA90}": "\u884C\u661F ringed planet",
  "\u2601\uFE0F": "\u4E91 cloud",
  "\u26C5": "\u591A\u4E91 partly sunny",
  "\u26C8\uFE0F": "\u96F7\u96E8 cloud with lightning and rain",
  "\u{1F324}\uFE0F": "\u6674\u95F4\u591A\u4E91 sun behind small cloud",
  "\u{1F325}\uFE0F": "\u591A\u4E91 sun behind large cloud",
  "\u{1F326}\uFE0F": "\u6674\u8F6C\u96E8 sun behind rain cloud",
  "\u{1F327}\uFE0F": "\u96E8 cloud with rain",
  "\u{1F328}\uFE0F": "\u4E0B\u96EA cloud with snow",
  "\u{1F329}\uFE0F": "\u6253\u96F7 cloud with lightning",
  "\u{1F32A}\uFE0F": "\u9F99\u5377\u98CE tornado",
  "\u{1F32B}\uFE0F": "\u6709\u96FE fog",
  "\u{1F32C}\uFE0F": "\u522E\u98CE wind face",
  "\u{1F300}": "\u53F0\u98CE cyclone",
  "\u{1F308}": "\u5F69\u8679 rainbow",
  "\u{1F302}": "\u6536\u8D77\u7684\u4F1E closed umbrella",
  "\u2602\uFE0F": "\u96E8\u4F1E umbrella",
  "\u2614": "\u96E8\u4F1E\u5E26\u96E8\u6EF4 umbrella with rain drops",
  "\u26A1": "\u95EA\u7535 high voltage",
  "\u2744\uFE0F": "\u96EA\u82B1 snowflake",
  "\u2603\uFE0F": "\u96EA\u4EBA snowman",
  "\u26C4": "\u96EA\u4EBA \u6CA1\u6709\u96EA snowman without snow",
  "\u2604\uFE0F": "\u5F57\u661F comet",
  "\u{1F4A7}": "\u6C34\u6EF4 droplet",
  "\u{1F30A}": "\u6D77\u6D6A water wave",
  "\u{1F384}": "\u5723\u8BDE\u6811 christmas tree",
  "\u{1F38B}": "\u4E03\u5915\u6811 tanabata tree",
  "\u{1F38D}": "\u95E8\u677E pine decoration",
  "\u{1F34F}": "\u9752\u82F9\u679C green apple",
  "\u{1F344}": "\u8611\u83C7 mushroom",
  "\u{1F95C}": "\u82B1\u751F peanuts",
  "\u{1F330}": "\u6817\u5B50 chestnut",
  "\u{1FAD3}": "\u6241\u9762\u5305 flatbread",
  "\u{1F9C9}": "\u9A6C\u9EDB\u8336 mate drink",
  "\u{1F962}": "\u7B77\u5B50 chopsticks",
  "\u{1F37D}\uFE0F": "\u9910\u5177\u53C9\u5200\u76D8 fork and knife with plate",
  "\u{1F374}": "\u5200\u53C9 fork and knife",
  "\u{1F5FC}": "\u4E1C\u4EAC\u5854 tokyo tower",
  "\u{1F5FD}": "\u81EA\u7531\u5973\u795E\u50CF statue of liberty",
  "\u26EA": "\u6559\u5802 church",
  "\u{1F54C}": "\u6E05\u771F\u5BFA mosque",
  "\u{1F6D5}": "\u5370\u5EA6\u795E\u5E99 hindu temple",
  "\u{1F54D}": "\u72B9\u592A\u6559\u5802 synagogue",
  "\u26E9\uFE0F": "\u795E\u793E shinto shrine",
  "\u{1F54B}": "\u514B\u5C14\u767D kaaba",
  "\u26F2": "\u55B7\u6CC9 fountain",
  "\u26FA": "\u5E10\u7BF7 tent",
  "\u2668\uFE0F": "\u6E29\u6CC9 hot springs",
  "\u{1F3A0}": "\u65CB\u8F6C\u6728\u9A6C carousel horse",
  "\u{1F3A1}": "\u6469\u5929\u8F6E ferris wheel",
  "\u{1F3A2}": "\u8FC7\u5C71\u8F66 roller coaster",
  "\u{1F383}": "\u5357\u74DC\u706F jack-o-lantern",
  "\u{1F9E8}": "\u97AD\u70AE firecracker",
  "\u{1F388}": "\u6C14\u7403 balloon",
  "\u{1F389}": "\u62C9\u70AE \u5E86\u795D party popper",
  "\u{1F38A}": "\u5F69\u7403 confetti ball",
  "\u{1F38E}": "\u65E5\u672C dolls",
  "\u{1F38F}": "\u9CA4\u9C7C\u65D7 carp streamer",
  "\u{1F390}": "\u98CE\u94C3 wind chime",
  "\u{1F9E7}": "\u7EA2\u5305 red envelope",
  "\u{1F380}": "\u8774\u8776\u7ED3 ribbon",
  "\u{1F381}": "\u793C\u7269 wrapped gift",
  "\u{1F94E}": "\u5792\u7403 softball",
  "\u{1F94F}": "\u98DE\u76D8 flying disc",
  "\u{1F3B3}": "\u4FDD\u9F84\u7403 bowling",
  "\u{1F3CF}": "\u677F\u7403 cricket game",
  "\u{1F3D1}": "\u66F2\u68CD\u7403 field hockey",
  "\u{1F3D2}": "\u51B0\u7403 ice hockey",
  "\u{1F94D}": "\u957F\u66F2\u68CD\u7403 lacrosse",
  "\u{1F945}": "\u7403\u95E8 goal net",
  "\u{1FA80}": "\u60A0\u60A0\u7403 yo-yo",
  "\u{1FA81}": "\u98CE\u7B5D kite",
  "\u{1F52E}": "\u6C34\u6676\u7403 crystal ball",
  "\u{1FA84}": "\u9B54\u68D2 magic wand",
  "\u{1F9FF}": "\u7EB3\u624E\u5C14\u62A4\u8EAB\u7B26 nazar amulet",
  "\u{1FAAB}": "\u4F4E\u7535\u91CF\u7535\u6C60 low battery",
  "\u{1F3E7}": "ATM atm sign",
  "\u{1F6AE}": "\u5012\u5783\u573E litter in bin sign",
  "\u{1F6B0}": "\u996E\u7528\u6C34 potable water",
  "\u267F": "\u8F6E\u6905\u6807\u8BC6 wheelchair symbol",
  "\u{1F6B9}": "\u7537\u5395 men's room",
  "\u{1F6BA}": "\u5973\u5395 women's room",
  "\u{1F6BB}": "\u6D17\u624B\u95F4 restroom",
  "\u{1F6BC}": "\u5A74\u513F\u7B26\u53F7 baby symbol",
  "\u{1F6BE}": "\u5395\u6240 water closet",
  "\u{1F6C2}": "\u62A4\u7167\u68C0\u67E5 passport control",
  "\u{1F6C3}": "\u6D77\u5173 customs",
  "\u{1F6C4}": "\u884C\u674E\u9886\u53D6 baggage claim",
  "\u{1F6C5}": "\u884C\u674E\u5BC4\u5B58 left luggage",
  "\u26A0\uFE0F": "\u8B66\u544A warning",
  "\u{1F6B8}": "\u513F\u7AE5\u8FC7\u8857 children crossing",
  "\u26D4": "\u7981\u6B62\u8FDB\u5165 no entry",
  "\u{1F6AB}": "\u7981\u6B62 prohibited",
  "\u{1F6B3}": "\u7981\u6B62\u81EA\u884C\u8F66 no bicycles",
  "\u{1F6AD}": "\u7981\u6B62\u5438\u70DF no smoking",
  "\u{1F6AF}": "\u7981\u6B62\u4E71\u6254\u5783\u573E no littering",
  "\u{1F6B1}": "\u975E\u996E\u7528\u6C34 non-potable water",
  "\u{1F6B7}": "\u7981\u6B62\u884C\u4EBA no pedestrians",
  "\u{1F4F5}": "\u7981\u6B62\u4F7F\u7528\u624B\u673A no mobile phones",
  "\u{1F51E}": "\u672A\u6210\u5E74\u4EBA\u4E0D\u5B9C no one under eighteen",
  "\u2622\uFE0F": "\u8F90\u5C04 radioactive",
  "\u2623\uFE0F": "\u751F\u7269\u5371\u5BB3 biohazard",
  "\u2B06\uFE0F": "\u5411\u4E0A\u7BAD\u5934 up arrow",
  "\u2197\uFE0F": "\u53F3\u4E0A\u7BAD\u5934 up-right arrow",
  "\u27A1\uFE0F": "\u5411\u53F3\u7BAD\u5934 right arrow",
  "\u2198\uFE0F": "\u53F3\u4E0B\u7BAD\u5934 down-right arrow",
  "\u2B07\uFE0F": "\u5411\u4E0B\u7BAD\u5934 down arrow",
  "\u2199\uFE0F": "\u5DE6\u4E0B\u7BAD\u5934 down-left arrow",
  "\u2B05\uFE0F": "\u5411\u5DE6\u7BAD\u5934 left arrow",
  "\u2196\uFE0F": "\u5DE6\u4E0A\u7BAD\u5934 up-left arrow",
  "\u2195\uFE0F": "\u4E0A\u4E0B\u7BAD\u5934 up-down arrow",
  "\u2194\uFE0F": "\u5DE6\u53F3\u7BAD\u5934 left-right arrow",
  "\u21A9\uFE0F": "\u53F3\u5F2F\u7BAD\u5934 right arrow curving left",
  "\u21AA\uFE0F": "\u5DE6\u5F2F\u7BAD\u5934 left arrow curving right",
  "\u2934\uFE0F": "\u53F3\u4E0A\u5F2F\u7BAD\u5934 right arrow curving up",
  "\u2935\uFE0F": "\u53F3\u4E0B\u5F2F\u7BAD\u5934 right arrow curving down",
  "\u{1F503}": "\u987A\u65F6\u9488\u5782\u76F4\u7BAD\u5934 clockwise vertical arrows",
  "\u{1F504}": "\u9006\u65F6\u9488\u7BAD\u5934\u6309\u94AE counterclockwise arrows button",
  "\u{1F519}": "\u8FD4\u56DE back arrow",
  "\u{1F51A}": "\u7ED3\u675F end arrow",
  "\u{1F51B}": "\u5F00\u901A! on! arrow",
  "\u{1F51C}": "\u9A6C\u4E0A soon arrow",
  "\u{1F51D}": "\u7F6E\u9876 top arrow",
  "\u{1F6D0}": "\u793C\u62DC\u573A\u6240 place of worship",
  "\u269B\uFE0F": "\u539F\u5B50\u7B26\u53F7 atom symbol",
  "\u{1F549}\uFE0F": "\u5965\u59C6 om",
  "\u2721\uFE0F": "\u5927\u536B\u4E4B\u661F star of david",
  "\u2638\uFE0F": "\u6CD5\u8F6E wheel of dharma",
  "\u262F\uFE0F": "\u9634\u9633 yin yang",
  "\u271D\uFE0F": "\u62C9\u4E01\u5341\u5B57\u67B6 latin cross",
  "\u2626\uFE0F": "\u4E1C\u6B63\u6559\u5341\u5B57\u67B6 orthodox cross",
  "\u262A\uFE0F": "\u661F\u6708 star and crescent",
  "\u262E\uFE0F": "\u548C\u5E73 symbol peace",
  "\u{1F54E}": "\u70DB\u53F0 menorah",
  "\u{1F52F}": "\u516D\u89D2\u661F dotted six-pointed star",
  "\u2648": "\u767D\u7F8A\u5EA7 aries",
  "\u2649": "\u91D1\u725B\u5EA7 taurus",
  "\u264A": "\u53CC\u5B50\u5EA7 gemini",
  "\u264B": "\u5DE8\u87F9\u5EA7 cancer",
  "\u264C": "\u72EE\u5B50\u5EA7 leo",
  "\u264D": "\u5BA4\u5973\u5EA7 virgo",
  "\u264E": "\u5929\u79E4\u5EA7 libra",
  "\u264F": "\u5929\u874E\u5EA7 scorpio",
  "\u2650": "\u5C04\u624B\u5EA7 sagittarius",
  "\u2651": "\u6469\u7FAF\u5EA7 capricorn",
  "\u2652": "\u6C34\u74F6\u5EA7 aquarius",
  "\u2653": "\u53CC\u9C7C\u5EA7 pisces",
  "\u26CE": "\u86C7\u592B\u5EA7 ophiuchus",
  "\u{1F500}": "\u968F\u673A\u64AD\u653E\u66F2\u76EE shuffle tracks button",
  "\u{1F501}": "\u91CD\u590D\u64AD\u653E repeat button",
  "\u{1F502}": "\u91CD\u590D\u5355\u66F2 repeat single button",
  "\u25B6\uFE0F": "\u64AD\u653E play button",
  "\u23E9": "\u5FEB\u8FDB fast-forward button",
  "\u23ED\uFE0F": "\u4E0B\u4E00\u66F2 next track button",
  "\u23EF\uFE0F": "\u64AD\u653E\u6216\u6682\u505C play or pause button",
  "\u25C0\uFE0F": "\u540E\u9000 reverse button",
  "\u23EA": "\u5FEB\u9000 fast reverse button",
  "\u23EE\uFE0F": "\u4E0A\u4E00\u66F2 last track button",
  "\u{1F53C}": "\u5411\u4E0A\u4E09\u89D2\u5F62 upwards button",
  "\u23EB": "\u5FEB\u901F\u4E0A\u5347 fast up button",
  "\u{1F53D}": "\u5411\u4E0B\u4E09\u89D2\u5F62 downwards button",
  "\u23EC": "\u5FEB\u901F\u4E0B\u964D fast down button",
  "\u23F8\uFE0F": "\u6682\u505C pause button",
  "\u23F9\uFE0F": "\u505C\u6B62 stop button",
  "\u23FA\uFE0F": "\u5F55\u5236 record button",
  "\u23CF\uFE0F": "\u5F39\u51FA eject button",
  "\u{1F3A6}": "\u7535\u5F71\u9662 cinema",
  "\u{1F505}": "\u4F4E\u4EAE\u5EA6 dim button",
  "\u{1F506}": "\u9AD8\u4EAE\u5EA6 bright button",
  "\u{1F4F6}": "\u4FE1\u53F7 antenna bars",
  "\u{1F4F3}": "\u632F\u52A8\u6A21\u5F0F vibration mode",
  "\u{1F4F4}": "\u5173\u95ED\u624B\u673A mobile phone off",
  "\u2640\uFE0F": "\u5973\u6027\u7B26\u53F7 female sign",
  "\u2642\uFE0F": "\u7537\u6027\u7B26\u53F7 male sign",
  "\u26A7\uFE0F": "\u8DE8\u6027\u522B\u7B26\u53F7 transgender symbol",
  "\u2716\uFE0F": "\u4E58\u53F7 multiply",
  "\u2795": "\u52A0\u53F7 plus",
  "\u2796": "\u51CF\u53F7 minus",
  "\u2797": "\u9664\u53F7 divide",
  "\u267E\uFE0F": "\u65E0\u9650 infinity",
  "\u203C\uFE0F": "\u53CC\u611F\u53F9\u53F7 double exclamation mark",
  "\u2049\uFE0F": "\u611F\u53F9\u95EE\u53F7 exclamation question mark",
  "\u2753": "\u7EA2\u8272\u95EE\u53F7 red question mark",
  "\u2754": "\u767D\u8272\u95EE\u53F7 white question mark",
  "\u2755": "\u767D\u8272\u611F\u53F9\u53F7 white exclamation mark",
  "\u2757": "\u7EA2\u8272\u611F\u53F9\u53F7 red exclamation mark",
  "\u3030\uFE0F": "\u6CE2\u6D6A\u7EBF wavy dash",
  "\u{1F4B1}": "\u8D27\u5E01\u5151\u6362 currency exchange",
  "\u{1F4B2}": " heavy dollar sign",
  "\u2695\uFE0F": "\u533B\u7597\u7B26\u53F7 medical symbol",
  "\u267B\uFE0F": "\u56DE\u6536 recycling symbol",
  "\u269C\uFE0F": "\u767E\u5408\u82B1\u9970 fleur-de-lis",
  "\u{1F530}": "\u65E5\u672C\u521D\u5B66\u8005\u7B26\u53F7 japanese symbol for beginner",
  "\u2B55": "\u7C97\u7A7A\u5FC3\u5706\u5708 heavy large circle",
  "\u2705": "\u767D\u8272\u52FE\u52FE check mark button",
  "\u2611\uFE0F": "\u5E26\u52FE\u7684\u65B9\u6846 check box with check",
  "\u2714\uFE0F": "\u7C97\u52FE check mark",
  "\u274C": "\u53C9\u53F7 cross mark",
  "\u274E": "\u53C9\u53F7\u6309\u94AE cross mark button",
  "\u27B0": "\u5377\u66F2\u73AF curly loop",
  "\u27BF": "\u53CC\u5377\u66F2\u73AF double curly loop",
  "\u303D\uFE0F": "\u90E8\u5206\u4EA4\u66FF\u6807\u8BB0 part alternation mark",
  "\u2733\uFE0F": "\u516B\u89D2\u661F eight-spoked asterisk",
  "\u2734\uFE0F": "\u516B\u89D2\u661F\u53F7 eight-pointed star",
  "\u2747\uFE0F": "\u95EA\u4EAE sparkle",
  "\xA9\uFE0F": "\u7248\u6743 copyright",
  "\xAE\uFE0F": "\u6CE8\u518C\u5546\u6807 registered",
  "\u2122\uFE0F": "\u5546\u6807 trade mark"
};

// src/constants.ts
var DEFAULT_DIARY_TEMPLATE = `### \u5929\u6C14\u4E0E\u5FC3\u60C5
\u5929\u6C14\uFF1A
\u5FC3\u60C5\uFF1A

### \u4ECA\u65E5\u6D3B\u52A8
\u5730\u70B9\uFF1A
\u6D3B\u52A8\uFF1A

### \u996E\u98DF\u8BB0\u5F55
\u65E9\u9910\uFF1A
\u5348\u9910\uFF1A
\u665A\u9910\uFF1A
\u96F6\u98DF/\u6C34\u679C\uFF1A
\u5728\u5BB6\u505A\u996D\uFF1A\u662F/\u5426
\u83DC\u5355\uFF1A
\u8BC4\u4EF7\uFF1A

### \u8FD0\u52A8\u4E0E\u5065\u5EB7
\u8FD0\u52A8\u9879\u76EE\uFF1A
\u8FD0\u52A8\u65F6\u957F\uFF1A
\u7761\u7720\u60C5\u51B5\uFF1A

### \u5B66\u4E60\u4E0E\u6210\u957F


### \u5176\u4ED6\u8BB0\u5F55

`;
function makeDefaultDiaryModules() {
  return [
    {
      id: "weather",
      emoji: "\u2600\uFE0F",
      label: "\u4ECA\u5929\u5929\u6C14",
      placeholder: "\u9009\u4E00\u4E2A\u5929\u6C14\uFF0C\u4E5F\u53EF\u4EE5\u81EA\u5DF1\u5199",
      kind: "quick"
    },
    {
      id: "mood",
      emoji: "\u{1F60A}",
      label: "\u4ECA\u5929\u5FC3\u60C5",
      placeholder: "\u9009\u4E00\u4E2A\u5FC3\u60C5\uFF0C\u4E5F\u53EF\u4EE5\u81EA\u5DF1\u5199",
      kind: "quick"
    },
    {
      id: "todayThing",
      emoji: "\u{1F4DD}",
      label: "\u4ECA\u5929\u6211\u505A\u4E86...",
      placeholder: "\u4F8B\u5982\uFF1A\u6211\u4E0A\u4E86\u6570\u5B66\u8BFE\uFF0C\u8FD8\u753B\u4E86\u753B",
      kind: "multi"
    },
    {
      id: "learnedThing",
      emoji: "\u{1F331}",
      label: "\u4ECA\u5929\u6211\u5B66\u4F1A\u4E86...",
      placeholder: "\u4F8B\u5982\uFF1A\u6211\u5B66\u4F1A\u4E86\u5199\u201C\u6625\u201D\u5B57",
      kind: "multi"
    },
    {
      id: "happyThing",
      emoji: "\u{1F389}",
      label: "\u4ECA\u5929\u6700\u5F00\u5FC3\u7684\u662F...",
      placeholder: "\u4F8B\u5982\uFF1A\u4E0B\u8BFE\u540E\u6211\u548C\u540C\u5B66\u4E00\u8D77\u73A9",
      kind: "multi"
    },
    {
      id: "wantToSay",
      emoji: "\u{1F4AD}",
      label: "\u6211\u8FD8\u60F3\u8BF4...",
      placeholder: "\u53EF\u4EE5\u5199\u60F3\u5BF9\u7238\u7238\u5988\u5988\u6216\u81EA\u5DF1\u8BF4\u7684\u8BDD",
      kind: "multi"
    }
  ];
}
function makeDefaultUser() {
  return {
    id: "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    name: "\u672A\u547D\u540D",
    savePath: "Little Milestones/Daily Records",
    items: [],
    categories: ["\u52A0\u5206\u9879", "\u51CF\u5206\u9879"],
    scoringRules: "",
    diaryTemplate: DEFAULT_DIARY_TEMPLATE,
    diaryModules: makeDefaultDiaryModules(),
    goals: { daily: 10, weekly: 70, monthly: 300 }
  };
}
var DEFAULT_SETTINGS = {
  users: [],
  currentUserId: "",
  doubleTapThresholds: {
    windows: 220,
    mac: 240,
    android: 320,
    ios: 300,
    fallback: 260
  }
};
var DIARY_MARKER = "<!-- DIARY_START -->";

// src/modals/daily-scoring-modal.ts
var import_obsidian7 = require("obsidian");

// src/ui/base-mobile-modal.ts
var import_obsidian = require("obsidian");

// src/utils/platform.ts
function getMobilePlatform() {
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return document.body.classList.contains("is-mobile") ? "mobile-other" : "desktop";
}
function getPlatformKey() {
  const ua = (navigator.userAgent || "").toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/macintosh|mac os x/.test(ua)) return "mac";
  if (/windows/.test(ua)) return "windows";
  return "fallback";
}
function isIOS() {
  return /iphone|ipad|ipod/.test((navigator.userAgent || "").toLowerCase());
}
function isAndroid() {
  return /android/.test((navigator.userAgent || "").toLowerCase());
}
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// src/utils/mobile-keyboard.ts
function setupModalKeyboard(modal) {
  const cEl = modal.containerEl;
  const mEl = modal.modalEl;
  const contentEl = modal.contentEl;
  const platformIsIOS = isIOS();
  const platformIsAndroid = isAndroid();
  const isEditModal = mEl.classList.contains("kid-score-edit-modal");
  let stableViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  let isManualAdjusting = false;
  mEl.style.display = "flex";
  mEl.style.flexDirection = "column";
  mEl.style.overflow = "hidden";
  contentEl.style.flex = "1 1 auto";
  contentEl.style.minHeight = "0";
  contentEl.style.overflowY = "auto";
  contentEl.style.position = "relative";
  contentEl.style.width = "100%";
  contentEl.style["overscrollBehavior"] = "contain";
  contentEl.style["touchAction"] = "pan-y";
  contentEl.style["webkitOverflowScrolling"] = "touch";
  const ensureTargetVisible = (target, extraBottom = 96) => {
    if (!target || !contentEl.contains(target)) return;
    const contentRect = contentEl.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const currentTop = targetRect.top - contentRect.top + contentEl.scrollTop;
    const currentBottom = currentTop + targetRect.height;
    const safeTop = contentEl.scrollTop + 12;
    const safeBottom = contentEl.scrollTop + contentEl.clientHeight - extraBottom;
    if (currentBottom > safeBottom) {
      contentEl.scrollTo({
        top: Math.max(0, currentBottom - contentEl.clientHeight + extraBottom),
        behavior: "smooth"
      });
      return;
    }
    if (currentTop < safeTop) {
      contentEl.scrollTo({
        top: Math.max(0, currentTop - 16),
        behavior: "smooth"
      });
    }
  };
  const readManualOffset = () => parseInt(mEl.dataset.manualModalOffset || "0", 10) || 0;
  const readKeyboardOffset = () => parseInt(mEl.style.getPropertyValue("--keyboard-modal-offset") || "0", 10) || 0;
  const getKeyboardHeight = () => {
    if (!window.visualViewport) return 0;
    const vv = window.visualViewport;
    const raw = Math.max(
      0,
      stableViewportHeight - vv.height - Math.max(0, vv.offsetTop || 0)
    );
    if (raw < 70) {
      stableViewportHeight = Math.max(stableViewportHeight, vv.height);
      return 0;
    }
    return raw;
  };
  const updateModalLift = (keyboardH) => {
    var _a, _b;
    if (!(platformIsIOS && isEditModal)) {
      mEl.style.setProperty("--keyboard-modal-offset", "0px");
      return;
    }
    if (keyboardH <= 80) {
      mEl.style.setProperty("--keyboard-modal-offset", "0px");
      return;
    }
    if (isManualAdjusting) return;
    const desiredBottom = (((_a = window.visualViewport) == null ? void 0 : _a.offsetTop) || 0) + (((_b = window.visualViewport) == null ? void 0 : _b.height) || window.innerHeight) - 8;
    const currentRect = mEl.getBoundingClientRect();
    const currentKeyboardOffset = readKeyboardOffset();
    const nextKeyboardOffset = currentKeyboardOffset + (desiredBottom - currentRect.bottom);
    mEl.style.setProperty("--keyboard-modal-offset", Math.round(nextKeyboardOffset) + "px");
  };
  const applyLayout = () => {
    const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vvTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
    cEl.style.position = "fixed";
    cEl.style.top = vvTop + "px";
    cEl.style.left = "0";
    cEl.style.right = "0";
    cEl.style.bottom = "auto";
    cEl.style.height = vvH + "px";
    if ((platformIsIOS || platformIsAndroid) && window.visualViewport) {
      const keyboardH = getKeyboardHeight();
      updateModalLift(keyboardH);
      if (keyboardH > 80) {
        mEl.style.alignSelf = "flex-start";
        mEl.style.marginTop = "max(12px, env(safe-area-inset-top, 0px))";
        mEl.style.marginBottom = "auto";
        mEl.style.maxHeight = Math.max(220, vvH - 12) + "px";
        if (platformIsIOS && isEditModal) {
          mEl.style.height = Math.max(220, vvH - 12) + "px";
        }
        const extraBottom = isEditModal ? 28 : 18;
        contentEl.style.paddingBottom = Math.round(extraBottom) + "px";
        contentEl.style.scrollPaddingBottom = Math.round(extraBottom + 12) + "px";
      } else {
        mEl.style.alignSelf = "";
        mEl.style.marginTop = "";
        mEl.style.marginBottom = "";
        mEl.style.maxHeight = Math.max(120, vvH - 32) + "px";
        mEl.style.height = "";
        contentEl.style.paddingBottom = "";
        contentEl.style.scrollPaddingBottom = "";
      }
    } else {
      mEl.style.maxHeight = Math.max(120, vvH - 32) + "px";
      mEl.style.height = "";
      updateModalLift(0);
    }
    const focused = document.activeElement;
    if (focused && contentEl.contains(focused)) {
      setTimeout(() => {
        ensureTargetVisible(focused, focused.tagName === "TEXTAREA" ? 98 : isEditModal ? 76 : 56);
      }, platformIsIOS ? 120 : 60);
    }
  };
  const onFocusIn = (e) => {
    const target = e.target;
    if (!target || !contentEl.contains(target)) return;
    const delay = platformIsIOS ? 120 : 80;
    setTimeout(() => {
      applyLayout();
      ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 98 : 72);
    }, delay);
    if (platformIsIOS) {
      setTimeout(() => {
        applyLayout();
        ensureTargetVisible(target, target.tagName === "TEXTAREA" ? 98 : 72);
      }, 380);
    }
  };
  const onVVChange = () => {
    setTimeout(applyLayout, 40);
  };
  const onWinResize = () => {
    setTimeout(applyLayout, 80);
  };
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onVVChange);
    window.visualViewport.addEventListener("scroll", onVVChange);
  }
  const onManualDragStart = () => {
    isManualAdjusting = true;
  };
  const onManualDragEnd = () => {
    isManualAdjusting = false;
  };
  window.addEventListener("resize", onWinResize);
  mEl.addEventListener("focusin", onFocusIn);
  mEl.addEventListener("kid-score:manual-drag-start", onManualDragStart);
  mEl.addEventListener("kid-score:manual-drag-end", onManualDragEnd);
  applyLayout();
  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onVVChange);
      window.visualViewport.removeEventListener("scroll", onVVChange);
    }
    window.removeEventListener("resize", onWinResize);
    mEl.removeEventListener("focusin", onFocusIn);
    mEl.removeEventListener("kid-score:manual-drag-start", onManualDragStart);
    mEl.removeEventListener("kid-score:manual-drag-end", onManualDragEnd);
    cEl.style.position = "";
    cEl.style.top = "";
    cEl.style.left = "";
    cEl.style.right = "";
    cEl.style.bottom = "";
    cEl.style.height = "";
    mEl.style.maxHeight = "";
    mEl.style.height = "";
    mEl.style.display = "";
    mEl.style.flexDirection = "";
    mEl.style.overflow = "";
    mEl.style.transform = "";
    mEl.style.removeProperty("--keyboard-modal-offset");
    mEl.style.removeProperty("--manual-modal-offset");
    delete mEl.dataset.manualModalOffset;
    mEl.style.transition = "";
    mEl.style.alignSelf = "";
    mEl.style.marginTop = "";
    mEl.style.marginBottom = "";
    contentEl.style.flex = "";
    contentEl.style.minHeight = "";
    contentEl.style.overflowY = "";
    contentEl.style.position = "";
    contentEl.style.width = "";
    contentEl.style.paddingBottom = "";
    contentEl.style.scrollPaddingBottom = "";
    contentEl.style["overscrollBehavior"] = "";
    contentEl.style["touchAction"] = "";
    contentEl.style["webkitOverflowScrolling"] = "";
  };
}

// src/utils/mobile.ts
function setupModalKeyboard2(modal) {
  return setupModalKeyboard(modal);
}
function attachModalDragGesture(modal) {
  if (!modal) return null;
  const modalEl = modal.modalEl;
  if (!modalEl) return null;
  let startY = 0;
  let startOffset = 0;
  let dragging = false;
  let minOffset = Number.NEGATIVE_INFINITY;
  let maxOffset = Number.POSITIVE_INFINITY;
  const isInteractiveTarget = (target) => {
    return !!(target && target.closest && target.closest(
      "input, textarea, select, button, .clickable-icon, .modal-close-button"
    ));
  };
  const readOffset = () => parseInt(modalEl.dataset.manualModalOffset || "0", 10) || 0;
  const writeOffset = (next) => {
    const clamped = Math.max(minOffset, Math.min(maxOffset, next));
    modalEl.dataset.manualModalOffset = String(clamped);
    modalEl.style.setProperty("--manual-modal-offset", clamped + "px");
  };
  const updateBounds = () => {
    var _a, _b;
    const currentOffset = readOffset();
    const rect = modalEl.getBoundingClientRect();
    const viewportTop = ((_a = window.visualViewport) == null ? void 0 : _a.offsetTop) || 0;
    const viewportBottom = viewportTop + (((_b = window.visualViewport) == null ? void 0 : _b.height) || window.innerHeight);
    const baseTop = rect.top - currentOffset;
    const baseBottom = rect.bottom - currentOffset;
    minOffset = viewportTop + 8 - baseTop;
    maxOffset = viewportBottom - 8 - baseBottom;
    if (minOffset > maxOffset) {
      const middle = (minOffset + maxOffset) / 2;
      minOffset = middle;
      maxOffset = middle;
    }
  };
  const onTouchStart = (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    if (isInteractiveTarget(e.target)) return;
    const touch = e.touches[0];
    startY = touch.clientY;
    startOffset = readOffset();
    updateBounds();
    dragging = true;
    modalEl.classList.add("is-dragging-position");
    modalEl.dispatchEvent(new CustomEvent("kid-score:manual-drag-start"));
  };
  const onTouchMove = (e) => {
    if (!dragging || !e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    writeOffset(startOffset + deltaY);
    e.preventDefault();
  };
  const onTouchEnd = () => {
    if (!dragging) return;
    dragging = false;
    modalEl.classList.remove("is-dragging-position");
    modalEl.dispatchEvent(new CustomEvent("kid-score:manual-drag-end"));
  };
  modalEl.addEventListener("touchstart", onTouchStart, { passive: true });
  modalEl.addEventListener("touchmove", onTouchMove, { passive: false });
  modalEl.addEventListener("touchend", onTouchEnd, { passive: true });
  modalEl.addEventListener("touchcancel", onTouchEnd, { passive: true });
  return () => {
    modalEl.removeEventListener("touchstart", onTouchStart);
    modalEl.removeEventListener("touchmove", onTouchMove);
    modalEl.removeEventListener("touchend", onTouchEnd);
    modalEl.removeEventListener("touchcancel", onTouchEnd);
    modalEl.classList.remove("is-dragging-position");
  };
}

// src/ui/base-mobile-modal.ts
var BaseMobileModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.mobilePlatform = "desktop";
    this._kbCleanup = null;
    this._dragCleanup = null;
    this.enableKeyboardAdjustment = true;
    this.enableManualDragAdjustment = false;
    this.plugin = plugin;
  }
  onOpen() {
    this.mobilePlatform = getMobilePlatform();
    this.modalEl.toggleClass("is-mobile-ios", this.mobilePlatform === "ios");
    this.modalEl.toggleClass(
      "is-mobile-android",
      this.mobilePlatform === "android"
    );
    this.titleEl.addClass("kid-score-modal-title");
    if (this.enableKeyboardAdjustment && this.mobilePlatform !== "desktop") {
      this._kbCleanup = setupModalKeyboard2(this);
    }
    if (this.enableManualDragAdjustment && this.mobilePlatform !== "desktop") {
      this._dragCleanup = attachModalDragGesture(this);
    }
  }
  onClose() {
    if (this._kbCleanup) {
      this._kbCleanup();
      this._kbCleanup = null;
    }
    if (this._dragCleanup) {
      this._dragCleanup();
      this._dragCleanup = null;
    }
    this.contentEl.empty();
  }
  getLongPressDuration() {
    if (this.mobilePlatform === "ios") return 560;
    if (this.mobilePlatform === "android") return 460;
    return 500;
  }
  triggerHaptic(type) {
    if (this.mobilePlatform !== "android") return;
    if (!navigator.vibrate) return;
    navigator.vibrate(type === "longpress" ? 12 : 8);
  }
};

// src/utils/date.ts
function formatDate(offset = 0) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

// src/modals/panels/stats-panel.ts
function renderStatsPanel(statsBody, plugin, allScores, period) {
  statsBody.empty();
  const filtered = filterScores(period, allScores);
  if (!filtered.length) {
    statsBody.createEl("p", { text: "\u6682\u65E0\u6570\u636E \u{1F4ED}", cls: "kid-score-empty" });
    return;
  }
  const total = filtered.reduce((sum, record) => sum + record.total, 0);
  const avg = Math.round(total / filtered.length * 10) / 10;
  const max = Math.max(...filtered.map((record) => record.total));
  const streak = countPositiveStreak(filtered);
  const positiveDays = filtered.filter((record) => record.total > 0).length;
  const negativeDays = filtered.filter((record) => record.total < 0).length;
  const currentUser = plugin.currentUser;
  const cards = statsBody.createDiv({ cls: "kid-score-summary-cards" });
  renderSummaryCard(cards, "\u7D2F\u8BA1\u603B\u5206", (total >= 0 ? "+" : "") + total, true);
  renderSummaryCard(cards, "\u65E5\u5747\u5206", (avg >= 0 ? "+" : "") + avg);
  renderSummaryCard(cards, "\u6700\u9AD8\u5355\u65E5", "+" + max);
  renderSummaryCard(cards, "\u8BB0\u5F55\u5929\u6570", filtered.length + " \u5929");
  renderSummaryCard(cards, "\u8FDE\u7EED\u6253\u5206", streak + " \u5929");
  renderSummaryCard(cards, "\u6B63\u9762\u5929\u6570", positiveDays + " \u5929");
  renderSummaryCard(cards, "\u8D1F\u9762\u5929\u6570", negativeDays + " \u5929");
  renderGoalCard(cards, currentUser, filtered, period);
  if (currentUser.items.length > 0) {
    renderCategoryCompletion(statsBody, currentUser.items, currentUser.categories || [], filtered);
    renderItemCompletion(statsBody, currentUser.items, filtered);
  }
  statsBody.createEl("h3", { text: "\u6BCF\u65E5\u5F97\u5206\u8D8B\u52BF", cls: "stats-section-title" });
  const chartWrap = statsBody.createDiv({ cls: "kid-score-chart-wrap" });
  const canvas = chartWrap.createEl("canvas", { cls: "kid-score-chart" });
  canvas.width = 540;
  canvas.height = 200;
  setTimeout(() => {
    drawBarChart(canvas, filtered.slice(-20));
  }, 50);
  if (period === "all" && filtered.length > 7) {
    renderMonthlySummary(statsBody, filtered);
  }
}
function filterScores(period, scores) {
  const today = /* @__PURE__ */ new Date();
  if (period === "week") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    return scores.filter((score) => score.date >= weekStart.toISOString().slice(0, 10));
  }
  if (period === "month") {
    const monthStart = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-01";
    return scores.filter((score) => score.date >= monthStart);
  }
  return scores;
}
function renderSummaryCard(cards, label, value, accent = false) {
  const card = cards.createDiv({ cls: "summary-card " + (accent ? "accent" : "") });
  card.createDiv({ cls: "card-val", text: value });
  card.createDiv({ cls: "card-lbl", text: label });
}
function renderGoalCard(cards, currentUser, filtered, period) {
  const goals = currentUser.goals || { daily: 10, weekly: 70, monthly: 300 };
  let goalLabel = "";
  let goalTarget = 0;
  let goalCompleted = 0;
  if (period === "week") {
    goalLabel = "\u672C\u5468\u76EE\u6807";
    goalTarget = goals.weekly;
    goalCompleted = filtered.reduce(
      (sum, day) => sum + calcCompleted(currentUser.items, day),
      0
    );
  } else if (period === "month") {
    goalLabel = "\u672C\u6708\u76EE\u6807";
    goalTarget = goals.monthly;
    goalCompleted = filtered.reduce(
      (sum, day) => sum + calcCompleted(currentUser.items, day),
      0
    );
  }
  if (goalTarget <= 0) return;
  const goalPct = Math.min(100, Math.round(goalCompleted / goalTarget * 100));
  const goalCard = cards.createDiv({ cls: "summary-card goal-card" });
  goalCard.createDiv({ cls: "card-val", text: goalCompleted + "/" + goalTarget });
  goalCard.createDiv({ cls: "card-lbl", text: goalLabel });
  const wrap = goalCard.createDiv({ cls: "summary-goal-bar-wrap" });
  const bar = wrap.createDiv({ cls: "summary-goal-bar" });
  bar.style.width = goalPct + "%";
  if (goalPct >= 100) bar.addClass("is-complete");
}
function calcCompleted(items, day) {
  let completed = (day.customItems || []).length;
  for (const item of items) {
    const val = day.scores[item.id] || 0;
    const isDeduct = item.category === "\u51CF\u5206" || item.points < 0;
    if (isDeduct ? val !== 0 : val > 0) completed++;
  }
  return completed;
}
function renderCategoryCompletion(statsBody, items, categories, filtered) {
  const categoryStats = {};
  categories.forEach((category) => {
    categoryStats[category] = { total: 0, completed: 0 };
  });
  for (const item of items) {
    const category = item.category || "\u5176\u4ED6";
    if (!categoryStats[category]) categoryStats[category] = { total: 0, completed: 0 };
    categoryStats[category].total++;
    const count = filtered.filter(
      (day) => day.scores[item.id] !== void 0 && isItemDone(item, day.scores[item.id])
    ).length;
    categoryStats[category].completed += count;
  }
  statsBody.createEl("h3", { text: "\u5206\u7C7B\u5B8C\u6210\u7387", cls: "stats-section-title" });
  const list = statsBody.createDiv({ cls: "kid-score-item-completion" });
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const rate = Math.round(stats.completed / (stats.total * filtered.length) * 100);
    const row = list.createDiv({ cls: "completion-row" });
    row.createSpan({ cls: "completion-emoji", text: "\u{1F4CB}" });
    row.createSpan({ cls: "completion-name", text: category });
    const wrap = row.createDiv({ cls: "completion-bar-wrap" });
    const bar = wrap.createDiv({ cls: "completion-bar pos" });
    bar.style.width = rate + "%";
    row.createSpan({ cls: "completion-rate", text: rate + "%" });
  });
}
function renderItemCompletion(statsBody, items, filtered) {
  statsBody.createEl("h3", { text: "\u5404\u9879\u76EE\u5B8C\u6210\u7387", cls: "stats-section-title" });
  const itemList = statsBody.createDiv({ cls: "kid-score-item-completion" });
  for (const item of items) {
    const itemHistory = filtered.slice().sort((a, b) => a.date.localeCompare(b.date)).map((day) => day.scores[item.id] || 0);
    const count = filtered.filter(
      (day) => day.scores[item.id] !== void 0 && isItemDone(item, day.scores[item.id])
    ).length;
    const rate = Math.round(count / filtered.length * 100);
    const rowWrap = itemList.createDiv({ cls: "completion-row-wrap" });
    const row = rowWrap.createDiv({ cls: "completion-row" });
    row.createSpan({ cls: "completion-emoji", text: item.emoji });
    row.createSpan({ cls: "completion-name", text: item.name });
    const wrap = row.createDiv({ cls: "completion-bar-wrap" });
    const bar = wrap.createDiv({
      cls: "completion-bar " + (item.points >= 0 ? "pos" : "neg")
    });
    bar.style.width = rate + "%";
    row.createSpan({
      cls: "completion-rate",
      text: count + "/" + filtered.length + " (" + rate + "%)"
    });
    const sparkWrap = rowWrap.createDiv({ cls: "sparkline-wrap is-hidden" });
    const canvas = sparkWrap.createEl("canvas", { cls: "sparkline-canvas" });
    canvas.width = 300;
    canvas.height = 48;
    row.onclick = () => {
      const wasHidden = sparkWrap.hasClass("is-hidden");
      itemList.querySelectorAll(".sparkline-wrap").forEach((el) => {
        el.addClass("is-hidden");
      });
      if (wasHidden) {
        sparkWrap.removeClass("is-hidden");
        drawSparkline(
          canvas,
          itemHistory.slice(-30),
          item.category === "\u51CF\u5206" || item.points < 0
        );
      }
    };
  }
}
function renderMonthlySummary(statsBody, filtered) {
  statsBody.createEl("h3", { text: "\u6309\u6708\u6C47\u603B", cls: "stats-section-title" });
  const byMonth = {};
  for (const day of filtered) {
    const month = day.date.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(day.total);
  }
  const wrap = statsBody.createDiv({ cls: "kid-score-month-table-wrap" });
  const table = wrap.createEl("table", { cls: "kid-score-month-table" });
  const th = table.createEl("thead").createEl("tr");
  ["\u6708\u4EFD", "\u5929\u6570", "\u603B\u5206", "\u65E5\u5747"].forEach((header) => {
    th.createEl("th", { text: header });
  });
  const tbody = table.createEl("tbody");
  Object.entries(byMonth).sort().forEach(([month, values]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / values.length);
    const tr = tbody.createEl("tr");
    tr.createEl("td", { text: month });
    tr.createEl("td", { text: String(values.length) });
    tr.createEl("td", { text: (sum >= 0 ? "+" : "") + sum });
    tr.createEl("td", { text: (avg >= 0 ? "+" : "") + avg });
  });
}
function isItemDone(item, val) {
  const isDeduct = item.category === "\u51CF\u5206" || item.points < 0;
  return isDeduct ? val !== 0 : val > 0;
}
function countPositiveStreak(filtered) {
  let streak = 0;
  const sortedScores = filtered.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
  for (const score of sortedScores) {
    if (score.total > 0) streak++;
    else break;
  }
  return streak;
}
function drawBarChart(canvas, data) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !data.length) return;
  const width = canvas.width;
  const height = canvas.height;
  const pad = { top: 24, bottom: 32, left: 8, right: 8 };
  const chartHeight = height - pad.top - pad.bottom;
  const midY = pad.top + chartHeight * 0.6;
  const maxAbs = Math.max(...data.map((score) => Math.abs(score.total)).concat([1]));
  const barWidth = Math.max(
    Math.floor((width - pad.left - pad.right) / data.length) - 4,
    6
  );
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, midY);
  ctx.lineTo(width - pad.right, midY);
  ctx.stroke();
  ctx.setLineDash([]);
  data.forEach((score, index) => {
    const x = pad.left + index * (barWidth + 4);
    const pixPer = chartHeight * 0.55 / maxAbs;
    const barHeight = Math.abs(score.total) * pixPer;
    const isPositive = score.total >= 0;
    ctx.fillStyle = isPositive ? "#4ade80" : "#f87171";
    ctx.fillRect(x, isPositive ? midY - barHeight : midY, barWidth, barHeight);
    ctx.fillStyle = "#333";
    ctx.font = "bold " + Math.min(11, barWidth) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      String(score.total),
      x + barWidth / 2,
      isPositive ? midY - barHeight - 4 : midY + barHeight + 12
    );
    ctx.font = "9px sans-serif";
    ctx.fillStyle = "#999";
    ctx.fillText(score.date.slice(5), x + barWidth / 2, height - 4);
  });
}
function drawSparkline(canvas, data, isDeduct) {
  const ctx = canvas.getContext("2d");
  if (!ctx || data.length === 0) return;
  const width = canvas.width;
  const height = canvas.height;
  const pad = 4;
  const maxAbs = Math.max(...data.map((value) => Math.abs(value)), 1);
  const step = data.length > 1 ? (width - pad * 2) / (data.length - 1) : 0;
  const baselineY = height / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = isDeduct ? "#f87171" : "#4ade80";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = pad + index * step;
    const y = baselineY - value / maxAbs * (baselineY - pad);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = isDeduct ? "#f87171" : "#4ade80";
  data.forEach((value, index) => {
    const x = pad + index * step;
    const y = baselineY - value / maxAbs * (baselineY - pad);
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// src/modals/stats-modal.ts
var StatsModal = class extends BaseMobileModal {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  async onOpen() {
    super.onOpen();
    const contentEl = this.contentEl;
    contentEl.empty();
    contentEl.addClass("kid-score-modal", "kid-score-stats-modal");
    contentEl.createEl("h2", { text: "\u{1F4CA} " + this.plugin.currentUser.name + " \u7684\u6253\u5206\u7EDF\u8BA1" });
    const allScores = await this.plugin.getAllScores();
    if (allScores.length === 0) {
      contentEl.createEl("p", { text: "\u{1F4ED} \u6682\u65E0\u6570\u636E", cls: "kid-score-empty" });
      return;
    }
    const grandTotal = allScores.reduce((s, r) => s + r.total, 0);
    const grandDays = allScores.length;
    const grandAvg = Math.round(grandTotal / grandDays);
    const gtSign = grandTotal >= 0 ? "+" : "";
    const gaSign = grandAvg >= 0 ? "+" : "";
    const grandBanner = contentEl.createDiv({ cls: "kid-score-grand-banner" });
    const gl = grandBanner.createDiv({ cls: "grand-left" });
    gl.createDiv({ cls: "grand-total-value", text: gtSign + grandTotal });
    gl.createDiv({ cls: "grand-total-label", text: "\u5386\u53F2\u7D2F\u8BA1\u603B\u5206" });
    const gr = grandBanner.createDiv({ cls: "grand-right" });
    gr.createDiv({ text: "\u{1F4C5} \u8BB0\u5F55 " + grandDays + " \u5929", cls: "grand-stat" });
    gr.createDiv({ text: "\u{1F4C8} \u65E5\u5747 " + gaSign + grandAvg + " \u5206", cls: "grand-stat" });
    gr.createDiv({ text: "\u{1F5D3}\uFE0F \u8D77\u59CB " + allScores[0].date, cls: "grand-stat" });
    const tabs = contentEl.createDiv({ cls: "kid-score-tabs" });
    const statsBody = contentEl.createDiv({ cls: "kid-score-stats-body" });
    const periods = [
      { label: "\u672C\u5468", key: "week" },
      { label: "\u672C\u6708", key: "month" },
      { label: "\u5168\u90E8", key: "all" }
    ];
    let activePeriod = "week";
    const renderStats = (period) => {
      renderStatsPanel(statsBody, this.plugin, allScores, period);
    };
    for (const p of periods) {
      ((period) => {
        const tab = tabs.createEl("button", {
          text: period.label,
          cls: "kid-score-tab " + (period.key === activePeriod ? "is-active" : "")
        });
        tab.onclick = () => {
          activePeriod = period.key;
          tabs.querySelectorAll(".kid-score-tab").forEach((t) => {
            t.removeClass("is-active");
          });
          tab.addClass("is-active");
          renderStats(activePeriod);
        };
      })(p);
    }
    renderStats(activePeriod);
  }
  onClose() {
    super.onClose();
  }
};

// src/modals/popups/calendar-picker.ts
function openCalendarPicker({
  currentDate,
  recordDates,
  onSelect
}) {
  const overlay = document.createElement("div");
  overlay.className = "kid-score-value-overlay";
  const popup = document.createElement("div");
  popup.className = "kid-score-calendar-popup";
  let viewDate = /* @__PURE__ */ new Date(currentDate + "T00:00:00");
  const header = popup.createDiv({ cls: "cal-header" });
  const prevMonthBtn = header.createEl("button", { cls: "cal-nav-btn", text: "\u25C0" });
  const monthLabel = header.createEl("span", { cls: "cal-month-label" });
  const nextMonthBtn = header.createEl("button", { cls: "cal-nav-btn", text: "\u25B6" });
  const grid = popup.createDiv({ cls: "cal-grid" });
  ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"].forEach((d) => {
    grid.createEl("div", { cls: "cal-weekday", text: d });
  });
  const removeOverlay = () => {
    var _a;
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
    if ((_a = history.state) == null ? void 0 : _a.kidScoreOverlay) {
      history.back();
    }
  };
  const renderMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = year + "\u5E74" + (month + 1) + "\u6708";
    grid.querySelectorAll(".cal-day").forEach((el) => el.remove());
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const todayStr = formatDate(0);
    for (let i = 0; i < startOffset; i++) {
      grid.createEl("div", { cls: "cal-day is-empty" });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const ds = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      const cell = grid.createEl("button", { cls: "cal-day" });
      cell.textContent = String(d);
      if (ds === currentDate) cell.addClass("is-selected");
      if (ds === todayStr) cell.addClass("is-today");
      if (recordDates.has(ds)) cell.addClass("has-record");
      cell.onclick = () => {
        if (ds > todayStr) return;
        onSelect(ds);
        removeOverlay();
      };
    }
  };
  prevMonthBtn.onclick = () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderMonth();
  };
  nextMonthBtn.onclick = () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderMonth();
  };
  renderMonth();
  const cancelBtn = popup.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
  cancelBtn.style.marginTop = "10px";
  cancelBtn.style.width = "100%";
  cancelBtn.onclick = () => {
    removeOverlay();
  };
  popup.appendChild(cancelBtn);
  overlay.appendChild(popup);
  const onPopstate = (e) => {
    var _a;
    if ((_a = e.state) == null ? void 0 : _a.kidScoreOverlay) {
      overlay.remove();
      window.removeEventListener("popstate", onPopstate);
    }
  };
  history.pushState({ kidScoreOverlay: true }, "");
  window.addEventListener("popstate", onPopstate);
  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      removeOverlay();
    }
  });
  document.body.appendChild(overlay);
}

// src/modals/panels/diary-panel.ts
var import_obsidian2 = require("obsidian");

// src/utils/dom.ts
function getOverlayMount(containerEl) {
  return document.body.classList.contains("is-mobile") ? document.body : containerEl || document.body;
}
function bindModalInputFocus(input, options = {}) {
  if (!input) return;
  const inp = input;
  const isTouch = isTouchDevice();
  const platformIsIOS = isIOS();
  const {
    manualTouchFocus = true,
    scrollOnIOSFocus = true
  } = options;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  if (inp.tagName === "INPUT" && inp.type === "number") {
    inp.setAttribute("inputmode", "numeric");
  }
  input.setAttribute("tabindex", "0");
  input.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  if (isTouch) {
    input.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      touchStartX = touch ? touch.clientX : 0;
      touchStartY = touch ? touch.clientY : 0;
      touchMoved = false;
      e.stopPropagation();
    }, { passive: true });
    input.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      if (Math.abs(touch.clientX - touchStartX) > 8 || Math.abs(touch.clientY - touchStartY) > 8) {
        touchMoved = true;
      }
    }, { passive: true });
    input.addEventListener("touchend", (e) => {
      e.stopPropagation();
      if (!manualTouchFocus || touchMoved) return;
      inp.focus();
    });
  }
  const setIOSKeyboardFocusState = (on) => {
    if (!platformIsIOS) return;
    const modal = input.closest(".kid-score-edit-modal, .kid-score-import-modal");
    const scroller = input.closest(".modal-content");
    if (!modal || !scroller) return;
    modal.classList.toggle("has-ios-keyboard-focus", on);
    if (on) {
      const target = input;
      const forceScroll = () => {
        const scrollerRect = scroller.getBoundingClientRect();
        const inputRect = target.getBoundingClientRect();
        const inputTop = inputRect.top - scrollerRect.top + scroller.scrollTop;
        const desiredTop = Math.max(
          0,
          inputTop - Math.max(16, scroller.clientHeight * 0.1)
        );
        scroller.scrollTo({ top: desiredTop, behavior: "smooth" });
      };
      setTimeout(forceScroll, 80);
      setTimeout(forceScroll, 260);
      setTimeout(forceScroll, 520);
      setTimeout(forceScroll, 860);
    }
  };
  input.addEventListener("focus", () => {
    if (!scrollOnIOSFocus) return;
    if (!platformIsIOS) return;
    setIOSKeyboardFocusState(true);
    const scrollWithinModal = () => {
      const scroller = input.closest(".modal-content");
      if (!scroller) {
        if (input.scrollIntoView) input.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      const scrollerRect = scroller.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      const inputTop = inputRect.top - scrollerRect.top + scroller.scrollTop;
      const desiredTop = Math.max(
        0,
        inputTop - Math.max(18, scroller.clientHeight * 0.12)
      );
      scroller.scrollTo({ top: desiredTop, behavior: "smooth" });
    };
    const doScroll = (delay) => {
      setTimeout(() => {
        scrollWithinModal();
      }, delay);
    };
    doScroll(400);
    doScroll(650);
  });
  input.addEventListener("blur", () => {
    if (!platformIsIOS) return;
    setTimeout(() => {
      const active = document.activeElement;
      if (active && active.closest && active.closest(".kid-score-edit-modal, .kid-score-import-modal") === input.closest(".kid-score-edit-modal, .kid-score-import-modal")) {
        return;
      }
      setIOSKeyboardFocusState(false);
    }, 180);
  });
}

// src/ui/emoji-picker-search.ts
function getEmojiCategoryKeys() {
  return Object.keys(EMOJI_DATA);
}
function getEmojiCategoryItems(key) {
  return EMOJI_DATA[key] || [];
}
function searchEmojis(query, categoryKeys) {
  const q = query.toLowerCase();
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const emoji in EMOJI_SEARCH) {
    if (EMOJI_SEARCH[emoji].includes(q) && !seen.has(emoji)) {
      results.push(emoji);
      seen.add(emoji);
    }
  }
  if (results.length === 0) {
    for (const key of categoryKeys) {
      if (key.toLowerCase().includes(q)) {
        for (const emoji of getEmojiCategoryItems(key)) {
          if (!seen.has(emoji)) {
            results.push(emoji);
            seen.add(emoji);
          }
        }
      }
    }
  }
  return results;
}

// src/ui/emoji-picker.ts
function showEmojiPicker(callback, container) {
  const overlay = document.createElement("div");
  overlay.className = "kid-score-value-overlay";
  const popup = document.createElement("div");
  popup.className = "kid-score-emoji-fullpicker";
  const header = document.createElement("div");
  header.className = "emoji-fp-header";
  header.textContent = "\u9009\u62E9\u56FE\u6807";
  popup.appendChild(header);
  const customRow = document.createElement("div");
  customRow.className = "emoji-fp-custom";
  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "\u641C\u7D22\uFF1A\u8F93\u5165\u4E2D\u6587\u5173\u952E\u5B57\u6216\u76F4\u63A5\u8F93\u5165emoji...";
  customInput.maxLength = 32;
  customInput.className = "emoji-fp-input";
  customInput.setAttribute("inputmode", "text");
  bindModalInputFocus(customInput);
  const customConfirm = document.createElement("button");
  customConfirm.className = "value-popup-confirm mod-cta";
  customConfirm.textContent = "\u786E\u5B9A";
  customConfirm.style.padding = "6px 16px";
  const removeOverlay = () => {
    var _a;
    overlay.remove();
    window.removeEventListener("popstate", onPopstate);
    if ((_a = history.state) == null ? void 0 : _a.kidScoreOverlay) {
      history.back();
    }
  };
  customConfirm.onclick = () => {
    const v = customInput.value.trim();
    if (v) {
      callback(v);
      removeOverlay();
    }
  };
  customRow.appendChild(customInput);
  customRow.appendChild(customConfirm);
  popup.appendChild(customRow);
  const catTabs = document.createElement("div");
  catTabs.className = "emoji-fp-tabs";
  const catKeys = getEmojiCategoryKeys();
  const gridWrap = document.createElement("div");
  gridWrap.className = "emoji-fp-grid-wrap";
  const renderEmojis = (emojis) => {
    gridWrap.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "emoji-fp-grid";
    for (const em of emojis) {
      const btn = document.createElement("button");
      btn.className = "emoji-fp-btn";
      btn.textContent = em;
      btn.onclick = () => {
        callback(em);
        removeOverlay();
      };
      grid.appendChild(btn);
    }
    if (emojis.length === 0) {
      const hint = document.createElement("div");
      hint.style.cssText = "text-align:center;color:var(--text-muted);padding:20px;font-size:0.9em;";
      hint.textContent = "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684 emoji";
      gridWrap.appendChild(hint);
    }
    gridWrap.appendChild(grid);
  };
  const renderCat = (key) => {
    renderEmojis(getEmojiCategoryItems(key));
  };
  let searchTimer = null;
  let isComposing = false;
  customInput.addEventListener("compositionstart", () => {
    isComposing = true;
    customInput.composing = true;
  });
  customInput.addEventListener("compositionend", () => {
    isComposing = false;
    customInput.composing = false;
    doSearch();
  });
  const doSearch = () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (isComposing) return;
      const q = customInput.value.trim();
      if (!q) {
        const activeTab = catTabs.querySelector(".emoji-fp-tab.is-active");
        if (activeTab) {
          renderCat(activeTab.title || "");
        }
        catTabs.style.display = "";
        return;
      }
      const pureEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(q);
      if (pureEmoji) return;
      catTabs.style.display = "none";
      const results = searchEmojis(q, catKeys);
      renderEmojis(results);
    }, 100);
  };
  customInput.addEventListener("input", () => {
    if (isComposing) return;
    doSearch();
  });
  catKeys.forEach((key, idx) => {
    const tab = document.createElement("button");
    tab.className = "emoji-fp-tab" + (idx === 0 ? " is-active" : "");
    tab.textContent = key.split(" ")[0];
    tab.title = key;
    tab.onclick = () => {
      catTabs.querySelectorAll(".emoji-fp-tab").forEach((t) => {
        t.classList.remove("is-active");
      });
      tab.classList.add("is-active");
      renderCat(key);
    };
    catTabs.appendChild(tab);
  });
  popup.appendChild(catTabs);
  popup.appendChild(gridWrap);
  renderCat(catKeys[0]);
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "value-popup-cancel";
  cancelBtn.textContent = "\u53D6\u6D88";
  cancelBtn.style.marginTop = "8px";
  cancelBtn.style.width = "100%";
  cancelBtn.onclick = () => {
    removeOverlay();
  };
  popup.appendChild(cancelBtn);
  overlay.appendChild(popup);
  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) {
      e.preventDefault();
      removeOverlay();
    }
  });
  const onPopstate = (e) => {
    var _a;
    if ((_a = e.state) == null ? void 0 : _a.kidScoreOverlay) {
      overlay.remove();
      window.removeEventListener("popstate", onPopstate);
    }
  };
  history.pushState({ kidScoreOverlay: true }, "");
  window.addEventListener("popstate", onPopstate);
  popup.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("focusin", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("focusout", (e) => {
    e.stopPropagation();
  });
  getOverlayMount(container).appendChild(overlay);
  setTimeout(() => {
    customInput.focus();
  }, 50);
}

// src/modals/panels/diary-panel-fields.ts
function attachAutoResize(input, minHeight = 88) {
  const resize = () => {
    input.style.height = "auto";
    input.style.height = Math.max(minHeight, input.scrollHeight) + "px";
  };
  requestAnimationFrame(resize);
  setTimeout(resize, 60);
  input.addEventListener("input", resize);
  input.addEventListener("focus", resize);
}
function createDiaryModuleField({
  moduleGrid,
  moduleDef,
  diaryModules,
  moduleFields,
  updateDiaryModules,
  syncAndRefresh
}) {
  const card = moduleGrid.createDiv({ cls: "diary-module-card" });
  card.createSpan({
    cls: "diary-module-label",
    text: [moduleDef.emoji, moduleDef.label].filter(Boolean).join(" ")
  });
  const isMultiline = moduleDef.kind !== "quick";
  const input = isMultiline ? card.createEl("textarea", { cls: "diary-module-input is-multiline" }) : card.createEl("input", { cls: "diary-module-input", type: "text" });
  input.placeholder = moduleDef.placeholder || "";
  input.value = diaryModules[moduleDef.id] || "";
  bindModalInputFocus(input, { scrollOnIOSFocus: false });
  input.addEventListener("input", () => {
    diaryModules[moduleDef.id] = input.value.trim();
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  });
  if (input instanceof HTMLTextAreaElement) {
    attachAutoResize(input, 104);
  }
  moduleFields.push({ key: moduleDef.id, input });
}
function createDiaryQuickGroup({
  quickRow,
  moduleDef,
  defaults,
  diaryModules,
  moduleFields,
  updateDiaryModules,
  syncAndRefresh,
  panel
}) {
  if (!moduleDef) return;
  let customEmoji = defaults[0].e;
  const group = quickRow.createDiv({ cls: "diary-quick-group" });
  const header = group.createDiv({ cls: "diary-quick-header" });
  header.createSpan({
    cls: "diary-quick-label",
    text: [moduleDef.emoji, moduleDef.label].filter(Boolean).join(" ")
  });
  const valueInput = group.createEl("textarea", {
    cls: "diary-quick-value-input"
  });
  valueInput.placeholder = moduleDef.placeholder || "";
  valueInput.value = diaryModules[moduleDef.id] || "";
  valueInput.rows = 1;
  bindModalInputFocus(valueInput, { scrollOnIOSFocus: false });
  valueInput.addEventListener("input", () => {
    diaryModules[moduleDef.id] = valueInput.value.trim();
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  });
  attachAutoResize(valueInput, 54);
  moduleFields.push({ key: moduleDef.id, input: valueInput });
  const emojiRow = group.createDiv({ cls: "diary-quick-emoji-row" });
  defaults.forEach((entry) => {
    const btn = emojiRow.createEl("button", {
      cls: "diary-quick-btn",
      text: entry.e
    });
    btn.title = entry.l;
    btn.onclick = () => {
      valueInput.value = entry.e + " " + entry.l;
      diaryModules[moduleDef.id] = valueInput.value.trim();
      updateDiaryModules(diaryModules);
      syncAndRefresh();
    };
  });
  const customRow = group.createDiv({ cls: "diary-quick-custom-row" });
  const emojiBtn = customRow.createEl("button", {
    cls: "diary-tool-btn diary-quick-picker-btn",
    text: customEmoji
  });
  emojiBtn.title = "\u9009\u62E9\u5176\u4ED6 emoji";
  emojiBtn.onclick = () => {
    showEmojiPicker((emoji) => {
      customEmoji = emoji;
      emojiBtn.textContent = emoji;
    }, panel);
  };
  const textInput = customRow.createEl("textarea", {
    cls: "diary-quick-text-input"
  });
  textInput.placeholder = moduleDef.id === "weather" ? "\u4E5F\u53EF\u4EE5\u81EA\u5DF1\u5199\u5929\u6C14\uFF0C\u6BD4\u5982 \u9634\u5929\u6709\u98CE" : moduleDef.id === "mood" ? "\u4E5F\u53EF\u4EE5\u81EA\u5DF1\u5199\u5FC3\u60C5\uFF0C\u6BD4\u5982 \u6709\u70B9\u7D27\u5F20" : "\u4E5F\u53EF\u4EE5\u81EA\u5DF1\u8865\u5145\u4E00\u53E5";
  textInput.rows = 2;
  bindModalInputFocus(textInput, { scrollOnIOSFocus: false });
  attachAutoResize(textInput, 72);
  const addBtn = customRow.createEl("button", {
    cls: "diary-tool-btn diary-quick-add-btn",
    text: "\u6DFB\u52A0"
  });
  const insertCustom = () => {
    const text = textInput.value.trim();
    if (!customEmoji && !text) return;
    const body = [customEmoji, text].filter(Boolean).join(" ").trim();
    const existing = valueInput.value.trim();
    const nextValue = !existing ? body : existing.includes(body) ? existing : existing + " / " + body;
    valueInput.value = nextValue;
    diaryModules[moduleDef.id] = nextValue;
    updateDiaryModules(diaryModules);
    syncAndRefresh();
    textInput.value = "";
  };
  addBtn.onclick = insertCustom;
  textInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    insertCustom();
  });
}
function ensureDefaultDiaryTemplate({
  diaryModules,
  moduleFields,
  diaryTextarea,
  setDiaryTextarea,
  updateDiaryModules,
  syncAndRefresh
}) {
  const hasAnyContent = Object.values(diaryModules).some((value) => String(value || "").trim().length > 0) || moduleFields.some(({ input }) => input.value.trim().length > 0) || !!(diaryTextarea == null ? void 0 : diaryTextarea.value.trim());
  if (hasAnyContent) return;
  if (!diaryModules.weather) diaryModules.weather = "\u2600\uFE0F \u6674";
  if (!diaryModules.mood) diaryModules.mood = "\u{1F60A} \u5F00\u5FC3";
  if (!diaryModules.todayThing) diaryModules.todayThing = "\u4ECA\u5929\u6211\u505A\u4E86____\u3002";
  if (!diaryModules.learnedThing) diaryModules.learnedThing = "\u4ECA\u5929\u6211\u5B66\u4F1A\u4E86____\u3002";
  if (!diaryModules.happyThing) diaryModules.happyThing = "\u4ECA\u5929\u6700\u5F00\u5FC3\u7684\u662F____\u3002";
  if (!diaryModules.wantToSay) diaryModules.wantToSay = "\u6211\u8FD8\u60F3\u8BF4____\u3002";
  moduleFields.forEach(({ key, input }) => {
    if (input.value.trim()) return;
    input.value = diaryModules[key] || "";
  });
  if (diaryTextarea && !diaryTextarea.value.trim()) {
    diaryTextarea.value = "\u4ECA\u5929\u8FD8\u6709\u4E00\u4EF6\u6211\u60F3\u8BB0\u4E0B\u6765\u7684\u4E8B\uFF1A\n";
    diaryModules.freeWrite = diaryTextarea.value;
    setDiaryTextarea(diaryTextarea);
  }
  updateDiaryModules(diaryModules);
  syncAndRefresh();
}

// src/modals/panels/diary-panel.ts
function buildDiaryPanel(options) {
  const {
    app,
    plugin,
    component,
    panel,
    diaryContent,
    setDiaryTextarea,
    updateDiaryContent,
    updateDiaryModules,
    composeDiaryContent: composeDiaryContent2,
    insertAttachment,
    insertDiaryText,
    wrapDiarySelection
  } = options;
  const diaryModules = options.diaryModules;
  let currentDiaryContent = diaryContent;
  const moduleFields = [];
  const moduleConfig = plugin.currentUser.diaryModules && plugin.currentUser.diaryModules.length ? plugin.currentUser.diaryModules : makeDefaultDiaryModules();
  let isPreview = false;
  let previewWrap = null;
  let previewButtonBinder = (_active) => {
  };
  let diaryTextarea = null;
  let textareaWrap = null;
  let charCount = null;
  let inlinePreviewBtn = null;
  const attachAutoResize2 = (textarea, minHeight = 220) => {
    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(minHeight, textarea.scrollHeight) + "px";
    };
    requestAnimationFrame(resize);
    setTimeout(resize, 60);
    textarea.addEventListener("input", resize);
    textarea.addEventListener("focus", resize);
  };
  const updateCharCount = () => {
    if (charCount) charCount.textContent = (currentDiaryContent || "").length + " \u5B57";
  };
  const syncAndRefresh = () => {
    currentDiaryContent = composeDiaryContent2();
    updateDiaryContent(currentDiaryContent);
    updateCharCount();
    if (!isPreview || !previewWrap) return;
    previewWrap.empty();
    import_obsidian2.MarkdownRenderer.render(app, currentDiaryContent || "_\u8FD8\u6CA1\u6709\u5185\u5BB9_", previewWrap, "", component);
  };
  const scrollDiaryTargetIntoView = (target) => {
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    });
  };
  let toolbar = null;
  const createToolButton = (text, onClick, extraCls = "") => {
    if (!toolbar) return null;
    const btn = toolbar.createEl("button", {
      cls: "diary-tool-btn" + (extraCls ? " " + extraCls : ""),
      text
    });
    btn.onclick = onClick;
    return btn;
  };
  const togglePreview = () => {
    isPreview = !isPreview;
    if (isPreview) {
      currentDiaryContent = composeDiaryContent2();
      updateDiaryContent(currentDiaryContent);
      if (diaryTextarea) diaryTextarea.rows = 5;
      if (previewWrap) {
        previewWrap.style.display = "";
        previewWrap.empty();
        import_obsidian2.MarkdownRenderer.render(app, currentDiaryContent || "_\u8FD8\u6CA1\u6709\u5185\u5BB9_", previewWrap, "", component);
      }
      scrollDiaryTargetIntoView(previewWrap);
    } else {
      if (diaryTextarea) {
        diaryTextarea.rows = 12;
        diaryTextarea.focus();
      }
      if (previewWrap) previewWrap.style.display = "none";
      scrollDiaryTargetIntoView(textareaWrap);
    }
    previewButtonBinder(isPreview);
  };
  const moduleSection = panel.createDiv({ cls: "diary-module-section" });
  moduleSection.createEl("h4", { cls: "diary-module-title", text: "\u{1F9E9} \u6BCF\u5929\u5C0F\u8BB0\u5F55" });
  moduleSection.createEl("p", {
    cls: "diary-module-hint",
    text: "\u5148\u9009\u5929\u6C14\u548C\u5FC3\u60C5\uFF0C\u518D\u7528\u77ED\u77ED\u7684\u53E5\u5B50\u8BB0\u4E00\u8BB0\u4ECA\u5929\u3002"
  });
  const moduleGrid = moduleSection.createDiv({ cls: "diary-module-grid" });
  const weatherModule = moduleConfig.find((moduleDef) => moduleDef.id === "weather");
  const moodModule = moduleConfig.find((moduleDef) => moduleDef.id === "mood");
  moduleConfig.filter((moduleDef) => moduleDef.id !== "weather" && moduleDef.id !== "mood").forEach(
    (moduleDef) => createDiaryModuleField({
      moduleGrid,
      moduleDef,
      diaryModules,
      moduleFields,
      updateDiaryModules,
      syncAndRefresh
    })
  );
  const quickRow = panel.createDiv({ cls: "diary-quick-row" });
  const weatherEmojis = [
    { e: "\u2600\uFE0F", l: "\u6674" },
    { e: "\u26C5", l: "\u591A\u4E91" },
    { e: "\u{1F327}\uFE0F", l: "\u96E8" },
    { e: "\u{1F328}\uFE0F", l: "\u96EA" },
    { e: "\u{1F32C}\uFE0F", l: "\u98CE" },
    { e: "\u{1F324}\uFE0F", l: "\u6674\u8F6C\u591A\u4E91" }
  ];
  const moodEmojis = [
    { e: "\u{1F60A}", l: "\u5F00\u5FC3" },
    { e: "\u{1F60E}", l: "\u5F88\u68D2" },
    { e: "\u{1F914}", l: "\u601D\u8003" },
    { e: "\u{1F622}", l: "\u96BE\u8FC7" },
    { e: "\u{1F620}", l: "\u751F\u6C14" },
    { e: "\u{1F634}", l: "\u56F0" }
  ];
  createDiaryQuickGroup({
    quickRow,
    moduleDef: weatherModule,
    defaults: weatherEmojis,
    diaryModules,
    moduleFields,
    updateDiaryModules,
    syncAndRefresh,
    panel
  });
  createDiaryQuickGroup({
    quickRow,
    moduleDef: moodModule,
    defaults: moodEmojis,
    diaryModules,
    moduleFields,
    updateDiaryModules,
    syncAndRefresh,
    panel
  });
  textareaWrap = panel.createDiv({ cls: "diary-textarea-wrap" });
  const freewriteHeader = textareaWrap.createDiv({ cls: "diary-freewrite-header" });
  freewriteHeader.createEl("h4", { cls: "diary-module-title", text: "\u270D\uFE0F \u81EA\u7531\u8BB0\u5F55" });
  inlinePreviewBtn = freewriteHeader.createEl("button", {
    cls: "diary-tool-btn diary-inline-preview-btn",
    text: "\u67E5\u770B\u9884\u89C8"
  });
  inlinePreviewBtn.onclick = () => togglePreview();
  textareaWrap.createEl("p", {
    cls: "diary-module-hint",
    text: "\u8FD9\u91CC\u53EF\u4EE5\u5199\u957F\u4E00\u70B9\uFF0C\u60F3\u5230\u4EC0\u4E48\u5C31\u5199\u4EC0\u4E48\u3002"
  });
  toolbar = textareaWrap.createDiv({ cls: "diary-toolbar diary-freewrite-toolbar" });
  [
    { t: "\u{1F5BC}\uFE0F \u56FE\u7247", e: "png" },
    { t: "\u{1F3AC} \u89C6\u9891", e: "mp4" },
    { t: "\u{1F3B5} \u97F3\u9891", e: "mp3" }
  ].forEach((asset) => {
    createToolButton(asset.t, () => insertAttachment(asset.t.split(" ")[1], asset.e), "is-media");
  });
  createToolButton("B \u52A0\u7C97", () => wrapDiarySelection("**", "**", "\u91CD\u70B9\u5185\u5BB9"), "is-format");
  createToolButton("I \u659C\u4F53", () => wrapDiarySelection("*", "*", "\u60F3\u6CD5"), "is-format");
  createToolButton("H \u6807\u9898", () => insertDiaryText("\n### \u5C0F\u6807\u9898\n"), "is-format");
  createToolButton("\u2022 \u5217\u8868", () => insertDiaryText("\n- "), "is-format");
  createToolButton("\u275D \u5F15\u7528", () => insertDiaryText("\n> "), "is-format");
  createToolButton(
    "\u2194\uFE0E \u5C45\u4E2D",
    () => wrapDiarySelection('<div align="center">\n', "\n</div>", "\u5199\u5728\u4E2D\u95F4\u7684\u8BDD"),
    "is-format"
  );
  diaryTextarea = textareaWrap.createEl("textarea", {
    cls: "diary-textarea",
    placeholder: "\u4F8B\u5982\uFF1A\u4ECA\u5929\u653E\u5B66\u540E\uFF0C\u6211\u548C\u5988\u5988\u4E00\u8D77\u53BB\u4E86\u516C\u56ED..."
  });
  bindModalInputFocus(diaryTextarea);
  diaryTextarea.value = diaryModules.freeWrite || "";
  diaryTextarea.rows = 12;
  attachAutoResize2(diaryTextarea, 220);
  diaryTextarea.oninput = () => {
    diaryModules.freeWrite = diaryTextarea.value;
    updateDiaryModules(diaryModules);
    syncAndRefresh();
  };
  setDiaryTextarea(diaryTextarea);
  ensureDefaultDiaryTemplate({
    diaryModules,
    moduleFields,
    diaryTextarea,
    setDiaryTextarea,
    updateDiaryModules,
    syncAndRefresh
  });
  previewWrap = panel.createDiv({ cls: "diary-preview-wrap" });
  previewWrap.style.display = "none";
  charCount = panel.createDiv({ cls: "diary-char-count" });
  updateDiaryContent(currentDiaryContent);
  updateCharCount();
  return {
    togglePreview,
    bindActionButtons: ({ previewBtn, saveBtn, statsBtn, actions }) => {
      previewButtonBinder = (active) => {
        previewBtn.style.display = "none";
        previewBtn.classList.remove("is-active");
        if (inlinePreviewBtn) {
          inlinePreviewBtn.textContent = active ? "\u8FD4\u56DE\u7F16\u8F91" : "\u67E5\u770B\u9884\u89C8";
          inlinePreviewBtn.classList.toggle("is-active", active);
        }
        saveBtn.textContent = active ? "\u{1F4BE} \u786E\u8BA4\u4FDD\u5B58" : "\u{1F4BE} \u4FDD\u5B58\u8BB0\u5F55";
        saveBtn.classList.toggle("is-preview-ready", active);
        if (statsBtn) statsBtn.classList.toggle("is-muted-during-preview", active);
        actions.classList.toggle("is-preview-mode", active);
      };
      previewButtonBinder(isPreview);
    }
  };
}

// src/modals/popups/add-custom-modal.ts
var AddCustomModal = class extends BaseMobileModal {
  constructor(app, plugin, onAdded) {
    super(app, plugin);
    this.onAdded = onAdded;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    super.onOpen();
    this.titleEl.setText("\u{1F4CC} \u6DFB\u52A0\u4E34\u65F6\u4E8B\u9879");
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");
    c.createEl("div", { cls: "value-popup-hint", text: "\u53EF\u586B\u5199\u5907\u6CE8\uFF0C\u8BB0\u5F55\u672C\u6B21\u52A0/\u6263\u5206\u539F\u56E0" });
    const emojiRow = c.createDiv({ cls: "custom-form-row" });
    emojiRow.createSpan({ cls: "custom-form-label", text: "\u56FE\u6807" });
    const emojiInput = emojiRow.createEl("input", { type: "text", cls: "custom-form-emoji-input" });
    emojiInput.value = "\u2B50";
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = emojiRow.createEl("button", { cls: "diary-tool-btn", text: "\u{1F50D}" });
    emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.containerEl);
    };
    const nameRow = c.createDiv({ cls: "custom-form-row" });
    nameRow.createSpan({ cls: "custom-form-label", text: "\u4E8B\u9879" });
    const nameInput = nameRow.createEl("input", { type: "text", cls: "custom-form-name-input" });
    nameInput.placeholder = "\u4E8B\u9879\u540D\u79F0...";
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);
    const pointsRow = c.createDiv({ cls: "custom-form-row" });
    pointsRow.createSpan({ cls: "custom-form-label", text: "\u5206\u503C" });
    const pc = pointsRow.createDiv({ cls: "value-popup-controls" });
    const pm = pc.createEl("button", { cls: "value-popup-adjust", text: "\u2212" });
    const pi = pc.createEl("input", { type: "number", cls: "value-popup-input" });
    pi.value = "1";
    bindModalInputFocus(pi);
    const pp = pc.createEl("button", { cls: "value-popup-adjust", text: "+" });
    pm.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") - 1);
    };
    pp.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") + 1);
    };
    const noteRow = c.createDiv({ cls: "custom-form-row" });
    noteRow.createSpan({ cls: "custom-form-label", text: "\u5907\u6CE8" });
    const noteInput = noteRow.createEl("textarea", { cls: "custom-form-name-input" });
    noteInput.addClass("custom-form-note-input");
    noteInput.placeholder = "\u53EF\u9009\uFF0C\u5C06\u663E\u793A\u5728\u6587\u6863\u9875\u4E2D\uFF0C\u652F\u6301\u591A\u884C";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);
    const autoResize = (ta) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));
    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "\u6DFB\u52A0" });
    ok.onclick = () => {
      const n = nameInput.value.trim();
      if (!n) {
        nameInput.classList.add("is-error");
        return;
      }
      this.onAdded(
        emojiInput.value.trim() || "\u2B50",
        n,
        parseInt(pi.value) || 0,
        noteInput.value.trim()
      );
      this.close();
    };
  }
};

// src/modals/popups/add-item-modal.ts
var import_obsidian3 = require("obsidian");
var AddItemModal = class extends BaseMobileModal {
  constructor(app, plugin, category, onAdded) {
    super(app, plugin);
    this.category = category;
    this.onAdded = onAdded;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    super.onOpen();
    this.titleEl.setText("\u2795 \u65B0\u589E\u6253\u5206\u9879 \xB7 " + this.category);
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");
    const emojiRow = c.createDiv({ cls: "custom-form-row" });
    emojiRow.createSpan({ cls: "custom-form-label", text: "\u56FE\u6807" });
    const emojiInput = emojiRow.createEl("input", { type: "text", cls: "custom-form-emoji-input" });
    emojiInput.value = "\u2B50";
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = emojiRow.createEl("button", { cls: "diary-tool-btn", text: "\u{1F50D}" });
    emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.containerEl);
    };
    const nameRow = c.createDiv({ cls: "custom-form-row" });
    nameRow.createSpan({ cls: "custom-form-label", text: "\u540D\u79F0" });
    const nameInput = nameRow.createEl("input", { type: "text", cls: "custom-form-name-input" });
    nameInput.placeholder = "\u6253\u5206\u9879\u540D\u79F0...";
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);
    const pointsRow = c.createDiv({ cls: "custom-form-row" });
    pointsRow.createSpan({ cls: "custom-form-label", text: "\u5206\u503C" });
    const pc = pointsRow.createDiv({ cls: "value-popup-controls" });
    const pm = pc.createEl("button", { cls: "value-popup-adjust", text: "\u2212" });
    const pi = pc.createEl("input", { type: "number", cls: "value-popup-input" });
    pi.value = "1";
    bindModalInputFocus(pi);
    const pp = pc.createEl("button", { cls: "value-popup-adjust", text: "+" });
    pm.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") - 1);
    };
    pp.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") + 1);
    };
    const noteRow = c.createDiv({ cls: "custom-form-row" });
    noteRow.createSpan({ cls: "custom-form-label", text: "\u5907\u6CE8" });
    const noteInput = noteRow.createEl("textarea", { cls: "custom-form-name-input" });
    noteInput.addClass("custom-form-note-input");
    noteInput.placeholder = "\u53EF\u9009\uFF0C\u957F\u6309\u65F6\u663E\u793A\u5728\u5361\u7247\u4E0A\uFF0C\u652F\u6301\u591A\u884C";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);
    const autoResize = (ta) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));
    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "\u6DFB\u52A0" });
    ok.onclick = async () => {
      try {
        const n = nameInput.value.trim();
        if (!n) {
          nameInput.classList.add("is-error");
          return;
        }
        this.plugin.currentUser.items.push({
          id: "item_" + Date.now(),
          name: n,
          points: parseInt(pi.value) || 1,
          emoji: emojiInput.value.trim() || "\u2B50",
          category: this.category,
          note: noteInput.value.trim()
        });
        const cats = this.plugin.currentUser.categories || [];
        this.plugin.currentUser.items.sort((a, b) => {
          let ai = cats.indexOf(a.category);
          if (ai === -1) ai = 9999;
          let bi = cats.indexOf(b.category);
          if (bi === -1) bi = 9999;
          return ai - bi;
        });
        await this.plugin.saveSettings();
        this.close();
        this.onAdded();
      } catch (e) {
        new import_obsidian3.Notice("\u274C \u6DFB\u52A0\u5931\u8D25\uFF1A" + (e instanceof Error ? e.message : String(e)));
      }
    };
  }
};

// src/modals/popups/attach-file-modal.ts
var AttachFileModal = class extends BaseMobileModal {
  constructor(app, plugin, label, dateStr, onConfirm) {
    super(app, plugin);
    this.label = label;
    this.dateStr = dateStr;
    this.onConfirm = onConfirm;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    super.onOpen();
    this.titleEl.setText("\u{1F4CE} \u63D2\u5165" + this.label);
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    c.createEl("div", {
      cls: "value-popup-hint",
      text: "\u8F93\u5165\u6587\u4EF6\u540D\uFF08\u4E0D\u542B\u6269\u5C55\u540D\uFF09"
    });
    const fileInput = c.createEl("input", { cls: "custom-form-name-input" });
    fileInput.type = "text";
    fileInput.placeholder = "\u4F8B\u5982: \u4ECA\u5929\u7684\u7167\u7247";
    fileInput.autocomplete = "off";
    bindModalInputFocus(fileInput);
    const quickName = c.createEl("div", { cls: "value-popup-hint" });
    quickName.style.cssText = "cursor:pointer;text-decoration:underline;margin-top:6px";
    quickName.textContent = "\u{1F4A1} \u9ED8\u8BA4: " + this.dateStr + "-" + this.label;
    quickName.onclick = () => {
      fileInput.value = this.dateStr + "-" + this.label;
    };
    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "\u63D2\u5165" });
    ok.onclick = () => {
      let f = fileInput.value.trim();
      if (!f) {
        fileInput.classList.add("is-error");
        return;
      }
      this.onConfirm(f);
      this.close();
    };
  }
};

// src/modals/popups/edit-custom-modal.ts
var EditCustomModal = class extends BaseMobileModal {
  constructor(app, plugin, item, onSave) {
    super(app, plugin);
    this.item = item;
    this.onSave = onSave;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    super.onOpen();
    this.titleEl.setText("\u270F\uFE0F \u7F16\u8F91\u4E34\u65F6\u4E8B\u9879");
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");
    const emojiRow = c.createDiv({ cls: "custom-form-row" });
    emojiRow.createSpan({ cls: "custom-form-label", text: "\u56FE\u6807" });
    const emojiInput = emojiRow.createEl("input", { type: "text", cls: "custom-form-emoji-input" });
    emojiInput.value = this.item.emoji;
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = emojiRow.createEl("button", { cls: "diary-tool-btn", text: "\u{1F50D}" });
    emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.containerEl);
    };
    const nameRow = c.createDiv({ cls: "custom-form-row" });
    nameRow.createSpan({ cls: "custom-form-label", text: "\u4E8B\u9879" });
    const nameInput = nameRow.createEl("input", { type: "text", cls: "custom-form-name-input" });
    nameInput.value = this.item.name;
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);
    const pointsRow = c.createDiv({ cls: "custom-form-row" });
    pointsRow.createSpan({ cls: "custom-form-label", text: "\u5206\u503C" });
    const pc = pointsRow.createDiv({ cls: "value-popup-controls" });
    const pm = pc.createEl("button", { cls: "value-popup-adjust", text: "\u2212" });
    const pi = pc.createEl("input", { type: "number", cls: "value-popup-input" });
    pi.value = String(this.item.points);
    bindModalInputFocus(pi);
    const pp = pc.createEl("button", { cls: "value-popup-adjust", text: "+" });
    pm.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") - 1);
    };
    pp.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") + 1);
    };
    const noteRow = c.createDiv({ cls: "custom-form-row" });
    noteRow.createSpan({ cls: "custom-form-label", text: "\u5907\u6CE8" });
    const noteInput = noteRow.createEl("textarea", { cls: "custom-form-name-input" });
    noteInput.addClass("custom-form-note-input");
    noteInput.value = this.item.note || "";
    noteInput.placeholder = "\u53EF\u9009\uFF0C\u5C06\u663E\u793A\u5728\u6587\u6863\u9875\u4E2D\uFF0C\u652F\u6301\u591A\u884C";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);
    const autoResize = (ta) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    requestAnimationFrame(() => autoResize(noteInput));
    setTimeout(() => autoResize(noteInput), 60);
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));
    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "\u4FDD\u5B58" });
    ok.onclick = () => {
      const n = nameInput.value.trim();
      if (!n) {
        nameInput.classList.add("is-error");
        return;
      }
      this.onSave(
        emojiInput.value.trim() || "\u2B50",
        n,
        parseInt(pi.value) || 0,
        noteInput.value.trim()
      );
      this.close();
    };
  }
};

// src/modals/popups/edit-item-modal.ts
var import_obsidian4 = require("obsidian");
var EditItemModal = class extends BaseMobileModal {
  constructor(app, plugin, item, onSave) {
    super(app, plugin);
    this.item = item;
    this.onSave = onSave;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    this.modalEl.addClass("kid-score-edit-modal");
    super.onOpen();
    this.titleEl.setText("\u270F\uFE0F \u7F16\u8F91\u9879\u76EE");
    const c = this.contentEl;
    c.addClass("kid-score-custom-form");
    const emojiRow = document.createElement("div");
    emojiRow.className = "custom-form-row";
    emojiRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "\u56FE\u6807" }));
    const emojiInput = document.createElement("input");
    emojiInput.type = "text";
    emojiInput.className = "custom-form-emoji-input";
    emojiInput.value = this.item.emoji;
    emojiInput.maxLength = 2;
    bindModalInputFocus(emojiInput);
    const emojiPickBtn = document.createElement("button");
    emojiPickBtn.className = "diary-tool-btn";
    emojiPickBtn.textContent = "\u{1F50D}";
    emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = () => {
      showEmojiPicker((em) => {
        emojiInput.value = em;
      }, this.contentEl);
    };
    emojiRow.appendChild(emojiInput);
    emojiRow.appendChild(emojiPickBtn);
    c.appendChild(emojiRow);
    const nameRow = document.createElement("div");
    nameRow.className = "custom-form-row";
    nameRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "\u540D\u79F0" }));
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "custom-form-name-input";
    nameInput.value = this.item.name;
    nameInput.autocomplete = "off";
    bindModalInputFocus(nameInput);
    nameRow.appendChild(nameInput);
    c.appendChild(nameRow);
    const pointsRow = document.createElement("div");
    pointsRow.className = "custom-form-row";
    pointsRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "\u9ED8\u8BA4\u5206\u503C" }));
    const pc = document.createElement("div");
    pc.className = "value-popup-controls";
    const pm = document.createElement("button");
    pm.className = "value-popup-adjust";
    pm.textContent = "\u2212";
    const pi = document.createElement("input");
    pi.type = "number";
    pi.className = "value-popup-input";
    pi.value = String(this.item.points);
    pi.setAttribute("inputmode", "numeric");
    bindModalInputFocus(pi);
    const pp = document.createElement("button");
    pp.className = "value-popup-adjust";
    pp.textContent = "+";
    pm.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") - 1);
    };
    pp.onclick = () => {
      pi.value = String(parseInt(pi.value || "0") + 1);
    };
    pc.appendChild(pm);
    pc.appendChild(pi);
    pc.appendChild(pp);
    pointsRow.appendChild(pc);
    c.appendChild(pointsRow);
    const noteRow = document.createElement("div");
    noteRow.className = "custom-form-row";
    noteRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "\u5907\u6CE8" }));
    const noteInput = document.createElement("textarea");
    noteInput.className = "custom-form-name-input";
    noteInput.classList.add("custom-form-note-input");
    noteInput.value = this.item.note || "";
    noteInput.placeholder = "\u53EF\u9009\uFF0C\u957F\u6309\u65F6\u663E\u793A\u5728\u5361\u7247\u4E0A\uFF0C\u652F\u6301\u591A\u884C";
    noteInput.autocomplete = "off";
    bindModalInputFocus(noteInput);
    noteRow.appendChild(noteInput);
    const autoResize = (ta) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    };
    requestAnimationFrame(() => autoResize(noteInput));
    setTimeout(() => autoResize(noteInput), 60);
    noteInput.addEventListener("input", () => autoResize(noteInput));
    noteInput.addEventListener("focus", () => autoResize(noteInput));
    c.appendChild(noteRow);
    const catRow = document.createElement("div");
    catRow.className = "custom-form-row";
    catRow.appendChild(Object.assign(document.createElement("span"), { className: "custom-form-label", textContent: "\u5206\u7C7B" }));
    const catSel = document.createElement("select");
    catSel.className = "custom-form-select";
    (this.plugin.currentUser.categories || []).forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      if (cat === this.item.category) opt.selected = true;
      catSel.appendChild(opt);
    });
    catRow.appendChild(catSel);
    c.appendChild(catRow);
    const acts = document.createElement("div");
    acts.className = "value-popup-actions";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "value-popup-cancel";
    cancelBtn.textContent = "\u53D6\u6D88";
    cancelBtn.onclick = () => this.close();
    const saveBtn = document.createElement("button");
    saveBtn.className = "value-popup-confirm mod-cta";
    saveBtn.textContent = "\u4FDD\u5B58";
    saveBtn.onclick = async () => {
      try {
        const n = nameInput.value.trim();
        if (!n) {
          nameInput.classList.add("is-error");
          return;
        }
        this.item.name = n;
        this.item.emoji = emojiInput.value.trim() || "\u2B50";
        this.item.points = parseInt(pi.value) || 0;
        this.item.note = noteInput.value.trim();
        this.item.category = catSel.value;
        await this.plugin.saveSettings();
        this.close();
        this.onSave();
      } catch (e) {
        new import_obsidian4.Notice("\u274C \u4FDD\u5B58\u5931\u8D25\uFF1A" + (e instanceof Error ? e.message : String(e)));
      }
    };
    acts.appendChild(cancelBtn);
    acts.appendChild(saveBtn);
    c.appendChild(acts);
  }
};

// src/modals/popups/quick-custom-modal.ts
var QuickCustomModal = class extends BaseMobileModal {
  constructor(app, plugin, item, onConfirm) {
    super(app, plugin);
    this.item = item;
    this.onConfirm = onConfirm;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    super.onOpen();
    this.titleEl.setText(this.item.emoji + " " + this.item.name);
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    if (this.item.note) {
      c.createEl("div", { cls: "value-popup-note", text: this.item.note });
    }
    c.createEl("div", { cls: "value-popup-hint", text: "\u5FEB\u901F\u4FEE\u6539\u5206\u503C" });
    const controls = c.createDiv({ cls: "value-popup-controls" });
    const minus = controls.createEl("button", { cls: "value-popup-adjust", text: "\u2212" });
    const input = controls.createEl("input", { type: "number", cls: "value-popup-input" });
    input.value = String(this.item.points || 0);
    const plus = controls.createEl("button", { cls: "value-popup-adjust", text: "+" });
    bindModalInputFocus(input);
    minus.onclick = () => {
      input.value = String(parseInt(input.value || "0") - 1);
    };
    plus.onclick = () => {
      input.value = String(parseInt(input.value || "0") + 1);
    };
    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "\u4FDD\u5B58" });
    ok.onclick = () => {
      this.onConfirm(parseInt(input.value) || 0);
      this.close();
    };
  }
};

// src/modals/popups/score-item-modal.ts
var ScoreItemModal = class extends BaseMobileModal {
  constructor(app, plugin, item, initialValue, quickOnly, onConfirm, onEdit) {
    super(app, plugin);
    this.item = item;
    this.initialValue = initialValue;
    this.quickOnly = quickOnly;
    this.onConfirm = onConfirm;
    this.onEdit = onEdit;
    this.enableManualDragAdjustment = true;
  }
  onOpen() {
    super.onOpen();
    this.titleEl.setText(this.item.emoji + " " + this.item.name);
    this.modalEl.addClass("kid-score-edit-modal");
    const c = this.contentEl;
    if (this.item.note) {
      c.createEl("div", { cls: "value-popup-note", text: this.item.note });
    }
    c.createEl("div", {
      cls: "value-popup-hint",
      text: "\u9ED8\u8BA4\u5206\u503C\uFF1A" + (this.item.points >= 0 ? "+" : "") + this.item.points
    });
    const controls = c.createDiv({ cls: "value-popup-controls" });
    const minus = controls.createEl("button", { cls: "value-popup-adjust", text: "\u2212" });
    const input = controls.createEl("input", { type: "number", cls: "value-popup-input" });
    input.value = String(this.initialValue);
    const plus = controls.createEl("button", { cls: "value-popup-adjust", text: "+" });
    bindModalInputFocus(input);
    minus.onclick = () => {
      input.value = String(parseInt(input.value || "0") - 1);
    };
    plus.onclick = () => {
      input.value = String(parseInt(input.value || "0") + 1);
    };
    const acts = c.createDiv({ cls: "value-popup-actions" });
    const cb = acts.createEl("button", { cls: "value-popup-cancel", text: "\u53D6\u6D88" });
    cb.onclick = () => this.close();
    const ok = acts.createEl("button", { cls: "value-popup-confirm mod-cta", text: "\u786E\u5B9A" });
    ok.onclick = () => {
      this.onConfirm(parseInt(input.value) || 0);
      this.close();
    };
    if (!this.quickOnly) {
      const delRow = c.createDiv({ cls: "value-popup-del-row" });
      const editBtn = delRow.createEl("button", { cls: "value-popup-edit-btn", text: "\u270F\uFE0F \u7F16\u8F91\u6B64\u9879\u76EE" });
      editBtn.onclick = () => {
        this.close();
        if (this.onEdit) this.onEdit();
      };
      const delBtn = delRow.createEl("button", { cls: "value-popup-del-btn", text: "\u{1F5D1} \u5220\u9664\u6B64\u6253\u5206\u9879" });
      delBtn.onclick = async () => {
        if (!confirm("\u786E\u5B9A\u5220\u9664\u6253\u5206\u9879\u300C" + this.item.name + "\u300D\u5417\uFF1F")) return;
        this.close();
        const idx = this.plugin.currentUser.items.findIndex((it) => it.id === this.item.id);
        if (idx !== -1) {
          this.plugin.currentUser.items.splice(idx, 1);
          await this.plugin.saveSettings();
        }
      };
    }
  }
};

// src/modals/helpers/daily-modal-actions.ts
function openScoreItemValueModal(options) {
  const { app, plugin, item, currentValue, quickOnly = false, onValue, onRefresh } = options;
  const openEdit = () => {
    new EditItemModal(app, plugin, item, async () => {
      await onRefresh();
    }).open();
  };
  new ScoreItemModal(app, plugin, item, currentValue, quickOnly, onValue, openEdit).open();
}
function openAddItemModal(app, plugin, category, onRefresh) {
  new AddItemModal(app, plugin, category, async () => {
    await onRefresh();
  }).open();
}
function openAttachmentInsertModal(options) {
  const { app, plugin, label, ext, dateStr, onInsert } = options;
  new AttachFileModal(app, plugin, label, dateStr, (fileName) => {
    let filename = fileName;
    if (!filename.includes(".")) filename += "." + ext;
    onInsert("\n![[" + filename + "]]\n");
  }).open();
}
function openAddCustomItemModal(options) {
  new AddCustomModal(options.app, options.plugin, options.onSubmit).open();
}
function openEditCustomItemModal(options) {
  const { app, plugin, customItem, onSubmit } = options;
  if (!customItem) return;
  new EditCustomModal(app, plugin, customItem, onSubmit).open();
}
function openQuickCustomAdjustModal(options) {
  const { app, plugin, customItem, onSubmit } = options;
  if (!customItem) return;
  new QuickCustomModal(app, plugin, customItem, onSubmit).open();
}

// src/diary/modules.ts
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function readDiaryLine(content, label) {
  const match = content.match(new RegExp(escapeRegex(label) + "\uFF1A\\s*(.+)"));
  return match ? match[1].trim() : "";
}
function parseDiaryModules(content, moduleConfig) {
  const raw = content || "";
  const freeWriteMatch = raw.match(/###\s*自由记录\s*([\s\S]*)$/);
  const result = {
    freeWrite: freeWriteMatch ? freeWriteMatch[1].trim() : ""
  };
  moduleConfig.forEach((moduleDef) => {
    result[moduleDef.id] = readDiaryLine(raw, moduleDef.label);
  });
  return result;
}
function composeDiaryContent(values, moduleConfig) {
  const sections = [];
  const storyLines = [];
  const normalizedValues = {};
  const appendSentence = (text) => {
    const cleaned = String(text || "").trim();
    if (!cleaned) return;
    storyLines.push(/[。！？.!?]$/.test(cleaned) ? cleaned : cleaned + "\u3002");
  };
  moduleConfig.forEach((moduleDef) => {
    const value = String(values[moduleDef.id] || "").replace(/\s*\n+\s*/g, " / ").trim();
    normalizedValues[moduleDef.id] = value;
  });
  if (normalizedValues.weather) appendSentence("\u4ECA\u5929\u7684\u5929\u6C14\u662F" + normalizedValues.weather);
  if (normalizedValues.mood) appendSentence("\u6211\u4ECA\u5929\u7684\u5FC3\u60C5\u662F" + normalizedValues.mood);
  if (normalizedValues.todayThing) appendSentence(normalizedValues.todayThing);
  if (normalizedValues.learnedThing) appendSentence(normalizedValues.learnedThing);
  if (normalizedValues.happyThing) appendSentence(normalizedValues.happyThing);
  if (normalizedValues.wantToSay) appendSentence(normalizedValues.wantToSay);
  moduleConfig.forEach((moduleDef) => {
    if (["weather", "mood", "todayThing", "learnedThing", "happyThing", "wantToSay"].includes(
      moduleDef.id
    )) {
      return;
    }
    if (!normalizedValues[moduleDef.id]) return;
    appendSentence(moduleDef.label + "\uFF1A" + normalizedValues[moduleDef.id]);
  });
  if (storyLines.length) sections.push("### \u4ECA\u5929\u7684\u5C0F\u65E5\u8BB0\n" + storyLines.join("\n"));
  if (values.freeWrite && values.freeWrite.trim()) {
    sections.push("### \u81EA\u7531\u8BB0\u5F55\n" + values.freeWrite.trim());
  }
  return sections.join("\n\n").trim();
}

// src/modals/helpers/daily-modal-state.ts
async function loadDailyModalState(plugin, dateStr) {
  const yesterday = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const existingToday = await plugin.readDayData(dateStr);
  const yesterdayData = await plugin.readDayData(yesterdayStr);
  const allScores = await plugin.getAllScores();
  const scores = {};
  for (const item of plugin.currentUser.items) {
    if (existingToday && existingToday.scores[item.id] !== void 0) {
      scores[item.id] = existingToday.scores[item.id];
    } else {
      scores[item.id] = 0;
    }
  }
  const customItems = (existingToday == null ? void 0 : existingToday.customItems) || [];
  const diaryContent = (existingToday == null ? void 0 : existingToday.diaryContent) || "";
  const moduleConfig = plugin.currentUser.diaryModules && plugin.currentUser.diaryModules.length ? plugin.currentUser.diaryModules : makeDefaultDiaryModules();
  const diaryModules = diaryContent ? parseDiaryModules(diaryContent, moduleConfig) : {};
  return {
    yesterdayData,
    allScores,
    scores,
    customItems,
    diaryContent,
    diaryModules
  };
}

// src/modals/helpers/daily-total-display.ts
function renderDailyTotalDisplay({
  element,
  items,
  scores,
  customItems,
  dailyGoal
}) {
  let total = 0;
  let completed = 0;
  for (const item of items) {
    const val = scores[item.id] || 0;
    total += val;
    const isDeduct = item.category === "\u51CF\u5206" || item.points < 0;
    if (isDeduct ? val !== 0 : val > 0) {
      completed++;
    }
  }
  completed += customItems.length;
  const pct = Math.min(100, Math.round(completed / dailyGoal * 100));
  element.empty();
  element.createSpan({ text: "\u{1F3C6} \u5F53\u524D\u603B\u5206\uFF1A" + (total >= 0 ? "+" : "") + total + " \u5206  " });
  const goalWrap = element.createSpan({ cls: "daily-goal-wrap" });
  goalWrap.createSpan({ cls: "daily-goal-label", text: "\u4ECA\u65E5\u76EE\u6807 " + completed + "/" + dailyGoal });
  const barWrap = goalWrap.createSpan({ cls: "daily-goal-bar-wrap" });
  const bar = barWrap.createSpan({ cls: "daily-goal-bar" });
  bar.style.width = pct + "%";
  if (pct >= 100) bar.addClass("is-complete");
}

// src/modals/panels/modal-chrome.ts
var import_obsidian5 = require("obsidian");
function renderDailyHeader({
  containerEl,
  plugin,
  dateStr,
  allScores,
  onPrevDay,
  onNextDay,
  onCalendar,
  onGoToday,
  onSwitchUser
}) {
  const header = containerEl.createDiv({ cls: "kid-score-header" });
  header.createEl("h2", { text: plugin.currentUser.name + " \u7684\u6BCF\u65E5\u8BB0\u5F55" });
  const dateNav = header.createDiv({ cls: "kid-score-date-nav" });
  const prevBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "\u25C0" });
  prevBtn.onclick = onPrevDay;
  dateNav.createEl("button", {
    cls: "date-nav-display",
    text: dateStr
  });
  const calBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "\u{1F4C5}" });
  calBtn.title = "\u65E5\u5386\u8DF3\u9009";
  calBtn.onclick = onCalendar;
  const nextBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "\u25B6" });
  const isToday = dateStr === formatDate(0);
  if (isToday) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.3";
  }
  nextBtn.onclick = () => {
    if (!isToday) onNextDay();
  };
  const todayBtn = dateNav.createEl("button", {
    cls: "date-nav-today" + (isToday ? " is-today" : ""),
    text: isToday ? "\u4ECA\u5929" : "\u56DE\u5230\u4ECA\u5929"
  });
  if (!isToday) {
    todayBtn.onclick = onGoToday;
    containerEl.createDiv({
      cls: "kid-score-past-banner",
      text: "\u{1F4C5} \u6B63\u5728\u7F16\u8F91 " + dateStr + " \u7684\u8BB0\u5F55"
    });
  }
  const cumulativeTotal = allScores.reduce((sum, s) => sum + s.total, 0);
  const cumulativeDays = allScores.length;
  if (cumulativeDays > 0) {
    const cSign = cumulativeTotal >= 0 ? "+" : "";
    const cumDiv = containerEl.createDiv({ cls: "kid-score-cumulative-banner" });
    cumDiv.createSpan({ cls: "cumulative-label", text: "\u{1F396}\uFE0F \u5386\u53F2\u7D2F\u8BA1" });
    cumDiv.createSpan({ cls: "cumulative-value", text: cSign + cumulativeTotal + " \u5206" });
    cumDiv.createSpan({ cls: "cumulative-days", text: "\u5171 " + cumulativeDays + " \u5929" });
  }
  const userSwitcher = containerEl.createDiv({ cls: "kid-score-user-switcher" });
  plugin.settings.users.forEach((u) => {
    const uBtn = userSwitcher.createEl("button", {
      cls: "kid-score-user-btn" + (u.id === plugin.settings.currentUserId ? " is-active" : ""),
      text: u.name
    });
    if (plugin.settings.users.length > 1) {
      uBtn.onclick = async () => {
        try {
          await onSwitchUser(u.id);
        } catch (e) {
          new import_obsidian5.Notice("\u274C \u5207\u6362\u7528\u6237\u5931\u8D25\uFF1A" + (e instanceof Error ? e.message : String(e)));
        }
      };
    }
  });
}
function renderMainTabs({
  containerEl,
  onShowScore,
  onShowDiary
}) {
  const mainTabs = containerEl.createDiv({ cls: "kid-score-main-tabs" });
  const scoreTab = mainTabs.createEl("button", {
    text: "\u2B50 \u6253\u5206",
    cls: "kid-score-main-tab is-active"
  });
  const diaryTab = mainTabs.createEl("button", {
    text: "\u{1F4DD} \u65E5\u8BB0",
    cls: "kid-score-main-tab"
  });
  const scorePanel = containerEl.createDiv({ cls: "kid-score-tab-panel" });
  const diaryPanel = containerEl.createDiv({ cls: "kid-score-tab-panel is-hidden" });
  scoreTab.onclick = () => {
    scoreTab.addClass("is-active");
    diaryTab.removeClass("is-active");
    scorePanel.removeClass("is-hidden");
    diaryPanel.addClass("is-hidden");
    onShowScore();
  };
  diaryTab.onclick = () => {
    diaryTab.addClass("is-active");
    scoreTab.removeClass("is-active");
    diaryPanel.removeClass("is-hidden");
    scorePanel.addClass("is-hidden");
    onShowDiary();
  };
  return { scorePanel, diaryPanel };
}
function renderBottomActions({
  containerEl,
  onPreview,
  onSave,
  onStats,
  bindDiaryActions
}) {
  const actions = containerEl.createDiv({ cls: "kid-score-actions" });
  const previewBtn = actions.createEl("button", {
    text: "\u67E5\u770B\u9884\u89C8",
    cls: "kid-score-preview-btn"
  });
  const saveBtn = actions.createEl("button", {
    text: "\u{1F4BE} \u4FDD\u5B58\u8BB0\u5F55",
    cls: "mod-cta kid-score-save-btn"
  });
  const statsBtn = actions.createEl("button", {
    text: "\u{1F4CA} \u67E5\u770B\u7EDF\u8BA1",
    cls: "kid-score-stats-btn"
  });
  bindDiaryActions({ previewBtn, saveBtn, statsBtn, actions });
  previewBtn.onclick = onPreview;
  saveBtn.onclick = () => void onSave();
  statsBtn.onclick = onStats;
}

// src/modals/helpers/press-gesture.ts
function attachPressGesture({
  element,
  longPressMs,
  isTouchMode,
  onLongPress,
  onSingleTap,
  onDoubleTap,
  getDoubleTapThreshold,
  shouldIgnoreTarget
}) {
  let pressTimer = null;
  let clickTimer = null;
  let isLongPress = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let lastTapAt = 0;
  const ignoreTarget = (target) => shouldIgnoreTarget ? shouldIgnoreTarget(target) : false;
  element.addEventListener("pointerdown", (e) => {
    if (ignoreTarget(e.target)) return;
    isLongPress = false;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    if (!onLongPress) return;
    pressTimer = setTimeout(() => {
      if (!hasMoved) {
        isLongPress = true;
        onLongPress();
      }
    }, longPressMs);
  });
  element.addEventListener("pointermove", (e) => {
    if (!hasMoved && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
      hasMoved = true;
      if (pressTimer) clearTimeout(pressTimer);
    }
  });
  element.addEventListener("pointerup", (e) => {
    if (pressTimer) clearTimeout(pressTimer);
    if (ignoreTarget(e.target) || isLongPress || hasMoved) return;
    if (isTouchMode) {
      onSingleTap == null ? void 0 : onSingleTap();
      return;
    }
    if (!onDoubleTap) {
      onSingleTap == null ? void 0 : onSingleTap();
      return;
    }
    const now = Date.now();
    const threshold = getDoubleTapThreshold ? getDoubleTapThreshold() : 260;
    if (lastTapAt && now - lastTapAt <= threshold) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      lastTapAt = 0;
      onDoubleTap();
      return;
    }
    lastTapAt = now;
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
    if (onSingleTap) {
      clickTimer = setTimeout(() => {
        onSingleTap();
        clickTimer = null;
        lastTapAt = 0;
      }, threshold + 20);
    }
  });
  element.addEventListener("pointercancel", () => {
    if (pressTimer) clearTimeout(pressTimer);
    hasMoved = true;
    lastTapAt = 0;
  });
  element.addEventListener("pointerleave", () => {
    if (pressTimer) clearTimeout(pressTimer);
  });
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

// src/modals/panels/score-items-panel.ts
function renderScoreCard({
  item,
  grid,
  yesterdayData,
  getScore,
  isTouchMode,
  longPressMs,
  getDoubleTapThreshold,
  triggerHaptic,
  onToggleScore,
  onCustomValue
}) {
  const scoreVal = getScore(item.id);
  const isEarned = scoreVal > 0;
  const isNeg = scoreVal < 0 || scoreVal === 0 && item.points < 0;
  const isDeductItem = item.category === "\u51CF\u5206" || item.points < 0;
  const isDeductedActive = isDeductItem && scoreVal !== 0;
  const card = grid.createDiv({
    cls: "kid-score-card" + (isEarned ? " is-earned" : "") + (isNeg ? " is-negative" : "") + (isDeductedActive ? " is-deducted-active" : "")
  });
  card.dataset.itemId = item.id;
  const moreBtn = card.createEl("button", {
    cls: "kid-score-card-more-btn",
    text: "\u22EF"
  });
  moreBtn.setAttribute("aria-label", "\u8C03\u6574\u5206\u503C");
  moreBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCustomValue(item, false, card);
  };
  card.createDiv({ cls: "card-emoji", text: item.emoji });
  card.createDiv({ cls: "card-name", text: item.name });
  if (item.note) {
    card.createDiv({ cls: "card-note", text: item.note });
  }
  const pointsText = scoreVal !== 0 ? (scoreVal >= 0 ? "+" : "") + scoreVal + " \u5206" + (scoreVal !== item.points ? " \u{1F4DD}" : "") : (item.points >= 0 ? "+" : "") + item.points + " \u5206";
  card.createDiv({ cls: "card-points", text: pointsText });
  if (yesterdayData) {
    const yScore = yesterdayData.scores[item.id] || 0;
    const yClass = yScore > 0 ? "was-earned" : yScore < 0 ? "was-negative" : "was-missed";
    const ySign = yScore > 0 ? "+" : "";
    card.createDiv({
      cls: "card-yesterday " + yClass,
      text: "\u6628 " + ySign + yScore + " \u5206"
    });
  } else {
    card.createDiv({ cls: "card-yesterday was-missed", text: "\u6628 -" });
  }
  attachPressGesture({
    element: card,
    longPressMs,
    isTouchMode,
    getDoubleTapThreshold,
    shouldIgnoreTarget: (target) => target === moreBtn || moreBtn.contains(target),
    onLongPress: () => {
      triggerHaptic("longpress");
      onCustomValue(item, false, card);
    },
    onSingleTap: () => {
      onToggleScore(item);
    },
    onDoubleTap: () => {
      onCustomValue(item, true, card);
    }
  });
  return card;
}
function refreshScoreCard(card, item, scoreVal) {
  const isEarned = scoreVal > 0;
  const isNeg = scoreVal < 0 || scoreVal === 0 && item.points < 0;
  const isDeductItem = item.category === "\u51CF\u5206" || item.points < 0;
  const isDeductedActive = isDeductItem && scoreVal !== 0;
  card.classList.toggle("is-earned", isEarned);
  card.classList.toggle("is-negative", isNeg);
  card.classList.toggle("is-deducted-active", isDeductedActive);
  const pointsEl = card.querySelector(".card-points");
  if (pointsEl) {
    pointsEl.textContent = scoreVal !== 0 ? (scoreVal >= 0 ? "+" : "") + scoreVal + " \u5206" + (scoreVal !== item.points ? " \u{1F4DD}" : "") : (item.points >= 0 ? "+" : "") + item.points + " \u5206";
  }
}
function renderCustomItemsList({
  container,
  customItems,
  isTouchMode,
  longPressMs,
  onQuickAdjust,
  onEdit,
  onDelete
}) {
  container.empty();
  if (customItems.length === 0) {
    container.createDiv({ cls: "kid-score-custom-empty", text: "\u6682\u65E0\u4E34\u65F6\u4E8B\u9879" });
    return;
  }
  for (let i = 0; i < customItems.length; i++) {
    ((idx) => {
      const ci = customItems[idx];
      const wrap = container.createDiv({ cls: "kid-score-custom-wrap" });
      const row = wrap.createDiv({ cls: "kid-score-custom-row" });
      const main = row.createDiv({ cls: "kid-score-custom-main" });
      main.createSpan({ cls: "custom-emoji", text: ci.emoji });
      main.createSpan({ cls: "custom-name", text: ci.name });
      main.createSpan({
        cls: "custom-points " + (ci.points >= 0 ? "pos" : "neg"),
        text: (ci.points >= 0 ? "+" : "") + ci.points + " \u5206"
      });
      const quick = row.createEl("button", {
        cls: "custom-row-more-btn",
        text: "\u8C03\u5206"
      });
      quick.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickAdjust(idx);
      };
      const edit = row.createEl("button", { cls: "custom-edit-btn", text: "\u270F\uFE0F" });
      edit.onclick = (e) => {
        e.stopPropagation();
        onEdit(idx);
      };
      const del = row.createEl("button", { cls: "custom-delete-btn", text: "\u{1F5D1}" });
      del.onclick = (e) => {
        e.stopPropagation();
        onDelete(idx);
      };
      if (ci.note) {
        wrap.createDiv({ cls: "custom-item-note", text: ci.note });
      }
      attachPressGesture({
        element: row,
        longPressMs,
        isTouchMode,
        shouldIgnoreTarget: (target) => target === del || del.contains(target) || target === quick || quick.contains(target) || target === edit || edit.contains(target),
        onLongPress: () => {
          onEdit(idx);
        },
        onSingleTap: () => {
          onQuickAdjust(idx);
        },
        onDoubleTap: () => {
          onQuickAdjust(idx);
        }
      });
    })(i);
  }
}

// src/modals/panels/rules-section.ts
var import_obsidian6 = require("obsidian");
function renderRulesSection({
  app,
  component,
  plugin,
  container,
  onAfterRulesSaved
}) {
  const section = container.createDiv({ cls: "kid-score-rules-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", {
    cls: "kid-score-rules-toggle",
    text: "\u25B6"
  });
  header.createEl("span", { cls: "kid-score-rules-title", text: "\u{1F4CB} \u6253\u5206\u89C4\u5219" });
  const editBtn = header.createEl("button", {
    cls: "kid-score-rules-edit-btn",
    text: "\u270F\uFE0F"
  });
  const body = section.createDiv({ cls: "kid-score-rules-body" });
  const view = body.createDiv({ cls: "kid-score-rules-view" });
  const edit = body.createDiv({ cls: "kid-score-rules-edit is-hidden" });
  const textarea = edit.createEl("textarea", { cls: "kid-score-rules-textarea" });
  bindModalInputFocus(textarea);
  textarea.value = plugin.currentUser.scoringRules || "";
  const actions = edit.createDiv({ cls: "kid-score-rules-actions" });
  const saveBtn = actions.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "\u4FDD\u5B58\u89C4\u5219"
  });
  const cancelBtn = actions.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "\u53D6\u6D88"
  });
  const renderView = () => {
    view.empty();
    const text = plugin.currentUser.scoringRules || "";
    if (text.trim()) {
      import_obsidian6.MarkdownRenderer.render(app, text, view, "", component);
    } else {
      view.createEl("p", {
        cls: "kid-score-rules-empty",
        text: "\u6682\u65E0\u89C4\u5219\uFF0C\u70B9\u51FB \u270F\uFE0F \u6DFB\u52A0\u6253\u5206\u89C4\u5219"
      });
    }
  };
  renderView();
  let open = !!(plugin.currentUser.scoringRules && plugin.currentUser.scoringRules.trim());
  if (!open) {
    body.addClass("is-hidden");
  } else {
    toggle.textContent = "\u25BC";
  }
  header.addEventListener("click", (e) => {
    if (e.target === editBtn || editBtn.contains(e.target)) return;
    open = !open;
    toggle.textContent = open ? "\u25BC" : "\u25B6";
    body.toggleClass("is-hidden", !open);
  });
  let isEditing = false;
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isEditing = !isEditing;
    if (isEditing) {
      open = true;
      toggle.textContent = "\u25BC";
      body.removeClass("is-hidden");
      textarea.value = plugin.currentUser.scoringRules || "";
      view.addClass("is-hidden");
      edit.removeClass("is-hidden");
      textarea.focus();
    } else {
      view.removeClass("is-hidden");
      edit.addClass("is-hidden");
    }
  });
  saveBtn.addEventListener("click", async () => {
    plugin.currentUser.scoringRules = textarea.value;
    await plugin.saveSettings();
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
    renderView();
    onAfterRulesSaved();
    new import_obsidian6.Notice("\u2705 \u6253\u5206\u89C4\u5219\u5DF2\u4FDD\u5B58\uFF01");
  });
  cancelBtn.addEventListener("click", () => {
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
  });
  return section;
}

// src/modals/panels/score-category-sections.ts
function renderScoreCategorySections({
  plugin,
  container,
  yesterdayData,
  renderScoreCard: renderScoreCard2,
  onAddItem
}) {
  const categories = plugin.currentUser.categories || [];
  let catRendered = false;
  for (const category of categories) {
    const items = plugin.currentUser.items.filter((item) => item.category === category);
    if (items.length === 0) continue;
    if (catRendered) {
      container.createEl("hr", { cls: "kid-score-divider" });
    }
    const header = container.createDiv({ cls: "kid-score-cat-header" });
    header.createEl("h3", { text: category, cls: "kid-score-section-title" });
    const addItemBtn = header.createEl("button", {
      text: "+",
      cls: "kid-score-add-item-btn"
    });
    addItemBtn.onclick = () => onAddItem(category);
    const grid = container.createDiv({ cls: "kid-score-grid" });
    for (const item of items) {
      renderScoreCard2(item, grid, yesterdayData);
    }
    catRendered = true;
  }
  const uncategorized = plugin.currentUser.items.filter(
    (item) => !item.category || categories.indexOf(item.category) === -1
  );
  if (uncategorized.length > 0) {
    if (catRendered) {
      container.createEl("hr", { cls: "kid-score-divider" });
    }
    container.createEl("h3", { text: "\u5176\u4ED6", cls: "kid-score-section-title" });
    const grid = container.createDiv({ cls: "kid-score-grid" });
    for (const item of uncategorized) {
      renderScoreCard2(item, grid, yesterdayData);
    }
    catRendered = true;
  }
  return catRendered;
}

// src/modals/panels/score-panel.ts
function renderScorePanel({
  app,
  component,
  plugin,
  scorePanel,
  yesterdayData,
  isTouchOptimizedMode,
  renderScoreCard: renderScoreCard2,
  renderCustomItems,
  onAddItem,
  onAddCustom,
  onSetTotalDisplay,
  onAfterRulesSaved
}) {
  if (plugin.currentUser.items.length === 0) {
    scorePanel.createEl("div", {
      cls: "kid-score-empty",
      text: "\u26A0\uFE0F \u8FD8\u6CA1\u6709\u8BBE\u7F6E\u6253\u5206\u9879\u76EE\uFF0C\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u6DFB\u52A0\uFF01"
    });
    return null;
  }
  renderRulesSection({
    app,
    component,
    plugin,
    container: scorePanel,
    onAfterRulesSaved
  });
  if (yesterdayData) {
    const ySign = yesterdayData.total >= 0 ? "+" : "";
    scorePanel.createDiv({
      cls: "kid-score-yesterday-banner",
      text: "\u{1F4CA} \u6628\u5929\uFF08" + yesterdayData.date + "\uFF09\u603B\u5206\uFF1A" + ySign + yesterdayData.total + " \u5206"
    });
  }
  const itemsContainer = scorePanel.createDiv({ cls: "kid-score-items" });
  itemsContainer.createDiv({
    cls: "kid-score-hint",
    text: isTouchOptimizedMode ? "\u{1F4A1} \u70B9\u4E00\u4E0B\u8BB0\u5206\uFF0C\u957F\u6309\u6216\u70B9\u53F3\u4E0A\u89D2\u6309\u94AE\u8C03\u6574\u5206\u503C" : "\u{1F4A1} \u4E0B\u65B9\u6253\u5206\u9879\uFF1A\u70B9\u51FB\u6253\u5206 \xB7 \u957F\u6309\u81EA\u5B9A\u4E49\u5206\u503C"
  });
  const totalDisplay = scorePanel.createDiv({ cls: "kid-score-total-display" });
  onSetTotalDisplay(totalDisplay);
  const catRendered = renderScoreCategorySections({
    plugin,
    container: itemsContainer,
    yesterdayData,
    renderScoreCard: renderScoreCard2,
    onAddItem
  });
  if (catRendered) {
    itemsContainer.createEl("hr", { cls: "kid-score-divider" });
  }
  itemsContainer.createEl("h3", { text: "\u{1F4CC} \u4E34\u65F6\u4E8B\u9879", cls: "kid-score-section-title" });
  const customItemsContainer = itemsContainer.createDiv({ cls: "kid-score-custom-items" });
  renderCustomItems();
  const addCustomBtn = itemsContainer.createEl("button", {
    text: "\uFF0B \u6DFB\u52A0\u4E34\u65F6\u52A0\u51CF\u5206",
    cls: "kid-score-add-custom-btn"
  });
  addCustomBtn.onclick = () => onAddCustom();
  return { totalDisplay, customItemsContainer };
}

// src/modals/daily-scoring-modal.ts
var DailyScoringModal = class extends BaseMobileModal {
  constructor(app, plugin, initialDate) {
    super(app, plugin);
    this.scores = {};
    this.customItems = [];
    this.diaryContent = "";
    this.totalDisplay = null;
    this.customItemsContainer = null;
    this.diaryTextarea = null;
    this.diaryModules = {};
    this.diaryControls = null;
    this.activeTab = "score";
    this.enableKeyboardAdjustment = false;
    this.dateStr = initialDate || formatDate(0);
  }
  onOpen() {
    super.onOpen();
    this.renderModal();
  }
  isTouchOptimizedMode() {
    return this.mobilePlatform !== "desktop";
  }
  async renderModal() {
    const self = this;
    const contentEl = this.contentEl;
    contentEl.empty();
    contentEl.addClass("kid-score-modal", "kid-score-daily-modal");
    this.scores = {};
    this.customItems = [];
    this.diaryContent = "";
    this.diaryModules = {};
    this.diaryControls = null;
    const state = await loadDailyModalState(this.plugin, this.dateStr);
    const yesterdayData = state.yesterdayData;
    this.scores = state.scores;
    this.customItems = state.customItems;
    this.diaryContent = state.diaryContent;
    this.diaryModules = state.diaryModules;
    renderDailyHeader({
      containerEl: contentEl,
      plugin: this.plugin,
      dateStr: this.dateStr,
      allScores: state.allScores,
      onPrevDay: () => {
        const d = /* @__PURE__ */ new Date(self.dateStr + "T00:00:00");
        d.setDate(d.getDate() - 1);
        self.dateStr = d.toISOString().slice(0, 10);
        self.renderModal();
      },
      onNextDay: () => {
        const d = /* @__PURE__ */ new Date(self.dateStr + "T00:00:00");
        d.setDate(d.getDate() + 1);
        self.dateStr = d.toISOString().slice(0, 10);
        self.renderModal();
      },
      onCalendar: () => self.showCalendarPicker(),
      onGoToday: () => {
        self.dateStr = formatDate(0);
        self.renderModal();
      },
      onSwitchUser: async (userId) => {
        self.plugin.settings.currentUserId = userId;
        await self.plugin.saveSettings();
        await self.renderModal();
      }
    });
    const { scorePanel, diaryPanel } = renderMainTabs({
      containerEl: contentEl,
      onShowScore: () => {
        self.syncDiaryContent();
        self.activeTab = "score";
        contentEl.scrollTop = 0;
      },
      onShowDiary: () => {
        self.activeTab = "diary";
        contentEl.scrollTop = 0;
      }
    });
    const renderedScorePanel = renderScorePanel({
      app: this.app,
      component: this,
      plugin: this.plugin,
      scorePanel,
      yesterdayData,
      isTouchOptimizedMode: this.isTouchOptimizedMode(),
      renderScoreCard: (item, grid, previousDay) => this.renderScoreCard(item, grid, previousDay),
      renderCustomItems: () => this.renderCustomItems(),
      onAddItem: (category) => self.showAddItemPopup(category),
      onAddCustom: () => self.showAddCustomItemForm(),
      onSetTotalDisplay: (element) => {
        this.totalDisplay = element;
      },
      onAfterRulesSaved: () => this.updateTotalDisplay()
    });
    this.customItemsContainer = (renderedScorePanel == null ? void 0 : renderedScorePanel.customItemsContainer) || null;
    this.updateTotalDisplay();
    this.diaryControls = buildDiaryPanel({
      app: this.app,
      plugin: this.plugin,
      component: this,
      panel: diaryPanel,
      diaryContent: this.diaryContent,
      diaryModules: this.diaryModules,
      setDiaryTextarea: (textarea) => {
        this.diaryTextarea = textarea;
      },
      updateDiaryContent: (content) => {
        this.diaryContent = content;
      },
      updateDiaryModules: (values) => {
        this.diaryModules = values;
      },
      composeDiaryContent: () => this.syncDiaryContent(),
      insertAttachment: (label, ext) => this.insertAttachment(label, ext),
      insertDiaryText: (text) => this.insertTextAtCursor(text),
      wrapDiarySelection: (prefix, suffix, placeholder) => this.wrapDiarySelection(prefix, suffix, placeholder)
    });
    renderBottomActions({
      containerEl: contentEl,
      onPreview: () => {
        var _a;
        (_a = this.diaryControls) == null ? void 0 : _a.togglePreview();
      },
      onSave: async () => {
        self.syncDiaryContent();
        try {
          await self.plugin.saveDayData(self.dateStr, self.scores, self.customItems, self.diaryContent);
          self.close();
        } catch (e) {
          new import_obsidian7.Notice("\u274C \u4FDD\u5B58\u5931\u8D25\uFF1A" + (e instanceof Error ? e.message : String(e)));
        }
      },
      onStats: () => {
        self.close();
        new StatsModal(self.app, self.plugin).open();
      },
      bindDiaryActions: (buttons) => {
        var _a;
        return (_a = this.diaryControls) == null ? void 0 : _a.bindActionButtons(buttons);
      }
    });
  }
  syncDiaryContent() {
    const moduleConfig = this.plugin.currentUser.diaryModules && this.plugin.currentUser.diaryModules.length ? this.plugin.currentUser.diaryModules : makeDefaultDiaryModules();
    this.diaryContent = composeDiaryContent(this.diaryModules || {}, moduleConfig);
    return this.diaryContent;
  }
  insertTextAtCursor(text) {
    if (!this.diaryTextarea) return;
    const ta = this.diaryTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    this.diaryModules.freeWrite = ta.value;
    this.syncDiaryContent();
    ta.focus();
  }
  wrapDiarySelection(prefix, suffix = "", placeholder = "") {
    if (!this.diaryTextarea) return;
    const ta = this.diaryTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const body = selected || placeholder;
    const text = prefix + body + suffix;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    const cursorPos = start + text.length;
    ta.selectionStart = ta.selectionEnd = cursorPos;
    this.diaryModules.freeWrite = ta.value;
    this.syncDiaryContent();
    ta.focus();
  }
  insertAttachment(label, ext) {
    openAttachmentInsertModal({
      app: this.app,
      plugin: this.plugin,
      label,
      ext,
      dateStr: this.dateStr,
      onInsert: (text) => this.insertTextAtCursor(text)
    });
  }
  renderScoreCard(item, grid, yesterdayData) {
    return renderScoreCard({
      item,
      grid,
      yesterdayData,
      getScore: (itemId) => this.scores[itemId] || 0,
      isTouchMode: this.isTouchOptimizedMode(),
      longPressMs: this.getLongPressDuration(),
      getDoubleTapThreshold: () => this.plugin.getDoubleTapThreshold(),
      triggerHaptic: (style) => this.triggerHaptic(style),
      onToggleScore: (targetItem) => {
        this.scores[targetItem.id] = this.scores[targetItem.id] === 0 ? targetItem.points : 0;
        this.refreshCardByItem(targetItem);
        this.updateTotalDisplay();
      },
      onCustomValue: (targetItem, quickOnly, card) => {
        this.showCustomValuePopup(
          targetItem,
          (v) => {
            this.scores[targetItem.id] = v;
            refreshScoreCard(card, targetItem, this.scores[targetItem.id] || 0);
            this.updateTotalDisplay();
          },
          quickOnly
        );
      }
    });
  }
  refreshCardByItem(item) {
    const card = this.contentEl.querySelector('.kid-score-card[data-item-id="' + item.id + '"]');
    if (!card) return;
    refreshScoreCard(card, item, this.scores[item.id] || 0);
  }
  showCustomValuePopup(item, callback, quickOnly = false) {
    openScoreItemValueModal({
      app: this.app,
      plugin: this.plugin,
      item,
      currentValue: this.scores[item.id] || item.points,
      quickOnly,
      onValue: callback,
      onRefresh: async () => {
        await this.renderModal();
      }
    });
  }
  showAddItemPopup(category) {
    openAddItemModal(this.app, this.plugin, category, async () => {
      await this.renderModal();
    });
  }
  renderCustomItems() {
    const self = this;
    const container = this.customItemsContainer;
    if (!container) return;
    renderCustomItemsList({
      container,
      customItems: this.customItems,
      isTouchMode: this.isTouchOptimizedMode(),
      longPressMs: this.getLongPressDuration(),
      onQuickAdjust: (idx) => self.showQuickCustomScorePopup(idx),
      onEdit: (idx) => self.showEditCustomItemPopup(idx),
      onDelete: (idx) => {
        const ci = self.customItems[idx];
        if (!ci) return;
        if (!confirm("\u786E\u5B9A\u5220\u9664\u4E34\u65F6\u4E8B\u9879\u300C" + ci.name + "\u300D\u5417\uFF1F")) return;
        self.customItems.splice(idx, 1);
        self.renderCustomItems();
        self.updateTotalDisplay();
      }
    });
  }
  showAddCustomItemForm() {
    openAddCustomItemModal({
      app: this.app,
      plugin: this.plugin,
      onSubmit: (emoji, name, points, note) => {
        this.customItems.push({
          id: "custom_" + Date.now(),
          emoji,
          name,
          points,
          note
        });
        this.renderCustomItems();
        this.updateTotalDisplay();
      }
    });
  }
  showEditCustomItemPopup(idx) {
    openEditCustomItemModal({
      app: this.app,
      plugin: this.plugin,
      customItem: this.customItems[idx],
      onSubmit: (emoji, name, points, note) => {
        this.customItems[idx].emoji = emoji;
        this.customItems[idx].name = name;
        this.customItems[idx].points = points;
        this.customItems[idx].note = note;
        this.renderCustomItems();
        this.updateTotalDisplay();
      }
    });
  }
  showQuickCustomScorePopup(idx) {
    openQuickCustomAdjustModal({
      app: this.app,
      plugin: this.plugin,
      customItem: this.customItems[idx],
      onSubmit: (points) => {
        this.customItems[idx].points = points;
        this.renderCustomItems();
        this.updateTotalDisplay();
      }
    });
  }
  async showCalendarPicker() {
    const allScores = await this.plugin.getAllScores();
    openCalendarPicker({
      currentDate: this.dateStr,
      recordDates: new Set(allScores.map((s) => s.date)),
      onSelect: (dateStr) => {
        this.dateStr = dateStr;
        this.renderModal();
      }
    });
  }
  updateTotalDisplay() {
    var _a;
    if (!this.totalDisplay) return;
    renderDailyTotalDisplay({
      element: this.totalDisplay,
      items: this.plugin.currentUser.items,
      scores: this.scores,
      customItems: this.customItems,
      dailyGoal: ((_a = this.plugin.currentUser.goals) == null ? void 0 : _a.daily) || 1
    });
  }
};

// src/settings/settings-tab.ts
var import_obsidian17 = require("obsidian");

// src/settings/category-settings.ts
var import_obsidian9 = require("obsidian");

// src/settings/category-settings-list.ts
var import_obsidian8 = require("obsidian");
function renderCategorySettingsList({
  plugin,
  catWrap,
  bindSettingsInput,
  refreshItems
}) {
  const dragState = {
    dragging: false,
    dragIdx: -1,
    placeholder: null,
    ghost: null,
    rows: []
  };
  const getDragRowIndex = (y) => {
    for (let index = 0; index < dragState.rows.length; index++) {
      const rect = dragState.rows[index].getBoundingClientRect();
      if (y < rect.top + rect.height / 2) return index;
    }
    return dragState.rows.length;
  };
  const onDragMove = (clientY) => {
    var _a;
    if (!dragState.dragging) return;
    if (dragState.ghost) dragState.ghost.style.top = clientY - 20 + "px";
    const targetIdx = getDragRowIndex(clientY);
    const parent = (_a = dragState.rows[0]) == null ? void 0 : _a.parentElement;
    if (!parent || !dragState.placeholder) return;
    if (targetIdx >= dragState.rows.length) parent.appendChild(dragState.placeholder);
    else parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
  };
  const pointerMoveHandler = (e) => {
    onDragMove(e.clientY);
  };
  const pointerCancelHandler = () => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    dragState.dragging = false;
    if (dragState.ghost) {
      dragState.ghost.remove();
      dragState.ghost = null;
    }
    if (dragState.placeholder) {
      dragState.placeholder.remove();
      dragState.placeholder = null;
    }
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    renderCategories();
  };
  const onDragEnd = (clientY) => {
    if (!dragState.dragging) return;
    dragState.dragging = false;
    if (dragState.ghost) dragState.ghost.remove();
    if (dragState.placeholder) dragState.placeholder.remove();
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    const targetIdx = getDragRowIndex(clientY);
    let fromIdx = dragState.dragIdx;
    if (targetIdx > fromIdx) fromIdx--;
    const arr = plugin.currentUser.categories;
    if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < arr.length) {
      const moved = arr.splice(fromIdx, 1)[0];
      arr.splice(targetIdx, 0, moved);
      (async () => {
        await plugin.saveSettings();
        renderCategories();
        refreshItems();
      })();
    } else {
      renderCategories();
    }
  };
  const pointerUpHandler = (e) => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    onDragEnd(e.clientY);
  };
  const startDrag = (idx, row, clientY) => {
    dragState.dragging = true;
    dragState.dragIdx = idx;
    dragState.rows = Array.from(
      catWrap.querySelectorAll(".kid-score-cat-row")
    );
    const rect = row.getBoundingClientRect();
    const ghost = row.cloneNode(true);
    ghost.className = "kid-score-cat-row settings-drag-ghost";
    ghost.style.cssText = "position:fixed;left:" + rect.left + "px;top:" + (clientY - 20) + "px;width:" + rect.width + "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;";
    document.body.appendChild(ghost);
    dragState.ghost = ghost;
    const placeholder = document.createElement("div");
    placeholder.className = "settings-drag-placeholder";
    placeholder.style.cssText = "height:" + rect.height + "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
    if (row.parentElement) row.parentElement.insertBefore(placeholder, row);
    dragState.placeholder = placeholder;
    row.style.display = "none";
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("pointercancel", pointerCancelHandler);
  };
  const renderCategories = () => {
    catWrap.empty();
    dragState.rows = [];
    const categories = plugin.currentUser.categories || [];
    for (let idx = 0; idx < categories.length; idx++) {
      const row = catWrap.createDiv({ cls: "kid-score-cat-row" });
      const handle = row.createEl("span", {
        cls: "settings-drag-handle",
        text: "\u2630"
      });
      handle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        startDrag(idx, row, e.clientY);
      });
      const input = row.createEl("input", { cls: "settings-name-input" });
      bindSettingsInput(input);
      input.value = categories[idx];
      input.onchange = async () => {
        const oldName = plugin.currentUser.categories[idx];
        const newName = input.value.trim();
        if (!newName) return;
        plugin.currentUser.categories[idx] = newName;
        for (const item of plugin.currentUser.items) {
          if (item.category === oldName) item.category = newName;
        }
        await plugin.saveSettings();
        refreshItems();
      };
      const delBtn = row.createEl("button", {
        cls: "settings-delete-btn",
        text: "\u{1F5D1}"
      });
      delBtn.onclick = async () => {
        const removedCategory = plugin.currentUser.categories[idx];
        if (!confirm(
          "\u786E\u5B9A\u5220\u9664\u5206\u7C7B\u300C" + removedCategory + "\u300D\u5417\uFF1F\u8BE5\u5206\u7C7B\u4E0B\u7684\u9879\u76EE\u5C06\u81EA\u52A8\u5F52\u5165\u7B2C\u4E00\u4E2A\u5206\u7C7B\u3002"
        )) {
          return;
        }
        try {
          plugin.currentUser.categories.splice(idx, 1);
          const fallback = plugin.currentUser.categories[0] || "\u5176\u4ED6";
          for (const item of plugin.currentUser.items) {
            if (item.category === removedCategory) item.category = fallback;
          }
          await plugin.saveSettings();
          renderCategories();
          refreshItems();
        } catch (error) {
          new import_obsidian8.Notice(
            "\u274C \u5220\u9664\u5931\u8D25\uFF1A" + (error instanceof Error ? error.message : String(error))
          );
        }
      };
      dragState.rows.push(row);
    }
  };
  renderCategories();
}

// src/settings/category-settings.ts
function renderCategorySettings({
  plugin,
  containerEl,
  bindSettingsInput,
  refreshItems
}) {
  const catHeaderWrap = containerEl.createDiv({ cls: "kid-score-section-header" });
  catHeaderWrap.createEl("h3", { text: "\u{1F4C1} \u5206\u7C7B\u7BA1\u7406" });
  catHeaderWrap.createSpan({ cls: "kid-score-section-desc", text: "\u53EF\u62D6\u62FD\u6392\u5E8F\uFF0C\u9879\u76EE\u4F1A\u6309\u5206\u7C7B\u5206\u7EC4\u663E\u793A" });
  const catWrap = containerEl.createDiv({ cls: "kid-score-cat-list" });
  const renderCategories = () => renderCategorySettingsList({
    plugin,
    catWrap,
    bindSettingsInput,
    refreshItems
  });
  renderCategories();
  new import_obsidian9.Setting(containerEl).setName("\u6DFB\u52A0\u5206\u7C7B").addButton(
    (btn) => btn.setButtonText("\uFF0B \u65B0\u5206\u7C7B").setCta().onClick(async () => {
      plugin.currentUser.categories.push("\u65B0\u5206\u7C7B");
      await plugin.saveSettings();
      renderCategories();
      refreshItems();
    })
  );
  new import_obsidian9.Setting(containerEl).setName("\u4FDD\u5B58\u5E76\u5237\u65B0").setDesc("\u4FDD\u5B58\u5206\u7C7B\u4FEE\u6539\uFF0C\u5237\u65B0\u4E0B\u65B9\u6253\u5206\u9879\u76EE\u7684\u5206\u7C7B\u4E0B\u62C9\u83DC\u5355").addButton(
    (btn) => btn.setButtonText("\u{1F504} \u4FDD\u5B58\u5E76\u5237\u65B0").onClick(async () => {
      await plugin.saveSettings();
      renderCategories();
      refreshItems();
      new import_obsidian9.Notice("\u2705 \u5206\u7C7B\u5DF2\u4FDD\u5B58\uFF0C\u6253\u5206\u9879\u76EE\u5DF2\u5237\u65B0");
    })
  );
}

// src/settings/diary-module-settings.ts
var import_obsidian10 = require("obsidian");
function renderDiaryModuleSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput
}) {
  const autoResize = (textarea, minHeight = 72) => {
    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(minHeight, textarea.scrollHeight) + "px";
    };
    requestAnimationFrame(resize);
    setTimeout(resize, 60);
    textarea.addEventListener("input", resize);
    textarea.addEventListener("focus", resize);
  };
  const section = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", { cls: "kid-score-rules-toggle", text: "\u25BC" });
  header.createEl("span", { cls: "kid-score-rules-title", text: "\u{1F9E9} \u65E5\u8BB0\u6A21\u5757" });
  header.createSpan({
    cls: "kid-score-rules-desc",
    text: "\u53EF\u4EE5\u81EA\u5B9A\u4E49\u663E\u793A\u5728\u6253\u5206\u9875\u7684\u5E38\u7528\u8BB0\u5F55\u6A21\u5757"
  });
  const body = section.createDiv({ cls: "kid-score-rules-body" });
  let isOpen = true;
  const ensureDiaryModules = () => {
    if (!Array.isArray(plugin.currentUser.diaryModules) || plugin.currentUser.diaryModules.length === 0) {
      plugin.currentUser.diaryModules = makeDefaultDiaryModules();
    }
  };
  const render = () => {
    ensureDiaryModules();
    body.empty();
    const hint = body.createEl("p", {
      cls: "kid-score-hint",
      text: "\u4F60\u53EF\u4EE5\u4FEE\u6539\u6A21\u5757\u540D\u79F0\u548C\u63D0\u793A\u6587\u6848\uFF0C\u4E5F\u53EF\u4EE5\u65B0\u589E\u6216\u5220\u9664\u6A21\u5757\u3002\u5929\u6C14/\u5FC3\u60C5\u4F1A\u4FDD\u7559\u5FEB\u6377 emoji \u529F\u80FD\u3002"
    });
    hint.style.marginBottom = "10px";
    const list = body.createDiv({ cls: "diary-module-settings-list" });
    plugin.currentUser.diaryModules.forEach((moduleDef, idx) => {
      const row = list.createDiv({ cls: "diary-module-settings-row" });
      const main = row.createDiv({ cls: "diary-module-settings-main" });
      const meta = row.createDiv({ cls: "diary-module-settings-meta" });
      const actions2 = row.createDiv({ cls: "diary-module-settings-actions" });
      const emojiField = main.createDiv({ cls: "diary-module-settings-field is-emoji" });
      emojiField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "\u6A21\u5757\u56FE\u6807"
      });
      const emojiBtn = emojiField.createEl("button", {
        cls: "settings-emoji-btn diary-module-settings-emoji-btn",
        text: moduleDef.emoji || "\u{1F4DD}"
      });
      emojiBtn.type = "button";
      emojiBtn.onclick = () => {
        showEmojiPicker(async (emoji) => {
          plugin.currentUser.diaryModules[idx].emoji = emoji;
          await plugin.saveSettings();
          emojiBtn.textContent = emoji;
        }, containerEl);
      };
      const labelField = main.createDiv({ cls: "diary-module-settings-field" });
      labelField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "\u6A21\u5757\u540D\u79F0"
      });
      const labelInput = labelField.createEl("input", {
        cls: "diary-module-settings-input",
        type: "text"
      });
      labelInput.value = moduleDef.label || "";
      labelInput.placeholder = "\u6A21\u5757\u540D\u79F0";
      bindSettingsInput(labelInput);
      labelInput.onchange = async () => {
        plugin.currentUser.diaryModules[idx].label = labelInput.value.trim() || moduleDef.label || "\u65B0\u6A21\u5757";
        await plugin.saveSettings();
        render();
      };
      const placeholderField = main.createDiv({
        cls: "diary-module-settings-field is-wide"
      });
      placeholderField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "\u63D0\u793A\u6587\u6848"
      });
      const placeholderInput = placeholderField.createEl("textarea", {
        cls: "diary-module-settings-input is-wide diary-module-settings-textarea"
      });
      placeholderInput.value = moduleDef.placeholder || "";
      placeholderInput.placeholder = "\u63D0\u793A\u6587\u6848";
      placeholderInput.rows = 2;
      autoResize(placeholderInput, 78);
      bindSettingsInput(placeholderInput);
      placeholderInput.onchange = async () => {
        plugin.currentUser.diaryModules[idx].placeholder = placeholderInput.value.trim();
        await plugin.saveSettings();
      };
      const kindField = meta.createDiv({ cls: "diary-module-settings-field" });
      kindField.createEl("label", {
        cls: "diary-module-settings-field-label",
        text: "\u8BB0\u5F55\u5F62\u5F0F"
      });
      const kindSelect = kindField.createEl("select", {
        cls: "diary-module-settings-select"
      });
      [
        { value: "quick", label: "\u5355\u884C\u5FEB\u6377" },
        { value: "multi", label: "\u591A\u884C\u8BB0\u5F55" }
      ].forEach((optionDef) => {
        const opt = kindSelect.createEl("option", {
          text: optionDef.label,
          value: optionDef.value
        });
        if ((moduleDef.kind || "multi") === optionDef.value) opt.selected = true;
      });
      kindSelect.onchange = async () => {
        plugin.currentUser.diaryModules[idx].kind = kindSelect.value;
        await plugin.saveSettings();
      };
      const delBtn = actions2.createEl("button", {
        cls: "settings-delete-btn",
        text: "\u{1F5D1}"
      });
      delBtn.onclick = async () => {
        plugin.currentUser.diaryModules.splice(idx, 1);
        await plugin.saveSettings();
        render();
      };
    });
    const actions = body.createDiv({ cls: "kid-score-rules-actions" });
    const addBtn = actions.createEl("button", {
      cls: "mod-cta kid-score-rules-save-btn",
      text: "\uFF0B \u65B0\u589E\u6A21\u5757"
    });
    addBtn.onclick = async () => {
      plugin.currentUser.diaryModules.push({
        id: "module_" + Date.now(),
        emoji: "\u{1F4DD}",
        label: "\u65B0\u6A21\u5757",
        placeholder: "\u8FD9\u91CC\u5199\u4E00\u70B9\u4ECA\u5929\u7684\u8BB0\u5F55",
        kind: "multi"
      });
      await plugin.saveSettings();
      render();
    };
    const resetBtn = actions.createEl("button", {
      cls: "kid-score-rules-cancel-btn",
      text: "\u6062\u590D\u9ED8\u8BA4\u6A21\u5757"
    });
    resetBtn.onclick = async () => {
      plugin.currentUser.diaryModules = makeDefaultDiaryModules();
      await plugin.saveSettings();
      render();
      new import_obsidian10.Notice("\u2705 \u5DF2\u6062\u590D\u9ED8\u8BA4\u65E5\u8BB0\u6A21\u5757");
    };
  };
  render();
  header.addEventListener("click", () => {
    isOpen = !isOpen;
    toggle.textContent = isOpen ? "\u25BC" : "\u25B6";
    body.toggleClass("is-hidden", !isOpen);
  });
}

// src/settings/rules-settings-section.ts
var import_obsidian11 = require("obsidian");
function renderRulesSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput
}) {
  const section = containerEl.createDiv({ cls: "kid-score-rules-section" });
  const header = section.createDiv({ cls: "kid-score-rules-header" });
  const toggle = header.createEl("span", {
    cls: "kid-score-rules-toggle",
    text: "\u25B6"
  });
  header.createEl("span", { cls: "kid-score-rules-title", text: "\u{1F4CB} \u6253\u5206\u89C4\u5219" });
  header.createSpan({
    cls: "kid-score-rules-desc",
    text: "\u4FEE\u6539\u540E\u540C\u6B65\u5230\u6253\u5206\u9875"
  });
  const editBtn = header.createEl("button", {
    cls: "kid-score-rules-edit-btn",
    text: "\u270F\uFE0F"
  });
  const body = section.createDiv({ cls: "kid-score-rules-body" });
  const view = body.createDiv({ cls: "kid-score-rules-view" });
  const edit = body.createDiv({ cls: "kid-score-rules-edit is-hidden" });
  const textarea = edit.createEl("textarea", {
    cls: "kid-score-rules-textarea"
  });
  textarea.placeholder = "\u4F8B\u5982\uFF1A\n- \u5B8C\u6210\u4F5C\u4E1A +2\n- \u4E3B\u52A8\u6536\u62FE\u73A9\u5177 +1\n- \u4E71\u53D1\u813E\u6C14 -2";
  bindSettingsInput(textarea);
  textarea.value = plugin.currentUser.scoringRules || "";
  const actions = edit.createDiv({ cls: "kid-score-rules-actions" });
  const saveBtn = actions.createEl("button", {
    cls: "mod-cta kid-score-rules-save-btn",
    text: "\u4FDD\u5B58\u89C4\u5219"
  });
  const cancelBtn = actions.createEl("button", {
    cls: "kid-score-rules-cancel-btn",
    text: "\u53D6\u6D88"
  });
  const renderView = () => {
    view.empty();
    const text = plugin.currentUser.scoringRules || "";
    if (text.trim()) {
      import_obsidian11.MarkdownRenderer.render(plugin.app, text, view, "", plugin);
    } else {
      view.createEl("p", {
        cls: "kid-score-rules-empty",
        text: "\u6682\u65E0\u89C4\u5219\uFF0C\u70B9\u51FB \u270F\uFE0F \u6DFB\u52A0\u6253\u5206\u89C4\u5219"
      });
    }
  };
  renderView();
  let open = !!(plugin.currentUser.scoringRules && plugin.currentUser.scoringRules.trim());
  if (!open) {
    body.addClass("is-hidden");
  } else {
    toggle.textContent = "\u25BC";
  }
  header.addEventListener("click", (e) => {
    if (e.target === editBtn || editBtn.contains(e.target)) return;
    open = !open;
    toggle.textContent = open ? "\u25BC" : "\u25B6";
    body.toggleClass("is-hidden", !open);
  });
  let isEditing = false;
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isEditing = !isEditing;
    if (isEditing) {
      open = true;
      toggle.textContent = "\u25BC";
      body.removeClass("is-hidden");
      textarea.value = plugin.currentUser.scoringRules || "";
      view.addClass("is-hidden");
      edit.removeClass("is-hidden");
      textarea.focus();
    } else {
      view.removeClass("is-hidden");
      edit.addClass("is-hidden");
    }
  });
  saveBtn.addEventListener("click", async () => {
    plugin.currentUser.scoringRules = textarea.value;
    await plugin.saveSettings();
    renderView();
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
    new import_obsidian11.Notice("\u2705 \u89C4\u5219\u5DF2\u4FDD\u5B58");
  });
  cancelBtn.addEventListener("click", () => {
    isEditing = false;
    view.removeClass("is-hidden");
    edit.addClass("is-hidden");
  });
}

// src/settings/content-sections.ts
function renderContentSettingsSections({
  plugin,
  containerEl,
  bindSettingsInput
}) {
  renderRulesSettingsSection({
    plugin,
    containerEl,
    bindSettingsInput
  });
  renderDiaryModuleSettingsSection({
    plugin,
    containerEl,
    bindSettingsInput
  });
}

// src/settings/goal-settings-section.ts
var import_obsidian12 = require("obsidian");
function renderGoalSettingsSection({
  plugin,
  containerEl,
  bindSettingsInput
}) {
  const goalsWrap = containerEl.createDiv({ cls: "kid-score-goals-section" });
  goalsWrap.createEl("h3", { text: "\u{1F3AF} \u6BCF\u65E5\u76EE\u6807" });
  goalsWrap.createEl("p", {
    cls: "kid-score-hint",
    text: "\u4EE5\u5B8C\u6210\u9879\u76EE\u6570\u4E3A\u7EDF\u8BA1\u6807\u51C6\uFF08\u542B\u52A0\u5206\u9879\u3001\u51CF\u5206\u9879\u548C\u4E34\u65F6\u4E8B\u9879\uFF09"
  });
  const goalsGrid = goalsWrap.createDiv({ cls: "kid-score-goals-grid" });
  const goalFields = [
    { key: "daily", label: "\u6BCF\u65E5\u76EE\u6807" },
    { key: "weekly", label: "\u6BCF\u5468\u76EE\u6807" },
    { key: "monthly", label: "\u6BCF\u6708\u76EE\u6807" }
  ];
  for (const goalField of goalFields) {
    const cell = goalsGrid.createDiv({ cls: "kid-score-goal-cell" });
    cell.createEl("label", { text: goalField.label });
    const input = cell.createEl("input", { cls: "kid-score-goal-input" });
    input.type = "number";
    input.min = "1";
    input.value = String(plugin.currentUser.goals[goalField.key] || 1);
    bindSettingsInput(input);
    input.onchange = async () => {
      const value = parseInt(input.value, 10);
      if (Number.isFinite(value) && value > 0) {
        plugin.currentUser.goals[goalField.key] = value;
        await plugin.saveSettings();
        new import_obsidian12.Notice("\u2705 " + goalField.label + "\u5DF2\u66F4\u65B0\u4E3A " + value);
      }
    };
  }
}

// src/settings/import-export-settings.ts
var import_obsidian13 = require("obsidian");
function renderImportExportSettings({
  plugin,
  containerEl,
  refresh
}) {
  containerEl.createEl("h3", { text: "\u{1F4E6} \u5BFC\u51FA / \u5BFC\u5165\u914D\u7F6E" });
  new import_obsidian13.Setting(containerEl).setName("\u5BFC\u51FA\u6253\u5206\u9879\u914D\u7F6E").setDesc("\u5C06\u6240\u6709\u5206\u7C7B\u548C\u6253\u5206\u9879\u5BFC\u51FA\u4E3A JSON \u6587\u4EF6").addButton((btn) => {
    btn.setButtonText("\u{1F4E4} \u5BFC\u51FA").onClick(() => {
      const data = { categories: plugin.currentUser.categories, items: plugin.currentUser.items };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "little-milestones-config.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  });
  new import_obsidian13.Setting(containerEl).setName("\u5BFC\u5165\u6253\u5206\u9879\u914D\u7F6E").setDesc("\u4ECE JSON \u6587\u4EF6\u5BFC\u5165\u5206\u7C7B\u548C\u6253\u5206\u9879\uFF08\u5C06\u8986\u76D6\u73B0\u6709\u914D\u7F6E\uFF09").addButton((btn) => {
    btn.setButtonText("\u{1F4E5} \u5BFC\u5165").onClick(() => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.onchange = async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          if (Array.isArray(data.items)) plugin.currentUser.items = data.items;
          if (Array.isArray(data.categories)) plugin.currentUser.categories = data.categories;
          await plugin.saveSettings();
          refresh();
          new import_obsidian13.Notice("\u2705 \u914D\u7F6E\u5BFC\u5165\u6210\u529F");
        } catch (e) {
          new import_obsidian13.Notice("\u274C JSON \u683C\u5F0F\u6709\u8BEF\uFF0C\u5BFC\u5165\u5931\u8D25");
        }
      };
      fileInput.click();
    });
  });
}

// src/settings/item-settings.ts
var import_obsidian15 = require("obsidian");

// src/settings/item-sorting.ts
function sortItemsByCategories(items, categories) {
  items.sort((a, b) => {
    let ai = categories.indexOf(a.category);
    if (ai === -1) ai = 9999;
    let bi = categories.indexOf(b.category);
    if (bi === -1) bi = 9999;
    return ai - bi;
  });
}

// src/settings/item-settings-list.ts
var import_obsidian14 = require("obsidian");
function renderItemSettingsList({
  plugin,
  itemsWrap,
  bindSettingsInput,
  pendingScrollItemId,
  setPendingScrollItemId
}) {
  const getScrollContainer = () => itemsWrap.closest(".vertical-tab-content") || itemsWrap.closest(".modal-content") || itemsWrap.parentElement;
  const dragState = {
    dragging: false,
    dragIdx: -1,
    placeholder: null,
    ghost: null,
    rows: []
  };
  const getDragRowIndex = (y) => {
    for (let index = 0; index < dragState.rows.length; index++) {
      const rect = dragState.rows[index].getBoundingClientRect();
      if (y < rect.top + rect.height / 2) return index;
    }
    return dragState.rows.length;
  };
  const onDragMove = (clientY) => {
    var _a;
    if (!dragState.dragging) return;
    if (dragState.ghost) dragState.ghost.style.top = clientY - 20 + "px";
    const targetIdx = getDragRowIndex(clientY);
    const parent = (_a = dragState.rows[0]) == null ? void 0 : _a.parentElement;
    if (!parent || !dragState.placeholder) return;
    if (targetIdx >= dragState.rows.length) {
      parent.appendChild(dragState.placeholder);
    } else {
      parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
    }
  };
  const pointerMoveHandler = (e) => {
    onDragMove(e.clientY);
  };
  const pointerCancelHandler = () => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    dragState.dragging = false;
    if (dragState.ghost) {
      dragState.ghost.remove();
      dragState.ghost = null;
    }
    if (dragState.placeholder) {
      dragState.placeholder.remove();
      dragState.placeholder = null;
    }
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    renderItems();
  };
  const onDragEnd = (clientY) => {
    if (!dragState.dragging) return;
    dragState.dragging = false;
    if (dragState.ghost) dragState.ghost.remove();
    if (dragState.placeholder) dragState.placeholder.remove();
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
    const targetIdx = getDragRowIndex(clientY);
    let fromIdx = dragState.dragIdx;
    if (targetIdx > fromIdx) fromIdx--;
    const arr = plugin.currentUser.items;
    if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < arr.length) {
      const moved = arr.splice(fromIdx, 1)[0];
      arr.splice(targetIdx, 0, moved);
      (async () => {
        await plugin.saveSettings();
        renderItems();
      })();
    } else {
      renderItems();
    }
  };
  const pointerUpHandler = (e) => {
    document.removeEventListener("pointermove", pointerMoveHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
    document.removeEventListener("pointercancel", pointerCancelHandler);
    onDragEnd(e.clientY);
  };
  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };
  const startDrag = (idx, wrap, clientY) => {
    dragState.dragging = true;
    dragState.dragIdx = idx;
    dragState.rows = Array.from(
      itemsWrap.querySelectorAll(".settings-item-wrap")
    );
    const rect = wrap.getBoundingClientRect();
    const ghost = wrap.cloneNode(true);
    ghost.className = "settings-item-wrap settings-drag-ghost";
    ghost.style.cssText = "position:fixed;left:" + rect.left + "px;top:" + (clientY - 20) + "px;width:" + rect.width + "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;padding:4px;";
    document.body.appendChild(ghost);
    dragState.ghost = ghost;
    const placeholder = document.createElement("div");
    placeholder.className = "settings-drag-placeholder";
    placeholder.style.cssText = "height:" + rect.height + "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
    if (wrap.parentElement) wrap.parentElement.insertBefore(placeholder, wrap);
    dragState.placeholder = placeholder;
    wrap.style.display = "none";
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.addEventListener("pointermove", pointerMoveHandler);
    document.addEventListener("pointerup", pointerUpHandler);
    document.addEventListener("pointercancel", pointerCancelHandler);
  };
  const renderItems = () => {
    var _a;
    const scroller = getScrollContainer();
    const preservedScrollTop = pendingScrollItemId ? null : (_a = scroller == null ? void 0 : scroller.scrollTop) != null ? _a : null;
    itemsWrap.empty();
    dragState.rows = [];
    if (plugin.currentUser.items.length === 0) {
      itemsWrap.createEl("p", {
        cls: "kid-score-hint",
        text: "\u8FD8\u6CA1\u6709\u9879\u76EE\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6DFB\u52A0\uFF01"
      });
      return;
    }
    const headerRow = itemsWrap.createDiv({
      cls: "settings-item-row-v2 header-row"
    });
    ["\u2630", "\u8868\u60C5", "\u540D\u79F0", "\u5206\u7C7B", "\u5206\u503C", ""].forEach((header) => {
      headerRow.createSpan({ text: header, cls: "col-header" });
    });
    let lastCategory = null;
    for (let idx = 0; idx < plugin.currentUser.items.length; idx++) {
      const item = plugin.currentUser.items[idx];
      const category = item.category || "\u5176\u4ED6";
      if (category !== lastCategory) {
        lastCategory = category;
        const groupHeader = itemsWrap.createDiv({
          cls: "settings-cat-group-header"
        });
        groupHeader.createSpan({ text: category });
      }
      const wrap = itemsWrap.createDiv({ cls: "settings-item-wrap" });
      wrap.dataset.itemId = item.id;
      const row = wrap.createDiv({ cls: "settings-item-row-v2" });
      row.dataset.idx = String(idx);
      const handle = row.createEl("span", {
        cls: "settings-drag-handle",
        text: "\u2630"
      });
      handle.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        startDrag(idx, wrap, e.clientY);
      });
      const emojiBtn = row.createEl("button", {
        cls: "settings-emoji-btn",
        text: item.emoji
      });
      emojiBtn.onclick = () => {
        showEmojiPicker(async (emoji) => {
          plugin.currentUser.items[idx].emoji = emoji;
          await plugin.saveSettings();
          emojiBtn.textContent = emoji;
        });
      };
      const nameInput = row.createEl("input", { cls: "settings-name-input" });
      nameInput.type = "text";
      nameInput.value = item.name;
      bindSettingsInput(nameInput);
      nameInput.onchange = async () => {
        plugin.currentUser.items[idx].name = nameInput.value;
        await plugin.saveSettings();
      };
      const catSelect = row.createEl("select", { cls: "settings-cat-select" });
      const categories = plugin.currentUser.categories || [];
      for (const value of categories) {
        const option = catSelect.createEl("option", {
          text: value,
          value
        });
        if (item.category === value) option.selected = true;
      }
      catSelect.onchange = async () => {
        plugin.currentUser.items[idx].category = catSelect.value;
        sortItemsByCategories(
          plugin.currentUser.items,
          plugin.currentUser.categories || []
        );
        await plugin.saveSettings();
        renderItems();
      };
      const pointsInput = row.createEl("input", {
        cls: "settings-points-input"
      });
      pointsInput.type = "number";
      pointsInput.value = String(item.points);
      bindSettingsInput(pointsInput);
      pointsInput.onchange = async () => {
        plugin.currentUser.items[idx].points = parseInt(pointsInput.value, 10) || 0;
        await plugin.saveSettings();
      };
      const del = row.createEl("button", {
        text: "\u{1F5D1}",
        cls: "settings-delete-btn"
      });
      del.onclick = async () => {
        if (!confirm("\u786E\u5B9A\u5220\u9664\u6253\u5206\u9879\u300C" + item.name + "\u300D\u5417\uFF1F")) return;
        try {
          plugin.currentUser.items.splice(idx, 1);
          await plugin.saveSettings();
          renderItems();
        } catch (error) {
          new import_obsidian14.Notice(
            "\u274C \u5220\u9664\u5931\u8D25\uFF1A" + (error instanceof Error ? error.message : String(error))
          );
        }
      };
      const noteRow = wrap.createDiv({ cls: "settings-item-note-row" });
      const noteInput = noteRow.createEl("textarea", {
        cls: "settings-note-input"
      });
      noteInput.placeholder = "\u5907\u6CE8\uFF08\u53EF\u9009\uFF09\uFF0C\u652F\u6301\u591A\u884C";
      noteInput.value = item.note || "";
      noteInput.rows = 1;
      autoResize(noteInput);
      noteInput.addEventListener("input", () => autoResize(noteInput));
      noteInput.addEventListener("focus", () => autoResize(noteInput));
      bindSettingsInput(noteInput);
      noteInput.addEventListener("change", async () => {
        plugin.currentUser.items[idx].note = noteInput.value;
        await plugin.saveSettings();
      });
      dragState.rows.push(wrap);
    }
    const groupHeaders = Array.from(
      itemsWrap.querySelectorAll(".settings-cat-group-header")
    );
    groupHeaders.forEach((header, hi) => {
      var _a2;
      const category = ((_a2 = header.querySelector("span")) == null ? void 0 : _a2.textContent) || "";
      const nextSibling = groupHeaders[hi + 1] || null;
      const addBtn = document.createElement("button");
      addBtn.className = "settings-cat-add-btn";
      addBtn.textContent = "+ \u5728\u300C" + category + "\u300D\u6DFB\u52A0\u9879\u76EE";
      addBtn.onclick = async () => {
        try {
          const newItemId = "item_" + Date.now();
          plugin.currentUser.items.push({
            id: newItemId,
            name: "\u65B0\u9879\u76EE",
            points: 1,
            emoji: "\u2B50",
            category,
            note: ""
          });
          sortItemsByCategories(
            plugin.currentUser.items,
            plugin.currentUser.categories || []
          );
          await plugin.saveSettings();
          setPendingScrollItemId(newItemId);
          renderItems();
        } catch (error) {
          new import_obsidian14.Notice(
            "\u274C \u6DFB\u52A0\u5931\u8D25\uFF1A" + (error instanceof Error ? error.message : String(error))
          );
        }
      };
      if (nextSibling) itemsWrap.insertBefore(addBtn, nextSibling);
      else itemsWrap.appendChild(addBtn);
    });
    if (pendingScrollItemId) {
      requestAnimationFrame(() => {
        const newItemEl = itemsWrap.querySelector(
          '.settings-item-wrap[data-item-id="' + pendingScrollItemId + '"]'
        );
        if (newItemEl) {
          newItemEl.scrollIntoView({ block: "center", behavior: "smooth" });
          const scrollContainer = getScrollContainer();
          if (scrollContainer && scrollContainer !== itemsWrap) {
            const scrollerEl = scrollContainer;
            const itemTop = newItemEl.offsetTop - (itemsWrap.offsetTop - scrollerEl.offsetTop);
            const desiredScroll = Math.max(
              0,
              itemTop - scrollerEl.clientHeight / 2 + newItemEl.clientHeight / 2
            );
            scrollerEl.scrollTo({ top: desiredScroll, behavior: "smooth" });
          }
          newItemEl.addClass("is-new-item");
          window.setTimeout(() => newItemEl.removeClass("is-new-item"), 1600);
          const nameInput = newItemEl.querySelector(".settings-name-input");
          if (nameInput) {
            window.setTimeout(() => {
              nameInput.focus();
              nameInput.select();
            }, 220);
          }
        }
        setPendingScrollItemId(null);
      });
    } else if (scroller && preservedScrollTop !== null) {
      requestAnimationFrame(() => {
        scroller.scrollTop = preservedScrollTop;
      });
    }
  };
  renderItems();
}

// src/settings/item-settings.ts
function renderItemSettings({
  plugin,
  containerEl,
  bindSettingsInput
}) {
  let pendingScrollItemId = null;
  containerEl.createEl("h3", { text: "\u{1F4DD} \u6253\u5206\u9879\u76EE\u7BA1\u7406" });
  containerEl.createEl("p", {
    cls: "kid-score-hint",
    text: "\u70B9\u51FB\u8868\u60C5\u6309\u94AE\u6253\u5F00emoji\u9009\u62E9\u5668\u3002\u6309\u4F4F \u2630 \u62D6\u52A8\u6392\u5E8F\u3002"
  });
  const itemsWrap = containerEl.createDiv({ cls: "kid-score-settings-items" });
  const renderItems = () => renderItemSettingsList({
    plugin,
    itemsWrap,
    bindSettingsInput,
    pendingScrollItemId,
    setPendingScrollItemId: (itemId) => {
      pendingScrollItemId = itemId;
    }
  });
  renderItems();
  new import_obsidian15.Setting(containerEl).setName("\u6DFB\u52A0\u65B0\u9879\u76EE").addButton(
    (btn) => btn.setButtonText("\uFF0B \u6DFB\u52A0\u9879\u76EE").setCta().onClick(async () => {
      const defaultCat = plugin.currentUser.categories[0] || "\u52A0\u5206\u9879";
      const newItemId = "item_" + Date.now();
      plugin.currentUser.items.push({
        id: newItemId,
        name: "\u65B0\u9879\u76EE",
        points: 1,
        emoji: "\u2B50",
        category: defaultCat,
        note: ""
      });
      sortItemsByCategories(plugin.currentUser.items, plugin.currentUser.categories || []);
      await plugin.saveSettings();
      pendingScrollItemId = newItemId;
      renderItems();
    })
  ).addButton(
    (btn) => btn.setButtonText("\u{1F4C2} \u6309\u5206\u7C7B\u6392\u5E8F").onClick(async () => {
      sortItemsByCategories(plugin.currentUser.items, plugin.currentUser.categories || []);
      await plugin.saveSettings();
      renderItems();
      new import_obsidian15.Notice("\u2705 \u5DF2\u6309\u5206\u7C7B\u6392\u5E8F");
    })
  );
}

// src/settings/user-settings-section.ts
var import_obsidian16 = require("obsidian");
function renderUserSettingsSection({
  app,
  plugin,
  containerEl,
  bindSettingsInput,
  refresh
}) {
  containerEl.createEl("h3", { text: "\u{1F465} \u7528\u6237\u7BA1\u7406" });
  containerEl.createEl("p", {
    cls: "kid-score-hint",
    text: "\u70B9\u51FB\u7528\u6237\u540D\u5207\u6362\uFF0C\u957F\u6309\u7528\u6237\u540D\u53EF\u5220\u9664\u8BE5\u7528\u6237\u3002"
  });
  const userMgrWrap = containerEl.createDiv({ cls: "kid-score-settings-users" });
  const showUserDeleteConfirm = (user) => {
    const deleteModal = new class extends import_obsidian16.Modal {
      onOpen() {
        this.titleEl.setText("\u26A0\uFE0F \u5220\u9664\u7528\u6237");
        this.modalEl.addClass("kid-score-edit-modal");
        this._kbCleanup = setupModalKeyboard2(this);
        const content = this.contentEl;
        content.createDiv({
          cls: "value-popup-hint",
          text: "\u5C06\u5220\u9664\u300C" + user.name + "\u300D\u7684\u6240\u6709\u8BBE\u7F6E\uFF0C\u5DF2\u4FDD\u5B58\u7684\u8BB0\u5F55\u6587\u4EF6\u4E0D\u53D7\u5F71\u54CD\u3002"
        });
        const promptEl = content.createDiv();
        promptEl.style.marginBottom = "6px";
        promptEl.style.fontSize = "0.9em";
        promptEl.textContent = "\u8BF7\u8F93\u5165\u300E\u786E\u5B9A\u5220\u9664\u300F\u7EE7\u7EED\uFF1A";
        const confirmInput = content.createEl("input", {
          type: "text",
          cls: "custom-form-name-input"
        });
        confirmInput.placeholder = "\u786E\u5B9A\u5220\u9664";
        confirmInput.autocomplete = "off";
        bindModalInputFocus(confirmInput);
        const actions = content.createDiv({ cls: "value-popup-actions" });
        actions.style.marginTop = "12px";
        const cancelBtn = actions.createEl("button", {
          cls: "value-popup-cancel",
          text: "\u53D6\u6D88"
        });
        cancelBtn.onclick = () => this.close();
        const deleteBtn = actions.createEl("button", {
          cls: "value-popup-confirm",
          text: "\u5220\u9664"
        });
        deleteBtn.style.background = "var(--color-red, #e03131)";
        deleteBtn.style.color = "#fff";
        deleteBtn.onclick = async () => {
          if (confirmInput.value.trim() !== "\u786E\u5B9A\u5220\u9664") {
            confirmInput.classList.add("is-error");
            confirmInput.focus();
            return;
          }
          try {
            const users = plugin.settings.users;
            const idx = users.findIndex((item) => item.id === user.id);
            if (idx !== -1 && users.length > 1) {
              users.splice(idx, 1);
              plugin.settings.currentUserId = users[Math.max(0, idx - 1)].id;
              await plugin.saveSettings();
              this.close();
              refresh();
            }
          } catch (error) {
            new import_obsidian16.Notice(
              "\u274C \u5220\u9664\u5931\u8D25\uFF1A" + (error instanceof Error ? error.message : String(error))
            );
          }
        };
      }
      onClose() {
        if (this._kbCleanup) this._kbCleanup();
        this.contentEl.empty();
      }
    }(app);
    deleteModal.open();
  };
  const renderUserMgr = () => {
    userMgrWrap.empty();
    plugin.settings.users.forEach((user) => {
      const userBtn = userMgrWrap.createEl("button", {
        cls: "kid-score-user-btn" + (user.id === plugin.settings.currentUserId ? " is-active" : ""),
        text: user.name
      });
      attachPressGesture({
        element: userBtn,
        longPressMs: 600,
        isTouchMode: true,
        onLongPress: () => {
          if (plugin.settings.users.length > 1) {
            showUserDeleteConfirm(user);
          }
        },
        onSingleTap: () => {
          plugin.settings.currentUserId = user.id;
          plugin.saveSettings().then(() => refresh());
        }
      });
    });
    const addUserBtn = userMgrWrap.createEl("button", {
      cls: "kid-score-user-add-btn",
      text: "\uFF0B \u6DFB\u52A0\u7528\u6237"
    });
    addUserBtn.onclick = async () => {
      try {
        const newUser = makeDefaultUser();
        newUser.name = "\u65B0\u7528\u6237";
        plugin.settings.users.push(newUser);
        plugin.settings.currentUserId = newUser.id;
        await plugin.saveSettings();
        refresh();
      } catch (error) {
        new import_obsidian16.Notice(
          "\u274C \u6DFB\u52A0\u7528\u6237\u5931\u8D25\uFF1A" + (error instanceof Error ? error.message : String(error))
        );
      }
    };
  };
  renderUserMgr();
  new import_obsidian16.Setting(containerEl).setName("\u59D3\u540D").setDesc("\u5F53\u524D\u7528\u6237\u7684\u663E\u793A\u540D\u5B57").addText(
    (text) => text.setPlaceholder("\u738B\u9756\u8FB0").setValue(plugin.currentUser.name).onChange(async (value) => {
      const newName = value.trim() || "\u672A\u547D\u540D";
      const oldName = plugin.currentUser.name;
      if (newName === oldName) return;
      if (!confirm("\u786E\u5B9A\u5C06\u7528\u6237\u540D\u4FEE\u6539\u4E3A\u300C" + newName + "\u300D\u5417\uFF1F")) return;
      try {
        await plugin.renameUserInFiles(oldName, newName);
        plugin.currentUser.name = newName;
        await plugin.saveSettings();
        renderUserMgr();
        new import_obsidian16.Notice("\u2705 \u7528\u6237\u540D\u5DF2\u66F4\u65B0\uFF0C\u5386\u53F2\u8BB0\u5F55\u4E2D\u7684\u540D\u79F0\u5DF2\u540C\u6B65\u66FF\u6362");
      } catch (error) {
        console.error("[Little Milestones] renameUserInFiles error", error);
        new import_obsidian16.Notice(
          "\u274C " + (error instanceof Error ? error.message : String(error))
        );
      }
    })
  );
  bindSettingsInput(containerEl.querySelector(".setting-item:last-child input"));
  new import_obsidian16.Setting(containerEl).setName("\u8BB0\u5F55\u4FDD\u5B58\u8DEF\u5F84").setDesc("\u6BCF\u65E5\u6253\u5206 Markdown \u6587\u4EF6\u5B58\u653E\u7684\u6587\u4EF6\u5939").addText(
    (text) => text.setPlaceholder("Little Milestones/Daily Records").setValue(plugin.currentUser.savePath).onChange(async (value) => {
      const newPath = value.trim() || "Little Milestones/Daily Records";
      const oldPath = plugin.currentUser.savePath;
      if (newPath === oldPath) return;
      if (!confirm(
        "\u786E\u5B9A\u5C06\u8BB0\u5F55\u4FDD\u5B58\u8DEF\u5F84\u4FEE\u6539\u4E3A\u300C" + newPath + "\u300D\u5417\uFF1F\n\u5DF2\u6709\u7684\u5386\u53F2\u8BB0\u5F55\u5C06\u81EA\u52A8\u8FC1\u79FB\u5230\u65B0\u8DEF\u5F84\u3002"
      )) {
        return;
      }
      try {
        await plugin.migrateSavePath(oldPath, newPath);
        plugin.currentUser.savePath = newPath;
        await plugin.saveSettings();
        new import_obsidian16.Notice("\u2705 \u4FDD\u5B58\u8DEF\u5F84\u5DF2\u4FEE\u6539\uFF0C\u5386\u53F2\u8BB0\u5F55\u5DF2\u81EA\u52A8\u8FC1\u79FB");
      } catch (error) {
        console.error("[Little Milestones] migrateSavePath error", error);
        new import_obsidian16.Notice(
          "\u274C " + (error instanceof Error ? error.message : String(error))
        );
      }
    })
  );
  bindSettingsInput(containerEl.querySelector(".setting-item:last-child input"));
}

// src/settings/settings-tab.ts
var KidScoreSettingTab = class extends import_obsidian17.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.touchGuardCleanup = null;
    this.touchGuardReleaseTimer = null;
    this.plugin = plugin;
  }
  display() {
    const self = this;
    const containerEl = this.containerEl;
    containerEl.empty();
    containerEl.addClass("kid-score-settings");
    const bindSettingsInput = (input) => {
      bindModalInputFocus(input, {
        manualTouchFocus: false,
        scrollOnIOSFocus: false
      });
    };
    containerEl.createEl("h2", { text: "\u{1F31F} \u6BCF\u65E5\u8BB0\u5F55\u8BBE\u7F6E" });
    renderUserSettingsSection({
      app: self.plugin.app,
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refresh: () => self.display()
    });
    renderGoalSettingsSection({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput
    });
    renderContentSettingsSections({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput
    });
    renderCategorySettings({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput,
      refreshItems: () => self.display()
    });
    renderItemSettings({
      plugin: self.plugin,
      containerEl,
      bindSettingsInput
    });
    renderImportExportSettings({
      plugin: self.plugin,
      containerEl,
      refresh: () => self.display()
    });
    this.detachTouchScrollGuard();
    if (isTouchDevice()) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchMoved = false;
      const releaseReadonlyInputs = () => {
        if (this.touchGuardReleaseTimer !== null) {
          window.clearTimeout(this.touchGuardReleaseTimer);
          this.touchGuardReleaseTimer = null;
        }
        const inputs = containerEl.querySelectorAll(
          'input[readonly]:not([type="button"]):not([type="submit"]), textarea[readonly]'
        );
        inputs.forEach((inp) => inp.removeAttribute("readonly"));
      };
      const onTouchStart = (e) => {
        releaseReadonlyInputs();
        if (!e.touches || e.touches.length !== 1) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchMoved = false;
      };
      const onTouchMove = (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        const touch = e.touches[0];
        if (Math.abs(touch.clientX - touchStartX) > 8 || Math.abs(touch.clientY - touchStartY) > 8) {
          touchMoved = true;
          const inputs = containerEl.querySelectorAll(
            'input:not([type="button"]):not([type="submit"]), textarea'
          );
          inputs.forEach((inp) => inp.setAttribute("readonly", "readonly"));
        }
      };
      const onTouchEnd = () => {
        if (touchMoved) {
          this.touchGuardReleaseTimer = window.setTimeout(
            releaseReadonlyInputs,
            120
          );
        }
      };
      const onTouchCancel = () => {
        touchMoved = false;
        releaseReadonlyInputs();
      };
      containerEl.addEventListener("touchstart", onTouchStart, { passive: true });
      containerEl.addEventListener("touchmove", onTouchMove, { passive: true });
      containerEl.addEventListener("touchend", onTouchEnd, { passive: true });
      containerEl.addEventListener("touchcancel", onTouchCancel, {
        passive: true
      });
      this.touchGuardCleanup = () => {
        releaseReadonlyInputs();
        containerEl.removeEventListener("touchstart", onTouchStart);
        containerEl.removeEventListener("touchmove", onTouchMove);
        containerEl.removeEventListener("touchend", onTouchEnd);
        containerEl.removeEventListener("touchcancel", onTouchCancel);
      };
    }
  }
  hide() {
    this.detachTouchScrollGuard();
    super.hide();
  }
  detachTouchScrollGuard() {
    if (this.touchGuardCleanup) {
      this.touchGuardCleanup();
      this.touchGuardCleanup = null;
    }
    if (this.touchGuardReleaseTimer !== null) {
      window.clearTimeout(this.touchGuardReleaseTimer);
      this.touchGuardReleaseTimer = null;
    }
  }
};

// src/settings/normalize-settings.ts
function sanitizeDoubleTapThreshold(value, fallback) {
  const n = parseInt(String(value), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(120, Math.min(600, n));
}
function normalizePluginSettings(loaded) {
  const data = loaded || {};
  let changed = false;
  if (data.childName !== void 0 && !data.users) {
    const user = makeDefaultUser();
    user.name = data.childName || "\u672A\u547D\u540D";
    user.savePath = data.savePath || "Little Milestones/Daily Records";
    user.items = Array.isArray(data.items) ? data.items : [];
    user.categories = Array.isArray(data.categories) && data.categories.length ? data.categories : ["\u52A0\u5206\u9879", "\u51CF\u5206\u9879"];
    user.scoringRules = data.scoringRules || "";
    user.diaryTemplate = data.diaryTemplate || DEFAULT_DIARY_TEMPLATE;
    user.diaryModules = Array.isArray(data.diaryModules) && data.diaryModules.length ? data.diaryModules : makeDefaultDiaryModules();
    ensureUserDefaults(user);
    return {
      settings: {
        users: [user],
        currentUserId: user.id,
        doubleTapThresholds: { ...DEFAULT_SETTINGS.doubleTapThresholds }
      },
      changed: true
    };
  }
  const settings = { ...DEFAULT_SETTINGS, ...data };
  const dt = {
    ...DEFAULT_SETTINGS.doubleTapThresholds,
    ...settings.doubleTapThresholds || {}
  };
  dt.windows = sanitizeDoubleTapThreshold(
    dt.windows,
    DEFAULT_SETTINGS.doubleTapThresholds.windows
  );
  dt.mac = sanitizeDoubleTapThreshold(
    dt.mac,
    DEFAULT_SETTINGS.doubleTapThresholds.mac
  );
  dt.android = sanitizeDoubleTapThreshold(
    dt.android,
    DEFAULT_SETTINGS.doubleTapThresholds.android
  );
  dt.ios = sanitizeDoubleTapThreshold(
    dt.ios,
    DEFAULT_SETTINGS.doubleTapThresholds.ios
  );
  dt.fallback = sanitizeDoubleTapThreshold(
    dt.fallback,
    DEFAULT_SETTINGS.doubleTapThresholds.fallback
  );
  settings.doubleTapThresholds = dt;
  if (!settings.users || !settings.users.length) {
    const user = makeDefaultUser();
    settings.users = [user];
    settings.currentUserId = user.id;
    changed = true;
  } else {
    for (const user of settings.users) {
      changed = ensureUserDefaults(user) || changed;
    }
    if (!settings.currentUserId || !settings.users.find((user) => user.id === settings.currentUserId)) {
      settings.currentUserId = settings.users[0].id;
      changed = true;
    }
  }
  return { settings, changed };
}
function ensureUserDefaults(user) {
  let changed = false;
  const defaultDiaryModules = makeDefaultDiaryModules();
  if (!user.id) {
    user.id = "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    changed = true;
  }
  if (!user.name) {
    user.name = "\u672A\u547D\u540D";
    changed = true;
  }
  if (!user.savePath || !String(user.savePath).trim()) {
    user.savePath = "Little Milestones/Daily Records";
    changed = true;
  }
  if (!Array.isArray(user.items)) {
    user.items = [];
    changed = true;
  }
  if (!Array.isArray(user.categories) || !user.categories.length) {
    user.categories = ["\u52A0\u5206\u9879", "\u51CF\u5206\u9879"];
    changed = true;
  }
  if (typeof user.scoringRules !== "string") {
    user.scoringRules = "";
    changed = true;
  }
  if (!user.diaryTemplate) {
    user.diaryTemplate = DEFAULT_DIARY_TEMPLATE;
    changed = true;
  }
  if (!Array.isArray(user.diaryModules) || user.diaryModules.length === 0) {
    user.diaryModules = defaultDiaryModules;
    changed = true;
  } else {
    user.diaryModules = user.diaryModules.map((moduleDef, index) => {
      const fallback = defaultDiaryModules[index];
      const next = {
        ...moduleDef,
        emoji: typeof moduleDef.emoji === "string" && moduleDef.emoji.trim() ? moduleDef.emoji : (fallback == null ? void 0 : fallback.emoji) || "\u{1F4DD}"
      };
      if (next.emoji !== moduleDef.emoji) changed = true;
      return next;
    });
  }
  if (!user.goals) {
    user.goals = { daily: 10, weekly: 70, monthly: 300 };
    changed = true;
  }
  for (const item of user.items) {
    if (!item.category) {
      item.category = item.points >= 0 ? user.categories[0] : user.categories[1] || user.categories[0];
      changed = true;
    }
  }
  return changed;
}

// src/storage/day-data-store.ts
var import_obsidian18 = require("obsidian");

// src/composers/day-data-composer.ts
var DayDataComposer = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  async compose(dateStr, scores, customItems, diaryContent) {
    const items = this.plugin.currentUser.items;
    const childName = this.plugin.currentUser.name;
    const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() - 1);
    const yesterdayStr = d.toISOString().slice(0, 10);
    const yesterdayData = await this.plugin.readDayData(yesterdayStr);
    let total = 0;
    let earnedCount = 0;
    let missedCount = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    for (const item of items) {
      const val = scores[item.id] || 0;
      total += val;
      const isDeduct = item.category === "\u51CF\u5206" || item.points < 0;
      if (isDeduct) {
        if (val !== 0) {
          earnedCount++;
          negativeCount++;
        } else {
          missedCount++;
        }
      } else {
        if (val > 0) {
          earnedCount++;
          positiveCount++;
        } else {
          missedCount++;
        }
      }
    }
    let customTotal = 0;
    for (const ci of customItems) {
      customTotal += ci.points;
    }
    total += customTotal;
    const allScores = await this.plugin.getAllScores();
    let cumulativeTotal = 0;
    let cumulativeDays = 0;
    for (const s of allScores) {
      if (s.date !== dateStr) {
        cumulativeTotal += s.total;
        cumulativeDays++;
      }
    }
    const grandTotal = cumulativeTotal + total;
    const grandDays = cumulativeDays + 1;
    const grandAvg = grandDays > 0 ? Math.round(grandTotal / grandDays * 10) / 10 : 0;
    let streak = 0;
    const sortedScores = [...allScores].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    for (const s of sortedScores) {
      if (s.total > 0) streak++;
      else break;
    }
    if (total > 0) streak++;
    const diaryText = diaryContent || "";
    const diaryModules = this.plugin.currentUser.diaryModules && this.plugin.currentUser.diaryModules.length ? this.plugin.currentUser.diaryModules : makeDefaultDiaryModules();
    const weatherModule = diaryModules.find((moduleDef) => moduleDef.id === "weather");
    const moodModule = diaryModules.find((moduleDef) => moduleDef.id === "mood");
    const breakfastMatch = diaryText.match(/早餐：\s*(.+)/);
    const lunchMatch = diaryText.match(/午餐：\s*(.+)/);
    const dinnerMatch = diaryText.match(/晚餐：\s*(.+)/);
    const homeCookMatch = diaryText.match(/在家做饭：\s*(.+)/);
    const exerciseMatch = diaryText.match(/运动项目：\s*(.+)/);
    const sleepMatch = diaryText.match(/睡眠情况：\s*(.+)/);
    return {
      dateStr,
      childName,
      scores,
      customItems,
      diaryContent,
      total,
      earnedCount,
      missedCount,
      positiveCount,
      negativeCount,
      customTotal,
      totalItems: items.length,
      completionRate: items.length > 0 ? Math.round(earnedCount / items.length * 100) : 0,
      grandTotal,
      grandDays,
      grandAvg,
      streak,
      hasYesterday: !!yesterdayData,
      yesterdayData,
      tags: {
        weather: weatherModule ? readDiaryLine(diaryText, weatherModule.label) || void 0 : void 0,
        mood: moodModule ? readDiaryLine(diaryText, moodModule.label) || void 0 : void 0,
        homeCook: homeCookMatch ? homeCookMatch[1].trim() : void 0,
        exercise: exerciseMatch ? exerciseMatch[1].trim() : void 0,
        sleep: sleepMatch ? sleepMatch[1].trim() : void 0,
        hasDiary: diaryText.trim().length > 0
      },
      diet: {
        breakfast: breakfastMatch ? breakfastMatch[1].trim() : void 0,
        lunch: lunchMatch ? lunchMatch[1].trim() : void 0,
        dinner: dinnerMatch ? dinnerMatch[1].trim() : void 0
      },
      items,
      categories: this.plugin.currentUser.categories || []
    };
  }
};

// src/utils/yaml.ts
function toYamlInline(value) {
  const safe = String(value == null ? "" : value).replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n/g, "\\n").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return '"' + safe + '"';
}

// src/renderers/report-sections.ts
function buildFrontmatter(report) {
  const scoresYaml = report.items.map((item) => "  " + item.id + ": " + (report.scores[item.id] || 0)).join("\n");
  let customYaml = "";
  if (report.customItems.length > 0) {
    customYaml = "\ncustomItems:\n" + report.customItems.map(
      (item) => "  - " + toYamlInline(item.emoji + "|" + item.name + "|" + item.points)
    ).join("\n");
  }
  return "---\ndate: " + report.dateStr + "\nchild: " + report.childName + "\ntotal: " + report.total + "\nscores:\n" + scoresYaml + customYaml + "\n---\n\n";
}
function buildSummaryCallout(report) {
  const totalSign = report.total >= 0 ? "+" : "";
  let summary = "> [!summary] \u{1F4CA} \u4ECA\u65E5\u6C47\u603B\n> - \u{1F3C6} \u4ECA\u65E5\u603B\u5206\uFF1A**" + totalSign + report.total + " \u5206**\n";
  if (report.hasYesterday && report.yesterdayData) {
    const yTotalSign = report.yesterdayData.total >= 0 ? "+" : "";
    summary += "> - \u{1F4C5} \u6628\u65E5\u603B\u5206\uFF1A" + yTotalSign + report.yesterdayData.total + " \u5206\n";
  }
  const grandSign = report.grandTotal >= 0 ? "+" : "";
  summary += "> - \u2705 \u5B8C\u6210\u9879\u76EE\uFF1A**" + report.earnedCount + "/" + report.totalItems + " (" + report.completionRate + "%)**\n> - \u2795 \u52A0\u5206\u9879\uFF1A" + report.positiveCount + " \u9879\n> - \u2796 \u51CF\u5206\u9879\uFF1A" + report.negativeCount + " \u9879\n> - \u{1F4CC} \u4E34\u65F6\u4E8B\u9879\uFF1A" + report.customItems.length + " \u9879 (" + (report.customTotal >= 0 ? "+" : "") + report.customTotal + " \u5206)\n> - \u{1F4C8} \u7D2F\u8BA1\u603B\u5206\uFF1A" + grandSign + report.grandTotal + " \u5206 \xB7 \u{1F4C5} \u7D2F\u8BA1 " + report.grandDays + " \u5929 \xB7 \u{1F4CA} \u65E5\u5747 " + report.grandAvg + " \u5206 \xB7 \u{1F3C1} \u8FDE\u7EED " + report.streak + " \u5929\n";
  return summary;
}
function buildGoalCallout(report) {
  const dailyGoal = 10;
  const goalPct = Math.min(
    100,
    Math.round(report.earnedCount / dailyGoal * 100)
  );
  return "> [!tip] \u{1F3AF} \u4ECA\u65E5\u76EE\u6807\n> \u5B8C\u6210\u9879\u76EE **" + report.earnedCount + "/" + dailyGoal + "** \xB7 " + renderProgressBar(goalPct) + "\n";
}
function buildCategoryTables(report) {
  let content = "";
  for (const category of report.categories) {
    const items = report.items.filter((item) => item.category === category);
    if (items.length > 0) {
      content += "\n### " + category + "\n\n| \u9879\u76EE | \u9ED8\u8BA4 | \u5F97\u5206 | \u72B6\u6001 |\n|:---|---:|---:|:---:|\n" + renderCategoryRows(items, report) + "\n";
    }
  }
  const uncategorized = report.items.filter(
    (item) => !item.category || report.categories.indexOf(item.category) === -1
  );
  if (uncategorized.length > 0) {
    content += "\n### \u5176\u4ED6\n\n| \u9879\u76EE | \u9ED8\u8BA4 | \u5F97\u5206 | \u72B6\u6001 |\n|:---|---:|---:|:---:|\n" + renderCategoryRows(uncategorized, report) + "\n";
  }
  return content;
}
function buildCustomItemsCallout(customItems) {
  if (customItems.length === 0) return "";
  const customTotal = customItems.reduce((sum, item) => sum + item.points, 0);
  const hasNotes = customItems.some((item) => item.note && item.note.trim());
  let callout = "\n> [!info] \u{1F4CC} \u4E34\u65F6\u4E8B\u9879\uFF08" + customItems.length + " \u9879\uFF0C" + (customTotal >= 0 ? "+" : "") + customTotal + " \u5206\uFF09\n";
  if (hasNotes) {
    callout += "> | \u4E8B\u9879 | \u5F97\u5206 | \u5907\u6CE8 |\n> |:---|---:|:---|\n";
    for (const item of customItems) {
      callout += "> | " + item.emoji + " " + item.name + " | " + (item.points >= 0 ? "+" : "") + item.points + " | " + (item.note || "") + " |\n";
    }
  } else {
    callout += "> | \u4E8B\u9879 | \u5F97\u5206 |\n> |:---|---:|\n";
    for (const item of customItems) {
      callout += "> | " + item.emoji + " " + item.name + " | " + (item.points >= 0 ? "+" : "") + item.points + " |\n";
    }
  }
  return callout + "\n";
}
function renderCategoryRows(items, report) {
  let rows = "";
  for (const item of items) {
    const actual = report.scores[item.id] || 0;
    const isDeductItem = item.category === "\u51CF\u5206" || item.points < 0;
    const status = isDeductItem ? actual !== 0 ? "\u2B55" : "\u{1F535}" : actual > 0 ? "\u2705" : "\u274C";
    const defaultSign = item.points >= 0 ? "+" : "";
    const noteMarker = actual !== 0 && actual !== item.points ? " \u{1F4DD}" : "";
    rows += "| " + item.emoji + " " + item.name + " | " + defaultSign + item.points + " | " + renderScoreCell(actual, isDeductItem) + noteMarker + " | " + status + " |\n";
    if (report.hasYesterday && report.yesterdayData) {
      const yVal = report.yesterdayData.scores[item.id] || 0;
      const ySign = yVal >= 0 ? "+" : "";
      const yIcon = yVal > 0 ? "\u2705" : yVal < 0 ? "\u274C" : "\u2014";
      rows += "> [!quote]- \u6628\u65E5\uFF1A" + item.name + " " + ySign + yVal + " \u5206 " + yIcon + "\n";
    }
  }
  return rows;
}
function renderProgressBar(pct) {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return "`" + "\u2588".repeat(filled) + "\u2591".repeat(empty) + " " + pct + "%`";
}
function renderScoreCell(actual, isDeduct) {
  const sign = actual >= 0 ? "+" : "";
  const color = isDeduct ? "#dc2626" : "#16a34a";
  return '<span style="color:' + color + ';font-weight:600">' + sign + actual + "</span>";
}

// src/renderers/report-builder.ts
var MarkdownReportBuilder = class {
  build(report) {
    return buildFrontmatter(report) + "# \u{1F4CB} " + report.dateStr + " " + report.childName + "\u7684\u6BCF\u65E5\u8BB0\u5F55\n\n" + buildSummaryCallout(report) + "\n" + buildGoalCallout(report) + "\n---\n" + buildCategoryTables(report) + buildCustomItemsCallout(report.customItems) + "---\n\n## \u{1F4DD} \u4ECA\u65E5\u65E5\u8BB0\n\n" + (report.diaryContent || "") + "\n";
  }
};

// src/storage/day-data-store.ts
var DayDataStore = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  async readDayData(dateStr) {
    const file = this.plugin.app.vault.getAbstractFileByPath(
      this.plugin.filePath(dateStr)
    );
    if (!(file instanceof import_obsidian18.TFile)) return null;
    const content = await this.plugin.app.vault.read(file);
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;
    const fm = fmMatch[1];
    const totalMatch = fm.match(/total:\s*(-?\d+)/);
    const total = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    const scores = {};
    const scoreBlock = fm.match(/scores:\s*\n([\s\S]*?)(?=\n\w|$)/);
    if (scoreBlock) {
      for (const line of scoreBlock[1].split("\n")) {
        const kvNum = line.match(/\s+(item_\d+):\s*(-?\d+)/);
        if (kvNum) {
          scores[kvNum[1]] = parseInt(kvNum[2], 10);
          continue;
        }
        const kvBool = line.match(/\s+(item_\d+):\s*(true|false)/);
        if (kvBool) {
          const itemDef = this.plugin.currentUser.items.find(
            (item) => item.id === kvBool[1]
          );
          scores[kvBool[1]] = kvBool[2] === "true" ? itemDef ? itemDef.points : 1 : 0;
        }
      }
    }
    const customItems = [];
    const customBlock = fm.match(/customItems:\s*\n((?:\s+-\s*"[^"]*"\n?)*)/);
    if (customBlock) {
      const lines = customBlock[1].split("\n");
      for (const line of lines) {
        const match = line.match(/-\s*"(.+?)\|(.+?)\|(-?\d+)"/);
        if (match) {
          customItems.push({
            id: "custom_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
            emoji: match[1],
            name: match[2],
            points: parseInt(match[3], 10)
          });
        }
      }
    }
    let diaryContent = "";
    const diaryHeadingIdx = content.indexOf("## \u{1F4DD} \u4ECA\u65E5\u65E5\u8BB0");
    if (diaryHeadingIdx !== -1) {
      diaryContent = content.slice(diaryHeadingIdx).replace(/^##\s*📝\s*今日日记\s*\n?/, "").trim();
    } else {
      const diaryIdx = content.indexOf(DIARY_MARKER);
      if (diaryIdx !== -1) {
        diaryContent = content.slice(diaryIdx + DIARY_MARKER.length).trim().replace(/^##\s*📝\s*今日日记\s*\n?/, "").trim();
      }
    }
    return {
      date: dateStr,
      child: this.plugin.currentUser.name,
      scores,
      customItems,
      total,
      diaryContent
    };
  }
  async saveDayData(dateStr, scores, customItems, diaryContent) {
    try {
      const composer = new DayDataComposer(this.plugin);
      const builder = new MarkdownReportBuilder();
      const report = await composer.compose(
        dateStr,
        scores,
        customItems,
        diaryContent
      );
      const fileContent = builder.build(report);
      const dirPath = (0, import_obsidian18.normalizePath)(this.plugin.currentUser.savePath);
      if (!this.plugin.app.vault.getAbstractFileByPath(dirPath)) {
        await this.plugin.app.vault.createFolder(dirPath);
      }
      const filePath = this.plugin.filePath(dateStr);
      const existing = this.plugin.app.vault.getAbstractFileByPath(filePath);
      if (existing instanceof import_obsidian18.TFile) {
        await this.plugin.app.vault.modify(existing, fileContent);
      } else {
        await this.plugin.app.vault.create(filePath, fileContent);
      }
      const totalSign = report.total >= 0 ? "+" : "";
      const grandSign = report.grandTotal >= 0 ? "+" : "";
      new import_obsidian18.Notice(
        "\u2705 " + dateStr + " \u8BB0\u5F55\u5DF2\u4FDD\u5B58\uFF01\u603B\u5206\uFF1A" + totalSign + report.total + " | \u7D2F\u8BA1\uFF1A" + grandSign + report.grandTotal
      );
    } catch (error) {
      console.error("[Little Milestones] saveDayData failed", error);
      new import_obsidian18.Notice(
        "\u274C \u4FDD\u5B58\u5931\u8D25\uFF1A" + (error instanceof Error ? error.message : String(error))
      );
      throw error;
    }
  }
  async renameUserInFiles(oldName, newName) {
    const dirPath = (0, import_obsidian18.normalizePath)(this.plugin.currentUser.savePath);
    const files = this.plugin.app.vault.getFiles().filter(
      (file) => file.path.startsWith(dirPath + "/") && file.extension === "md"
    );
    let errorCount = 0;
    for (const file of files) {
      try {
        const content = await this.plugin.app.vault.read(file);
        const escapedOldName = oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const childRe = new RegExp("^child:\\s*" + escapedOldName + "$", "gm");
        const titleRe = new RegExp(
          "(# \u{1F4CB} \\d{4}-\\d{2}-\\d{2} )" + escapedOldName + "(\u7684\u6BCF\u65E5\u8BB0\u5F55)",
          "g"
        );
        const newContent = content.replace(childRe, "child: " + newName).replace(titleRe, "$1" + newName + "$2");
        if (newContent !== content) {
          await this.plugin.app.vault.modify(file, newContent);
        }
      } catch (error) {
        errorCount++;
        console.error(
          "[Little Milestones] renameUserInFiles failed for",
          file.path,
          error
        );
      }
    }
    if (errorCount > 0) {
      throw new Error(
        "\u7528\u6237\u540D\u540C\u6B65\u5931\u8D25 " + errorCount + " \u4E2A\u6587\u4EF6\uFF0C\u8BF7\u67E5\u770B\u63A7\u5236\u53F0\u65E5\u5FD7"
      );
    }
  }
  async migrateSavePath(oldPath, newPath) {
    const oldDir = (0, import_obsidian18.normalizePath)(oldPath);
    const newDir = (0, import_obsidian18.normalizePath)(newPath);
    if (oldDir === newDir) return;
    const files = this.plugin.app.vault.getFiles().filter(
      (file) => file.path.startsWith(oldDir + "/") && file.extension === "md"
    );
    if (files.length === 0) return;
    if (!this.plugin.app.vault.getAbstractFileByPath(newDir)) {
      await this.plugin.app.vault.createFolder(newDir);
    }
    let errorCount = 0;
    for (const file of files) {
      try {
        const newFilePath = (0, import_obsidian18.normalizePath)(newDir + "/" + file.name);
        const existing = this.plugin.app.vault.getAbstractFileByPath(newFilePath);
        if (existing instanceof import_obsidian18.TFile) {
          const oldContent = await this.plugin.app.vault.read(file);
          await this.plugin.app.vault.modify(existing, oldContent);
          await this.plugin.app.vault.delete(file, true);
        } else {
          await this.plugin.app.vault.rename(file, newFilePath);
        }
      } catch (error) {
        errorCount++;
        console.error(
          "[Little Milestones] migrateSavePath failed for",
          file.path,
          error
        );
      }
    }
    if (errorCount > 0) {
      throw new Error(
        "\u8DEF\u5F84\u8FC1\u79FB\u5931\u8D25 " + errorCount + " \u4E2A\u6587\u4EF6\uFF0C\u5EFA\u8BAE\u624B\u52A8\u68C0\u67E5\u5E76\u8FC1\u79FB"
      );
    }
  }
  async getAllScores() {
    const dirPath = (0, import_obsidian18.normalizePath)(this.plugin.currentUser.savePath);
    const files = this.plugin.app.vault.getFiles().filter(
      (file) => file.path.startsWith(dirPath + "/") && file.extension === "md"
    );
    const results = [];
    for (const file of files) {
      const dateStr = file.basename;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const score = await this.readDayData(dateStr);
        if (score) results.push(score);
      }
    }
    return results.sort((a, b) => a.date.localeCompare(b.date));
  }
};

// src/main.ts
var KidScorePlugin = class extends import_obsidian19.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.dayDataStore = new DayDataStore(this);
  }
  async onload() {
    await this.loadSettings();
    this.addRibbonIcon("star", "Little Milestones \u{1F331}", () => {
      new DailyScoringModal(this.app, this).open();
    });
    this.addCommand({
      id: "open-daily-score",
      name: "\u6253\u5F00\u4ECA\u65E5\u6253\u5206",
      callback: () => new DailyScoringModal(this.app, this).open()
    });
    this.addCommand({
      id: "view-stats",
      name: "\u67E5\u770B\u6253\u5206\u7EDF\u8BA1",
      callback: () => new StatsModal(this.app, this).open()
    });
    this.addSettingTab(new KidScoreSettingTab(this.app, this));
  }
  async loadSettings() {
    const { settings, changed } = normalizePluginSettings(await this.loadData());
    this.settings = settings;
    if (changed) await this.saveSettings();
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  sanitizeDoubleTapThreshold(value, fallback) {
    const n = parseInt(String(value), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(120, Math.min(600, n));
  }
  detectPlatformKey() {
    return getPlatformKey();
  }
  getDoubleTapThreshold() {
    const defaults = DEFAULT_SETTINGS.doubleTapThresholds;
    const cfg = this.settings.doubleTapThresholds || defaults;
    const key = this.detectPlatformKey();
    const fb = this.sanitizeDoubleTapThreshold(cfg.fallback, defaults.fallback);
    return this.sanitizeDoubleTapThreshold(
      cfg[key],
      fb
    );
  }
  get currentUser() {
    const cuid = this.settings.currentUserId;
    return this.settings.users.find((u) => u.id === cuid) || this.settings.users[0];
  }
  filePath(dateStr) {
    return (0, import_obsidian19.normalizePath)(this.currentUser.savePath + "/" + dateStr + ".md");
  }
  async readDayData(dateStr) {
    return this.dayDataStore.readDayData(dateStr);
  }
  async saveDayData(dateStr, scores, customItems, diaryContent) {
    await this.dayDataStore.saveDayData(
      dateStr,
      scores,
      customItems,
      diaryContent
    );
  }
  async renameUserInFiles(oldName, newName) {
    await this.dayDataStore.renameUserInFiles(oldName, newName);
  }
  async migrateSavePath(oldPath, newPath) {
    await this.dayDataStore.migrateSavePath(oldPath, newPath);
  }
  async getAllScores() {
    return this.dayDataStore.getAllScores();
  }
};
