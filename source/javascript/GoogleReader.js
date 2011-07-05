enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	components: [
		{name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
			{kind: "Subscriptions"},
			{name: "middle", width: "320px", kind:"SlidingView", components: [
					{kind: "Header", content: ""},
					{kind: "Scroller", flex: 1, components: [
						//Insert your components here
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]},
			{name: "right", kind:"SlidingView", flex: 1, components: [
					{kind: "Header", content:"Panel 3"},
					{kind: "Scroller", flex: 1, components: [
						//Insert your components here
					]},
					{kind: "Toolbar", components: [
						{kind: "GrabButton"}
					]}
			]}
		]}
	]
});