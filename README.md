# Native Bootstrap Modal

```javascript
// @require      https://github.com/tumble1999/native-modals/raw/master/native-modal.js
```

```javascript
var modal = new BSModal();

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