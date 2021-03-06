var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { reaction } from 'mobx';
import { observable, computed, action } from 'mobx-angular';
var TreeNodeCollectionComponent = (function () {
    function TreeNodeCollectionComponent() {
        this._dispose = [];
    }
    Object.defineProperty(TreeNodeCollectionComponent.prototype, "nodes", {
        get: function () { return this._nodes; },
        set: function (nodes) { this.setNodes(nodes); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNodeCollectionComponent.prototype, "marginTop", {
        get: function () {
            var firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];
            var relativePosition = firstNode ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight() : 0;
            return relativePosition + "px";
        },
        enumerable: true,
        configurable: true
    });
    TreeNodeCollectionComponent.prototype.setNodes = function (nodes) {
        this._nodes = nodes;
    };
    TreeNodeCollectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.virtualScroll = this.treeModel.virtualScroll;
        this._dispose = [
            // return node indexes so we can compare structurally,
            reaction(function () {
                return _this.virtualScroll.getViewportNodes(_this.nodes).map(function (n) { return n.index; });
            }, function (nodeIndexes) {
                _this.viewportNodes = nodeIndexes.map(function (i) { return _this.nodes[i]; });
            }, { compareStructural: true, fireImmediately: true }),
            reaction(function () { return _this.nodes; }, function (nodes) {
                _this.viewportNodes = _this.virtualScroll.getViewportNodes(nodes);
            })
        ];
    };
    TreeNodeCollectionComponent.prototype.ngOnDestroy = function () {
        this._dispose.forEach(function (d) { return d(); });
    };
    TreeNodeCollectionComponent.prototype.trackNode = function (index, node) {
        return node.id;
    };
    TreeNodeCollectionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'tree-node-collection',
                    encapsulation: ViewEncapsulation.None,
                    template: "\n    <ng-container *mobxAutorun>\n      <div\n        [style.margin-top]=\"marginTop\">\n        <tree-node\n          *ngFor=\"let node of viewportNodes; let i = index; trackBy: trackNode\"\n          [node]=\"node\"\n          [index]=\"i\"\n          [templates]=\"templates\">\n        </tree-node>\n      </div>\n    </ng-container>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeNodeCollectionComponent.ctorParameters = function () { return []; };
    TreeNodeCollectionComponent.propDecorators = {
        'nodes': [{ type: Input },],
        'treeModel': [{ type: Input },],
        'templates': [{ type: Input },],
    };
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], TreeNodeCollectionComponent.prototype, "_nodes", void 0);
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], TreeNodeCollectionComponent.prototype, "viewportNodes", void 0);
    __decorate([
        computed,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], TreeNodeCollectionComponent.prototype, "marginTop", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeNodeCollectionComponent.prototype, "setNodes", null);
    return TreeNodeCollectionComponent;
}());
export { TreeNodeCollectionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS1jb2xsZWN0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFFLEtBQUEsRUFBTyxpQkFBQSxFQUNuQixNQUFNLGVBQUEsQ0FBZ0I7QUFDdkIsT0FBTyxFQUFFLFFBQUEsRUFBa0IsTUFBTyxNQUFBLENBQU87QUFDekMsT0FBTyxFQUFFLFVBQUEsRUFBWSxRQUFBLEVBQVUsTUFBQSxFQUFPLE1BQU8sY0FBQSxDQUFlO0FBTTVEO0lBQUE7UUFvQkUsYUFBUSxHQUFHLEVBQUUsQ0FBQztJQXlEaEIsQ0FBQztJQTNFQyxzQkFBSSw4Q0FBSzthQUFULGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ25DLFVBQVUsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FEUDtJQVd6QixzQkFBSSxrREFBUzthQUFiO1lBQ1IsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNGLElBQU0sZ0JBQWdCLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFM0gsTUFBTSxDQUFJLGdCQUFnQixPQUFJLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7SUFJTyw4Q0FBUSxHQUFSLFVBQVMsS0FBSztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsOENBQVEsR0FBUjtRQUFBLGlCQWNDO1FBYkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2Qsc0RBQXNEO1lBQ3RELFFBQVEsQ0FBQztnQkFDUCxNQUFNLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssRUFBUCxDQUFPLENBQUMsQ0FBQztZQUMzRSxDQUFDLEVBQUUsVUFBQyxXQUFXO2dCQUNYLEtBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7WUFDN0QsQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FDdEQ7WUFDRCxRQUFRLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLEVBQVYsQ0FBVSxFQUFFLFVBQUMsS0FBSztnQkFDL0IsS0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO0lBRUQsaURBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxFQUFFLEVBQUgsQ0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELCtDQUFTLEdBQVQsVUFBVSxLQUFLLEVBQUUsSUFBSTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUksc0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN4QixRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsUUFBUSxFQUFFLHdWQVlUO2lCQUNGLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwwQ0FBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNLLDBDQUFjLEdBQTJDO1FBQ2hFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzNCLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9CLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0tBQzlCLENBQUM7SUFyRVk7UUFBWCxVQUFVOzsrREFBUTtJQUlQO1FBQVgsVUFBVTs7c0VBQTJCO0lBRTVCO1FBQVQsUUFBUTs7O2dFQUtSO0lBSU87UUFBUCxNQUFNOzs7OytEQUVOO0lBcURILGtDQUFDO0NBN0VELEFBNkVDLElBQUE7U0E3RVksMkJBQTJCIiwiZmlsZSI6InRyZWUtbm9kZS1jb2xsZWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgT25Jbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyByZWFjdGlvbiwgYXV0b3J1biB9IGZyb20gJ21vYngnO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgY29tcHV0ZWQsIGFjdGlvbiB9IGZyb20gJ21vYngtYW5ndWxhcic7XG5pbXBvcnQgeyBUcmVlVmlydHVhbFNjcm9sbCB9IGZyb20gJy4uL21vZGVscy90cmVlLXZpcnR1YWwtc2Nyb2xsLm1vZGVsJztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XG5cblxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlQ29sbGVjdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgXG4gIGdldCBub2RlcygpIHsgcmV0dXJuIHRoaXMuX25vZGVzOyB9XG4gIHNldCBub2Rlcyhub2RlcykgeyB0aGlzLnNldE5vZGVzKG5vZGVzKTsgfVxuXG4gICB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcblxuICBAb2JzZXJ2YWJsZSBfbm9kZXM7XG4gIHByaXZhdGUgdmlydHVhbFNjcm9sbDogVHJlZVZpcnR1YWxTY3JvbGw7IC8vIENhbm5vdCBpbmplY3QgdGhpcywgYmVjYXVzZSB3ZSBtaWdodCBiZSBpbnNpZGUgdHJlZU5vZGVUZW1wbGF0ZUZ1bGxcbiAgIHRlbXBsYXRlcztcblxuICBAb2JzZXJ2YWJsZSB2aWV3cG9ydE5vZGVzOiBUcmVlTm9kZVtdO1xuXG4gIEBjb21wdXRlZCBnZXQgbWFyZ2luVG9wKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZmlyc3ROb2RlID0gdGhpcy52aWV3cG9ydE5vZGVzICYmIHRoaXMudmlld3BvcnROb2Rlcy5sZW5ndGggJiYgdGhpcy52aWV3cG9ydE5vZGVzWzBdO1xuICAgIGNvbnN0IHJlbGF0aXZlUG9zaXRpb24gPSBmaXJzdE5vZGUgPyBmaXJzdE5vZGUucG9zaXRpb24gLSBmaXJzdE5vZGUucGFyZW50LnBvc2l0aW9uIC0gZmlyc3ROb2RlLnBhcmVudC5nZXRTZWxmSGVpZ2h0KCkgOiAwO1xuXG4gICAgcmV0dXJuIGAke3JlbGF0aXZlUG9zaXRpb259cHhgO1xuICB9XG5cbiAgX2Rpc3Bvc2UgPSBbXTtcblxuICBAYWN0aW9uIHNldE5vZGVzKG5vZGVzKSB7XG4gICAgdGhpcy5fbm9kZXMgPSBub2RlcztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudmlydHVhbFNjcm9sbCA9IHRoaXMudHJlZU1vZGVsLnZpcnR1YWxTY3JvbGw7XG4gICAgdGhpcy5fZGlzcG9zZSA9IFtcbiAgICAgIC8vIHJldHVybiBub2RlIGluZGV4ZXMgc28gd2UgY2FuIGNvbXBhcmUgc3RydWN0dXJhbGx5LFxuICAgICAgcmVhY3Rpb24oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52aXJ0dWFsU2Nyb2xsLmdldFZpZXdwb3J0Tm9kZXModGhpcy5ub2RlcykubWFwKG4gPT4gbi5pbmRleCk7XG4gICAgICB9LCAobm9kZUluZGV4ZXMpID0+IHtcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0Tm9kZXMgPSBub2RlSW5kZXhlcy5tYXAoKGkpID0+IHRoaXMubm9kZXNbaV0pO1xuICAgICAgICB9LCB7IGNvbXBhcmVTdHJ1Y3R1cmFsOiB0cnVlLCBmaXJlSW1tZWRpYXRlbHk6IHRydWUgfVxuICAgICAgKSxcbiAgICAgIHJlYWN0aW9uKCgpID0+IHRoaXMubm9kZXMsIChub2RlcykgPT4ge1xuICAgICAgICB0aGlzLnZpZXdwb3J0Tm9kZXMgPSB0aGlzLnZpcnR1YWxTY3JvbGwuZ2V0Vmlld3BvcnROb2Rlcyhub2Rlcyk7XG4gICAgICB9KVxuICAgIF07XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kaXNwb3NlLmZvckVhY2goZCA9PiBkKCkpO1xuICB9XG5cbiAgdHJhY2tOb2RlKGluZGV4LCBub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuaWQ7XG4gIH1cblxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICBzZWxlY3RvcjogJ3RyZWUtbm9kZS1jb2xsZWN0aW9uJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICptb2J4QXV0b3J1bj5cbiAgICAgIDxkaXZcbiAgICAgICAgW3N0eWxlLm1hcmdpbi10b3BdPVwibWFyZ2luVG9wXCI+XG4gICAgICAgIDx0cmVlLW5vZGVcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgbm9kZSBvZiB2aWV3cG9ydE5vZGVzOyBsZXQgaSA9IGluZGV4OyB0cmFja0J5OiB0cmFja05vZGVcIlxuICAgICAgICAgIFtub2RlXT1cIm5vZGVcIlxuICAgICAgICAgIFtpbmRleF09XCJpXCJcbiAgICAgICAgICBbdGVtcGxhdGVzXT1cInRlbXBsYXRlc1wiPlxuICAgICAgICA8L3RyZWUtbm9kZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICBgXG59LCBdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICgpID0+ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gKCkgPT4gW1xuXTtcbnN0YXRpYyBwcm9wRGVjb3JhdG9yczoge1trZXk6IHN0cmluZ106IERlY29yYXRvckludm9jYXRpb25bXX0gPSB7XG4nbm9kZXMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndHJlZU1vZGVsJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ3RlbXBsYXRlcyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==