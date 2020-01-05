# Steam Badges Cafter

Close Steam badges WEBPAGE when you want to stop crafting!
Now you can set intervals and blacklist badges in setting.
[Guide on Steam](https://steamcommunity.com/sharedfiles/filedetails/?id=1409472832)

Istall([check this link if it's your first time using this kind of userscript](https://greasyfork.org/help/installing-user-scripts))
---
1. Install [Tampermonkey](http://tampermonkey.net/) first. (available for Chrome, Edge, Safari, Firefox, Opera Next, Dolphin[Android], UC[Android]).
2. Click [here](https://greasyfork.org/scripts/36393-steam-auto-mass-craft-cards-badges-in-bulk/code/Steam%20Auto%20Mass%20Craft%20Cards%20Badges%20in%20Bulk.user.js) and install the script by clicking the green button.
3. You can use the Steam badges crafter script at [badges page](https://steamcommunity.com/my/badges) by clicking the button on right side.

2 Crafting modes
---
* **Calculated mode:** Scan and calculate max badges you can craft first and you can regulating the number of card sets for specified bagdes. Then craft.
* **Rapidly mode:** ~~Show you the setting of blacklist. Crafting immediately after you confirm it. It will use up ALL your available gamecard sets for crafting badges except the games whose APPID is in the blacklist.~~【#NOTE 2020：This function is deprecated since Steam introducing the native bulk craft API. Please calculate first.】
* **Steam level calculator**

# 一键批量合卡合徽章

听说土豪合卡要一个小时？

这是一个自动合卡插件(在[这个链接](https://steamcommunity.com/my/badges)下使用)，可以指定徽章合成的数量和种类。

我知道只有你们这些土豪才会需要这种插件，求神壕们包养qwq
可以随时关闭徽章标签页来停止插件的自动操作
[Steam指南](https://steamcommunity.com/sharedfiles/filedetails/?id=1409472832)

安装与使用方法([新手可以先参考本站的指南](https://greasyfork.org/help/installing-user-scripts))
---
1. 安装[Tampermonkey](http://tampermonkey.net/)(available for Chrome, Edge, Safari, Firefox, Opera Next, Dolphin[Android], UC[Android])
2. 安装本脚本（点击上面的“安装此脚本”）后在弹出页面点击安装。或者打开[此链接](https://greasyfork.org/scripts/36393-steam-auto-mass-craft-cards-badges-in-bulk/code/Steam%20Auto%20Mass%20Craft%20Cards%20Badges%20in%20Bulk.user.js)后在弹出页面点击绿色按钮安装。
3. 登陆Steam后打开[徽章页面](https://steamcommunity.com/my/badges)，点击等级右侧的批量合成按钮

2020年取消极速模式，计算模式使用Steam最新批量合成接口
---
* **新API:** 一次请求即可合成多级，不再一级一级合成（没内味儿了😂），故取消了极速这种瞎子模式

2018年新增极速模式和黑名单功能
---
* **计算模式:** 先扫描出每个徽章的可合成次数，扫描完毕后可以手动调整合成数量，再通过确认进行批量合卡；
* **极速模式:** 先显示您的黑名单设置，确认后将直接合成所有可以用来合成的徽章，不会使用黑名单中的游戏卡牌；
* **游戏黑名单:** 输入游戏的APPID，则默认不会合成这些游戏的徽章(用逗号分隔)；
* **等级计算器:** Steam等级与经验以及目标等级的各种转换；
* **跨页扫描/合成:** 之前只能扫描/合成第一页，所以每次最多合成/升级前150个徽章。现在已经没有此限制了，不过依然可于设置中自定义最大页数。（壕们可以一次性地准确估计准备了多少卡牌/徽章/等级了；
* **STM换卡集卡提示:** 对于不是整套购买的卡牌（需要STM换卡的），扫描后会提示已凑卡牌套数与STM换卡后能增加合成的套数。形如(3+2.0)指3套完整卡牌+换卡后可凑出2套卡牌，其中当前等级+完整卡牌数小于可合成等级(普卡5闪卡1)为红色，大于等于可合成等级为黄色。

常见问题
---
* **合成/扫描过程中卡住，需要重新登录:** 通常为Steam服务器抽风(只遇到一次掉线 具体原因不明)，可以尝试：①增加设置中的时间间隔②更换IP或host；
* **合成的数量结果与预期/显示的不符:** 一般来说，预期数量(扫描后的可合成数量) 稍大于 实际合成数量 大于 插件显示的已合成数。若数量过大就会存在上述误差，实际合成数量与其他两数的差距原因：①发出合卡请求，网络等原因导致未合成，导致未能达到预期数量（发生概率极小）；②发出合卡请求，服务器端成功合成，但由于网络问题返回了错误的(空)数据，导致插件显示的已合成数小于实际合成数量（概率约1%）。对于徽章等级有特殊要求的大佬一定要在使用后核实一下实际合成数量，不过请放心这个数量不会超出要求的/预期的数量。

Demo
---
![Rapid mode demo](https://raw.githubusercontent.com/qiaohs/Steam-Badges-Cafter/master/res/steam_crafter_7.gif)
![Calculation mode demo](https://raw.githubusercontent.com/qiaohs/Steam-Badges-Cafter/master/res/steam_crafter_5.gif)
