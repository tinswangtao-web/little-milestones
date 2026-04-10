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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try { step(generator.next(value)); } catch (e) { reject(e); }
    };
    var rejected = (value) => {
      try { step(generator.throw(value)); } catch (e) { reject(e); }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
var main_exports = {};
__export(main_exports, { default: () => KidScorePlugin });
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

var DEFAULT_SETTINGS = {
  childName: "My Child",
  savePath: "Little Milestones/Daily Records",
  items: [],
  categories: ["\u52A0\u5206\u9879", "\u51CF\u5206\u9879"],
  scoringRules: "",
  diaryTemplate: "### \u5929\u6C14\u4E0E\u5FC3\u60C5\n\u5929\u6C14\uFF1A\n\u5FC3\u60C5\uFF1A\n\n### \u4ECA\u65E5\u6D3B\u52A8\n\u5730\u70B9\uFF1A\n\u6D3B\u52A8\uFF1A\n\n### \u996E\u98DF\u8BB0\u5F55\n\u65E9\u9910\uFF1A\n\u5348\u9910\uFF1A\n\u665A\u9910\uFF1A\n\u96F6\u98DF/\u6C34\u679C\uFF1A\n\u5728\u5BB6\u505A\u996D\uFF1A\u662F/\u5426\n\u83DC\u5355\uFF1A\n\u8BC4\u4EF7\uFF1A\n\n### \u8FD0\u52A8\u4E0E\u5065\u5EB7\n\u8FD0\u52A8\u9879\u76EE\uFF1A\n\u8FD0\u52A8\u65F6\u957F\uFF1A\n\u7761\u7720\u60C5\u51B5\uFF1A\n\n### \u5B66\u4E60\u4E0E\u6210\u957F\n\n\n### \u5176\u4ED6\u8BB0\u5F55\n\n"
};

var DIARY_MARKER = "<!-- DIARY_START -->";

/* ── Comprehensive emoji data (iOS-like categories) ── */
var EMOJI_DATA = {
  "\u{1F600} \u7B11\u8138": ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  "\u{1F44B} \u624B\u52BF": ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄"],
  "\u2B50 \u661F\u53F7": ["⭐","🌟","✨","💫","🔥","💥","💢","💦","💨","🕳️","💣","💬","💭","💤","🎯","🏆","🏅","🥇","🥈","🥉","⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎱","🪀","🏓","🏸","🥊","🥋","⛳","⛸️","🎣","🤿","🎿","🛷","🥌","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🪘","🎷","🎺","🪗","🎸","🪕","🎻"],
  "\u{1F466} \u4EBA\u7269": ["👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷","👮","🕵️","💂","🥷","👷","🫅","🤴","👸","👳","👲","🧕","🤵","👰","🤰","🤱","👼","🎅","🤶","🦸","🦹","🧙","🧚","🧛","🧜","🧝","🧞","🧟","🧌","💆","💇","🚶","🧍","🧎","🏃","💃","🕺","👯","🧖","🧗","🤸","⛹️","🏋️","🚴","🚵","🤼","🤽","🤾","🤺","🏇","⛷️","🏂","🏌️","🏄","🚣","🏊","🤹","🧘"],
  "\u{1F34E} \u98DF\u7269": ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🫒","🧄","🧅","🥔","🍠","🫘","🥐","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","🫖","☕","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🫗","🧊"],
  "\u{1F3E0} \u5730\u70B9": ["🏠","🏡","🏘️","🏚️","🏗️","🏢","🏬","🏣","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛️","⛪","🕌","🕍","🛕","🕋","⛩️","🛤️","🛣️","🗾","🎑","🏞️","🌅","🌄","🌠","🎇","🎆","🌇","🌆","🏙️","🌃","🌌","🌉","🌁"],
  "\u{1F331} \u81EA\u7136": ["🌱","🪴","🌲","🌳","🌴","🌵","🌿","☘️","🍀","🍁","🍂","🍃","🪹","🪺","🍄","🌾","💐","🌷","🌹","🥀","🌺","🌸","🌼","🌻","🌞","🌝","🌛","🌜","🌚","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌙","🌎","🌍","🌏","🪐","💫","⭐","🌟","✨","⚡","☄️","💥","🔥","🌪️","🌈","☀️","🌤️","⛅","🌥️","☁️","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄","🌬️","💨","💧","💦","🫧","☔","☂️","🌊","🌫️"],
  "\u{1F4DA} \u7269\u54C1": ["📚","📖","📕","📗","📘","📙","📓","📒","📃","📜","📄","📰","🗞️","📑","🔖","🏷️","💰","🪙","💴","💵","💶","💷","💸","💳","🧾","💹","✉️","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","🗳️","✏️","✒️","🖋️","🖊️","🖌️","🖍️","📝","💼","📁","📂","🗂️","📅","📆","🗒️","🗓️","📇","📈","📉","📊","📋","📌","📍","📎","🖇️","📏","📐","✂️","🗃️","🗄️","🗑️","🔒","🔓","🔏","🔐","🔑","🗝️","🔨","🪓","⛏️","⚒️","🛠️","🗡️","⚔️","🔫","🪃","🏹","🛡️","🪚","🔧","🪛","🔩","⚙️","🗜️","⚖️","🦯","🔗","⛓️","🪝","🧰","🧲","🪜","💡","🔦","🕯️","🪔","🧯","🛢️","💸","🔮","🧿","🪬","🧸","🪆","🖼️","🛍️","📿","💎","🔇","🔈","🔉","🔊","📢","📣","📯","🔔","🔕","🎵","🎶","🎙️","🎚️","🎛️","📻","📱","📲","☎️","📞","📟","📠","🔋","🔌","💻","🖥️","🖨️","⌨️","🖱️","🖲️","💽","💾","💿","📀","🧮","🎥","🎞️","📽️","🎬","📺","📷","📸","📹","🔍","🔎","🕯️","💡","🔦","🏮","🪔"],
  "\u{1F698} \u4EA4\u901A": ["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🦯","🦽","🦼","🛴","🚲","🛵","🏍️","🛺","🚔","🚍","🚘","🚖","🛞","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈️","🛫","🛬","🛩️","💺","🛰️","🚀","🛸","🚁","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","⚓","🪝","⛽","🚧","🚦","🚥","🛑","🚏"],
  "\u2764\uFE0F \u5FC3": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","🉑","☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","💮","🉐","㊙️","㊗️","🈴","🈵","🈹","🈲","🅰️","🅱️","🆎","🆑","🅾️","🆘","❌","⭕","🛑","⛔","📛","🚫","💯","💢","♨️","🚷","🚯","🚳","🚱","🔞","📵","🚭","❗","❕","❓","❔","‼️","⁉️","🔅","🔆","〽️","⚠️","🚸","🔱","⚜️","🔰","♻️","✅","🈯","💹","❇️","✳️","❎","🌐","💠","Ⓜ️","🌀","💤","🏧","🚾","♿","🅿️","🛗","🈳","🈂️","🛂","🛃","🛄","🛅","🚹","🚺","🚼","⚧️","🚻","🚮","🎦","📶","🈁","🔣","ℹ️","🔤","🔡","🔠","🆖","🆗","🆙","🆒","🆕","🆓","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔢","#️⃣","*️⃣","⏏️","▶️","⏸️","⏯️","⏹️","⏺️","⏭️","⏮️","⏩","⏪","⏫","⏬","◀️","🔼","🔽","➡️","⬅️","⬆️","⬇️","↗️","↘️","↙️","↖️","↕️","↔️","↩️","↪️","⤴️","⤵️","🔀","🔁","🔂","🔄","🔃","🎵","🎶","➕","➖","➗","✖️","🟰","♾️","💲","💱","™️","©️","®️","👁️‍🗨️","🔚","🔙","🔛","🔜","🔝"]
};

/* ── Emoji search index (Chinese + English keywords) ── */
var EMOJI_SEARCH = {
  "😀":"笑 开心 高兴 快乐 smile happy grin","😃":"笑 开心 高兴 smile happy","😄":"笑 开心 大笑 smile grin laugh","😁":"笑 嘿嘿 露齿 grin beam","😆":"笑 哈哈 大笑 laugh squint","😅":"笑 尴尬 汗 sweat smile awkward","🤣":"笑 大笑 笑哭 哈哈 rofl laugh cry","😂":"笑 笑哭 眼泪 joy laugh cry tear","🙂":"微笑 笑 smile slight","🙃":"倒脸 颠倒 upside down","😉":"眨眼 暗示 wink","😊":"害羞 微笑 腼腆 blush smile shy","😇":"天使 善良 angel halo","🥰":"喜欢 爱心 爱 love heart face","😍":"爱心 喜欢 爱 心眼 heart eyes love","🤩":"星星 崇拜 追星 star struck wow","😘":"亲亲 飞吻 吻 kiss blow","😗":"亲亲 嘟嘴 kiss","😚":"亲亲 害羞 kiss shy blush","😙":"亲亲 口哨 kiss whistle","🥲":"感动 笑中带泪 微笑 smile tear","😋":"好吃 美味 馋 yummy delicious tongue","😛":"吐舌 调皮 tongue playful","😜":"调皮 搞怪 吐舌 wink tongue crazy","🤪":"疯狂 搞怪 zany crazy wild","😝":"吐舌 鬼脸 tongue squint","🤑":"发财 钱 财迷 money rich dollar","🤗":"拥抱 抱抱 hug warm","🤭":"偷笑 捂嘴 giggle cover","🤫":"嘘 安静 秘密 shush quiet secret","🤔":"思考 想 疑问 think wonder hmm","🤐":"闭嘴 沉默 zip mouth silent","🤨":"怀疑 质疑 raised eyebrow skeptic","😐":"冷漠 无语 neutral blank","😑":"无语 无聊 expressionless","😶":"沉默 无语 mute no mouth","😏":"坏笑 得意 smirk sly","😒":"不屑 嫌弃 unamused bored","🙄":"翻白眼 无语 eye roll whatever","😬":"尴尬 龇牙 grimace awkward","😌":"放松 舒适 满足 relieved calm peaceful","😔":"失落 难过 沮丧 sad pensive down","😪":"困 瞌睡 睡觉 sleepy tired","🤤":"流口水 馋 drool hungry","😴":"睡觉 困 睡眠 晚安 sleep zzz night","😷":"口罩 生病 感冒 mask sick cold","🤒":"发烧 生病 温度计 fever sick thermometer","🤕":"受伤 头痛 绷带 hurt injury bandage","🤢":"恶心 想吐 nauseous sick green","🤮":"吐 恶心 呕吐 vomit throw up sick","🥵":"热 出汗 发热 hot heat sweat","🥶":"冷 冻 寒冷 cold freeze frozen","🥴":"晕 醉 woozy dizzy drunk","😵":"晕 头晕 眩晕 dizzy daze","🤯":"爆炸 震惊 炸裂 mind blown explode shock","🤠":"牛仔 帅 cowboy","🥳":"庆祝 派对 生日 聚会 party celebrate birthday","😎":"酷 墨镜 帅 cool sunglasses","🤓":"书呆子 眼镜 学霸 nerd glasses geek","🧐":"审视 单片眼镜 monocle inspect","😕":"困惑 不解 confused","😟":"担心 忧虑 worried concern","🙁":"难过 不开心 sad frown","😮":"惊讶 吃惊 surprise open mouth","😯":"惊讶 吃惊 hushed surprise","😲":"震惊 大惊 astonished shock","😳":"脸红 害羞 尴尬 flushed blush embarrass","🥺":"可怜 求求 撒娇 pleading puppy eyes","🥹":"感动 忍住 holding tears touched","😨":"害怕 恐惧 fearful scared afraid","😰":"焦虑 紧张 冷汗 anxious nervous sweat","😥":"失望 释然 disappointed relieved","😢":"哭 难过 伤心 cry sad tear","😭":"大哭 伤心 痛哭 sob cry loud","😱":"尖叫 恐惧 吓 scream fear horror","😖":"痛苦 难受 confounded pain","😣":"忍耐 坚持 persevere endure","😞":"失望 沮丧 disappointed sad","😓":"汗 无奈 sweat downcast","😩":"疲惫 累 崩溃 weary exhausted tired","😫":"累 疲惫 tired exhausted","🥱":"打哈欠 困 无聊 yawn sleepy bored","😤":"生气 愤怒 哼 angry huff steam","😡":"愤怒 生气 rage angry red","😠":"生气 不满 angry mad","🤬":"骂人 脏话 愤怒 swear curse angry","😈":"恶魔 坏 调皮 devil evil imp","👿":"恶魔 生气 devil angry imp","💀":"骷髅 死 吓 skull dead","☠️":"骷髅 危险 死亡 skull crossbones danger","💩":"便便 屎 poop poo shit","🤡":"小丑 clown","👹":"妖怪 鬼 ogre monster","👺":"天狗 鬼 goblin tengu","👻":"鬼 幽灵 万圣节 ghost halloween boo","👽":"外星人 alien ufo","👾":"怪物 游戏 monster alien game","🤖":"机器人 robot bot",
  "👋":"挥手 你好 再见 拜拜 wave hello hi bye","🤚":"手 停 举手 hand stop raise","🖐️":"手 五 张开 hand five open","✋":"手 停 高五 hand stop high five","🖖":"手 vulcan spock","👌":"好的 OK 可以 没问题 ok okay perfect","🤏":"一点点 少量 pinch small little","✌️":"胜利 耶 剪刀 victory peace yeah","🤞":"祈祷 好运 cross finger luck hope","🤟":"爱你 摇滚 love you rock","🤘":"摇滚 rock metal horn","🤙":"打电话 联系 call phone shaka","👈":"左 指 left point","👉":"右 指 right point","👆":"上 指 up point","👇":"下 指 down point","☝️":"上 指 第一 point up first","👍":"好 赞 棒 厉害 点赞 like good thumb up great nice","👎":"差 不好 踩 dislike bad thumb down","✊":"加油 拳头 坚持 fist power fight","👊":"拳头 打 加油 punch fist bump","👏":"鼓掌 掌声 拍手 棒 clap applause bravo","🙌":"庆祝 万岁 欢呼 raise hand hooray celebrate","🫶":"比心 爱心 心 heart hands love","👐":"张开 拥抱 open hand hug","🤝":"握手 合作 协议 handshake deal agree","🙏":"祈祷 感谢 拜托 谢谢 请 pray thank please hope","💪":"肌肉 力量 加油 健身 强 muscle strong power flex gym","👀":"看 眼睛 注意 eyes look see watch","👅":"舌头 吐舌 tongue lick","👄":"嘴 嘴唇 亲 mouth lips kiss",
  "⭐":"星 星星 star","🌟":"星 闪亮 发光 star glow shine","✨":"闪 闪亮 闪耀 亮晶晶 sparkle shine glitter","💫":"头晕 星星 dizzy star","🔥":"火 热门 厉害 牛 fire hot lit flame","💥":"爆炸 碰撞 boom crash explosion","💢":"生气 愤怒 anger symbol","💦":"汗 水 sweat drop water splash","💨":"风 快 跑 wind dash fast","💣":"炸弹 bomb","💬":"对话 说话 聊天 speech chat talk bubble","💭":"思考 想法 thought think bubble","💤":"睡觉 困 zzz sleep","🎯":"目标 靶子 命中 target bullseye goal","🏆":"奖杯 冠军 第一 胜利 trophy champion winner cup","🏅":"奖牌 勋章 medal award","🥇":"金牌 第一 冠军 gold first winner","🥈":"银牌 第二 silver second","🥉":"铜牌 第三 bronze third","⚽":"足球 球 soccer football","🏀":"篮球 球 basketball","🏈":"橄榄球 football american","⚾":"棒球 baseball","🎾":"网球 tennis","🏐":"排球 volleyball","🎱":"台球 桌球 billiards pool","🏓":"乒乓球 球 ping pong table tennis","🏸":"羽毛球 球 badminton","🥊":"拳击 打拳 boxing glove","🥋":"武术 跆拳道 空手道 martial arts karate","🎪":"马戏团 演出 circus tent","🎭":"戏剧 表演 面具 theater drama mask","🎨":"画 绘画 美术 艺术 art paint palette draw","🎬":"电影 拍摄 movie film clapper","🎤":"麦克风 唱歌 KTV microphone sing karaoke","🎧":"耳机 听歌 音乐 headphone music listen","🎼":"音乐 乐谱 music score note","🎹":"钢琴 弹琴 piano keyboard","🥁":"鼓 打鼓 drum","🎷":"萨克斯 音乐 saxophone","🎺":"喇叭 号 trumpet horn","🎸":"吉他 音乐 guitar","🎻":"小提琴 音乐 violin",
  "👶":"宝宝 婴儿 小孩 baby infant","🧒":"小孩 儿童 孩子 child kid","👦":"男孩 男生 boy","👧":"女孩 女生 girl","🧑":"人 成人 person adult","👨":"男人 爸爸 父亲 man father dad","👩":"女人 妈妈 母亲 woman mother mom","🧓":"老人 elder old","👴":"爷爷 老爷爷 grandpa old man","👵":"奶奶 老奶奶 grandma old woman","👮":"警察 police cop officer","🕵️":"侦探 detective spy","💂":"卫兵 guard","🥷":"忍者 ninja","👷":"工人 建筑 worker construction builder","🤴":"王子 prince","👸":"公主 princess","👳":"头巾 turban","🤵":"新郎 西装 groom suit tuxedo","👰":"新娘 婚礼 bride wedding","🤰":"孕妇 怀孕 pregnant","🤱":"哺乳 妈妈 喂奶 breastfeed nursing mother","👼":"天使 宝宝 angel baby cherub","🎅":"圣诞老人 圣诞 santa christmas","🦸":"超人 英雄 superhero hero","🦹":"反派 villain","🧙":"魔法师 巫师 wizard mage magic","🧚":"精灵 仙女 fairy","💆":"按摩 放松 massage relax spa","💇":"理发 剪发 haircut barber","🚶":"走路 步行 散步 walk pedestrian","🏃":"跑步 运动 跑 run jog exercise","💃":"跳舞 舞蹈 dance salsa","🕺":"跳舞 舞蹈 dance disco","🧖":"桑拿 温泉 sauna spa steam","🧗":"攀岩 爬 climb rock","🤸":"翻跟头 体操 cartwheel gymnastics","🏋️":"举重 健身 weightlift gym fitness","🚴":"骑车 自行车 骑行 bike cycle bicycle","🤼":"摔跤 wrestle","🤽":"水球 water polo","🤾":"手球 handball","🏄":"冲浪 滑浪 surf wave","🏊":"游泳 swim pool","🧘":"瑜伽 冥想 打坐 yoga meditate zen",
  "🍎":"苹果 水果 apple fruit","🍐":"梨 水果 pear fruit","🍊":"橘子 橙子 水果 orange tangerine fruit","🍋":"柠檬 水果 lemon fruit","🍌":"香蕉 水果 banana fruit","🍉":"西瓜 水果 watermelon fruit","🍇":"葡萄 水果 grape fruit","🍓":"草莓 水果 strawberry fruit","🫐":"蓝莓 水果 blueberry fruit","🍒":"樱桃 水果 cherry fruit","🍑":"桃子 水果 peach fruit","🥭":"芒果 水果 mango fruit","🍍":"菠萝 水果 pineapple fruit","🥥":"椰子 水果 coconut fruit","🥝":"猕猴桃 水果 kiwi fruit","🍅":"番茄 西红柿 蔬菜 tomato vegetable","🍆":"茄子 蔬菜 eggplant aubergine","🥑":"牛油果 蔬菜 avocado","🥦":"西兰花 蔬菜 broccoli vegetable","🥒":"黄瓜 蔬菜 cucumber vegetable","🌶️":"辣椒 辣 pepper hot chili spicy","🌽":"玉米 corn","🥕":"胡萝卜 萝卜 蔬菜 carrot vegetable","🧄":"大蒜 蒜 garlic","🧅":"洋葱 onion","🥔":"土豆 马铃薯 potato","🍠":"红薯 地瓜 sweet potato","🍞":"面包 bread","🧀":"奶酪 芝士 cheese","🥚":"鸡蛋 蛋 egg","🍳":"煎蛋 做饭 煮 cooking egg fry","🥞":"煎饼 薄饼 pancake","🥓":"培根 肉 bacon meat","🥩":"牛排 肉 steak meat beef","🍗":"鸡腿 肉 chicken leg drumstick","🍖":"排骨 肉 meat bone rib","🌭":"热狗 hotdog","🍔":"汉堡 快餐 burger hamburger fast food","🍟":"薯条 快餐 fries fast food","🍕":"披萨 快餐 pizza","🥪":"三明治 sandwich","🥙":"卷饼 pita wrap","🌮":"墨西哥 卷 taco","🥗":"沙拉 蔬菜 salad","🍝":"意面 面条 pasta spaghetti noodle","🍜":"面条 拉面 汤面 noodle ramen soup","🍲":"火锅 炖菜 汤 hotpot stew soup","🍛":"咖喱 饭 curry rice","🍣":"寿司 日料 sushi japanese","🍱":"便当 盒饭 饭盒 bento lunch box","🥟":"饺子 馄饨 dumpling","🍤":"虾 炸虾 shrimp prawn","🍙":"饭团 米饭 rice ball onigiri","🍚":"米饭 饭 rice bowl","🍘":"米饼 仙贝 rice cracker","🍢":"关东煮 串 oden skewer","🍡":"团子 丸子 dango","🍧":"刨冰 冰沙 shaved ice","🍨":"冰淇淋 雪糕 ice cream","🍦":"甜筒 冰淇淋 ice cream cone","🥧":"派 馅饼 pie","🧁":"杯子蛋糕 蛋糕 cupcake","🍰":"蛋糕 甜点 cake dessert","🎂":"生日蛋糕 生日 birthday cake","🍮":"布丁 果冻 pudding custard","🍭":"棒棒糖 糖 lollipop candy","🍬":"糖果 糖 candy sweet","🍫":"巧克力 chocolate","🍿":"爆米花 popcorn","🍩":"甜甜圈 donut doughnut","🍪":"饼干 曲奇 cookie","🥜":"花生 坚果 peanut nut","🍯":"蜂蜜 honey","🥛":"牛奶 奶 milk","🍼":"奶瓶 婴儿 baby bottle","🫖":"茶壶 茶 teapot","☕":"咖啡 热饮 coffee cafe hot drink","🍵":"茶 抹茶 绿茶 tea matcha green","🧃":"果汁 juice box","🥤":"奶茶 饮料 drink cup straw","🧋":"珍珠奶茶 奶茶 波霸 bubble tea boba milk tea","🍺":"啤酒 干杯 beer","🍻":"干杯 啤酒 碰杯 cheers beer clink","🥂":"香槟 庆祝 干杯 champagne cheers toast","🍷":"红酒 葡萄酒 wine red","🍸":"鸡尾酒 cocktail martini","🍹":"饮料 热带 tropical drink","🧊":"冰 冰块 ice cube",
  "🏠":"家 房子 房屋 home house","🏡":"别墅 花园 house garden","🏢":"办公楼 公司 上班 office building work","🏥":"医院 看病 hospital","🏦":"银行 bank","🏨":"酒店 宾馆 住 hotel","🏪":"便利店 商店 store shop convenience","🏫":"学校 上学 school","💒":"婚礼 教堂 wedding chapel","🏛️":"博物馆 museum","⛪":"教堂 church","⛩️":"神社 日本 shrine japan","🌅":"日出 早晨 sunrise morning","🌄":"日出 山 sunrise mountain","🌇":"日落 黄昏 sunset evening","🌆":"城市 黄昏 city dusk sunset","🏙️":"城市 高楼 city skyline","🌃":"夜晚 城市 星空 night city star","🌉":"夜景 桥 bridge night",
  "🌱":"发芽 生长 种子 seed sprout grow plant","🪴":"盆栽 植物 potted plant","🌲":"树 松树 tree pine evergreen","🌳":"树 大树 tree deciduous","🌴":"棕榈树 椰子树 热带 palm tree tropical","🌵":"仙人掌 沙漠 cactus desert","🌿":"草 叶子 植物 herb leaf plant green","🍀":"四叶草 幸运 clover lucky four leaf","🍁":"枫叶 秋天 maple leaf autumn fall","🍂":"落叶 秋天 fallen leaf autumn","🍃":"叶子 风 leaf wind","🍄":"蘑菇 mushroom","🌾":"稻谷 麦子 rice wheat grain","💐":"花束 鲜花 送花 bouquet flower","🌷":"郁金香 花 tulip flower","🌹":"玫瑰 花 爱情 rose flower love","🥀":"枯萎 凋谢 wilted flower","🌺":"花 芙蓉 hibiscus flower","🌸":"樱花 花 cherry blossom sakura flower","🌼":"花 向日葵 blossom flower","🌻":"向日葵 太阳花 sunflower","🌞":"太阳 晴天 sun sunny","🌙":"月亮 晚上 夜晚 moon crescent night","🌈":"彩虹 rainbow","☀️":"太阳 晴天 天气 sun sunny weather","⛅":"多云 天气 cloud sun weather partly","☁️":"云 阴天 天气 cloud weather cloudy","🌧️":"下雨 雨天 天气 rain weather","⛈️":"雷雨 暴风雨 天气 thunder storm weather","❄️":"雪花 下雪 冬天 冷 snow snowflake cold winter","☃️":"雪人 冬天 snowman winter","⛄":"雪人 冬天 snowman winter","🌊":"浪 海浪 海 大海 wave ocean sea water","☔":"雨伞 下雨 umbrella rain",
  "📚":"书 书籍 学习 读书 阅读 book study read learn","📖":"书 读书 阅读 book read open","📕":"书 红 book red","📗":"书 绿 book green","📘":"书 蓝 book blue","📝":"笔记 写 记录 备忘 memo note write","💰":"钱 金钱 金币 money bag gold coin","💵":"钱 美元 钞票 money dollar bill cash","💸":"花钱 钱飞了 money fly spend","💳":"信用卡 银行卡 刷卡 credit card bank","✏️":"铅笔 写 画 pencil write draw","✒️":"钢笔 写 pen ink write","📅":"日历 日期 计划 calendar date plan schedule","📆":"日历 日期 calendar date","📈":"上涨 增长 进步 chart up grow increase","📉":"下降 下跌 chart down decrease","📊":"图表 统计 数据 chart bar graph data","📋":"剪贴板 清单 列表 clipboard list checklist","📌":"图钉 标记 pin pushpin mark","📎":"回形针 paperclip clip","✂️":"剪刀 剪 scissors cut","🔑":"钥匙 关键 key","🔨":"锤子 工具 hammer tool","🔧":"扳手 工具 修理 wrench tool fix repair","⚙️":"齿轮 设置 gear settings config","💡":"灯泡 想法 主意 bulb idea light","🔦":"手电筒 照明 flashlight torch","🧸":"玩具熊 泰迪熊 毛绒 teddy bear toy plush","💎":"钻石 宝石 diamond gem jewel","🔔":"铃铛 通知 提醒 bell ring notification alert","🔕":"静音 关闭通知 mute bell silent","🎵":"音乐 音符 music note","🎶":"音乐 音符 歌曲 music note song","📱":"手机 电话 phone mobile cell","💻":"电脑 笔记本 计算机 computer laptop","🖥️":"电脑 显示器 台式 desktop computer monitor","📺":"电视 电视机 tv television","📷":"相机 拍照 照相 camera photo","📸":"拍照 闪光 camera flash photo","📹":"摄像 录像 video camera record","🔍":"搜索 放大镜 查找 search magnify find look","🔎":"搜索 放大镜 search magnify",
  "🚗":"汽车 车 开车 小轿车 car automobile drive","🚕":"出租车 的士 打车 taxi cab","🚙":"SUV 越野车 车 suv car truck","🚌":"公交车 巴士 bus","🏎️":"赛车 跑车 race car racing formula","🚓":"警车 police car","🚑":"救护车 ambulance","🚒":"消防车 fire truck engine","🚐":"面包车 van minibus","🚚":"货车 卡车 truck delivery","🚛":"大卡车 货车 truck lorry","🚜":"拖拉机 tractor farm","🚲":"自行车 单车 骑车 bicycle bike cycle","🛵":"摩托车 电动车 scooter motor","🏍️":"摩托 机车 motorcycle","🚄":"高铁 火车 动车 train high speed bullet","🚅":"高铁 新干线 bullet train","🚂":"火车 蒸汽 train steam locomotive","🚇":"地铁 metro subway underground","✈️":"飞机 飞 旅行 airplane plane flight travel","🚀":"火箭 发射 快 rocket launch fast space","🛸":"飞碟 UFO flying saucer","🚁":"直升机 helicopter","⛵":"帆船 航海 sailboat sailing","🚤":"快艇 船 speedboat boat","🚢":"轮船 大船 ship cruise","⚓":"锚 停泊 anchor dock",
  "❤️":"心 爱心 爱 红心 喜欢 heart love red like","🧡":"心 爱心 橙 heart orange","💛":"心 爱心 黄 heart yellow","💚":"心 爱心 绿 heart green","💙":"心 爱心 蓝 heart blue","💜":"心 爱心 紫 heart purple","🖤":"心 爱心 黑 heart black","🤍":"心 爱心 白 heart white","💔":"心碎 伤心 分手 broken heart","💕":"心 爱 双心 two heart love","💖":"心 闪亮 sparkling heart","💗":"心 跳动 成长 growing heart","💘":"心 丘比特 爱情 cupid heart love arrow","💝":"心 礼物 heart ribbon gift","💯":"满分 一百 完美 hundred perfect score","❌":"错 叉 不 取消 cross wrong no cancel","⭕":"对 圈 是 circle","✅":"完成 对 通过 正确 好 check done yes correct complete","❗":"注意 重要 感叹号 exclamation important","❓":"问号 疑问 什么 question mark what","⚠️":"警告 注意 小心 warning caution alert","🚫":"禁止 不允许 prohibited forbidden no","♻️":"回收 环保 recycle green"
};

function formatDate(offset) {
  if (offset === void 0) offset = 0;
  var d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Shared Emoji Picker
   ═══════════════════════════════════════════════════════════════════════════ */
function getOverlayMount(containerEl) {
  // Mobile: mount to body so position:fixed works against the viewport.
  // Desktop: mount inside containerEl to avoid Obsidian's modal focus trap.
  return document.body.classList.contains("is-mobile") ? document.body : (containerEl || document.body);
}
function showEmojiPicker(callback, container) {
  var overlay = document.createElement("div");
  overlay.className = "kid-score-value-overlay";

  var popup = document.createElement("div");
  popup.className = "kid-score-emoji-fullpicker";

  // Header
  var header = document.createElement("div");
  header.className = "emoji-fp-header";
  header.textContent = "\u9009\u62E9\u56FE\u6807";
  popup.appendChild(header);

  // Search input
  var customRow = document.createElement("div");
  customRow.className = "emoji-fp-custom";
  var customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "\u641C\u7D22\uFF1A\u8F93\u5165\u4E2D\u6587\u5173\u952E\u5B57\u6216\u76F4\u63A5\u8F93\u5165emoji...";
  customInput.maxLength = 32;
  customInput.className = "emoji-fp-input";
  customInput.setAttribute("inputmode", "text");
  customInput.addEventListener("mousedown", function(e) { e.stopPropagation(); });
  customInput.addEventListener("touchstart", function(e) { e.stopPropagation(); });
  customInput.addEventListener("focusout", function(e) {
    if (overlay.contains(document.activeElement) || !overlay.parentElement) return;
    // Don't steal focus during IME composition
    if (customInput.composing) return;
    e.stopPropagation();
    setTimeout(function() { if (overlay.parentElement && !overlay.contains(document.activeElement)) customInput.focus(); }, 50);
  });
  var customConfirm = document.createElement("button");
  customConfirm.className = "value-popup-confirm mod-cta";
  customConfirm.textContent = "\u786E\u5B9A";
  customConfirm.style.padding = "6px 16px";
  customConfirm.onclick = function() {
    var v = customInput.value.trim();
    if (v) { callback(v); overlay.remove(); }
  };
  customRow.appendChild(customInput);
  customRow.appendChild(customConfirm);
  popup.appendChild(customRow);

  // Category tabs
  var catTabs = document.createElement("div");
  catTabs.className = "emoji-fp-tabs";
  var catKeys = Object.keys(EMOJI_DATA);

  var gridWrap = document.createElement("div");
  gridWrap.className = "emoji-fp-grid-wrap";

  var renderEmojis = function(emojis) {
    gridWrap.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "emoji-fp-grid";
    for (var i = 0; i < emojis.length; i++) {
      (function(em) {
        var btn = document.createElement("button");
        btn.className = "emoji-fp-btn";
        btn.textContent = em;
        btn.onclick = function() { callback(em); overlay.remove(); };
        grid.appendChild(btn);
      })(emojis[i]);
    }
    if (emojis.length === 0) {
      var hint = document.createElement("div");
      hint.style.cssText = "text-align:center;color:var(--text-muted);padding:20px;font-size:0.9em;";
      hint.textContent = "\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684 emoji";
      gridWrap.appendChild(hint);
    }
    gridWrap.appendChild(grid);
  };

  var renderCat = function(key) {
    renderEmojis(EMOJI_DATA[key]);
  };

  var searchEmojis = function(query) {
    query = query.toLowerCase();
    var results = [];
    var seen = {};
    for (var em in EMOJI_SEARCH) {
      if (EMOJI_SEARCH[em].indexOf(query) !== -1) {
        if (!seen[em]) { results.push(em); seen[em] = true; }
      }
    }
    // Also search through all emoji data for any emoji containing the query text
    if (results.length === 0) {
      var catKeys2 = Object.keys(EMOJI_DATA);
      for (var ci = 0; ci < catKeys2.length; ci++) {
        if (catKeys2[ci].toLowerCase().indexOf(query) !== -1) {
          var arr = EMOJI_DATA[catKeys2[ci]];
          for (var ai = 0; ai < arr.length; ai++) { if (!seen[arr[ai]]) { results.push(arr[ai]); seen[arr[ai]] = true; } }
        }
      }
    }
    return results;
  };

  var searchTimer = null;
  var isComposing = false;
  customInput.addEventListener("compositionstart", function() { isComposing = true; customInput.composing = true; });
  customInput.addEventListener("compositionend", function() {
    isComposing = false;
    customInput.composing = false;
    doSearch();
  });
  var doSearch = function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() {
      if (isComposing) return;
      var q = customInput.value.trim();
      if (!q) {
        var activeTab = catTabs.querySelector(".emoji-fp-tab.is-active");
        if (activeTab) { renderCat(activeTab.title); }
        catTabs.style.display = "";
        return;
      }
      // If input is purely emoji characters (no letters), don't search — user is typing emoji directly
      var pureEmoji = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(q);
      if (pureEmoji) return;
      catTabs.style.display = "none";
      var results = searchEmojis(q);
      renderEmojis(results);
    }, 100);
  };
  customInput.addEventListener("input", function() {
    if (isComposing) return;
    doSearch();
  });

  for (var k = 0; k < catKeys.length; k++) {
    (function(key, idx) {
      var tab = document.createElement("button");
      tab.className = "emoji-fp-tab" + (idx === 0 ? " is-active" : "");
      tab.textContent = key.split(" ")[0]; // just the emoji icon
      tab.title = key;
      tab.onclick = function() {
        catTabs.querySelectorAll(".emoji-fp-tab").forEach(function(t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        renderCat(key);
      };
      catTabs.appendChild(tab);
    })(catKeys[k], k);
  }

  popup.appendChild(catTabs);
  popup.appendChild(gridWrap);

  // Render first category
  renderCat(catKeys[0]);

  // Cancel
  var cancelBtn = document.createElement("button");
  cancelBtn.className = "value-popup-cancel";
  cancelBtn.textContent = "\u53D6\u6D88";
  cancelBtn.style.marginTop = "8px";
  cancelBtn.style.width = "100%";
  cancelBtn.onclick = function() { overlay.remove(); };
  popup.appendChild(cancelBtn);

  overlay.appendChild(popup);
  overlay.addEventListener("mousedown", function(e) { if (e.target === overlay) { e.preventDefault(); overlay.remove(); } });
  popup.addEventListener("mousedown", function(e) { e.stopPropagation(); });
  popup.addEventListener("click", function(e) { e.stopPropagation(); });
  popup.addEventListener("focusin", function(e) { e.stopPropagation(); });
  popup.addEventListener("focusout", function(e) { e.stopPropagation(); });
  getOverlayMount(container).appendChild(overlay);
  // Give the input focus after render so keyboard appears
  setTimeout(function() { customInput.focus(); }, 50);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Plugin
   ═══════════════════════════════════════════════════════════════════════════ */
var KidScorePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
  }

  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      // Migrate: add category field to old items
      var changed = false;
      if (!this.settings.categories || this.settings.categories.length === 0) {
        this.settings.categories = ["\u52A0\u5206\u9879", "\u51CF\u5206\u9879"];
        changed = true;
      }
      for (var it of this.settings.items) {
        if (!it.category) {
          it.category = it.points >= 0 ? this.settings.categories[0] : (this.settings.categories[1] || this.settings.categories[0]);
          changed = true;
        }
      }
      if (changed) yield this.saveSettings();

      this.addRibbonIcon("star", "Little Milestones 🌱", () => {
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
    });
  }

  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }

  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }

  filePath(dateStr) {
    return (0, import_obsidian.normalizePath)(this.settings.savePath + "/" + dateStr + ".md");
  }

  /* ── Read day data (backward compatible) ── */
  readDayData(dateStr) {
    return __async(this, null, function* () {
      var file = this.app.vault.getAbstractFileByPath(this.filePath(dateStr));
      if (!(file instanceof import_obsidian.TFile)) return null;
      var content = yield this.app.vault.read(file);
      var fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) return null;
      var fm = fmMatch[1];
      var totalMatch = fm.match(/total:\s*(-?\d+)/);
      var total = totalMatch ? parseInt(totalMatch[1]) : 0;
      var scores = {};
      var scoreBlock = fm.match(/scores:\s*\n([\s\S]*?)(?=\n\w|$)/);
      if (scoreBlock) {
        for (var line of scoreBlock[1].split("\n")) {
          var kvNum = line.match(/\s+(item_\d+):\s*(-?\d+)/);
          if (kvNum) { scores[kvNum[1]] = parseInt(kvNum[2]); continue; }
          var kvBool = line.match(/\s+(item_\d+):\s*(true|false)/);
          if (kvBool) {
            var itemDef = this.settings.items.find(function(it) { return it.id === kvBool[1]; });
            scores[kvBool[1]] = kvBool[2] === "true" ? (itemDef ? itemDef.points : 1) : 0;
          }
        }
      }
      var customItems = [];
      var customBlock = fm.match(/customItems:\s*\n((?:\s+-\s*"[^"]*"\n?)*)/);
      if (customBlock) {
        var lines = customBlock[1].split("\n");
        for (var cl of lines) {
          var cm = cl.match(/-\s*"(.+?)\|(.+?)\|(-?\d+)"/);
          if (cm) {
            customItems.push({ id: "custom_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), emoji: cm[1], name: cm[2], points: parseInt(cm[3]) });
          }
        }
      }
      var diaryContent = "";
      var diaryHeadingIdx = content.indexOf("## \uD83D\uDCDD \u4ECA\u65E5\u65E5\u8BB0");
      if (diaryHeadingIdx !== -1) {
        diaryContent = content.slice(diaryHeadingIdx).replace(/^##\s*\uD83D\uDCDD\s*\u4ECA\u65E5\u65E5\u8BB0\s*\n?/, "").trim();
      } else {
        var diaryIdx = content.indexOf(DIARY_MARKER);
        if (diaryIdx !== -1) {
          diaryContent = content.slice(diaryIdx + DIARY_MARKER.length).trim();
          diaryContent = diaryContent.replace(/^##\s*\uD83D\uDCDD\s*\u4ECA\u65E5\u65E5\u8BB0\s*\n?/, "").trim();
        }
      }
      return { date: dateStr, scores: scores, customItems: customItems, total: total, diaryContent: diaryContent };
    });
  }

  /* ── Save day data ── */
  saveDayData(dateStr, scores, customItems, diaryContent) {
    return __async(this, null, function* () {
      var items = this.settings.items;
      var d = new Date(dateStr + "T00:00:00");
      d.setDate(d.getDate() - 1);
      var yesterdayStr = d.toISOString().slice(0, 10);
      var yesterdayData = yield this.readDayData(yesterdayStr);
      var total = 0; var earnedCount = 0; var missedCount = 0;
      for (var item of items) {
        var val = scores[item.id] || 0;
        total += val;
        if (val > 0) earnedCount++; else missedCount++;
      }
      var customTotal = 0;
      for (var ci of customItems) { customTotal += ci.points; }
      total += customTotal;
      var allScores = yield this.getAllScores();
      var cumulativeTotal = 0; var cumulativeDays = 0;
      for (var s of allScores) { if (s.date !== dateStr) { cumulativeTotal += s.total; cumulativeDays++; } }
      var grandTotal = cumulativeTotal + total;
      var grandDays = cumulativeDays + 1;
      var grandAvg = grandDays > 0 ? Math.round(grandTotal / grandDays * 10) / 10 : 0;
      var diaryText = diaryContent || "";
      var weatherMatch = diaryText.match(/\u5929\u6C14\uFF1A\s*(.+)/);
      var moodMatch = diaryText.match(/\u5FC3\u60C5\uFF1A\s*(.+)/);
      var breakfastMatch = diaryText.match(/\u65E9\u9910\uFF1A\s*(.+)/);
      var lunchMatch = diaryText.match(/\u5348\u9910\uFF1A\s*(.+)/);
      var dinnerMatch = diaryText.match(/\u665A\u9910\uFF1A\s*(.+)/);
      var homeCookMatch = diaryText.match(/\u5728\u5BB6\u505A\u996D\uFF1A\s*(.+)/);
      var exerciseMatch = diaryText.match(/\u8FD0\u52A8\u9879\u76EE\uFF1A\s*(.+)/);
      var sleepMatch = diaryText.match(/\u7761\u7720\u60C5\u51B5\uFF1A\s*(.+)/);
      var scoresYaml = items.map(function(item) { return "  " + item.id + ": " + (scores[item.id] || 0); }).join("\n");
      var customYaml = "";
      if (customItems.length > 0) {
        customYaml = "\ncustomItems:\n" + customItems.map(function(ci) { return '  - "' + ci.emoji + "|" + ci.name + "|" + ci.points + '"'; }).join("\n");
      }
      var scoreDetailYaml = "\nscoreDetail:\n" + items.map(function(item) { var v = scores[item.id] || 0; return '  "' + item.name + '": ' + v; }).join("\n");
      if (customItems.length > 0) { for (var ci of customItems) { scoreDetailYaml += '\n  "\u4E34\u65F6-' + ci.name + '": ' + ci.points; } }
      var summaryYaml = "\nsummary:\n  earned: " + earnedCount + "\n  missed: " + missedCount + "\n  customCount: " + customItems.length + "\n  customTotal: " + customTotal + "\n  cumulativeTotal: " + grandTotal + "\n  cumulativeDays: " + grandDays + "\n  cumulativeAvg: " + grandAvg;
      var tagsYaml = "\ntags:";
      if (weatherMatch) tagsYaml += '\n  weather: "' + weatherMatch[1].trim() + '"';
      if (moodMatch) tagsYaml += '\n  mood: "' + moodMatch[1].trim() + '"';
      if (homeCookMatch) tagsYaml += '\n  homeCook: "' + homeCookMatch[1].trim() + '"';
      if (exerciseMatch) tagsYaml += '\n  exercise: "' + exerciseMatch[1].trim() + '"';
      if (sleepMatch) tagsYaml += '\n  sleep: "' + sleepMatch[1].trim() + '"';
      tagsYaml += "\n  hasDiary: " + (diaryText.trim().length > 0);
      var dietYaml = "";
      if (breakfastMatch || lunchMatch || dinnerMatch) {
        dietYaml = "\ndiet:";
        if (breakfastMatch) dietYaml += '\n  breakfast: "' + breakfastMatch[1].trim() + '"';
        if (lunchMatch) dietYaml += '\n  lunch: "' + lunchMatch[1].trim() + '"';
        if (dinnerMatch) dietYaml += '\n  dinner: "' + dinnerMatch[1].trim() + '"';
      }

      // Build markdown tables — grouped by category
      var hasYesterday = !!yesterdayData;
      var categories = this.settings.categories || [];
      var tableHeader = hasYesterday
        ? "| \u9879\u76EE | \u9ED8\u8BA4 | \u5F97\u5206 | \u72B6\u6001 | \u6628\u65E5 |\n|:---|---:|---:|:---:|:---:|\n"
        : "| \u9879\u76EE | \u9ED8\u8BA4 | \u5F97\u5206 | \u72B6\u6001 |\n|:---|---:|---:|:---:|\n";

      var renderRows = function(list) {
        return list.map(function(item) {
          var actual = scores[item.id] || 0;
          var isDeductItem = item.category === "\u51CF\u5206" || item.points < 0;
          var status = isDeductItem ? (actual !== 0 ? "\u2B55" : "\uD83D\uDD35") : (actual > 0 ? "\u2705" : "\u274C");
          var dSign = item.points >= 0 ? "+" : "";
          var aSign = actual >= 0 ? "+" : "";
          var cn = (actual !== 0 && actual !== item.points) ? " \u{1F4DD}" : "";
          var row = "| " + item.emoji + " " + item.name + " | " + dSign + item.points + " | " + aSign + actual + cn + " | " + status;
          if (hasYesterday) {
            var yVal = yesterdayData.scores[item.id] || 0;
            row += " | " + (yVal >= 0 ? "+" : "") + yVal + (yVal > 0 ? " \u2705" : (yVal < 0 ? " \u274C" : " \u2014"));
          }
          return row + " |";
        }).join("\n");
      };

      var tableContent = "";
      for (var cat of categories) {
        var catItems = items.filter(function(it) { return it.category === cat; });
        if (catItems.length > 0) {
          tableContent += "\n### " + cat + "\n\n" + tableHeader + renderRows(catItems) + "\n";
        }
      }
      var uncatItems = items.filter(function(it) { return !it.category || categories.indexOf(it.category) === -1; });
      if (uncatItems.length > 0) {
        tableContent += "\n### \u5176\u4ED6\n\n" + tableHeader + renderRows(uncatItems) + "\n";
      }
      if (customItems.length > 0) {
        tableContent += "\n### \u{1F4CC} \u4E34\u65F6\u4E8B\u9879\n\n| \u4E8B\u9879 | \u5F97\u5206 |\n|:---|---:|\n";
        for (var ci of customItems) { tableContent += "| " + ci.emoji + " " + ci.name + " | " + (ci.points >= 0 ? "+" : "") + ci.points + " |\n"; }
      }

      var totalSign = total >= 0 ? "+" : "";
      var grandSign = grandTotal >= 0 ? "+" : "";
      var totalItems = items.length;
      var completionRate = totalItems > 0 ? Math.round(earnedCount / totalItems * 100) : 0;
      var yesterdayRow = "";
      if (hasYesterday) {
        var yTotalSign = yesterdayData.total >= 0 ? "+" : "";
        yesterdayRow = "\n| \u{1F4C6} \u6628\u65E5\u603B\u5206 | " + yTotalSign + yesterdayData.total + " \u5206 |";
      }

      var content = "---\ndate: " + dateStr + "\nchild: " + this.settings.childName + "\ntotal: " + total + "\nscores:\n" + scoresYaml + customYaml + "\n---\n\n# \u{1F4CB} " + dateStr + " " + this.settings.childName + "\u7684\u6BCF\u65E5\u8BB0\u5F55\n\n## \u{1F4CA} \u4ECA\u65E5\u6C47\u603B\n\n| \u6307\u6807 | \u6570\u503C |\n|:---|---:|\n| \u{1F3C6} \u4ECA\u65E5\u603B\u5206 | " + totalSign + total + " \u5206 |" + yesterdayRow + "\n| \u2705 \u5B8C\u6210\u9879\u76EE | " + earnedCount + "/" + totalItems + " (" + completionRate + "%) |\n| \u{1F4CC} \u4E34\u65F6\u4E8B\u9879 | " + customItems.length + " \u9879 (" + (customTotal >= 0 ? "+" : "") + customTotal + " \u5206) |\n| \u{1F4C8} \u7D2F\u8BA1\u603B\u5206 | " + grandSign + grandTotal + " \u5206 |\n| \u{1F4C5} \u7D2F\u8BA1\u5929\u6570 | " + grandDays + " \u5929 |\n| \u{1F4CA} \u65E5\u5747\u5F97\u5206 | " + grandAvg + " \u5206 |\n\n---\n" + tableContent + "\n---\n\n## \u{1F4DD} \u4ECA\u65E5\u65E5\u8BB0\n\n" + (diaryContent || this.settings.diaryTemplate) + "\n";

      var dirPath = (0, import_obsidian.normalizePath)(this.settings.savePath);
      if (!this.app.vault.getAbstractFileByPath(dirPath)) { yield this.app.vault.createFolder(dirPath); }
      var fp = this.filePath(dateStr);
      var existing = this.app.vault.getAbstractFileByPath(fp);
      if (existing instanceof import_obsidian.TFile) { yield this.app.vault.modify(existing, content); }
      else { yield this.app.vault.create(fp, content); }
      new import_obsidian.Notice("\u2705 " + dateStr + " \u8BB0\u5F55\u5DF2\u4FDD\u5B58\uFF01\u603B\u5206\uFF1A" + totalSign + total + " | \u7D2F\u8BA1\uFF1A" + grandSign + grandTotal);
    });
  }

  getAllScores() {
    return __async(this, null, function* () {
      var dirPath = (0, import_obsidian.normalizePath)(this.settings.savePath);
      var files = this.app.vault.getFiles().filter(function(f) { return f.path.startsWith(dirPath + "/") && f.extension === "md"; });
      var results = [];
      for (var file of files) {
        var dateStr = file.basename;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          var score = yield this.readDayData(dateStr);
          if (score) results.push(score);
        }
      }
      return results.sort(function(a, b) { return a.date.localeCompare(b.date); });
    });
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   Daily Scoring Modal
   ═══════════════════════════════════════════════════════════════════════════ */
var DailyScoringModal = class extends import_obsidian.Modal {
  constructor(app, plugin, initialDate) {
    super(app);
    this.scores = {};
    this.customItems = [];
    this.diaryContent = "";
    this.plugin = plugin;
    this.dateStr = initialDate || formatDate(0);
    this.totalDisplay = null;
    this.customItemsContainer = null;
    this.diaryTextarea = null;
    this.activeTab = "score";
  }

  onOpen() {
    return __async(this, null, function* () {
      yield this.renderModal();
    });
  }

  renderModal() {
    return __async(this, null, function* () {
      var self = this;
      var contentEl = this.contentEl;
      contentEl.empty();
      contentEl.addClass("kid-score-modal");

      // Reset state
      this.scores = {};
      this.customItems = [];
      this.diaryContent = "";

      var yesterday = new Date(this.dateStr + "T00:00:00");
      yesterday.setDate(yesterday.getDate() - 1);
      var yesterdayStr = yesterday.toISOString().slice(0, 10);

      var existingToday = yield this.plugin.readDayData(this.dateStr);
      var yesterdayData = yield this.plugin.readDayData(yesterdayStr);

      for (var item of this.plugin.settings.items) {
        if (existingToday && existingToday.scores[item.id] !== undefined) {
          this.scores[item.id] = existingToday.scores[item.id];
        } else {
          this.scores[item.id] = 0;
        }
      }
      if (existingToday) {
        this.customItems = existingToday.customItems || [];
        this.diaryContent = existingToday.diaryContent || "";
      }

      // Header with date navigation
      var header = contentEl.createDiv({ cls: "kid-score-header" });
      header.createEl("h2", { text: this.plugin.settings.childName + " \u7684\u6BCF\u65E5\u8BB0\u5F55" });

      var dateNav = header.createDiv({ cls: "kid-score-date-nav" });
      var prevBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "\u25C0" });
      prevBtn.onclick = function() {
        var d = new Date(self.dateStr + "T00:00:00");
        d.setDate(d.getDate() - 1);
        self.dateStr = d.toISOString().slice(0, 10);
        self.renderModal();
      };

      var dateInput = dateNav.createEl("input", { cls: "date-nav-input" });
      dateInput.type = "date";
      dateInput.value = this.dateStr;
      dateInput.max = formatDate(0);
      dateInput.onchange = function() {
        if (dateInput.value) {
          self.dateStr = dateInput.value;
          self.renderModal();
        }
      };

      var nextBtn = dateNav.createEl("button", { cls: "date-nav-btn", text: "\u25B6" });
      var isToday = this.dateStr === formatDate(0);
      if (isToday) { nextBtn.disabled = true; nextBtn.style.opacity = "0.3"; }
      nextBtn.onclick = function() {
        if (isToday) return;
        var d = new Date(self.dateStr + "T00:00:00");
        d.setDate(d.getDate() + 1);
        self.dateStr = d.toISOString().slice(0, 10);
        self.renderModal();
      };

      var todayBtn = dateNav.createEl("button", { cls: "date-nav-today" + (isToday ? " is-today" : ""), text: isToday ? "\u4ECA\u5929" : "\u56DE\u5230\u4ECA\u5929" });
      if (!isToday) {
        todayBtn.onclick = function() {
          self.dateStr = formatDate(0);
          self.renderModal();
        };
      }

      // Editing past date indicator
      if (!isToday) {
        contentEl.createDiv({ cls: "kid-score-past-banner", text: "\u{1F4C5} \u6B63\u5728\u7F16\u8F91 " + this.dateStr + " \u7684\u8BB0\u5F55" });
      }

      // Cumulative banner
      var allScores = yield this.plugin.getAllScores();
      var cumulativeTotal = allScores.reduce(function(sum, s) { return sum + s.total; }, 0);
      var cumulativeDays = allScores.length;
      if (cumulativeDays > 0) {
        var cSign = cumulativeTotal >= 0 ? "+" : "";
        var cumDiv = contentEl.createDiv({ cls: "kid-score-cumulative-banner" });
        cumDiv.createSpan({ cls: "cumulative-label", text: "\u{1F3C5} \u5386\u53F2\u7D2F\u8BA1" });
        cumDiv.createSpan({ cls: "cumulative-value", text: cSign + cumulativeTotal + " \u5206" });
        cumDiv.createSpan({ cls: "cumulative-days", text: "\u5171 " + cumulativeDays + " \u5929" });
      }

      /* ── Tab bar ── */
      var mainTabs = contentEl.createDiv({ cls: "kid-score-main-tabs" });
      var scoreTab = mainTabs.createEl("button", { text: "\u2B50 \u6253\u5206", cls: "kid-score-main-tab is-active" });
      var diaryTab = mainTabs.createEl("button", { text: "\u{1F4DD} \u65E5\u8BB0", cls: "kid-score-main-tab" });


      var scorePanel = contentEl.createDiv({ cls: "kid-score-tab-panel" });
      var diaryPanel = contentEl.createDiv({ cls: "kid-score-tab-panel is-hidden" });

      scoreTab.onclick = function() {
        if (self.diaryTextarea) self.diaryContent = self.diaryTextarea.value;
        self.activeTab = "score";
        scoreTab.addClass("is-active"); diaryTab.removeClass("is-active");
        scorePanel.removeClass("is-hidden"); diaryPanel.addClass("is-hidden");
      };
      diaryTab.onclick = function() {
        self.activeTab = "diary";
        diaryTab.addClass("is-active"); scoreTab.removeClass("is-active");
        diaryPanel.removeClass("is-hidden"); scorePanel.addClass("is-hidden");
        if (self.diaryTextarea) self.diaryTextarea.focus();
      };

      /* ══════════════ Score Panel ══════════════ */
      if (this.plugin.settings.items.length === 0) {
        scorePanel.createEl("div", { cls: "kid-score-empty", text: "\u26A0\uFE0F \u8FD8\u6CA1\u6709\u8BBE\u7F6E\u6253\u5206\u9879\u76EE\uFF0C\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u6DFB\u52A0\uFF01" });
      } else {
        // ── Scoring Rules Section ──
        var rulesSection = scorePanel.createDiv({ cls: "kid-score-rules-section" });
        var rulesHeader = rulesSection.createDiv({ cls: "kid-score-rules-header" });
        var rulesToggle = rulesHeader.createEl("span", { cls: "kid-score-rules-toggle", text: "\u25B6" });
        rulesHeader.createEl("span", { cls: "kid-score-rules-title", text: "\u{1F4CB} \u6253\u5206\u89C4\u5219" });
        var rulesEditBtn = rulesHeader.createEl("button", { cls: "kid-score-rules-edit-btn", text: "\u270F\uFE0F" });
        var rulesBody = rulesSection.createDiv({ cls: "kid-score-rules-body" });
        var rulesView = rulesBody.createDiv({ cls: "kid-score-rules-view" });
        var rulesEdit = rulesBody.createDiv({ cls: "kid-score-rules-edit is-hidden" });
        var rulesTextarea = rulesEdit.createEl("textarea", { cls: "kid-score-rules-textarea" });
        rulesTextarea.value = self.plugin.settings.scoringRules || "";
        var rulesActRow = rulesEdit.createDiv({ cls: "kid-score-rules-actions" });
        var rulesSaveBtn = rulesActRow.createEl("button", { cls: "mod-cta kid-score-rules-save-btn", text: "\u4FDD\u5B58\u89C4\u5219" });
        var rulesCancelBtn = rulesActRow.createEl("button", { cls: "kid-score-rules-cancel-btn", text: "\u53D6\u6D88" });
        var renderRulesView = function() {
          rulesView.empty();
          var text = self.plugin.settings.scoringRules || "";
          if (text.trim()) {
            import_obsidian.MarkdownRenderer.render(self.app, text, rulesView, "", self);
          } else {
            rulesView.createEl("p", { cls: "kid-score-rules-empty", text: "\u6682\u65E0\u89C4\u5219\uFF0C\u70B9\u51FB \u270F\uFE0F \u6DFB\u52A0\u6253\u5206\u89C4\u5219" });
          }
        };
        renderRulesView();
        var rulesOpen = !!(self.plugin.settings.scoringRules && self.plugin.settings.scoringRules.trim());
        if (!rulesOpen) { rulesBody.addClass("is-hidden"); }
        else { rulesToggle.textContent = "\u25BC"; }
        rulesHeader.addEventListener("click", function(e) {
          if (e.target === rulesEditBtn || rulesEditBtn.contains(e.target)) return;
          rulesOpen = !rulesOpen;
          rulesToggle.textContent = rulesOpen ? "\u25BC" : "\u25B6";
          rulesBody.toggleClass("is-hidden", !rulesOpen);
        });
        var rulesIsEditing = false;
        rulesEditBtn.addEventListener("click", function(e) {
          e.stopPropagation();
          rulesIsEditing = !rulesIsEditing;
          if (rulesIsEditing) {
            rulesOpen = true;
            rulesToggle.textContent = "\u25BC";
            rulesBody.removeClass("is-hidden");
            rulesTextarea.value = self.plugin.settings.scoringRules || "";
            rulesView.addClass("is-hidden");
            rulesEdit.removeClass("is-hidden");
            rulesTextarea.focus();
          } else {
            rulesView.removeClass("is-hidden");
            rulesEdit.addClass("is-hidden");
          }
        });
        rulesSaveBtn.addEventListener("click", function() {
          return __async(self, null, function* () {
            self.plugin.settings.scoringRules = rulesTextarea.value;
            yield self.plugin.saveSettings();
            rulesIsEditing = false;
            rulesView.removeClass("is-hidden");
            rulesEdit.addClass("is-hidden");
            renderRulesView();
            new import_obsidian.Notice("\u2705 \u6253\u5206\u89C4\u5219\u5DF2\u4FDD\u5B58\uFF01");
          });
        });
        rulesCancelBtn.addEventListener("click", function() {
          rulesIsEditing = false;
          rulesView.removeClass("is-hidden");
          rulesEdit.addClass("is-hidden");
        });

        if (yesterdayData) {
          var ySign = yesterdayData.total >= 0 ? "+" : "";
          scorePanel.createDiv({ cls: "kid-score-yesterday-banner", text: "\u{1F4CA} \u6628\u5929\uFF08" + yesterdayStr + "\uFF09\u603B\u5206\uFF1A" + ySign + yesterdayData.total + " \u5206" });
        }
        scorePanel.createDiv({ cls: "kid-score-hint", text: "\u{1F4A1} \u70B9\u51FB\u6253\u5206 \u00B7 \u957F\u6309\u81EA\u5B9A\u4E49\u5206\u503C" });
        var itemsContainer = scorePanel.createDiv({ cls: "kid-score-items" });
        this.totalDisplay = scorePanel.createDiv({ cls: "kid-score-total-display" });

        // Render by category
        var categories = this.plugin.settings.categories || [];
        var catRendered = false;
        for (var cat of categories) {
          var catItems = this.plugin.settings.items.filter(function(it) { return it.category === cat; });
          if (catItems.length > 0) {
            if (catRendered) { itemsContainer.createEl("hr", { cls: "kid-score-divider" }); }
            var catHeader = itemsContainer.createDiv({ cls: "kid-score-cat-header" });
            catHeader.createEl("h3", { text: cat, cls: "kid-score-section-title" });
            (function(c) {
              var addItemBtn = catHeader.createEl("button", { text: "+", cls: "kid-score-add-item-btn" });
              addItemBtn.onclick = function() { self.showAddItemPopup(c); };
            })(cat);
            var grid = itemsContainer.createDiv({ cls: "kid-score-grid" });
            for (var itm of catItems) { this.renderCard(itm, grid, yesterdayData); }
            catRendered = true;
          }
        }
        // Uncategorized
        var uncatItems = this.plugin.settings.items.filter(function(it) { return !it.category || categories.indexOf(it.category) === -1; });
        if (uncatItems.length > 0) {
          if (catRendered) { itemsContainer.createEl("hr", { cls: "kid-score-divider" }); }
          itemsContainer.createEl("h3", { text: "\u5176\u4ED6", cls: "kid-score-section-title" });
          var grid2 = itemsContainer.createDiv({ cls: "kid-score-grid" });
          for (var itm of uncatItems) { this.renderCard(itm, grid2, yesterdayData); }
          catRendered = true;
        }

        // Custom items
        if (catRendered) { itemsContainer.createEl("hr", { cls: "kid-score-divider" }); }
        itemsContainer.createEl("h3", { text: "\u{1F4CC} \u4E34\u65F6\u4E8B\u9879", cls: "kid-score-section-title" });
        this.customItemsContainer = itemsContainer.createDiv({ cls: "kid-score-custom-items" });
        this.renderCustomItems();
        var addCustomBtn = itemsContainer.createEl("button", { text: "\uFF0B \u6DFB\u52A0\u4E34\u65F6\u52A0\u51CF\u5206", cls: "kid-score-add-custom-btn" });
        addCustomBtn.onclick = function() { self.showAddCustomItemForm(); };
        this.updateTotalDisplay();
      }

      /* ══════════════ Diary Panel ══════════════ */
      this.buildDiaryPanel(diaryPanel);

      /* ══════════════ Action Buttons ══════════════ */
      var actions = contentEl.createDiv({ cls: "kid-score-actions" });
      var saveBtn = actions.createEl("button", { text: "\u{1F4BE} \u4FDD\u5B58\u8BB0\u5F55", cls: "mod-cta kid-score-save-btn" });
      saveBtn.onclick = function() {
        return __async(self, null, function* () {
          if (self.diaryTextarea) self.diaryContent = self.diaryTextarea.value;
          yield self.plugin.saveDayData(self.dateStr, self.scores, self.customItems, self.diaryContent);
          self.close();
        });
      };
      var statsBtn = actions.createEl("button", { text: "\u{1F4CA} \u67E5\u770B\u7EDF\u8BA1", cls: "kid-score-stats-btn" });
      statsBtn.onclick = function() { self.close(); new StatsModal(self.app, self.plugin).open(); };
    });
  }

  buildDiaryPanel(panel) {
    var self = this;
    var isPreview = false;

    var toolbar = panel.createDiv({ cls: "diary-toolbar" });
    var templateBtn = toolbar.createEl("button", { cls: "diary-tool-btn", text: "\u{1F4CB} \u63D2\u5165\u6A21\u677F" });
    templateBtn.onclick = function() {
      if (!self.diaryTextarea) return;
      var template = self.plugin.settings.diaryTemplate || DEFAULT_SETTINGS.diaryTemplate;
      var current = self.diaryTextarea.value;
      if (current.trim()) {
        var pos = self.diaryTextarea.selectionStart || current.length;
        self.diaryTextarea.value = current.slice(0, pos) + "\n\n" + template + current.slice(pos);
      } else { self.diaryTextarea.value = template; }
      self.diaryContent = self.diaryTextarea.value;
      self.diaryTextarea.focus();
    };
    [{ t: "\u{1F5BC}\uFE0F \u56FE\u7247", e: "png" }, { t: "\u{1F3AC} \u89C6\u9891", e: "mp4" }, { t: "\u{1F3B5} \u97F3\u9891", e: "mp3" }].forEach(function(a) {
      var btn = toolbar.createEl("button", { cls: "diary-tool-btn", text: a.t });
      btn.onclick = function() { self.insertAttachment(a.t.split(" ")[1], a.e); };
    });
    var previewBtn = toolbar.createEl("button", { cls: "diary-tool-btn diary-preview-btn", text: "MD\u6A21\u5F0F" });
    previewBtn.onclick = function() {
      isPreview = !isPreview;
      if (isPreview) {
        self.diaryContent = self.diaryTextarea.value;
        self.diaryTextarea.rows = 5;
        previewWrap.style.display = "";
        previewWrap.empty();
        import_obsidian.MarkdownRenderer.render(self.app, self.diaryContent || "_\u8FD8\u6CA1\u6709\u5185\u5BB9_", previewWrap, "", self);
        self.diaryTextarea.oninput = function() {
          self.diaryContent = self.diaryTextarea.value; updateCC();
          previewWrap.empty();
          import_obsidian.MarkdownRenderer.render(self.app, self.diaryTextarea.value || "_\u8FD8\u6CA1\u6709\u5185\u5BB9_", previewWrap, "", self);
        };
        previewBtn.textContent = "\u9884\u89C8\u6A21\u5F0F";
      } else {
        self.diaryTextarea.rows = 12;
        previewWrap.style.display = "none";
        self.diaryTextarea.oninput = function() { self.diaryContent = self.diaryTextarea.value; updateCC(); };
        previewBtn.textContent = "MD\u6A21\u5F0F";
        self.diaryTextarea.focus();
      }
    };

    var quickRow = panel.createDiv({ cls: "diary-quick-row" });
    var weatherEmojis = [{ e: "\u2600\uFE0F", l: "\u6674" }, { e: "\u26C5", l: "\u591A\u4E91" }, { e: "\u{1F327}\uFE0F", l: "\u96E8" }, { e: "\u{1F328}\uFE0F", l: "\u96EA" }, { e: "\u{1F32C}\uFE0F", l: "\u98CE" }, { e: "\u{1F324}\uFE0F", l: "\u6674\u8F6C\u591A\u4E91" }];
    var moodEmojis = [{ e: "\u{1F60A}", l: "\u5F00\u5FC3" }, { e: "\u{1F60E}", l: "\u5F88\u68D2" }, { e: "\u{1F914}", l: "\u601D\u8003" }, { e: "\u{1F622}", l: "\u96BE\u8FC7" }, { e: "\u{1F620}", l: "\u751F\u6C14" }, { e: "\u{1F634}", l: "\u56F0" }];

    var wWrap = quickRow.createDiv({ cls: "diary-quick-group" });
    wWrap.createSpan({ cls: "diary-quick-label", text: "\u5929\u6C14" });
    weatherEmojis.forEach(function(w) { var b = wWrap.createEl("button", { cls: "diary-quick-btn", text: w.e }); b.title = w.l; b.onclick = function() { self.insertTextAtCursor(w.e + " " + w.l + " "); }; });
    var mWrap = quickRow.createDiv({ cls: "diary-quick-group" });
    mWrap.createSpan({ cls: "diary-quick-label", text: "\u5FC3\u60C5" });
    moodEmojis.forEach(function(m) { var b = mWrap.createEl("button", { cls: "diary-quick-btn", text: m.e }); b.title = m.l; b.onclick = function() { self.insertTextAtCursor(m.e + " " + m.l + " "); }; });

    var textareaWrap = panel.createDiv({ cls: "diary-textarea-wrap" });
    this.diaryTextarea = textareaWrap.createEl("textarea", { cls: "diary-textarea", placeholder: "\u5728\u8FD9\u91CC\u8BB0\u5F55\u4ECA\u5929\u7684\u6545\u4E8B...\n\n\u70B9\u51FB\u201C\u63D2\u5165\u6A21\u677F\u201D\u5F00\u59CB\u5199\u65E5\u8BB0\uFF0C\u6216\u76F4\u63A5\u81EA\u7531\u4E66\u5199\u3002" });
    this.diaryTextarea.value = this.diaryContent || "";
    this.diaryTextarea.rows = 12;
    this.diaryTextarea.oninput = function() { self.diaryContent = self.diaryTextarea.value; updateCC(); };

    var previewWrap = panel.createDiv({ cls: "diary-preview-wrap" });
    previewWrap.style.display = "none";

    var charCount = panel.createDiv({ cls: "diary-char-count" });
    var updateCC = function() { charCount.textContent = (self.diaryTextarea.value || "").length + " \u5B57"; };
    updateCC();
  }

  insertTextAtCursor(text) {
    if (!this.diaryTextarea) return;
    var ta = this.diaryTextarea; var start = ta.selectionStart; var end = ta.selectionEnd;
    ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    this.diaryContent = ta.value; ta.focus();
  }

  insertAttachment(label, ext) {
    var self = this;
    var overlay = document.createElement("div"); overlay.className = "kid-score-value-overlay";
    var popup = document.createElement("div"); popup.className = "kid-score-value-popup";
    popup.innerHTML = '<div class="value-popup-header">\u{1F4CE} \u63D2\u5165' + label + '</div><div class="value-popup-hint">\u8F93\u5165\u6587\u4EF6\u540D\uFF08\u4E0D\u542B\u6269\u5C55\u540D\uFF09</div>';
    var fileInput = document.createElement("input"); fileInput.type = "text"; fileInput.className = "custom-form-name-input"; fileInput.placeholder = "\u4F8B\u5982: \u4ECA\u5929\u7684\u7167\u7247";
    popup.appendChild(fileInput);
    var quickName = document.createElement("div"); quickName.className = "value-popup-hint"; quickName.style.cssText = "cursor:pointer;text-decoration:underline"; quickName.textContent = "\u{1F4A1} \u9ED8\u8BA4: " + self.dateStr + "-" + label;
    quickName.onclick = function() { fileInput.value = self.dateStr + "-" + label; };
    popup.appendChild(quickName);
    var acts = document.createElement("div"); acts.className = "value-popup-actions";
    var cb = document.createElement("button"); cb.className = "value-popup-cancel"; cb.textContent = "\u53D6\u6D88"; cb.onclick = function() { overlay.remove(); };
    var ok = document.createElement("button"); ok.className = "value-popup-confirm mod-cta"; ok.textContent = "\u63D2\u5165";
    ok.onclick = function() { var f = fileInput.value.trim(); if (!f) { fileInput.classList.add("is-error"); return; } if (!f.includes(".")) f += "." + ext; self.insertTextAtCursor("\n![[" + f + "]]\n"); overlay.remove(); };
    acts.appendChild(cb); acts.appendChild(ok); popup.appendChild(acts);
    overlay.appendChild(popup); overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    getOverlayMount(self.containerEl).appendChild(overlay); fileInput.focus();
  }

  renderCard(item, grid, yesterdayData) {
    var self = this;
    var scoreVal = this.scores[item.id] || 0;
    var isEarned = scoreVal > 0;
    var isNeg = scoreVal < 0 || (scoreVal === 0 && item.points < 0);
    var isDeductItem = item.category === "\u51CF\u5206" || item.points < 0;
    var isDeductedActive = isDeductItem && scoreVal !== 0;
    var card = grid.createDiv({ cls: "kid-score-card" + (isEarned ? " is-earned" : "") + (isNeg ? " is-negative" : "") + (isDeductedActive ? " is-deducted-active" : "") });
    card.dataset.itemId = item.id;
    card.createDiv({ cls: "card-emoji", text: item.emoji });
    card.createDiv({ cls: "card-name", text: item.name });
    if (item.note) { card.createDiv({ cls: "card-note", text: item.note }); }
    var pointsText = scoreVal !== 0 ? ((scoreVal >= 0 ? "+" : "") + scoreVal + " \u5206" + (scoreVal !== item.points ? " \u{1F4DD}" : "")) : ((item.points >= 0 ? "+" : "") + item.points + " \u5206");
    card.createDiv({ cls: "card-points", text: pointsText });
    if (yesterdayData) {
      var yScore = yesterdayData.scores[item.id] || 0;
      var yClass = yScore > 0 ? "was-earned" : (yScore < 0 ? "was-negative" : "was-missed");
      var ySign = yScore > 0 ? "+" : "";
      card.createDiv({ cls: "card-yesterday " + yClass, text: "\u6628 " + ySign + yScore + " \u5206" });
    } else {
      card.createDiv({ cls: "card-yesterday was-missed", text: "\u6628 -" });
    }
    var pressTimer = null; var isLongPress = false; var hasMoved = false; var startX = 0; var startY = 0;
    card.addEventListener("pointerdown", function(e) {
      isLongPress = false; hasMoved = false; startX = e.clientX; startY = e.clientY;
      pressTimer = setTimeout(function() {
        if (!hasMoved) { isLongPress = true; self.showCustomValuePopup(item, function(v) { self.scores[item.id] = v; self.refreshCard(card, item); self.updateTotalDisplay(); }); }
      }, 500);
    });
    card.addEventListener("pointermove", function(e) {
      if (!hasMoved && (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8)) {
        hasMoved = true; clearTimeout(pressTimer);
      }
    });
    card.addEventListener("pointerup", function() { clearTimeout(pressTimer); if (!isLongPress && !hasMoved) { self.scores[item.id] = self.scores[item.id] === 0 ? item.points : 0; self.refreshCard(card, item); self.updateTotalDisplay(); } });
    card.addEventListener("pointercancel", function() { clearTimeout(pressTimer); hasMoved = true; });
    card.addEventListener("pointerleave", function() { clearTimeout(pressTimer); });
    card.addEventListener("contextmenu", function(e) { e.preventDefault(); });
  }

  refreshCard(card, item) {
    var scoreVal = this.scores[item.id] || 0;
    var isEarned = scoreVal > 0;
    var isNeg = scoreVal < 0 || (scoreVal === 0 && item.points < 0);
    var isDeductItem = item.category === "\u51CF\u5206" || item.points < 0;
    var isDeductedActive = isDeductItem && scoreVal !== 0;
    card.classList.toggle("is-earned", isEarned); card.classList.toggle("is-negative", isNeg); card.classList.toggle("is-deducted-active", isDeductedActive);
    var pointsEl = card.querySelector(".card-points");
    if (pointsEl) { pointsEl.textContent = scoreVal !== 0 ? ((scoreVal >= 0 ? "+" : "") + scoreVal + " \u5206" + (scoreVal !== item.points ? " \u{1F4DD}" : "")) : ((item.points >= 0 ? "+" : "") + item.points + " \u5206"); }
  }

  showCustomValuePopup(item, callback) {
    var self = this;
    var overlay = document.createElement("div"); overlay.className = "kid-score-value-overlay";
    var popup = document.createElement("div"); popup.className = "kid-score-value-popup";

    var showScoreMode = function() {
      popup.innerHTML = '<div class="value-popup-header">' + item.emoji + " " + item.name + '</div>' + (item.note ? '<div class="value-popup-note">' + item.note + '</div>' : '') + '<div class="value-popup-hint">\u9ED8\u8BA4\u5206\u503C\uFF1A' + (item.points >= 0 ? "+" : "") + item.points + "</div>";
      var controls = document.createElement("div"); controls.className = "value-popup-controls";
      var minus = document.createElement("button"); minus.className = "value-popup-adjust"; minus.textContent = "\u2212";
      var input = document.createElement("input"); input.type = "number"; input.className = "value-popup-input"; input.value = String(self.scores[item.id] || item.points);
      var plus = document.createElement("button"); plus.className = "value-popup-adjust"; plus.textContent = "+";
      minus.onclick = function() { input.value = String(parseInt(input.value || "0") - 1); };
      plus.onclick = function() { input.value = String(parseInt(input.value || "0") + 1); };
      controls.appendChild(minus); controls.appendChild(input); controls.appendChild(plus); popup.appendChild(controls);
      var acts = document.createElement("div"); acts.className = "value-popup-actions";
      var cb = document.createElement("button"); cb.className = "value-popup-cancel"; cb.textContent = "\u53D6\u6D88"; cb.onclick = function() { overlay.remove(); };
      var ok = document.createElement("button"); ok.className = "value-popup-confirm mod-cta"; ok.textContent = "\u786E\u5B9A"; ok.onclick = function() { callback(parseInt(input.value) || 0); overlay.remove(); };
      acts.appendChild(cb); acts.appendChild(ok); popup.appendChild(acts);
      var delRow = document.createElement("div"); delRow.className = "value-popup-del-row";
      var editBtn = document.createElement("button"); editBtn.className = "value-popup-edit-btn"; editBtn.textContent = "\u270F\uFE0F \u7F16\u8F91\u6B64\u9879\u76EE";
      editBtn.onclick = function() { showEditMode(); };
      var delBtn = document.createElement("button"); delBtn.className = "value-popup-del-btn"; delBtn.textContent = "\uD83D\uDDD1 \u5220\u9664\u6B64\u6253\u5206\u9879";
      delBtn.onclick = function() {
        return __async(self, null, function* () {
          overlay.remove();
          var idx = self.plugin.settings.items.findIndex(function(it) { return it.id === item.id; });
          if (idx !== -1) {
            self.plugin.settings.items.splice(idx, 1);
            yield self.plugin.saveSettings();
            yield self.renderModal();
          }
        });
      };
      delRow.appendChild(editBtn); delRow.appendChild(delBtn); popup.appendChild(delRow);
      input.focus(); input.select();
    };

    var showEditMode = function() {
      popup.innerHTML = '<div class="value-popup-header">\u270F\uFE0F \u7F16\u8F91\u9879\u76EE</div>';
      popup.classList.add("kid-score-custom-form");
      var emojiRow = document.createElement("div"); emojiRow.className = "custom-form-row";
      var emojiLabel = document.createElement("span"); emojiLabel.className = "custom-form-label"; emojiLabel.textContent = "\u56FE\u6807";
      var emojiInput = document.createElement("input"); emojiInput.type = "text"; emojiInput.className = "custom-form-emoji-input"; emojiInput.value = item.emoji; emojiInput.maxLength = 2;
      var emojiPickBtn = document.createElement("button"); emojiPickBtn.className = "diary-tool-btn"; emojiPickBtn.textContent = "\uD83D\uDD0D"; emojiPickBtn.style.marginLeft = "4px";
      emojiPickBtn.onclick = function() { showEmojiPicker(function(em) { emojiInput.value = em; }, self.containerEl); };
      emojiRow.appendChild(emojiLabel); emojiRow.appendChild(emojiInput); emojiRow.appendChild(emojiPickBtn); popup.appendChild(emojiRow);
      var nameRow = document.createElement("div"); nameRow.className = "custom-form-row";
      var nameLabel = document.createElement("span"); nameLabel.className = "custom-form-label"; nameLabel.textContent = "\u540D\u79F0";
      var nameInput = document.createElement("input"); nameInput.type = "text"; nameInput.className = "custom-form-name-input"; nameInput.value = item.name; nameInput.autocomplete = "off";
      nameRow.appendChild(nameLabel); nameRow.appendChild(nameInput); popup.appendChild(nameRow);
      var pointsRow = document.createElement("div"); pointsRow.className = "custom-form-row";
      var pointsLabel = document.createElement("span"); pointsLabel.className = "custom-form-label"; pointsLabel.textContent = "\u9ED8\u8BA4\u5206\u503C";
      var pc = document.createElement("div"); pc.className = "value-popup-controls";
      var pm = document.createElement("button"); pm.className = "value-popup-adjust"; pm.textContent = "\u2212";
      var pi = document.createElement("input"); pi.type = "number"; pi.className = "value-popup-input"; pi.value = String(item.points);
      var pp = document.createElement("button"); pp.className = "value-popup-adjust"; pp.textContent = "+";
      pm.onclick = function() { pi.value = String(parseInt(pi.value || "0") - 1); };
      pp.onclick = function() { pi.value = String(parseInt(pi.value || "0") + 1); };
      pc.appendChild(pm); pc.appendChild(pi); pc.appendChild(pp); pointsRow.appendChild(pointsLabel); pointsRow.appendChild(pc); popup.appendChild(pointsRow);
      var noteRow = document.createElement("div"); noteRow.className = "custom-form-row";
      var noteLabel = document.createElement("span"); noteLabel.className = "custom-form-label"; noteLabel.textContent = "\u5907\u6CE8";
      var noteInput = document.createElement("input"); noteInput.type = "text"; noteInput.className = "custom-form-name-input"; noteInput.value = item.note || ""; noteInput.placeholder = "\u53EF\u9009\uFF0C\u957F\u6309\u65F6\u663E\u793A\u5728\u5361\u7247\u4E0A..."; noteInput.autocomplete = "off";
      noteRow.appendChild(noteLabel); noteRow.appendChild(noteInput); popup.appendChild(noteRow);
      var catRow = document.createElement("div"); catRow.className = "custom-form-row";
      var catLabel = document.createElement("span"); catLabel.className = "custom-form-label"; catLabel.textContent = "\u5206\u7C7B";
      var catSel = document.createElement("select"); catSel.className = "custom-form-select";
      var cats = self.plugin.settings.categories || [];
      cats.forEach(function(c) { var opt = document.createElement("option"); opt.value = c; opt.textContent = c; if (c === item.category) opt.selected = true; catSel.appendChild(opt); });
      catRow.appendChild(catLabel); catRow.appendChild(catSel); popup.appendChild(catRow);
      var acts = document.createElement("div"); acts.className = "value-popup-actions";
      var backBtn = document.createElement("button"); backBtn.className = "value-popup-cancel"; backBtn.textContent = "\u8FD4\u56DE";
      backBtn.onclick = function() { popup.classList.remove("kid-score-custom-form"); showScoreMode(); };
      var saveBtn = document.createElement("button"); saveBtn.className = "value-popup-confirm mod-cta"; saveBtn.textContent = "\u4FDD\u5B58";
      saveBtn.onclick = function() {
        return __async(self, null, function* () {
          var n = nameInput.value.trim();
          if (!n) { nameInput.classList.add("is-error"); return; }
          item.name = n;
          item.emoji = emojiInput.value.trim() || "\u2B50";
          item.points = parseInt(pi.value) || 0;
          item.note = noteInput.value.trim();
          item.category = catSel.value;
          yield self.plugin.saveSettings();
          overlay.remove();
          yield self.renderModal();
        });
      };
      acts.appendChild(backBtn); acts.appendChild(saveBtn); popup.appendChild(acts);
      setTimeout(function() { nameInput.focus(); nameInput.select(); }, 50);
    };

    showScoreMode();
    overlay.appendChild(popup); overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    getOverlayMount(self.containerEl).appendChild(overlay);
  }

  showAddItemPopup(category) {
    var self = this;
    var overlay = document.createElement("div"); overlay.className = "kid-score-value-overlay";
    var popup = document.createElement("div"); popup.className = "kid-score-value-popup kid-score-custom-form";
    popup.innerHTML = '<div class="value-popup-header">\u2795 \u65B0\u589E\u6253\u5206\u9879 &middot; ' + category + '</div>';
    var emojiRow = document.createElement("div"); emojiRow.className = "custom-form-row";
    var emojiLabel = document.createElement("span"); emojiLabel.className = "custom-form-label"; emojiLabel.textContent = "\u56FE\u6807";
    var emojiInput = document.createElement("input"); emojiInput.type = "text"; emojiInput.className = "custom-form-emoji-input"; emojiInput.value = "\u2B50"; emojiInput.maxLength = 2;
    var emojiPickBtn = document.createElement("button"); emojiPickBtn.className = "diary-tool-btn"; emojiPickBtn.textContent = "\uD83D\uDD0D"; emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = function() { showEmojiPicker(function(em) { emojiInput.value = em; }, self.containerEl); };
    emojiRow.appendChild(emojiLabel); emojiRow.appendChild(emojiInput); emojiRow.appendChild(emojiPickBtn); popup.appendChild(emojiRow);
    var nameRow = document.createElement("div"); nameRow.className = "custom-form-row";
    var nameLabel = document.createElement("span"); nameLabel.className = "custom-form-label"; nameLabel.textContent = "\u540D\u79F0";
    var nameInput = document.createElement("input"); nameInput.type = "text"; nameInput.className = "custom-form-name-input"; nameInput.placeholder = "\u6253\u5206\u9879\u540D\u79F0..."; nameInput.autocomplete = "off";
    nameRow.appendChild(nameLabel); nameRow.appendChild(nameInput); popup.appendChild(nameRow);
    var pointsRow = document.createElement("div"); pointsRow.className = "custom-form-row";
    var pointsLabel = document.createElement("span"); pointsLabel.className = "custom-form-label"; pointsLabel.textContent = "\u5206\u503C";
    var pc = document.createElement("div"); pc.className = "value-popup-controls";
    var pm = document.createElement("button"); pm.className = "value-popup-adjust"; pm.textContent = "\u2212";
    var pi = document.createElement("input"); pi.type = "number"; pi.className = "value-popup-input"; pi.value = "1";
    var pp = document.createElement("button"); pp.className = "value-popup-adjust"; pp.textContent = "+";
    pm.onclick = function() { pi.value = String(parseInt(pi.value || "0") - 1); };
    pp.onclick = function() { pi.value = String(parseInt(pi.value || "0") + 1); };
    pc.appendChild(pm); pc.appendChild(pi); pc.appendChild(pp); pointsRow.appendChild(pointsLabel); pointsRow.appendChild(pc); popup.appendChild(pointsRow);
    var acts = document.createElement("div"); acts.className = "value-popup-actions";
    var cb = document.createElement("button"); cb.className = "value-popup-cancel"; cb.textContent = "\u53D6\u6D88"; cb.onclick = function() { overlay.remove(); };
    var ok = document.createElement("button"); ok.className = "value-popup-confirm mod-cta"; ok.textContent = "\u6DFB\u52A0";
    ok.onclick = function() {
      return __async(self, null, function* () {
        var n = nameInput.value.trim();
        if (!n) { nameInput.classList.add("is-error"); return; }
        self.plugin.settings.items.push({ id: "item_" + Date.now(), name: n, points: parseInt(pi.value) || 1, emoji: emojiInput.value.trim() || "\u2B50", category: category, note: "" });
        var cats = self.plugin.settings.categories || [];
        self.plugin.settings.items.sort(function(a, b) { var ai = cats.indexOf(a.category); if (ai === -1) ai = 9999; var bi = cats.indexOf(b.category); if (bi === -1) bi = 9999; return ai - bi; });
        yield self.plugin.saveSettings();
        overlay.remove();
        yield self.renderModal();
      });
    };
    acts.appendChild(cb); acts.appendChild(ok); popup.appendChild(acts);
    popup.addEventListener("pointerdown", function(e) { e.stopPropagation(); });
    overlay.appendChild(popup); overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    getOverlayMount(self.containerEl).appendChild(overlay);
    setTimeout(function() { nameInput.focus(); }, 100);
  }

  renderCustomItems() {
    var self = this; var container = this.customItemsContainer; container.empty();
    if (this.customItems.length === 0) { container.createDiv({ cls: "kid-score-custom-empty", text: "\u6682\u65E0\u4E34\u65F6\u4E8B\u9879" }); return; }
    for (var i = 0; i < this.customItems.length; i++) {
      (function(idx) {
        var ci = self.customItems[idx]; var row = container.createDiv({ cls: "kid-score-custom-row" });
        row.createSpan({ cls: "custom-emoji", text: ci.emoji });
        row.createSpan({ cls: "custom-name", text: ci.name });
        row.createSpan({ cls: "custom-points " + (ci.points >= 0 ? "pos" : "neg"), text: (ci.points >= 0 ? "+" : "") + ci.points + " \u5206" });
        var del = row.createEl("button", { cls: "custom-delete-btn", text: "\u{1F5D1}" });
        del.onclick = function() { self.customItems.splice(idx, 1); self.renderCustomItems(); self.updateTotalDisplay(); };
      })(i);
    }
  }

  showAddCustomItemForm() {
    var self = this;
    var overlay = document.createElement("div"); overlay.className = "kid-score-value-overlay";
    var popup = document.createElement("div"); popup.className = "kid-score-value-popup kid-score-custom-form";
    popup.innerHTML = '<div class="value-popup-header">\u{1F4CC} \u6DFB\u52A0\u4E34\u65F6\u4E8B\u9879</div>';
    var emojiRow = document.createElement("div"); emojiRow.className = "custom-form-row";
    var emojiLabel = document.createElement("span"); emojiLabel.className = "custom-form-label"; emojiLabel.textContent = "\u56FE\u6807";
    var emojiInput = document.createElement("input"); emojiInput.type = "text"; emojiInput.className = "custom-form-emoji-input"; emojiInput.value = "\u2B50"; emojiInput.maxLength = 2;
    var emojiPickBtn = document.createElement("button"); emojiPickBtn.className = "diary-tool-btn"; emojiPickBtn.textContent = "\u{1F50D}"; emojiPickBtn.style.marginLeft = "4px";
    emojiPickBtn.onclick = function() { showEmojiPicker(function(em) { emojiInput.value = em; }, self.containerEl); };
    emojiRow.appendChild(emojiLabel); emojiRow.appendChild(emojiInput); emojiRow.appendChild(emojiPickBtn);
    popup.appendChild(emojiRow);
    var nameRow = document.createElement("div"); nameRow.className = "custom-form-row";
    var nameLabel = document.createElement("span"); nameLabel.className = "custom-form-label"; nameLabel.textContent = "\u4E8B\u9879";
    var nameInput = document.createElement("input"); nameInput.type = "text"; nameInput.className = "custom-form-name-input"; nameInput.placeholder = "\u4E8B\u9879\u540D\u79F0..."; nameInput.autocomplete = "off";
    nameRow.appendChild(nameLabel); nameRow.appendChild(nameInput); popup.appendChild(nameRow);
    var pointsRow = document.createElement("div"); pointsRow.className = "custom-form-row";
    var pointsLabel = document.createElement("span"); pointsLabel.className = "custom-form-label"; pointsLabel.textContent = "\u5206\u503C";
    var pc = document.createElement("div"); pc.className = "value-popup-controls";
    var pm = document.createElement("button"); pm.className = "value-popup-adjust"; pm.textContent = "\u2212";
    var pi = document.createElement("input"); pi.type = "number"; pi.className = "value-popup-input"; pi.value = "1";
    var pp = document.createElement("button"); pp.className = "value-popup-adjust"; pp.textContent = "+";
    pm.onclick = function() { pi.value = String(parseInt(pi.value || "0") - 1); };
    pp.onclick = function() { pi.value = String(parseInt(pi.value || "0") + 1); };
    pc.appendChild(pm); pc.appendChild(pi); pc.appendChild(pp);
    pointsRow.appendChild(pointsLabel); pointsRow.appendChild(pc); popup.appendChild(pointsRow);
    var acts = document.createElement("div"); acts.className = "value-popup-actions";
    var cb = document.createElement("button"); cb.className = "value-popup-cancel"; cb.textContent = "\u53D6\u6D88"; cb.onclick = function() { overlay.remove(); };
    var ok = document.createElement("button"); ok.className = "value-popup-confirm mod-cta"; ok.textContent = "\u6DFB\u52A0";
    ok.onclick = function() { var n = nameInput.value.trim(); if (!n) { nameInput.classList.add("is-error"); return; } self.customItems.push({ id: "custom_" + Date.now(), emoji: emojiInput.value.trim() || "\u2B50", name: n, points: parseInt(pi.value) || 0 }); self.renderCustomItems(); self.updateTotalDisplay(); overlay.remove(); };
    acts.appendChild(cb); acts.appendChild(ok); popup.appendChild(acts);
    popup.addEventListener("pointerdown", function(e) { e.stopPropagation(); });
    overlay.appendChild(popup); overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
    getOverlayMount(self.containerEl).appendChild(overlay);
    setTimeout(function() { nameInput.focus(); }, 100);
  }

  updateTotalDisplay() {
    if (!this.totalDisplay) return;
    var total = 0;
    for (var item of this.plugin.settings.items) { total += (this.scores[item.id] || 0); }
    for (var ci of this.customItems) { total += ci.points; }
    this.totalDisplay.textContent = "\u{1F3C6} \u5F53\u524D\u603B\u5206\uFF1A" + (total >= 0 ? "+" : "") + total + " \u5206";
  }

  onClose() { this.contentEl.empty(); }
};

/* ═══════════════════════════════════════════════════════════════════════════
   Stats Modal
   ═══════════════════════════════════════════════════════════════════════════ */
var StatsModal = class extends import_obsidian.Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; }

  onOpen() {
    return __async(this, null, function* () {
      var contentEl = this.contentEl; contentEl.empty(); contentEl.addClass("kid-score-stats-modal");
      contentEl.createEl("h2", { text: "\u{1F4CA} " + this.plugin.settings.childName + " \u7684\u6253\u5206\u7EDF\u8BA1" });
      var allScores = yield this.plugin.getAllScores();
      if (allScores.length === 0) { contentEl.createEl("p", { text: "\u{1F4ED} \u6682\u65E0\u6570\u636E", cls: "kid-score-empty" }); return; }
      var grandTotal = allScores.reduce(function(s, r) { return s + r.total; }, 0);
      var grandDays = allScores.length;
      var grandAvg = Math.round(grandTotal / grandDays);
      var gtSign = grandTotal >= 0 ? "+" : ""; var gaSign = grandAvg >= 0 ? "+" : "";
      var grandBanner = contentEl.createDiv({ cls: "kid-score-grand-banner" });
      var gl = grandBanner.createDiv({ cls: "grand-left" });
      gl.createDiv({ cls: "grand-total-value", text: gtSign + grandTotal });
      gl.createDiv({ cls: "grand-total-label", text: "\u5386\u53F2\u7D2F\u8BA1\u603B\u5206" });
      var gr = grandBanner.createDiv({ cls: "grand-right" });
      gr.createDiv({ text: "\u{1F4C5} \u8BB0\u5F55 " + grandDays + " \u5929", cls: "grand-stat" });
      gr.createDiv({ text: "\u{1F4C8} \u65E5\u5747 " + gaSign + grandAvg + " \u5206", cls: "grand-stat" });
      gr.createDiv({ text: "\u{1F5D3} \u8D77\u59CB " + allScores[0].date, cls: "grand-stat" });

      var tabs = contentEl.createDiv({ cls: "kid-score-tabs" });
      var statsBody = contentEl.createDiv({ cls: "kid-score-stats-body" });
      var periods = [{ label: "\u672C\u5468", key: "week" }, { label: "\u672C\u6708", key: "month" }, { label: "\u5168\u90E8", key: "all" }];
      var activePeriod = "week"; var self = this;

      var filterScores = function(period, scores) {
        var today = new Date();
        if (period === "week") { var ws = new Date(today); ws.setDate(today.getDate() - today.getDay() + 1); return scores.filter(function(s) { return s.date >= ws.toISOString().slice(0, 10); }); }
        else if (period === "month") { var ms = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-01"; return scores.filter(function(s) { return s.date >= ms; }); }
        return scores;
      };

      var drawBarChart = function(canvas, data) {
        var ctx = canvas.getContext("2d"); if (!ctx || !data.length) return;
        var W = canvas.width, H = canvas.height, pad = { top: 24, bottom: 32, left: 8, right: 8 };
        var chartH = H - pad.top - pad.bottom, midY = pad.top + chartH * 0.6;
        var maxAbs = Math.max.apply(null, data.map(function(s) { return Math.abs(s.total); }).concat([1]));
        var barW = Math.max(Math.floor((W - pad.left - pad.right) / data.length) - 4, 6);
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#f5f5f5"; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(pad.left, midY); ctx.lineTo(W - pad.right, midY); ctx.stroke(); ctx.setLineDash([]);
        data.forEach(function(score, i) {
          var x = pad.left + i * (barW + 4), pixPer = chartH * 0.55 / maxAbs, barH = Math.abs(score.total) * pixPer, isPos = score.total >= 0;
          ctx.fillStyle = isPos ? "#4ade80" : "#f87171";
          ctx.fillRect(x, isPos ? midY - barH : midY, barW, barH);
          ctx.fillStyle = "#333"; ctx.font = "bold " + Math.min(11, barW) + "px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(String(score.total), x + barW / 2, isPos ? midY - barH - 4 : midY + barH + 12);
          ctx.font = "9px sans-serif"; ctx.fillStyle = "#999";
          ctx.fillText(score.date.slice(5), x + barW / 2, H - 4);
        });
      };

      var renderStats = function(period) {
        statsBody.empty();
        var filtered = filterScores(period, allScores);
        if (!filtered.length) { statsBody.createEl("p", { text: "\u6682\u65E0\u6570\u636E \u{1F4ED}", cls: "kid-score-empty" }); return; }
        var total = filtered.reduce(function(s, r) { return s + r.total; }, 0);
        var avg = Math.round(total / filtered.length);
        var max = Math.max.apply(null, filtered.map(function(s) { return s.total; }));
        var cards = statsBody.createDiv({ cls: "kid-score-summary-cards" });
        var mkCard = function(l, v, a) { var c = cards.createDiv({ cls: "summary-card " + (a ? "accent" : "") }); c.createDiv({ cls: "card-val", text: v }); c.createDiv({ cls: "card-lbl", text: l }); };
        mkCard("\u7D2F\u8BA1\u603B\u5206", (total >= 0 ? "+" : "") + total, true);
        mkCard("\u65E5\u5747\u5206", (avg >= 0 ? "+" : "") + avg);
        mkCard("\u6700\u9AD8\u5355\u65E5", "+" + max);
        mkCard("\u8BB0\u5F55\u5929\u6570", filtered.length + " \u5929");
        if (self.plugin.settings.items.length > 0) {
          statsBody.createEl("h3", { text: "\u5404\u9879\u76EE\u5B8C\u6210\u7387", cls: "stats-section-title" });
          var itemList = statsBody.createDiv({ cls: "kid-score-item-completion" });
          for (var item of self.plugin.settings.items) {
            var count = filtered.filter(function(s) { return s.scores[item.id] !== undefined && s.scores[item.id] > 0; }).length;
            var rate = Math.round(count / filtered.length * 100);
            var row = itemList.createDiv({ cls: "completion-row" });
            row.createSpan({ cls: "completion-emoji", text: item.emoji }); row.createSpan({ cls: "completion-name", text: item.name });
            var bw = row.createDiv({ cls: "completion-bar-wrap" }); var bar = bw.createDiv({ cls: "completion-bar " + (item.points >= 0 ? "pos" : "neg") }); bar.style.width = rate + "%";
            row.createSpan({ cls: "completion-rate", text: count + "/" + filtered.length + " (" + rate + "%)" });
          }
        }
        statsBody.createEl("h3", { text: "\u6BCF\u65E5\u5F97\u5206\u8D8B\u52BF", cls: "stats-section-title" });
        var canvas = statsBody.createEl("canvas", { cls: "kid-score-chart" }); canvas.width = 540; canvas.height = 200;
        setTimeout(function() { drawBarChart(canvas, filtered.slice(-20)); }, 50);
        if (period === "all" && filtered.length > 7) {
          statsBody.createEl("h3", { text: "\u6309\u6708\u6C47\u603B", cls: "stats-section-title" });
          var byMonth = {};
          for (var s of filtered) { var m = s.date.slice(0, 7); if (!byMonth[m]) byMonth[m] = []; byMonth[m].push(s.total); }
          var mt = statsBody.createEl("table", { cls: "kid-score-month-table" });
          var th = mt.createEl("thead").createEl("tr");
          ["\u6708\u4EFD", "\u5929\u6570", "\u603B\u5206", "\u65E5\u5747"].forEach(function(h) { th.createEl("th", { text: h }); });
          var tb = mt.createEl("tbody");
          Object.entries(byMonth).sort().forEach(function(e) {
            var sum = e[1].reduce(function(a, b) { return a + b; }, 0); var av = Math.round(sum / e[1].length);
            var tr = tb.createEl("tr"); tr.createEl("td", { text: e[0] }); tr.createEl("td", { text: String(e[1].length) });
            tr.createEl("td", { text: (sum >= 0 ? "+" : "") + sum }); tr.createEl("td", { text: (av >= 0 ? "+" : "") + av });
          });
        }
      };

      for (var p of periods) {
        (function(period) {
          var tab = tabs.createEl("button", { text: period.label, cls: "kid-score-tab " + (period.key === activePeriod ? "is-active" : "") });
          tab.onclick = function() { activePeriod = period.key; tabs.querySelectorAll(".kid-score-tab").forEach(function(t) { t.removeClass("is-active"); }); tab.addClass("is-active"); renderStats(activePeriod); };
        })(p);
      }
      renderStats(activePeriod);
    });
  }

  onClose() { this.contentEl.empty(); }
};

/* ═══════════════════════════════════════════════════════════════════════════
   Settings Tab
   ═══════════════════════════════════════════════════════════════════════════ */
var KidScoreSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }

  display() {
    var self = this;
    var containerEl = this.containerEl;
    containerEl.empty();
    containerEl.addClass("kid-score-settings");
    containerEl.createEl("h2", { text: "\u{1F31F} \u5C0F\u670B\u53CB\u6BCF\u65E5\u8BB0\u5F55\u8BBE\u7F6E" });

    new import_obsidian.Setting(containerEl).setName("\u5C0F\u670B\u53CB\u59D3\u540D").setDesc("\u8BB0\u5F55\u6253\u5206\u7684\u5C0F\u670B\u53CB\u540D\u5B57")
      .addText(function(t) { return t.setPlaceholder("\u738B\u9756\u8FB0").setValue(self.plugin.settings.childName).onChange(function(v) { return __async(self, null, function* () { self.plugin.settings.childName = v; yield self.plugin.saveSettings(); }); }); });
    new import_obsidian.Setting(containerEl).setName("\u8BB0\u5F55\u4FDD\u5B58\u8DEF\u5F84").setDesc("\u6BCF\u65E5\u6253\u5206 Markdown \u6587\u4EF6\u5B58\u653E\u7684\u6587\u4EF6\u5939")
      .addText(function(t) { return t.setPlaceholder("\u738B\u9756\u8FB0/\u6BCF\u65E5\u6253\u5206").setValue(self.plugin.settings.savePath).onChange(function(v) { return __async(self, null, function* () { self.plugin.settings.savePath = v; yield self.plugin.saveSettings(); }); }); });

    // ── Category management ──
    containerEl.createEl("h3", { text: "\u{1F4C1} \u5206\u7C7B\u7BA1\u7406" });
    containerEl.createEl("p", { cls: "kid-score-hint", text: "\u6253\u5206\u9879\u76EE\u7684\u5206\u7C7B\uFF0C\u53EF\u6DFB\u52A0\u3001\u91CD\u547D\u540D\u3001\u5220\u9664\u3002\u9879\u76EE\u5C06\u6309\u5206\u7C7B\u5206\u7EC4\u663E\u793A\u3002" });
    var catWrap = containerEl.createDiv({ cls: "kid-score-cat-list" });

    // ── Category drag state ──
    var catDrag = { dragging: false, dragIdx: -1, placeholder: null, ghost: null, rows: [] };

    var getCatDragRowIndex = function(y) {
      for (var r = 0; r < catDrag.rows.length; r++) {
        var rect = catDrag.rows[r].getBoundingClientRect();
        if (y < rect.top + rect.height / 2) return r;
      }
      return catDrag.rows.length;
    };

    var onCatDragMove = function(clientY) {
      if (!catDrag.dragging) return;
      catDrag.ghost.style.top = clientY - 20 + "px";
      var targetIdx = getCatDragRowIndex(clientY);
      var parent = catDrag.rows[0].parentElement;
      if (targetIdx >= catDrag.rows.length) {
        parent.appendChild(catDrag.placeholder);
      } else {
        parent.insertBefore(catDrag.placeholder, catDrag.rows[targetIdx]);
      }
    };

    var onCatDragEnd = function(clientY) {
      if (!catDrag.dragging) return;
      catDrag.dragging = false;
      if (catDrag.ghost) catDrag.ghost.remove();
      if (catDrag.placeholder) catDrag.placeholder.remove();
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      var targetIdx = getCatDragRowIndex(clientY);
      var fromIdx = catDrag.dragIdx;
      if (targetIdx > fromIdx) targetIdx--;
      if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < self.plugin.settings.categories.length) {
        var arr = self.plugin.settings.categories;
        var moved = arr.splice(fromIdx, 1)[0];
        arr.splice(targetIdx, 0, moved);
        __async(self, null, function* () { yield self.plugin.saveSettings(); renderCategories(); renderItems(); })();
      } else {
        renderCategories();
      }
    };

    var catPointerMoveHandler = function(e) { onCatDragMove(e.clientY); };
    var catPointerUpHandler = function(e) {
      document.removeEventListener("pointermove", catPointerMoveHandler);
      document.removeEventListener("pointerup", catPointerUpHandler);
      onCatDragEnd(e.clientY);
    };

    var renderCategories = function() {
      catWrap.empty();
      catDrag.rows = [];
      var cats = self.plugin.settings.categories || [];
      for (var ci = 0; ci < cats.length; ci++) {
        (function(idx) {
          var row = catWrap.createDiv({ cls: "kid-score-cat-row" });

          // Drag handle
          var handle = row.createEl("span", { cls: "settings-drag-handle", text: "\u2630" });
          handle.addEventListener("pointerdown", function(e) {
            e.preventDefault();
            catDrag.dragging = true;
            catDrag.dragIdx = idx;
            catDrag.rows = Array.from(catWrap.querySelectorAll(".kid-score-cat-row"));

            var rect = row.getBoundingClientRect();
            var ghost = row.cloneNode(true);
            ghost.className = "kid-score-cat-row settings-drag-ghost";
            ghost.style.cssText = "position:fixed;left:" + rect.left + "px;top:" + (e.clientY - 20) + "px;width:" + rect.width + "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;";
            document.body.appendChild(ghost);
            catDrag.ghost = ghost;

            var ph = document.createElement("div");
            ph.className = "settings-drag-placeholder";
            ph.style.cssText = "height:" + rect.height + "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
            row.parentElement.insertBefore(ph, row);
            catDrag.placeholder = ph;

            row.style.display = "none";
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";

            document.addEventListener("pointermove", catPointerMoveHandler);
            document.addEventListener("pointerup", catPointerUpHandler);
          });

          var input = row.createEl("input", { cls: "settings-name-input" });
          input.value = cats[idx];
          input.onchange = function() {
            return __async(self, null, function* () {
              var oldName = self.plugin.settings.categories[idx];
              var newName = input.value.trim();
              if (!newName) return;
              self.plugin.settings.categories[idx] = newName;
              for (var it of self.plugin.settings.items) { if (it.category === oldName) it.category = newName; }
              yield self.plugin.saveSettings();
              renderItems();
            });
          };

          // Delete
          var delBtn = row.createEl("button", { cls: "settings-delete-btn", text: "\u{1F5D1}" });
          delBtn.onclick = function() {
            return __async(self, null, function* () {
              var removedCat = self.plugin.settings.categories[idx];
              self.plugin.settings.categories.splice(idx, 1);
              var fallback = self.plugin.settings.categories[0] || "\u5176\u4ED6";
              for (var it of self.plugin.settings.items) { if (it.category === removedCat) it.category = fallback; }
              yield self.plugin.saveSettings(); renderCategories(); renderItems();
            });
          };

          catDrag.rows.push(row);
        })(ci);
      }
    };
    renderCategories();

    new import_obsidian.Setting(containerEl).setName("\u6DFB\u52A0\u5206\u7C7B").addButton(function(btn) {
      return btn.setButtonText("\uFF0B \u65B0\u5206\u7C7B").setCta().onClick(function() {
        return __async(self, null, function* () {
          self.plugin.settings.categories.push("\u65B0\u5206\u7C7B");
          yield self.plugin.saveSettings(); renderCategories(); renderItems();
        });
      });
    });

    new import_obsidian.Setting(containerEl).setName("\u4FDD\u5B58\u5E76\u5237\u65B0").setDesc("\u4FDD\u5B58\u5206\u7C7B\u4FEE\u6539\uFF0C\u5237\u65B0\u4E0B\u65B9\u6253\u5206\u9879\u76EE\u7684\u5206\u7C7B\u4E0B\u62C9\u83DC\u5355").addButton(function(btn) {
      return btn.setButtonText("\u{1F504} \u4FDD\u5B58\u5E76\u5237\u65B0").onClick(function() {
        return __async(self, null, function* () {
          yield self.plugin.saveSettings();
          renderCategories();
          renderItems();
          new import_obsidian.Notice("\u2705 \u5206\u7C7B\u5DF2\u4FDD\u5B58\uFF0C\u6253\u5206\u9879\u76EE\u5DF2\u5237\u65B0");
        });
      });
    });

    // ── Scoring items management ──
    containerEl.createEl("h3", { text: "\u{1F4DD} \u6253\u5206\u9879\u76EE\u7BA1\u7406" });
    containerEl.createEl("p", { cls: "kid-score-hint", text: "\u70B9\u51FB\u8868\u60C5\u6309\u94AE\u6253\u5F00emoji\u9009\u62E9\u5668\u3002\u6309\u4F4F \u2630 \u62D6\u52A8\u6392\u5E8F\u3002" });
    var itemsWrap = containerEl.createDiv({ cls: "kid-score-settings-items" });

    // ── Drag state ──
    var dragState = { dragging: false, dragIdx: -1, placeholder: null, ghost: null, startY: 0, rows: [] };

    var getDragRowIndex = function(y) {
      for (var r = 0; r < dragState.rows.length; r++) {
        var rect = dragState.rows[r].getBoundingClientRect();
        if (y < rect.top + rect.height / 2) return r;
      }
      return dragState.rows.length;
    };

    var onDragMove = function(clientY) {
      if (!dragState.dragging) return;
      dragState.ghost.style.top = clientY - 20 + "px";
      var targetIdx = getDragRowIndex(clientY);
      var parent = dragState.rows[0].parentElement;
      // Move placeholder
      if (targetIdx >= dragState.rows.length) {
        parent.appendChild(dragState.placeholder);
      } else {
        parent.insertBefore(dragState.placeholder, dragState.rows[targetIdx]);
      }
    };

    var onDragEnd = function(clientY) {
      if (!dragState.dragging) return;
      dragState.dragging = false;
      if (dragState.ghost) dragState.ghost.remove();
      if (dragState.placeholder) dragState.placeholder.remove();
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      var targetIdx = getDragRowIndex(clientY);
      var fromIdx = dragState.dragIdx;
      if (targetIdx > fromIdx) targetIdx--;
      if (fromIdx !== targetIdx && fromIdx >= 0 && targetIdx >= 0 && targetIdx < self.plugin.settings.items.length) {
        var arr = self.plugin.settings.items;
        var moved = arr.splice(fromIdx, 1)[0];
        arr.splice(targetIdx, 0, moved);
        __async(self, null, function* () { yield self.plugin.saveSettings(); renderItems(); })();
      } else {
        renderItems();
      }
    };

    var pointerMoveHandler = function(e) { onDragMove(e.clientY); };
    var pointerUpHandler = function(e) {
      document.removeEventListener("pointermove", pointerMoveHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
      onDragEnd(e.clientY);
    };

    var renderItems = function() {
      itemsWrap.empty();
      dragState.rows = [];
      if (self.plugin.settings.items.length === 0) {
        itemsWrap.createEl("p", { cls: "kid-score-hint", text: "\u8FD8\u6CA1\u6709\u9879\u76EE\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6DFB\u52A0\uFF01" });
        return;
      }

      var headerRow = itemsWrap.createDiv({ cls: "settings-item-row-v2 header-row" });
      ["\u2630", "\u8868\u60C5", "\u540D\u79F0", "\u5206\u7C7B", "\u5206\u503C", ""].forEach(function(h) { headerRow.createSpan({ text: h, cls: "col-header" }); });

      var lastCat = null;
      for (var i = 0; i < self.plugin.settings.items.length; i++) {
        (function(idx) {
          var item = self.plugin.settings.items[idx];
          var thisCat = item.category || "\u5176\u4ED6";
          if (thisCat !== lastCat) {
            lastCat = thisCat;
            var groupHeader = itemsWrap.createDiv({ cls: "settings-cat-group-header" });
            groupHeader.createSpan({ text: thisCat });
          }
          var wrap = itemsWrap.createDiv({ cls: "settings-item-wrap" });
          var row = wrap.createDiv({ cls: "settings-item-row-v2" });
          row.dataset.idx = String(idx);

          // Drag handle
          var handle = row.createEl("span", { cls: "settings-drag-handle", text: "\u2630" });
          handle.addEventListener("pointerdown", function(e) {
            e.preventDefault();
            dragState.dragging = true;
            dragState.dragIdx = idx;
            dragState.rows = Array.from(itemsWrap.querySelectorAll(".settings-item-wrap"));
            dragState.startY = e.clientY;

            // Create ghost
            var rect = wrap.getBoundingClientRect();
            var ghost = wrap.cloneNode(true);
            ghost.className = "settings-item-wrap settings-drag-ghost";
            ghost.style.cssText = "position:fixed;left:" + rect.left + "px;top:" + (e.clientY - 20) + "px;width:" + rect.width + "px;z-index:10000;opacity:0.85;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);background:var(--background-primary);border-radius:8px;padding:4px;";
            document.body.appendChild(ghost);
            dragState.ghost = ghost;

            // Create placeholder
            var ph = document.createElement("div");
            ph.className = "settings-drag-placeholder";
            ph.style.cssText = "height:" + rect.height + "px;border:2px dashed var(--interactive-accent);border-radius:8px;margin:2px 0;background:var(--background-secondary);opacity:0.5;";
            wrap.parentElement.insertBefore(ph, wrap);
            dragState.placeholder = ph;

            wrap.style.display = "none";
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";

            document.addEventListener("pointermove", pointerMoveHandler);
            document.addEventListener("pointerup", pointerUpHandler);
          });

          // Emoji button — opens full picker
          var emojiBtn = row.createEl("button", { cls: "settings-emoji-btn", text: item.emoji });
          emojiBtn.onclick = function() {
            showEmojiPicker(function(em) {
              return __async(self, null, function* () {
                self.plugin.settings.items[idx].emoji = em;
                yield self.plugin.saveSettings();
                emojiBtn.textContent = em;
              });
            });
          };

          // Name
          var nameInput = row.createEl("input", { cls: "settings-name-input" });
          nameInput.type = "text"; nameInput.value = item.name;
          nameInput.onchange = function() { return __async(self, null, function* () { self.plugin.settings.items[idx].name = nameInput.value; yield self.plugin.saveSettings(); }); };

          // Category dropdown
          var catSelect = row.createEl("select", { cls: "settings-cat-select" });
          var cats = self.plugin.settings.categories || [];
          for (var c of cats) {
            var opt = catSelect.createEl("option", { text: c, value: c });
            if (item.category === c) opt.selected = true;
          }
          catSelect.onchange = function() { return __async(self, null, function* () { self.plugin.settings.items[idx].category = catSelect.value; var cats = self.plugin.settings.categories || []; self.plugin.settings.items.sort(function(a, b) { var ai = cats.indexOf(a.category); if (ai === -1) ai = 9999; var bi = cats.indexOf(b.category); if (bi === -1) bi = 9999; return ai - bi; }); yield self.plugin.saveSettings(); renderItems(); }); };

          // Points
          var pointsInput = row.createEl("input", { cls: "settings-points-input" });
          pointsInput.type = "number"; pointsInput.value = String(item.points);
          pointsInput.onchange = function() { return __async(self, null, function* () { self.plugin.settings.items[idx].points = parseInt(pointsInput.value) || 0; yield self.plugin.saveSettings(); }); };

          // Delete
          var del = row.createEl("button", { text: "\u{1F5D1}", cls: "settings-delete-btn" });
          del.onclick = function() { return __async(self, null, function* () { self.plugin.settings.items.splice(idx, 1); yield self.plugin.saveSettings(); renderItems(); }); };

          // Note (below the main row)
          var noteRow = wrap.createDiv({ cls: "settings-item-note-row" });
          var noteInput = noteRow.createEl("input", { cls: "settings-note-input" });
          noteInput.type = "text";
          noteInput.placeholder = "\u5907\u6CE8\uFF08\u53EF\u9009\uFF09";
          noteInput.value = item.note || "";
          noteInput.onchange = function() { return __async(self, null, function* () { self.plugin.settings.items[idx].note = noteInput.value; yield self.plugin.saveSettings(); }); };

          dragState.rows.push(wrap);
        })(i);
      }

      // Insert "+ 添加" button after each category group
      var groupHeaders = Array.from(itemsWrap.querySelectorAll(".settings-cat-group-header"));
      groupHeaders.forEach(function(header, hi) {
        var cat = header.querySelector("span").textContent;
        var nextSibling = groupHeaders[hi + 1] || null;
        var addBtn = document.createElement("button");
        addBtn.className = "settings-cat-add-btn";
        addBtn.textContent = "+ \u5728\u300C" + cat + "\u300D\u6DFB\u52A0\u9879\u76EE";
        (function(c) {
          addBtn.onclick = function() {
            return __async(self, null, function* () {
              self.plugin.settings.items.push({ id: "item_" + Date.now(), name: "\u65B0\u9879\u76EE", points: 1, emoji: "\u2B50", category: c, note: "" });
              var cats2 = self.plugin.settings.categories || [];
              self.plugin.settings.items.sort(function(a, b) { var ai = cats2.indexOf(a.category); if (ai === -1) ai = 9999; var bi = cats2.indexOf(b.category); if (bi === -1) bi = 9999; return ai - bi; });
              yield self.plugin.saveSettings();
              renderItems();
            });
          };
        })(cat);
        if (nextSibling) { itemsWrap.insertBefore(addBtn, nextSibling); } else { itemsWrap.appendChild(addBtn); }
      });
    };

    renderItems();

    new import_obsidian.Setting(containerEl).setName("\u6DFB\u52A0\u65B0\u9879\u76EE")
      .addButton(function(btn) {
        return btn.setButtonText("\uFF0B \u6DFB\u52A0\u9879\u76EE").setCta().onClick(function() {
          return __async(self, null, function* () {
            var defaultCat = self.plugin.settings.categories[0] || "\u52A0\u5206\u9879";
            self.plugin.settings.items.push({ id: "item_" + Date.now(), name: "\u65B0\u9879\u76EE", points: 1, emoji: "\u2B50", category: defaultCat, note: "" });
            var cats = self.plugin.settings.categories || [];
            self.plugin.settings.items.sort(function(a, b) { var ai = cats.indexOf(a.category); if (ai === -1) ai = 9999; var bi = cats.indexOf(b.category); if (bi === -1) bi = 9999; return ai - bi; });
            yield self.plugin.saveSettings(); renderItems();
          });
        });
      })
      .addButton(function(btn) {
        return btn.setButtonText("\u{1F4C2} \u6309\u5206\u7C7B\u6392\u5E8F").onClick(function() {
          return __async(self, null, function* () {
            var cats = self.plugin.settings.categories || [];
            self.plugin.settings.items.sort(function(a, b) {
              var ai = cats.indexOf(a.category); if (ai === -1) ai = 9999;
              var bi = cats.indexOf(b.category); if (bi === -1) bi = 9999;
              return ai - bi;
            });
            yield self.plugin.saveSettings(); renderItems();
            new import_obsidian.Notice("\u2705 \u5DF2\u6309\u5206\u7C7B\u6392\u5E8F");
          });
        });
      });

    // ── Diary template ──
    containerEl.createEl("h3", { text: "\u{1F4DD} \u65E5\u8BB0\u6A21\u677F" });
    containerEl.createEl("p", { cls: "kid-score-hint", text: "\u6BCF\u65E5\u65E5\u8BB0\u7684\u9ED8\u8BA4\u6A21\u677F\uFF0C\u652F\u6301 Markdown" });

    var tmplIsPreview = false;
    var tmplSetting = new import_obsidian.Setting(containerEl).setName("\u65E5\u8BB0\u6A21\u677F\u5185\u5BB9");
    var tmplTextArea;
    tmplSetting.addTextArea(function(t) {
      tmplTextArea = t;
      t.setValue(self.plugin.settings.diaryTemplate || DEFAULT_SETTINGS.diaryTemplate);
      t.inputEl.rows = 8; t.inputEl.style.width = "100%"; t.inputEl.style.fontFamily = "monospace";
      t.onChange(function(v) { return __async(self, null, function* () { self.plugin.settings.diaryTemplate = v; yield self.plugin.saveSettings(); }); });
      return t;
    });
    var tmplPreviewWrap = containerEl.createDiv({ cls: "diary-preview-wrap diary-preview-settings" });
    tmplPreviewWrap.style.display = "none";
    var tmplPreviewBtn = containerEl.createEl("button", { cls: "diary-tool-btn", text: "MD\u6A21\u5F0F" });
    tmplPreviewBtn.onclick = function() {
      tmplIsPreview = !tmplIsPreview;
      if (tmplIsPreview) {
        tmplTextArea.inputEl.rows = 4;
        tmplPreviewWrap.style.display = "";
        tmplPreviewWrap.empty();
        import_obsidian.MarkdownRenderer.render(self.app, self.plugin.settings.diaryTemplate || DEFAULT_SETTINGS.diaryTemplate, tmplPreviewWrap, "", self);
        tmplTextArea.inputEl.oninput = function() {
          tmplPreviewWrap.empty();
          import_obsidian.MarkdownRenderer.render(self.app, tmplTextArea.inputEl.value || "_\u8FD8\u6CA1\u6709\u5185\u5BB9_", tmplPreviewWrap, "", self);
        };
        tmplPreviewBtn.textContent = "\u9884\u89C8\u6A21\u5F0F";
      } else {
        tmplTextArea.inputEl.rows = 8;
        tmplPreviewWrap.style.display = "none";
        tmplTextArea.inputEl.oninput = null;
        tmplPreviewBtn.textContent = "MD\u6A21\u5F0F";
      }
    };

    // ── Export / Import ──
    containerEl.createEl("h3", { text: "\uD83D\uDCE6 \u5BFC\u51FA / \u5BFC\u5165\u914D\u7F6E" });
    new import_obsidian.Setting(containerEl)
      .setName("\u5BFC\u51FA\u6253\u5206\u9879\u914D\u7F6E")
      .setDesc("\u5C06\u6240\u6709\u5206\u7C7B\u548C\u6253\u5206\u9879\u5BFC\u51FA\u4E3A JSON \u6587\u4EF6")
      .addButton(function(btn) {
        btn.setButtonText("\uD83D\uDCE4 \u5BFC\u51FA").onClick(function() {
          var data = { categories: self.plugin.settings.categories, items: self.plugin.settings.items };
          var json = JSON.stringify(data, null, 2);
          var blob = new Blob([json], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url; a.download = "little-milestones-config.json"; a.click();
          URL.revokeObjectURL(url);
        });
      });
    new import_obsidian.Setting(containerEl)
      .setName("\u5BFC\u5165\u6253\u5206\u9879\u914D\u7F6E")
      .setDesc("\u4ECE JSON \u6587\u4EF6\u5BFC\u5165\u5206\u7C7B\u548C\u6253\u5206\u9879\uFF08\u5C06\u8986\u76D6\u73B0\u6709\u914D\u7F6E\uFF09")
      .addButton(function(btn) {
        btn.setButtonText("\uD83D\uDCE5 \u5BFC\u5165").onClick(function() {
          var fileInput = document.createElement("input");
          fileInput.type = "file"; fileInput.accept = ".json";
          fileInput.onchange = function() {
            return __async(self, null, function* () {
              var file = fileInput.files && fileInput.files[0];
              if (!file) return;
              try {
                var text = yield file.text();
                var data = JSON.parse(text);
                if (Array.isArray(data.items)) self.plugin.settings.items = data.items;
                if (Array.isArray(data.categories)) self.plugin.settings.categories = data.categories;
                yield self.plugin.saveSettings();
                self.display();
                new import_obsidian.Notice("\u2705 \u914D\u7F6E\u5BFC\u5165\u6210\u529F");
              } catch (e) {
                new import_obsidian.Notice("\u274C JSON \u683C\u5F0F\u6709\u8BEF\uFF0C\u5BFC\u5165\u5931\u8D25");
              }
            });
          };
          fileInput.click();
        });
      });
  }
};
