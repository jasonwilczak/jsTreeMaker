# jsTreeMaker
*A simple, lightweight, vanilla Hierarchical Tree List maker for Javascript*

> My mission here was to not have any of this rely on CSS or any external libraries due to some  frustrations that came up when trying to find a tree list maker on the web.  Below is the API and the options, as well as a Fiddle for an example of how to use it.

**For The Future:**

 - Looking to add default classes to the elements and the options
 - Provide a basic CSS theme that can be change, extended or removed
 - Remove use of Prompt and utilize a dynamic input control

**Sample Usage:** [jsTreeMaker Fiddle v1.0](https://jsfiddle.net/jasonwilczak/ofg7Lkvm/)

**API:**

 - Initialize: Starts the tool and sets values.  Will load tree if data 
   was set in options
 - LoadTree: Will reload tree with data provided
 - GetDataAsObject: Returns the current data as an array of objects
 - GetDataAsJsonString: Same as above except in JSON string format

**Default Options (can override any or all):**

 - **PlaceListActionsAfterText**:  This will force the expand/collapse toggle before the list item text if the value is false   
 - **MainListId**: Default Id value for the main list <ul>    
 - **Container**:  This is the DOM element that you wish the tree view to be appended too
 - **ActionItemOptions**:    
	 - **Remove**: This action removes a node from the tree
		 - Display: The text that is shown to the user to indicate the action 
		 - Title: Text that shows when user hovers over Display
		 - Callback: An optional callback function after user clicks Remove
		 - Id: Id value given to the element
		 - DefaultDisplay: Default is to show this action
	 - **Add**: Action adds a node to the tree
		 - Display: The text that is shown to the user to indicate the action
		 - Title: Text that shows when user hovers over Display
		 - IsAllowed: Default is true, false will prevent user from adding nodes
		 - Id: Id value given to the element
		 - DefaultDisplay: Default is to show this action    
	 - **Edit**: Allows you to change the text of a node
		 - Display: The text that is shown to the user to indicate the action
		 - Title: Text that shows when user hovers over Display
		 - Callback: An optional callback function after user clicks Edit
		 - IsAllowed: Default is true, false will prevent user from editting nodes
		 - Id: Id value given to the element
	 - **Collapse**: Hides the children of a node
		 - Display: The text that is shown to the user to indicate the action
		 - Title: Text that shows when user hovers over Display
		 - Callback: An optional callback function after user clicks Collapse 
		 - DefaultDisplay: Default is to show this action   
	 - **Expand**: Shows the children of a node
		 - Display: The text that is shown to the user to indicate the action
		 - Title: Text that shows when user hovers over Display
		 - Callback: An optional callback function after user clicks Expand
		 - DefaultDisplay: Default is to show this action
	 - **TreeViewData**: Initial data load to show for the tree

    
    var jsTreeMakerOptions = {
        PlaceListActionsAfterText: true,
        MainListId: 0,
        Container: document.getElementsByTagName('body')[0],
        ActionItemOptions: {
            Remove: {
                Display: "[-]",
                Title: "Click to Remove",
                Callback: function() {},
                IsAllowed: true,
                Id: "actionItemRemove",
                DefaultDisplay: ""
            },
            Add: {
                Display: "[+]",
                Title: "Click to Add A Child",
                Callback: function () { },
                IsAllowed: true,
                Id: "actionItemAdd",
                DefaultDisplay: ""
            },
            Edit: {
                Display: "[✏]",
                Title: "Click to Edit Text",
                Callback: function () { },
                IsAllowed: true,
                Id: "actionItemEdit",
                DefaultDisplay: "none"
            },
            Collapse: {
                Display: "[^]",
                Title: "Click to Collapse",
                Callback: function() {},
                DefaultDisplay: ""
            },
            Expand: {
                Display: "[*]",
                Title: "Click to Expand",
                Callback: function () {},
                DefaultDisplay: ""
            }
        },
        TreeViewData: []
    }
