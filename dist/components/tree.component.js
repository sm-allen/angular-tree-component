import { Component, Input, Output, EventEmitter, Renderer, ViewEncapsulation, ContentChild, HostListener, ViewChild } from '@angular/core';
import { TreeModel } from '../models/tree.model';
import { TreeDraggedElement } from '../models/tree-dragged-element.model';
import * as _ from 'lodash';
var includes = _.includes, pick = _.pick;
var TreeComponent = (function () {
    function TreeComponent(treeModel, treeDraggedElement, renderer) {
        var _this = this;
        this.treeModel = treeModel;
        this.treeDraggedElement = treeDraggedElement;
        this.renderer = renderer;
        treeModel.eventNames.forEach(function (name) { return _this[name] = new EventEmitter(); });
        treeModel.subscribeToState(function (state) { return _this.stateChange.emit(state); });
    }
    Object.defineProperty(TreeComponent.prototype, "nodes", {
        // Will be handled in ngOnChanges
        set: function (nodes) { },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(TreeComponent.prototype, "options", {
        set: function (options) { },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(TreeComponent.prototype, "focused", {
        set: function (value) {
            this.treeModel.setFocus(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeComponent.prototype, "state", {
        set: function (state) {
            this.treeModel.setState(state);
        },
        enumerable: true,
        configurable: true
    });
    TreeComponent.prototype.onKeydown = function ($event) {
        if (!this.treeModel.isFocused)
            return;
        if (includes(['input', 'textarea'], document.activeElement.tagName.toLowerCase()))
            return;
        var focusedNode = this.treeModel.getFocusedNode();
        // Home key => focus on root node.
        if ($event.key === 'Home') {
            var firstNode = this.treeModel.getFirstRoot(true);
            this.treeModel.setFocusedNode(firstNode);
            return;
        }
        // End key => focus on last visible node.
        if ($event.key === 'End') {
            var lastNode = this.treeModel.getLastRoot();
            while (lastNode.hasChildren && lastNode.isExpanded) {
                lastNode = lastNode.getLastChild(true);
            }
            this.treeModel.setFocusedNode(lastNode);
            return;
        }
        // * key => expand all nodes.
        if ($event.key === '*') {
            this.treeModel.expandAll();
            return;
        }
        this.treeModel.performKeyAction(focusedNode, $event);
    };
    TreeComponent.prototype.onMousedown = function ($event) {
        var insideClick = this.renderer.invokeElementMethod($event.target, 'closest', ['Tree']);
        this.treeModel.setOutlineVisible(false);
        if (!insideClick) {
            this.treeModel.setFocus(false);
        }
    };
    TreeComponent.prototype.ngOnChanges = function (changes) {
        this.treeModel.setData({
            options: changes.options && changes.options.currentValue,
            nodes: changes.nodes && changes.nodes.currentValue,
            events: pick(this, this.treeModel.eventNames)
        });
    };
    TreeComponent.prototype.sizeChanged = function () {
        this.viewportComponent.setViewport();
    };
    TreeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'Tree, tree-root',
                    encapsulation: ViewEncapsulation.None,
                    providers: [TreeModel],
                    styles: [
                        '.tree-children { padding-left: 20px }',
                        '.empty-tree-drop-slot .node-drop-slot { height: 20px; min-width: 100px }',
                        ".tree {\n      width: 100%;\n      position:relative;\n      display: inline-block;\n      cursor: pointer;\n      -webkit-touch-callout: none; /* iOS Safari */\n      -webkit-user-select: none;   /* Chrome/Safari/Opera */\n      -khtml-user-select: none;    /* Konqueror */\n      -moz-user-select: none;      /* Firefox */\n      -ms-user-select: none;       /* IE/Edge */\n      user-select: none;           /* non-prefixed version, currently not supported by any browser */\n    }"
                    ],
                    template: "\n    <tree-viewport #viewport>\n      <div\n        class=\"tree\"\n        role=\"tree\"\n        tabindex=\"0\"\n        [class.outline-none]=\"!treeModel.isOutlineVisible()\"\n        [class.node-dragging]=\"treeDraggedElement.isDragging()\">\n        <tree-node-collection\n          *ngIf=\"treeModel.roots\"\n          [nodes]=\"treeModel.roots\"\n          [treeModel]=\"treeModel\"\n          [templates]=\"{\n            loadingTemplate: loadingTemplate,\n            treeNodeTemplate: treeNodeTemplate,\n            treeNodeWrapperTemplate: treeNodeWrapperTemplate,\n            treeNodeFullTemplate: treeNodeFullTemplate\n          }\">\n        </tree-node-collection>\n        <tree-node-drop-slot\n          class=\"empty-tree-drop-slot\"\n          *ngIf=\"treeModel.isEmptyTree()\"\n          [dropIndex]=\"0\"\n          [node]=\"treeModel.virtualRoot\">\n        </tree-node-drop-slot>\n      </div>\n    </tree-viewport>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeComponent.ctorParameters = function () { return [
        { type: TreeModel, },
        { type: TreeDraggedElement, },
        { type: Renderer, },
    ]; };
    TreeComponent.propDecorators = {
        'loadingTemplate': [{ type: ContentChild, args: ['loadingTemplate',] },],
        'treeNodeTemplate': [{ type: ContentChild, args: ['treeNodeTemplate',] },],
        'treeNodeWrapperTemplate': [{ type: ContentChild, args: ['treeNodeWrapperTemplate',] },],
        'treeNodeFullTemplate': [{ type: ContentChild, args: ['treeNodeFullTemplate',] },],
        'viewportComponent': [{ type: ViewChild, args: ['viewport',] },],
        'nodes': [{ type: Input },],
        'options': [{ type: Input },],
        'focused': [{ type: Input },],
        'state': [{ type: Input },],
        'toggleExpanded': [{ type: Output },],
        'activate': [{ type: Output },],
        'deactivate': [{ type: Output },],
        'focus': [{ type: Output },],
        'blur': [{ type: Output },],
        'updateData': [{ type: Output },],
        'initialized': [{ type: Output },],
        'moveNode': [{ type: Output },],
        'copyNode': [{ type: Output },],
        'loadNodeChildren': [{ type: Output },],
        'changeFilter': [{ type: Output },],
        'event': [{ type: Output },],
        'stateChange': [{ type: Output },],
        'onKeydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
        'onMousedown': [{ type: HostListener, args: ['mousedown', ['$event'],] },],
    };
    return TreeComponent;
}());
export { TreeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBQSxFQUFPLE1BQUEsRUFBbUIsWUFBQSxFQUFjLFFBQUEsRUFDbkQsaUJBQWlCLEVBQUUsWUFBQSxFQUEyQixZQUFBLEVBQWMsU0FBQSxFQUM3RCxNQUFNLGVBQUEsQ0FBZ0I7QUFDdkIsT0FBTyxFQUFFLFNBQUEsRUFBVSxNQUFPLHNCQUFBLENBQXVCO0FBRWpELE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLHNDQUFBLENBQXVDO0FBSTFFLE9BQU8sS0FBSyxDQUFBLE1BQU8sUUFBQSxDQUFTO0FBRXBCLElBQUEscUJBQUEsRUFBVSxhQUFBLENBQVk7QUFHOUI7SUFxQ0UsdUJBQ1MsU0FBb0IsRUFDcEIsa0JBQXNDLEVBQ3JDLFFBQWtCO1FBSDVCLGlCQU9DO1FBTlEsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3JDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFFeEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLEVBQUUsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO1FBQ3hFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7SUFDeEUsQ0FBQztJQWhDQSxzQkFBSSxnQ0FBSztRQURWLGlDQUFpQzthQUNoQyxVQUFVLEtBQVksSUFBSSxDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFDNUIsc0JBQUksa0NBQU87YUFBWCxVQUFZLE9BQW9CLElBQUksQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRXRDLHNCQUFJ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QUFFLEVBQUU7UUFDbEMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFHLEVBQUUsRUFBRTtRQUN2RSxhQUFhLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUcsRUFBRSxFQUFFO0tBQzFFLENBQUM7SUFDRixvQkFBQztDQXpMRCxBQXlMQyxJQUFBO1NBekxZLGFBQWEiLCJmaWxlIjoidHJlZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLCBDb250ZW50Q2hpbGQsIFRlbXBsYXRlUmVmLCBIb3N0TGlzdGVuZXIsIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyZWVNb2RlbCB9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlRHJhZ2dlZEVsZW1lbnQgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1kcmFnZ2VkLWVsZW1lbnQubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1vcHRpb25zLm1vZGVsJztcbmltcG9ydCB7IFRyZWVWaWV3cG9ydENvbXBvbmVudCB9IGZyb20gJy4vdHJlZS12aWV3cG9ydC5jb21wb25lbnQnO1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IHsgaW5jbHVkZXMsIHBpY2sgfSAgPSBfO1xuXG5cbmV4cG9ydCBjbGFzcyBUcmVlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgX25vZGVzOiBhbnlbXTtcbiAgX29wdGlvbnM6IFRyZWVPcHRpb25zO1xuXG4gICBsb2FkaW5nVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICB0cmVlTm9kZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgdHJlZU5vZGVXcmFwcGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICB0cmVlTm9kZUZ1bGxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgdmlld3BvcnRDb21wb25lbnQ6IFRyZWVWaWV3cG9ydENvbXBvbmVudDtcblxuICAvLyBXaWxsIGJlIGhhbmRsZWQgaW4gbmdPbkNoYW5nZXNcbiAgIHNldCBub2Rlcyhub2RlczogYW55W10pIHsgfTtcbiAgIHNldCBvcHRpb25zKG9wdGlvbnM6IFRyZWVPcHRpb25zKSB7IH07XG5cbiAgIHNldCBmb2N1c2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy50cmVlTW9kZWwuc2V0Rm9jdXModmFsdWUpO1xuICB9XG5cbiAgIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIHRoaXMudHJlZU1vZGVsLnNldFN0YXRlKHN0YXRlKTtcbiAgfVxuXG4gICB0b2dnbGVFeHBhbmRlZDtcbiAgIGFjdGl2YXRlO1xuICAgZGVhY3RpdmF0ZTtcbiAgIGZvY3VzO1xuICAgYmx1cjtcbiAgIHVwZGF0ZURhdGE7XG4gICBpbml0aWFsaXplZDtcbiAgIG1vdmVOb2RlO1xuICAgY29weU5vZGU7XG4gICBsb2FkTm9kZUNoaWxkcmVuO1xuICAgY2hhbmdlRmlsdGVyO1xuICAgZXZlbnQ7XG4gICBzdGF0ZUNoYW5nZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdHJlZU1vZGVsOiBUcmVlTW9kZWwsXG4gICAgcHVibGljIHRyZWVEcmFnZ2VkRWxlbWVudDogVHJlZURyYWdnZWRFbGVtZW50LFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyKSB7XG5cbiAgICAgIHRyZWVNb2RlbC5ldmVudE5hbWVzLmZvckVhY2goKG5hbWUpID0+IHRoaXNbbmFtZV0gPSBuZXcgRXZlbnRFbWl0dGVyKCkpO1xuICAgICAgdHJlZU1vZGVsLnN1YnNjcmliZVRvU3RhdGUoKHN0YXRlKSA9PiB0aGlzLnN0YXRlQ2hhbmdlLmVtaXQoc3RhdGUpKTtcbiAgfVxuXG4gIFxuICBvbktleWRvd24oJGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLnRyZWVNb2RlbC5pc0ZvY3VzZWQpIHJldHVybjtcbiAgICBpZiAoaW5jbHVkZXMoWydpbnB1dCcsICd0ZXh0YXJlYSddLFxuICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpIHJldHVybjtcblxuICAgIGxldCBmb2N1c2VkTm9kZSA9IHRoaXMudHJlZU1vZGVsLmdldEZvY3VzZWROb2RlKCk7XG5cbiAgICAvLyBIb21lIGtleSA9PiBmb2N1cyBvbiByb290IG5vZGUuXG4gICAgaWYgKCRldmVudC5rZXkgPT09ICdIb21lJykge1xuICAgICAgICBsZXQgZmlyc3ROb2RlID0gdGhpcy50cmVlTW9kZWwuZ2V0Rmlyc3RSb290KHRydWUpO1xuICAgICAgICB0aGlzLnRyZWVNb2RlbC5zZXRGb2N1c2VkTm9kZShmaXJzdE5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRW5kIGtleSA9PiBmb2N1cyBvbiBsYXN0IHZpc2libGUgbm9kZS5cbiAgICBpZiAoJGV2ZW50LmtleSA9PT0gJ0VuZCcpIHtcbiAgICAgICAgbGV0IGxhc3ROb2RlID0gdGhpcy50cmVlTW9kZWwuZ2V0TGFzdFJvb3QoKTtcblxuICAgICAgICB3aGlsZSAobGFzdE5vZGUuaGFzQ2hpbGRyZW4gJiYgbGFzdE5vZGUuaXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgbGFzdE5vZGUgPSBsYXN0Tm9kZS5nZXRMYXN0Q2hpbGQodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyZWVNb2RlbC5zZXRGb2N1c2VkTm9kZShsYXN0Tm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAqIGtleSA9PiBleHBhbmQgYWxsIG5vZGVzLlxuICAgIGlmICgkZXZlbnQua2V5ID09PSAnKicpIHtcbiAgICAgICAgdGhpcy50cmVlTW9kZWwuZXhwYW5kQWxsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyZWVNb2RlbC5wZXJmb3JtS2V5QWN0aW9uKGZvY3VzZWROb2RlLCAkZXZlbnQpO1xuICB9XG5cbiAgXG4gIG9uTW91c2Vkb3duKCRldmVudCkge1xuICAgIGNvbnN0IGluc2lkZUNsaWNrID0gdGhpcy5yZW5kZXJlci5pbnZva2VFbGVtZW50TWV0aG9kKCRldmVudC50YXJnZXQsICdjbG9zZXN0JywgWydUcmVlJ10pO1xuICAgIHRoaXMudHJlZU1vZGVsLnNldE91dGxpbmVWaXNpYmxlKGZhbHNlKTtcbiAgICBpZiAoIWluc2lkZUNsaWNrKSB7XG4gICAgICB0aGlzLnRyZWVNb2RlbC5zZXRGb2N1cyhmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgIHRoaXMudHJlZU1vZGVsLnNldERhdGEoe1xuICAgICAgb3B0aW9uczogY2hhbmdlcy5vcHRpb25zICYmIGNoYW5nZXMub3B0aW9ucy5jdXJyZW50VmFsdWUsXG4gICAgICBub2RlczogY2hhbmdlcy5ub2RlcyAmJiBjaGFuZ2VzLm5vZGVzLmN1cnJlbnRWYWx1ZSxcbiAgICAgIGV2ZW50czogcGljayh0aGlzLCB0aGlzLnRyZWVNb2RlbC5ldmVudE5hbWVzKVxuICAgIH0pO1xuICB9XG5cbiAgc2l6ZUNoYW5nZWQoKSB7XG4gICAgdGhpcy52aWV3cG9ydENvbXBvbmVudC5zZXRWaWV3cG9ydCgpO1xuICB9XG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gIHNlbGVjdG9yOiAnVHJlZSwgdHJlZS1yb290JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbVHJlZU1vZGVsXSxcbiAgc3R5bGVzOiBbXG4gICAgJy50cmVlLWNoaWxkcmVuIHsgcGFkZGluZy1sZWZ0OiAyMHB4IH0nLFxuICAgICcuZW1wdHktdHJlZS1kcm9wLXNsb3QgLm5vZGUtZHJvcC1zbG90IHsgaGVpZ2h0OiAyMHB4OyBtaW4td2lkdGg6IDEwMHB4IH0nLFxuICAgIGAudHJlZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOyAvKiBpT1MgU2FmYXJpICovXG4gICAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAgIC8qIENocm9tZS9TYWZhcmkvT3BlcmEgKi9cbiAgICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTsgICAgLyogS29ucXVlcm9yICovXG4gICAgICAtbW96LXVzZXItc2VsZWN0OiBub25lOyAgICAgIC8qIEZpcmVmb3ggKi9cbiAgICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTsgICAgICAgLyogSUUvRWRnZSAqL1xuICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7ICAgICAgICAgICAvKiBub24tcHJlZml4ZWQgdmVyc2lvbiwgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQgYnkgYW55IGJyb3dzZXIgKi9cbiAgICB9YFxuICBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDx0cmVlLXZpZXdwb3J0ICN2aWV3cG9ydD5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJ0cmVlXCJcbiAgICAgICAgcm9sZT1cInRyZWVcIlxuICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICBbY2xhc3Mub3V0bGluZS1ub25lXT1cIiF0cmVlTW9kZWwuaXNPdXRsaW5lVmlzaWJsZSgpXCJcbiAgICAgICAgW2NsYXNzLm5vZGUtZHJhZ2dpbmddPVwidHJlZURyYWdnZWRFbGVtZW50LmlzRHJhZ2dpbmcoKVwiPlxuICAgICAgICA8dHJlZS1ub2RlLWNvbGxlY3Rpb25cbiAgICAgICAgICAqbmdJZj1cInRyZWVNb2RlbC5yb290c1wiXG4gICAgICAgICAgW25vZGVzXT1cInRyZWVNb2RlbC5yb290c1wiXG4gICAgICAgICAgW3RyZWVNb2RlbF09XCJ0cmVlTW9kZWxcIlxuICAgICAgICAgIFt0ZW1wbGF0ZXNdPVwie1xuICAgICAgICAgICAgbG9hZGluZ1RlbXBsYXRlOiBsb2FkaW5nVGVtcGxhdGUsXG4gICAgICAgICAgICB0cmVlTm9kZVRlbXBsYXRlOiB0cmVlTm9kZVRlbXBsYXRlLFxuICAgICAgICAgICAgdHJlZU5vZGVXcmFwcGVyVGVtcGxhdGU6IHRyZWVOb2RlV3JhcHBlclRlbXBsYXRlLFxuICAgICAgICAgICAgdHJlZU5vZGVGdWxsVGVtcGxhdGU6IHRyZWVOb2RlRnVsbFRlbXBsYXRlXG4gICAgICAgICAgfVwiPlxuICAgICAgICA8L3RyZWUtbm9kZS1jb2xsZWN0aW9uPlxuICAgICAgICA8dHJlZS1ub2RlLWRyb3Atc2xvdFxuICAgICAgICAgIGNsYXNzPVwiZW1wdHktdHJlZS1kcm9wLXNsb3RcIlxuICAgICAgICAgICpuZ0lmPVwidHJlZU1vZGVsLmlzRW1wdHlUcmVlKClcIlxuICAgICAgICAgIFtkcm9wSW5kZXhdPVwiMFwiXG4gICAgICAgICAgW25vZGVdPVwidHJlZU1vZGVsLnZpcnR1YWxSb290XCI+XG4gICAgICAgIDwvdHJlZS1ub2RlLWRyb3Atc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgIDwvdHJlZS12aWV3cG9ydD5cbiAgYFxufSwgXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9ICgpID0+IFtcbnt0eXBlOiBUcmVlTW9kZWwsIH0sXG57dHlwZTogVHJlZURyYWdnZWRFbGVtZW50LCB9LFxue3R5cGU6IFJlbmRlcmVyLCB9LFxuXTtcbnN0YXRpYyBwcm9wRGVjb3JhdG9yczoge1trZXk6IHN0cmluZ106IERlY29yYXRvckludm9jYXRpb25bXX0gPSB7XG4nbG9hZGluZ1RlbXBsYXRlJzogW3sgdHlwZTogQ29udGVudENoaWxkLCBhcmdzOiBbJ2xvYWRpbmdUZW1wbGF0ZScsIF0gfSxdLFxuJ3RyZWVOb2RlVGVtcGxhdGUnOiBbeyB0eXBlOiBDb250ZW50Q2hpbGQsIGFyZ3M6IFsndHJlZU5vZGVUZW1wbGF0ZScsIF0gfSxdLFxuJ3RyZWVOb2RlV3JhcHBlclRlbXBsYXRlJzogW3sgdHlwZTogQ29udGVudENoaWxkLCBhcmdzOiBbJ3RyZWVOb2RlV3JhcHBlclRlbXBsYXRlJywgXSB9LF0sXG4ndHJlZU5vZGVGdWxsVGVtcGxhdGUnOiBbeyB0eXBlOiBDb250ZW50Q2hpbGQsIGFyZ3M6IFsndHJlZU5vZGVGdWxsVGVtcGxhdGUnLCBdIH0sXSxcbid2aWV3cG9ydENvbXBvbmVudCc6IFt7IHR5cGU6IFZpZXdDaGlsZCwgYXJnczogWyd2aWV3cG9ydCcsIF0gfSxdLFxuJ25vZGVzJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ29wdGlvbnMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nZm9jdXNlZCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidzdGF0ZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbid0b2dnbGVFeHBhbmRlZCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nYWN0aXZhdGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2RlYWN0aXZhdGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2ZvY3VzJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidibHVyJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbid1cGRhdGVEYXRhJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidpbml0aWFsaXplZCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nbW92ZU5vZGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2NvcHlOb2RlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidsb2FkTm9kZUNoaWxkcmVuJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidjaGFuZ2VGaWx0ZXInOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2V2ZW50JzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidzdGF0ZUNoYW5nZSc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25LZXlkb3duJzogW3sgdHlwZTogSG9zdExpc3RlbmVyLCBhcmdzOiBbJ2tleWRvd24nLCBbJyRldmVudCddLCBdIH0sXSxcbidvbk1vdXNlZG93bic6IFt7IHR5cGU6IEhvc3RMaXN0ZW5lciwgYXJnczogWydtb3VzZWRvd24nLCBbJyRldmVudCddLCBdIH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==