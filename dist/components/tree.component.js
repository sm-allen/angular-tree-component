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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBQSxFQUFPLE1BQUEsRUFBbUIsWUFBQSxFQUFjLFFBQUEsRUFDbkQsaUJBQWlCLEVBQUUsWUFBQSxFQUEyQixZQUFBLEVBQWMsU0FBQSxFQUM3RCxNQUFNLGVBQUEsQ0FBZ0I7QUFDdkIsT0FBTyxFQUFFLFNBQUEsRUFBVSxNQUFPLHNCQUFBLENBQXVCO0FBRWpELE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLHNDQUFBLENBQXVDO0FBSTFFLE9BQU8sS0FBSyxDQUFBLE1BQU8sUUFBQSxDQUFTO0FBRXBCLElBQUEscUJBQUEsRUFBVSxhQUFBLENBQVk7QUFHOUI7SUFxQ0UsdUJBQ1MsU0FBb0IsRUFDcEIsa0JBQXNDLEVBQ3JDLFFBQWtCO1FBSDVCLGlCQU9DO1FBTlEsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3JDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFFeEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLEVBQUUsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO1FBQ3hFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7SUFDeEUsQ0FBQztJQWhDQSxzQkFBSSxnQ0FBSztRQURWLGlDQUFpQzthQUNoQyxVQUFVLEtBQVksSUFBSSxDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFDNUIsc0JBQUksa0NBQU87YUFBWCxVQUFZLE9BQW9CLElBQUksQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRXRDLHNCQUFJ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QUksRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMvQixrQkFBa0IsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3ZDLGNBQWMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzVCLGFBQWEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ2xDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7UUFDdkUsYUFBYSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFHLEVBQUUsRUFBRTtLQUMxRSxDQUFDO0lBQ0Ysb0JBQUM7Q0FoS0QsQUFnS0MsSUFBQTtTQWhLWSxhQUFhIiwiZmlsZSI6InRyZWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyLFxuICBWaWV3RW5jYXBzdWxhdGlvbiwgQ29udGVudENoaWxkLCBUZW1wbGF0ZVJlZiwgSG9zdExpc3RlbmVyLCBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmVlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlTm9kZSB9IGZyb20gJy4uL21vZGVscy90cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZURyYWdnZWRFbGVtZW50IH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtZHJhZ2dlZC1lbGVtZW50Lm1vZGVsJztcbmltcG9ydCB7IFRyZWVPcHRpb25zIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlVmlld3BvcnRDb21wb25lbnQgfSBmcm9tICcuL3RyZWUtdmlld3BvcnQuY29tcG9uZW50JztcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCB7IGluY2x1ZGVzLCBwaWNrIH0gID0gXztcblxuXG5leHBvcnQgY2xhc3MgVHJlZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIF9ub2RlczogYW55W107XG4gIF9vcHRpb25zOiBUcmVlT3B0aW9ucztcblxuICAgbG9hZGluZ1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgdHJlZU5vZGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgIHRyZWVOb2RlV3JhcHBlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgdHJlZU5vZGVGdWxsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgIHZpZXdwb3J0Q29tcG9uZW50OiBUcmVlVmlld3BvcnRDb21wb25lbnQ7XG5cbiAgLy8gV2lsbCBiZSBoYW5kbGVkIGluIG5nT25DaGFuZ2VzXG4gICBzZXQgbm9kZXMobm9kZXM6IGFueVtdKSB7IH07XG4gICBzZXQgb3B0aW9ucyhvcHRpb25zOiBUcmVlT3B0aW9ucykgeyB9O1xuXG4gICBzZXQgZm9jdXNlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMudHJlZU1vZGVsLnNldEZvY3VzKHZhbHVlKTtcbiAgfVxuXG4gICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICB0aGlzLnRyZWVNb2RlbC5zZXRTdGF0ZShzdGF0ZSk7XG4gIH1cblxuICAgdG9nZ2xlRXhwYW5kZWQ7XG4gICBhY3RpdmF0ZTtcbiAgIGRlYWN0aXZhdGU7XG4gICBmb2N1cztcbiAgIGJsdXI7XG4gICB1cGRhdGVEYXRhO1xuICAgaW5pdGlhbGl6ZWQ7XG4gICBtb3ZlTm9kZTtcbiAgIGNvcHlOb2RlO1xuICAgbG9hZE5vZGVDaGlsZHJlbjtcbiAgIGNoYW5nZUZpbHRlcjtcbiAgIGV2ZW50O1xuICAgc3RhdGVDaGFuZ2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHRyZWVNb2RlbDogVHJlZU1vZGVsLFxuICAgIHB1YmxpYyB0cmVlRHJhZ2dlZEVsZW1lbnQ6IFRyZWVEcmFnZ2VkRWxlbWVudCxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcikge1xuXG4gICAgICB0cmVlTW9kZWwuZXZlbnROYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB0aGlzW25hbWVdID0gbmV3IEV2ZW50RW1pdHRlcigpKTtcbiAgICAgIHRyZWVNb2RlbC5zdWJzY3JpYmVUb1N0YXRlKChzdGF0ZSkgPT4gdGhpcy5zdGF0ZUNoYW5nZS5lbWl0KHN0YXRlKSk7XG4gIH1cblxuICBcbiAgb25LZXlkb3duKCRldmVudCkge1xuICAgIGlmICghdGhpcy50cmVlTW9kZWwuaXNGb2N1c2VkKSByZXR1cm47XG4gICAgaWYgKGluY2x1ZGVzKFsnaW5wdXQnLCAndGV4dGFyZWEnXSxcbiAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKSByZXR1cm47XG5cbiAgICBsZXQgZm9jdXNlZE5vZGUgPSB0aGlzLnRyZWVNb2RlbC5nZXRGb2N1c2VkTm9kZSgpO1xuXG4gICAgdGhpcy50cmVlTW9kZWwucGVyZm9ybUtleUFjdGlvbihmb2N1c2VkTm9kZSwgJGV2ZW50KTtcbiAgfVxuXG4gIFxuICBvbk1vdXNlZG93bigkZXZlbnQpIHtcbiAgICBjb25zdCBpbnNpZGVDbGljayA9IHRoaXMucmVuZGVyZXIuaW52b2tlRWxlbWVudE1ldGhvZCgkZXZlbnQudGFyZ2V0LCAnY2xvc2VzdCcsIFsnVHJlZSddKTtcbiAgICB0aGlzLnRyZWVNb2RlbC5zZXRPdXRsaW5lVmlzaWJsZShmYWxzZSk7XG4gICAgaWYgKCFpbnNpZGVDbGljaykge1xuICAgICAgdGhpcy50cmVlTW9kZWwuc2V0Rm9jdXMoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICB0aGlzLnRyZWVNb2RlbC5zZXREYXRhKHtcbiAgICAgIG9wdGlvbnM6IGNoYW5nZXMub3B0aW9ucyAmJiBjaGFuZ2VzLm9wdGlvbnMuY3VycmVudFZhbHVlLFxuICAgICAgbm9kZXM6IGNoYW5nZXMubm9kZXMgJiYgY2hhbmdlcy5ub2Rlcy5jdXJyZW50VmFsdWUsXG4gICAgICBldmVudHM6IHBpY2sodGhpcywgdGhpcy50cmVlTW9kZWwuZXZlbnROYW1lcylcbiAgICB9KTtcbiAgfVxuXG4gIHNpemVDaGFuZ2VkKCkge1xuICAgIHRoaXMudmlld3BvcnRDb21wb25lbnQuc2V0Vmlld3BvcnQoKTtcbiAgfVxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICBzZWxlY3RvcjogJ1RyZWUsIHRyZWUtcm9vdCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1RyZWVNb2RlbF0sXG4gIHN0eWxlczogW1xuICAgICcudHJlZS1jaGlsZHJlbiB7IHBhZGRpbmctbGVmdDogMjBweCB9JyxcbiAgICAnLmVtcHR5LXRyZWUtZHJvcC1zbG90IC5ub2RlLWRyb3Atc2xvdCB7IGhlaWdodDogMjBweDsgbWluLXdpZHRoOiAxMDBweCB9JyxcbiAgICBgLnRyZWUge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLyogaU9TIFNhZmFyaSAqL1xuICAgICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgICAvKiBDaHJvbWUvU2FmYXJpL09wZXJhICovXG4gICAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7ICAgIC8qIEtvbnF1ZXJvciAqL1xuICAgICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsgICAgICAvKiBGaXJlZm94ICovXG4gICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7ICAgICAgIC8qIElFL0VkZ2UgKi9cbiAgICAgIHVzZXItc2VsZWN0OiBub25lOyAgICAgICAgICAgLyogbm9uLXByZWZpeGVkIHZlcnNpb24sIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkIGJ5IGFueSBicm93c2VyICovXG4gICAgfWBcbiAgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dHJlZS12aWV3cG9ydCAjdmlld3BvcnQ+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwidHJlZVwiXG4gICAgICAgIHJvbGU9XCJ0cmVlXCJcbiAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgW2NsYXNzLm91dGxpbmUtbm9uZV09XCIhdHJlZU1vZGVsLmlzT3V0bGluZVZpc2libGUoKVwiXG4gICAgICAgIFtjbGFzcy5ub2RlLWRyYWdnaW5nXT1cInRyZWVEcmFnZ2VkRWxlbWVudC5pc0RyYWdnaW5nKClcIj5cbiAgICAgICAgPHRyZWUtbm9kZS1jb2xsZWN0aW9uXG4gICAgICAgICAgKm5nSWY9XCJ0cmVlTW9kZWwucm9vdHNcIlxuICAgICAgICAgIFtub2Rlc109XCJ0cmVlTW9kZWwucm9vdHNcIlxuICAgICAgICAgIFt0cmVlTW9kZWxdPVwidHJlZU1vZGVsXCJcbiAgICAgICAgICBbdGVtcGxhdGVzXT1cIntcbiAgICAgICAgICAgIGxvYWRpbmdUZW1wbGF0ZTogbG9hZGluZ1RlbXBsYXRlLFxuICAgICAgICAgICAgdHJlZU5vZGVUZW1wbGF0ZTogdHJlZU5vZGVUZW1wbGF0ZSxcbiAgICAgICAgICAgIHRyZWVOb2RlV3JhcHBlclRlbXBsYXRlOiB0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZSxcbiAgICAgICAgICAgIHRyZWVOb2RlRnVsbFRlbXBsYXRlOiB0cmVlTm9kZUZ1bGxUZW1wbGF0ZVxuICAgICAgICAgIH1cIj5cbiAgICAgICAgPC90cmVlLW5vZGUtY29sbGVjdGlvbj5cbiAgICAgICAgPHRyZWUtbm9kZS1kcm9wLXNsb3RcbiAgICAgICAgICBjbGFzcz1cImVtcHR5LXRyZWUtZHJvcC1zbG90XCJcbiAgICAgICAgICAqbmdJZj1cInRyZWVNb2RlbC5pc0VtcHR5VHJlZSgpXCJcbiAgICAgICAgICBbZHJvcEluZGV4XT1cIjBcIlxuICAgICAgICAgIFtub2RlXT1cInRyZWVNb2RlbC52aXJ0dWFsUm9vdFwiPlxuICAgICAgICA8L3RyZWUtbm9kZS1kcm9wLXNsb3Q+XG4gICAgICA8L2Rpdj5cbiAgICA8L3RyZWUtdmlld3BvcnQ+XG4gIGBcbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG57dHlwZTogVHJlZU1vZGVsLCB9LFxue3R5cGU6IFRyZWVEcmFnZ2VkRWxlbWVudCwgfSxcbnt0eXBlOiBSZW5kZXJlciwgfSxcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ2xvYWRpbmdUZW1wbGF0ZSc6IFt7IHR5cGU6IENvbnRlbnRDaGlsZCwgYXJnczogWydsb2FkaW5nVGVtcGxhdGUnLCBdIH0sXSxcbid0cmVlTm9kZVRlbXBsYXRlJzogW3sgdHlwZTogQ29udGVudENoaWxkLCBhcmdzOiBbJ3RyZWVOb2RlVGVtcGxhdGUnLCBdIH0sXSxcbid0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZSc6IFt7IHR5cGU6IENvbnRlbnRDaGlsZCwgYXJnczogWyd0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZScsIF0gfSxdLFxuJ3RyZWVOb2RlRnVsbFRlbXBsYXRlJzogW3sgdHlwZTogQ29udGVudENoaWxkLCBhcmdzOiBbJ3RyZWVOb2RlRnVsbFRlbXBsYXRlJywgXSB9LF0sXG4ndmlld3BvcnRDb21wb25lbnQnOiBbeyB0eXBlOiBWaWV3Q2hpbGQsIGFyZ3M6IFsndmlld3BvcnQnLCBdIH0sXSxcbidub2Rlcyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidvcHRpb25zJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ2ZvY3VzZWQnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nc3RhdGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndG9nZ2xlRXhwYW5kZWQnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2FjdGl2YXRlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidkZWFjdGl2YXRlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidmb2N1cyc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nYmx1cic6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4ndXBkYXRlRGF0YSc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4naW5pdGlhbGl6ZWQnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ21vdmVOb2RlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidjb3B5Tm9kZSc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nbG9hZE5vZGVDaGlsZHJlbic6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nY2hhbmdlRmlsdGVyJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidldmVudCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nc3RhdGVDaGFuZ2UnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ29uS2V5ZG93bic6IFt7IHR5cGU6IEhvc3RMaXN0ZW5lciwgYXJnczogWydrZXlkb3duJywgWyckZXZlbnQnXSwgXSB9LF0sXG4nb25Nb3VzZWRvd24nOiBbeyB0eXBlOiBIb3N0TGlzdGVuZXIsIGFyZ3M6IFsnbW91c2Vkb3duJywgWyckZXZlbnQnXSwgXSB9LF0sXG59O1xufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=