function main(config) {
  const proxies = config.proxies || [];
  
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
        'ntp.*.com'
      ],
      'default-nameserver': [
        '223.5.5.5',
        '119.29.29.29'
      ],
      'nameserver': [
        'https://doh.pub/dns-query',
        'https://dns.alidns.com/dns-query'
      ],
      'fallback': [
        'tls://1.1.1.1',
        'tls://8.8.4.4'
      ],
	  'proxy-server-nameserver': [
        'https://doh.pub/dns-query'，
        'https://dns.alidns.com/dns-query'
      ],
	  'direct-nameserver': [
	    'system'，
        'https://doh.pub/dns-query'，
        'https://dns.alidns.com/dns-query'
      ],
	  'direct-nameserver-follow-policy': false,
      'fallback-filter': {
        'geoip': true,
        'geoip-code': 'CN',
        'geosite': [
          'gfw'
        ],
        'ipcidr': [
          '240.0.0.0/4'
        ],
        'domain': [
          '+.google.com',
          '+.facebook.com',
          '+.youtube.com',
          '+.twitter.com',
          '+.telegram.org'
        ]
      }
    }
  });
  
  // Emoji旗帜列表
  const emojiMap = {
    "阿联酋|阿拉伯联合酋长国": "🇦🇪", "阿根廷": "🇦🇷", "奥地利": "🇦🇹", "澳大利亚|澳洲": "🇦🇺", "孟加拉": "🇧🇩", "比利时": "🇧🇪", "保加利亚": "🇧🇬", "巴林": "🇧🇭", "文莱": "🇧🇳", "巴西": "🇧🇷", "白俄罗斯": "🇧🇾", "加拿大": "🇨🇦", "瑞士": "🇨🇭", "智利": "🇨🇱", "中国": "🇨🇳", "捷克": "🇨🇿", "德国": "🇩🇪", "丹麦": "🇩🇰", "爱沙尼亚": "🇪🇪", "埃及": "🇪🇬", "西班牙": "🇪🇸", "欧盟|欧洲": "🇪🇺", "芬兰": "🇫🇮", "法国": "🇫🇷", "英国": "🇬🇧", "格陵兰": "🇬🇱", "希腊": "🇬🇷", "香港": "🇭🇰", "克罗地亚": "🇭🇷", "匈牙利": "🇭🇺", "印尼|印度尼西亚": "🇮🇩", "爱尔兰": "🇮🇪", "以色列": "🇮🇱", "印度": "🇮🇳", "冰岛": "🇮🇸", "意大利": "🇮🇹", "日本": "🇯🇵", "韩国": "🇰🇷", "立陶宛": "🇱🇹", "卢森堡": "🇱🇺", "拉脱维亚": "🇱🇻", "利比亚": "🇱🇾", "摩洛哥": "🇲🇦", "摩纳哥": "🇲🇨", "摩尔多瓦": "🇲🇩", "黑山": "🇲🇪", "澳门": "🇲🇴", "墨西哥": "🇲🇽", "马来西亚": "🇲🇾", "尼日利亚": "🇳🇬", "荷兰": "🇳🇱", "挪威": "🇳🇴", "新西兰": "🇳🇿", "巴基斯坦": "🇵🇰", "波兰": "🇵🇱", "葡萄牙": "🇵🇹", "罗马尼亚": "🇷🇴", "塞尔维亚": "🇷🇸", "俄罗斯": "🇷🇺", "沙特阿拉伯": "🇸🇦", "瑞典": "🇸🇪", "新加坡": "🇸🇬", "斯洛伐克": "🇸🇰", "泰国": "🇹🇭", "土耳其": "🇹🇷", "台湾": "🇹🇼", "乌克兰": "🇺🇦", "美国": "🇺🇸", "越南": "🇻🇳", "南非": "🇿🇦"
  };
  
  // 遍历节点
  proxies.forEach(proxy => {
    let name = proxy.name;
    
    // 清除原来的Emoji旗帜
    name = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g, "");
    name = name.trim();

    // 节点重命名
    name = name.replace(/HK/i, "香港");
    name = name.replace(/TW/i, "台湾");
    name = name.replace(/MO/i, "澳门");
    name = name.replace(/JP/i, "日本");
    name = name.replace(/KR/i, "韩国");
    name = name.replace(/SG/i, "新加坡");
    name = name.replace(/US/i, "美国");
    name = name.replace(/UK|GB/i, "英国");
    name = name.replace(/FR/i, "法国");
    name = name.replace(/DE/i, "德国");
    name = name.replace(/NL/i, "荷兰");
    name = name.replace(/CA/i, "加拿大");
    name = name.replace(/AU/i, "澳大利亚");

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
  const getNodes = (regexStr) => {
    const regex = new RegExp(regexStr, 'i');
    return updatedProxyNames.filter(name => regex.test(name));
  };
  const hkNodes = getNodes("香港");
  const jpNodes = getNodes("日本");
  const sgNodes = getNodes("新加坡");
  const usNodes = getNodes("美国");
  const otherNodes = updatedProxyNames.filter(name => !/香港|日本|新加坡|美国/i.test(name));

  // 策略组
  config['proxy-groups'] = [
    {
      name: "节点选择",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/NetworkProxy/Airport.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...hkNodes, ...jpNodes, ...sgNodes, ...usNodes, ...otherNodes]
    },
    {
      name: "电报",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Telegram.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...hkNodes, ...jpNodes]
    },
    {
      name: "海外影视",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/GlobalMedia.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...sgNodes, ...usNodes]
    },
    {
      name: "海外社交平台",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/SocialContact.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...sgNodes, ...usNodes]
    },
    {
      name: "TikTok",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/TikTok.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...jpNodes, ...sgNodes]
    },
    {
      name: "AI",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/AI.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...sgNodes, ...usNodes]
    },
    {
      name: "游戏平台",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Games.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: ["DIRECT", ...hkNodes]
    },
    {
      name: "谷歌",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Google.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...sgNodes, ...usNodes]
    },
    {
      name: "苹果",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Apple.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: ["DIRECT", ...hkNodes, ...usNodes]
    },
    {
      name: "微软",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Microsoft.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: ["DIRECT", ...hkNodes, ...usNodes]
    },
    {
      name: "币圈",
      icon: "https://raw.githubusercontent.com/JovLing/NetworkTools/net/icon/Media/Crypto.png",
      url: "http://cp.cloudflare.com",
      type: "select",
      proxies: [...sgNodes, ...usNodes]
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
    "netflix": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Netflix.yaml", path: "./rule_set/Netflix.yaml", interval: 86400 },
    "disneyplus": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/DisneyPlus.yaml", path: "./rule_set/DisneyPlus.yaml", interval: 86400 },
    "hbo": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/HBO.yaml", path: "./rule_set/HBO.yaml", interval: 86400 },
    "crypto": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Crypto.yaml", path: "./rule_set/Crypto.yaml", interval: 86400 },
    "china_domain": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaDomain.yaml", path: "./rule_set/ChinaDomain.yaml", interval: 86400 },
    "china_ip": { type: "http", behavior: "ipcidr", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaIp.yaml", path: "./rule_set/ChinaIp.yaml", interval: 86400 },
    "china_ipv6": { type: "http", behavior: "classical", url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaIpV6.yaml", path: "./rule_set/ChinaIpV6.yaml", interval: 86400 }
  };

  // 路由规则
  config['rules'] = [
    "RULE-SET,localhost,DIRECT",
    "RULE-SET,telegram,电报",
    "RULE-SET,whatsapp,海外社交平台",
    "RULE-SET,discord,海外社交平台",
    "RULE-SET,twitter,海外社交平台",
    "RULE-SET,facebook,海外社交平台",
    "RULE-SET,instagram,海外社交平台",
    "RULE-SET,reddit,海外社交平台",
    "RULE-SET,twitch,海外社交平台",
    "RULE-SET,ai,AI",
    "RULE-SET,tiktok,TikTok",
    "RULE-SET,google,谷歌",
    "RULE-SET,apple,苹果",
    "RULE-SET,microsoft,微软",
    "RULE-SET,steam,游戏平台",
    "RULE-SET,epic,游戏平台",
    "RULE-SET,xbox,游戏平台",
    "RULE-SET,netflix,海外影视",
    "RULE-SET,disneyplus,海外影视",
    "RULE-SET,hbo,海外影视",
    "RULE-SET,crypto,币圈",
    "RULE-SET,china_domain,DIRECT",
    "RULE-SET,china_ip,DIRECT",
    "RULE-SET,china_ipv6,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ];

  return config;
}
