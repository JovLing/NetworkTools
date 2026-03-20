function main(config) {
  if (!config.proxies || config.proxies.length === 0) return config;
  
  // 基础配置
  Object.assign(config, {
    'mixed-port': 7890,
    'external-controller': '0.0.0.0:9090',
    'mode': 'Rule',
	'cfw-latency-url': 'http://cp.cloudflare.com/generate_204',
	'cfw-latency-timeout': 3000,
	'geodata-mode': true,
	'geo-auto-update': true,
	'geo-update-interval': 24,
	'geox-url': {
      'geoip': "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
      'geosite': "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
      'mmdb': "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb",
      'asn': "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"
    },
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
		'223.5.5.5',
		'119.29.29.29',
		'8.8.8.8',
        '1.1.1.1'
      ],
	  'direct-nameserver': [
		'https://dns.alidns.com/dns-query',
		'https://doh.pub/dns-query'
	  ],
	  'direct-nameserver-follow-policy': false,
      'nameserver': [
        'https://223.5.5.5/dns-query',
        'https://119.29.29.29/dns-query'
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
  const filterKeywords = ["Traffic", "Expire"];
  // 节点白名单
  const excludeKeywords = ["TCVM"];
  // 节点重命名与重编
  const regionCounts = {}; 
  const nameMap = {};
  const regex = /^([\u{1F1E6}-\u{1F1FF}]{2}|\p{Emoji}+)\s*(.*?)(?=高级|标准|实验性|$)/u;
  config.proxies = config.proxies.filter(proxy => {
    const oldName = proxy.name;
    if (filterKeywords.some(key => oldName.toLowerCase().includes(key.toLowerCase()))) return false;
    if (excludeKeywords.some(key => oldName.toLowerCase().includes(key.toLowerCase()))) return true;
    const match = oldName.match(regex);
    if (match) {
      let emoji = match[1];
      let regionName = match[2].trim();
      // 旗帜矫正
      if (regionName.includes("台湾") && emoji === "🇨🇳") {emoji = "🇹🇼"}
      const prefix = `${emoji} ${regionName}`;
      let newName = "";
      if (oldName.includes("实验性")) {
        newName = `${prefix}｜📶0.2x倍率`;
      } else {
        regionCounts[prefix] = (regionCounts[prefix] || 0) + 1;
        newName = `${prefix} ${regionCounts[prefix]}`; 
      }    
      nameMap[oldName] = newName;
      proxy.name = newName;
    }
    return true;
  });
  const updatedProxyNames = config.proxies.map(p => p.name);

  // 节点提取
  const getNodes = (includeRegex, excludeRegex) => {
    return updatedProxyNames.filter(name => {
      let match = includeRegex ? includeRegex.test(name) : true;
      let notMatch = excludeRegex ? !excludeRegex.test(name) : true;
      return match && notMatch;
    });
  };
  const hkAutoNodes = getNodes(/香港/i, /0.2x倍率|TCVM/i);
  const jpAutoNodes = getNodes(/日本/i, /0.2x倍率|TCVM/i);
  const sgAutoNodes = getNodes(/新加坡/i, /0.2x倍率|TCVM/i);
  const usAutoNodes = getNodes(/美国/i, /0.2x倍率|TCVM/i);
  const twAutoNodes = getNodes(/台湾/i, /0.2x倍率|TCVM/i);
  const otherNodes = getNodes(null, /香港|日本|新加坡|美国|台湾|TCVM/i);

  // 策略组
  config['proxy-groups'] = [
    {
      name: "节点选择｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/NetworkProxy/Airport.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇭🇰 香港（☁️TCVM）｜📶0.2x倍率",
        "🇯🇵 日本-东京（☁️TCVM）｜📶0.2x倍率",
        "🇸🇬 新加坡（☁️TCVM）｜📶0.2x倍率",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜📶0.2x倍率",
        "🇭🇰 香港（☁️TCVM）｜⚡AUTO",
        "🇯🇵 日本-东京（☁️TCVM）｜⚡AUTO",
        "🇸🇬 新加坡（☁️TCVM）｜⚡AUTO",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜⚡AUTO",
        "🇭🇰 香港｜📶0.2x倍率",
        "🇯🇵 日本｜📶0.2x倍率",
        "🇸🇬 新加坡｜📶0.2x倍率",
        "🇺🇸 美国｜📶0.2x倍率",
        "🇭🇰 香港｜⚡AUTO",
        "🇯🇵 日本｜⚡AUTO",
        "🇸🇬 新加坡｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO",
        "🇹🇼 台湾｜⚡AUTO",
        ...otherNodes
    ]},
    {
      name: "电报｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Telegram.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇭🇰 香港｜📶0.2x倍率",
        "🇯🇵 日本｜📶0.2x倍率",
        "🇭🇰 香港｜⚡AUTO",
        "🇯🇵 日本｜⚡AUTO"
    ]},
    {
      name: "Emby｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Emby.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇭🇰 香港｜📶0.2x倍率",
        "🇯🇵 日本｜📶0.2x倍率",
        "🇸🇬 新加坡｜📶0.2x倍率",
        "🇺🇸 美国｜📶0.2x倍率",
        "🇭🇰 香港｜⚡AUTO",
        "🇯🇵 日本｜⚡AUTO",
        "🇸🇬 新加坡｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO",
        "DIRECT"
    ]},
    {
      name: "海外影视｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/GlobalMedia.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇸🇬 新加坡（☁️TCVM）｜📶0.2x倍率",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜📶0.2x倍率",
        "🇸🇬 新加坡（☁️TCVM）｜⚡AUTO",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜⚡AUTO",
        "🇸🇬 新加坡｜📶0.2x倍率",
        "🇺🇸 美国｜📶0.2x倍率",
        "🇸🇬 新加坡｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO"
    ]},
    {
      name: "海外媒体｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/SocialContact.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇸🇬 新加坡（☁️TCVM）｜📶0.2x倍率",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜📶0.2x倍率",
        "🇸🇬 新加坡（☁️TCVM）｜⚡AUTO",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜⚡AUTO",
        "🇸🇬 新加坡｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO"
    ]},
    {
      name: "TikTok｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/TikTok.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇯🇵 日本-东京（☁️TCVM）｜📶0.2x倍率",
        "🇸🇬 新加坡（☁️TCVM）｜📶0.2x倍率",
        "🇯🇵 日本-东京（☁️TCVM）｜⚡AUTO",
        "🇸🇬 新加坡（☁️TCVM）｜⚡AUTO",
        "🇯🇵 日本｜⚡AUTO",
        "🇸🇬 新加坡｜⚡AUTO"
    ]},
    {
      name: "AI｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/AI.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇸🇬 新加坡（☁️TCVM）｜📶0.2x倍率",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜📶0.2x倍率",
        "🇸🇬 新加坡（☁️TCVM）｜⚡AUTO",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜⚡AUTO",
        "🇸🇬 新加坡｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO"
    ]},
    {
      name: "谷歌｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Google.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "🇸🇬 新加坡（☁️TCVM）｜📶0.2x倍率",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜📶0.2x倍率",
        "🇸🇬 新加坡（☁️TCVM）｜⚡AUTO",
        "🇺🇸 美国-洛杉矶（☁️TCVM）｜⚡AUTO",
        "🇸🇬 新加坡｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO"
    ]},
    {
      name: "苹果｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Apple.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "DIRECT",
        "🇭🇰 香港｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO"
    ]},
    {
      name: "微软｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Microsoft.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "DIRECT",
        "🇭🇰 香港｜⚡AUTO",
        "🇺🇸 美国｜⚡AUTO"
    ]},
    {
      name: "游戏平台｜🏵️花雲",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Games.png",
      url: "http://cp.cloudflare.com/generate_204",
      type: "select",
      proxies: [
        "DIRECT",
        "🇭🇰 香港｜📶0.2x倍率"
    ]},
    { 
	    name: "🇭🇰 香港｜⚡AUTO",
	    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png",
	    url: "http://cp.cloudflare.com/generate_204",
	    type: "url-test",
	    interval: 300,
	    timeout: 3000,
	    tolerance: 15,
	    proxies: hkAutoNodes
	  },
	  { 
	    name: "🇯🇵 日本｜⚡AUTO",
	    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png",
	    url: "http://cp.cloudflare.com/generate_204",
	    type: "url-test",
	    interval: 300,
	    timeout: 3000,
	    tolerance: 15,
	    proxies: jpAutoNodes
	  },
	  { 
	    name: "🇸🇬 新加坡｜⚡AUTO",
	    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png",
	    url: "http://cp.cloudflare.com/generate_204",
	    type: "url-test",
	    interval: 300,
	    timeout: 3000,
	    tolerance: 15,
	    proxies: sgAutoNodes
	  },
	  { 
	    name: "🇺🇸 美国｜⚡AUTO",
	    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png",
	    url: "http://cp.cloudflare.com/generate_204",
	    type: "url-test",
	    interval: 300,
	    timeout: 3000,
	    tolerance: 30,
	    proxies: usAutoNodes
	  },
	  { 
	    name: "🇹🇼 台湾｜⚡AUTO",
	    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png",
	    url: "http://cp.cloudflare.com/generate_204",
	    type: "url-test",
	    interval: 300,
	    timeout: 3000,
	    tolerance: 15,
	    proxies: twAutoNodes
	  }];

  // 外部规则集
  config['rule-providers'] = {
    "lan": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/LocalAreaNetwork.yaml", path: "./rule_set/LocalAreaNetwork.yaml", interval: 86400 },
    "telegram": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Telegram.yaml", path: "./rule_set/Telegram.yaml", interval: 86400 },
    "github": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Github.yaml", path: "./rule_set/Github.yaml", interval: 86400 },
    "whatsapp": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Whatsapp.yaml", path: "./rule_set/Whatsapp.yaml", interval: 86400 },
    "discord": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Discord.yaml", path: "./rule_set/Discord.yaml", interval: 86400 },
    "twitter": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Twitter.yaml", path: "./rule_set/Twitter.yaml", interval: 86400 },
    "facebook": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Facebook.yaml", path: "./rule_set/Facebook.yaml", interval: 86400 },
    "instagram": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Instagram.yaml", path: "./rule_set/Instagram.yaml", interval: 86400 },
    "reddit": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Reddit.yaml", path: "./rule_set/Reddit.yaml", interval: 86400 },
    "twitch": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Twitch.yaml", path: "./rule_set/Twitch.yaml", interval: 86400 },
    "crypto": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Crypto.yaml", path: "./rule_set/Crypto.yaml", interval: 86400 },
    "ai": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/AI.yaml", path: "./rule_set/AI.yaml", interval: 86400 },
    "tiktok": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/TikTok.yaml", path: "./rule_set/TikTok.yaml", interval: 86400 },
    "emby": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/Rule/Emby.yaml", path: "./rule_set/Emby.yaml", interval: 86400 },
    "netflix": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Netflix.yaml", path: "./rule_set/Netflix.yaml", interval: 86400 },
    "disneyplus": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/DisneyPlus.yaml", path: "./rule_set/DisneyPlus.yaml", interval: 86400 },
    "hbo": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/HBO.yaml", path: "./rule_set/HBO.yaml", interval: 86400 },
    "steam": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Steam.yaml", path: "./rule_set/Steam.yaml", interval: 86400 },
    "epic": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Epic.yaml", path: "./rule_set/Epic.yaml", interval: 86400 },
    "xbox": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Xbox.yaml", path: "./rule_set/Xbox.yaml", interval: 86400 },
    "google": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Google.yaml", path: "./rule_set/Google.yaml", interval: 86400 },
    "apple": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Apple.yaml", path: "./rule_set/Apple.yaml", interval: 86400 },
    "microsoft": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Microsoft.yaml", path: "./rule_set/Microsoft.yaml", interval: 86400 },
    "china_domain": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaDomain.yaml", path: "./rule_set/ChinaDomain.yaml", interval: 86400 },
    "china_ip": { type: "http", behavior: "ipcidr", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaIp.yaml", path: "./rule_set/ChinaIp.yaml", interval: 86400 },
    "china_ipv6": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaIpV6.yaml", path: "./rule_set/ChinaIpV6.yaml", interval: 86400 }
  };

  // 路由规则
  config['rules'] = [
    "RULE-SET,lan,DIRECT",
    "DOMAIN,cdn.synergypeak.org,DIRECT",  // 🐷奶昔的订阅直链
    "DOMAIN,api-huacloud.net,DIRECT",  // 🏵️花雲的订阅直链
    "RULE-SET,telegram,电报｜🏵️花雲",
    "RULE-SET,github,海外媒体｜🏵️花雲",
    "RULE-SET,whatsapp,海外媒体｜🏵️花雲",
    "RULE-SET,discord,海外媒体｜🏵️花雲",
    "RULE-SET,twitter,海外媒体｜🏵️花雲",
    "RULE-SET,facebook,海外媒体｜🏵️花雲",
    "RULE-SET,instagram,海外媒体｜🏵️花雲",
    "RULE-SET,reddit,海外媒体｜🏵️花雲",
    "RULE-SET,twitch,海外媒体｜🏵️花雲",
    "RULE-SET,crypto,海外媒体｜🏵️花雲",
    "RULE-SET,ai,AI｜🏵️花雲",
    "RULE-SET,tiktok,TikTok｜🏵️花雲",
    "RULE-SET,emby,Emby｜🏵️花雲",
    "RULE-SET,netflix,海外影视｜🏵️花雲",
    "RULE-SET,disneyplus,海外影视｜🏵️花雲",
    "RULE-SET,hbo,海外影视｜🏵️花雲",
    "RULE-SET,steam,游戏平台｜🏵️花雲",
    "RULE-SET,epic,游戏平台｜🏵️花雲",
    "RULE-SET,xbox,游戏平台｜🏵️花雲",
    "RULE-SET,google,谷歌｜🏵️花雲",
    "RULE-SET,apple,苹果｜🏵️花雲",
    "RULE-SET,microsoft,微软｜🏵️花雲",
    "RULE-SET,china_domain,DIRECT",
    "RULE-SET,china_ip,DIRECT",
    "RULE-SET,china_ipv6,DIRECT",
    "GEOSITE,cn,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择｜🏵️花雲"
  ];

  return config;
}