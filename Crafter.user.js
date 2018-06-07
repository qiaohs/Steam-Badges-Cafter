// ==UserScript==
// @name			Steam Auto Mass Craft Cards Badges in Bulk
// @name:zh-CN			Steam一键批量合卡合徽章
// @name:zh-TW			Steam一鍵批量合卡合徽章
// @version	 		1.1
// @description			(Steam Auto Mass Craft Trading Cards Badges in Bulk) It will automatically use up your gamecard sets for crafting badges. You can control the which card sets and how many sets to craft by using it.
// @description:zh-CN		这是一个自动合卡插件，可以指定徽章合成的数量和种类
// @description:zh-TW		這是一個自動合卡挿件，可以指定徽章合成的數量和種類
// @author			QHS
// @include			*steamcommunity.com/*/badges*
// @grant			GM_addStyle
// @grant        		GM_setValue
// @grant        		GM_getValue
// @supportURL			https://steamcn.com/t339531-1-1
// @icon			http://pan.hriq.org/steam.green.ico
// @namespace 			https://greasyfork.org/users/155548
// @namespace 			https://steamcommunity.com/profiles/76561198132556503
// ==/UserScript==
var		timer_scan = GM_getValue("timer_scan", 1000),			//扫描卡组间隔 Interval: between badges scans（ms）[500+ recommended]
    timer_craft = GM_getValue("timer_craft", 500),			//合成卡牌间隔 Interval: between crafting card sets（ms）[100+ recommended]
    sales=["245070","762800"],								//Appid for sales cards
    config_cap_level = GM_getValue("config_cap_level", 0),	//Set 1 if you want to craft all badges up to level 1 [1 - 5]
    config_blacklist = GM_getValue("config_blacklist", '');	//Set 1 if you want to craft all badges up to level 1 [1 - 5]
