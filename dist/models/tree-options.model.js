import { KEYS } from '../constants/keys';
import * as _ from 'lodash';
export var TREE_ACTIONS = {
    TOGGLE_SELECTED: function (tree, node, $event) { return node && node.toggleActivated(); },
    TOGGLE_SELECTED_MULTI: function (tree, node, $event) { return node && node.toggleActivated(true); },
    SELECT: function (tree, node, $event) { return node.setIsActive(true); },
    DESELECT: function (tree, node, $event) { return node.setIsActive(false); },
    FOCUS: function (tree, node, $event) { return node.focus(); },
    TOGGLE_EXPANDED: function (tree, node, $event) { return node.hasChildren && node.toggleExpanded(); },
    EXPAND: function (tree, node, $event) { return node.expand(); },
    COLLAPSE: function (tree, node, $event) { return node.collapse(); },
    DRILL_DOWN: function (tree, node, $event) { return tree.focusDrillDown(); },
    DRILL_UP: function (tree, node, $event) { return tree.focusDrillUp(); },
    NEXT_NODE: function (tree, node, $event) { return tree.focusNextNode(); },
    PREVIOUS_NODE: function (tree, node, $event) { return tree.focusPreviousNode(); },
    MOVE_NODE: function (tree, node, $event, _a) {
        var from = _a.from, to = _a.to;
        // default action assumes from = node, to = {parent, index}
        if ($event.ctrlKey) {
            tree.copyNode(from, to);
        }
        else {
            tree.moveNode(from, to);
        }
    }
};
var defaultActionMapping = {
    mouse: {
        click: TREE_ACTIONS.TOGGLE_SELECTED,
        dblClick: null,
        contextMenu: null,
        expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
        drop: TREE_ACTIONS.MOVE_NODE
    },
    keys: (_a = {},
        _a[KEYS.RIGHT] = TREE_ACTIONS.DRILL_DOWN,
        _a[KEYS.LEFT] = TREE_ACTIONS.DRILL_UP,
        _a[KEYS.DOWN] = TREE_ACTIONS.NEXT_NODE,
        _a[KEYS.UP] = TREE_ACTIONS.PREVIOUS_NODE,
        _a[KEYS.SPACE] = TREE_ACTIONS.TOGGLE_SELECTED,
        _a[KEYS.ENTER] = TREE_ACTIONS.TOGGLE_SELECTED,
        _a)
};
var TreeOptions = (function () {
    function TreeOptions(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.actionMapping = _.defaultsDeep({}, this.options.actionMapping, defaultActionMapping);
    }
    Object.defineProperty(TreeOptions.prototype, "childrenField", {
        get: function () { return this.options.childrenField || 'children'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "displayField", {
        get: function () { return this.options.displayField || 'name'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "idField", {
        get: function () { return this.options.idField || 'id'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "isExpandedField", {
        get: function () { return this.options.isExpandedField || 'isExpanded'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "getChildren", {
        get: function () { return this.options.getChildren; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "levelPadding", {
        get: function () { return this.options.levelPadding || 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "useVirtualScroll", {
        get: function () { return this.options.useVirtualScroll; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "animateExpand", {
        get: function () { return this.options.animateExpand; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "animateSpeed", {
        get: function () { return this.options.animateSpeed || 30; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "animateAcceleration", {
        get: function () { return this.options.animateAcceleration || 1.2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeOptions.prototype, "scrollOnSelect", {
        get: function () { return this.options.scrollOnSelect === undefined ? true : this.options.scrollOnSelect; },
        enumerable: true,
        configurable: true
    });
    TreeOptions.prototype.getNodeClone = function (node) {
        if (this.options.getNodeClone) {
            return this.options.getNodeClone(node);
        }
        return _.omit(Object.assign({}, node.data), ['id']);
    };
    TreeOptions.prototype.allowDrop = function (element, to, $event) {
        if (this.options.allowDrop instanceof Function) {
            return this.options.allowDrop(element, to, $event);
        }
        else {
            return this.options.allowDrop === undefined ? true : this.options.allowDrop;
        }
    };
    TreeOptions.prototype.allowDrag = function (node) {
        if (this.options.allowDrag instanceof Function) {
            return this.options.allowDrag(node);
        }
        else {
            return this.options.allowDrag;
        }
    };
    TreeOptions.prototype.nodeClass = function (node) {
        return this.options.nodeClass ? this.options.nodeClass(node) : '';
    };
    TreeOptions.prototype.nodeHeight = function (node) {
        if (node.data.virtual) {
            return 0;
        }
        var nodeHeight = this.options.nodeHeight || 22;
        if (typeof nodeHeight === 'function') {
            nodeHeight = nodeHeight(node);
        }
        // account for drop slots:
        return nodeHeight + (node.index === 0 ? 2 : 1) * this.dropSlotHeight;
    };
    Object.defineProperty(TreeOptions.prototype, "dropSlotHeight", {
        get: function () {
            return this.options.dropSlotHeight || 2;
        },
        enumerable: true,
        configurable: true
    });
    return TreeOptions;
}());
export { TreeOptions };
var _a;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvdHJlZS1vcHRpb25zLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUd6QyxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQU01QixNQUFNLENBQUMsSUFBTSxZQUFZLEdBQUc7SUFDMUIsZUFBZSxFQUFFLFVBQUMsSUFBZSxFQUFFLElBQWMsRUFBRSxNQUFXLElBQUssT0FBQSxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUE5QixDQUE4QjtJQUNqRyxxQkFBcUIsRUFBRSxVQUFDLElBQWUsRUFBRSxJQUFjLEVBQUUsTUFBVyxJQUFLLE9BQUEsSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQWxDLENBQWtDO0lBQzNHLE1BQU0sRUFBRSxVQUFDLElBQWUsRUFBRSxJQUFjLEVBQUUsTUFBVyxJQUFLLE9BQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBdEIsQ0FBc0I7SUFDaEYsUUFBUSxFQUFFLFVBQUMsSUFBZSxFQUFFLElBQWMsRUFBRSxNQUFXLElBQUssT0FBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUF2QixDQUF1QjtJQUNuRixLQUFLLEVBQUUsVUFBQyxJQUFlLEVBQUUsSUFBYyxFQUFFLE1BQVcsSUFBSyxPQUFBLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBWixDQUFZO0lBQ3JFLGVBQWUsRUFBRSxVQUFDLElBQWUsRUFBRSxJQUFjLEVBQUUsTUFBVyxJQUFLLE9BQUEsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQXpDLENBQXlDO0lBQzVHLE1BQU0sRUFBRSxVQUFDLElBQWUsRUFBRSxJQUFjLEVBQUUsTUFBVyxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFiLENBQWE7SUFDdkUsUUFBUSxFQUFFLFVB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LENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFFL0MsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyQyxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFFRCwwQkFBMEI7UUFDMUIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxzQkFBSSx1Q0FBYzthQUFsQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQzs7O09BQUE7SUFDSCxrQkFBQztBQUFELENBakVBLEFBaUVDLElBQUEiLCJmaWxlIjoidHJlZS1vcHRpb25zLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU1vZGVsIH0gZnJvbSAnLi90cmVlLm1vZGVsJztcbmltcG9ydCB7IEtFWVMgfSBmcm9tICcuLi9jb25zdGFudHMva2V5cyc7XG5pbXBvcnQgeyBJVHJlZU9wdGlvbnMgfSBmcm9tICcuLi9kZWZzL2FwaSc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uSGFuZGxlciB7XG4gICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSwgLi4ucmVzdCk7XG59XG5cbmV4cG9ydCBjb25zdCBUUkVFX0FDVElPTlMgPSB7XG4gIFRPR0dMRV9TRUxFQ1RFRDogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiBub2RlICYmIG5vZGUudG9nZ2xlQWN0aXZhdGVkKCksXG4gIFRPR0dMRV9TRUxFQ1RFRF9NVUxUSTogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiBub2RlICYmIG5vZGUudG9nZ2xlQWN0aXZhdGVkKHRydWUpLFxuICBTRUxFQ1Q6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5zZXRJc0FjdGl2ZSh0cnVlKSxcbiAgREVTRUxFQ1Q6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5zZXRJc0FjdGl2ZShmYWxzZSksXG4gIEZPQ1VTOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+IG5vZGUuZm9jdXMoKSxcbiAgVE9HR0xFX0VYUEFOREVEOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+IG5vZGUuaGFzQ2hpbGRyZW4gJiYgbm9kZS50b2dnbGVFeHBhbmRlZCgpLFxuICBFWFBBTkQ6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5leHBhbmQoKSxcbiAgQ09MTEFQU0U6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gbm9kZS5jb2xsYXBzZSgpLFxuICBEUklMTF9ET1dOOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+IHRyZWUuZm9jdXNEcmlsbERvd24oKSxcbiAgRFJJTExfVVA6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSkgPT4gdHJlZS5mb2N1c0RyaWxsVXAoKSxcbiAgTkVYVF9OT0RFOiAodHJlZTogVHJlZU1vZGVsLCBub2RlOiBUcmVlTm9kZSwgJGV2ZW50OiBhbnkpID0+ICB0cmVlLmZvY3VzTmV4dE5vZGUoKSxcbiAgUFJFVklPVVNfTk9ERTogKHRyZWU6IFRyZWVNb2RlbCwgbm9kZTogVHJlZU5vZGUsICRldmVudDogYW55KSA9PiAgdHJlZS5mb2N1c1ByZXZpb3VzTm9kZSgpLFxuICBNT1ZFX05PREU6ICh0cmVlOiBUcmVlTW9kZWwsIG5vZGU6IFRyZWVOb2RlLCAkZXZlbnQ6IGFueSwge2Zyb20gLCB0b306IHtmcm9tOiBhbnksIHRvOiBhbnl9KSA9PiB7XG4gICAgLy8gZGVmYXVsdCBhY3Rpb24gYXNzdW1lcyBmcm9tID0gbm9kZSwgdG8gPSB7cGFyZW50LCBpbmRleH1cbiAgICBpZiAoJGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIHRyZWUuY29weU5vZGUoZnJvbSwgdG8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmVlLm1vdmVOb2RlKGZyb20sIHRvKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGRlZmF1bHRBY3Rpb25NYXBwaW5nOiBJQWN0aW9uTWFwcGluZyA9IHtcbiAgbW91c2U6IHtcbiAgICBjbGljazogVFJFRV9BQ1RJT05TLlRPR0dMRV9TRUxFQ1RFRCxcbiAgICBkYmxDbGljazogbnVsbCxcbiAgICBjb250ZXh0TWVudTogbnVsbCxcbiAgICBleHBhbmRlckNsaWNrOiBUUkVFX0FDVElPTlMuVE9HR0xFX0VYUEFOREVELFxuICAgIGRyb3A6IFRSRUVfQUNUSU9OUy5NT1ZFX05PREVcbiAgfSxcbiAga2V5czoge1xuICAgIFtLRVlTLlJJR0hUXTogVFJFRV9BQ1RJT05TLkRSSUxMX0RPV04sXG4gICAgW0tFWVMuTEVGVF06IFRSRUVfQUNUSU9OUy5EUklMTF9VUCxcbiAgICBbS0VZUy5ET1dOXTogVFJFRV9BQ1RJT05TLk5FWFRfTk9ERSxcbiAgICBbS0VZUy5VUF06IFRSRUVfQUNUSU9OUy5QUkVWSU9VU19OT0RFLFxuICAgIFtLRVlTLlNQQUNFXTogVFJFRV9BQ1RJT05TLlRPR0dMRV9TRUxFQ1RFRCxcbiAgICBbS0VZUy5FTlRFUl06IFRSRUVfQUNUSU9OUy5UT0dHTEVfU0VMRUNURURcbiAgfVxufTtcblxuZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uTWFwcGluZyB7XG4gIG1vdXNlPzoge1xuICAgIGNsaWNrPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgZGJsQ2xpY2s/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBjb250ZXh0TWVudT86IElBY3Rpb25IYW5kbGVyLFxuICAgIGV4cGFuZGVyQ2xpY2s/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBkcmFnU3RhcnQ/OiBJQWN0aW9uSGFuZGxlcixcbiAgICBkcmFnPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgZHJhZ0VuZD86IElBY3Rpb25IYW5kbGVyLFxuICAgIGRyYWdPdmVyPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgZHJhZ0xlYXZlPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgZHJhZ0VudGVyPzogSUFjdGlvbkhhbmRsZXIsXG4gICAgZHJvcD86IElBY3Rpb25IYW5kbGVyXG4gIH07XG4gIGtleXM/OiB7XG4gICAgW2tleTogbnVtYmVyXTogSUFjdGlvbkhhbmRsZXJcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFRyZWVPcHRpb25zIHtcbiAgZ2V0IGNoaWxkcmVuRmllbGQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3B0aW9ucy5jaGlsZHJlbkZpZWxkIHx8ICdjaGlsZHJlbic7IH1cbiAgZ2V0IGRpc3BsYXlGaWVsZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcHRpb25zLmRpc3BsYXlGaWVsZCB8fCAnbmFtZSc7IH1cbiAgZ2V0IGlkRmllbGQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3B0aW9ucy5pZEZpZWxkIHx8ICdpZCc7IH1cbiAgZ2V0IGlzRXhwYW5kZWRGaWVsZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcHRpb25zLmlzRXhwYW5kZWRGaWVsZCB8fCAnaXNFeHBhbmRlZCc7IH1cbiAgZ2V0IGdldENoaWxkcmVuKCk6IGFueSB7IHJldHVybiB0aGlzLm9wdGlvbnMuZ2V0Q2hpbGRyZW47IH1cbiAgZ2V0IGxldmVsUGFkZGluZygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5vcHRpb25zLmxldmVsUGFkZGluZyB8fCAwOyB9XG4gIGdldCB1c2VWaXJ0dWFsU2Nyb2xsKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5vcHRpb25zLnVzZVZpcnR1YWxTY3JvbGw7IH1cbiAgZ2V0IGFuaW1hdGVFeHBhbmQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm9wdGlvbnMuYW5pbWF0ZUV4cGFuZDsgfVxuICBnZXQgYW5pbWF0ZVNwZWVkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm9wdGlvbnMuYW5pbWF0ZVNwZWVkIHx8IDMwOyB9XG4gIGdldCBhbmltYXRlQWNjZWxlcmF0aW9uKCk6IG51bWJlciB7IHJldHVybiB0aGlzLm9wdGlvbnMuYW5pbWF0ZUFjY2VsZXJhdGlvbiB8fCAxLjI7IH1cbiAgZ2V0IHNjcm9sbE9uU2VsZWN0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbE9uU2VsZWN0ID09PSB1bmRlZmluZWQgPyB0cnVlIDogdGhpcy5vcHRpb25zLnNjcm9sbE9uU2VsZWN0OyB9XG4gIGFjdGlvbk1hcHBpbmc6IElBY3Rpb25NYXBwaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogSVRyZWVPcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmFjdGlvbk1hcHBpbmcgPSBfLmRlZmF1bHRzRGVlcCh7fSwgdGhpcy5vcHRpb25zLmFjdGlvbk1hcHBpbmcsIGRlZmF1bHRBY3Rpb25NYXBwaW5nKTtcbiAgfVxuXG4gIGdldE5vZGVDbG9uZShub2RlOiBUcmVlTm9kZSk6IGFueSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXROb2RlQ2xvbmUpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZ2V0Tm9kZUNsb25lKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBfLm9taXQoT2JqZWN0LmFzc2lnbih7fSwgbm9kZS5kYXRhKSwgWydpZCddKTtcbiAgfVxuXG4gIGFsbG93RHJvcChlbGVtZW50LCB0bywgJGV2ZW50Pyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYWxsb3dEcm9wIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWxsb3dEcm9wKGVsZW1lbnQsIHRvLCAkZXZlbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWxsb3dEcm9wID09PSB1bmRlZmluZWQgPyB0cnVlIDogdGhpcy5vcHRpb25zLmFsbG93RHJvcDtcbiAgICB9XG4gIH1cblxuICBhbGxvd0RyYWcobm9kZTogVHJlZU5vZGUpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmFsbG93RHJhZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFsbG93RHJhZyhub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hbGxvd0RyYWc7XG4gICAgfVxuICB9XG5cbiAgbm9kZUNsYXNzKG5vZGU6IFRyZWVOb2RlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLm5vZGVDbGFzcyA/IHRoaXMub3B0aW9ucy5ub2RlQ2xhc3Mobm9kZSkgOiAnJztcbiAgfVxuXG4gIG5vZGVIZWlnaHQobm9kZTogVHJlZU5vZGUpOiBudW1iZXIge1xuICAgIGlmIChub2RlLmRhdGEudmlydHVhbCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbGV0IG5vZGVIZWlnaHQgPSB0aGlzLm9wdGlvbnMubm9kZUhlaWdodCB8fCAyMjtcblxuICAgIGlmICh0eXBlb2Ygbm9kZUhlaWdodCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbm9kZUhlaWdodCA9IG5vZGVIZWlnaHQobm9kZSk7XG4gICAgfVxuXG4gICAgLy8gYWNjb3VudCBmb3IgZHJvcCBzbG90czpcbiAgICByZXR1cm4gbm9kZUhlaWdodCArIChub2RlLmluZGV4ID09PSAwID8gIDIgOiAxKSAqIHRoaXMuZHJvcFNsb3RIZWlnaHQ7XG4gIH1cblxuICBnZXQgZHJvcFNsb3RIZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRyb3BTbG90SGVpZ2h0IHx8IDI7XG4gIH1cbn1cbiJdfQ==