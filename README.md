# xq_catimg
构建一个简单易用的图片裁剪插件

#一.技术点
1、onmousedown当鼠标按下，创建操作区域，或者为操作点绑定操作事件。比如鼠标的mousemove事件。

2、onmousemove当鼠标移动，我们要动态跟随鼠标移动改变裁剪区域的位置以及大小。

3、onmouseup当鼠标抬起，我们要取消元素的鼠标移动事件。来保证截取区域不在岁鼠标移动而改变。

#二.如何使用
1、在含有需要裁剪图片的页面里面引入

< link rel="stylesheet" type="text/css" href="css/xq_catimg.css" >

< script type="text/javascript" src="js/xq_catimg.js"></script>

这是裁剪插件所依赖的两个文件。必须在初始化裁剪图片之前，将其引入。

2.调用插件初始化方法，将需要裁剪的图片初始化

$(".niceimg").xq_catimg();  ||  $(".niceimg").xq_catimg({

			"imgwidth"	:500,	//设置图片最大宽度  默认200px
			
			"imgheight"	:400,	//设置图片最大高度  默认200px
			
			"showview"	:true,	//是否显示图片预览区域
			
			"pclass"	:"",	//包容裁剪图片容器的样式
			
			"openmb"	:false	//是否开启移动端裁剪支持，（暂时不可用）
		
		});
这个时候该图片就具备了可裁剪功能。
#三、如何获取裁剪后的数据呢？
var datajson=xq_catimg.getCatData();//这个时候参数已经将数据存在了window下的xq_catimg对象里面了。
我们可以通过xq_catimg.getCatData();来回去参见的数据值。
数据格式为 
<pre>
{
  top: 70.28999999999999, //截取原始图片在垂直方向相对于顶部的偏移量
  left: 63.3675,  //截取原始图片在水平方向相对于左边的偏移量
  width: 115.02,  //  截取原始图片水平方向的宽度。
  height: 99.5775 //截取原始图片垂直方向的高度。
}
</pre>
我们只需要把原始图片的路径和这些一起传给后台。这个图片就算截取完成了。

虽然还有众多不足，我也会不断去完善它的。希望各路大神指点指点。
