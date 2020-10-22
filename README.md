# ModialJS

```javascript
// @require      https://github.com/tumble1999/modial/raw/master/modial.js
```

```javascript
var modal = new Modial();

// or
modal.setContent("Body");
// or
modal.setContent("Header","Body","Footer");
//or
modal.setContent({
header:"Header",
body:"Body",
footer:"Footer"
});

// or you can get the nodes to do things like append children or something
modal.getHeaderNode()
modal.getBodyNode()
modal.getFooterNode()

modal.show()
modal.hide() 