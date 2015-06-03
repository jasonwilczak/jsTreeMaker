# jsTreeMaker
A simple, lightweight, vanilla Hierarchical Tree List maker for Javascript

Sample Usage: http://jsfiddle.net/jasonwilczak/18Lhhjzj/67/

Default Options (can be overridden):

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
