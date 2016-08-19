;(function($){
	var vwidth=0;
	var vheight=0;
	var chaX=0;
	var chaY=0;
	var ifkeydown;
	var keytype;
	var startX;
	var startY;
	var left;
	var top;
	var oldwidth;
	var oldheight;
	$.fn.xq_catimg=function(options){
		var self=$(this);
		var src=self.attr("src");
		var width=oldwidth=self.width();
		var height=oldheight=self.height();
		var imgtop=self.offset().top;
		var imgleft=self.offset().left;
		var defaults={
			"imgwidth":500,//设置图片最大宽度  默认200px
			"imgheight":400,//设置图片最大高度  默认200px
			"showview":true,//设置图片预览区域
		}
		$.extend(defaults, options);
		init();
		function init(){
			self.parent().append('<div class="imgbag" style="width:'+defaults.imgwidth+'px;height:'+defaults.imgheight+'px"></div><div class="viewimg"></div>');
			self.appendTo("div.imgbag");
			$(".imgbag").append('<img src="'+src+'" class="clipimg" ondragstart="return false"/><div class="viewport" style="display:none"><span class="ltop"></span><span class="top"></span><span class="rtop"></span><span class="lcen"></span><span class="rcen"></span><span class="lbot"></span><span class="bot"></span><span class="rbot"></span></div>');
			if((defaults.imgwidth/width) >(defaults.imgheight/height)){
				var left=width*defaults.imgheight/height;
				$(".imgbag img").css({"height":defaults.imgheight,"margin-left":-left/2,"margin-top":-defaults.imgheight/2});
				width=self.width();
				height=self.height();
			}else{
				var top=height*defaults.imgwidth/width;
				$(".imgbag img").css({"width":defaults.imgwidth,"margin-top":-top/2,"margin-left":-defaults.imgwidth/2});
				height=self.height();
				width=self.width();
			}
//			imgtop=self.offset().top;
//			imgleft=self.offset().left;
			chaX=self.offset().left-self.parent().offset().left;//获取图片自定义后和边框之间的距离
			chaY=self.offset().top-self.parent().offset().top;//同上
			putmove(self.nextAll(".viewport"));//加入移动事件
			$(".viewport span").on("mousedown",function(e){
				startX=e.clientX;
				startY=e.clientY;
//				console.log("已按下"+$(this)[0].className);
				ifkeydown=true;
				keytype=$(this)[0].className;
				e.preventDefault();
				e.stopPropagation();
			});
		}
		self.on('mousedown',function(e){
			startX=e.clientX;
			startY=e.clientY;
			left=startX-imgleft;
			top=startY-imgtop;
			$('.imgbag .viewport').css({"display":"none"});
			$('.imgbag .clipimg').css({"display":"none"});
			$(".viewimg").css({"top":(imgtop+10)+"px","left":(imgleft+defaults.imgwidth+20)+"px","position":"fixed","display":"none","z-index":"999"});
			$(".viewimg").html('<img src="'+src+'" class="showview" ondragstart="return false"/>');
			$('.imgbag').on('mousemove',function(e){
				if (keytype) {
					return;
				}
				var flag=e.clientX>(imgleft+chaX) && e.clientY>(imgtop+chaY) && e.clientX<(imgleft+chaX+width) && e.clientY<(imgtop+chaY+height);
				if(!flag)return;
				var nwidth=e.clientX-startX;
				var nheight=e.clientY-startY;
				if(nwidth<0){
					left=startX-imgleft+nwidth;
				}
				if(nheight<0){
					top=startY-imgtop+nheight;
				}
				vwidth=Math.abs(nwidth);
				vheight=Math.abs(nheight);
				$('.imgbag .viewport').css({"display":"block"});
				$('.imgbag .clipimg').css({"display":"block"});
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				showView();
			});
		});
		function putmove($viewport){
			$viewport.on('mousedown',function(e){
				startX=e.clientX;//鼠标X轴坐标
				startY=e.clientY;//鼠标Y轴坐标
				var curX=$viewport.offset().left-$viewport.parent().offset().left;//X轴上面的偏移量
				var curY=$viewport.offset().top-$viewport.parent().offset().top;;//Y轴上面的偏移量
				vwidth=$viewport.width();
				vheight=$viewport.height();
				$("body").on('mousemove',function(e){
					if (keytype) {
						return;
					}
					var czX=e.clientX-startX+curX;
					var czY=e.clientY-startY+curY;
					var flag=true;
					if ((czX-chaX)>0 && (czX+vwidth-chaX)<width) {
						$viewport.css({"left":czX+"px"});
						left=czX;
						$viewport.prevAll(".clipimg").css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+"px)"});
					}
					if ((czY-chaY)>0 && (czY+vheight-chaY)<height) {
						$viewport.css({"top":czY+"px"});
						top=czY;
						$viewport.prevAll(".clipimg").css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+"px)"});
					}
					showView();
				});
			});
		}
		function showView(){
			var showtop=top-chaY;
			var showleft=left-chaX;
			$(".viewimg").css({"display":"block"});
			$(".showview").css({"top":-showtop+"px","left":-showleft+"px","width":width+"px","height":height+"px","position":"absolute","clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
		}
		function getCatData(){
			var bili=oldwidth/width;
			var showtop=top-chaY;
			var showleft=left-chaX;
			var newleft=showleft*bili;
			var newtop=showtop*bili;
			var newheight=vheight*bili;
			var newwidth=vwidth*bili;
			return {"top":newtop,"left":newleft,"width":newwidth,"height":newheight};
		}
		window['xq_catimg']={
			getCatData:function(){
				return getCatData();
			}
		}
		$(window).on("mousemove",function(e){
			if(!ifkeydown || !keytype){
				return;
			}
			var flag=e.clientX>(imgleft+chaX) && e.clientY>(imgtop+chaY) && e.clientX<(imgleft+chaX+width) && e.clientY<(imgtop+chaY+height);
			if(!flag)return;
			var nwidth=e.clientX-startX;
			var nheight=e.clientY-startY;
			if (keytype == "top") {
				top=top+nheight;
				vheight=vheight-nheight;
				$('.imgbag .viewport').css({"top":top+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startY=e.clientY;
			}else if (keytype == "ltop") {
				top=top+nheight;
				vheight=vheight-nheight;
				left=left+nwidth;
				vwidth=vwidth-nwidth;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startY=e.clientY;
				startX=e.clientX;
			}else if (keytype == "rtop") {
				top=top+nheight;
				vheight=vheight-nheight;
				vwidth=vwidth+nwidth;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startY=e.clientY;
				startX=e.clientX;
			}else if (keytype == "lcen") {
				left=left+nwidth;
				vwidth=vwidth-nwidth;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startX=e.clientX;
			}else if (keytype == "rcen") {
				vwidth=vwidth+nwidth;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startX=e.clientX;
			}else if (keytype == "rbot") {
				vheight=vheight+nheight;
				vwidth=vwidth+nwidth;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startY=e.clientY;
				startX=e.clientX;
			}else if (keytype == "bot") {
				vheight=vheight+nheight;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startY=e.clientY;
			}else if (keytype == "lbot") {
				vheight=vheight+nheight;
				left=left+nwidth;
				vwidth=vwidth-nwidth;
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+(top-chaY)+"px,"+(left+vwidth-chaX)+"px,"+(top+vheight-chaY)+"px,"+(left-chaX)+")"});
				startY=e.clientY;
				startX=e.clientX;
			}
			showView();
			e.preventDefault();
			e.stopPropagation();
		});
		$(window).on("mouseup",function(e){
			ifkeydown=null;
			keytype=null;
		});
		$("body").on("mouseup",function(){
			$("body").off('mousemove');
			$('.imgbag').off('mousemove');
		});
	}
})(jQuery);
