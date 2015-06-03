var jsTreeMaker = (function () {
    var selectedListItem;
    var displayPrefix = "displayFor";
    var newPrefix = "new";
    var parentNodePrefix = "parent";
    var addedIdCounter = 0;
    var currentData;
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

    var generateNodes = function(nodeItem) {
        var childNodes = nodeItem || [];
        if (nodeItem && typeof nodeItem === "object" && !Array.isArray(nodeItem)) {
            createNode(nodeItem);
            childNodes = nodeItem.Children;
        }
        for (var i = 0; i < childNodes.length; i++) {
            generateNodes(childNodes[i]);
        }
    }
    var createNode = function(nodeItem) {
        var parentNodeId = generateCustomId(parentNodePrefix, nodeItem.ParentId);
        var parentNode = document.getElementById(parentNodeId);
        if (!parentNode) {
            parentNode = document.createElement("ul");
            parentNode.setAttribute("id", parentNodeId);
            document.getElementById(nodeItem.ParentId).appendChild(parentNode);
        }
        var node = document.createElement("li");
        node.setAttribute("id", nodeItem.Id);
        var displayElement = document.createElement("span");
        displayElement.innerHTML = nodeItem.Display;
        displayElement.setAttribute("id", generateCustomId(displayPrefix, nodeItem.Id));
        displayElement.onclick = function (event) {
            var target = event.currentTarget.parentElement;
            if (selectedListItem) {
                var previousSelectedListItem = document.getElementById(generateCustomId(displayPrefix, selectedListItem.getAttribute('id')));
                previousSelectedListItem.style.color = "black";
            }
            selectedListItem = selectedListItem && selectedListItem.getAttribute('id') == target.getAttribute('id') ? undefined : target;
            if (selectedListItem) {
                event.currentTarget.style.color = "green";
            }
            var editStyleDisplayValue = selectedListItem ? "":"none";
            document.getElementById(jsTreeMakerOptions.ActionItemOptions["Edit"].Id).style.display = editStyleDisplayValue;
        }
        if (jsTreeMakerOptions.PlaceListActionsAfterText) {
            node.appendChild(displayElement);
            generateListActions(node,false,false,false);
        } else {
            generateListActions(node, false, false, false);
            node.appendChild(displayElement);
        }
        
        parentNode.appendChild(node);
    }
    //Simple function to natively merge user defined options with defaults
    var mergeRecursive = function(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = mergeRecursive(obj1[p], obj2[p]);

                } else {
                    obj1[p] = obj2[p];

                }

            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];

            }
        }

        return obj1;
    }
    //Creates a custom formatted id value for the <ul> elements: ul#
    var generateCustomId = function(prefix,baseId) {
        return prefix + baseId;
    }
    //Used to insert the available actions for any given list item: add/remove
    var generateListActions = function(listElement,allowAdd,allowRemove,allowEdit) {
        var actionContainer = document.createElement("span");
        var elementId = listElement.getAttribute("id");
        actionContainer.appendChild(generateActionItem("Collapse", function (actionItemElement) {
            var childContainer = document.getElementById(generateCustomId(parentNodePrefix, elementId));
            if (childContainer) {
                var newDisplay = "";
                var newActionItemOptionsName = "Collapse";
                if (childContainer.style.display !== "none") {
                    newDisplay = "none";
                    newActionItemOptionsName = "Expand";
                }
                var newActionItemOptions = jsTreeMakerOptions.ActionItemOptions[newActionItemOptionsName];
                actionItemElement.setAttribute("title", newActionItemOptions.Title);
                actionItemElement.innerHTML = newActionItemOptions.Display;
                childContainer.style.display = newDisplay;
            }
        }));
        var canRemove = allowRemove !== undefined ? allowRemove : jsTreeMakerOptions.ActionItemOptions["Remove"].IsAllowed;
        if (canRemove) {
            actionContainer.appendChild(generateActionItem("Remove", function () {
                var currentElement = selectedListItem || listElement;
                elementId = currentElement.getAttribute("id");
                if (confirm("Are you sure you want to delete this and all its children...?")) {
                    removeNodeFromData({ Id: elementId });
                    currentElement.parentNode.removeChild(currentElement);
                }
            }));
        }
        var canAdd = allowAdd !== undefined ? allowAdd : jsTreeMakerOptions.ActionItemOptions["Add"].IsAllowed;
        if (canAdd) {
            actionContainer.appendChild(generateActionItem("Add", function () {
                var currentElement = selectedListItem || listElement;
                elementId = currentElement.getAttribute("id");
                var userData = prompt("Enter display text:","");
                addedIdCounter++;
                var newNode = { Display: userData, Id: generateCustomId(newPrefix, addedIdCounter), ParentId: elementId, Children: [] };
                createNode(newNode);
                addNodeToData(newNode);
            }));
        }
        var canEdit = allowEdit !== undefined ? allowEdit : jsTreeMakerOptions.ActionItemOptions["Edit"].IsAllowed;
        if (canEdit) {
            var editActionItem = generateActionItem("Edit", function() {
                var currentElement = selectedListItem || listElement;
                editNodeData(currentElement);
            });
            actionContainer.appendChild(editActionItem);
        }
        listElement.appendChild(actionContainer);
    }
    var generateActionItem = function (actionItemOptionName, clickFunction) {
        var actionItemOption = jsTreeMakerOptions.ActionItemOptions[actionItemOptionName];

        var actionItem = document.createElement("a");
        var actionItemDisplay = document.createTextNode(actionItemOption.Display);
        actionItem.appendChild(actionItemDisplay);
        actionItem.setAttribute("href", "#");
        actionItem.setAttribute("title", actionItemOption.Title);
        if (actionItemOption.Id) {
            actionItem.setAttribute("id", actionItemOption.Id);
        }
        actionItem.onclick = function () {
            clickFunction(actionItem);
            actionItemOption.Callback(actionItem);
        }
        actionItem.style.display = actionItemOption.DefaultDisplay;
        return actionItem;
    }
    var addNodeToData = function (nodeToAdd) {
        if (nodeToAdd.ParentId == 0) {
            currentData.push(nodeToAdd);
            return;
        }
        var parentNodeSource = findNodeSourceInData({ Id: nodeToAdd.ParentId }, currentData);
        if (parentNodeSource) {
            parentNodeSource[findNodeIndexInNodeSource(nodeToAdd.ParentId, parentNodeSource)].Children.push(nodeToAdd);
        }
    }
    var removeNodeFromData = function(nodeToRemove) {
        var removeSource = findNodeSourceInData(nodeToRemove, currentData);
        if (removeSource) {
            removeSource.splice(findNodeIndexInNodeSource(nodeToRemove.Id, removeSource, 1));
        }
    }
    var editNodeData = function (element) {
        var nodeWithIdOnly = { Id: element.getAttribute("id") };
        var nodeSource = findNodeSourceInData(nodeWithIdOnly, currentData);
        var nodeIndex = findNodeIndexInNodeSource(nodeWithIdOnly.Id, nodeSource);
        var promptData = prompt("Enter new text:", nodeSource[nodeIndex].Display);
        nodeSource[nodeIndex].Display = promptData;
        var elementTextChild = document.getElementById(generateCustomId(displayPrefix, nodeWithIdOnly.Id));
        elementTextChild.innerHTML = promptData;
    }
    var findNodeSourceInData = function(nodeToFind,nodeSource) {
        for (var i = 0; i < nodeSource.length; i++) {
            if (nodeToFind.Id == nodeSource[i].Id) {
                return nodeSource;
            }
            var childSource = findNodeSourceInData(nodeToFind, nodeSource[i].Children);
            if (childSource) {
                return childSource;
            }
        }
        return null;
    }
    var findNodeIndexInNodeSource = function(nodeIdToMatch, nodeSource) {
        for (var i = 0; i < nodeSource.length; i++) {
            if (nodeSource[i].Id == nodeIdToMatch) {
                return i;
            }
        }
    }
    var setTreeView = function(treeData) {
        generateListActions(jsTreeMakerOptions.Container);
        currentData = JSON.parse(JSON.stringify(treeData)); //clone the array
        generateNodes(currentData);
    }
    function init(options) {
        mergeRecursive(jsTreeMakerOptions, options);
        jsTreeMakerOptions.Container.setAttribute("id", "0");
        setTreeView(jsTreeMakerOptions.TreeViewData);
    }
    function returnDataAsObject() {
        return currentData;
    }
    function returnDataAsJsonString() {
        return JSON.stringify(currentData);
    }
    function loadTree(treeData) {
        jsTreeMakerOptions.Container.innerHTML = '';
        setTreeView(treeData);
    }
    return {
        Initialize: init,
        LoadTree: loadTree,
        GetDataAsObject: returnDataAsObject,
        GetDataAsJsonString: returnDataAsJsonString
    }
})();
