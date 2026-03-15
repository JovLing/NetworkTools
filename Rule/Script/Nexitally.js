function main(config) {

  // 基础配置
  Object.assign(config, {
    'mixed-port': 7890,
    'external-controller': '0.0.0.0:9090',
    'mode': 'Rule',
    'dns': {
      'enable': true,
      'ipv6': false,
      'listen': '0.0.0.0:1053',
      'enhanced-mode': 'fake-ip',
      'fake-ip-range': '198.18.0.1/16',
      'fake-ip-filter': [
        '*.lan',
        '*.localdomain',
        '*.localhost',
        '*.local',
        '*.msftncsi.com',
        '*.msftconnecttest.com',
        'time.*.com',
		'time.*.gov',
        'time.*.edu.cn',
        'time.*.apple.com',
        'ntp.*.com',
		'stun.*.*'
      ],
      'default-nameserver': [
        '119.29.29.29',
		'223.5.5.5'
      ],
      'nameserver': [
        'https://119.29.29.29/dns-query',
        'https://223.5.5.5/dns-query',
      ],
      'fallback': [
        'https://8.8.8.8/dns-query',
        'https://1.1.1.1/dns-query'
      ],
      'fallback-filter': {
        'geoip': true,
        'geoip-code': 'CN',
        'ipcidr': [
          '240.0.0.0/4'
        ],
        'domain': [
          '+.telegram.org',
          '+.google.com',
          '+.youtube.com',
		  '+.tiktok.com',
          '+.whatsapp.com',
          '+.discord.com',
          '+.twitter.com',
          '+.facebook.com',
          '+.instagram.com',
          '+.reddit.com'
        ]
      }
    }
  });

  // 过滤节点
  const excludeRegex = /Premium|200\.00 G|Traffic Reset|Expire Date/i;
  config.proxies = (config.proxies || []).filter(p => !excludeRegex.test(p.name));
  const proxies = config.proxies;

  // Emoji旗帜列表
  const emojiMap = {
    "阿联酋|阿拉伯联合酋长国": "🇦🇪", "阿根廷": "🇦🇷", "奥地利": "🇦🇹", "澳大利亚|澳洲": "🇦🇺", "孟加拉": "🇧🇩", "比利时": "🇧🇪", "保加利亚": "🇧🇬", "巴林": "🇧🇭", "文莱": "🇧🇳", "巴西": "🇧🇷", "白俄罗斯": "🇧🇾", "加拿大": "🇨🇦", "瑞士": "🇨🇭", "智利": "🇨🇱", "中国": "🇨🇳", "捷克": "🇨🇿", "德国": "🇩🇪", "丹麦": "🇩🇰", "爱沙尼亚": "🇪🇪", "埃及": "🇪🇬", "西班牙": "🇪🇸", "欧盟|欧洲": "🇪🇺", "芬兰": "🇫🇮", "法国": "🇫🇷", "英国": "🇬🇧", "格陵兰": "🇬🇱", "希腊": "🇬🇷", "香港": "🇭🇰", "克罗地亚": "🇭🇷", "匈牙利": "🇭🇺", "印尼|印度尼西亚": "🇮🇩", "爱尔兰": "🇮🇪", "以色列": "🇮🇱", "印度": "🇮🇳", "冰岛": "🇮🇸", "意大利": "🇮🇹", "日本": "🇯🇵", "韩国": "🇰🇷", "立陶宛": "🇱🇹", "卢森堡": "🇱🇺", "拉脱维亚": "🇱🇻", "利比亚": "🇱🇾", "摩洛哥": "🇲🇦", "摩纳哥": "🇲🇨", "摩尔多瓦": "🇲🇩", "黑山": "🇲🇪", "澳门": "🇲🇴", "墨西哥": "🇲🇽", "马来西亚": "🇲🇾", "尼日利亚": "🇳🇬", "荷兰": "🇳🇱", "挪威": "🇳🇴", "新西兰": "🇳🇿", "菲律宾": "🇵🇭", "巴基斯坦": "🇵🇰", "波兰": "🇵🇱", "葡萄牙": "🇵🇹", "罗马尼亚": "🇷🇴", "塞尔维亚": "🇷🇸", "俄罗斯": "🇷🇺", "沙特阿拉伯": "🇸🇦", "瑞典": "🇸🇪", "新加坡": "🇸🇬", "斯洛伐克": "🇸🇰", "泰国": "🇹🇭", "土耳其": "🇹🇷", "台湾": "🇹🇼", "乌克兰": "🇺🇦", "美国": "🇺🇸", "越南": "🇻🇳", "南非": "🇿🇦"
  };
  
  // 遍历节点
  proxies.forEach(proxy => {
    if (proxy.name.includes("TCVM")) return;
    let name = proxy.name;
    
    // 清除原来的Emoji旗帜
    name = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g, "");
    name = name.trim();
    
    // 节点重命名
    name = name.replace(/Japan 01 \(DIP Japan-Tokyo\)/i, "日本-东京（🏠独享IP）");
    name = name.replace(/Singapore 01 \(DIP Singapore\)/i, "新加坡-西北区（🏠独享IP）");
    name = name.replace(/USA Los Angeles 01 \(DIP USA-Los Angeles\)/i, "美国-洛杉矶（🏠独享IP）");
    name = name.replace(/Hong Kong/i, "香港");
    name = name.replace(/Taiwan/i, "台湾");
    name = name.replace(/Macao/i, "澳门");
    name = name.replace(/Japan/i, "日本");
    name = name.replace(/Singapore/i, "新加坡");
    name = name.replace(/USA Seattle/i, "美国-西雅图");
    name = name.replace(/USA San Jose/i, "美国-圣何塞");
    name = name.replace(/USA Los Angeles/i, "美国-洛杉矶");
    name = name.replace(/Netherlands/i, "荷兰");
    name = name.replace(/Russia St\. Petersburg/i, "俄罗斯-圣彼得堡");
    name = name.replace(/Russia Moscow/i, "俄罗斯-莫斯科");
    name = name.replace(/Germany/i, "德国");
    name = name.replace(/Switzerland/i, "瑞士");
    name = name.replace(/France/i, "法国");
    name = name.replace(/United Kingdom/i, "英国");
    name = name.replace(/Sweden/i, "瑞典");
    name = name.replace(/Bulgaria/i, "保加利亚");
    name = name.replace(/Austria/i, "奥地利");
    name = name.replace(/Ireland/i, "爱尔兰");
    name = name.replace(/Turkey/i, "土耳其");
    name = name.replace(/Hungary/i, "匈牙利");
    name = name.replace(/Korea/i, "韩国");
    name = name.replace(/Canada/i, "加拿大");
    name = name.replace(/Australia Sydney/i, "澳大利亚-悉尼");
    name = name.replace(/United Arab Emirates/i, "阿拉伯联合酋长国");
    name = name.replace(/Indonesia/i, "印度尼西亚");
    name = name.replace(/India/i, "印度");
    name = name.replace(/Brazil/i, "巴西");
    name = name.replace(/Argentina/i, "阿根廷");
    name = name.replace(/Chile/i, "智利");

    // 添加国家或地区Emoji旗帜
    for (const key in emojiMap) {
      if (new RegExp(key, "i").test(name) && !name.includes(emojiMap[key])) {
        name = `${emojiMap[key]} ${name}`;
        break;
      }
    } 
    proxy.name = name;
  });
  const updatedProxyNames = proxies.map(p => p.name);

  // 节点提取
  const getNodes = (includeRegex, excludeRegex) => {
    return updatedProxyNames.filter(name => {
      let match = includeRegex ? includeRegex.test(name) : true;
      let notMatch = excludeRegex ? !excludeRegex.test(name) : true;
      return match && notMatch;
    });
  };
  const jpDIP = getNodes(/日本.*独享IP/i, null);
  const sgDIP = getNodes(/新加坡.*独享IP/i, null);
  const usDIP = getNodes(/美国.*独享IP/i, null);
  const hkAutoNodes = getNodes(/香港/i, /独享IP|TCVM/i);
  const jpAutoNodes = getNodes(/日本/i, /独享IP|TCVM/i);
  const sgAutoNodes = getNodes(/新加坡/i, /独享IP|TCVM/i);
  const usSeattleAutoNodes = getNodes(/美国-西雅图/i, /独享IP|TCVM/i);
  const usSanjoseAutoNodes = getNodes(/美国-圣何塞/i, /独享IP|TCVM/i);
  const usLosangelesAutoNodes = getNodes(/美国-洛杉矶/i, /独享IP|TCVM/i);
  const twAutoNodes = getNodes(/台湾/i, /独享IP|TCVM/i);
  const deAutoNodes = getNodes(/德国/i, /独享IP|TCVM/i);
  const gbAutoNodes = getNodes(/英国/i, /独享IP|TCVM/i);
  const otherNodes = getNodes(null, /香港|日本|新加坡|美国|台湾|德国|英国|TCVM/i);

  // 策略组
  config['proxy-groups'] = [
    {
      name: "节点选择｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/NetworkProxy/Airport.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", ...jpDIP, ...sgDIP, ...usDIP, "🇭🇰 香港｜⚡AUTO", "🇯🇵 日本｜⚡AUTO", "🇸🇬 新加坡｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO", "🇹🇼 台湾｜⚡AUTO", "🇩🇪 德国｜⚡AUTO", "🇬🇧 英国｜⚡AUTO", ...otherNodes]
    },
    {
      name: "电报｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Telegram.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", "🇭🇰 香港｜⚡AUTO", "🇯🇵 日本｜⚡AUTO"]
    },
    {
      name: "Emby｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Emby.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["DIRECT", "「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", "🇭🇰 香港｜⚡AUTO", "🇯🇵 日本｜⚡AUTO", "🇸🇬 新加坡｜⚡AUTO", "🇹🇼 台湾｜⚡AUTO"]
    },
    {
      name: "海外影视｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/GlobalMedia.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", "🇸🇬 新加坡｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    {
      name: "海外社交平台｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/SocialContact.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", ...sgDIP, ...usDIP, "🇸🇬 新加坡｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    {
      name: "TikTok｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/TikTok.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [...jpDIP, ...sgDIP, "🇯🇵 日本｜⚡AUTO", "🇸🇬 新加坡｜⚡AUTO"]
    },
    {
      name: "AI｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/AI.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", ...sgDIP, ...usDIP, "🇸🇬 新加坡｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    {
      name: "游戏平台｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Games.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["DIRECT", "🇭🇰 香港｜⚡AUTO"]
    },
    {
      name: "谷歌｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Google.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["「☁️TCVM」🇺🇸 美国-洛杉矶｜🌎美西三线", ...sgDIP, ...usDIP, "🇸🇬 新加坡｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    {
      name: "苹果｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Apple.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["DIRECT", "🇭🇰 香港｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    {
      name: "微软｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Microsoft.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: ["DIRECT", "🇭🇰 香港｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    {
      name: "币圈｜🐷奶昔",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Crypto.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [...sgDIP, ...usDIP, "🇸🇬 新加坡｜⚡AUTO", "🇺🇸 美国-西雅图｜⚡AUTO", "🇺🇸 美国-圣何塞｜⚡AUTO", "🇺🇸 美国-洛杉矶｜⚡AUTO"]
    },
    { 
	  name: "🇭🇰 香港｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 50,
	  proxies: hkAutoNodes
	},
	{ 
	  name: "🇯🇵 日本｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 50,
	  proxies: jpAutoNodes
	},
	{ 
	  name: "🇸🇬 新加坡｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 50,
	  proxies: sgAutoNodes
	},
	{ 
	  name: "🇺🇸 美国-西雅图｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 80,
	  proxies: usSeattleAutoNodes
	},
	{ 
	  name: "🇺🇸 美国-圣何塞｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 80,
	  proxies: usSanjoseAutoNodes
	},
	{ 
	  name: "🇺🇸 美国-洛杉矶｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 80,
	  proxies: usLosangelesAutoNodes
	},
	{ 
	  name: "🇹🇼 台湾｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 50,
	  proxies: twAutoNodes
	},
	{ 
	  name: "🇩🇪 德国｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 80,
	  proxies: deAutoNodes
	},
	{ 
	  name: "🇬🇧 英国｜⚡AUTO",
	  icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_Kingdom.png",
	  url: "http://cp.cloudflare.com/generate_204",
	  type: "url-test",
	  interval: 600,
	  timeout: 3000,
	  tolerance: 80,
	  proxies: gbAutoNodes
	}
  ];

  // 外部规则集
  config['rule-providers'] = {
    "localhost": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/Rule/localhost.yaml", path: "./rule_set/localhost.yaml", interval: 86400 },
    "telegram": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Telegram.yaml", path: "./rule_set/Telegram.yaml", interval: 86400 },
    "whatsapp": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Whatsapp.yaml", path: "./rule_set/Whatsapp.yaml", interval: 86400 },
    "discord": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Discord.yaml", path: "./rule_set/Discord.yaml", interval: 86400 },
    "twitter": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Twitter.yaml", path: "./rule_set/Twitter.yaml", interval: 86400 },
    "facebook": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Facebook.yaml", path: "./rule_set/Facebook.yaml", interval: 86400 },
    "instagram": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Instagram.yaml", path: "./rule_set/Instagram.yaml", interval: 86400 },
    "reddit": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Reddit.yaml", path: "./rule_set/Reddit.yaml", interval: 86400 },
    "twitch": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Twitch.yaml", path: "./rule_set/Twitch.yaml", interval: 86400 },
    "ai": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/AI.yaml", path: "./rule_set/AI.yaml", interval: 86400 },
    "tiktok": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/TikTok.yaml", path: "./rule_set/TikTok.yaml", interval: 86400 },
    "google": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Google.yaml", path: "./rule_set/Google.yaml", interval: 86400 },
    "apple": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Apple.yaml", path: "./rule_set/Apple.yaml", interval: 86400 },
    "microsoft": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Microsoft.yaml", path: "./rule_set/Microsoft.yaml", interval: 86400 },
    "steam": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Steam.yaml", path: "./rule_set/Steam.yaml", interval: 86400 },
    "epic": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Epic.yaml", path: "./rule_set/Epic.yaml", interval: 86400 },
    "xbox": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Xbox.yaml", path: "./rule_set/Xbox.yaml", interval: 86400 },
    "emby": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/Rule/Emby.yaml", path: "./rule_set/Emby.yaml", interval: 86400 },
    "netflix": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Netflix.yaml", path: "./rule_set/Netflix.yaml", interval: 86400 },
    "disneyplus": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/DisneyPlus.yaml", path: "./rule_set/DisneyPlus.yaml", interval: 86400 },
    "hbo": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/HBO.yaml", path: "./rule_set/HBO.yaml", interval: 86400 },
    "crypto": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Crypto.yaml", path: "./rule_set/Crypto.yaml", interval: 86400 },
    "china_domain": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaDomain.yaml", path: "./rule_set/ChinaDomain.yaml", interval: 86400 }
  };

  // 路由规则
  config['rules'] = [
    "RULE-SET,localhost,DIRECT",
    "RULE-SET,telegram,电报｜🐷奶昔",
    "RULE-SET,whatsapp,海外社交平台｜🐷奶昔",
    "RULE-SET,discord,海外社交平台｜🐷奶昔",
    "RULE-SET,twitter,海外社交平台｜🐷奶昔",
    "RULE-SET,facebook,海外社交平台｜🐷奶昔",
    "RULE-SET,instagram,海外社交平台｜🐷奶昔",
    "RULE-SET,reddit,海外社交平台｜🐷奶昔",
    "RULE-SET,twitch,海外社交平台｜🐷奶昔",
    "RULE-SET,ai,AI｜🐷奶昔",
    "RULE-SET,tiktok,TikTok｜🐷奶昔",
    "RULE-SET,google,谷歌｜🐷奶昔",
    "RULE-SET,apple,苹果｜🐷奶昔",
    "RULE-SET,microsoft,微软｜🐷奶昔",
    "RULE-SET,steam,游戏平台｜🐷奶昔",
    "RULE-SET,epic,游戏平台｜🐷奶昔",
    "RULE-SET,xbox,游戏平台｜🐷奶昔",
    "RULE-SET,emby,Emby｜🐷奶昔",
    "RULE-SET,netflix,海外影视｜🐷奶昔",
    "RULE-SET,disneyplus,海外影视｜🐷奶昔",
    "RULE-SET,hbo,海外影视｜🐷奶昔",
    "RULE-SET,crypto,币圈｜🐷奶昔",
    "RULE-SET,china_domain,DIRECT",
    "GEOSITE,cn,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择｜🐷奶昔"
  ];

  return config;
}