(function() {
    'use strict';
    GM_addStyle(`.profile_xp_block_right {
	text-align: center!important;
}

.profile_xp_block_right {
	display: block;
	width: 230px;
	border: 1px #aaa solid;
	border-radius: 4px;
	padding: 8px 0px;
	cursor: pointer;
	transition: .5s
}

.profile_xp_block_right:hover {
	color: #333;
	background: #aaa
}

.craft_list p {
	margin: 2px 10px;
}

.craft_list p input {
	width: 36px;
	height: 13px;
	background-color: #152f4a;
	border: 1px #fff solid;
	color: #fff;
	padding: 2px 0 0 10px;
	font-weight: bold;
	transition: .5s;
	background-repeat: no-repeat;
	background-position-x: -46px;
	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAPCAYAAACbSf2kAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAKUlEQVR42mOIOmPwfyhihlGHjzp81OGjDh91+KjDRx0+6vBRh486HI4BdWZJdZDgwMoAAAAASUVORK5CYII=")
}

.cannot_craft {
	-webkit-filter: grayscale(100%);
	-moz-filter: grayscale(100%);
	-ms-filter: grayscale(100%);
	-o-filter: grayscale(100%);
	filter: grayscale(100%);
	filter: gray;
	cursor: not-allowed;
}

.sum_show {
	width: 882px;
	height: 95px;
	position: relative;
	top: -115px;
	z-index: 10000001;
	padding: 10px 0;
	background: #1d1d1d;
	border-top: #383838 1px solid;
}

div.craft_list {
	padding: 10px 0 95px 0;
}

.craft_list.dischange input {
	border: 1px #827d7d solid;
	color: #827d7d;
	cursor: not-allowed;
}

p.do_not_craft {
	opacity: .5;
}

input.ready_to_craft.finished {
	background-color: #ff0909;
}

input.ready_to_craft.in_progress {
	border: 1px #ffffff solid!important;
	color: #ffffff!important;
}

#start img {
	padding-top: 0px;
}

.b_icon {
	position: absolute!important;
	padding: 12.5px!important;
	margin: 8px 0 0 3px!important;
}

.calculate {
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABz0lEQVRIS72VT0sWURTGfw8RQUQRFLSICDJqFYoRIUJBbVIiLDBU2hR+gFr1BaJN4RcIgyAoCoIoEArBCkOIXLgIWrcUAsWFUj5x4r5xe/+N8zq8ZzMzzJnnd8+d85wruhDqAoN/ENsPgf6KoD8ljdS0csh74EJFkJDZI2ktblpBVoGvHQJ7gX3AgKTP7SDx7pak6bIg2wFYAB5IelQPeQMMZ6IGbkh62gHoOnBW0u16yGEgyotrLQI0KullGZDtncBVSc//g8SD7aPAxzrQ7/TB6zKgPLfBJwkUFR3KEn8BlyXNdAJqakbbPcA8cDAT3QAuSZotC2rpeNsngQ91oHXgoqRPZUBtx0oCRUX7k+gmcEVSdOKWo3B22R4F/nYJcEfS1JbVU2JRJQeAxdRtjyXdLAtoaOFcwPYuIPb+NDAXc01StHNh2D4PTEqaaAmxHRW+AK4B35J7VwrVU4Lt8NSCpHvtIPeBu8Ay0CfpRwnAmTS7wvGvmkJsjwMxr6JdByV9KQLY3gEcS1sbCzwCnJD0vQFi+xzwDojZs50I4+6u/cP8PDkOxKr3bkc9fbsk6VRNJ4e8BYYqAITEM0ljzSBVnvFP8gOv0PFVVNYVyB+YZpcaJQ8FswAAAABJRU5ErkJggg==")!important
}

.lightning {
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABf0lEQVRIS72VIWhWURiGn0cYw6DJsSAGDQY3mLApmEQMYjEoa7I4DBbzytLi2oLZOgYWwxARxKSCmBa2YFAWDAtzDIa848Ad/Pxs3vP//9WvXe45z3O+7zvfvfIfwlEcSc4D59Tff+OMKtkA5tU//0SSZLkRTLVVY6hMkjwCXgMb6pPOJUluAJ+B0o8VdalTSZIJ4AtwpQEvqK86kyQZAz4Ct3qgt9VPXUrKiZ/2AS+o+51IkrwAVvtgP9XLbYLyvvV2JbkHvC1D1wd8p94fWZLkOlBqfrECtqk+OG3dmZkkKeCvwNUKwXfgprpXLUlSSlNKVErVFkfAnPrtrIWtPTnZmGQS2D0F9Ex92cm3K8ld4H0fbF2db0t1kEwWgd4TbwGz6kGXkjInZV5KFPCMut0mqJqTnp68AR42z+Ufsl4jGFSyA1wD1tTntYJqSZJx4LD5At9Ry7WtjqrGJ5kGPgDT6o9qerOwVvIY2Fc3BxUMUq5L6q9hBNWSYeEn+44BNWp1Gt9slgsAAAAASUVORK5CYII=")!important
}

span.slightning {
	background: -webkit-linear-gradient( top, #e9b50e 5%, #5f2f05 95%)!important;
	linear-gradient( to bottom, #e9b50e 5%, #5f2f05 95%)!important; margin-left: 30px!important;
}

span.scalculate {
	background: -webkit-linear-gradient( top, #778088 5%, #414a52 95%)!important;
	background: linear-gradient( to bottom, #778088 5%, #414a52 95%)!important;
	margin-left: 30px!important;
}

.rapid {
	background: #d8a506!important;
	background: -webkit-linear-gradient( top, #f3d608 5%, #902100 95%)!important;
	background: linear-gradient( to bottom, #f3d608 5%, #902100 95%)!important;
}

.btn_large {
	float: left;
	margin-top: 28px;
	margin-left: 28px;
}

.rapid:hover {
	background: #d8a506!important;
	background: -webkit-linear-gradient( top, #fbe440 5%, #eb5224 95%)!important;
	background: linear-gradient( to bottom,#fbe440 5%, #eb5224 95%)!important;
}

.setting {
	float: left;
	margin-left: 28px;
	padding: 17.5px;
	margin-top: 31px;
	cursor: pointer;
	border: transparent solid 1px;
	border-radius: 5px;
}

.setting:hover {
	border: #fff solid 1px;
}

p.setting_title {
	font-size: 26px;
	color: #fff;
	border-bottom: 1px solid #fff;
	margin-bottom: 60px;
	padding-bottom: 10px;
}

font.config_name {
	color: #fff;
	font-weight: bold;
}

input.property {
	background: #ffffff;
	width: 55px;
	height: 19px;
	margin: 0 7px;
	border: 2px solid #0fa9f3;
	border-radius: 5px;
}

._setting {
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAADo0lEQVRYR9VXTYgcVRCur3t6VMSDxAQRUYhE8CBqJFGwd7brzR40EDyp69mD5EcjwYPmEFFBvYj4k+jZg2SjB+PBvez2653tgy5oQAXRgKCHiNHgQUTtmX4lb6GX2XFev55klfGdhqmvqr6uV1WvCjRFB1PEhf5/ZLTWLQAHRORZEdkB4B1mPuyKapqmJ4jocQAXALwsIm8z88B3C97IZFm2X0ReJaJdI8bOhGF4oNPp/Fj9r7W+kYhOEtH+Eey5MAznO53O53WEaslkWTYjIr0aAwMR+YyI/iSiqwDsJqLWOLyI/A7gfmbOXfZqyaRpugDgYV94J5C/z8xOez4yJwAcnMBZLVRETiqlDl1SZLTWVvGtrSJDRIeZ2Sb32FMbGa31U0T02rSQOU1ED20hmQVmnp84Mnme31QUxbcArnAo/yEii0EQfCIiXwO4zRhzL4AHbGU5dAZRFN0Sx/EP4+RjrynP82v6/f4KEd3lKNM1Y8y+ubm5i6PypaWlbUEQvAtgn4PQ2SiKZuM4/m1UvonMysrK7WVZ7gHwzJgmV+mebbVa3ZmZmV9d4RaRQGvdA3CfA3NORF4BsMbMX1WYDTJpmj4P4HhdfojIX+12e2ccx+d9eZTn+Q1FUXxXc83rJkTkBaXUc/b3MJlfAGzzODnFzI/6iFRyrfUpInrEg/+ZmXdsIqO1NsPkHAZq+8SoTsM+JcwcbJCxd5xlWdngi+eZeaEBbh2itbZRsdGpPUmShADM8DUNAISenDmilHrDZ7ySp2n6JIDXPTaNUmrd7wYZrfUFItruUTytlPLlwIYJrbW3aYrIRaXUdaMJ3LSabnU1reEPadA0q2p6USm1XsX/6DPGmL0icgzATkeUsiRJuvaOXVFcXV29djAYpER05ziMiNiSfykIgrXZ2dkvK4yzAxdFsQrgDofDM2VZPubqwGEYLhLRHgeRL9rtduztwMPKy8vLNwP4pu5tIqKPAXxavU0icg8R2WfA9Tb1jTG7ut3u9+OI+oar9wA0bnINquwDZnZOAT4yBwE4h6EGzjdBABxNksQ5H/2nZIjoCWZ2To4+MtMzA/8L28Gl54zdm4wxiwCuduTH8N50JYC7XXuT1ReRRCllh7axx7tR9nq93WVZ2sdudKP8MIqiQ8OzjZ1h+v2+3SgfHPFmh6mnlVIf1SW9l4xVrnZtY4ydAK+364tS6ojLsNb6TRGxlfjTlu7ak5bv5eAbReZyHEyiO1Vk/gblu5QzQCE85wAAAABJRU5ErkJggg==")!important;
}

._save {
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAACF0lEQVRYR+2YvWsUURTFz133Dwj4AabRKigoWikWy+65pbUgWGgpAQXRQiwURRstTCNqISmChWht++4sC2ksLRRtUkUw8T/YzZU3zMKa7HwtIWsxU86cc+Y39913ZxjBf3RIZOn3+2dHo9EDAIsA1lR1NYRwEcDzqqwi8o3ksruLmdmEb1VV16rkpDBm9hXAmczwjOTDEMJlEflcJSTTfCF5wd1bSZKMdvmekHxclpXChBC2ReRwAcxpkt/N7BOAKzmhRTBw93uq+rIIqBJMq9Va6na7P83sA4Crs8BETxnQgcJkD7FM8u20B5oHjAO4TvL9bqB5wMTlig1+TVU/TgJVgnH3NyLyO+uXU7P2zKTP3XdE5CbJd+PzlWDKtmSFrZ0bISKPer3e0yjIhakIsEeWM2fK4m6TfLUHxt3jBL5R5s67bmZHAGzV9G+RPDYNJq7letZkNTNT+UkROVHTuE3y6LRlqpmzL/IGJq+MTWWaytTdYtN7xt3/AHgtIjt1E2voF9z9logcyjy5MC9U9X6N4JmkZrYO4FIhDID0G9jMIv25me5UYFLVfrwcQkhEpFsVphe/1fcbhuR46jcw/xS3qUxerzWVaSpTdw6V9oyZbQI4ngWPJ/BBDr1fJBfHv0RWANyZF4y7r6jq3RQmHoPBYGk4HMafRRskN+K7CcD5ustQpieZRI2ZxeyFdru92el0fsRzfwGhD/czvOdCcQAAAABJRU5ErkJggg==")
}

.attention {
	display: inline-block;
	width: 200px;
	height: 200px;
	background: url("data:image/png;base64,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");
}

font.appid {
	border: 1px solid;
	padding: 2px 7px;
	border-radius: 8px;
	margin: 2px 3px;
	display: inline-block;
	text-decoration: line-through;
}

textarea.property {
	background: #ffffff;
	width: 730px;
	height: 30px;
	margin: 0 7px;
	border: 2px solid #0fa9f3;
	border-radius: 9px;
}

.sum_show {
	text-align: center;
}

.newmodal_buttons {
	display: inline-block;
	position: relative;
	left: -14px;
}

.newmodal_buttons {
	display: inline-block;
}

._confirms,.sconfirm {
	background: linear-gradient( to bottom, #00ea54 5%, #004c06 95%)!important;
}

.ss {
	margin-left: 30px!important;
}

._confirms:hover {
	background: linear-gradient( to bottom, #42ff86 5%, #00ce10 95%)!important;
}

span.b_icon._confirm {
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABJElEQVRIS+3VMUrGQBCG4fdDrS3s7CxsPIAINjZiYSVYC4IX8ByCeAL5Gwu10MZerOwsvIeIjVh9EthATDbJhIRUplx259mZ2d2IGT7NYPCPDKryZOWyvQO8Sfqp72ASxPY+8AS8AgeSvqvQaKQCrKTAJfRVQqMQ24fAA1ACZdyFpNPRSAIegeVaD96BPUkfnYjtDeBY0kXuGA0BivWNctneBJ6BdeBK0nkVsn0E3EUyyGZiewt4AdYqga+BM0lOwD2w1Fei1tNl+xL4s/M0+SY1+HYo0CiX7aJ8C+AkeKUbTc6ty/UkCoWAbOOLwUBGYaAV6YEGAZ1ICzQY6EVq0DawW73JwcMR+zOmHq1K+owGnvQVjqCjXuEIEOpJNFDXvFky+QVQUmwaHSx3ggAAAABJRU5ErkJggg==")!important;
}

._cancels, .scancel {
	background: linear-gradient( to bottom, #ff6a00 5%, #a70000 95%)!important;
}

._cancels:hover {
	background: linear-gradient( to bottom, #fd9a54 5%, #ff1010 95%)!important;
}

span.b_icon._cancel {
	background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAB8klEQVRIS5WWS2tUQRBGz4f4ICgqOMnCwddG1JUrNzEGMZg4e3f+Pn+ACL7wjeDORQwExI1kERGUIEHHRUkN3WN7p293z93d21V9blVXfdWi85jZaeCrpD/dtdq7mR0EFiXtpLZKX8xsFXgEbAErkn7WNo7rZnYUeA1cBtYlvYxrU4iZrQEPgMNh8T1wU9J+DRQAz4BrwfZ3CppAAuAh4OGmz1vgdgmUAUT/KUhmNgA8h11ANHbQmqRfmfPzFKURdE3c57xDjgGbwJlCWp4DoxRkZguAf48pyrk/Bu7EdHlFvWsAbUgaB4BvsNzyY+nBO8ir40LB0Te+C/j5NQF8r24JL4WISqAfwInCj8yc4X+QUGkOegVcrJVuZj1bjTOQADoFeDNdmQPUW+5ZSACdBN40gor91AsJoHPAJ+BAISJvuqGkb302pUiOAy+Aqw0pmz+SROxaAKkyZCUoV101qSgFVq+uRqmoZa+/Txql4jNwD7jfIEFTrYvadQR4WpGKbeCGpN0wPVu0bgJyFfbyfOIDqpAHByynZRpALVo3cojLyJfCPPkIrOb6IPiWJMh76GxtMjrguqTvfVGaWZ8E/ZuM0Tkzgj+EGd8LSHy7EjQ74zMgB9yStFer1w7IJ+Wl3ttKYjwM965xKyDxPQQMuveuvyh740KkKGZ2AAAAAElFTkSuQmCC")!important;
}`);
    var _border, g_sessionID, badge_cap_level, __appID, _gappid,blacklist=[];
    var text = {},
        lan = $J('head').html().match(/l=([^"&*]+)"/)[1];
    if (lan == "schinese" || lan == "tchinese") {
        text.start = "批量合成徽章";
        text.title = "批量合卡";
        text.notice = '<p>这是一个自动合卡插件，可以指定徽章合成的数量和种类。请自行承担操作不当带来的风险</p><p>可在<a class="underlinedLink" href="https://steamcn.com/t339531-1-1" target="_blank">SteamCN</a>、<a class="underlinedLink" href="https://github.com/qiaohs/Steam-Auto-Mass-Craft-Cards-Badges-in-Bulk" target="_blank">Github</a>、<a class="underlinedLink" href="https://greasyfork.org/en/scripts/36393" target="_blank">Greasy Fork</a>反馈问题，也可以在我的<a class="underlinedLink" href="https://steamcommunity.com/profiles/76561198132556503" target="_blank">资料页</a>下方留言（ASF经常吞消息可能看不到私聊0.0）</p></p>可以随时关闭本标签页来停止插件的自动操作</p><p><b style=color:#fff>计算模式:</b> 先扫描出每个徽章的可合成次数，扫描完毕后可以手动调整合成数量，再通过确认进行批量合卡。</p><p><b style=color:#fff>极速模式:</b> 先显示您的黑名单设置，确认后将直接合成所有可以用来合成的徽章，<font style=color:#fff>不会使用黑名单中的游戏卡牌</font>。</p><p><a class="underlinedLink" href="http://pan.hriq.org/steam_crafter_1.gif" target="_blank">示例GIF1</a>　<a class="underlinedLink" href="http://pan.hriq.org/steam_crafter_3.gif" target="_blank">示例GIF2</a></p>';
        text.button1 = "开始统计本页可合成卡组(计算模式)";
        text.buttonr1 = "不管那么多了，跳过扫描直接合卡！(极速模式)";
        text.button2 = "确认无误后开始合卡";
        text.button2no = "不合卡的吗？";
        text.calculating = "计算中(输入想要合成的次数，计算过程中可以关闭本弹出窗口)";
        text.calculated = "请在每个徽章前输入想要合成的次数，并确认合成";
        text.crafting = "合成中，合成过程中可以关闭本弹出窗口";
        text.crafted = "合成完毕";
        text.list1 = '←输入合成套数';
        text.list2 = '可升';
        text.list3 = '级 (当前';
        text.list4 = '级) 游戏:';
        text.nosets1 = '<p style=" font-size: 25px; ">想合卡？先去市场买来再说吧！</p>';
        text.nosets2 = '这是一个悲伤地故事';
        text.nosets3 = '虽<br>然<br>没<br>有<br>卡<br>，<br>也<br>要<br>假<br>装<br>扫<br>描<br>出<br>了<br>很<br>多';
        text.setting_title = '设置（下面三个按钮都能保存）';
        text.cap_level = '最高等级';
        text.cap_level_d = '(<font style=color:#fff>仅针对计算模式有效！</font>默认为0。例如设置为3：默认将小于3的徽章合成至3级。若设置0则无任何合成限制)';
        text.timer_scan = '扫描时间';
        text.timer_scan_d = '(仅针对计算模式有效，计算中扫描每个徽章页面的时间间隔(单位毫秒)，默认为1000，请不要设置的过小)';
        text.timer_craft = '合成时间间隔';
        text.timer_craft_d = '(仅针对计算模式有效，计算过后合成徽章的时间间隔(单位毫秒)，默认为500，请不要设置的过小)';
        text.blacklist = '黑名单';
        text.blacklist_d = '(将游戏的APPID填入，用逗号分隔，则该游戏的普通/闪亮徽章在任何模式下都不会合成。写法形如 <i style="color: #e0f170;">550,322310,730</i>)';
        text.attention_title = '注意!</font><br>确认过后将进行合成，如果需要停止请关闭本标签页. ';
        text.attention_title2 = '您并没有设置黑名单，所以所有可合成徽章都将进行合成)';
        text.attention_title3 = '除了这些在你黑名单中的游戏: ';
        text.confirm = '确认';
        text.cancel = '取消';
    } else {
        text.start = "Craft Badges in Bulk";
        text.title = "Craft Badges in Bulk";
        text.notice = '<p><a class="underlinedLink" href="https://steamcn.com/t339531-1-1" target="_blank">SteamCN</a>、<a class="underlinedLink" href="https://github.com/qiaohs/Steam-Auto-Mass-Craft-Cards-Badges-in-Bulk" target="_blank">Github</a>、<a class="underlinedLink" href="https://greasyfork.org/en/scripts/36393" target="_blank">Greasy Fork</a> or comment on <a class="underlinedLink" href="https://steamcommunity.com/profiles/76561198132556503" target="_blank">Steam profile</a>(I always miss the chat message as getting command through chat by asf) for feedback.</p><p>Close this WEBPAGE when you want to stop crafting!</p><p>You can set intervals and blacklist badges in setting.</p><p><b style=color:#fff>Calculation mode:</b> Scan and calculate max badges you can craft first and you can regulating the number of card sets for specified bagdes. Then craft.</p><p><b style=color:#fff>Rapidly mode:</b> Show you the setting of blacklist. Crafting immediately after you confirm it. It will use up ALL your available gamecard sets for crafting badges <font style=color:#fff>except</font> the games whose APPID is in the blacklist.</p><p><a class="underlinedLink" href="http://pan.hriq.org/steam_crafter_1.gif" target="_blank">Demo1</a>　<a class="underlinedLink" href="http://pan.hriq.org/steam_crafter_3.gif" target="_blank">Demo2</a></p>';
        text.button1 = "Calculate how many badges you can craft in this page before craft";
        text.buttonr1 = "Craft <b>now</b> rapidly!";
        text.button2 = "Start Crafting!";
        text.button2no = "No Cards for Crafting!";
        text.calculating = "Calculating, you can close this pop-up window in the process of calculation";
        text.calculated = "Enter the times you want to craft for the badges. Confirm and craft them by click the green button below";
        text.crafting = "Crafting! You can close this pop-up window in the process of crafting";
        text.crafted = "Finished!";
        text.list1 = 'sets to craft';
        text.list2 = 'can craft';
        text.list3 = 'more (Level';
        text.list4 = 'now) GAME:';
        text.nosets1 = '<p style=" font-size: 25px; ">No sets to craft qwq</p>';
        text.nosets2 = 'So sad';
        text.nosets3 = 'T<br>h<br>e<br>r<br>e<br> <br>i<br>s<br> <br>n<br>o<br> <br>r<br>e<br>s<br>u<br>l<br>t<br>!';
        text.setting_title = 'Setting (Click the button below to save it)';
        text.cap_level = 'Cap Level';
        text.cap_level_d = '(<font style=color:#fff>Only for calculation mode!</font> Number type with default value of 0. Set to 3 if you want to craft all badges up to level 3 [also can be 1,2,4,5]. There is no level limit if set to 0.)';
        text.timer_scan = 'Scan Timer';
        text.timer_scan_d = '(The interval between badges when calculating. number type with default value of 1000(ms). Unless you have a reason to edit this property, you should keep it at default.)';
        text.timer_craft = 'Craft Timer';
        text.timer_craft_d = '(The interval between cards sets crafting. number type with default value of 500(ms). Unless you have a reason to edit this property, you should keep it at default. Only for calculation mode.)';
        text.blacklist_d = '(The cards whose APPID is in the blacklist will not being used for crafting in any mode. Separated by commas, like <i style="color: #e0f170;">550,322310,730</i>)';
        text.attention_title = 'Attention!</font><br>Please confirm that you are going to use up ALL your available gamecard sets for crafting badges. ';
        text.attention_title2 = 'As there is no APPID in your blacklist(you can add some in setting)';
        text.attention_title3 = 'Except the games whose APPID is in the blacklist: ';
        text.confirm = 'Confirm';
        text.cancel = 'Cancel';
        text.blacklist = 'Blacklist';
    }

    $J('body').prepend(`
<div class="craft_background" style="opacity: 0.5;position: fixed; width: 100%; height: 100%;background:#000;cursor:pointer;z-index: 999;display:none;"></div>
<div class="craft_window" style="position: fixed; z-index: 1000;height: 90%; width: 900px; left: 50%; margin-left:-450px; top: 20px;display:none;">
	<div class="newmodal_header_border">
		<div class="newmodal_header">
			<div class="newmodal_close"></div>
			<div class="ellipsis window_title">${text.title}</div>
		</div>
	</div>
	<div class="newmodal_content_border" style="background: #1d1d1d;height: 90%; overflow-y:auto;">
		<div class="newmodal_content" style="color: #c4c6c7;">
			<div class="craft_title" style="  font-size:16px;padding:10px 0">${text.notice}</div>
			<div class="setting_list" style="display:none;font-size: 17px;">
				<p class="setting_title">${text.setting_title}</p>
				<p><font class="config_name">${text.cap_level} = </font>
					<input class="property config_cap_level" value="${config_cap_level}" type="number" max="5" min="0">${text.cap_level_d}</p>
				<p><font class="config_name">${text.timer_scan} = </font>
					<input step="100" class="property timer_scan" value="${timer_scan}" type="number" min="500">${text.timer_scan_d}</p>
				<p><font class="config_name">${text.timer_craft} = </font>
					<input step="100" value="${timer_craft}" type="number" min="200" class="property timer_craft">${text.timer_craft_d}</p>
				<p><font class="config_name" style=" position: relative; top: -10px; ">${text.blacklist}: </font>
					<textarea class="property config_blacklist">${config_blacklist}</textarea>
					<br>${text.blacklist_d}</p>
			</div>
			<div class="attention_list" style="padding-bottom: 120px;font-size: 17px; display: none;">
				<div style=" text-align: center; "><span class="attention"></span>
					<br><span style=" width: 600px; display: inline-block; "><font style="font-size:20px;color:#fff;font-weight:bold;margin: 20px 0;display: inline-block;">${text.attention_title}<br><font class="attention_nbl">${text.attention_title2}</font><font class="attention_bl">${text.attention_title3}<font id="appid"></font></font></span>
				</div>
			</div>
			<div class="craft_list" style="  font-size:16px"></div>
		</div>
	</div>
	<div class="sum_show">
		<div class="newmodal_buttons start_1 button_s1" style="text-align:center;" id="start">
			<div class="btn_grey_white_innerfade btn_large btn_large1" style="float: left;margin-left: 28px;"><span class="b_icon calculate"></span><span class="scalculate">${text.button1}</span>
			</div>
			<div class="btn_grey_white_innerfade btn_large rapid _rapid" style="float: left;margin-left: 28px;"><span class="b_icon lightning"></span><span class="slightning">${text.buttonr1}</span>
			</div>
			<div class="setting _setting"></div>
		</div>
		<div class="newmodal_buttons confirm" style="display:none;">
			<div class="btn_grey_white_innerfade btn_large _confirms" style="float: left;margin-left: 28px;"><span class="b_icon _confirm"></span><span class="ss sconfirm">${text.confirm}</span>
			</div>
			<div class="btn_grey_white_innerfade btn_large _cancels" style="float: left;margin-left: 28px;"><span class="b_icon _cancel"></span><span class="scancel ss">${text.cancel}</span>
			</div>
		</div>
	</div>
</div>
`);

    for (var i = 0; i < 20; i++) {
        setTimeout(function() {
            $J('.profile_xp_block_right').html(text.start);
            $J('.es_faq_cards').hide();
        },
                   i * 500);
    } //hide the content that is not necessary
    function craft() {
        _save();

        $J('.window_title').html(text.calculating);
        $J('.craft_title').slideUp();
        $J('#start').html('<img style="padding-top: 30px;" src="https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif">');
        var total_number = $J('a.badge_craft_button').length,
            each_count = 0,
            sum_sets = 0,
            sum_badges = 0;
        if (total_number === 0) {
            $J('#start').html(text.nosets1);
            $J('.window_title').html(text.nosets2);
            $J('.craft_list').append("<p>" + text.nosets3 + "</p>");
            $J('#start').addClass('start_2').removeClass('start_1');
            $J('.craft_list').append("<p style='text-align:center;margin-top: 15px; letter-spacing: 8px;'>=========END=========</p>");
        }

        $J('a.badge_craft_button').each(function(i) { ///if(i>1){return false;}//a.badge_craft_button//a.badge_row_overlay
            var badge_link = $J(this).attr('href'),
                badge_level = 0,
                count_min = 99999;
            setTimeout(function() {
                $J.get(badge_link,
                       function(html) {
                    if (i === 0) {
                        g_sessionID = html.match(/g_sessionID = "([^"]+)"/)[1];
                    }
                    var gamename = $J(html).find('.badge_title').text();
                    var _badge = $J(html).find('.badge_current .badge_info_description>div:eq(1)');

                    $J(html).find('.badge_detail_tasks>.badge_card_set_card').each(function() {
                        var count = $J(this).find('.badge_card_set_text_qty').text();
                        if (count) {
                            count = parseInt(count.replace(/[()]/g, ''));
                            if (count < count_min) {
                                count_min = count;
                            }
                        } else {
                            count_min = 0;
                        }
                    });

                    if (_badge.length) {
                        badge_level = parseInt(_badge.text().match(/\d+/));
                    }
                    var _appid = badge_link.match(/\/([0-9]{1,7})\/$/);
                    var _appid2 = badge_link.match(/\/([0-9]{1,7})\/\?border=1$/);
                    if (!_appid) {
                        _border = 1;
                        __appID = _appid2[1];
                        _gappid = __appID + "b1";
                        if ($J.inArray(__appID, sales) >= 0) {
                            badge_cap_level = config_cap_level == 0 ? 99999 : config_cap_level;
                        } else {
                            badge_cap_level = 1;
                        }
                    } else {
                        _border = 0;
                        __appID = _appid[1];
                        _gappid = __appID + "b0";
                        if ($J.inArray(__appID, sales) >= 0) {
                            badge_cap_level = config_cap_level == 0 ? 99999 : config_cap_level;
                        } else {
                            badge_cap_level = config_cap_level == 0 ? 5 : config_cap_level;
                        }
                    }
                    if($J.inArray(__appID*1, blacklist) >= 0){count_min=0;}//blacklist.include(__appID)
                    var upgrade_sets = Math.min(count_min, Math.max((badge_cap_level - badge_level),0)); ///Math.min(count_min, (badge_cap_level - badge_level));//2;
                    $J('.craft_list').append("<p><input class='ready_to_craft' type='number' value=" + upgrade_sets + " data-appid=" + __appID + " data-border=" + _border + " data-gappid=" + _gappid + " max=" + upgrade_sets + " min='0'> " + text.list1 + " APPID:" + __appID + " " + text.list2 + " " + upgrade_sets + " " + text.list3 + " " + badge_level + " " + text.list4 + " " + gamename + "</p>");
                    sum_sets += upgrade_sets;
                    sum_badges += 1;

                    if (i == (total_number - 1)) { ///2-1
                        $J('#start').html('<div class="btn_grey_white_innerfade btn_large btn_large1" style="margin-top:0"><span>' + text.button2 + '</span></div>');
                        $J('.window_title').html(text.calculated);
                        $J('#start').addClass('start_2').removeClass('start_1');
                        $J('#start>div').addClass('btn_green_white_innerfade').removeClass('btn_grey_white_innerfade');
                        $J('#start').before('<p class="before_c" style="margin: 4px 0 15px 0;text-align: center; font-size: 18px; color: #fff;"><font class="sum_sets" style="font-size: 22px;">' + sum_sets + '</font> sets(<font class="sum_badges" style="font-size: 22px;">' + sum_badges + '</font> badges) to craft!</p>');
                        $J('.craft_list').append("<p style='text-align:center;margin-top: 15px; letter-spacing: 8px;'>=========END=========</p>");
                    }

                });

            },
                       i * timer_scan);
        });
    }

    function craft_do() {
        var queue = [],
            finished_count = {},
            all_count = {},
            sum_crafted = 0,
            sum_sets = 0;
        $J('.ready_to_craft').attr("disabled", true);
        $J('.craft_list').addClass("dischange");

        $J('.ready_to_craft').each(function() {
            if ($J(this).val() > $J(this).attr("max")) {
                $J(this).val($J(this).attr("max"));
            }
            if ($J(this).val() > 0) {
                sum_sets += parseInt($J(this).val());
            }
        });

        $J('#start').html('<img src="https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif">');
        $J('.window_title').html(text.crafting);
        $J('.before_c').html('Success: <font class="sum_crafted" style="font-size: 22px;">0</font> <font class="sum_xp" style="font-size: 20px;color: #ffc902;"></font>');
        $J('.ready_to_craft').each(function() {
            if ($J(this).val() > 0) {
                for (var i = 0; i < $J(this).val(); i++) {
                    queue.push({
                        "border": $J(this).data("border"),
                        "appid": $J(this).data("appid"),
                        "times": $J(this).val()
                    });
                }
            }
        });
        $J.each(queue,
                function(i) {
            setTimeout(function() {
                var border = queue[i].border,
                    appid = queue[i].appid,
                    para = appid + "b" + border;
                $J.ajax({
                    type: 'post',
                    url: g_strProfileURL + '/ajaxcraftbadge',
                    data: {
                        sessionid: g_sessionID,
                        series: 1,
                        border_color: border,
                        appid: appid
                    },
                    timeout: 8000,

                    complete: function(XMLHttpRequest, status) {
                        if (i == (queue.length - 1)) {
                            $J('#start').html('<font style=" font-size: 25px; position: relative; top: 0; ">' + text.crafted + '</font>');
                            $J('.window_title').html(text.crafted);
                        }
                        if (all_count[para]) {
                            all_count[para]++;
                        } else {
                            all_count[para] = 1;
                        }
                        if (all_count[para] == 1) {
                            $J('input.ready_to_craft[data-gappid="' + para + '"]').addClass('in_progress');
                        }
                        if (all_count[para] == queue[i].times) {
                            $J('input.ready_to_craft[data-gappid="' + para + '"]').addClass('finished');
                        }
                    },

                    success: function(data) {
                        if (data.success == 1) {
                            sum_crafted += 1;
                            $J('.sum_crafted').text(sum_crafted);
                            $J('.sum_percent').text(GetPercent(sum_crafted, sum_sets));
                            $J('.sum_xp').text('+' + (sum_crafted * 100) + 'XP');
                            if (finished_count[para]) {
                                finished_count[para]++;
                            } else {
                                finished_count[para] = 1;
                            }
                            $J('input.ready_to_craft[data-gappid="' + para + '"]').css('background-position-x', 46 * (finished_count[para] / queue[i].times - 1));
                        }
                    }

                });
            },
                       timer_craft * i);
        });

    }

    function update_sum_sets() {
        var sum_badges = 0,
            sum_sets = 0;
        $J('input.ready_to_craft').each(function(i) {
            if ($J(this).val() > 0) {
                sum_sets += parseInt($J(this).val());
                sum_badges += 1;
                if ($J(this).parent().hasClass('do_not_craft')) {
                    $J(this).parent().removeClass('do_not_craft');
                }
            } else {
                $J(this).parent().addClass('do_not_craft');
            }
            $J('font.sum_badges').html(sum_badges);
            $J('font.sum_sets').html(sum_sets);
        });
        if (sum_badges === 0) {
            $J('#start>div').addClass('cannot_craft');
            $J('#start span').html(text.button2no);
        }
        if (sum_badges !== 0) {
            $J('#start>div').removeClass('cannot_craft');
            $J('#start span').html(text.button2);
        }
    }

    $J('body').on('click', '.newmodal_close',
                  function() {
        _close();
    });
    $J('body').on('click', '.craft_background',
                  function() {
        _close();
    });
    $J('body').on('click', '.profile_xp_block_right',
                  function() {
        _open();
    });
    $J('body').on('click', '.start_1 div.btn_large1',
                  function() {
        _save();
        craft();
    });
    $J('body').on('click', '.start_2 div.btn_large1',
                  function() {
        craft_do();
    });
    $J('body').on('click', '._setting',
                  function() {
        _setting();
    });
    $J('body').on('click', '._save',
                  function() {
        _save();
    });
    $J('body').on('click', '._rapid',
                  function() {
        _rapid();
    });
    $J('body').on('click', '._confirms',
                  function() {
        _rapid_do();
    });
    $J('body').on('click', '._cancels',
                  function() {
        $J('.craft_title').slideDown();
        $J('.attention_list').slideUp();
        $J('.button_s1').slideDown();
        $J('.confirm').slideUp();
    });
    $J('body').on('change', '.ready_to_craft',
                  function() {
        update_sum_sets();
    });

    function _rapid() {
        _save();
        $J('.craft_title').slideUp();
        $J('.attention_list').slideDown();
        $J('.button_s1').slideUp();
        $J('.confirm').slideDown();
        $J("#appid").html('');
        if(blacklist.length<1){
            $J('.attention_bl').hide();
            $J('.attention_nbl').show();
        }else{
            blacklist.each(function(e,i){
                $J('.attention_bl').show();
                $J('.attention_nbl').hide();
                $J("#appid").append('<font class="appid">'+e+'</font>');
            });
        }
    }
    function _rapid_do() {
        $J('.window_title').html(text.crafting);
        $J('.attention_list').slideUp();
        $J('.confirm').html('<img src="https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif">');
        var total_number = $J('a.badge_craft_button').length,
            each_count = 0,
            sum_sets = 0,
            sum_badges = 0;
        if (total_number === 0) {
            $J('.confirm').html(text.nosets1);
            $J('.window_title').html(text.nosets2);
            $J('.craft_list').append("<p>" + text.nosets3 + "</p>");
            $J('.craft_list').append("<p style='text-align:center;margin-top: 15px; letter-spacing: 8px;'>=========END=========</p>");
        }

        window.queue_r=[];
        $J('a.badge_craft_button').each(function(i) {
            var badge_link = $J(this).attr('href');
            if (i === 0) {
                g_sessionID = $J(":root").html().match(/g_sessionID = "([^"]+)"/)[1];
            }
            var _appid = badge_link.match(/\/([0-9]{1,7})\/$/);
            var _appid2 = badge_link.match(/\/([0-9]{1,7})\/\?border=1$/);
            if (!_appid) {
                _border = 1;
                __appID = _appid2[1];
                _gappid = __appID + " <font style='color:#fff'>Foil</font> ";
                if ($J.inArray(__appID, sales) >= 0) {
                    badge_cap_level = 99999;
                } else {
                    badge_cap_level = 1;
                }
            } else {
                _border = 0;
                __appID = _appid[1];
                _gappid = __appID + "";
                if ($J.inArray(__appID, sales) >= 0) {
                    badge_cap_level = 99999;
                } else {
                    badge_cap_level = 5;
                }
            }
            if($J.inArray(__appID*1,blacklist)<0&&badge_cap_level>0){queue_r.push({appid:__appID,border:_border,gappid:_gappid,badge_cap_level:badge_cap_level*1});}//blacklist.include(__appID)
        });
        $J('#start').before('<p class="before_c" style="margin: 4px 0 15px 0;text-align: center; font-size: 18px; color: #fff;">Crafted: <font class="sum_crafted" style="font-size: 22px;">0</font> sets <font class="sum_xp" style="font-size: 20px;color: #ffc902;"></font></p>');
        rapid_post();
    }
    var sum_crafted_r=0;
    function rapid_post(){
        if(queue_r.length<1){
            $J('.confirm').html('<font style=" font-size: 25px; position: relative; top: 0; ">' + text.crafted + '</font>');
            $J('.window_title').html(text.crafted);return;}
        if(queue_r[0].badge_cap_level>0){queue_r[0].badge_cap_level--;}else{queue_r.splice(0,1);rapid_post();return;}
        var border = queue_r[0].border,
            appid = queue_r[0].appid,
            gappid = queue_r[0].gappid;
        $J.ajax({
            type: 'post',
            url: g_strProfileURL + '/ajaxcraftbadge',
            data: {
                sessionid: g_sessionID,
                series: 1,
                border_color: border,
                appid: appid
            },
            timeout: 8000,

            complete: function(XMLHttpRequest, status) {
                setTimeout(function(){rapid_post();},timer_craft*0);
            },

            success: function(data) {
                if (data.success == 1) {
                    sum_crafted_r += 1;
                    $J('.sum_crafted').text(sum_crafted_r);
                    $J('.sum_xp').text('+' + (sum_crafted_r * 100) + 'XP');
                    if($J('font[data-app='+appid+']').length>0){
                        $J('font[data-app='+appid+']').html($J('font[data-app='+appid+']').html()*1+1)
                    }else{
                        $J('.craft_list').append("Crafted <font style='color:#fff'data-app='"+appid+"'>1</font> sets for "+gappid+" badge<br>");
                    }


                }else{queue_r.splice(0,1);}
            }
        });

    }

    function _close() {
        $J('.craft_background').fadeOut();
        $J('.craft_window').slideUp();
    }
    function _open() {
        $J('.craft_background').fadeIn();
        $J('.craft_window').slideDown();
    }
    function _setting() {
        $J('.setting').removeClass("_setting").addClass('_save');
        $J('.craft_title').slideUp();
        $J('.setting_list').slideDown();
    }
    function _save() {
        $J('.setting').removeClass("_save").addClass('_setting');
        $J('.setting_list').slideUp();
        $J('.craft_title').slideDown();
        GM_setValue("config_cap_level", $J("input.config_cap_level").val());
        GM_setValue("timer_scan", $J("input.timer_scan").val());
        GM_setValue("timer_craft", $J("input.timer_craft").val());
        GM_setValue("config_blacklist", $J("textarea.config_blacklist").val());
        config_cap_level=$J("input.config_cap_level").val();
        timer_scan=$J("input.timer_scan").val();
        timer_craft=$J("input.timer_craft").val();
        config_blacklist=$J("textarea.config_blacklist").val();
        blacklist = eval('['+config_blacklist.replace(/[^0-9,]/,'')+']');
    }

    function GetPercent(num, total) {
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
            return "-";
        }
        return total <= 0 ? "0%": (Math.round(num / total * 10000) / 100.00 + "%");
    }

})();
