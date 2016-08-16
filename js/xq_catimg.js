;(function($){
	var vwidth=0;
	var vheight=0;
	$.fn.xq_catimg=function(options){
		var self=$(this);
		var src=self.attr("src");
		var width=self.width();
		var height=self.height();
		var imgtop=self.offset().top;
		var imgleft=self.offset().left;
		var defaults={
			
		}
		$.extend(defaults, options);
		self.parent().append('<div class="imgbag"></div>');
		self.appendTo("div.imgbag");
		$(".imgbag").append('<img src="'+src+'" class="clipimg" ondragstart="return false"/><div class="viewport"><span class="ltop"></span><span class="top"></span><span class="rtop"></span><span class="lcen"></span><span class="rcen"></span><span class="lbot"></span><span class="bot"></span><span class="rbot"></span></div>');
		putmove(self.nextAll(".viewport"));
		self.on('mousedown',function(e){
			var startX=e.clientX;
			var startY=e.clientY;
			var left=startX-imgleft;
			var top=startY-imgtop;
			$('.imgbag').on('mousemove',function(e){
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
				$('.imgbag .viewport').css({"top":top+"px","left":left+"px","width":vwidth+"px","height":vheight+"px"});
				$('.imgbag .clipimg').css({"clip":"rect("+top+"px,"+(left+vwidth)+"px,"+(top+vheight)+"px,"+left+")"});
			});
		});
		function putmove($viewport){
			var startX;
			var startY;
			$viewport.on('mousedown',function(e){
				startX=e.clientX;//鼠标X轴坐标
				startY=e.clientY;//鼠标Y轴坐标
				var curX=$viewport.offset().left-$viewport.parent().offset().left;//X轴上面的偏移量
				var curY=$viewport.offset().top-$viewport.parent().offset().top;;//Y轴上面的偏移量
				vwidth=$viewport.width();
				vheight=$viewport.height();
				$("body").on('mousemove',function(e){	
					var czX=e.clientX-startX+curX;
					var czY=e.clientY-startY+curY;
					$viewport.css({"left":czX+"px","top":czY+"px"});
					$viewport.prevAll(".clipimg").css({"clip":"rect("+czY+"px,"+(czX+vwidth)+"px,"+(czY+vheight)+"px,"+czX+"px)"});
//					console.log(curX+"鼠标移动"+e.clientX+"Y轴"+e.clientY);
				});
			});
		}
		$("body").on("mouseup",function(){
			$("body").off('mousemove');
			$('.imgbag').off('mousemove');
		});
	}
})(jQuery);
$(".niceimg").xq_catimg();
