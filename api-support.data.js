/* 小栗子虚拟机 · API 兼容数据
 * 该文件由「API 支持情况编辑器」导出，请勿手工修改。
 * 更新接口支持情况：打开 tools/api_editor.py 编辑后导出即可。
 * 导出时间：2026-09-14 23:18
 */
window.XLZ_API_SUPPORT = {
  "version": "1.0.0",
  "updatedAt": "2026-09-14",
  "source": "小栗子虚拟机.apifox.json",
  "statusTypes": [
    {
      "id": "full",
      "name": "完全支持",
      "color": "#22c55e",
      "level": 3,
      "short": "完全"
    },
    {
      "id": "partial",
      "name": "部分支持",
      "color": "#f59e0b",
      "level": 2,
      "short": "部分"
    },
    {
      "id": "none",
      "name": "不支持",
      "color": "#ef4444",
      "level": 1,
      "short": "不支持"
    },
    {
      "id": "unknown",
      "name": "未测试",
      "color": "#94a3b8",
      "level": 0,
      "short": "未测"
    }
  ],
  "frameworks": [
    {
      "id": "mengchen",
      "name": "萌尘",
      "short": "萌尘",
      "color": "#7c5cff",
      "note": "萌尘框架（WebSocket 对接）"
    },
    {
      "id": "dulu",
      "name": "Dulu",
      "short": "Dulu",
      "color": "#3dd6ff",
      "note": "Dulu 框架（WebSocket 对接）"
    },
    {
      "id": "onebot11",
      "name": "OneBot V11",
      "short": "OB11",
      "color": "#22c55e",
      "note": "OneBot V11 标准"
    }
  ],
  "categories": [
    "账号与框架",
    "消息发送",
    "群管理",
    "好友与资料",
    "媒体与文件",
    "高级能力"
  ],
  "apis": [
    {
      "id": "api-1",
      "type": 1,
      "name": "取框架QQ",
      "category": "账号与框架",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 1,
          "common": true
        }
      ],
      "paramsText": "type",
      "bodyExample": {
        "type": 1
      },
      "bodyText": "{\n  \"type\": 1\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"QQlist\\\":{\\\"3557471082\\\":{\\\"昵称\\\":\\\"小铃\\\",\\\"登录状态\\\":\\\"登录完毕\\\",\\\"等级信息\\\":\\\"NoVIP| 13| 223|2.0| 29\\\",\\\"收发信息\\\":\\\"11分47秒 收:0,发:0,速:0条/min\\\",\\\"登录IP\\\":\\\"58.19.85.37[本地登录]\\\",\\\"登录协议\\\":\\\"鸿蒙HD\\\",\\\"腾讯服务器\\\":\\\"111.206.149.168:80[所在地代码:tj]\\\"}}}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-2",
      "type": 2,
      "name": "发送好友消息",
      "category": "消息发送",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 2,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": true,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "msg_content",
          "type": "string",
          "required": true,
          "description": "发送内容",
          "example": "消息内容",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、msg_content",
      "bodyExample": {
        "type": 2,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "msg_content": "消息内容"
      },
      "bodyText": "{\n  \"type\": 2,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"msg_content\": \"消息内容\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"retcode\\\":0,\\\"retmsg\\\":\\\"\\\",\\\"time\\\":\\\"1696500021\\\"}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-3",
      "type": 3,
      "name": "发送群聊消息",
      "category": "消息发送",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 3,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": true,
          "description": "群号",
          "example": "936632212",
          "common": false
        },
        {
          "name": "msg_content",
          "type": "string",
          "required": true,
          "description": "发送内容",
          "example": "test",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、msg_content",
      "bodyExample": {
        "type": 3,
        "myUin": "109895862",
        "hisUin": "936632212",
        "msg_content": "test"
      },
      "bodyText": "{\n  \"type\": 3,\n  \"myUin\": \"109895862\",\n  \"hisUin\": \"936632212\",\n  \"msg_content\": \"test\"\n}",
      "responseExample": "",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-4",
      "type": 4,
      "name": "取群列表",
      "category": "账号与框架",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 4,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        }
      ],
      "paramsText": "type、myUin",
      "bodyExample": {
        "type": 4,
        "myUin": "3557471082"
      },
      "bodyText": "{\n  \"type\": 4,\n  \"myUin\": \"3557471082\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-5",
      "type": 5,
      "name": "上传好友图片",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 5,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "picPath",
          "type": "string",
          "required": false,
          "description": "图片",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、picPath",
      "bodyExample": {
        "type": 5,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "picPath": ""
      },
      "bodyText": "{\n  \"type\": 5,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"picPath\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-6",
      "type": 6,
      "name": "上传群图片",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 6,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "picPath",
          "type": "string",
          "required": false,
          "description": "图片",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、picPath",
      "bodyExample": {
        "type": 6,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "picPath": ""
      },
      "bodyText": "{\n  \"type\": 6,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"picPath\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-7",
      "type": 7,
      "name": "群聊打卡",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 7,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin",
      "bodyExample": {
        "type": 7,
        "myUin": "3557471082",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 7,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-8",
      "type": 8,
      "name": "分享音乐",
      "category": "消息发送",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 8,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "songName",
          "type": "string",
          "required": false,
          "description": "歌曲名",
          "example": "",
          "common": false
        },
        {
          "name": "singerName",
          "type": "string",
          "required": false,
          "description": "歌手名",
          "example": "",
          "common": false
        },
        {
          "name": "musicLink_jump",
          "type": "string",
          "required": false,
          "description": "音乐跳转地址",
          "example": "",
          "common": false
        },
        {
          "name": "musicLink_pic",
          "type": "string",
          "required": false,
          "description": "音乐封面地址",
          "example": "",
          "common": false
        },
        {
          "name": "musicLink_file",
          "type": "string",
          "required": false,
          "description": "音乐文件地址",
          "example": "",
          "common": false
        },
        {
          "name": "appType",
          "type": "integer",
          "required": false,
          "description": "下标文字，0QQ音乐 1虾米音乐 2酷我音乐 3酷狗音乐 4网易云音乐",
          "example": 0,
          "common": false
        },
        {
          "name": "sendType",
          "type": "integer",
          "required": false,
          "description": "0私聊 1群聊 2讨论组",
          "example": 1,
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、songName、singerName、musicLink_jump、musicLink_pic、musicLink_file、appType、sendType",
      "bodyExample": {
        "type": 8,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "songName": "",
        "singerName": "",
        "musicLink_jump": "",
        "musicLink_pic": "",
        "musicLink_file": "",
        "appType": 0,
        "sendType": 1
      },
      "bodyText": "{\n  \"type\": 8,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"songName\": \"\",\n  \"singerName\": \"\",\n  \"musicLink_jump\": \"\",\n  \"musicLink_pic\": \"\",\n  \"musicLink_file\": \"\",\n  \"appType\": 0,\n  \"sendType\": 1\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-9",
      "type": 9,
      "name": "取好友文件下载地址",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 9,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "fileId",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        },
        {
          "name": "fileName",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、fileId、fileName",
      "bodyExample": {
        "type": 9,
        "myUin": "3557471082",
        "fileId": "",
        "fileName": ""
      },
      "bodyText": "{\n  \"type\": 9,\n  \"myUin\": \"3557471082\",\n  \"fileId\": \"\",\n  \"fileName\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-10",
      "type": 10,
      "name": "撤回消息_群聊",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 10,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "fromRandom",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        },
        {
          "name": "fromReq",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、fromRandom、fromReq",
      "bodyExample": {
        "type": 10,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "fromRandom": "",
        "fromReq": ""
      },
      "bodyText": "{\n  \"type\": 10,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"fromRandom\": \"\",\n  \"fromReq\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-11",
      "type": 11,
      "name": "禁言群成员",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 11,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "GroupUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "",
          "common": false
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "被禁言QQ",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "time",
          "type": "string",
          "required": false,
          "description": "禁言时间秒 0解除禁言",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、GroupUin、hisUin、time",
      "bodyExample": {
        "type": 11,
        "myUin": "3557471082",
        "GroupUin": "",
        "hisUin": "3553142133",
        "time": ""
      },
      "bodyText": "{\n  \"type\": 11,\n  \"myUin\": \"3557471082\",\n  \"GroupUin\": \"\",\n  \"hisUin\": \"3553142133\",\n  \"time\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-12",
      "type": 12,
      "name": "删除群成员",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 12,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "GroupUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "",
          "common": false
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "被禁言QQ",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "isRefuseNext",
          "type": "string",
          "required": false,
          "description": "拒绝加群申请 真或假",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、GroupUin、hisUin、isRefuseNext",
      "bodyExample": {
        "type": 12,
        "myUin": "3557471082",
        "GroupUin": "",
        "hisUin": "3553142133",
        "isRefuseNext": ""
      },
      "bodyText": "{\n  \"type\": 12,\n  \"myUin\": \"3557471082\",\n  \"GroupUin\": \"\",\n  \"hisUin\": \"3553142133\",\n  \"isRefuseNext\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-13",
      "type": 13,
      "name": "上传群文件_废弃",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": true,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 13,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "loaclPath",
          "type": "string",
          "required": false,
          "description": "本地文件路径",
          "example": "",
          "common": false
        },
        {
          "name": "parentFolderId",
          "type": "string",
          "required": false,
          "description": "群文件夹ID",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、loaclPath、parentFolderId",
      "bodyExample": {
        "type": 13,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "loaclPath": "",
        "parentFolderId": ""
      },
      "bodyText": "{\n  \"type\": 13,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"loaclPath\": \"\",\n  \"parentFolderId\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-14",
      "type": 14,
      "name": "处理好友验证事件",
      "category": "好友与资料",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 14,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "fromSeq",
          "type": "string",
          "required": false,
          "description": "fromSeq",
          "example": "",
          "common": false
        },
        {
          "name": "op",
          "type": "string",
          "required": false,
          "description": "1同意 2拒绝",
          "example": "1",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、fromSeq、op",
      "bodyExample": {
        "type": 14,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "fromSeq": "",
        "op": "1"
      },
      "bodyText": "{\n  \"type\": 14,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"fromSeq\": \"\",\n  \"op\": \"1\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-15",
      "type": 15,
      "name": "处理群验证事件",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 15,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "fromUin",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        },
        {
          "name": "fromSeq",
          "type": "string",
          "required": false,
          "description": "fromSeq",
          "example": "",
          "common": false
        },
        {
          "name": "op",
          "type": "string",
          "required": false,
          "description": "1同意 2拒绝",
          "example": "1",
          "common": false
        },
        {
          "name": "fromType",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        },
        {
          "name": "reasonForRefusal",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、fromUin、fromSeq、op、fromType、reasonForRefusal",
      "bodyExample": {
        "type": 15,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "fromUin": "",
        "fromSeq": "",
        "op": "1",
        "fromType": "",
        "reasonForRefusal": ""
      },
      "bodyText": "{\n  \"type\": 15,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"fromUin\": \"\",\n  \"fromSeq\": \"\",\n  \"op\": \"1\",\n  \"fromType\": \"\",\n  \"reasonForRefusal\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-16",
      "type": 16,
      "name": "取管理层列表",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 16,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin",
      "bodyExample": {
        "type": 16,
        "myUin": "3557471082",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 16,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-17",
      "type": 17,
      "name": "取图片下载地址",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 17,
          "common": true
        },
        {
          "name": "picText",
          "type": "string",
          "required": false,
          "description": "",
          "example": "",
          "common": false
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、picText、myUin、hisUin",
      "bodyExample": {
        "type": 17,
        "picText": "",
        "myUin": "3557471082",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 17,\n  \"picText\": \"\",\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-18",
      "type": 18,
      "name": "强制取昵称",
      "category": "好友与资料",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 18,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin",
      "bodyExample": {
        "type": 18,
        "myUin": "3557471082",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 18,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-19",
      "type": 19,
      "name": "全群禁言",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 19,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "好友QQ",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "state",
          "type": "string",
          "required": false,
          "description": "真或假",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、state",
      "bodyExample": {
        "type": 19,
        "myUin": "3557471082",
        "hisUin": "3553142133",
        "state": ""
      },
      "bodyText": "{\n  \"type\": 19,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\",\n  \"state\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-20",
      "type": 20,
      "name": "取群成员列表",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 20,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin",
      "bodyExample": {
        "type": 20,
        "myUin": "3557471082",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 20,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-21",
      "type": 21,
      "name": "QQ点赞",
      "category": "好友与资料",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 21,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin",
      "bodyExample": {
        "type": 21,
        "myUin": "3557471082",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 21,\n  \"myUin\": \"3557471082\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-22",
      "type": 22,
      "name": "取群名片",
      "category": "好友与资料",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 22,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "GroupUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "929315476",
          "common": false
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群成员",
          "example": "3553142133",
          "common": false
        }
      ],
      "paramsText": "type、myUin、GroupUin、hisUin",
      "bodyExample": {
        "type": 22,
        "myUin": "109895862",
        "GroupUin": "929315476",
        "hisUin": "3553142133"
      },
      "bodyText": "{\n  \"type\": 22,\n  \"myUin\": \"109895862\",\n  \"GroupUin\": \"929315476\",\n  \"hisUin\": \"3553142133\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-23",
      "type": 23,
      "name": "提取图片文字",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 23,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "3557471082",
          "common": true
        },
        {
          "name": "picText",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、picText",
      "bodyExample": {
        "type": 23,
        "myUin": "3557471082",
        "picText": ""
      },
      "bodyText": "{\n  \"type\": 23,\n  \"myUin\": \"3557471082\",\n  \"picText\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-24",
      "type": 24,
      "name": "取昵称_从缓存",
      "category": "好友与资料",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 24,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": true,
          "description": "对方QQ",
          "example": "936632212",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin",
      "bodyExample": {
        "type": 24,
        "myUin": "109895862",
        "hisUin": "936632212"
      },
      "bodyText": "{\n  \"type\": 24,\n  \"myUin\": \"109895862\",\n  \"hisUin\": \"936632212\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-25",
      "type": 25,
      "name": "发送群临时消息",
      "category": "消息发送",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 25,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "groupUin",
          "type": "string",
          "required": true,
          "description": "群号",
          "example": "936632212",
          "common": false
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": true,
          "description": "对方QQ",
          "example": "936632212",
          "common": false
        },
        {
          "name": "msg_content",
          "type": "string",
          "required": true,
          "description": "发送内容",
          "example": "test",
          "common": false
        }
      ],
      "paramsText": "type、myUin、groupUin、hisUin、msg_content",
      "bodyExample": {
        "type": 25,
        "myUin": "109895862",
        "groupUin": "936632212",
        "hisUin": "936632212",
        "msg_content": "test"
      },
      "bodyText": "{\n  \"type\": 25,\n  \"myUin\": \"109895862\",\n  \"groupUin\": \"936632212\",\n  \"hisUin\": \"936632212\",\n  \"msg_content\": \"test\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-26",
      "type": 26,
      "name": "发送群Json消息",
      "category": "消息发送",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 26,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": true,
          "description": "群号",
          "example": "936632212",
          "common": false
        },
        {
          "name": "msg_content",
          "type": "string",
          "required": true,
          "description": "发送内容",
          "example": "{}",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、msg_content",
      "bodyExample": {
        "type": 26,
        "myUin": "109895862",
        "hisUin": "936632212",
        "msg_content": "{}"
      },
      "bodyText": "{\n  \"type\": 26,\n  \"myUin\": \"109895862\",\n  \"hisUin\": \"936632212\",\n  \"msg_content\": \"{}\"\n}",
      "responseExample": "",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-27",
      "type": 27,
      "name": "上传语音_通用",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 27,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "record",
          "type": "string",
          "required": true,
          "description": "发送内容",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、record",
      "bodyExample": {
        "type": 27,
        "myUin": "109895862",
        "record": ""
      },
      "bodyText": "{\n  \"type\": 27,\n  \"myUin\": \"109895862\",\n  \"record\": \"\"\n}",
      "responseExample": "",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-28",
      "type": 28,
      "name": "上传群文件",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 28,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": true,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": true,
          "description": "群号",
          "example": "936632212",
          "common": false
        },
        {
          "name": "file",
          "type": "string",
          "required": true,
          "description": "发送内容",
          "example": "{}",
          "common": false
        },
        {
          "name": "name",
          "type": "string",
          "required": false,
          "description": "",
          "example": "文件名",
          "common": false
        },
        {
          "name": "folder_id",
          "type": "string",
          "required": false,
          "description": "",
          "example": "上传目录",
          "common": false
        }
      ],
      "paramsText": "type、myUin、hisUin、file、name、folder_id",
      "bodyExample": {
        "type": 28,
        "myUin": "109895862",
        "hisUin": "936632212",
        "file": "{}",
        "name": "文件名",
        "folder_id": "上传目录"
      },
      "bodyText": "{\n  \"type\": 28,\n  \"myUin\": \"109895862\",\n  \"hisUin\": \"936632212\",\n  \"file\": \"{}\",\n  \"name\": \"文件名\",\n  \"folder_id\": \"上传目录\"\n}",
      "responseExample": "",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-29",
      "type": 29,
      "name": "设置群名片",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 29,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "GroupUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "929315476",
          "common": false
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群成员",
          "example": "3553142133",
          "common": false
        },
        {
          "name": "newCard",
          "type": "string",
          "required": false,
          "description": "",
          "example": "测试",
          "common": false
        }
      ],
      "paramsText": "type、myUin、GroupUin、hisUin、newCard",
      "bodyExample": {
        "type": 29,
        "myUin": "109895862",
        "GroupUin": "929315476",
        "hisUin": "3553142133",
        "newCard": "测试"
      },
      "bodyText": "{\n  \"type\": 29,\n  \"myUin\": \"109895862\",\n  \"GroupUin\": \"929315476\",\n  \"hisUin\": \"3553142133\",\n  \"newCard\": \"测试\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-30",
      "type": 30,
      "name": "调用指定OneBot接口",
      "category": "高级能力",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 30,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "data",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "{}",
          "common": false
        },
        {
          "name": "noWait",
          "type": "string",
          "required": false,
          "description": "群成员",
          "example": "false",
          "common": false
        }
      ],
      "paramsText": "type、myUin、data、noWait",
      "bodyExample": {
        "type": 30,
        "myUin": "109895862",
        "data": "{}",
        "noWait": "false"
      },
      "bodyText": "{\n  \"type\": 30,\n  \"myUin\": \"109895862\",\n  \"data\": \"{}\",\n  \"noWait\": \"false\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-31",
      "type": 31,
      "name": "取群成员信息",
      "category": "群管理",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 31,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        },
        {
          "name": "GroupUin",
          "type": "string",
          "required": false,
          "description": "群号",
          "example": "",
          "common": false
        },
        {
          "name": "hisUin",
          "type": "string",
          "required": false,
          "description": "群成员",
          "example": "",
          "common": false
        }
      ],
      "paramsText": "type、myUin、GroupUin、hisUin",
      "bodyExample": {
        "type": 31,
        "myUin": "109895862",
        "GroupUin": "",
        "hisUin": ""
      },
      "bodyText": "{\n  \"type\": 31,\n  \"myUin\": \"109895862\",\n  \"GroupUin\": \"\",\n  \"hisUin\": \"\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-32",
      "type": 32,
      "name": "创建网络文件路径",
      "category": "媒体与文件",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 32,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        }
      ],
      "paramsText": "type、myUin",
      "bodyExample": {
        "type": 32,
        "myUin": "109895862"
      },
      "bodyText": "{\n  \"type\": 32,\n  \"myUin\": \"109895862\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    },
    {
      "id": "api-33",
      "type": 33,
      "name": "取当前OneBot客户端类型",
      "category": "高级能力",
      "method": "POST",
      "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "",
      "deprecated": false,
      "params": [
        {
          "name": "type",
          "type": "integer",
          "required": true,
          "description": "接口类型",
          "example": 33,
          "common": true
        },
        {
          "name": "myUin",
          "type": "string",
          "required": false,
          "description": "框架QQ",
          "example": "109895862",
          "common": true
        }
      ],
      "paramsText": "type、myUin",
      "bodyExample": {
        "type": 33,
        "myUin": "109895862"
      },
      "bodyText": "{\n  \"type\": 33,\n  \"myUin\": \"109895862\"\n}",
      "responseExample": "{\n    \"status\": 101,\n    \"data\": \"{\\\"list\\\":[{\\\"GroupUin\\\":\\\"596934495\\\",\\\"strGroupName\\\":\\\"光萌生产线\\\",\\\"dwMemberNum\\\":\\\"858\\\"},{\\\"GroupUin\\\":\\\"783901119\\\",\\\"strGroupName\\\":\\\"小铃铛、小叮噹·MadeSpa\\\",\\\"dwMemberNum\\\":\\\"3\\\"}]}\"\n}",
      "note": "",
      "support": {
        "mengchen": "full",
        "dulu": "full",
        "onebot11": "full"
      }
    }
  ]
};
